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