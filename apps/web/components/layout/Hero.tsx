// components/layout/Hero.tsx
// The homepage hero section — server-rendered, zero JavaScript,
// pure CSS entrance animations.
// No "use client" because there is no interactivity here —
// every animation is driven by CSS keyframes.

import Link from "next/link";

// Animation styles defined as a CSS string that we inject via a <style> tag.
// This keeps animations co-located with the component that uses them
// rather than in globals.css, which is reserved for design system tokens.
const heroAnimations = `
  @keyframes heroFadeUp {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes heroPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  
  .hero-element {
    animation: heroFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  
  .hero-element-1 { animation-delay: 0ms; }
  .hero-element-2 { animation-delay: 100ms; }
  .hero-element-3 { animation-delay: 200ms; }
  .hero-element-4 { animation-delay: 350ms; }
  .hero-element-5 { animation-delay: 500ms; }

  @media (prefers-reduced-motion: reduce) {
    .hero-element {
      animation: none;
    }
  }
`;

type HeroStat = {
  value: string;
  label: string;
};

type HeroProps = {
  stats: HeroStat[];
};

export function Hero({ stats }: HeroProps) {
  return (
    <>
      {/* Inject hero animations — scoped to this component */}
      <style dangerouslySetInnerHTML={{ __html: heroAnimations }} />

      <section
        className="relative overflow-hidden py-24 md:py-32"
        aria-labelledby="hero-heading"
      >
        {/* Background decoration — purely visual, hidden from screen readers */}
        <div
          className="absolute inset-0 -z-10"
          aria-hidden="true"
          style={{
            background: `
              radial-gradient(
                ellipse 80% 50% at 50% -20%,
                color-mix(in srgb, var(--color-brand-500) 12%, transparent),
                transparent
              )
            `,
          }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 -z-10 opacity-30"
          aria-hidden="true"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-border) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        <div className="container text-center">
          {/* Live indicator badge */}
          <div className="hero-element hero-element-1 flex justify-center mb-6">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5
                         rounded-full text-xs font-semibold
                         border uppercase tracking-wider"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-brand-500) 10%, transparent)",
                borderColor:
                  "color-mix(in srgb, var(--color-brand-500) 25%, transparent)",
                color: "var(--color-brand-700)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-(--color-brand-500)"
                style={{ animation: "heroPulse 2s ease-in-out infinite" }}
                aria-hidden="true"
              />
              Live in Nairobi
            </span>
          </div>

          {/* Main heading */}
          <h1
            id="hero-heading"
            className="hero-element hero-element-2
                       text-5xl md:text-7xl font-bold
                       leading-[1.05] tracking-tight
                       text-balance mb-6"
            style={{ color: "var(--color-text-primary)" }}
          >
            Your city.{" "}
            <span style={{ color: "var(--color-brand-600)" }}>Your voice.</span>
            <br />
            Your responsibility.
          </h1>

          {/* Subheading */}
          <p
            className="hero-element hero-element-3
                       text-lg md:text-xl leading-relaxed
                       max-w-2xl mx-auto mb-10 text-balance"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Report infrastructure issues in Nairobi, vote on what matters most
            to your community, and watch the government resolve them —
            transparently, in real time.
          </p>

          {/* CTA buttons */}
          <div
            className="hero-element hero-element-4
                       flex flex-col sm:flex-row gap-4
                       justify-center items-center mb-16"
          >
            <Link
              href="/report"
              className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto"
            >
              Report an Issue
            </Link>
            <Link
              href="/issues"
              className="btn-outline text-base px-8 py-3.5 w-full sm:w-auto"
            >
              Browse Issues →
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="hero-element hero-element-5
                       grid grid-cols-3 gap-4 md:gap-8
                       max-w-2xl mx-auto"
          >
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div
                  className="text-3xl md:text-4xl font-bold mb-1"
                  style={{ color: "var(--color-brand-600)" }}
                >
                  {value}
                </div>
                <div
                  className="text-xs md:text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
