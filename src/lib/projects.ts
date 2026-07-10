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

export const layers: Layer[] = [
  {
    id: "execution",
    index: 0,
    name: "execution",
    thesis: "Decisions meeting the world — real-time, with stakes.",
  },
  {
    id: "infrastructure",
    index: 1,
    name: "infrastructure",
    thesis:
      "The coordination layer — platforms, serving, and the plumbing that makes systems fast.",
  },
  {
    id: "perception",
    index: 2,
    name: "perception",
    thesis: "Raw signal into structure — models that read noisy input.",
  },
];

export type Media =
  | { kind: "video"; src: string; poster: string }
  | { kind: "loom"; id: string; title: string; caption: string };

export interface Project {
  slug: string;
  title: string;
  stack: string;
  blurb: string;
  layer: LayerId;
  /** link-only panels; two of these may share a row */
  compact?: boolean;
  media?: Media[];
  links?: { label: string; href: string }[];
}

export const projects: Project[] = [
  {
    slug: "limitless",
    title: "Polymarket for Startups",
    stack: "React · TypeScript · Rust",
    blurb:
      "Prediction markets for startup ideas. Swipe on anonymized pitches, take positions, trade on conviction.",
    layer: "execution",
    media: [
      { kind: "video", src: "/LimitlessDemo.mp4", poster: "/limitless-poster.jpg" },
    ],
  },
  {
    slug: "vc-fund-os",
    title: "VC Fund OS",
    stack: "React · Go · Python",
    blurb:
      "One platform for the whole fund: GP deal flow and diligence, an LP investment portal, and portfolio-company dashboards.",
    layer: "infrastructure",
    media: [
      {
        kind: "loom",
        id: "0ebacafae02c436b8324024a3a44bebc",
        title: "GP tools",
        caption: "Deal flow & due diligence",
      },
      {
        kind: "loom",
        id: "de3de4a9c1b4418a87f01c9119b38025",
        title: "LP portal & portco",
        caption: "Robinhood for VC",
      },
    ],
  },
  {
    slug: "grpc-xavier",
    title: "gRPCNvidia-Work",
    stack: "C++ · CUDA",
    blurb: "gRPC serving on NVIDIA Xavier AGX.",
    layer: "infrastructure",
    compact: true,
    links: [
      {
        label: "github.com/ryouol/gRPCNvidia-Work",
        href: "https://github.com/ryouol/gRPCNvidia-Work",
      },
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
      {
        label: "github.com/ryouol/wla-distibutor",
        href: "https://github.com/ryouol/wla-distibutor",
      },
    ],
  },
  {
    slug: "kalshi-btc",
    title: "Kalshi BTC price predictor",
    stack: "Next.js · Rust · WebAssembly",
    blurb:
      "Real-time pricing for Kalshi's BTC markets: 50,000-path Monte Carlo with Heston volatility and Merton jump diffusion, compiled to WebAssembly.",
    layer: "perception",
    links: [
      {
        label: "github.com/ryouol/Kalshi-BTC",
        href: "https://github.com/ryouol/Kalshi-BTC",
      },
    ],
  },
];

export function projectsFor(layer: LayerId): Project[] {
  return projects.filter((p) => p.layer === layer);
}
