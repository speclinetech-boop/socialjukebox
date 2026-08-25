# Specline Marketing Machine — Agent Starter Brief

Updated: 2026-08-23  
Purpose: Onboard a fresh Cursor agent with full context. Read this entire file before doing anything.

---

## Mission

Build and run a **repeatable marketing machine** for Specline products:

1. **Social Jukebox** (live now) — democratic DJ app, iOS/Mac
2. **PackLog** (coming) — puppy activity tracker
3. **UYSPFG / SuperPowers** (eventually) — Use Your Superpowers For Good

Goals: consistent daily social posts, high-quality copy + visuals, minimal weekly manual work, no repetitive messaging fatigue.

---

## Decisions already made (do not re-litigate)

| Decision | Choice | Why |
|----------|--------|-----|
| Scheduling tool | **Buffer** (not Later, Hootsuite, etc.) | Already connected; phil@specline.co used it before |
| Agent stack | **Cursor + Buffer MCP** | Has repo context, queue visibility, avoids duplicates |
| NOT using | Grokbot, standalone Qwen bot, random LLM schedulers | No queue awareness, no asset paths, inconsistent quality |
| Support bot | Chatbase (on site) | Separate from marketing; don't conflate |
| Architecture | **`specline-marketing` repo** + product repos for deployed assets | One automation home; copy/calendars centralized |
| Buffer org | **One org**, all brands/channels | One MCP, one Sunday refill, tags/names per brand |
| Upgrade path | **Buffer Essentials** when PackLog + UYSPFG join (~$30–36/mo for ~6 channels) | Free = 10 posts/channel; Essentials = unlimited queue |
| IG links | First comment, not caption | IG algorithm / UX |
| FB links | In post body | Facebook allows it |
| Reels | **MP4 only**, not PNG | Convert with ffmpeg or upload manually |
| Copy rule | **No em dashes** (use comma, period, hyphen with spaces) | Repo rule |
| Reddit | Follow `seed-posts.txt` rules only | Cold promo gets banned; r/SideProject etc. |

---

## Current state (Social Jukebox)

### Product

- Site: https://socialjukebox.app
- App Store: https://apps.apple.com/us/app/social-jukebox/id6758019735
- Landing pages: `/road-trip`, `/house-party`, `/beach`, `/host-playbook`
- Instagram: @socialjukeboxapp
- Facebook page: Social Jukebox app

### Buffer MCP (working)

- Config: `~/.cursor/mcp.json` → `{ "buffer": { "url": "https://mcp.buffer.com/mcp" } }`
- Connect via Cursor desktop: **Customize → MCPs** (NOT cursor.com dashboard settings)
- After config change: quit/reopen Cursor, new chat, OAuth Buffer

**Org:** My Organization · `6a8a72d26979408f6e9cfb1f` · phil@specline.co · America/New_York

**Channel IDs:**

| Channel | ID |
|---------|-----|
| IG socialjukeboxapp | `6a8a7363ccaf649a67fc26c2` |
| FB Social Jukebox app | `6a8a7932ccaf649a67fc7ad0` |
| FB SuperPowers Movement | `6a8a7932ccaf649a67fc7ad1` |

**MCP workflow:** `get_account` → `list_channels` → `list_posts` → `create_post` / `create_idea` / `edit_post`

**Critical:** `create_post` needs **public image/video URLs**. Local files in `marketing/ig/` are NOT usable until uploaded to Buffer UI or deployed to a public URL.

### Already scheduled in Buffer (do NOT duplicate on IG)

**Instagram (4):**
- Sun Aug 23 9:11 PM — Story: one aux
- Sun Aug 23 10:27 PM — Feed: house party / crowd votes
- Mon Aug 24 6:22 PM — Reel: Aruba origin
- Mon Aug 24 8:19 PM — Reel: hog the aux

**Facebook Social Jukebox (6):**
- Sun Aug 23 9:27 AM — Origin + beach → /beach
- Sun Aug 23 10:14 AM — Road trip → /road-trip
- Mon Aug 24 6:35 AM — House party → /house-party
- Mon Aug 24 7:19 AM — Host playbook → /host-playbook
- Tue Aug 25 7:48 AM — Queue demo → App Store
- Tue Aug 25 8:32 AM — App home CTA → App Store

**Buffer Ideas saved:** Spotify screenshot post, og-image launch post, manual reel MP4 upload reminder.

Always run `list_posts` with `status: scheduled` before adding more.

### Assets

**Hosted (auto-schedule via MCP):**  
`https://socialjukebox.app/images/` — beach-origin.jpg, screenshot-2/3/5/6, app-queue.jpg, app-home.jpg, og-image.png

**Local product repo** (`socialjukebox/marketing/ig/`):
- PNG graphics: ig-feed-hog-the-aux, ig-origin-aruba, ig-story-one-aux, ig-carousel-crowd-votes
- MP4 reels (`marketing/ig/reels/`): ig-origin-reel, ig-hog-the-aux-reel, ig-one-aux-reel

**Copy source:** `socialjukebox/marketing/seed-posts.txt`

---

## Content strategy (rotation engine)

Never repeat the same **pillar** back-to-back on feed. Stories can be punchier and more repetitive (24h TTL).

| Pillar | Frequency | Example |
|--------|-----------|---------|
| Pain | 1×/week | One person. One aux. Everyone mad. |
| Scene | 1×/week each max | Road trip OR house party OR beach (rotate) |
| How it works | 1×/week | PIN join. Vote. Queue reorders. |
| Utility | 1×/week | Host checklist, Local Network Allow |
| Origin | Max 1×/week | Aruba story |
| CTA | 1×/week | App Store download |

