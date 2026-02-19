import { Card, CardContent } from "@/components/ui/card";

const topics = [
    "Essay Writing",
    "Research Papers",
    "Thesis Assistance",
    "Dissertation Help",
    "Case Studies",
    "Coursework Help",
    "Editing and Proofreading",
    "Presentation Preparation",
    "Programming Assignments",
    "Statistics Projects",
];

export function TopicsSection() {
    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold">Topics We Cover</h2>
                <p className="text-muted-foreground">Expert assistance across a wide range of subjects.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {topics.map((topic) => (
                    <Card key={topic}>
                        <CardContent className="p-6">
                            <div className="text-lg font-medium">{topic}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}