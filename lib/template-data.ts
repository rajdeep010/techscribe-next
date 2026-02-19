import { Expert, GradientCtaData, FAQ, HeroData, HowItWorksData } from "./types";

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