"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  /** Hero is in view on load — skip hidden initial state */
  immediate?: boolean;
}

export default function ScrollReveal({
  children,
  delay = 0,
  immediate = false,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(immediate);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Reset when scrolling out of view so it animates again when scrolling back
          setIsVisible(false);
        }
      },
      { 
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Slightly offset so it triggers right before it appears
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        width: '100%'
      }}
    >
      {children}
    </div>
  );
}
