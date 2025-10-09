import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center pt-16 lg:pt-20 bg-gradient-to-br from-background via-background to-primary/5">
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
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating dots */}
        <div className="absolute top-16 left-16 w-2 h-2 bg-primary/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-secondary/40 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-accent/30 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 right-16 w-1 h-1 bg-primary/20 rounded-full animate-bounce delay-500"></div>
      </div>
      <div className="w-full max-w-7xl px-4 md:px-12 relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border bg-card/50 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                ♻️ Turn Waste Into Worth
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                Give Waste a<span className="text-primary"> New Life</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                EcoShare bridges households, restaurants, and farmers—making it
                easy to share compostable food waste and support organic
                farming. Help reduce landfill waste and grow a greener future,
                together.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/auth/sign-up" className="pointer-events-auto">
                <Button
                  size="lg"
                  className="text-lg bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 pointer-events-auto"
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="text-lg bg-transparent"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            <div className="flex items-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <Avatar>
                    <AvatarFallback className="text-primary-foreground bg-primary">
                      MC
                    </AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback className="text-destructive-foreground bg-destructive">
                      BM
                    </AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback className="text-white bg-chart-1">
                      CR
                    </AvatarFallback>
                  </Avatar>
                </div>
                <span>🌍 Trusted by 10,000+ eco-conscious users</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-primary opacity-10"></div>
            <Image
              src="/images/food-waste.jpg"
              alt="Sustainable Food Sharing"
              width={800}
              height={600}
              className="relative rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
