import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Recycle, Users, Leaf } from "lucide-react";

const missionPoints = [
  {
    icon: Recycle,
    title: "Reduce Food Waste",
    description: "Transform food scraps from restaurants, households, and markets into valuable compost for farmers and gardeners.",
  },
  {
    icon: Users,
    title: "Build Community",
    description: "Create connections between food waste generators and those who can use organic materials productively.",
  },
  {
    icon: Leaf,
    title: "Support Sustainable Farming",
    description: "Help farmers reduce fertilizer costs while promoting natural, organic growing methods.",
  },
  {
    icon: Target,
    title: "Promote Circular Economy",
    description: "Close the loop on food systems by ensuring nothing goes to waste and everything finds new purpose.",
  },
];

const goals = [
  { label: "Reduce landfill waste by", value: "50%", timeframe: "2025" },
  { label: "Connect", value: "100K+", timeframe: "users by 2026" },
  { label: "Cover", value: "all major cities", timeframe: "in Philippines" },
  { label: "Create", value: "sustainable jobs", timeframe: "in waste management" },
];

export default function OurMissionPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Badge variant="secondary" className="w-fit">
          Our Mission
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Our Mission</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          At EcoShare, our mission is simple yet powerful: to empower individuals and communities
          through responsible food waste sharing, turning everyday waste into opportunities for growth
          and sustainability.
        </p>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Target className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">Transforming Waste Into Worth</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We believe that food waste isn't waste at all — it's a valuable resource waiting to be
              redirected. Our platform bridges the gap between those who generate compostable materials
              and those who can use them to grow food, create healthier soil, and build stronger communities.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">How We Make It Happen</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {missionPoints.map((point, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <point.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{point.title}</h3>
                    <p className="text-muted-foreground">{point.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Our 2025 Goals</CardTitle>
          <CardDescription>
            Measurable targets we're working toward to create lasting impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {goals.map((goal, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-2xl font-bold text-primary">{goal.value}</div>
                <div className="text-sm font-medium">{goal.label}</div>
                <div className="text-xs text-muted-foreground">{goal.timeframe}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Our Commitment</CardTitle>
          <CardDescription>
            How we ensure transparency and accountability in our mission
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">Transparency</h4>
              <p className="text-muted-foreground text-sm">
                We regularly publish impact reports and share our progress toward our goals,
                keeping our community informed about how their participation creates change.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Collaboration</h4>
              <p className="text-muted-foreground text-sm">
                We work with local governments, environmental organizations, and agricultural
                experts to ensure our platform serves real community needs.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Innovation</h4>
              <p className="text-muted-foreground text-sm">
                We continuously improve our platform with new features, better matching algorithms,
                and enhanced user experiences to maximize environmental impact.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Education</h4>
              <p className="text-muted-foreground text-sm">
                We provide resources and guides to help users understand composting, sustainable
                farming, and the environmental benefits of food waste reduction.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Leaf className="h-8 w-8 text-green-600 mx-auto" />
            <h3 className="text-lg font-semibold">Together, We Can Make a Difference</h3>
            <p className="text-muted-foreground">
              Every listing posted, every connection made, and every pound of waste diverted
              from landfills contributes to a more sustainable future. Join us in our mission
              to transform waste into worth.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
