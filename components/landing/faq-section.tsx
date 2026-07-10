import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { faqsData } from "@/lib/template-data";
import { HelpCircle, ShieldCheck } from "lucide-react";

export function FAQSection() {
    const midpoint = Math.ceil(faqsData.length / 2);
    const leftColumn = faqsData.slice(0, midpoint);
    const rightColumn = faqsData.slice(midpoint);

    return (
        <section className="mx-auto max-w-6xl rounded-3xl border border-primary/15 bg-background/95 px-4 py-8 shadow-[0_14px_34px_-22px_hsl(var(--primary)/0.7),0_6px_14px_-10px_hsl(var(--primary)/0.35)] sm:px-6 dark:border-primary/30 dark:bg-card/95 dark:shadow-[0_18px_40px_-22px_hsl(var(--primary)/0.85),0_8px_18px_-10px_hsl(var(--primary)/0.5)]">
            <div className="mb-12 text-center">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-300">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Quick Answers
                </div>
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