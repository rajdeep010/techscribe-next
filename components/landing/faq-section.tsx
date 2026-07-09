import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { faqsData } from "@/lib/template-data";
import { HelpCircle, ShieldCheck } from "lucide-react";

export function FAQSection() {
    const midpoint = Math.ceil(faqsData.length / 2);
    const leftColumn = faqsData.slice(0, midpoint);
    const rightColumn = faqsData.slice(midpoint);

    return (
        <section className="mx-auto max-w-6xl rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/6 via-emerald-500/6 to-background px-4 py-8 sm:px-6 dark:border-primary/25 dark:from-primary/10 dark:via-emerald-400/8">
            <div className="mb-12 text-center">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
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
                                className="rounded-lg border border-primary/20 bg-card/90 px-6 py-2 shadow-sm transition-all hover:border-emerald-500/35 hover:shadow-md dark:border-primary/25 dark:hover:border-emerald-400/40"
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
                                className="rounded-lg border border-primary/20 bg-card/90 px-6 py-2 shadow-sm transition-all hover:border-cyan-500/35 hover:shadow-md dark:border-primary/25 dark:hover:border-cyan-400/40"
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