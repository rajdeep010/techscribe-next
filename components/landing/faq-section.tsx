import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { faqsData } from "@/lib/template-data";

export function FAQSection() {
    const midpoint = Math.ceil(faqsData.length / 2);
    const leftColumn = faqsData.slice(0, midpoint);
    const rightColumn = faqsData.slice(midpoint);

    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
                <div className="mt-3 text-lg text-muted-foreground">
                    Everything you need to know about our assignment help services.
                </div>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
                <div>
                    <Accordion type="single" collapsible className="space-y-4">
                        {leftColumn.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`left-${index}`}
                                className="rounded-lg border bg-card px-6 py-2 shadow-sm transition-all hover:shadow-md"
                            >
                                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 text-sm leading-relaxed text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
                <div>
                    <Accordion type="single" collapsible className="space-y-4">
                        {rightColumn.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`right-${index}`}
                                className="rounded-lg border bg-card px-6 py-2 shadow-sm transition-all hover:shadow-md"
                            >
                                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="pt-2 text-sm leading-relaxed text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}