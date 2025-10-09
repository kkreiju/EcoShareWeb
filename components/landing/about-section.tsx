import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Heart, Lightbulb } from "lucide-react";
import Image from "next/image";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To empower individuals and communities through responsible food waste sharing — turning everyday waste into opportunities for growth.",
  },
  {
    icon: Heart,
    title: "Our Values",
    description:
      "We stand for sustainability, collaboration, and local impact — believing small actions create big change.",
  },
  {
    icon: Lightbulb,
    title: "Our Vision",
    description:
      "To become the leading platform connecting people and places in the movement for zero-waste, community-driven agriculture.",
  },
];

export function AboutSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32 bg-gradient-to-br from-background-secondary via-background-secondary to-primary/5">
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
              <pattern id="grid-about" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-about)" />
          </svg>
        </div>

        {/* Floating dots */}
        <div className="absolute top-16 left-16 w-2 h-2 bg-primary/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-secondary/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-accent/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 right-16 w-1 h-1 bg-primary/20 rounded-full animate-bounce delay-500"></div>
      </div>
      <div className="mx-auto px-4 md:px-12 max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-sm font-medium">
                🌟 About Us
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Growing a Greener Future —{" "}
                <span className="text-primary">Together</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Since launching in 2020, EcoShare has been committed to
                transforming how communities handle food waste. With over 10,000
                eco-conscious users and growing, we&apos;re proud to lead the
                way in sustainable, community-powered solutions.
              </p>
            </div>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
              {values.map((value, index) => (
                <Card key={index} className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                        <value.icon className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{value.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button size="lg">Learn More About Us</Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 blur-3xl"></div>
            <Image
              src="/images/img_farm.jpg"
              alt="Sustainable Farming"
              width={600}
              height={600}
              className="relative rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
