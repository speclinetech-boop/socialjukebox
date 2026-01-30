# CLAUDE_CONTEXT.md
# Shared Context for Claude Assistants
# Last Updated: January 30, 2026

This document helps keep Desktop Claude (claude.ai) and Xcode Claude in sync. Update this file when making decisions that affect both website and app development.

---

## PROJECT OVERVIEW

**App:** Social Jukebox
**Company:** SPECLINE TECH LLC (named after kids: Spencer, Claire, Liam, Neyden)
**Developer:** Phil Calzadilla
**Status:** LIVE on App Store as of January 2026

**What it does:** Democratic DJ app - one person hosts music (DJ), others join via PIN and vote on songs. Best songs rise to the top. Works with Apple Music.

**Origin Story:** Born on the beach in Aruba, 2025. The idea came from watching one person struggle to DJ while everyone complained about song choices. "Music should be a conversation, not a monologue."

---

## PENDING CODE CHANGES (FOR XCODE CLAUDE)

### 1. PIN Entry Helper Text (HIGH PRIORITY)
**File:** ContentView.swift
**Location:** PIN entry view, below "4-digit code" text
**Add this line:**
```swift
Text("Ask the DJ for the 4-digit code")
    .font(.caption)
    .foregroundColor(.gray)
```
**Why:** Phil's 68-year-old cousin couldn't figure out that he needed a PIN from someone hosting a party. Users don't understand they need a DJ to give them the code.

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

---

## CURRENT APP VERSION

- **App Store:** 1.1 (live)
- **TestFlight:** 1.4.1
- **Xcode project:** 1.4.1

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
git commit -m "Add shared context doc for Claude assistants"
git push
```

---

## NOTES

- Desktop Claude and Xcode Claude don't share memory (yet)
- Feature request submitted to Anthropic to fix this
- This document is our workaround until they build unified context
