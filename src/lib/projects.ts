type Project = {
  id: string;
  name: string;
  category: string;
  description: string;
  github?: string;
  live?: string;
  demo?: string;
  secondaryDemo?: { label: string; url: string };
  image: string;
  imageAlt: string;
};

export const projects: Project[] = [
  {
    id: "rushes",
    name: "Rushes",
    category: "Video tools",
    description:
      "An AI footage library that organizes your videos, finds specific moments, and exports the shots you want.",
    github: "https://github.com/ryouol/rushes",
    live: "https://rushes.onrender.com/",
    demo: "https://screen.studio/share/9dYaSqmr",
    image: "/projects/rushes.webp",
    imageAlt: "Rushes landing page with a coastal footage preview",
  },
  {
    id: "unrender",
    name: "Unrender",
    category: "Chart extraction",
    description:
      "Turns chart images and PDFs into editable data you can review, correct, and export to a spreadsheet.",
    github: "https://github.com/ryouol/Unrender",
    live: "https://unrender.onrender.com/",
    demo: "https://screen.studio/share/4lFdVojh",
    image: "/projects/unrender.webp",
    imageAlt:
      "Unrender review workspace showing an illustrative chart beside its editable data table",
  },
  {
    id: "wayline",
    name: "Way Line",
    category: "Video to 3D",
    description:
      "Turns a short walkthrough video into a 3D point cloud you can explore, replay, and share.",
    github: "https://github.com/ryouol/wayline",
    live: "https://wayline-9ten.onrender.com/",
    image: "/projects/wayline.webp",
    imageAlt:
      "Wayline studio with an example office point cloud and a camera replay timeline",
  },
  {
    id: "startup-market",
    name: "Startup prediction market",
    category: "React · TypeScript · Postgres",
    description:
      "A swipe-based platform for forecasting startup performance, with prices set by an automated market maker.",
    demo: "/limitless-full.mp4",
    image: "/projects/startup-market.webp",
    imageAlt:
      "Startup prediction market demo showing a stack of startup cards and a portfolio balance",
  },
  {
    id: "loupe",
    name: "Loupe",
    category: "Swift · Apple Silicon",
    description:
      "A native macOS profiler that puts local AI inference events and system performance on the same timeline.",
    github: "https://github.com/ryouol/Loupe",
    image: "/projects/loupe.webp",
    imageAlt:
      "Loupe demo session showing inference phases, memory, GPU utilization, and power on a shared timeline",
  },
  {
    id: "fund-os",
    name: "VC Fund OS",
    category: "React · Go · Python",
    description:
      "A workspace for investment teams to manage deal flow, review companies, and keep investors up to date.",
    demo: "https://www.loom.com/share/0ebacafae02c436b8324024a3a44bebc",
    secondaryDemo: {
      label: "LP portal demo",
      url: "https://www.loom.com/share/de3de4a9c1b4418a87f01c9119b38025",
    },
    image: "/projects/fund-os.webp",
    imageAlt:
      "VC Fund OS dashboard from the original demo, with fund metrics and portfolio summaries",
  },
];

export const repositoryProjects = [
  {
    id: "tickforge",
    name: "TickForge",
    description:
      "Replays market data and simulates orders, with PostgreSQL checkpoints.",
    github: "https://github.com/ryouol/tickforge",
  },
  {
    id: "log-distributor",
    name: "Weighted log distributor",
    description:
      "Routes logs across weighted analyzers and redistributes traffic when one fails.",
    github: "https://github.com/ryouol/wla-distibutor",
  },
  {
    id: "nvidia-grpc",
    name: "gRPC on NVIDIA Xavier",
    description:
      "A C++ gRPC server for NVIDIA Xavier, with CUDA and Python support.",
    github: "https://github.com/ryouol/gRPCNvidia-Work",
  },
];
