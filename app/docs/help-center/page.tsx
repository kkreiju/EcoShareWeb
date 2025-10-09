import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  MessageSquare,
  FileText,
  Search,
  UserPlus,
  Truck,
  MessageCircle,
  Settings,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

const helpCategories = [
  {
    icon: UserPlus,
    title: "Getting Started",
    description: "New to EcoShare? Learn the basics and set up your account",
    articles: [
      "Creating your EcoShare account",
      "Choosing your account type (Generator/Receiver)",
      "Verifying your profile",
      "Setting up notifications",
    ],
  },
  {
    icon: FileText,
    title: "Managing Listings",
    description: "Learn how to create, edit, and manage your compost listings",
    articles: [
      "Creating a new listing",
      "Adding photos and descriptions",
      "Setting pickup preferences",
      "Editing and updating listings",
    ],
  },
  {
    icon: Search,
    title: "Finding & Connecting",
    description: "Discover listings and connect with other users",
    articles: [
      "Browsing available listings",
      "Using search and filters",
      "Contacting listing owners",
      "Scheduling pickups",
    ],
  },
  {
    icon: MessageCircle,
    title: "Communication",
    description: "Master EcoShare's messaging and community features",
    articles: [
      "Using the messaging system",
      "Best practices for communication",
      "Reporting issues or concerns",
      "Community guidelines",
    ],
  },
  {
    icon: Truck,
    title: "Pickups & Delivery",
    description: "Everything about arranging and completing exchanges",
    articles: [
      "Scheduling pickup times",
      "Preparing materials for pickup",
      "Safety guidelines",
      "Completing transactions",
    ],
  },
  {
    icon: Settings,
    title: "Account & Settings",
    description: "Manage your profile, preferences, and account security",
    articles: [
      "Updating your profile",
      "Privacy and security settings",
      "Subscription management",
      "Account deletion",
    ],
  },
];

const quickTips = [
  {
    icon: AlertCircle,
    title: "Safety First",
    tip: "Always verify user identities and meet in public spaces for pickups.",
  },
  {
    icon: BookOpen,
    title: "Quality Matters",
    tip: "Provide detailed descriptions and photos to help receivers assess material quality.",
  },
  {
    icon: MessageSquare,
    title: "Communication is Key",
    tip: "Discuss pickup details, quantities, and expectations before meeting.",
  },
];

export default function HelpCenterPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Badge variant="secondary" className="w-fit">
          Help Center
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">How can we help you?</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Find answers to common questions, learn how to use EcoShare effectively, and get the most
          out of our platform with our comprehensive help resources.
        </p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Search className="h-8 w-8 text-primary mx-auto" />
            <h2 className="text-xl font-semibold">Quick Search</h2>
            <p className="text-muted-foreground">
              Search our help articles, FAQs, and guides to find what you need faster.
            </p>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search help articles..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Browse by Category</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {helpCategories.map((category, index) => (
            <Card key={index} className="h-fit hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <category.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.articles.slice(0, 3).map((article, idx) => (
                    <li key={idx}>
                      <Button variant="link" className="h-auto p-0 text-left justify-start text-sm">
                        {article}
                      </Button>
                    </li>
                  ))}
                  {category.articles.length > 3 && (
                    <li>
                      <Button variant="link" className="h-auto p-0 text-left justify-start text-sm text-primary">
                        View all {category.articles.length} articles →
                      </Button>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Tips for Success</CardTitle>
          <CardDescription>
            Essential tips to help you get the most out of EcoShare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {quickTips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <tip.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{tip.title}</h4>
                  <p className="text-muted-foreground text-sm mt-1">{tip.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>
            Can't find what you're looking for? Our support team is here to help.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">📧 Email Support</h4>
              <p className="text-muted-foreground text-sm">
                Send us an email and we'll get back to you within 24 hours.
              </p>
              <Button variant="outline" size="sm">
                ecoshare.admn@gmail.com
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">💬 Live Chat</h4>
              <p className="text-muted-foreground text-sm">
                Available Monday-Friday, 9AM-5PM PST for immediate assistance.
              </p>
              <Link href="/docs/contact-us">
                <Button size="sm">
                  Start Chat
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto" />
            <h3 className="text-lg font-semibold">New to EcoShare?</h3>
            <p className="text-muted-foreground">
              Start with our beginner's guide to learn the basics and get up and running quickly.
            </p>
            <Button>View Beginner's Guide</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
