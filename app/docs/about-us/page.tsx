import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Heart, Lightbulb } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To empower individuals and communities through responsible food waste sharing — turning everyday waste into opportunities for growth.",
  },
  {
    icon: Heart,
    title: "Our Values",
    description: "We stand for sustainability, collaboration, and local impact — believing small actions create big change.",
  },
  {
    icon: Lightbulb,
    title: "Our Vision",
    description: "To become the leading platform connecting people and places in the movement for zero-waste, community-driven agriculture.",
  },
];

const stats = [
  { label: "Active Users", value: "10,000+" },
  { label: "Food Waste Reduced", value: "500+ tons" },
  { label: "Communities Served", value: "50+" },
  { label: "Since", value: "2020" },
];

export default function AboutUsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Badge variant="secondary" className="w-fit">
          About EcoShare
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">About Us</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          EcoShare is more than just a platform — we're a movement. Founded in 2020, we've been
          committed to transforming how communities handle food waste and support sustainable farming practices.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
            <CardDescription>
              How EcoShare came to be and our journey toward sustainability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              EcoShare was born from a simple observation: while restaurants, households, and farmers
              were generating valuable compostable materials, there was no easy way to connect supply
              with demand. What started as a local initiative in Cebu has grown into a nationwide
              platform that's changing how Filipinos think about food waste.
            </p>
            <p className="text-muted-foreground">
              Today, EcoShare serves thousands of users across the Philippines, helping reduce landfill
              waste while supporting sustainable agriculture and community building.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Impact</CardTitle>
            <CardDescription>
              Real numbers showing our commitment to sustainability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What Drives Us</CardTitle>
          <CardDescription>
            The core values that guide everything we do at EcoShare
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <value.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">{value.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Join Our Mission</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're a restaurant reducing waste, a farmer seeking nutrients, or a homeowner
              with a garden, EcoShare connects you to a community working toward a more sustainable future.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge variant="outline">🌱 Sustainable</Badge>
              <Badge variant="outline">🤝 Collaborative</Badge>
              <Badge variant="outline">📍 Local</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
