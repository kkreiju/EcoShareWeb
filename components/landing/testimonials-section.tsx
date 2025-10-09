import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Dela Cruz",
    role: "Homeowner, Cebu City",
    content:
      "EcoShare made it so easy to connect with local gardeners who needed compost. What used to be trash is now helping things grow — and that feels amazing.",
    rating: 5,
    avatar: "/images/img_avatar1.png",
  },
  {
    name: "Michael Tan",
    role: "Farmer, Talisay",
    content:
      "I've reduced my fertilizer costs significantly thanks to EcoShare. The listings are easy to browse, and the nutrient analysis helps me choose the right materials.",
    rating: 5,
    avatar: "/images/img_avatar3.png",
  },
  {
    name: "Emily Reyes",
    role: "Restaurant Owner, Mandaue",
    content:
      "We used to throw away so much food waste. Now we post it on EcoShare, and farmers actually pick it up. It's good for them, for us, and for the planet.",
    rating: 5,
    avatar: "/images/img_avatar2.png",
  },
];

export function TestimonialsSection() {
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
              <pattern id="grid-testimonials" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-testimonials)" />
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
          <div className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-sm font-medium">
            💬 Testimonials
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            What Our Community Says
          </h2>
          <p className="text-lg text-muted-foreground sm:text-xl">
            Don&apos;t just take our word for it — here&apos;s what real
            EcoShare users have to say about their experience building a more
            sustainable world:
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-chart-4 text-chart-4"
                    />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-15 w-15">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
