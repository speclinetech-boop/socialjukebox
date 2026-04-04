// POST /api/spotify/token
// Exchanges an authorization code for access + refresh tokens (Authorization Code flow)
// OR returns an app-level token for guest search (Client Credentials flow)
//
// Environment variables required (set in Vercel dashboard):
//   SPOTIFY_CLIENT_ID
//   SPOTIFY_CLIENT_SECRET

export default async function handler(req, res) {
  // CORS headers for iOS app
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return res.status(500).json({ error: 'Server misconfigured: missing Spotify credentials' });
  }

  const { grant_type, code, redirect_uri, code_verifier } = req.body;

  if (!grant_type) {
    return res.status(400).json({ error: 'Missing grant_type' });
  }

  const authHeader = 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  let body;

  if (grant_type === 'authorization_code') {
    // DJ login: exchange auth code for tokens
    if (!code || !redirect_uri) {
      return res.status(400).json({ error: 'Missing code or redirect_uri' });
    }
    body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri,
    });
    // Include code_verifier if PKCE is used
    if (code_verifier) {
      body.append('code_verifier', code_verifier);
    }
  } else if (grant_type === 'client_credentials') {
    // Guest search: app-level token, no user context
    body = new URLSearchParams({
      grant_type: 'client_credentials',
    });
  } else {
    return res.status(400).json({ error: 'Unsupported grant_type' });
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Token exchange failed', details: error.message });
  }
}
