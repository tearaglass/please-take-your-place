# PLEASE TAKE YOUR PLACE

**[Play the artwork](https://tearaglass.github.io/please-take-your-place/)**

A compact, original interactive web artwork. Five empty seats are held together by the comments on a two-minute home recording.

## Run

Requires Node.js 20.19+ or 22.12+ (verified with Node 24).

```sh
npm install
npm run dev
```

Open the localhost address Vite prints. Press **Play**. Audio is muted until **Sound off** is selected. No account, server API, analytics, external media, or runtime CDN is used.

```sh
npm test
npm run build
npm run preview
```

`dist/` is the production website. Serve it with any static HTTP server at the site root; opening index.html directly with file:// will not load ES modules correctly.

## Controls

- Play / Pause: one playback clock for room state, comments and audio modulation.
- Timeline / chapter buttons: seek without reconstructing animation history.
- Marked transcript comments: click or focus and press Enter to hold that relationship for five playback seconds. Moving relationship comments also respond to clicks. Holds replay if you seek through them during the same loop; holds reset at loop rollover.
- Comments: smoothly fade text and social presence while keeping the furniture.
- Add a comment: up to 80 characters, displayed safely as plain text. Returns at that timestamp on future loops. Kept only in memory in this tab; reload clears it.
- Still mode: stationary comments, no pointer camera drift, no signal flicker. Automatically enabled for reduced-motion preferences.
- Low power: 640-pixel maximum render width and 24 fps. Default on narrow screens. Standard mode caps width at 960 pixels and 30 fps.
- Sound: opt-in synthesized electrical hum, filtered ventilation, distant tone, ceramic transients and identity interference. Pause fades sound out. Hidden tabs suspend audio and stop rendering; returning continues from the same playback position.

## Change the piece

- `src/config.js`: original comment script, timings, roles, palette, loop length, render caps and audio level.
- `src/timeline.js`: pure deterministic role evaluation and hold behavior.
- `src/room.js`: procedural furniture, lighting, text textures, perspective traces, window wires and wall breach.
- `src/main.js`: playback, UI, comment pooling and local interaction records.
- `src/audio.js`: synthesis graph; replace source nodes here with your own recordings.
- `src/style.css`: archive/player styling and responsive layout.

No downloaded artwork, textures, models or fonts. Nico Nico-style comment culture, electronic domestic unease and performed family roles are aesthetic inspirations; scene geometry and authored English dialogue are original.

## Lightweight implementation

One Three.js dependency, Vite for development/build, vanilla JS/CSS. No framework, physics, model loaders, video assets or post-processing composer. Geometry/materials are shared; text textures update only when text changes. The video treatment uses CSS overlays. One 512px shadow map, capped resolution, about 3,740 visible triangles and 170 draw calls in the tested frame. Paused scenes render only for an interaction or transition. Audio and rendering stop in hidden tabs. Scene resources are disposed when leaving the page.

The compact rendering deliberately retains angular furniture and a compressed-video look. Ambient sound is a synthesized approximation, not recorded foley. The spatial breach is a fading wall with crossing wires; comment art is deliberately typographic. `window.artwork.snapshot()` provides read-only playback, role, audio and renderer diagnostics.

See TESTING.md for what was actually verified. No physical iPhone or M1 performance benchmark was run.

## GitHub Pages

The public site is served from the root of the `gh-pages` branch. Source code remains on `main`.

To prepare an updated Pages build:

```sh
npm ci
npm test
npm run build -- --base=/please-take-your-place/
```

Publish the contents of `dist/` to the root of `gh-pages`, retaining an empty `.nojekyll` file. GitHub automatically deploys commits to that branch. Source changes on `main` alone do not update the published site.
