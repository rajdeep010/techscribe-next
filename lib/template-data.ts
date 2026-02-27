import { Expert, GradientCtaData, FAQ, HeroData, HowItWorksData, ColumnDef, TabItem, DocumentRow } from "./types";

export const heroData: HeroData = {
    eyebrow: "Trusted by 50,000+ Students Worldwide",
    title: "Get Premium Assignment Help from Top Academic Experts",
    description: "Achieve excellence with AI-free, plagiarism-free assignments crafted by verified PhD scholars and industry professionals. Guaranteed grades, on-time delivery, and 24/7 support.",
    primaryCta: {
        label: "Get Started Now",
        href: "#",
    },
    secondaryCta: {
        label: "View Sample Work",
        href: "#",
    },
    stats: {
        rating: "4.9★ Rating",
        orders: "50,000+ Happy Students",
        support: "24/7 Live Support",
    },
    showForm: true,
};

export const howItWorksData: HowItWorksData = {
    eyebrow: "Simple Process",
    title: "How Our Assignment Service Works",
    description: "Get your assignments done in three simple steps. Fast, secure, and hassle-free from start to finish.",
    steps: [
        {
            icon: "book-open",
            step: "Step 1",
            title: "Fill Out Order Form",
            description: "Share your assignment requirements, deadline, and academic level in just a few minutes.",
        },
        {
            icon: "credit-card",
            step: "Step 2",
            title: "Make Secure Payment",
            description: "Choose from multiple payment options. Your transaction is 100% safe and encrypted.",
        },
        {
            icon: "check-circle",
            step: "Step 3",
            title: "Receive Quality Work",
            description: "Get your completed assignment on time with free revisions and plagiarism report included.",
        },
    ],
    cta: {
        label: "Get Started Now",
        href: "#",
    },
};

