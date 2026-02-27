export type GradientCtaData = {
    eyebrow?: string;
    title: string;
    description: string;
    primaryCta: {
        label: string;
        href: string;
    };
    secondaryCta?: {
        label: string;
        href: string;
    };
    icon: "sparkles";
    gradientClassName?: string;
};

export type Expert = {
    name: string;
    profession: string;
    orders: string;
    rating: string;
    about: string;
    image: string;
};

export type FAQ = {
    question: string;
    answer: string;
};

export type HeroData = {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: {
        label: string;
        href: string;
    };
    secondaryCta: {
        label: string;
        href: string;
    };
    stats: {
        rating: string;
        orders: string;
        support: string;
    };
    showForm?: boolean;
};

export type HowItWorksStep = {
    icon: string;
    step: string;
    title: string;
    description: string;
};

export type HowItWorksData = {
    eyebrow: string;
    title: string;
    description: string;
    steps: HowItWorksStep[];
    cta: {
        label: string;
        href: string;
    };
};

export type UserRole = "admin" | "user" | "expert";

export type User = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: UserRole;
};

export type AdminStat = {
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    description: string;
    icon: "dollar-sign" | "users" | "activity" | "trending-up";
};

export type DocumentRow = {
    id: string;
    header: string;
    sectionType: string;
    status: "Done" | "In Progress" | "Pending";
    target: number;
    limit: number;
    reviewer: string;
    order: number;
};

export type TimeFilter = "Last 3 months" | "Last 30 days" | "Last 7 days";

export type ChartDataPoint = {
    date: string;
    value: number;
};

export type DocumentRow = {
    id: string;
    header: string;
    sectionType: string;
    status: "Done" | "In Progress" | "Pending";
    target: number;
    limit: number;
    reviewer: string;
    order: number;
};

export type ColumnDef = {
    id: keyof Omit<DocumentRow, 'id' | 'order'>;
    label: string;
    visible: boolean;
};

export type TabItem = {
    id: string;
    label: string;
    count: number | null;
};