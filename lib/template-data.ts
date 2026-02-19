import { Expert, GradientCtaData } from "./types";

export const gradientCtaData: GradientCtaData = {
    eyebrow: "Limited Time",
    title: "Boost your grades with expert help",
    description: "Get matched with top-rated writers in minutes and stay on schedule.",
    primaryCta: {
        label: "Get a Free Quote",
        href: "#",
    },
    secondaryCta: {
        label: "View Samples",
        href: "#",
    },
    icon: "sparkles",
    gradientClassName: "from-indigo-600 via-purple-600 to-pink-600",
};


export const expertsData: Expert[] = [
    {
        name: "Ava Thompson",
        profession: "Business Studies Expert",
        orders: "1,240",
        rating: "4.9",
        about: "Specialist in case studies, market analysis, and strategic planning.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
        name: "Liam Chen",
        profession: "Computer Science Tutor",
        orders: "980",
        rating: "4.8",
        about: "Focused on algorithms, systems design, and clean code best practices.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
    {
        name: "Sophia Patel",
        profession: "Nursing & Health Expert",
        orders: "1,430",
        rating: "5.0",
        about: "Clinical research, reports, and evidence-based assignments.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    },
];