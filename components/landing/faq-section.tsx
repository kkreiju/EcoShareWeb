import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does EcoShare connect the community?",
    answer:
      "EcoShare bridges the gap between homeowners, restaurant owners, and livestock farmers (who have waste) with gardeners and farmers (who need organic fertilizer), facilitating a circular agricultural economy.",
  },
  {
    question: "Does EcoShare handle delivery?",
    answer:
      "No, EcoShare does not include a built-in logistics or delivery service. Users are responsible for arranging how to send or receive items with their match.",
  },
  {
    question: "How accurate are the AI recommendations?",
    answer:
      "Our AI tools (Chatbot, Nutrient Diagnostics, Nutrient Builder) are trained on specific datasets. While helpful, they may not always be 100% accurate for unfamiliar plant species or complex scenarios and should not replace expert advice.",
  },
  {
    question: "Is user verification required?",
    answer:
      "Yes, all users must provide accurate information for verification to ensure trustworthy exchanges and a safe community environment.",
  },
  {
    question: "Can I be both a provider and a receiver?",
    answer:
      "Absolutely! Users can switch roles at any time through their settings, allowing you to both donate waste and request compostable materials as needed.",
  },
];

export function FaqSection() {
  return (
    <section className="py-16 sm:py-24 bg-background-secondary">
      <div className="mx-auto px-4 md:px-12 max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium">
            ❓ FAQ
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Got questions about EcoShare? We&apos;ve got you covered. If you
            don&apos;t see your question here, feel free to reach out to our
            team.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border rounded-lg px-6 bg-background"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
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
