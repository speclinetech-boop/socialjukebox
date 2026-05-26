# CLAUDE_CONTEXT.md
# Shared Context for Claude Assistants
# Last Updated: May 26, 2026

This document helps keep Desktop Claude (claude.ai) and Xcode Claude in sync. Update this file when making decisions that affect both website and app development.

---

## PROJECT OVERVIEW

**App:** Social Jukebox
**Company:** SPECLINE TECH LLC (named after kids: Spencer, Claire, Liam, Neyden)
**Developer:** Phil Calzadilla
**Status:** LIVE on App Store as of January 2026

**What it does:** Democratic DJ app - one person hosts music (DJ), others join via PIN and vote on songs. Best songs rise to the top. Works with Apple Music (and Spotify in the upcoming release).

**Origin Story:** Born on the beach in Aruba, 2025. The idea came from watching one person struggle to DJ while everyone complained about song choices. "Music should be a conversation, not a monologue."

---

## 🚨 CURRENT RELEASE PRIORITY (May 2026)

**Goal:** Get the next version submitted to TestFlight and then the App Store.

**Version:** ~3.0 or 3.1 (big version jump from 1.7 to reflect the Spotify edition — confirm exact number in Xcode)

**Status:** Code is done and has been family-tested. NOT yet submitted to TestFlight.
The code was pushed to GitHub via Xcode source control, but the app was never archived and uploaded to App Store Connect. That still needs to happen.

**Must fix before submitting:**
1. ✅ PIN Entry Helper Text (see below — may already be done, verify)
2. 🔴 HOST BACKGROUNDING DISCONNECT BUG (see below — HIGH PRIORITY, must fix before release)

**New features are being held for the release AFTER this one.**

---

## 🔴 PENDING CODE CHANGES (FOR XCODE CLAUDE)

### 1. HOST BACKGROUNDING DISCONNECT BUG — MUST FIX BEFORE RELEASE
**Symptom:** When Phil (the DJ/host) navigates away from the Social Jukebox app (e.g., switches to another app or locks the phone), guests get disconnected from the session.

**Tested:** May 2026 family session. Phil was the only one on the latest version; others were on older versions. Disconnect happened when host left the app.

**Root cause (likely):** Multipeer Connectivity (MCSession) does not automatically stay alive when the app is backgrounded. iOS suspends the app and the peer session drops.

**Suggested fix approach for Xcode Claude:**
- Use `UIApplication.shared.beginBackgroundTask(withName:expirationHandler:)` to request extra background execution time when the app moves to background
- Implement `applicationDidEnterBackground` / `sceneDidEnterBackground` to start a background task that keeps the MCSession alive
- Consider using the existing background audio capability (already enabled) as an anchor to prevent full app suspension while a DJ session is active
- Implement reconnection logic on the guest side so if a brief drop occurs, guests auto-rejoin without manual intervention
- Test by: starting a session, having guests join, then switching apps on the host device — guests should stay connected

**Files to investigate:**
- Whatever file manages the MCSession / Multipeer Connectivity setup
- AppDelegate or SceneDelegate for background lifecycle hooks

---

### 2. PIN Entry Helper Text
**File:** ContentView.swift
**Location:** PIN entry view, below "4-digit code" text
**Add this line:**
```swift
Text("Ask the DJ for the 4-digit code")
    .font(.caption)
    .foregroundColor(.gray)
```
**Why:** Phil's 68-year-old cousin couldn't figure out that he needed a PIN from someone hosting a party. Users don't understand they need a DJ to give them the code.

**Note:** This may already be implemented — verify before adding again.

---

## HOW TO SUBMIT TO TESTFLIGHT (REMINDER)

Pushing to GitHub does NOT submit to TestFlight. You must:
1. In Xcode: confirm the version number (~3.0 or 3.1) and increment the Build Number
2. Set scheme to "Any iOS Device (arm64)" (not a simulator)
3. **Product → Archive**
4. In Organizer: **Distribute App → App Store Connect → Upload**
5. Go to appstoreconnect.apple.com → TestFlight → add build to test group

Also add this to Info.plist to avoid export compliance delays:
```xml
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

---

## RECENT WEBSITE CHANGES (January 30, 2026)

1. **Added "Born on the Beach" origin story section** with actual photo from Aruba trip
2. **Updated download button:** "Download for iOS" → "Download for iPhone, iPad & Mac"
3. **Added 4th feature card:** "iPhone, iPad & Mac" - app works on Apple Silicon Macs!
4. **Updated subheading:** Added "office parties" to the list of use cases
5. **Fixed grid layout:** Changed from 3-column to 4-column grid for feature cards
6. **Fixed year:** Origin story says "Aruba, 2025" (not 2024)

---

## APP DISTRIBUTION

The app runs on:
- ✅ iPhone
- ✅ iPad  
- ✅ Mac (Apple Silicon) - discovered Jan 30, works great without any extra work!

Phil tested DJ Pro purchase on Mac - works perfectly, UI not awkward at all.

---

## KEY FEATURES

- **DJ Pro** ($1.99 in-app purchase) - unlocks hosting
- **Guest mode** - free, join via 4-digit PIN
- **Democratic voting** - upvote/downvote songs
- **VIP Super Votes** - boost songs to top
- **Background audio** - music keeps playing when app backgrounded
- **Session persistence** - can resume interrupted DJ sessions
- **Multipeer Connectivity** - works without internet, just WiFi
- **Spotify support** - coming in this release (the version jump reason)

---

## CURRENT APP VERSION

- **App Store:** 1.7 (live)
- **TestFlight:** 1.7 (live) — next version NOT yet submitted
- **Xcode project:** ~3.0 or 3.1 — confirm exact number in Xcode

---

## CONTACTS & LINKS

- **Website:** https://socialjukebox.app
- **Support:** support@socialjukebox.app
- **App Store:** https://apps.apple.com/us/app/social-jukebox/id6758019735
- **GitHub (website):** speclinetech-boop/socialjukebox
- **GitHub (iOS):** speclinetech-boop/social-jukebox

---

## HOW TO USE THIS DOCUMENT

**Desktop Claude:** Update this when making decisions about features, UX changes, or anything Xcode Claude needs to know.

**Xcode Claude:** Check this file at the start of sessions for pending code changes. Update the "PENDING CODE CHANGES" section when completing tasks.

**Phil:** Commit this file to the iOS repo so Xcode Claude can see it:
```bash
git add CLAUDE_CONTEXT.md
git commit -m "Update shared context doc"
git push
```

---

## NOTES

- Desktop Claude and Xcode Claude don't share memory (yet)
- Feature request submitted to Anthropic to fix this
- This document is our workaround until they build unified context
