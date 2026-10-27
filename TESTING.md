# Verification — 2026-10-16

## Automated checks

`npm test`: 5 passing Node tests:

1. Seeking reconstructs role state regardless of previous positions.
2. Contradictory identities coexist and then settle.
3. A hold overrides competing identities for five playback seconds.
4. A submitted comment returns within its recorded window and generates a presence response.
5. The clock wraps and authored presence fades before the boundary.

`npm run build`: passed. Approximately 497 KB JavaScript / 128 KB gzip, 6.4 KB CSS / 2.2 KB gzip, 4 KB HTML / 1.9 KB gzip. Installed dependencies reported zero vulnerabilities at installation.

## Browser checks

Verified in the available Chromium browser through actual DOM controls:

- Deterministic seek away and back at 70 seconds.
- Transcript keyboard focus + Enter applies a relationship hold; seeking beyond five seconds releases it.
- Comments toggle fades room presence to zero and restores it.
- A submitted literal `<img src=x onerror=alert(1)>` replays as text; no image element is created.
- Play advances time; Pause freezes it.
- Sound opt-in starts a running AudioContext; sound can be disabled again.
- Still mode activates.
- Playback crosses 120 seconds and wraps to the beginning.
- At 390 × 844, the document has no horizontal overflow.
- Low-power drawing buffer stays within its resolution cap.
- No browser console errors.

Visually inspected the first frame: composed 4:3 room, five place settings, furniture, window, warm doorway, fluorescent fixture, and surrounding archive UI. Renderer diagnostic at mobile resolution: 170 draw calls, 3,740 triangles, 348 × 261 drawing buffer.

## Limits

AudioContext activation was verified programmatically; no human listening assessment was performed. Mobile verification used a resized desktop browser, not physical touch hardware. No sustained GPU/power measurement or M1 frame-rate benchmark. Hidden-tab suspension and page-exit cleanup are implemented but were not verified with a physical background-tab lifecycle test.
