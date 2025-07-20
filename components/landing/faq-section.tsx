import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does EcoShare work?",
    answer:
      "EcoShare connects people with compostable waste to those who can use it. Simply sign up, post a listing, or browse what's available in your area.",
  },
  {
    question: "Who can use EcoShare?",
    answer:
      "Anyone! Whether you're a homeowner with food scraps, a restaurant with kitchen waste, or a farmer looking for compostable material — EcoShare is for you.",
  },
  {
    question: "What kinds of materials can I share?",
    answer:
      "You can share compostable food scraps, vegetable waste, animal manure, yard trimmings, and other biodegradable materials suitable for composting.",
  },
  {
    question: "How do I find people near me?",
    answer:
      "EcoShare uses location-based matching to help you find nearby users who are either offering or requesting compostable materials.",
  },
  {
    question: "Is it safe to meet up with other users?",
    answer:
      "Yes, user verification and in-app messaging help ensure safe and clear communication. Always coordinate exchanges in safe, public locations when possible.",
  },
  {
    question: "Can I switch roles from giver to receiver?",
    answer:
      "Yes, you can switch roles at any time through your account settings — whether you want to donate waste or request compostables.",
  },
];

export function FaqSection() {
  return (
    <section className="py-20 sm:py-32 bg-background-secondary">
      <div className="section-container">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium">
            ❓ FAQ
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Got questions about EcoShare? We've got you covered. If you don't
            see your question here, feel free to reach out to our team.
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
