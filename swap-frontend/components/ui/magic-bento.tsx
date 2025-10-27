"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface MagicCardProps {
  children: React.ReactNode;
  className?: string;
  gradientColor?: string;
  spotlightRadius?: number;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  particleCount?: number;
  glowColor?: string;
  disableAnimations?: boolean;
  textAutoHide?: boolean;
}

export const MagicCard: React.FC<MagicCardProps> = ({
  children,
  className = "",
  gradientColor = "132, 0, 255",
  spotlightRadius = 300,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = false,
  enableMagnetism = false, // Disabled by default
  clickEffect = true,
  particleCount = 12,
  glowColor = "132, 0, 255",
  disableAnimations = false,
  textAutoHide = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const borderGlowRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shouldAnimate = !disableAnimations && !isMobile;

  useEffect(() => {
    if (!shouldAnimate || !cardRef.current) return;

    const card = cardRef.current;
    const spotlight = spotlightRef.current;
    const borderGlow = borderGlowRef.current;
    const stars = starsRef.current;

    // Create star particles
    if (enableStars && stars) {
      for (let i = 0; i < particleCount; i++) {
        const star = document.createElement("div");
        star.className = "absolute w-1 h-1 bg-white rounded-full opacity-0";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        stars.appendChild(star);

        gsap.to(star, {
          opacity: Math.random() * 0.5 + 0.2,
          duration: Math.random() * 2 + 1,
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 2,
        });
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!shouldAnimate) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Spotlight effect
      if (enableSpotlight && spotlight) {
        gsap.set(spotlight, {
          background: `radial-gradient(circle ${spotlightRadius}px at ${x}px ${y}px, rgba(${glowColor}, 0.15) 0%, transparent 70%)`,
        });
      }

      // Border glow effect
      if (enableBorderGlow && borderGlow) {
        gsap.set(borderGlow, {
          background: `radial-gradient(circle ${spotlightRadius * 0.8}px at ${x}px ${y}px, rgba(${glowColor}, 0.4) 0%, transparent 70%)`,
        });
      }

      // Tilt effect
      if (enableTilt) {
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        gsap.to(card, {
          rotateX,
          rotateY,
          duration: 0.3,
          transformPerspective: 1000,
          transformOrigin: "center",
        });
      }

      // Magnetism effect
      if (enableMagnetism) {
        const strength = 0.3;
        const deltaX = (x - centerX) * strength;
        const deltaY = (y - centerY) * strength;
        gsap.to(card, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
        });
      }
    };

    const handleMouseLeave = () => {
      if (!shouldAnimate) return;

      if (enableTilt) {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
        });
      }

      if (enableMagnetism) {
        gsap.to(card, {
          x: 0,
          y: 0,
          duration: 0.3,
        });
      }

      if (enableSpotlight && spotlight) {
        gsap.to(spotlight, {
          opacity: 0,
          duration: 0.3,
        });
      }

      if (enableBorderGlow && borderGlow) {
        gsap.to(borderGlow, {
          opacity: 0,
          duration: 0.3,
        });
      }
    };

    const handleMouseEnter = () => {
      if (!shouldAnimate) return;

      if (enableSpotlight && spotlight) {
        gsap.to(spotlight, {
          opacity: 1,
          duration: 0.3,
        });
      }

      if (enableBorderGlow && borderGlow) {
        gsap.to(borderGlow, {
          opacity: 1,
          duration: 0.3,
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!shouldAnimate || !clickEffect) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement("div");
      ripple.className = "absolute rounded-full pointer-events-none";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.style.width = "0px";
      ripple.style.height = "0px";
      ripple.style.background = `rgba(${glowColor}, 0.3)`;
      ripple.style.transform = "translate(-50%, -50%)";
      card.appendChild(ripple);

      gsap.to(ripple, {
        width: "300px",
        height: "300px",
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => ripple.remove(),
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("click", handleClick);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("click", handleClick);
    };
  }, [
    shouldAnimate,
    enableStars,
    enableSpotlight,
    enableBorderGlow,
    enableTilt,
    enableMagnetism,
    clickEffect,
    spotlightRadius,
    particleCount,
    glowColor,
  ]);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Border glow */}
      {enableBorderGlow && shouldAnimate && (
        <div
          ref={borderGlowRef}
          className="absolute inset-0 opacity-0 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(circle ${spotlightRadius * 0.8}px, rgba(${glowColor}, 0.4) 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Spotlight */}
      {enableSpotlight && shouldAnimate && (
        <div
          ref={spotlightRef}
          className="absolute inset-0 opacity-0 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(circle ${spotlightRadius}px, rgba(${glowColor}, 0.15) 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Stars */}
      {enableStars && shouldAnimate && (
        <div ref={starsRef} className="absolute inset-0 pointer-events-none rounded-xl" />
      )}

      {/* Content */}
      <div className={`relative z-10 ${textAutoHide ? "group-hover:opacity-80" : ""} transition-opacity duration-300`}>
        {children}
      </div>
    </div>
  );
};

interface MagicBentoProps {
  children: React.ReactNode;
  className?: string;
}

export const MagicBento: React.FC<MagicBentoProps> = ({ children, className = "" }) => {
  return (
    <div className={`grid gap-4 auto-rows-min ${className}`}>
      {children}
    </div>
  );
};