# MARQUEE – Vistora Enhancements Implementation Status

## Phase 1 – Backup and Architecture Inspection (COMPLETE)

### Original main commit SHA
`2b6771a378d312c1df4c3e276cb0afc0a0e96549`

### Backup branch
- Branch: `backup/pre-vistora-enhancements`
- Points to: `2b6771a378d312c1df4c3e276cb0afc0a0e96549`
- Verified: Yes
- Created: 2026-11-11

### Architecture summary
Static SPA/PWA. Firebase Auth (Google) + Firestore. Monolithic app reconstructed from part00.txt–partN.txt by index.html bootstrap. Vanilla JS. TMDB + optional OMDb.

### Implementation decisions
1. Keep exclusive `status: 'towatch'|'watched'`. Add independent `favourite: boolean` (default false) with safe migration.
2. Re-split full app after edits into ~4 KB parts; update `n` in index.html.
3. Feature branches per phase; merge only after verification.

## Phase 2 – Login redesign (IN PROGRESS)

### Changes prepared (local full_app.html + re-split)
- Auth overlay: deep near-black (#0a0a0c) with subtle gold radial gradients.
- Welcome card: refined gradient, gold border, inset highlight, larger MARQUEE logo.
- Messaging:
  - Tagline: "Your Vistora of movies & series."
  - Headline: "A world of stories"
  - Supporting: "collected, curated and remembered."
- Feature list restyled with gold ✦ markers.
- Google button: refined hover/active transitions.
- Main header tagline also updated to Vistora line.
- Parts increased from 34 → 35; index.html `n = 35`.
- index.html pushed to `feature/phase2-login-redesign` (commit d7416846…).
- Remaining: push part00–part34 content to the feature branch, then verify reconstruct, merge to main.

### Exact next action
Push remaining redesigned part*.txt files to `feature/phase2-login-redesign`, verify the app loads and login UI shows Vistora copy, then merge Phase 2 to main and proceed to Phase 3 (collection favourite flag).

## Pending
Phase 3–8 as originally specified.

## Tests so far
- Backup SHA match: PASS
- Reconstruct of local full_app after split: PASS
