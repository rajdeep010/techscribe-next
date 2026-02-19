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