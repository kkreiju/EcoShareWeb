"use client";

import type { ReactNode } from "react";
import Navigation from "@/components/dashboard/navigation";
import Header from "@/components/dashboard/header";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={`flex h-screen ${theme === "dark" ? "dark" : ""}`}>
      <Navigation />
      <div className="w-full flex flex-1 flex-col">
        <header className="h-16 border-b border-border">
          <Header />
        </header>
        <main className="flex-1 overflow-auto p-6 bg-background-secondary">
          {children}
        </main>
      </div>
    </div>
  );
}
