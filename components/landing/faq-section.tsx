import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqs = [
    {
        question: "What subjects do you cover?",
        answer: "We cover a wide range of subjects including Math, Science, Literature, and more. If you have a specific subject in mind, feel free to ask!"
    },
    {
        question: "How do I place an order?",
        answer: "You can place an order by filling out our order form on the website. It’s quick and easy!"
    },
    {
        question: "What is your revision policy?",
        answer: "We offer free revisions within a specified timeframe after the delivery of your work. Your satisfaction is our priority."
    },
    {
        question: "Are your services confidential?",
        answer: "Yes, we guarantee complete confidentiality for all our clients. Your information will never be shared with third parties."
    },
    {
        question: "How do you ensure quality?",
        answer: "Our team consists of experienced professionals who follow a multi-step review process to ensure high-quality work."
    },
];

export function FAQSection() {
    return (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-6">
                <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">Find answers to common questions about our services.</p>
            </div>
            <Accordion type="single" collapsible>
                {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
}