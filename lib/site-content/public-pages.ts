import { expertsData } from "@/lib/template-data";

export const publicServices = [
    {
        title: "Assignment Help",
        description: "End-to-end academic support for essays, reports, case studies, and technical submissions.",
        href: "/contact?service=assignment-help",
    },
    {
        title: "Proofreading",
        description: "Editing for grammar, structure, clarity, citations, and submission polish.",
        href: "/contact?service=proofreading",
    },
    {
        title: "Tutoring",
        description: "One-to-one academic guidance for concepts, revision, and problem solving.",
        href: "/contact?service=tutoring",
    },
];

export const aboutPageData = {
    eyebrow: "Who We Are",
    title: "Academic support built for clarity, speed, and trust",
    description:
        "my assignment help helps students turn confusing assignment requirements into clean, high-quality deliverables. We focus on expert guidance, structured workflows, and dependable support rather than vague promises.",
    highlights: [
        "Clear task intake and guided submission flow",
        "Verified academic support across technical and non-technical subjects",
        "Private file handling with access control and admin review",
    ],
    values: [
        {
            title: "Precision",
            description:
                "We care about requirements, formatting, scope, and academic context. Good work starts with interpreting the brief correctly.",
        },
        {
            title: "Reliability",
            description:
                "Students need consistent communication, realistic timelines, and a workflow they can trust when deadlines are close.",
        },
        {
            title: "Privacy",
            description:
                "Uploaded files, assignment details, and account data are handled with restricted access and controlled delivery flows.",
        },
    ],
};

export const reviewsPageData = {
    eyebrow: "Student Feedback",
    title: "What students value most",
    description:
        "The strongest recurring themes are clarity, turnaround, and confidence in the final submission.",
    metrics: [
        { label: "Average Rating", value: "4.9/5" },
        { label: "Repeat Students", value: "68%" },
        { label: "On-Time Delivery", value: "96%" },
    ],
    testimonials: [
        {
            name: "Maya R.",
            role: "Business Student",
            quote:
                "The biggest difference was clarity. The final work actually matched the rubric and saved me from another rewrite cycle.",
        },
        {
            name: "Daniel K.",
            role: "Computer Science Student",
            quote:
                "I liked the structure more than anything. The process felt organized, the communication was direct, and the result was clean.",
        },
        {
            name: "Sara T.",
            role: "Nursing Student",
            quote:
                "The support felt practical instead of generic. My references, structure, and academic tone were all much stronger.",
        },
        {
            name: "Ethan L.",
            role: "Engineering Student",
            quote:
                "Fast turnaround without the messy formatting issues I usually have to fix myself before submission.",
        },
        {
            name: "Olivia P.",
            role: "Law Student",
            quote:
                "The revision process was straightforward and focused. I did not have to over-explain what needed improvement.",
        },
        {
            name: "Noah J.",
            role: "Finance Student",
            quote:
                "The final draft was sharper, more readable, and much closer to what my professor expects in assessment work.",
        },
    ],
};

export const expertsPageData = {
    eyebrow: "Meet The Experts",
    title: "Specialists across practical academic domains",
    description:
        "Our public experts page should feel selective, not crowded. Start with a curated list and expand only when you have real profile depth.",
    highlights: [
        "Subject-specific expertise",
        "Strong communication and revision handling",
        "Experience with applied academic writing",
    ],
    experts: expertsData,
};

export const contactPageData = {
    eyebrow: "Contact",
    title: "Talk to us before you submit",
    description:
        "Use this page for service enquiries, workflow questions, pricing discussions, and special submission requirements.",
    channels: [
        {
            label: "Email",
            value: "support@myassignmenthelp.com",
            href: "mailto:support@myassignmenthelp.com",
        },
        {
            label: "Phone",
            value: "+1 (555) 123-4567",
            href: "tel:+15551234567",
        },
        {
            label: "Office",
            value: "123 Academic Street, Education City, EC 12345",
            href: "#",
        },
    ],
    faqs: [
        "Need a quote for a deadline-sensitive task",
        "Need help deciding which service fits your task",
        "Need clarification on uploads, revisions, or delivery flow",
    ],
};