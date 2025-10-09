import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, UserPlus, FileText, Truck, CreditCard, Shield } from "lucide-react";

const faqCategories = [
  {
    icon: UserPlus,
    title: "Getting Started",
    faqs: [
      {
        question: "How do I create an EcoShare account?",
        answer: "Click the 'Get Started for Free' button on our homepage, fill out the registration form with your email and basic information, and verify your account through the confirmation email we send you."
      },
      {
        question: "Is EcoShare free to use?",
        answer: "Yes! Basic account creation and browsing listings is completely free. We charge a small service fee only on successful transactions to help maintain and improve our platform."
      },
      {
        question: "What types of accounts can I create?",
        answer: "You can create either a 'Generator' account (for sharing compostable materials) or a 'Receiver' account (for finding compost materials). Many users maintain both types of accounts."
      },
      {
        question: "How do I verify my account?",
        answer: "After registration, check your email for a verification link. Click the link to confirm your account. You may also need to provide additional verification for certain features."
      }
    ]
  },
  {
    icon: FileText,
    title: "Using the Platform",
    faqs: [
      {
        question: "How do I create a listing?",
        answer: "Log in to your account, click 'Create Listing', fill in details about your compostable materials (type, quantity, location, pickup preferences), add photos, and publish your listing."
      },
      {
        question: "How does the matching system work?",
        answer: "Our algorithm matches generators with receivers based on location, material type, quantity, and user preferences. You'll receive notifications when compatible matches are found."
      },
      {
        question: "Can I edit or delete my listings?",
        answer: "Yes, you can edit active listings at any time from your dashboard. Deleted listings are permanently removed and cannot be recovered."
      },
      {
        question: "How do I communicate with other users?",
        answer: "Use our built-in messaging system to contact other verified users. All communications are monitored to ensure safety and compliance with our community guidelines."
      }
    ]
  },
  {
    icon: Truck,
    title: "Pickups & Transactions",
    faqs: [
      {
        question: "How do I arrange a pickup?",
        answer: "After connecting with another user, coordinate pickup details through our messaging system. Include preferred times, locations, and any special instructions."
      },
      {
        question: "What happens during a transaction?",
        answer: "Once you agree on terms, the transaction is processed through our secure system. You'll receive confirmation, and our service fee will be deducted from the payment."
      },
      {
        question: "What if there's an issue with my pickup?",
        answer: "Contact the other party first to resolve the issue. If you can't reach a resolution, contact our support team with details about the transaction."
      },
      {
        question: "Are transactions insured or guaranteed?",
        answer: "While we verify all users and provide a secure platform, transactions occur between users. We recommend meeting in public spaces and following our safety guidelines."
      }
    ]
  },
  {
    icon: CreditCard,
    title: "Billing & Payments",
    faqs: [
      {
        question: "When am I charged?",
        answer: "You're only charged when a transaction is successfully completed. Our service fee is calculated based on the transaction value and your account type."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept major credit cards, debit cards, and digital wallets through our secure payment processor, Stripe."
      },
      {
        question: "Can I get a refund?",
        answer: "Refunds are handled on a case-by-case basis. Contact support if you believe a refund is warranted, and we'll review your situation."
      },
      {
        question: "How do I view my transaction history?",
        answer: "Access your transaction history in the 'Billing' section of your account dashboard, where you can view, download, and dispute transactions."
      }
    ]
  },
  {
    icon: Shield,
    title: "Safety & Security",
    faqs: [
      {
        question: "Is EcoShare safe to use?",
        answer: "Yes, we implement multiple security measures including user verification, encrypted communications, and secure payment processing to protect our users."
      },
      {
        question: "How do you verify users?",
        answer: "All users go through email verification, and higher-volume accounts may require additional verification such as ID checks or business documentation."
      },
      {
        question: "What should I do if I feel unsafe?",
        answer: "Trust your instincts. Cancel any arrangements that make you uncomfortable, meet in public spaces, and report concerning behavior to our support team immediately."
      },
      {
        question: "How do I report suspicious activity?",
        answer: "Use the 'Report' button on user profiles or listings, or contact support directly. All reports are investigated promptly."
      }
    ]
  }
];

export default function FAQsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Badge variant="secondary" className="w-fit">
          FAQs
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Find quick answers to the most common questions about EcoShare.
          Can't find what you're looking for? Contact our support team.
        </p>
      </div>

      <div className="grid gap-6">
        {faqCategories.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <category.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription>
                    {category.faqs.length} questions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {category.faqs.map((faq, faqIndex) => (
                  <AccordionItem key={faqIndex} value={`item-${index}-${faqIndex}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <HelpCircle className="h-8 w-8 text-primary mx-auto" />
            <h3 className="text-lg font-semibold">Still Need Help?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help with any questions
              or issues you might have.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge variant="outline" className="cursor-pointer">
                📧 ecoshare.admn@gmail.com
              </Badge>
              <Badge variant="outline" className="cursor-pointer">
                💬 Live Chat
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
