import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Building2,
  FileText,
  HelpCircle,
  Info,
  MessageSquare,
  Newspaper,
  Shield,
  Users,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

const docsSections = [
  {
    title: "About EcoShare",
    description: "Learn about our mission, values, and the team behind EcoShare",
    items: [
      {
        title: "About Us",
        description: "Our story and commitment to sustainable food sharing",
        href: "/docs/about-us",
        icon: Info,
      },
      {
        title: "Our Mission",
        description: "How we're transforming waste into opportunity",
        href: "/docs/our-mission",
        icon: Building2,
      },
      {
        title: "Team",
        description: "Meet the people making EcoShare happen",
        href: "/docs/team",
        icon: Users,
      },
    ],
  },
  {
    title: "News & Updates",
    description: "Stay informed with our latest announcements and insights",
    items: [
      {
        title: "Press",
        description: "Media coverage and press releases",
        href: "/docs/press",
        icon: Newspaper,
      },
      {
        title: "Blog",
        description: "Articles, tips, and sustainability insights",
        href: "/docs/blog",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "Help & Support",
    description: "Get the assistance you need to make the most of EcoShare",
    items: [
      {
        title: "Help Center",
        description: "Guides, tutorials, and troubleshooting",
        href: "/docs/help-center",
        icon: HelpCircle,
      },
      {
        title: "Contact Us",
        description: "Reach out to our support team",
        href: "/docs/contact-us",
        icon: MessageSquare,
      },
      {
        title: "FAQs",
        description: "Answers to commonly asked questions",
        href: "/docs/faqs",
        icon: FileText,
      },
      {
        title: "Community Guidelines",
        description: "Rules and best practices for our community",
        href: "/docs/community-guidelines",
        icon: Shield,
      },
    ],
  },
  {
    title: "Legal & Privacy",
    description: "Important legal information and policies",
    items: [
      {
        title: "Privacy Policy",
        description: "How we protect and use your data",
        href: "/docs/privacy-policy",
        icon: Shield,
      },
      {
        title: "Terms of Use",
        description: "Rules for using EcoShare platform",
        href: "/docs/terms-of-use",
        icon: FileText,
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Documentation Hub</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Welcome to the EcoShare Documentation Hub. Here you'll find everything you need to know about our platform,
          from getting started guides to detailed information about our mission and policies.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {docsSections.map((section) => (
          <Card key={section.title} className="h-fit">
            <CardHeader>
              <CardTitle className="text-xl">{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item) => (
                <div key={item.title} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={item.href}>
                      <Button variant="link" className="h-auto p-0 text-left justify-start">
                        <span className="font-medium">{item.title}</span>
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Need More Help?</h3>
            <p className="text-muted-foreground">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <Link href="/docs/contact-us">
              <Button>
                Contact Support
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
