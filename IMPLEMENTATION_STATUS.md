# MARQUEE – Vistora Enhancements Implementation Status

## Phase 1 – Backup and Architecture Inspection (COMPLETE)

### Original main commit SHA
`2b6771a378d312c1df4c3e276cb0afc0a0e96549`

### Backup branch
- Branch: `backup/pre-vistora-enhancements`
- Points to: `2b6771a378d312c1df4c3e276cb0afc0a0e96549`
- Verified: Yes (remote ref exists and matches original main SHA)
- Created: 2026-11-11

### Architecture and technology stack
- **Type**: Static single-page application (SPA) / Progressive Web App (PWA)
- **Hosting**: GitHub Pages compatible
- **Auth**: Firebase Authentication (Google sign-in)
- **Database**: Cloud Firestore (users/{uid} document stores movies array + settings)
- **Local storage**: localStorage for API keys, recent views, region, etc.
- **Metadata**: TMDB API (primary), optional OMDb for IMDb ratings
- **Code structure**: Monolithic HTML+CSS+JS reconstructed at runtime from `part00.txt` … `part33.txt` (each ~4 KB). Bootstrap in `index.html` fetches and joins parts, then `document.write`s the full app.
- **Service worker**: `sw.js`
- **No traditional backend / Node / framework**. Pure vanilla JS + Firebase client SDKs.

### Important existing components
- Auth overlay + Google sign-in (`#auth-overlay`, `#google-signin-btn`)
- Main app shell (`#marquee-app`)
- Search with typeahead / suggestions
- Tabs: To watch / Watched / Suggested
- Media filter: All / Movies / Series
- Movie/series cards ("tickets")
- Details modal (`#modal-backdrop`)
- Notifications for new episodes
- Recent views (localStorage `recentViews`)
- Export/import, share list as image
- Region selector for streaming availability

### Database model (Firestore users/{uid})
```js
{
  movies: [ {
    id, title, year, summary, posterLink, mediaType, tmdbId,
    platforms, status: 'towatch'|'watched', addedAt, addedVia,
    imdbRating?, genres?, latestKnown?, hasUpdate?, ...
  } ],
  region, apiKey, omdbKey, updatedAt
}
```
Status is currently mutually exclusive (`towatch` | `watched`). No independent Favourite flag yet.

### Implementation decisions
1. Preserve existing `status` field for To Watch / Watched (exclusive). Add independent boolean `favourite` (default false). Migrate existing records by adding `favourite: false`.
2. Keep all data in Firestore; no schema versioning needed beyond additive field.
3. UI: Add Favourites tab. Remove Recently Viewed completely (UI + localStorage logic).
4. Login redesign: Keep Google auth; update copy and visual treatment to deep charcoal, ivory, muted gold, add Vistora messaging.
5. Details popup: Expand existing modal with more metadata, season/episode navigation where data available, independent controls for to-watch / watched / favourite.
6. Upcoming releases: Use TMDB release_date / next_episode_to_air / seasons data already partially fetched; surface COMING SOON + countdown for unreleased titles in To Watch.
7. Code changes will be made to the reconstructed `full_app.html`, then re-split into ~4000-byte part files for deployment compatibility with existing bootstrap.
8. Feature branches per phase; merge to main only after verification.

### Completed phases
- Phase 1: Backup + architecture inspection

### In-progress phase
None (ready for Phase 2)

### Pending phases
- Phase 2 – Login redesign
- Phase 3 – Collection management (independent Favourite)
- Phase 4 – Favourites section
- Phase 5 – Remove Recently Viewed
- Phase 6 – Upcoming releases
- Phase 7 – Details popup redesign
- Phase 8 – Final integration

### Files modified so far
- (none yet – status file only)

### Database migrations
- None yet (planned: additive `favourite` boolean)

### Tests executed
- Backup branch SHA verification: PASS

### Feature branch names
- `backup/pre-vistora-enhancements` (immutable)

### Outstanding issues
- None

### Exact next action required
Begin Phase 2: Redesign login/registration experience (auth overlay) with Vistora messaging, deep charcoal / ivory / muted-gold palette, while preserving Firebase Google auth flow. Create feature branch `feature/phase2-login-redesign` from main.
