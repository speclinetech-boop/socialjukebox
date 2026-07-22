// Shared security helpers for /api/spotify/* token proxy endpoints.
import crypto from 'crypto';

export const DEFAULT_REDIRECT_URIS = ['socialjukebox://spotify-callback'];

/** @type {Map<string, { count: number, resetAt: number }>} */
const rateBuckets = new Map();

const CLEANUP_MS = 60_000;
if (typeof setInterval === 'function') {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of rateBuckets) {
      if (now > bucket.resetAt) rateBuckets.delete(key);
    }
  }, CLEANUP_MS);
  timer.unref?.();
}

export function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Api-Key, Authorization');
}

export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  if (typeof req.headers['x-real-ip'] === 'string') {
    return req.headers['x-real-ip'];
  }
  return req.socket?.remoteAddress || 'unknown';
}

/**
 * Best-effort in-memory rate limit (per serverless isolate).
 * Pair with Vercel Firewall for stronger protection.
 */
export function rateLimit(req, { limit, windowMs, keySuffix = '' }) {
  const key = `${getClientIp(req)}:${keySuffix}`;
  const now = Date.now();
  let bucket = rateBuckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
    rateBuckets.set(key, bucket);
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  return { ok: true };
}

export function timingSafeEqualString(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export function extractApiKey(req) {
  const header = req.headers['x-api-key'];
  if (typeof header === 'string' && header.length > 0) return header.trim();

  const auth = req.headers.authorization;
  if (typeof auth === 'string' && auth.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim();
  }

  // Query param so SPTAppRemote tokenSwapURL / tokenRefreshURL can authenticate
  // (the Spotify iOS SDK cannot set custom headers).
  const queryKey = req.query?.key;
  if (typeof queryKey === 'string' && queryKey.length > 0) return queryKey.trim();

  return null;
}

/**
 * Soft → hard rollout:
 * - If SPOTIFY_PROXY_API_KEY is unset, requests are allowed (rate limits still apply).
 * - Once set in Vercel, every caller must send the key (header or ?key=).
 */
export function requireApiKeyIfConfigured(req, res) {
  const expected = process.env.SPOTIFY_PROXY_API_KEY;
  if (!expected) return true;

  const provided = extractApiKey(req);
  if (!provided || !timingSafeEqualString(provided, expected)) {
    res.status(401).json({ error: 'unauthorized' });
    return false;
  }
  return true;
}

export function allowedRedirectUris() {
  const fromEnv = (process.env.SPOTIFY_REDIRECT_URIS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return fromEnv.length > 0 ? fromEnv : DEFAULT_REDIRECT_URIS;
}

export function isAllowedRedirectUri(uri) {
  if (typeof uri !== 'string' || !uri) return false;
  return allowedRedirectUris().includes(uri);
}

export function parseBody(req) {
  const body = req.body;
  if (!body) return {};
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body;
}

export function handlePreflight(req, res) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

export function methodNotAllowed(res) {
  return res.status(405).json({ error: 'Method not allowed' });
}
