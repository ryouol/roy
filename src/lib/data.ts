export interface Term {
  code: string;
  company: string;
  url: string;
  role: string;
  location: string;
  dates: string;
  current?: boolean;
  note: string;
}

export const workHistory: Term[] = [
  {
    code: "S26",
    company: "Squint",
    url: "https://www.squint.ai/",
    role: "Software Engineer Intern",
    location: "San Francisco",
    dates: "May — Aug 2026",
    note: "Expanded AI video processing from 1 hour to 8+ hours with Gemini, working-memory logs, and reliable Temporal workflows.",
  },
  {
    code: "W26",
    company: "Aditum Bio",
    url: "https://www.aditumbio.com/",
    role: "Software Engineer Intern",
    location: "Cambridge, MA",
    dates: "Jan — Apr 2026",
    note: "Built Atlas’s investment-review interface and per-asset RAG pipeline, cutting specialist due-diligence workloads by 20%.",
  },
  {
    code: "F25",
    company: "Squint",
    url: "https://www.squint.ai/",
    role: "Software Engineer Intern",
    location: "San Francisco",
    dates: "Sep — Dec 2025",
    note: "Shipped four-channel notification routing, mobile safety timers, and the WatchSquint Apple Watch app for the utilities rollout.",
  },
  {
    code: "W25",
    company: "Tesla",
    url: "https://www.tesla.com/",
    role: "Software Engineer Intern",
    location: "Fremont",
    dates: "Jan — May 2025",
    note: "Built Tesla Skynet, a tool-calling AI agent that increased developer productivity by 15% for 500+ engineers.",
  },
  {
    code: "F24",
    company: "Tesla",
    url: "https://www.tesla.com/",
    role: "Software Engineer Intern",
    location: "Fremont",
    dates: "Sep — Dec 2024",
    note: "Built Rust, Go, and Python pipelines to process 30B+ rows for email prediction and improve campaign targeting.",
  },
  {
    code: "W24",
    company: "AES",
    url: "https://aeslifesciences.com/",
    role: "Software Engineer Intern",
    location: "Cambridge, ON",
    dates: "Jan — Apr 2024",
    note: "Built saved configurations and real-time instrument control in C++ and Python, improving researcher workflows by 30%.",
  },
];
