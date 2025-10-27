"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Menu, X, ChevronDown, Users, BookOpen, MessageCircle, Calendar } from 'lucide-react';

interface ModernNavProps {
  logo: string;
  logoAlt?: string;
  onGetStarted?: () => void;
  onSignIn?: () => void;
}

const ModernNav: React.FC<ModernNavProps> = ({
  logo,
  logoAlt = 'Logo',
  onGetStarted,
  onSignIn,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    {
      title: 'For Learners',
      items: [
        {
          title: 'Find Skills',
          href: '/matches',
          description: 'Discover students who can teach you new skills',
          icon: <Users className="h-4 w-4" />,
        },
        {
          title: 'Browse Topics',
          href: '/courses',
          description: 'Explore all available learning topics',
          icon: <BookOpen className="h-4 w-4" />,
        },
      ],
    },
    {
      title: 'For Educators',
      items: [
        {
          title: 'Share Knowledge',
          href: '/onboarding',
          description: 'Start teaching and sharing your expertise',
          icon: <BookOpen className="h-4 w-4" />,
        },
        {
          title: 'Your Sessions',
          href: '/sessions',
          description: 'Manage your teaching sessions',
          icon: <Calendar className="h-4 w-4" />,
        },
      ],
    },
    {
      title: 'Community',
      items: [
        {
          title: 'Connect',
          href: '/chat',
          description: 'Chat with fellow learners and educators',
          icon: <MessageCircle className="h-4 w-4" />,
        },
        {
          title: 'Study Groups',
          href: '/events',
          description: 'Join collaborative learning groups',
          icon: <Users className="h-4 w-4" />,
        },
      ],
    },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src={logo} alt={logoAlt} className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="space-x-2">
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger className="bg-transparent text-slate-200 hover:text-white hover:bg-slate-800/50 data-[state=open]:bg-slate-800/50">
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid gap-3 p-6 w-[400px] bg-slate-900/95 backdrop-blur-md border border-slate-800/50">
                        <div className="grid grid-cols-1 gap-2">
                          {item.items.map((subItem) => (
                            <NavigationMenuLink key={subItem.title} asChild>
                              <Link
                                href={subItem.href}
                                className="group grid h-auto w-full items-start justify-start gap-1 rounded-md p-4 text-sm no-underline outline-none select-none transition-colors hover:bg-slate-800/50 focus:bg-slate-800/50"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="text-cyan-400">{subItem.icon}</div>
                                  <div className="text-sm font-medium text-slate-200 group-hover:text-white">
                                    {subItem.title}
                                  </div>
                                </div>
                                <div className="line-clamp-2 text-sm text-slate-400 group-hover:text-slate-300">
                                  {subItem.description}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              {status === 'authenticated' ? (
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={onSignIn}
                    className="text-slate-200 hover:text-white hover:bg-slate-800/50"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={onGetStarted}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-200 hover:text-white hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-900/95 backdrop-blur-md rounded-lg mt-2 border border-slate-800/50">
              {navigationItems.map((item) => (
                <div key={item.title} className="space-y-1">
                  <div className="px-3 py-2 text-sm font-medium text-slate-300 border-b border-slate-800/50">
                    {item.title}
                  </div>
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className="flex items-center px-3 py-2 rounded-md text-sm text-slate-200 hover:text-white hover:bg-slate-800/50"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="text-cyan-400 mr-3">{subItem.icon}</div>
                      <div>
                        <div className="font-medium">{subItem.title}</div>
                        <div className="text-xs text-slate-400">{subItem.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
              
              {/* Mobile CTA Buttons */}
              <div className="border-t border-slate-800/50 pt-4 space-y-2">
                {status === 'authenticated' ? (
                  <Link href="/dashboard" className="block">
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      onClick={onSignIn}
                      className="w-full text-slate-200 hover:text-white hover:bg-slate-800/50"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={onGetStarted}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ModernNav;