import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Create an Account",
    description:
      "Sign up in under 2 minutes with your email. Whether you're giving or receiving compostables, it's free to join.",
  },
  {
    step: "02",
    title: "Post or Request Compostables",
    description:
      "List available food scraps, manure, or compostables — or request what you need based on plant or garden needs.",
  },
  {
    step: "03",
    title: "Get Matched Nearby",
    description:
      "EcoShare recommends listings based on your location and preferences, so nothing goes to waste.",
  },
  {
    step: "04",
    title: "Exchange and Grow",
    description:
      "Coordinate pickups via built-in messaging, reduce landfill waste, and support sustainable farming in your community.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 sm:py-32 bg-background">
      <div className="section-container">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium">
            🌱 How It Works
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Get started in 4 simple steps
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            EcoShare makes it easy to turn your food waste into something
            valuable — helping farmers, gardeners, and the planet.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="text-4xl font-bold text-primary mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
