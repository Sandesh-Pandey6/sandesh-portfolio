"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  {
    id: "01",
    title: "Requirement Analysis",
    desc: "Goals, scope, and constraints",
    placement: "top" as const,
  },
  {
    id: "02",
    title: "Architecture Design",
    desc: "Systems, APIs, and data flow",
    placement: "right" as const,
  },
  {
    id: "03",
    title: "Development",
    desc: "Build, review, and iterate",
    placement: "bottom" as const,
  },
  {
    id: "04",
    title: "Deployment",
    desc: "Ship, monitor, and improve",
    placement: "left" as const,
  },
];

export default function ProcessLifecycle() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="process-lifecycle-wrap">
      <div
        ref={ref}
        className={`process-lifecycle${active ? " process-lifecycle--active" : ""}`}
        aria-label="Development lifecycle"
      >
        <svg
          className="process-ring"
          viewBox="0 0 400 400"
          aria-hidden
          focusable="false"
        >
          <defs>
            <linearGradient
              id="process-track-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient
              id="process-flow-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
            </linearGradient>
            <filter
              id="process-dot-glow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker
              id="process-arrow"
              markerWidth="7"
              markerHeight="7"
              refX="5.5"
              refY="3.5"
              orient="auto"
            >
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#22d3ee" opacity="0.9" />
            </marker>
          </defs>

          <circle
            className="process-ring__track"
            cx="200"
            cy="200"
            r="152"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
          <circle
            className="process-ring__track process-ring__track--glow"
            cx="200"
            cy="200"
            r="152"
            fill="none"
            stroke="url(#process-track-gradient)"
            strokeWidth="1.5"
          />

          <g className="process-ring__flows">
            <path
              className="process-ring__flow process-ring__flow--1"
              d="M 200 48 A 152 152 0 0 1 352 200"
              fill="none"
              stroke="url(#process-flow-gradient)"
              strokeWidth="2"
              markerEnd="url(#process-arrow)"
            />
            <path
              className="process-ring__flow process-ring__flow--2"
              d="M 352 200 A 152 152 0 0 1 200 352"
              fill="none"
              stroke="url(#process-flow-gradient)"
              strokeWidth="2"
              markerEnd="url(#process-arrow)"
            />
            <path
              className="process-ring__flow process-ring__flow--3"
              d="M 200 352 A 152 152 0 0 1 48 200"
              fill="none"
              stroke="url(#process-flow-gradient)"
              strokeWidth="2"
              markerEnd="url(#process-arrow)"
            />
            <path
              className="process-ring__flow process-ring__flow--4"
              d="M 48 200 A 152 152 0 0 1 200 48"
              fill="none"
              stroke="url(#process-flow-gradient)"
              strokeWidth="2"
              markerEnd="url(#process-arrow)"
            />
          </g>

          <g filter="url(#process-dot-glow)">
            <circle
              cx="200"
              cy="48"
              r="5"
              className="process-ring__dot process-ring__dot--1"
            />
            <circle
              cx="352"
              cy="200"
              r="5"
              className="process-ring__dot process-ring__dot--2"
            />
            <circle
              cx="200"
              cy="352"
              r="5"
              className="process-ring__dot process-ring__dot--3"
            />
            <circle
              cx="48"
              cy="200"
              r="5"
              className="process-ring__dot process-ring__dot--4"
            />
          </g>
        </svg>

        <div className="process-hub">
          <span className="process-hub__pulse" aria-hidden />
          <span className="process-hub__label">Lifecycle</span>
        </div>

        {steps.map((step) => (
          <article
            key={step.id}
            className={`process-node process-node--${step.placement}`}
          >
            <div className="process-node__card">
              <span className="process-node__id">{step.id}</span>
              <h3 className="process-node__title">{step.title}</h3>
              <p className="process-node__desc">{step.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
