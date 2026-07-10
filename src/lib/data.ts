export interface Term {
  code: string;
  company: string;
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
    role: "Software Engineer Intern",
    location: "San Francisco",
    dates: "May — Aug 2026",
    current: true,
    note: "Returned for a second term with the founding team, off the back of the utilities launch.",
  },
  {
    code: "W26",
    company: "Aditum Bio",
    role: "Software Engineer Intern",
    location: "Oakland",
    dates: "Jan — Apr 2026",
    note: "Built AI agents for drug-discovery workflows, working directly with co-founder Joe Jimenez, former CEO of Novartis.",
  },
  {
    code: "F25",
    company: "Squint",
    role: "Software Engineer Intern",
    location: "San Francisco",
    dates: "Sep — Dec 2025",
    note: "Shipped the utilities vertical end-to-end with the CEO: $10M in new ARR, taking company revenue from $9.5M to $20M.",
  },
  {
    code: "W25",
    company: "Tesla",
    role: "Software Engineer Intern",
    location: "Fremont",
    dates: "Jan — May 2025",
    note: "Built Skynet, an internal AI agent adopted by 500+ Tesla engineers, lifting developer productivity ~15%.",
  },
  {
    code: "F24",
    company: "Tesla",
    role: "Software Engineer Intern",
    location: "Fremont",
    dates: "Sep — Dec 2024",
    note: "Built ML pipelines behind the Robotaxi launch, powering Llama 3 fine-tuning and RAG integration.",
  },
  {
    code: "W24",
    company: "AES",
    role: "Software Engineer Intern",
    location: "Cambridge, ON",
    dates: "Jan — Apr 2024",
    note: "Wrote iCIEF instrument software in C++ and Python, cutting researcher workflow time by 30%.",
  },
];

// Single source of truth for every outbound link on the site
// (hero, contact list, terminal commands, console banner).
export const links = {
  github: "https://github.com/ryouol",
  linkedin: "https://linkedin.com/in/ee-royluo",
  squint: "https://www.squint.ai",
  email: "mailto:r55luo@uwaterloo.ca",
};

export const email = links.email.replace("mailto:", "");

export const sections = ["projects", "work", "contact"] as const;

export const contactLinks = [
  { label: "email", value: email, href: links.email },
  { label: "github", value: "github.com/ryouol", href: links.github },
  { label: "linkedin", value: "linkedin.com/in/ee-royluo", href: links.linkedin },
];
