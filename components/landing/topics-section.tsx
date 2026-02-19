import { Card, CardContent } from "@/components/ui/card";

const topics = [
    {
        title: "Essay Writing",
        description: "Compelling essays with strong arguments and proper structure."
    },
    {
        title: "Research Papers",
        description: "In-depth research with credible sources and citations."
    },
    {
        title: "Thesis Assistance",
        description: "Comprehensive thesis support from proposal to defense."
    },
    {
        title: "Dissertation Help",
        description: "End-to-end guidance for your doctoral dissertation."
    },
    {
        title: "Case Studies",
        description: "Detailed analysis with real-world applications and insights."
    },
    {
        title: "Coursework Help",
        description: "Complete coursework solutions across all subjects."
    },
    {
        title: "Editing & Proofreading",
        description: "Polishing your work to perfection with expert reviews."
    },
    {
        title: "Presentation Preparation",
        description: "Professional slides and speaker notes for impactful delivery."
    },
    {
        title: "Programming Assignments",
        description: "Clean, documented code in Python, Java, C++, and more."
    },
    {
        title: "Statistics Projects",
        description: "Data analysis, SPSS, R, and statistical modeling support."
    },
];

export function TopicsSection() {
    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight">Topics We Cover</h2>
                <p className="mt-2 text-lg text-muted-foreground">
                    Expert assistance across 100+ subjects and academic levels.
                </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic) => (
                    <Card key={topic.title} className="transition-all hover:shadow-md hover:border-primary/50">
                        <CardContent className="p-6">
                            <h3 className="text-base font-bold">{topic.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                {topic.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}