# Continuous alpine flight

The opening and every scroll position now use the same Three.js scene. There is no photograph-to-terrain dissolve, image scaling phase, or full-screen cloud wipe. Loading and reduced-motion posters are actual captures of the opening camera, with separate desktop/mobile fields of view. The selected image still guides the light palette and typography; the mountain geography is now the real Jungfrau–Mönch–Eiger massif.

`src/lib/alpine-world.ts` builds a 10km terrain from Swiss elevation and aerial photography. A uniform Catmull–Rom camera path approaches Jungfrau, crosses toward Mönch, rounds Eiger, then looks back across the massif. A separate gaze curve frames the ridges. Arc-length sampling uses 2,800 subdivisions; the route was checked at 20,001 positions. Minimum terrain clearance is 536m, with no active collision correction. Camera translation varies less than 0.4% between equal progress steps. The quickest turn is the early Jungfrau shoulder; its angular speed is continuous.

`src/components/alpine-scene.tsx` maps measured section positions to camera progress with monotone cubic interpolation. Forward/reverse scrolling follows the same curve. The first frame renders before the canvas becomes visible. Assets load with abort support, and late/cancelled resources are disposed. Rendering stops when scrolling settles, the tab is hidden, or motion is paused. Device pixel ratio is capped at 2 desktop/1.5 mobile and a 5-million-pixel budget. Mobile uses a 640-segment terrain versus 1024 desktop.

Experience uses six compact rows showing company, title, dates and location. Each row has a native horizontal scroll-snap rail: swiping sideways or choosing Details reveals the work summary, and Back or left-arrow returns to the overview. Normal vertical scrolling continues through the page. The section and the passage before Projects are shorter, and camera anchor spacing is bounded to keep distinct stops after compaction. Projects retain the open timeline layout. Feathered shading keeps text readable over the scenery. The hero navigation projects three native links onto visible ridges, with separate landmark choices for portrait views. When motion is paused, the links use their static layout so returning to the top still exposes every destination. The RL header and Squint landing caption are removed, and education reads UWaterloo. Anchors refresh after the scene-dependent layout loads. Reduced motion or unavailable WebGL keeps compact readable HTML over the still landscape. No external terrain services are contacted at runtime.

## Assets and reproduction

Run `scripts/prepare-swiss-alps.py` in a Python environment with numpy, rasterio and Pillow. The script includes usage/dependency instructions and uses the pinned 200-source manifest in `public/scenery/swiss-alps-sources.json`.

- `swiss-alps.bin`: 1025²uint16LE elevations in metres; rows north→south, columns west→east.
- `swiss-alps-albedo.webp`: 5000² aerial imagery at2m/pixel, quality 94.
- `swiss-alps-normal.webp`: 2048² object-space normals derived from native2m elevation, compressed at quality 95.
- `swiss-alps.json`: 10km EPSG:2056 bounds, dimensions, original sourceURLs, hashes and credits. Runtime Swiss assets total 11.90MiB.
- `cloud-bank.webp`: 1536×1024 generated transparent photographic cumulus sprite; 152KB. Clouds occupy world space below the route. ImageBitmap decoding explicitly avoids premultiplied alpha to prevent dark edges.
- `alpine-rock.webp`:generated rock texture, used for restrained triplanar cliff detail.
- `cloud-descent.webp`:the earlier selected landscape image; only its upper sky strip is sampled in the live sky material.
- `alpine-poster.webp` / `alpine-poster-mobile.webp`:actual frame-zero screenshots, encoded at quality 92. Desktop capture 2560×1080 / FOV 48; mobile 650×1000 / FOV 57. Background cover preserves vertical field of view within the captured aspect ratio.

To refresh posters locally, use the development-only `?scene-capture#top` query on the existing homepage. It hides HTML while preserving the scene and layout. Use the browser Home control to ensure scrollY 0 and data-flight-progress 0.0000, capture the viewport, and encode to WebP. The query has no effect in production.

Terrain and aerial photography: ©swisstopo. Source terms permit adaptation and redistribution with credit; attribution is in the footer. Color grading, normal compression, generated detail and cloud placement are artistic modifications.

## Limits

This remains a live heightfield with aerial textures, not a photogrammetric mesh or cinematic video. Steep cliff textures can stretch, source acquisition seams can remain, and the initial image is a different composition from the selected photograph. Normal-map compression approximates sharp surface changes. The static poster matches the opening pose rather than arbitrary deep-linked positions. Unusually wide viewports beyond the captured poster aspect ratio can crop the loading still differently.

Desktop, portrait tablet, mobile-sized Chromium, emulated reduced motion and JavaScript-disabled rendering are verified in the current layout pass. Physical-device performance, Safari/Firefox and simulated context loss remain untested. See `design-qa.md` for completed checks. Sharper imagery and an optional bluer sky are researched but parked in `docs/scenery-backlog.md`; the current camera, terrain assets, sky and lighting were preserved.
