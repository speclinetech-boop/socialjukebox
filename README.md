# Social Jukebox — Website

Marketing site and Spotify OAuth token proxy for [Social Jukebox](https://socialjukebox.app), the democratic DJ app from [SPECLINE TECH LLC](https://specline.co).

## Live site

[socialjukebox.app](https://socialjukebox.app)

**App Store:** [Social Jukebox](https://apps.apple.com/us/app/social-jukebox/id6758019735) (ID `6758019735`)

## Structure

```
socialjukebox/
├── index.html              # Landing page
├── road-trip.html          # SEO → /road-trip
├── house-party.html        # SEO → /house-party
├── beach.html              # SEO → /beach
├── host-playbook.html      # SEO → /host-playbook
├── support.html            # FAQ + Chatbase
├── privacy.html / terms.html / copyright.html
├── js/analytics.js         # App Store click → Vercel event
├── marketing/seed-posts.txt
├── robots.txt / sitemap.xml
├── vercel.json             # Clean URLs, headers, caching
├── images/
├── lib/spotifyProxySecurity.js
├── api/spotify/
└── README.md
```

The native iOS / iPadOS / Mac app lives in a separate repo: `speclinetech-boop/social-jukebox`.

## Tech stack

- **Hosting:** Vercel
- **DNS / edge:** Cloudflare
- **Site:** Static HTML + Tailwind CSS (CDN)
- **Analytics:** Vercel Analytics & Speed Insights (`app_store_click` via `js/analytics.js`)
- **Support widget:** Chatbase (no extra bots needed for acquisition)
- **API:** Vercel Serverless Functions (`api/spotify/*`)

## Spotify token proxy

The iOS app never embeds the Spotify client secret. Token swap and refresh go through:

| Endpoint | Purpose |
|----------|---------|
| `POST /api/spotify/token` | Authorization-code exchange (DJ login) or client-credentials (guest search). Also accepts Spotify SDK form bodies (`code` only). |
| `POST /api/spotify/refresh` | Refresh-token exchange (app JSON or SDK form body). |

### Environment variables

Set these in the Vercel project (see `.env.example`):

| Variable | Required | Notes |
|----------|----------|--------|
| `SPOTIFY_CLIENT_ID` | Yes | Spotify app client ID |
| `SPOTIFY_CLIENT_SECRET` | Yes | Spotify app client secret |
| `SPOTIFY_PROXY_API_KEY` | Recommended | Once set, all callers must send the key |
| `SPOTIFY_REDIRECT_URIS` | Optional | Comma-separated allowlist; default `socialjukebox://spotify-callback` |

### Soft → hard API key rollout

1. Deploy this site (rate limits + redirect allowlist apply immediately).
2. Ship an iOS build that sends `X-Api-Key` / `?key=` (see `SpotifyAuthManager.proxyAPIKey` in the app repo).
3. Set `SPOTIFY_PROXY_API_KEY` in Vercel to the **same** value to enforce authentication.

Until step 3, the proxy stays compatible with older app builds. After step 3, unauthenticated calls receive `401`.

Callers may send the key as:

- Header: `X-Api-Key: <key>`
- Header: `Authorization: Bearer <key>`
- Query: `?key=<key>` (required for Spotify iOS SDK `tokenSwapURL` / `tokenRefreshURL`, which cannot set custom headers)

### Other protections

- Redirect URI allowlist (rejects unexpected `redirect_uri` values)
- Per-IP rate limits (best-effort in-memory; add [Vercel Firewall](https://vercel.com/docs/security/vercel-firewall) for stronger limits)
- No internal exception messages returned to clients

## Parent company

[SPECLINE TECH LLC](https://specline.co)

## License

© 2026 SPECLINE TECH LLC. All rights reserved.
