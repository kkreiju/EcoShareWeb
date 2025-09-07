"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2, History, TrendingUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
  showSuggestions?: boolean;
}

const POPULAR_SEARCHES = [
  "Food Waste",
  "Compostable",
  "Plant Based",
  "Kitchen Scraps",
  "Garden Waste",
  "Fertilizer",
  "Dried",
  "Clean",
  "Mixed",
  "Soil Enrichment",
  "Fruit Scraps",
];

export function SearchBar({
  value,
  onChange,
  placeholder = "Search listings...",
  className = "",
  isLoading = false,
  showSuggestions = true,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Removed debounced search - only search on explicit action

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveRecentSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      const updated = [
        searchTerm,
        ...recentSearches.filter((s) => s !== searchTerm),
      ].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localValue.trim()) {
      saveRecentSearch(localValue);
      onChange(localValue); // Trigger search immediately
      setShowDropdown(false);
    }
  };

  const handleClear = () => {
    setLocalValue("");
    onChange("");
    setShowDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    setShowDropdown(
      showSuggestions && (newValue.length > 0 || recentSearches.length > 0)
    );
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalValue(suggestion);
    saveRecentSearch(suggestion);
    onChange(suggestion); // Trigger search immediately when suggestion is clicked
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      (e.currentTarget as HTMLInputElement).blur();
    } else if (e.key === "ArrowDown" && showDropdown) {
      e.preventDefault();
      // Could implement keyboard navigation for suggestions
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative" ref={dropdownRef}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-20 h-12 border-border focus:border-primary focus:ring-primary bg-background shadow-sm"
          disabled={isLoading}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {localValue && !isLoading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground px-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Search"
            )}
          </Button>
        </div>

        {/* Suggestions Dropdown */}
        {showDropdown && showSuggestions && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-1">
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={`recent-${index}`}
                    type="button"
                    onClick={() => handleSuggestionClick(search)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md flex items-center gap-2"
                  >
                    <History className="h-3 w-3 text-muted-foreground" />
                    {search}
                  </button>
                ))}
              </div>
            )}

            {/* Popular Searches */}
            <div className="p-2 border-t border-border">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2 py-1">
                Popular Searches
              </div>
              <div className="grid grid-cols-2 gap-1">
                {POPULAR_SEARCHES.filter(
                  (search) =>
                    !recentSearches.includes(search) &&
                    search.toLowerCase().includes(localValue.toLowerCase())
                ).map((search, index) => (
                  <button
                    key={`popular-${index}`}
                    type="button"
                    onClick={() => handleSuggestionClick(search)}
                    className="text-left px-3 py-2 text-sm hover:bg-muted rounded-md flex items-center gap-2"
                  >
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
