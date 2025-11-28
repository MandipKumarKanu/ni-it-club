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
    name: "Aadarsh Kushwaha",
    role: "President",
    description: ["Leadership", "Next.js"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=aadarsh",
  },
  {
    id: 2,
    name: "Kanta",
    role: "Vice President",
    description: ["UI/UX enthusiast", "Event organizer"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=kanta",
  },
  {
    id: 3,
    name: "Shashi",
    role: "Secretary",
    description: ["Keeping everything organized and on track."],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sashi",
  },
  {
    id: 4,
    name: "Mukti",
    role: "Vice Secretary",
    description: ["DevOps guru", "Open source contributor"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=mukti",
  },
  {
    id: 5,
    name: "Mandip Kumar Kanu",
    role: "Treasurer",
    description: ["UI/UX", "Frontend"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=mandy",
  },
  {
    id: 6,
    name: "Rohit Raj Shrivastava",
    role: "Operational Lead",
    description: ["Social Media", "Event Management"],
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=rohit",
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
    title: "Social Events",
    icon: Users,
    description: "Connect with peers over meetups, and networking sessions.",
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
    date: "2025-12-05",
    time: "2:00 PM",
    type: "Workshop",
    description: "Learn the basics of React.js and build your first app.",
    location: "Room 304",
  },
  {
    id: 2,
    title: "Winter Hackathon 2025",
    date: "2025-12-20",
    time: "9:00 AM",
    type: "Hackathon",
    description: "Annual winter hackathon. Theme: AI for Good.",
    location: "Main Hall",
  },
  {
    id: 3,
    title: "Guest Speaker: Tech Industry",
    date: "2025-12-12",
    time: "4:00 PM",
    type: "Tech Talk",
    description: "A software engineer talks about career paths in tech.",
    location: "Auditorium",
  },
  {
    id: 4,
    title: "Python Study Group",
    date: "2025-12-08",
    time: "3:30 PM",
    type: "Study Group",
    description: "Weekly study group for Python fundamentals.",
    location: "Library",
  },
  {
    id: 5,
    title: "UI/UX Design Workshop",
    date: "2025-12-15",
    time: "1:00 PM",
    type: "Workshop",
    description: "Learn design principles and create stunning interfaces.",
    location: "Design Lab",
  },
  {
    id: 6,
    title: "JavaScript Deep Dive",
    date: "2026-01-10",
    time: "2:30 PM",
    type: "Study Group",
    description: "Advanced JavaScript concepts and modern ES6+ features.",
    location: "Room 201",
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
