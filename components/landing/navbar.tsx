"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

const navigationItems = [
  { name: "Home", href: "#home" },
  { name: "Features", href: "#features" },
  { name: "About", href: "#about" },
  { name: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-background dark:bg-background backdrop-blur-md shadow-lg border-b border-border"
          : "bg-transparent"
        }`}
    >
      <div className="mx-auto px-4 md:px-12 max-w-7xl">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 flex items-center justify-center">
              <Image
                src="/icons/ic_leaf.png"
                alt="EcoShare Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
            </div>
            <span className="text-xl font-bold">
              <span className="text-foreground">Eco</span>
              <span className="text-primary">Share</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-sm text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <ThemeSwitcher />
            {!loading &&
              (isAuthenticated ? (
                <Link href="/user/dashboard">
                  <Button className="bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground font-medium px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/login">
                  <Button className="bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground font-medium px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                    Get Started
                  </Button>
                </Link>
              ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2 relative">
            <ThemeSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative"
            >
              <Menu className="h-6 w-6 text-foreground" />
              <span className="sr-only">Toggle menu</span>
            </Button>

            {/* Mobile Dropdown Menu */}
            {isMobileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-background rounded-lg shadow-lg border border-border py-2 z-50">
                {/* Mobile Navigation */}
                <div className="space-y-1">
                  {navigationItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => scrollToSection(item.href)}
                      className="w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-background-secondary transition-colors duration-200"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-border my-2"></div>

                {/* Mobile CTA Buttons */}
                <div className="px-4 space-y-2">
                  {!loading &&
                    (isAuthenticated ? (
                      <Link href="/user/dashboard">
                        <Button className="w-full bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground font-medium px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                          Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/auth/login">
                        <Button className="w-full bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground font-medium px-6 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                          Get Started
                        </Button>
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}
