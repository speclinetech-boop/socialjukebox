// POST /api/spotify/refresh
// Refreshes an expired access token using a refresh token.
//
// Accepts JSON { refresh_token } (app) or form-urlencoded refresh_token
// (Spotify iOS SDK tokenRefreshURL).
//
// Environment variables (Vercel dashboard):
//   SPOTIFY_CLIENT_ID       (required)
//   SPOTIFY_CLIENT_SECRET   (required)
//   SPOTIFY_PROXY_API_KEY   (optional → required once set; soft→hard rollout)

import {
  setCors,
  handlePreflight,
  methodNotAllowed,
  requireApiKeyIfConfigured,
  rateLimit,
  parseBody,
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

  const limit = rateLimit(req, {
    limit: 60,
    windowMs: 15 * 60 * 1000,
    keySuffix: 'refresh',
  });
  if (!limit.ok) {
    res.setHeader('Retry-After', String(limit.retryAfterSec));
    return res.status(429).json({ error: 'rate_limit_exceeded' });
  }

  const { refresh_token } = parseBody(req);

  if (!refresh_token) {
    return res.status(400).json({ error: 'Missing refresh_token' });
  }

  const authHeader =
    'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  const spotifyBody = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token,
  });

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
    return res.status(500).json({ error: 'Token refresh failed' });
  }
}
