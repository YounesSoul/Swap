"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface ChromaGridProps {
  children: React.ReactNode;
  className?: string;
  gridCols?: number;
  glowIntensity?: number;
  animationSpeed?: number;
}

export const ChromaGrid: React.FC<ChromaGridProps> = ({
  children,
  className = "",
  gridCols = 3,
  glowIntensity = 0.6,
  animationSpeed = 2,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!gridRef.current || isMobile) return;

    const grid = gridRef.current;
    const items = grid.querySelectorAll('.chroma-item');

    items.forEach((item, index) => {
      const element = item as HTMLElement;
      
      // Create a random color for each item
      const colors = [
        'rgba(147, 51, 234, 0.4)', // Purple
        'rgba(59, 130, 246, 0.4)',  // Blue
        'rgba(16, 185, 129, 0.4)',  // Emerald
        'rgba(236, 72, 153, 0.4)',  // Pink
        'rgba(245, 158, 11, 0.4)',  // Amber
        'rgba(239, 68, 68, 0.4)',   // Red
      ];
      
      const color = colors[index % colors.length];
      
      // Animate background with chroma effect
      gsap.to(element, {
        boxShadow: `0 0 30px ${color}`,
        duration: animationSpeed,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: index * 0.2,
      });

      // Hover effects
      const handleMouseEnter = () => {
        gsap.to(element, {
          scale: 1.05,
          boxShadow: `0 10px 40px ${color}`,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(element, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, [glowIntensity, animationSpeed, isMobile]);

  return (
    <div 
      ref={gridRef}
      className={`grid gap-6 ${
        gridCols === 2 ? 'grid-cols-1 md:grid-cols-2' :
        gridCols === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
        gridCols === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
        `grid-cols-${gridCols}`
      } ${className}`}
    >
      {React.Children.map(children, (child, index) => (
        <div className="chroma-item">
          {child}
        </div>
      ))}
    </div>
  );
};

interface CarouselProps {
  children: React.ReactNode;
  autoPlay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoPlay = true,
  interval = 4000,
  showDots = true,
  showArrows = true,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const items = React.Children.toArray(children);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!autoPlay || items.length <= 1 || isMobile) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length, isMobile]);

  useEffect(() => {
    if (!carouselRef.current || items.length <= 1) return;

    const container = carouselRef.current;
    
    // Ensure currentIndex is within bounds
    const safeIndex = Math.max(0, Math.min(currentIndex, items.length - 1));
    
    gsap.to(container, {
      x: -safeIndex * 100 + "%",
      duration: 1.2,
      ease: "power1.inOut",
    });
  }, [currentIndex, items.length]);

  const goToSlide = (index: number) => {
    if (index >= 0 && index < items.length) {
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* Carousel content */}
      <div className="relative w-full h-full">
        <div
          ref={carouselRef}
          className="flex w-full h-full"
          style={{ width: `${items.length * 100}%` }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="w-full h-full flex-shrink-0"
              style={{ width: `${100 / items.length}%` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {showArrows && items.length > 1 && !isMobile && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110 z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots indicator */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface AnimatedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
}

export const AnimatedSearchBar: React.FC<AnimatedSearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
  className = "",
}) => {
  const searchRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!searchRef.current) return;

    const searchBar = searchRef.current;

    if (isFocused) {
      gsap.to(searchBar, {
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)",
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(searchBar, {
        scale: 1,
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isFocused]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div
      ref={searchRef}
      className={`relative flex items-center bg-white rounded-full border border-gray-200 shadow-lg transition-all duration-300 ${className}`}
    >
      <div className="pl-6 pr-2">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 px-4 py-4 bg-transparent outline-none text-gray-900 placeholder-gray-500"
      />
      <button
        onClick={onSubmit}
        className="mr-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
      >
        Search
      </button>
    </div>
  );
};

interface GlowCardProps {
  children: React.ReactNode;
  glowColor?: string;
  className?: string;
  onClick?: () => void;
}

export const GlowCard: React.FC<GlowCardProps> = ({
  children,
  glowColor = "147, 51, 234",
  className = "",
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;

    const handleMouseEnter = () => {
      gsap.to(card, {
        boxShadow: `0 20px 40px rgba(${glowColor}, 0.4)`,
        y: -5,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        boxShadow: `0 10px 20px rgba(${glowColor}, 0.2)`,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [glowColor]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-200 shadow-lg transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        boxShadow: `0 10px 20px rgba(${glowColor}, 0.2)`,
      }}
    >
      {children}
    </div>
  );
};