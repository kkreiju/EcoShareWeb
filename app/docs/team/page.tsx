import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Linkedin, Github } from "lucide-react";

const teamMembers = [
  {
    name: "Maria Santos",
    role: "Founder & CEO",
    bio: "Environmental scientist with 10+ years in sustainable agriculture. Passionate about reducing food waste through technology.",
    avatar: "/images/img_avatar1.png",
    email: "maria@ecoshare.ph",
    linkedin: "#",
    expertise: ["Sustainability", "Strategy", "Agriculture"],
  },
  {
    name: "Carlos Reyes",
    role: "CTO & Co-Founder",
    bio: "Full-stack developer specializing in environmental tech. Built EcoShare's matching algorithm and mobile platform.",
    avatar: "/images/img_avatar3.png",
    email: "carlos@ecoshare.ph",
    linkedin: "#",
    github: "#",
    expertise: ["Technology", "AI/ML", "Mobile Development"],
  },
  {
    name: "Ana Cruz",
    role: "Head of Community",
    bio: "Community organizer focused on environmental education. Manages partnerships with local governments and NGOs.",
    avatar: "/images/img_avatar2.png",
    email: "ana@ecoshare.ph",
    linkedin: "#",
    expertise: ["Community Building", "Education", "Partnerships"],
  },
];

const advisors = [
  {
    name: "Dr. Jose Martinez",
    role: "Agricultural Advisor",
    organization: "University of the Philippines",
    expertise: "Soil Science & Composting",
  },
  {
    name: "Luz Ramirez",
    role: "Environmental Policy Advisor",
    organization: "DENR Philippines",
    expertise: "Waste Management Policy",
  },
];

export default function TeamPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Badge variant="secondary" className="w-fit">
          Our Team
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight">Meet the EcoShare Team</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          We're a passionate team of environmentalists, technologists, and community builders
          working together to create a more sustainable future through food waste reduction.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Core Team</CardTitle>
          <CardDescription>
            The dedicated individuals driving EcoShare's mission forward
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <Card key={index} className="h-fit">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <Avatar className="h-20 w-20 mx-auto">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="text-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-primary font-medium">{member.role}</p>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {member.bio}
                    </p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {member.expertise.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-center space-x-2 pt-2">
                      <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary">
                        <Mail className="h-4 w-4" />
                      </a>
                      <a href={member.linkedin} className="text-muted-foreground hover:text-primary">
                        <Linkedin className="h-4 w-4" />
                      </a>
                      {member.github && (
                        <a href={member.github} className="text-muted-foreground hover:text-primary">
                          <Github className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advisory Board</CardTitle>
          <CardDescription>
            Expert guidance from leaders in agriculture, environmental policy, and sustainability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {advisors.map((advisor, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">
                    {advisor.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold">{advisor.name}</h4>
                  <p className="text-primary text-sm">{advisor.role}</p>
                  <p className="text-muted-foreground text-sm">{advisor.organization}</p>
                  <Badge variant="outline" className="text-xs w-fit">
                    {advisor.expertise}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Our Culture</CardTitle>
          <CardDescription>
            The values and principles that guide how we work together
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <span className="text-green-600 text-xl">🌱</span>
              </div>
              <h4 className="font-semibold">Sustainability First</h4>
              <p className="text-muted-foreground text-sm">
                Every decision we make considers long-term environmental impact.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                <span className="text-blue-600 text-xl">🤝</span>
              </div>
              <h4 className="font-semibold">Collaboration</h4>
              <p className="text-muted-foreground text-sm">
                We believe the best solutions come from working together.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
                <span className="text-purple-600 text-xl">💡</span>
              </div>
              <h4 className="font-semibold">Innovation</h4>
              <p className="text-muted-foreground text-sm">
                We're constantly exploring new ways to improve our platform.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto">
                <span className="text-orange-600 text-xl">❤️</span>
              </div>
              <h4 className="font-semibold">Community</h4>
              <p className="text-muted-foreground text-sm">
                Our users are at the heart of everything we do.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Join Our Team</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're always looking for passionate individuals who share our vision for a more sustainable future.
              If you're interested in environmental technology, community building, or sustainable agriculture,
              we'd love to hear from you.
            </p>
            <div className="flex justify-center">
              <Badge variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                careers@ecoshare.ph
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