IG still needs varied angles even if assets overlap themes already scheduled.

---

## The plan (phases)

### Phase 1 — Now (Social Jukebox live)

- [x] Buffer MCP connected
- [x] First IG + FB batch scheduled
- [x] Reels converted to MP4
- [x] Agent brief written
- [ ] Create **`specline-marketing`** repo (marketing machine home)
- [ ] Migrate/copy strategy docs from `socialjukebox/marketing/`
- [ ] Schedule remaining IG posts (utility, road trip, app home) without duplicating queue
- [ ] Fix/deploy reel MP4s to public URL OR document manual upload workflow
- [ ] User: skim Buffer queue before posts go live

### Phase 2 — Buffer Essentials + automation

- [ ] Upgrade Buffer Essentials (~$6/channel/mo)
- [ ] Connect PackLog channels when app ships
- [ ] Create **Sunday 9 AM ET Cursor Automation** in specline-marketing repo:
  - Read brand folders + weekly-playbook
  - Check all channel queues via Buffer MCP
  - Schedule 7–14 days per channel, rotate pillars
  - Save reel uploads as Ideas when URLs unavailable
  - Report summary to user
- [ ] User weekly ritual: ~5 min approve queue + upload any MP4s

### Phase 3 — Multi-brand

- [ ] Add `brands/packlog/` and `brands/uyspfg/` to marketing repo
- [ ] Each brand: seed-posts, channels.json (Buffer IDs, site URLs, App Store links), content-pillars.md
- [ ] Product repos keep deployed images only; marketing repo holds copy + calendars
- [ ] One Sunday automation refills all brands

---

## Target repo structure: `specline-marketing`

```
specline-marketing/
  README.md
  AGENT-BRIEF.md              ← this file (or symlink/copy)
  shared/
    weekly-playbook.md        ← pillar rotation, platform rules, no-go list
    automation-prompt.md      ← Sunday agent instructions
  brands/
    social-jukebox/
      seed-posts.txt
      channels.json           ← Buffer IDs, handles, links
      content-pillars.md
      asset-urls.json         ← hosted image map per product site
    packlog/
      seed-posts.txt
      channels.json
      content-pillars.md
    uyspfg/
      seed-posts.txt
      channels.json
      content-pillars.md
  calendar/
    2026-Q3.md                ← optional week-by-week plan
```

**Product repos** (socialjukebox, packlog, etc.) keep:
- `images/` deployed to product site
- `marketing/ig/` local creatives and reels
- Landing pages

**Do NOT** duplicate screenshots in marketing repo. Reference hosted URLs.

---

## Buffer plan limits reference

| Plan | Scheduled posts | Channels | Cost |
|------|-----------------|----------|------|
| Free | 10 per channel | 3 connected | $0 |
| Essentials | Unlimited (5k fair use/channel) | Unlimited, pay per channel | $6/mo/channel (or $5 annual) |
| Team | Same + team features | Same | $12/mo/channel |

6 channels (3 apps × IG+FB) ≈ **$36/mo** Essentials monthly.

---

## Lessons from first Reddit post (low engagement)

- Text-only posts get skipped; need image or short video
- Lead with product (PIN, vote, queue) not long story in preview
- Don't put pricing early in Reddit bullets
- One feedback question beats three
- r/SideProject alone is not enough; adjacent subs with visuals work better

These lessons apply to IG/FB too: **visual first, rotate angles, don't repeat hooks**.

---

## Automation prompt template (for Sunday Cursor Automation)

Save as `shared/automation-prompt.md` when repo exists:

```text
You are the Specline marketing refill agent. Run every Sunday.

1. Read shared/weekly-playbook.md and each brands/*/seed-posts.txt + channels.json
2. Call Buffer MCP: get_account, list_channels, list_posts (scheduled) for each brand
3. For each channel with fewer than 7 days of posts queued:
   - Pick next pillar in rotation (never duplicate pillar scheduled in last 7 days on same channel)
   - Use asset-urls.json hosted URLs only for create_post
   - IG: links in text sparingly; note "first comment: URL" in post note or separate Ideas entry
   - FB: include link in post body
   - Local MP4 reels → create_idea with upload instructions
4. Do NOT duplicate themes already in queue (check list_posts first)
5. Output summary table: channel, posts added, schedule dates, manual actions needed
6. Never use em dashes in copy
```

---

## Related files in socialjukebox repo (migrate or reference)

| Path | Contents |
|------|----------|
| `marketing/seed-posts.txt` | IG, FB, Reddit copy templates |
| `marketing/AGENT-BRIEF.md` | This file |
| `marketing/ig/` | PNG + MP4 creatives |
| `images/` | Deployed site assets |

---

## New agent: first session checklist

When user opens specline-marketing (or continues in socialjukebox until repo exists):

1. Read this brief completely
2. Verify Buffer MCP: `get_account`, `list_channels`, `list_posts`
3. Confirm scheduled queue matches expectations; flag anything missing
4. Scaffold specline-marketing repo if not exists
5. Copy/migrate seed-posts and create brand folder structure
6. Draft `shared/weekly-playbook.md` and `shared/automation-prompt.md`
7. Schedule next IG posts (non-duplicate pillars) OR create Sunday Automation draft
8. Do not commit unless user asks

---

## User intent

Phil is building a **marketing machine** that runs weekly with minimal effort. Quality bar = the first batch of posts (Aruba origin, hog the aux, host playbook utility, scene-specific angles). Tired; wants next agent to **start smart** without re-explaining Buffer, rotation, architecture, or what's already scheduled.
