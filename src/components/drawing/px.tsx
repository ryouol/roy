/* A parallax band. Depth is information architecture: the factor
   corresponds to the element's layer — far background counter-scrolls
   (−0.15…−0.25), midground drifts (+0.08…+0.15), foreground annotations
   ride over the plates (+0.3…+0.45).

   Server component — CSS scroll timelines animate it natively; the
   client ParallaxEngine only gates will-change and provides the rAF
   fallback. `mirror` flips a duplicate with scaleX(-1): zero extra bytes. */
export function Px({
  factor,
  mirror = false,
  className = "",
  children,
}: {
  factor: number;
  mirror?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`px ${className}`}
      data-pf={factor}
      style={{ ["--pf" as string]: factor }}
    >
      {mirror ? <div className="flip">{children}</div> : children}
    </div>
  );
}
