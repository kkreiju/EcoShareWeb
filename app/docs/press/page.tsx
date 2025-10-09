import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, ExternalLink, Calendar, User } from "lucide-react";

const pressReleases = [
  {
    title: "EcoShare Launches Revolutionary Food Waste Reduction Platform",
    date: "October 1, 2025",
    outlet: "Philippine Daily Inquirer",
    excerpt: "EcoShare introduces innovative platform connecting food waste generators with farmers...",
    link: "#",
  },
  {
    title: "From Waste to Worth: How EcoShare is Transforming Philippine Agriculture",
    date: "September 15, 2025",
    outlet: "Manila Bulletin",
    excerpt: "Local startup EcoShare reaches 5,000 users in just six months...",
    link: "#",
  },
  {
    title: "Sustainability Tech: EcoShare Wins Green Innovation Award",
    date: "August 20, 2025",
    outlet: "Rappler",
    excerpt: "EcoShare recognized for outstanding contribution to environmental sustainability...",
    link: "#",
  },
];

const mediaKit = [
  {
    title: "Company Logo & Branding",
    description: "High-resolution logos in various formats",
    type: "Download",
  },
  {
    title: "Founder Photos",
    description: "Professional headshots and team photos",
    type: "Download",
  },
  {
    title: "Product Screenshots",
    description: "Platform screenshots for media use",
    type: "Download",
  },
  {
    title: "Press Release Template",
    description: "Template for writing about EcoShare",
    type: "Download",
  },
];

export default function PressPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Badge variant="secondary" className="w-fit">
          Press & Media
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Press Center</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Latest news, press releases, and media resources about EcoShare.
          Journalists and media outlets can find everything they need here.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest Press Releases</CardTitle>
          <CardDescription>
            Our most recent announcements and news coverage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pressReleases.map((release, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Newspaper className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-2">{release.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{release.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{release.outlet}</span>
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">{release.excerpt}</p>
                  <a
                    href={release.link}
                    className="inline-flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
                  >
                    <span>Read Full Article</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media Kit</CardTitle>
          <CardDescription>
            Download logos, photos, and other assets for media use
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {mediaKit.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
                <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                  {item.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Press Contact</CardTitle>
          <CardDescription>
            Get in touch with our press team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Media Inquiries</h4>
              <p className="text-muted-foreground text-sm mb-2">
                For press releases, interviews, or media requests:
              </p>
              <p className="font-medium">press@ecoshare.ph</p>
              <p className="text-muted-foreground text-sm">Response within 24 hours</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Company Information</h4>
              <p className="text-muted-foreground text-sm mb-2">
                For partnership or business inquiries:
              </p>
              <p className="font-medium">hello@ecoshare.ph</p>
              <p className="text-muted-foreground text-sm">General business contact</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Newspaper className="h-8 w-8 text-primary mx-auto" />
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Subscribe to our press mailing list to receive the latest EcoShare news,
              press releases, and media updates directly in your inbox.
            </p>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              Subscribe to Press Updates
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
