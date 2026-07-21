/* The stack. Projects live on one of three planes — adding a project is
   appending an object here; layout and scroll timeline adapt to counts. */

export type LayerId = "execution" | "infrastructure" | "perception";

export interface Layer {
  id: LayerId;
  /** 0 = front plane (the surface), 2 = back plane (the floor) */
  index: number;
  name: string;
  thesis: string;
}

/* Order = the section cut, top of stack downward:
   sense → coordinate → act. */
export const layers: Layer[] = [
  {
    id: "perception",
    index: 0,
    name: "perception",
    thesis:
      "Structure pulled out of noisy input — the read everything else runs on.",
  },
  {
    id: "infrastructure",
    index: 1,
    name: "infrastructure",
    thesis:
      "The layer that coordinates the rest — platforms, serving, and the plumbing underneath.",
  },
  {
    id: "execution",
    index: 2,
    name: "execution",
    thesis: "Decisions with something at stake, made in real time.",
  },
];

export type Media =
  | { kind: "video"; preview: string; full: string; poster: string }
  | {
      kind: "loom";
      id: string;
      title: string;
      caption: string;
      poster: string;
    }
  | {
      /** processed demo still: `${base}-{800,1600}.{avif,webp}` */
      kind: "still";
      base: string;
      alt: string;
      width: number;
      height: number;
      label: string;
    };

export interface Project {
  slug: string;
  title: string;
  blurb: string;
  layer: LayerId;
  stack?: string;
  /** short annotation carried by a leader line — extracted, never invented */
  note?: string;
  /** link-only entries; two of these may share a row */
  compact?: boolean;
  media?: Media[];
  links?: { label: string; href: string }[];
}

export const projects: Project[] = [
  /* ——— L1 · perception ——— */
  {
    slug: "unrender",
    title: "Unrender",
    blurb: "Chart-to-table vision model.",
    layer: "perception",
    note: "chart → table",
  },
  {
    slug: "atlas",
    title: "Atlas",
    blurb: "AI-diligence work at Aditum Bio.",
    layer: "perception",
    note: "AI diligence",
  },

  /* ——— L2 · infrastructure ——— */
  {
    slug: "robotaxi-pipelines",
    title: "Tesla robotaxi ML pipelines",
    blurb:
      "Built ML pipelines behind the Robotaxi launch, powering Llama 3 fine-tuning and RAG integration.",
    layer: "infrastructure",
    note: "Llama 3 fine-tuning + RAG",
  },
  {
    slug: "grpc-xavier",
    title: "gRPCNvidia-Work",
    stack: "C++ · CUDA",
    blurb: "gRPC serving on NVIDIA Xavier AGX.",
    layer: "infrastructure",
    compact: true,
    links: [
      { label: "github", href: "https://github.com/ryouol/gRPCNvidia-Work" },
    ],
  },
  {
    slug: "wla-distributor",
    title: "wla-distributor",
    stack: "C++ · gRPC",
    blurb: "Distributed workload allocator.",
    layer: "infrastructure",
    compact: true,
    links: [
      { label: "github", href: "https://github.com/ryouol/wla-distibutor" },
    ],
  },

  /* ——— L3 · execution ——— */
  {
    slug: "kalshi-btc",
    title: "Kalshi BTC price predictor",
    stack: "Next.js · Rust · WebAssembly",
    blurb:
      "Real-time pricing for Kalshi's BTC markets: 50,000-path Monte Carlo with Heston volatility and Merton jump diffusion, compiled to WebAssembly.",
    layer: "execution",
    note: "50,000-path Monte Carlo",
    links: [
      {
        label: "github.com/ryouol/Kalshi-BTC",
        href: "https://github.com/ryouol/Kalshi-BTC",
      },
    ],
  },
  {
    slug: "limitless",
    title: "Polymarket for Startups",
    stack: "React · TypeScript · Rust",
    blurb:
      "Prediction markets for startup ideas. Swipe on anonymized pitches, take positions, trade on conviction.",
    layer: "execution",
    note: "positions on conviction",
    media: [
      {
        kind: "video",
        preview: "/limitless-preview.mp4",
        full: "/limitless-full.mp4",
        poster: "/limitless-poster.jpg",
      },
      {
        kind: "still",
        base: "/frames/pitch-chip",
        alt: "Anonymized startup pitch card from the demo",
        width: 1600,
        height: 940,
        label: "pitch card",
      },
    ],
  },
  {
    slug: "vc-fund-os",
    title: "VC Fund OS",
    stack: "React · Go · Python",
    blurb:
      "One platform for the whole fund: GP deal flow and diligence, an LP investment portal, and portfolio-company dashboards.",
    layer: "execution",
    note: "GP · LP · portco",
    media: [
      {
        kind: "loom",
        id: "0ebacafae02c436b8324024a3a44bebc",
        title: "GP tools",
        caption: "Deal flow & due diligence",
        poster: "/looms/gp-tools.webp",
      },
      {
        kind: "loom",
        id: "de3de4a9c1b4418a87f01c9119b38025",
        title: "LP portal & portco",
        caption: "Robinhood for VC",
        poster: "/looms/lp-portco.webp",
      },
    ],
  },
];

export function projectsFor(layer: LayerId): Project[] {
  return projects.filter((p) => p.layer === layer);
}
