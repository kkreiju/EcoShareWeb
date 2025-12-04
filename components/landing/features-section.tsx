import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Bot,
  Sprout,
  BarChart3,
  Leaf,
  Recycle,
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Chatbot",
    description:
      "Get instant guidance on composting and platform usage with our intelligent assistant.",
  },
  {
    icon: Sprout,
    title: "Plant Nutrient Diagnostics",
    description:
      "Analyze plant health and identify deficiencies using advanced deep learning (CNN) technology.",
  },
  {
    icon: Leaf,
    title: "Plant Nutrient Builder",
    description:
      "Receive personalized compost mix suggestions tailored to your plants using machine learning.",
  },
  {
    icon: BarChart3,
    title: "Listing Analytics",
    description:
      "Gain insights into the nutrient content and quality of listed compostable materials.",
  },
  {
    icon: MapPin,
    title: "Smart Matching",
    description:
      "Connect with nearby users based on your specific compost needs and location.",
  },
  {
    icon: Recycle,
    title: "Listing Creation",
    description:
      "Easily list food scraps and compostable materials to share with your local community.",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-br from-background-secondary via-background-secondary to-primary/5">
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
              <pattern id="grid-features" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-features)" />
          </svg>
        </div>

        {/* Floating dots */}
        <div className="absolute top-16 left-16 w-2 h-2 bg-primary/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-secondary/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-accent/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 right-16 w-1 h-1 bg-primary/20 rounded-full animate-bounce delay-500"></div>
      </div>
      <div className="mx-auto px-4 md:px-12 max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-sm font-medium">
            🌟 Features
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Eco-Friendly <span className="text-primary">Sharing</span> Made Easy
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            EcoShare empowers individuals and communities with the tools they
            need to reduce waste and support sustainable farming practices — all
            in one seamless platform.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
