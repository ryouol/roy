# Scenery refinement — LOW PRIORITY / PARKED

Recorded 2026-09-10. The user accepted the current mountains and asked to save sharper terrain and a possibly bluer sky for later. This is a research backlog, not an active implementation task. Preserve the accepted scene, camera route, section transitions and assets. No runtime changes, downloads, background work or automation are requested by this note.

## Accepted baseline to preserve

The current continuous Jungfrau–Mönch–Eiger flight is documented in [cloud-descent.md](cloud-descent.md). It uses one scene from the opening through Experience, Projects and Contact, with native scroll controls, pause and readable reduced-motion fallback.

| Component | Current baseline |
| --- | --- |
| Geographic extent | 10 × 10 km, EPSG:2056; E 2637000–2647000, N 1151000–1161000 |
| Elevation | 2 m swissALTI3D sources; delivered as 1025² metre-rounded samples |
| Geometry | 1024 segments desktop, 640 mobile: approximately 9.77 m / 15.63 m spacing |
| Photography | 5000² SWISSIMAGE aerial texture, 2 m ground pixels, WebP quality 94 |
| Surface normals | Native 2 m slopes reduced to 2048², approximately 4.88 m spacing, WebP quality 95 |
| Rendering | Antialiasing; anisotropy 8; DPR capped at 2 desktop / 1.5 mobile and 5 million drawing-buffer pixels |
| Assets | Swiss runtime files total 11.90 MiB; source URLs and hashes are pinned |
| Sky | Pale blue zenith `#b9d5ee`, light horizon/fog `#e5edf4`, mixed with the selected image's upper sky strip |

## Identify the limitation before increasing resolution

These mechanisms require different fixes. They have not been isolated by a controlled visual comparison yet.

| Visible symptom | Likely mechanism | Useful future check |
| --- | --- | --- |
| Soft ridge silhouette or angular geometry | The rendered mesh is coarser than the 2 m elevation source | Compare one nearby ridge with a denser local mesh at the identical camera pose |
| Sharp silhouette, blurry rock/glacier surface | Source texel density, texture filtering or compression | Compare the native aerial crop to the rendered crop; inspect mip selection and anisotropy |
| Stretched vertical cliff face | A top-down orthophoto is draped over a heightfield | Inspect steep faces separately; a higher-resolution DEM cannot supply unseen cliff photography |
| Fine detail softened everywhere on a large display | Drawing-buffer resolution | Record CSS size, device DPR and actual canvas pixels; the 5 MP cap can force rendering below one pixel per CSS pixel on a 4K viewport |
| Waxy or noisy highlights despite sharp color | Normal compression, lighting or grading | Compare an uncompressed normal-map crop while keeping geometry and lighting fixed |

The geometry and cliff-texture limits are distinct. As a geometric illustration, a 2 m horizontal image pixel covers roughly 11.5 m along an 80° slope (`2 / cos(80°)`). At a vertical wall, a top-down image cannot describe the visible wall surface. This is an inference from the projection, not a stated quality guarantee from swisstopo. Generated triplanar rock currently adds visual texture; it does not reconstruct the real cliff.

## Verified source options

