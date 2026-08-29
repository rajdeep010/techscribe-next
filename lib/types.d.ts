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
    icon: "sparkles" | "rocket";
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
    trustBadges?: {
        icon: string;
        label: string;
    }[];
    showForm?: boolean;
};

export type StatItem = {
    icon: string;
    value: string;
    label: string;
};

export type PainPoint = {
    icon: string;
    label: string;
};

export type AcademicService = {
    icon: string;
    title: string;
    description: string;
    href?: string;
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
    username: string;
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

export type SupportTicketCategory = "general" | "billing" | "technical" | "account";
export type SupportTicketStatus = "open" | "in-progress" | "resolved";
export type AdminSupportFilter = "all" | SupportTicketStatus;

export type SupportTicketItem = {
    id: string;
    userId: string;
    username: string;
    email: string;
    role: UserRole;
    subject: string;
    category: SupportTicketCategory;
    message: string;
    status: SupportTicketStatus;
    createdAt: string;
    updatedAt: string;
};

export type AdminSupportState = {
    tickets: SupportTicketItem[];
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
    statusFilter: AdminSupportFilter;
};

export type AdminSupportAction =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_TICKETS"; payload: SupportTicketItem[] }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "SET_SEARCH_QUERY"; payload: string }
    | { type: "SET_STATUS_FILTER"; payload: AdminSupportFilter };


export type UserSupportFilter = "all" | SupportTicketStatus;

export type UserSupportState = {
    tickets: SupportTicketItem[];
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
    statusFilter: UserSupportFilter;
    resolvingTicketId: string | null;
};

export type UserSupportAction =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_TICKETS"; payload: SupportTicketItem[] }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "SET_SEARCH_QUERY"; payload: string }
    | { type: "SET_STATUS_FILTER"; payload: UserSupportFilter }
    | { type: "SET_RESOLVING_TICKET"; payload: string | null }
    | { type: "MARK_TICKET_RESOLVED"; payload: { ticketId: string; resolvedAt?: string } };


export type AdminUserListItem = {
    id: string;
    name: string;
    username: string;
    email: string;
    role: UserRole;
    isVerified: boolean;
    location?: string;
    avatar?: string;
    createdAt: string;
    updatedAt: string;
};

export type AdminUserRoleFilter = "all" | UserRole;
export type AdminUserVerificationFilter = "all" | "verified" | "unverified";

export type AdminUsersState = {
    users: AdminUserListItem[];
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
    roleFilter: AdminUserRoleFilter;
    verificationFilter: AdminUserVerificationFilter;
    promotingUserId: string | null;
};

export type AdminUsersAction =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_USERS"; payload: AdminUserListItem[] }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "SET_SEARCH_QUERY"; payload: string }
    | { type: "SET_ROLE_FILTER"; payload: AdminUserRoleFilter }
    | { type: "SET_VERIFICATION_FILTER"; payload: AdminUserVerificationFilter }
    | { type: "SET_PROMOTING_USER"; payload: string | null }
    | { type: "PROMOTE_USER"; payload: { userId: string } };


export type AssignmentStatus =
    | "submitted"
    | "under-review"
    | "assigned"
    | "in-progress"
    | "awaiting-user"
    | "delivered"
    | "completed"
    | "cancelled"
    | "archived";

export type AssignmentReviewer = {
    id: string;
    name: string;
    username: string;
} | null;

export type AssignmentFileItem = {
    id: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    sizeLabel: string;
    status: "active" | "replaced" | "locked" | "pending-delete" | "deleted";
    createdAt: string;
    downloadUrl: string;
};

export type AssignmentListItem = {
    id: string;
    title: string;
    description: string;
    subject: string;
    deliveryDeadline: string;
    status: AssignmentStatus;
    fileCount: number;
    totalFileSizeBytes: number;
    assignedReviewer: AssignmentReviewer;
    createdAt: string;
    updatedAt: string;
};

export type AssignmentDetailItem = AssignmentListItem & {
    files: AssignmentFileItem[];
};

export type UserAssignmentsState = {
    assignments: AssignmentListItem[];
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
    creatingAssignment: boolean;
    uploadingForAssignmentId: string | null;
};

export type UserAssignmentsAction =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ASSIGNMENTS"; payload: AssignmentListItem[] }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "SET_SEARCH_QUERY"; payload: string }
    | { type: "SET_CREATING_ASSIGNMENT"; payload: boolean }
    | { type: "SET_UPLOADING_ASSIGNMENT"; payload: string | null }
    | { type: "ADD_ASSIGNMENT"; payload: AssignmentListItem };

export type AdminAssignmentListItem = AssignmentListItem & {
    user: {
        id: string;
        name: string;
        username: string;
        email: string;
    };
};

export type AdminAssignmentsState = {
    assignments: AdminAssignmentListItem[];
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
    assigningAssignmentId: string | null;
};

export type AdminAssignmentsAction =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ASSIGNMENTS"; payload: AdminAssignmentListItem[] }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "SET_SEARCH_QUERY"; payload: string }
    | { type: "SET_ASSIGNING_ASSIGNMENT"; payload: string | null }
    | { type: "ASSIGN_REVIEWER"; payload: { assignmentId: string; reviewer: NonNullable<AssignmentReviewer>; status: AssignmentStatus } };