import { Expert, GradientCtaData, FAQ, HeroData, HowItWorksData, ColumnDef, TabItem, DocumentRow, StatItem, PainPoint, AcademicService } from "./types";
import { CONTACT_INFO } from "./site-content/contact-info";

export const heroData: HeroData = {
    eyebrow: "Trusted by 50,000+ Students Worldwide",
    title: "Trusted Academic Support for Ambitious Students",
    description: "Expert help with reports, presentations, research, referencing, and dissertation support—delivered on time, every time.",
    primaryCta: {
        label: "Get Free Brief Check",
        href: "/contact",
    },
    secondaryCta: {
        label: "WhatsApp Us",
        href: CONTACT_INFO.whatsappLink,
    },
    stats: {
        rating: "4.9 Rated",
        orders: "50,000+ Happy Students",
        support: "24/7 Live Support",
    },
    trustBadges: [
        { icon: "award", label: "Top 1% Academic Experts" },
        { icon: "shield-check", label: "Plagiarism Free Work" },
        { icon: "clock", label: "On-Time, Every Time" },
    ],
    showForm: true,
};

export const statsBarData: StatItem[] = [
    { icon: "users", value: "2500+", label: "Students Supported" },
    { icon: "star", value: "4.8/5", label: "Student Rating" },
    { icon: "headphones", value: "24/7", label: "Support" },
    { icon: "trending-up", value: "98%", label: "On-Time Delivery" },
    { icon: "shield-check", value: "100%", label: "Confidential Process" },
];

export const painPointsData: PainPoint[] = [
    { icon: "clock", label: "Tight deadlines and heavy workload" },
    { icon: "bar-chart", label: "Complex topics and unfamiliar subjects" },
    { icon: "pen-line", label: "Referencing and formatting challenges" },
    { icon: "file-check", label: "Plagiarism risks and quality concerns" },
    { icon: "user-circle", label: "Balancing studies with work and life" },
];

export const academicServicesData: AcademicService[] = [
    {
        icon: "book-open",
        title: "Assignment Help",
        description:
            "High-quality, original assignments tailored to your requirements, subject, and academic level. Every task is matched with a specialist who understands your course and marking criteria.",
        href: "/contact?service=assignment-help",
    },
    {
        icon: "microscope",
        title: "Research & Reports",
        description:
            "Well-researched reports with credible sources, clear structure, and data-backed insights. We handle everything from literature reviews to full analytical reports.",
        href: "/contact?service=research-reports",
    },
    {
        icon: "graduation-cap",
        title: "Dissertation Help",
        description:
            "End-to-end dissertation support from proposal and literature review through methodology, analysis, and final submission — guided by subject-matter experts.",
        href: "/contact?service=dissertation-help",
    },
    {
        icon: "presentation",
        title: "Presentation (PPT)",
        description:
            "Engaging, well-structured presentation decks with clear visuals and speaker notes that make your ideas easy to follow and impressive to present.",
        href: "/contact?service=presentation",
    },
    {
        icon: "quote",
        title: "Referencing",
        description:
            "Accurate, consistent referencing and citations in Harvard, APA, MLA, Chicago, and more — checked line by line against your university's style guide.",
        href: "/contact?service=referencing",
    },
    {
        icon: "spell-check",
        title: "Editing & Proofreading",
        description:
            "Line-by-line polishing for grammar, structure, clarity, and academic tone, so your final submission reads with confidence and precision.",
        href: "/contact?service=editing-proofreading",
    },
];

export const whyChooseUsChecklist: string[] = [
    "Experienced academics with advanced degrees",
    "100% original, plagiarism-free content",
    "Customized solutions tailored to your requirements",
    "On-time delivery, every time",
    "24/7 support via WhatsApp, chat & email",
    "Safe, secure and confidential process",
    "Affordable pricing with value for money",
];

export const howItWorksData: HowItWorksData = {
    eyebrow: "Simple Process",
    title: "How It Works",
    description: "Get your assignments done in six simple steps. Fast, secure, and hassle-free from start to finish.",
    steps: [
        {
            icon: "file-edit",
            step: "1",
            title: "Submit Your Brief",
            description: "Share your assignment details and upload your brief or rubric.",
        },
        {
            icon: "user-check",
            step: "2",
            title: "Expert Assigned",
            description: "We assign the best expert based on your subject and needs.",
        },
        {
            icon: "message-square",
            step: "3",
            title: "Work in Progress",
            description: "Stay updated with regular progress and communication.",
        },
        {
            icon: "clipboard-check",
            step: "4",
            title: "Quality Check",
            description: "Rigorous quality and plagiarism checks for error-free work.",
        },
        {
            icon: "send",
            step: "5",
            title: "On-Time Delivery",
            description: "Receive your completed work before the deadline.",
        },
        {
            icon: "thumbs-up",
            step: "6",
            title: "Your Success",
            description: "Submit with confidence and achieve better results.",
        },
    ],
    cta: {
        label: "Get Started Now",
        href: "/contact",
    },
};

export const gradientCtaData: GradientCtaData = {
    title: "Ready to Achieve Academic Excellence?",
    description: "Get your assignment brief checked for free and take the first step toward better grades and less stress.",
    primaryCta: {
        label: "Get Free Brief Check",
        href: "/contact",
    },
    secondaryCta: {
        label: "WhatsApp Us",
        href: CONTACT_INFO.whatsappLink,
    },
    icon: "rocket",
    gradientClassName: "from-primary via-primary to-violet-700",
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
