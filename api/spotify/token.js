// POST /api/spotify/token
// Exchanges an authorization code for access + refresh tokens (Authorization Code flow)
// OR returns an app-level token for guest search (Client Credentials flow).
//
// Also accepts Spotify iOS SDK token-swap form bodies: { code } (x-www-form-urlencoded).
//
// Environment variables (Vercel dashboard):
//   SPOTIFY_CLIENT_ID       (required)
//   SPOTIFY_CLIENT_SECRET   (required)
//   SPOTIFY_PROXY_API_KEY   (optional → required once set; soft→hard rollout)
//   SPOTIFY_REDIRECT_URIS   (optional comma-separated allowlist; default socialjukebox://spotify-callback)

import {
  setCors,
  handlePreflight,
  methodNotAllowed,
  requireApiKeyIfConfigured,
  rateLimit,
  parseBody,
  isAllowedRedirectUri,
  allowedRedirectUris,
} from '../../lib/spotifyProxySecurity.js';

export default async function handler(req, res) {
  setCors(res);

  if (handlePreflight(req, res)) return;
  if (req.method !== 'POST') return methodNotAllowed(res);
  if (!requireApiKeyIfConfigured(req, res)) return;

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return res.status(500).json({ error: 'Server misconfigured: missing Spotify credentials' });
  }

  const body = parseBody(req);
  let { grant_type, code, redirect_uri, code_verifier } = body;

  // Spotify iOS SDK tokenSwapURL posts only `code` (form-urlencoded).
  if (!grant_type && code) {
    grant_type = 'authorization_code';
    redirect_uri = redirect_uri || allowedRedirectUris()[0];
  }

  if (!grant_type) {
    return res.status(400).json({ error: 'Missing grant_type' });
  }

  const isClientCredentials = grant_type === 'client_credentials';
  const limit = rateLimit(req, {
    limit: isClientCredentials ? 30 : 60,
    windowMs: 15 * 60 * 1000,
    keySuffix: isClientCredentials ? 'cc' : 'token',
  });
  if (!limit.ok) {
    res.setHeader('Retry-After', String(limit.retryAfterSec));
    return res.status(429).json({ error: 'rate_limit_exceeded' });
  }

  const authHeader =
    'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  let spotifyBody;

  if (grant_type === 'authorization_code') {
    if (!code || !redirect_uri) {
      return res.status(400).json({ error: 'Missing code or redirect_uri' });
    }
    if (!isAllowedRedirectUri(redirect_uri)) {
      return res.status(400).json({ error: 'redirect_uri not allowed' });
    }
    spotifyBody = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri,
    });
    if (code_verifier) {
      spotifyBody.append('code_verifier', code_verifier);
    }
  } else if (grant_type === 'client_credentials') {
    // Guest search: app-level token, no user context.
    // Prefer requiring SPOTIFY_PROXY_API_KEY in production. This grant is the
    // main public abuse vector when the proxy is open.
    spotifyBody = new URLSearchParams({
      grant_type: 'client_credentials',
    });
  } else {
    return res.status(400).json({ error: 'Unsupported grant_type' });
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: spotifyBody.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ error: 'Token exchange failed' });
  }
}
