import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background min-h-screen flex items-center justify-center pt-16 lg:pt-20">
      <div className="w-full max-w-7xl px-4 md:px-12">
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
              <Button
                size="lg"
                className="text-lg bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
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
