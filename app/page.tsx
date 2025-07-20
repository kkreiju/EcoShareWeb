import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { AboutSection } from "@/components/landing/about-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FaqSection } from "@/components/landing/faq-section";
import { NewsletterSection } from "@/components/landing/newsletter-section";
import { Footer } from "@/components/landing/footer";
import { ScrollProgress } from "@/components/landing/scroll-progress";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <main className="min-h-screen">
        <Navbar />
        <div id="home">
          <HeroSection />
        </div>
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
        <div id="about">
          <AboutSection />
        </div>
        <div id="testimonials">
          <TestimonialsSection />
        </div>
        <div id="faq">
          <FaqSection />
        </div>
        <div id="newsletter">
          <NewsletterSection />
        </div>
        <Footer />
      </main>
    </>
  );
}
