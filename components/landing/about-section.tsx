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
    <section className="py-20 sm:py-32 bg-background-secondary">
      <div className="section-container">
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
                eco-conscious users and growing, we're proud to lead the way in
                sustainable, community-powered solutions.
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
