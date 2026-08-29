import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { faqsData } from "@/lib/template-data";
import { HelpCircle } from "lucide-react";
import { SectionHeading } from "./section-heading";

export function FAQSection() {
    const midpoint = Math.ceil(faqsData.length / 2);
    const leftColumn = faqsData.slice(0, midpoint);
    const rightColumn = faqsData.slice(midpoint);

    return (
        <section id="faq" className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6">
            <SectionHeading
                title="Frequently Asked Questions"
                description="Everything you need to know about our assignment help services."
                className="mb-12"
            />
            <div className="grid gap-8 md:grid-cols-2">
                <div>
                    <Accordion type="single" collapsible className="space-y-4">
                        {leftColumn.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`left-${index}`}
                                className="rounded-lg border border-primary/20 bg-card/90 px-6 py-2 shadow-sm transition-all hover:border-violet-500/35 hover:shadow-md dark:border-primary/25 dark:hover:border-violet-400/40"
                            >
                                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                                    <span className="inline-flex items-start gap-2">
                                        <HelpCircle className="mt-0.5 h-4 w-4 text-primary" />
                                        {faq.question}
                                    </span>
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
                                className="rounded-lg border border-primary/20 bg-card/90 px-6 py-2 shadow-sm transition-all hover:border-violet-500/35 hover:shadow-md dark:border-primary/25 dark:hover:border-violet-400/40"
                            >
                                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                                    <span className="inline-flex items-start gap-2">
                                        <HelpCircle className="mt-0.5 h-4 w-4 text-primary" />
                                        {faq.question}
                                    </span>
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