**Higher-resolution SWISSIMAGE crops are the most practical first asset experiment.** The official product offers 0.1 m and 2 m exports; the 0.1 m grid does not imply 10 cm native acquisition everywhere. The accepted 2023/2024 Alpine imagery originates from the period documented at approximately 25 cm acquisition resolution. Use a small crop around the closest visible ridge, not a replacement 100,000² texture for the entire region. A 1 km crop at 25 cm would be 4000² and could become a local detail patch. Confirm acquisition year, native resolution and alignment before processing. [SWISSIMAGE specifications](https://www.swisstopo.admin.ch/en/orthoimage-swissimage-10)

**A finer DEM may improve silhouettes, but grid size alone is insufficient evidence.** swissALTI3D offers 0.5 m and 2 m grids. Its product documentation warns that the finer grid can be oversampled where point density is insufficient and lists different accuracies for LiDAR and stereo-derived data. Inspect the release information for the actual selected tiles before downloading finer elevation. Compare native detail against the existing 2 m data in a small ridge crop. [swissALTI3D specifications](https://www.swisstopo.admin.ch/en/height-model-swissalti3d), [product information](https://www.swisstopo.admin.ch/dam/de/sd-web/D6hcUzfZuiQc/swissALTI3D-ProdInfo-DE.pdf)

**swissSURFACE3D provides raw 3D points, not a ready textured mountain mesh.** The official product is classified airborne LiDAR with national coverage. Tile sizes are substantial: the page describes approximately 200 MB COPC files for newer eastern data and approximately 610 MB LAS files for older/Berne data. Actual format and date must be checked for this massif. A limited point-cloud crop could test whether cliff geometry contains useful detail absent from the raster. It would still require reconstruction, simplification and textures, and airborne coverage does not guarantee complete vertical faces or overhangs. [swissSURFACE3D](https://www.swisstopo.admin.ch/en/height-model-swisssurface3d)

**swissSURFACE3D Raster remains a heightfield.** Its 0.5 m grid includes surface objects and is derived from LiDAR. It may be useful for a comparison crop, but switching from a terrain raster to a surface raster does not create complete cliff geometry or photographic wall textures. [swissSURFACE3D Raster](https://www.swisstopo.admin.ch/en/height-model-swisssurface3d-raster)

**True photogrammetry needs suitable overlapping photographs and orientation data.** swisstopo documents forward/nadir/backward imagery for its older strip system. Those 2005–2025 strips are not freely downloadable and require a quotation. Its newer digital aerial-image product starts with 2026 surveys, provides camera orientation/calibration data, and directs users to order data that is not yet freely downloadable. Do not assume that the Jungfrau area is already available or that these views adequately cover the desired cliff. No official ready-to-use textured mesh of these peaks was verified in this bounded research. This remains a higher-effort investigation, with source availability and terms checked before any purchase or contact. [Digital image strips](https://www.swisstopo.admin.ch/en/digital-image-strips), [digital aerial images](https://www.swisstopo.admin.ch/en/digital-aerial-images)

New acquisition improvements should not be confused with the existing assets: swisstopo reports Alpine acquisition at 20 cm from 2026, previously 25 cm. That does not upgrade the accepted 2023/2024 source imagery automatically. [Aerial acquisition details](https://www.swisstopo.admin.ch/en/acquisition-aerial-images)

All future source exports must retain the required `©swisstopo` credit and source provenance. Check the terms for any separately ordered imagery; product sample downloads may have different restrictions from the actual open-data products. [Official usage terms](https://www.swisstopo.admin.ch/en/terms-of-use-free-geodata-and-geoservices)

## Future experiments, only when this item is resumed

1. **Establish a controlled comparison.** Capture the opening, closest Jungfrau shoulder, Mönch crossing and Eiger turn at fixed scroll/camera positions. Record CSS/canvas dimensions, DPR, frame times and asset bytes. Use the existing desktop and mobile sizes; add a large-display view to isolate the pixel-budget effect.
2. **Test output sampling first.** Compare the same frame at a higher drawing-buffer resolution and supported anisotropy. Keep the camera, assets, fog and grading identical. Retain an improvement only if it is visible during normal scrolling and does not introduce sustained frame-time regression.
3. **Test one high-resolution aerial patch.** Select the closest ridge that demonstrably lacks color detail, prepare a small aligned crop from the higher-resolution source, and blend it without visible borders or acquisition-year jumps. Keep the accepted wide-area texture underneath. Do not globally upscale the current image or call invented detail recovered geography.
4. **Test local geometry and normal encoding separately.** Compare a denser mesh only near the camera, then a normal-map crop without lossy chroma subsampling. The current quality-95 normal experiment had approximately 2.9° median / 15.3° 95th-percentile directional error at 2500² before the final 2048² export; this is a warning to measure the final candidate, not a measurement of the shipped map. A larger download needs a visible benefit.
5. **Consider a real cliff mesh only if earlier steps fail.** Start with one verified crop and confirmed multi-angle imagery; assess reconstruction holes, texture seams, view coverage, processing effort and redistribution terms before expanding. This is not the default next step.

## Optional bluer sky — separate, parked

The user may prefer a slightly bluer sky. When resumed, compare a modest zenith hue/saturation adjustment at the same four camera stops. Preserve the light background, pale horizon, natural snow colors and readable dark text. Change the sky first; avoid making a global color/exposure shift that turns the terrain blue. Keep the accepted setting available for a direct comparison. No sky values are changed by this backlog.

## Acceptance and revert criteria

Accept a future candidate only when the user prefers its visible result at matched camera poses, the entire forward/reverse scroll remains continuous, mobile content stays readable, pause/reduced-motion behavior remains intact, and measured performance/load size is justified against the baseline. As initial guardrails, avoid more than a 10% regression in median or 95th-percentile frame time on the same device; keep the 11.90 MiB Swiss-asset budget unless a clearly better result warrants revisiting it with the user. These are proposed future gates, not completed measurements.

Revert the experiment if it only looks sharper in a magnified still, causes shimmer or popping during motion, creates texture seams or cliff distortion, darkens the accepted clean look, introduces a photograph-to-render transition, shifts the camera route, or materially slows the experience. Preserve the accepted build and source hashes before experimenting. This note does not authorize deployment, paid data orders, vendor messages or recurring work.
