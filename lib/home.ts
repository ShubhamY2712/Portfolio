// Home page content, kept in code for v1 (decided 9 Nov 2026: /admin is locked, no SQL needed).
// Every line here was picked by Shubham; change it only with his approval.

export type SectionCopy = {
  eyebrow: string;
  title: string; // the part before the accent
  accent: string; // the word(s) shown in terracotta
  sub: string;
};

export type CredentialCard = {
  name: string;
  role: string;
  dates: string;
  chips: string[];
  href: string;
  plaque: string; // text plaque until a logo file exists
  art: string | null; // /art/home/... once the diorama is made
};

export type WorkCard = {
  name: string;
  pitch: string;
  chips: string[];
  href: string;
  art: string | null;
};

export type Achievement = {
  name: string;
  detail: string;
  art: string | null; // trophy image once made
};

export type AskQuestion = {
  text: string;
  icon: "briefcase" | "flask" | "chart" | "cap" | "bulb" | "doc";
};

export const INTRO = {
  eyebrow: "AI Product Manager · Full Stack Developer · AI Builder",
  h1: ["I shape and build", "AI products people", "can trust."],
  tagline: ["Think like a user. ", "Decide like a PM.", " Build like a developer."],
  summary:
    "Product Intern at Pinaka Intelligence and final-year AI & Data Science student. Building InvAI, an AI-powered supply chain intelligence SaaS, and CreditSaathi, an AI-driven alternative credit scoring platform. Co-author of the published paper “The Impact of AI in the Indian Economy”.",
  workCta: "View my work",
  askCta: "Ask Shubham",
  askCaption: "My AI portfolio assistant",
  posterName: "Shubham Yawalkar",
  posterLine: "60-second intro · coming soon",
  tilt: "Tap me, then tilt my world",
} as const;

export const CREDENTIALS: SectionCopy = {
  eyebrow: "Credentials",
  title: "Where I’ve made an ",
  accent: "impact.",
  sub: "Industry experience. Hands-on building. Published research.",
};

export const CREDENTIAL_CARDS: CredentialCard[] = [
  {
    name: "Pinaka Intelligence",
    role: "Product Intern",
    dates: "Oct 2026 – Present",
    chips: ["Product", "Growth & Technology"],
    href: "/work",
    plaque: "Pinaka",
    art: null,
  },
  {
    name: "Product Builder",
    role: "Products I lead, end to end",
    dates: "Apr 2026 – Present",
    chips: ["InvAI", "CreditSaathi", "Groundtruth"],
    href: "/projects",
    plaque: "Builder",
    art: null,
  },
  {
    name: "Published research",
    role: "Co-author, “The Impact of AI in the Indian Economy”",
    dates: "Sep 2025",
    chips: ["Nova", "AI & Economy"],
    href: "/about#research",
    plaque: "Nova",
    art: null,
  },
];

export const WORK: SectionCopy = {
  eyebrow: "Selected work",
  title: "From idea to ",
  accent: "working product.",
  sub: "From messy problems to working AI products.",
};

export const VIEW_ALL_WORK: string = "View all work";

export const WORK_CARDS: WorkCard[] = [
  {
    name: "InvAI",
    pitch: "AI-powered, multi-tenant SaaS for supply chain intelligence, from single-store retailers to franchises.",
    chips: ["AI", "SaaS", "Supply chain"],
    href: "/projects?product=invai",
    art: null,
  },
  {
    name: "CreditSaathi",
    pitch: "Alternative credit scoring for gig workers and MSMEs, with an open fairness audit built in.",
    chips: ["AI", "ML", "FinTech"],
    href: "/projects?product=creditsaathi",
    art: null,
  },
  {
    name: "Groundtruth",
    pitch: "Helps companies pick where to open their first India GCC, with every number linked to its source.",
    chips: ["AI", "Data", "Strategy"],
    href: "/projects?product=groundtruth",
    art: null,
  },
];

export const ACHIEVEMENTS: SectionCopy = {
  eyebrow: "Achievements",
  title: "Moments that ",
  accent: "counted.",
  sub: "Behind every milestone, a chapter I’m still proud of.",
};

export const ACHIEVEMENT_ITEMS: Achievement[] = [
  { name: "Best Social Impact Award", detail: "HackVerse Hackathon · winner · 2025", art: null },
  { name: "First Prize, Nukkad Natak", detail: "NSS camp · led the street play · 2025–26", art: null },
  { name: "Innovation and Creativity Award", detail: "ADYPU NSS Unit · 2024–25", art: null },
  { name: "Outreach Coordinator, NSS", detail: "Led 200 volunteers · ADYPU · 2025–26", art: null },
  { name: "President, Literature Club", detail: "ADYPU · 2023–25", art: null },
];

export const ASK = {
  eyebrow: "Ask",
  title: "Ask ",
  accent: "Shubham",
  hand: "My AI portfolio assistant",
  lead: "Curious about Shubham’s work, projects, experience, skills, product thinking or learnings? Ask away; every answer comes straight from this portfolio.",
  callout: "That’s me!",
  sticky: "I read all of Shubham’s work over cutting chai, so you don’t have to.",
  notebookTitle: "Your turn to ask.",
  nudge: "Stuck? Steal one of these ↓",
  placeholder: "Ask anything, I’ll dig it up…",
  soon: "Warming up…",
  more: "Show me more",
} as const;

export const ASK_QUESTIONS: AskQuestion[] = [
  { text: "What products has Shubham built?", icon: "briefcase" },
  { text: "How does he decide what to build?", icon: "bulb" },
  { text: "How does he use data in product calls?", icon: "chart" },
  { text: "What does he do at Pinaka?", icon: "flask" },
  { text: "What’s his published research about?", icon: "doc" },
  { text: "What has he learned from building?", icon: "cap" },
];
