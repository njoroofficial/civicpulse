// components/layout/Navbar.tsx
"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { UserContext } from "@/contexts/UserContext";

// Navigation links defined as data — adding a new link is one line here,
// not a JSX change. This is the data-driven component pattern.
const NAV_LINKS = [
  { href: "/issues", label: "Issues" },
  { href: "/report", label: "Report Issue" },
  { href: "/dashboard", label: "Dashboard", requiresRole: "official" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const user = use(UserContext);

  // Track whether the page has been scrolled — used for the
  // frosted glass effect on the navbar background
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // The navbar switches to frosted glass once the user scrolls
      // past 16px — enough to indicate they have left the top of the page
      setIsScrolled(window.scrollY > 16);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    // passive: true tells the browser this listener never calls preventDefault()
    // which allows the browser to optimise scroll performance significantly

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu when the user navigates to a new route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Filter nav links based on user role
  const visibleLinks = NAV_LINKS.filter((link) => {
    if (!("requiresRole" in link)) return true;
    return user?.role === link.requiresRole;
  });

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
        style={{
          borderBottom: isScrolled
            ? `1px solid var(--color-border)`
            : "1px solid transparent",
          backgroundColor: isScrolled
            ? "color-mix(in srgb, var(--color-background) 85%, transparent)"
            : "transparent",
          backdropFilter: isScrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none",
        }}
      >
        <nav
          className="container h-16 flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg
                       hover:opacity-80 transition-opacity"
            style={{ color: "var(--color-text-primary)" }}
          >
            <span aria-hidden="true">🏙️</span>
            <span>CivicPulse</span>
          </Link>

          {/* Desktop navigation links */}
          <div
            className="hidden md:flex items-center gap-1"
            role="menubar"
            aria-label="Desktop navigation"
          >
            {visibleLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium
                    transition-colors duration-150
                    ${
                      isActive
                        ? "bg-brand-50 text-(--color-brand-700)"
                        : "hover:bg-(--color-background-muted) text-(--color-text-secondary) hover:text-(--color-text-primary)"
                    }
                  `}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side — auth + theme toggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* Desktop auth buttons */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  {/* User avatar */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center
                               text-sm font-semibold"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--color-brand-500) 15%, transparent)",
                      color: "var(--color-brand-700)",
                    }}
                    aria-label={`Signed in as ${user.name}`}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <Link
                    href="/report"
                    className="btn-primary text-sm py-2 px-4"
                  >
                    Report Issue
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-sm font-medium px-4 py-2 rounded-lg
                               transition-colors duration-150
                               hover:bg-(--color-background-muted)"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary text-sm py-2 px-4"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors
                         hover:bg-(--color-background-muted)"
              style={{ color: "var(--color-text-secondary)" }}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {/* Animated hamburger → X icon using CSS transforms */}
              <div className="w-5 h-4 flex flex-col justify-between">
                <span
                  className={`
                    block h-0.5 bg-current rounded-full
                    transition-all duration-200 origin-center
                    ${isMobileMenuOpen ? "rotate-45 translate-y-1.75" : ""}
                  `}
                />
                <span
                  className={`
                    block h-0.5 bg-current rounded-full
                    transition-all duration-200
                    ${isMobileMenuOpen ? "opacity-0 scale-x-0" : ""}
                  `}
                />
                <span
                  className={`
                    block h-0.5 bg-current rounded-full
                    transition-all duration-200 origin-center
                    ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.75" : ""}
                  `}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu — rendered as a sibling to header, not inside it,
          so it can slide down below the header without clipping */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        links={visibleLinks}
        pathname={pathname}
        user={user}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Spacer — pushes page content below the fixed navbar */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
