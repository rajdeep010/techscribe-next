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

export type UserRole = "admin" | "user";

export type User = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    dob?: string;
    language?: string;
};

export type UserState = {
    user: User | null;
    isLoading: boolean;
    error: string | null;
};

export type UserAction =
    | { type: "SET_USER"; payload: User }
    | { type: "UPDATE_USER"; payload: Partial<User> }
    | { type: "LOGOUT" }
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string };

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

export type SettingsTab = "profile" | "account" | "appearance" | "notifications" | "display";

export type UserSettings = {
    profile: {
        username: string;
        email: string;
        bio: string;
        urls: string[];
        avatar?: string;
    };
    account: {
        twoFactorEnabled: boolean;
        sessionTimeout: string;
    };
    appearance: {
        theme: "light" | "dark" | "system";
        accentColor: string;
    };
    notifications: {
        emailNotifications: boolean;
        pushNotifications: boolean;
        weeklyDigest: boolean;
    };
    display: {
        language: string;
        timezone: string;
        dateFormat: string;
    };
};

export type UserProfile = {
    name: string;
    email: string;
    dateOfBirth: string;
    language: string;
    avatar?: string;
};

export type SettingsTab = "profile" | "account" | "appearance" | "notifications" | "display";


export type AnalyticsMetric = {
    title: string;
    subtitle: string;
    value: string | number;
    change: string;
    trend: "up" | "down";
    icon?: "bar" | "line" | "dollar" | "trophy";
    chartData?: { value: number }[];
};

export type LeadSource = {
    name: string;
    value: number;
    color: string;
};

export type ProjectProgress = {
    name: string;
    progress: number;
    target: number;
    status: "above" | "below";
};

export type AnalyticsData = {
    metrics: AnalyticsMetric[];
    leadSources: LeadSource[];
    projectProgress: ProjectProgress[];
    revenueGrowth: ChartDataPoint[];
    averageProgress: number;
    projectsAboveTarget: number;
};


// ...existing types...

export type AuditSubtype = "create" | "edit" | "delete";

export type AuditLog = {
    id: string;
    type: string;
    subtype: AuditSubtype;
    value: string;
    user: string;
    time: string;
    timestamp: number; // For sorting
};

export type AuditFilters = {
    search: string;
    subtypes: AuditSubtype[];
    users: string[];
};

export type ColumnVisibility = {
    id: boolean;
    type: boolean;
    subtype: boolean;
    value: boolean;
    user: boolean;
    time: boolean;
};