export const gradientCtaData: GradientCtaData = {
    eyebrow: "Limited Time Offer",
    title: "Boost Your Grades with Expert Academic Support",
    description: "Get matched with top-rated subject experts and receive high-quality, original work delivered on time.",
    primaryCta: {
        label: "Get Free Quote",
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

export const faqsData: FAQ[] = [
    {
        question: "What subjects do you cover?",
        answer: "We cover a wide range of subjects including Math, Science, Literature, Business, Engineering, Computer Science, Nursing, and more. Our experts specialize in over 100+ academic disciplines across all levels."
    },
    {
        question: "How do I place an order?",
        answer: "Simply fill out our order form with your assignment details, select your deadline, and make a secure payment. You'll receive confirmation immediately and can track progress through your dashboard."
    },
    {
        question: "What is your revision policy?",
        answer: "We offer unlimited free revisions within 14 days of delivery. If the work doesn't meet your initial requirements, we'll revise it at no extra cost until you're completely satisfied."
    },
    {
        question: "Are your services confidential?",
        answer: "Absolutely. We guarantee 100% confidentiality. Your personal information, assignment details, and payment data are encrypted and never shared with third parties. We comply with strict privacy policies."
    },
    {
        question: "How do you ensure quality?",
        answer: "Every assignment goes through a multi-step quality assurance process including expert writing, plagiarism checks, proofreading, and formatting verification by our QA team before delivery."
    },
    {
        question: "What are your payment options?",
        answer: "We accept all major credit/debit cards, PayPal, bank transfers, and popular digital payment methods. All transactions are secured with SSL encryption for your safety."
    },
    {
        question: "Can I communicate with my assigned expert?",
        answer: "Yes! You can message your expert directly through our secure messaging system to clarify requirements, ask questions, or provide additional materials anytime."
    },
    {
        question: "What if I need urgent assistance?",
        answer: "We offer express delivery options with turnaround times as short as 6 hours. Our experts are available 24/7 to handle urgent requests without compromising quality."
    },
];

export const tableTabs: TabItem[] = [
    { id: "Outline", label: "Outline", count: null },
    { id: "Past Performance", label: "Past Performance", count: 3 },
    { id: "Key Personnel", label: "Key Personnel", count: 2 },
    { id: "Focus Documents", label: "Focus Documents", count: null },
];

// Admin Dashboard Mock Data
export const mockStats = [
    {
        title: "Total Revenue",
        value: "$1,250.00",
        change: "+12.5%",
        trend: "up" as const,
        description: "Trending up this month",
        icon: "dollar-sign" as const,
    },
    {
        title: "New Customers",
        value: "1,234",
        change: "+20%",
        trend: "up" as const,
        description: "Down 20% this period",
        icon: "users" as const,
    },
    {
        title: "Active Accounts",
        value: "45,678",
        change: "+18.6%",
        trend: "up" as const,
        description: "Strong user retention",
        icon: "activity" as const,
    },
    {
        title: "Growth Rate",
        value: "4.5%",
        change: "+4.5%",
        trend: "up" as const,
        description: "Steady performance increase",
        icon: "trending-up" as const,
    },
];

export const mockChartData = [
    { date: "Jun 24", value: 2400 },
    { date: "Jun 25", value: 1398 },
    { date: "Jun 26", value: 4800 },
    { date: "Jun 27", value: 3908 },
    { date: "Jun 28", value: 4800 },
    { date: "Jun 29", value: 3800 },
    { date: "Jun 30", value: 4300 },
];

export const mockDocuments: DocumentRow[] = [
    {
        id: "1",
        header: "Cover page",
        sectionType: "Cover page",
        status: "In Progress",
        target: 18,
        limit: 5,
        reviewer: "Eddie Lake",
        order: 1,
    },
    {
        id: "2",
        header: "Table of contents",
        sectionType: "Table of contents",
        status: "Done",
        target: 29,
        limit: 24,
        reviewer: "Eddie Lake",
        order: 2,
    },
    {
        id: "3",
        header: "Executive summary",
        sectionType: "Narrative",
        status: "Done",
        target: 10,
        limit: 13,
        reviewer: "Eddie Lake",
        order: 3,
    },
    {
        id: "4",
        header: "Technical approach",
        sectionType: "Narrative",
        status: "Done",
        target: 27,
        limit: 23,
        reviewer: "Jamik Tashpulatov",
        order: 4,
    },
    {
        id: "5",
        header: "Design",
        sectionType: "Narrative",
        status: "In Progress",
        target: 2,
        limit: 16,
        reviewer: "Jamik Tashpulatov",
        order: 5,
    },
    {
        id: "6",
        header: "Capabilities",
        sectionType: "Narrative",
        status: "In Progress",
        target: 20,
        limit: 8,
        reviewer: "Jamik Tashpulatov",
        order: 6,
    },
    {
        id: "7",
        header: "Integration with existing systems",
        sectionType: "Narrative",
        status: "In Progress",
        target: 19,
        limit: 21,
        reviewer: "Jamik Tashpulatov",
        order: 7,
    },
    {
        id: "8",
        header: "Innovation and Advantages",
        sectionType: "Narrative",
        status: "Done",
        target: 25,
        limit: 26,
        reviewer: "Jamik Tashpulatov",
        order: 8,
    },
    {
        id: "9",
        header: "Overview of EMR's Innovative Solutions",
        sectionType: "Technical content",
        status: "Done",
        target: 7,
        limit: 23,
        reviewer: "Jamik Tashpulatov",
        order: 9,
    },
    {
        id: "10",
        header: "Advanced Algorithms and Machine Learning",
        sectionType: "Narrative",
        status: "Done",
        target: 30,
        limit: 28,
        reviewer: "Jamik Tashpulatov",
        order: 10,
    },
];

export const defaultColumns: ColumnDef[] = [
    { id: "header", label: "Header", visible: true },
    { id: "sectionType", label: "Section Type", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "target", label: "Target", visible: true },
    { id: "limit", label: "Limit", visible: true },
    { id: "reviewer", label: "Reviewer", visible: true },
];