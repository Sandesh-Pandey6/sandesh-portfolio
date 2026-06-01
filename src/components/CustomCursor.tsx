"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef(0);
  const clickingRef = useRef(false);

  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    const update = () => setActive(finePointer.matches);
    update();
    finePointer.addEventListener("change", update);
    return () => finePointer.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!active) return;

    document.documentElement.classList.add("custom-cursor-active");

    const lerp = (from: number, to: number, factor: number) =>
      from + (to - from) * factor;

    const moveDot = (x: number, y: number) => {
      if (!dotRef.current) return;
      const scale = clickingRef.current ? 0.6 : 1;
      dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    };

    const tick = () => {
      ringPos.current.x = lerp(ringPos.current.x, pointer.current.x, 0.15);
      ringPos.current.y = lerp(ringPos.current.y, pointer.current.y, 0.15);
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      pointer.current = { x: e.clientX, y: e.clientY };
      moveDot(e.clientX, e.clientY);
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHovered(
        !!target.closest(
          "a, button, [role='button'], input, textarea, select, label, summary"
        )
      );
    };

    const onDown = () => {
      clickingRef.current = true;
      setClicking(true);
      moveDot(pointer.current.x, pointer.current.y);
    };

    const onUp = () => {
      clickingRef.current = false;
      setClicking(false);
      moveDot(pointer.current.x, pointer.current.y);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [active]);

  if (!active) return null;

  const ringClass = [
    "custom-cursor__ring",
    visible && "is-visible",
    hovered && "is-hover",
    clicking && "is-click",
  ]
    .filter(Boolean)
    .join(" ");

  const dotClass = [
    "custom-cursor__dot",
    visible && "is-visible",
    hovered && "is-hover",
    clicking && "is-click",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div ref={ringRef} className={ringClass} aria-hidden />
      <div ref={dotRef} className={dotClass} aria-hidden />
    </>
  );
}
