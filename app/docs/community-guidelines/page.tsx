import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle, Users, MessageSquare, Shield } from "lucide-react";

const guidelines = [
  {
    category: "Respect & Communication",
    icon: MessageSquare,
    rules: [
      {
        type: "do",
        title: "Be respectful and professional",
        description: "Treat all users with courtesy and respect, regardless of background or opinions."
      },
      {
        type: "do",
        title: "Communicate clearly and promptly",
        description: "Respond to messages within 24 hours and provide clear information about listings and availability."
      },
      {
        type: "dont",
        title: "Don't use offensive language",
        description: "Avoid profanity, discriminatory language, or any form of harassment."
      },
      {
        type: "dont",
        title: "Don't spam other users",
        description: "Avoid sending unsolicited messages or repeated contact after being ignored."
      }
    ]
  },
  {
    category: "Listing Integrity",
    icon: Users,
    rules: [
      {
        type: "do",
        title: "Provide accurate information",
        description: "Ensure all listing details, photos, and descriptions are truthful and current."
      },
      {
        type: "do",
        title: "Honor your commitments",
        description: "Follow through on agreed pickups and transactions once arrangements are made."
      },
      {
        type: "dont",
        title: "Don't post prohibited materials",
        description: "Only list compostable organic waste. No hazardous, non-organic, or illegal materials."
      },
      {
        type: "dont",
        title: "Don't create fake listings",
        description: "All listings must represent real, available materials for exchange."
      }
    ]
  },
  {
    category: "Safety & Security",
    icon: Shield,
    rules: [
      {
        type: "do",
        title: "Meet in safe, public locations",
        description: "Choose well-lit, populated areas for material exchanges when possible."
      },
      {
        type: "do",
        title: "Verify user identities",
        description: "Check user profiles and ratings before meeting, and trust your instincts."
      },
      {
        type: "dont",
        title: "Don't share personal information",
        description: "Avoid sharing home addresses, phone numbers, or other sensitive information."
      },
      {
        type: "dont",
        title: "Don't engage in off-platform transactions",
        description: "All arrangements and payments should be coordinated through EcoShare."
      }
    ]
  }
];

const consequences = [
  {
    level: "Warning",
    description: "First-time minor violations result in a warning and temporary restrictions.",
    color: "yellow"
  },
  {
    level: "Suspension",
    description: "Serious or repeated violations may result in account suspension for 7-30 days.",
    color: "orange"
  },
  {
    level: "Termination",
    description: "Severe violations or multiple suspensions may result in permanent account termination.",
    color: "red"
  }
];

export default function CommunityGuidelinesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Badge variant="secondary" className="w-fit">
          Community Guidelines
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Community Guidelines</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Our community guidelines ensure EcoShare remains a safe, respectful, and productive platform
          for everyone. By using EcoShare, you agree to follow these guidelines.
        </p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Users className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">Building a Better Community</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              EcoShare exists to connect people who care about sustainability. These guidelines help us
              maintain a positive environment where everyone can participate safely and effectively.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {guidelines.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <section.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-xl">{section.category}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {section.rules.map((rule, ruleIndex) => (
                  <div key={ruleIndex} className="flex items-start space-x-3 p-4 rounded-lg border">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      rule.type === 'do' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {rule.type === 'do' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{rule.title}</h4>
                      <p className="text-muted-foreground text-sm mt-1">{rule.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reporting Violations</CardTitle>
          <CardDescription>
            Help us maintain a positive community by reporting inappropriate behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            If you encounter behavior that violates these guidelines, please report it immediately:
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">In-App Reporting</h4>
              <p className="text-muted-foreground text-sm">
                Use the "Report" button on profiles, listings, or messages
              </p>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Email Support</h4>
              <p className="text-muted-foreground text-sm">
                Send details to ecoshare.admn@gmail.com with "REPORT" in the subject
              </p>
            </div>
            <div className="text-center p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Emergency</h4>
              <p className="text-muted-foreground text-sm">
                For immediate safety concerns, call +63 (32) 123-4567
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-primary" />
            <CardTitle>Consequences for Violations</CardTitle>
          </div>
          <CardDescription>
            We take violations seriously and apply fair, escalating consequences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {consequences.map((consequence, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  consequence.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                  consequence.color === 'orange' ? 'bg-orange-100 text-orange-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  <span className="text-sm font-bold">
                    {consequence.level[0]}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold">{consequence.level}</h4>
                  <p className="text-muted-foreground text-sm mt-1">{consequence.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Shield className="h-8 w-8 text-green-600 mx-auto" />
            <h3 className="text-lg font-semibold">Our Commitment</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to maintaining a safe, inclusive, and productive community.
              These guidelines evolve based on community feedback and changing needs.
              Your participation helps make EcoShare better for everyone.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
