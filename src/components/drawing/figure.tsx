/* Drawing figures: duotoned media in a hard 1.5px frame with a proper
   figure caption — FIG. n, a dimension line, and the label. */

export function Fig({
  n,
  label,
  children,
}: {
  n: number | string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <figure>
      <div className="fig-media overflow-hidden border-[1.5px] border-ink">
        {children}
      </div>
      <figcaption className="mt-2 flex items-baseline gap-3">
        <span className="shrink-0 font-mono text-micro uppercase text-ink">
          fig. {String(n).padStart(2, "0")}
        </span>
        <span className="dimline min-w-6 flex-1 self-center" aria-hidden />
        <span className="shrink-0 font-mono text-micro uppercase text-dim">
          {label}
        </span>
      </figcaption>
    </figure>
  );
}

export function Still({
  base,
  alt,
  width,
  height,
}: {
  base: string;
  alt: string;
  width: number;
  height: number;
}) {
  const sizes = "(max-width: 640px) 92vw, 560px";
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={`${base}-800.avif 800w, ${base}-1600.avif 1600w`}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={`${base}-800.webp 800w, ${base}-1600.webp 1600w`}
        sizes={sizes}
      />
      <img
        src={`${base}-800.webp`}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="w-full"
      />
    </picture>
  );
}
