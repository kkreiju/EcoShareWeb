"use client";

import { useState, useEffect } from "react";

const SIDEBAR_STATE_KEY = "ecoshare-sidebar-state";

export function useSidebarState() {
  const [isOpen, setIsOpen] = useState<boolean>(true); // Default to open for SSR consistency
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    // Small delay to ensure proper hydration
    const timeoutId = setTimeout(() => {
      try {
        const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
        if (savedState !== null) {
          setIsOpen(JSON.parse(savedState));
        }
      } catch (error) {
        console.warn("Failed to load sidebar state from localStorage:", error);
        // Keep default state if localStorage fails
      } finally {
        setIsLoaded(true);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(isOpen));
      } catch (error) {
        console.warn("Failed to save sidebar state to localStorage:", error);
      }
    }
  }, [isOpen, isLoaded]);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const openSidebar = () => {
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    isLoaded,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    setIsOpen,
  };
}
