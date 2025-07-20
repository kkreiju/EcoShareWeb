import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Shield,
  MessageCircle,
  BarChart3,
  Smartphone,
  Clock,
  Leaf,
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Smart Matching",
    description:
      "Connect with nearby gardeners or farmers based on location, compost type, and needs.",
  },
  {
    icon: Shield,
    title: "Secure and Verified",
    description:
      "Every user is authenticated to ensure trustworthy exchanges and secure interactions.",
  },
  {
    icon: MessageCircle,
    title: "Built-In Messaging",
    description:
      "Coordinate pickups, ask questions, and build community with real-time chat features.",
  },
  {
    icon: BarChart3,
    title: "Compost Insights",
    description:
      "Track nutrient value and compost quality with AI-powered analytics and diagnostics.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Access EcoShare on the go — manage listings and chat anytime, anywhere.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description:
      "Get help when you need it with responsive support from our dedicated EcoShare team.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 sm:py-32 bg-background-secondary">
      <div className="section-container">
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
