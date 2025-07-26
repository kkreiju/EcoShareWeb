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
    <section className="py-20 sm:py-32">
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
