import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, CheckCircle } from "lucide-react";

const benefits = [
  "Practical composting and gardening tips",
  "EcoShare feature updates and news",
  "Community stories and success highlights",
  "Early access to new tools and improvements",
];

export function NewsletterSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32 bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Decorative grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid-newsletter" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-newsletter)" />
          </svg>
        </div>

        {/* Floating dots */}
        <div className="absolute top-16 left-16 w-2 h-2 bg-primary/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-secondary/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-accent/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 right-16 w-1 h-1 bg-primary/20 rounded-full animate-bounce delay-500"></div>
      </div>
      <div className="mx-auto px-4 md:px-12 max-w-7xl">
        <Card className="max-w-4xl mx-auto border-0 shadow-2xl">
          <CardContent className="p-8 sm:p-12">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mx-auto">
                  <Mail className="h-8 w-8 text-primary-foreground" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Stay in the loop
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Subscribe to the EcoShare newsletter and get the latest
                  updates, composting tips, and sustainability insights
                  delivered straight to your inbox.
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-chart-4 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="max-w-md mx-auto">
                <form className="flex flex-col gap-4 sm:flex-row">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1"
                    required
                  />
                  <Button type="submit" size="lg">
                    Subscribe
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-3">
                  We respect your privacy and you can unsubscribe anytime. No
                  spam — just meaningful content for a greener future.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
