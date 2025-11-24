import { Code, Terminal, Cpu, Globe, Users, Zap } from "lucide-react";

export const stats = [
  { label: "Members", value: "150+" },
  { label: "Projects", value: "50+" },
  { label: "Events", value: "25+" },
  { label: "Partners", value: "10+" },
];

export const teamMembers = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "President",
    description: "Full-stack wizard and community builder.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    id: 2,
    name: "Sarah Lee",
    role: "Vice President",
    description: "UI/UX enthusiast and event organizer.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    id: 3,
    name: "Mike Chen",
    role: "Tech Lead",
    description: "DevOps guru and open source contributor.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "Secretary",
    description: "Keeping everything organized and on track.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
  },
  {
    id: 5,
    name: "David Kim",
    role: "Treasurer",
    description: "Managing finances and sponsorships.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
  {
    id: 6,
    name: "Lisa Wang",
    role: "Marketing",
    description: "Spreading the word and managing social media.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
  },
];

export const activities = [
  {
    id: 1,
    title: "Coding Workshops",
    icon: Code,
    description: "Hands-on sessions on the latest tech stacks.",
  },
  {
    id: 2,
    title: "Hackathons",
    icon: Terminal,
    description: "24-48 hour coding marathons to build cool stuff.",
  },
  {
    id: 3,
    title: "Tech Talks",
    icon: Zap,
    description: "Industry experts sharing their knowledge.",
  },
  {
    id: 4,
    title: "Study Groups",
    icon: Users,
    description: "Collaborative learning for exams and certs.",
  },
  {
    id: 5,
    title: "Project Showcases",
    icon: Cpu,
    description: "Demo your personal projects to the club.",
  },
  {
    id: 6,
    title: "Open Source",
    icon: Globe,
    description: "Contributing to real-world open source projects.",
  },
];

export const events = [
  {
    id: 1,
    title: "Intro to React",
    date: "2023-11-15",
    type: "Workshop",
    description: "Learn the basics of React.js and build your first app.",
    location: "Room 304",
  },
  {
    id: 2,
    title: "Winter Hackathon",
    date: "2023-12-10",
    type: "Hackathon",
    description: "Annual winter hackathon. Theme: AI for Good.",
    location: "Main Hall",
  },
  {
    id: 3,
    title: "Guest Speaker: Google",
    date: "2023-10-20",
    type: "Tech Talk",
    description: "A software engineer from Google talks about career paths.",
    location: "Auditorium",
  },
  {
    id: 4,
    title: "Python Study Group",
    date: "2023-11-05",
    type: "Study Group",
    description: "Weekly study group for Python fundamentals.",
    location: "Library",
  },
];

export const projects = [
  {
    id: 1,
    title: "Club Website",
    description: "The official website for NI IT Club built with React.",
    tech: ["React", "Tailwind", "Vite"],
    link: "#",
    image: "https://placehold.co/600x400/000000/ffffff?text=Club+Website",
  },
  {
    id: 2,
    title: "Event Tracker",
    description: "A mobile app to track campus events.",
    tech: ["Flutter", "Firebase"],
    link: "#",
    image: "https://placehold.co/600x400/ccff00/000000?text=Event+Tracker",
  },
  {
    id: 3,
    title: "AI Chatbot",
    description: "A chatbot for student queries using OpenAI API.",
    tech: ["Python", "FastAPI", "OpenAI"],
    link: "#",
    image: "https://placehold.co/600x400/ff3333/ffffff?text=AI+Chatbot",
  },
];
