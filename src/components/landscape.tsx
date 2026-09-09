export function Landscape({
  forest = false,
  priority = false,
}: {
  forest?: boolean;
  priority?: boolean;
}) {
  const name = forest ? "forest" : "alpine";
  // Full-height scenery is cropped on phones; its source must cover the height.
  const sizes = forest
    ? "(max-width: 799px) 100vw, 50vw"
    : "(max-aspect-ratio: 16/9) 178vh, 100vw";
  return (
    <picture className="landscape-picture">
      <source
        type="image/avif"
        srcSet={`/scenery/${name}-800.avif 800w, /scenery/${name}-1600.avif 1600w`}
        sizes={sizes}
      />
      {/* Preprocessed local assets retain the same composition at both sizes. */}
      <img
        src={`/scenery/${name}-1600.webp`}
        srcSet={`/scenery/${name}-800.webp 800w, /scenery/${name}-1600.webp 1600w`}
        sizes={sizes}
        alt=""
        width={1672}
        height={941}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}

export function Ridge({ near = false }: { near?: boolean }) {
  return (
    <svg
      className={`ridge ${near ? "ridge-near" : "ridge-far"}`}
      viewBox="0 0 1440 420"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={
          near
            ? "M0 130 60 165 140 130 220 204 310 232 410 294 530 340 690 374 800 360 900 330 990 270 1080 260 1170 184 1300 112 1440 70V420H0Z"
            : "M0 24 90 94 160 70 220 170 290 140 340 209 430 218 530 297 650 330 810 290 900 260 980 180 1080 210 1170 140 1290 90 1380 20 1440 50V420H0Z"
        }
      />
    </svg>
  );
}
