# Scenic artwork

Generated with the built-in ImageGen tool on 9 September 2026. The images are fictional landscapes, not photographs of a claimed location. They decorate the portfolio and carry empty alt text; all important content remains semantic HTML.

Final assets: `public/scenery/alpine-{800,1600}.{avif,webp}` and `public/scenery/forest-{800,1600}.{avif,webp}`. AVIF desktop transfers are approximately 96 KB and 176 KB; the mobile variants approximately 36 KB and 60 KB. Original generated PNGs are retained in the user's generated-images folder, not added to Git.

Alpine prompt:
> Use case: photorealistic-natural. Asset type: panoramic website scenic background, landscape 2048x1152. Create an exceptionally beautiful cinematic photograph of a remote alpine lake at blue hour. Huge layered granite mountains on left and right framing a small distant glowing peach horizon in center, deep misty midnight teal valley with several mountain silhouettes receding into atmospheric haze, still water reflects the sky, foreground lower corners have near-black evergreen forest silhouettes. Top 40 percent is expansive dusky slate-blue sky with wispy clouds and a very subtle warm horizon. Composition designed for a large elegant white headline centered over the sky and mountains. Restrained film color grade, fine natural texture, editorial outdoor photography, quiet majestic feeling, accurate photographic landscape with a tiny warm moon. No people, no houses, no logos, no typography, no watermark. Wide image edge to edge.

Forest prompt:
> Use case: photorealistic-natural. Asset type: website landscape scene. Wide cinematic landscape photograph, 2048 by 1152. Immersive lush Pacific Northwest alpine valley at twilight, immense dark fir trees frame both sides, a jade green river winding from lower foreground toward an immense misty mountain in the distance, pale fog between forest layers, tiny soft peach glow far on the horizon. Finely detailed editorial landscape photography, sophisticated muted deep forest green, slate blue, warm silver light. Peaceful sublime atmosphere, subtle film grain. Strong sense of several layers of depth. No buildings, no people, no text, no watermark. Natural photographic realism, beautiful lighting.

The companion ridgelines and icon are code-native SVG. `scripts/prepare-assets.mjs` builds the alpine variants and favicon set. To swap scenery, supply final artwork with the same filenames/dimensions; no external asset credentials are needed.
