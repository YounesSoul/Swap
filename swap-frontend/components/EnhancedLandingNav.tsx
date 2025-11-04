"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";

interface NavigationItem {
  title: string;
  href: string;
  description?: string;
  items?: { title: string; href: string; description?: string }[];
}

const navigationItems: NavigationItem[] = [
  {
    title: "Features",
    href: "#features",
    items: [
      { 
        title: "Knowledge Exchange", 
        href: "/features/exchange",
        description: "Share what you know, learn what you need"
      },
      { 
        title: "Smart Matching", 
        href: "/features/matching",
        description: "AI-powered skill and peer matching"
      },
      { 
        title: "Community Hub", 
        href: "/features/community-hub",
        description: "Connect with like-minded learners"
      },
      { 
        title: "Session Management", 
        href: "/features/sessions",
        description: "Easy scheduling and session tracking"
      },
    ]
  },
  {
    title: "How It Works",
    href: "#how-it-works",
    description: "Learn about our process"
  },
  {
    title: "Community",
    href: "/features/community-hub",
    description: "Join our learning community"
  },
  {
    title: "Success Stories",
    href: "#success-stories",
    description: "Real stories from our users"
  }
];

export function EnhancedLandingNav() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/95 backdrop-blur-md supports-[backdrop-filter]:bg-slate-900/80">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 transition-transform duration-300 group-hover:scale-110">
              <span className="text-xl font-bold text-white">S</span>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-75 transition-opacity duration-300 blur-lg -z-10"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Swap
            </span>
            <span className="text-xs text-slate-400 -mt-1">Knowledge Exchange</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:items-center lg:space-x-1">
          {navigationItems.map((item) => (
            <div
              key={item.title}
              className="relative group"
              onMouseEnter={() => item.items && setActiveDropdown(item.title)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={item.href}
                className="flex items-center space-x-1 px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-200 hover:text-white hover:bg-slate-800/50 rounded-lg group"
              >
                <span>{item.title}</span>
                {item.items && (
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-all duration-200 opacity-70 group-hover:opacity-100",
                    activeDropdown === item.title && "rotate-180"
                  )} />
                )}
              </Link>

              {/* Enhanced Dropdown Menu */}
              {item.items && (
                <div className={cn(
                  "absolute left-0 top-full mt-2 w-80 rounded-2xl border border-slate-700 bg-slate-800/95 backdrop-blur-xl shadow-2xl transition-all duration-300 transform",
                  activeDropdown === item.title 
                    ? "opacity-100 translate-y-0 visible" 
                    : "opacity-0 -translate-y-3 invisible"
                )}>
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-xs text-slate-400">Explore our platform features</p>
                    </div>
                    <div className="space-y-3">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className="group block rounded-xl px-4 py-3 transition-colors hover:bg-slate-700/50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="font-medium text-white text-sm group-hover:text-cyan-400 transition-colors">
                                {subItem.title}
                              </div>
                              {subItem.description && (
                                <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                                  {subItem.description}
                                </div>
                              )}
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden lg:flex lg:items-center lg:space-x-3">
          <Link href="/signin">
            <Button 
              variant="ghost" 
              className="text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 hover:-translate-y-0.5">
              Get Started Free
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-slate-300" />
          ) : (
            <Menu className="h-6 w-6 text-slate-300" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      <div className={cn(
        "lg:hidden fixed inset-0 z-40 transition-all duration-300",
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      )}>
        <div 
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" 
          onClick={() => setIsOpen(false)}
        />
        
        <div className={cn(
          "absolute top-20 left-0 right-0 bottom-0 bg-slate-800 border-t border-slate-700 transition-all duration-300 transform",
          isOpen ? "translate-y-0" : "-translate-y-full"
        )}>
          <div className="container mx-auto px-4 py-8 h-full overflow-y-auto">
            <nav className="space-y-6">
              {navigationItems.map((item) => (
                <div key={item.title} className="space-y-3">
                  <Link
                    href={item.href}
                    className="flex items-center justify-between text-lg font-medium text-white hover:text-cyan-400 transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{item.title}</span>
                    {item.items && <ChevronDown className="h-5 w-5" />}
                  </Link>
                  
                  {item.items && (
                    <div className="ml-4 space-y-3 border-l border-slate-700 pl-4">
                      {item.items.map((subItem) => (
                        <div key={subItem.title}>
                          <Link
                            href={subItem.href}
                            className="block text-slate-300 hover:text-white transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="font-medium text-sm">{subItem.title}</div>
                            {subItem.description && (
                              <div className="text-xs text-slate-500 mt-1">
                                {subItem.description}
                              </div>
                            )}
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            
            {/* Mobile Auth Buttons */}
            <div className="border-t border-slate-700 pt-8 mt-8">
              <div className="space-y-4">
                <Link href="/signin" className="block" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-center text-slate-300 hover:text-white hover:bg-slate-700/50">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="block" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-center bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default EnhancedLandingNav;