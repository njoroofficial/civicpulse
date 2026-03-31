// components/layout/MobileMenu.tsx
// The mobile navigation drawer — slides in from the top when the
// hamburger button is pressed.
// Separated from Navbar to keep each component focused and testable.
"use client";

import Link from "next/link";
import type { User } from "@civicpulse/shared";

type MobileMenuProps = {
  isOpen: boolean;
  links: ReadonlyArray<{ href: string; label: string }>;
  pathname: string;
  user: User | null;
  onClose: () => void;
};

export function MobileMenu({
  isOpen,
  links,
  pathname,
  user,
  onClose,
}: MobileMenuProps) {
  return (
    <>
      {/* Backdrop — dims the page behind the menu */}
      {/* Using a separate div for the backdrop lets us animate it
          independently from the menu panel */}
      <div
        className={`
          fixed inset-0 z-40 transition-opacity duration-200
          md:hidden
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu panel */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`
          fixed top-16 left-0 right-0 z-50
          transition-all duration-200 ease-out
          md:hidden
          ${
            isOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }
        `}
        style={{
          backgroundColor: "var(--color-background-card)",
          borderBottom: `1px solid var(--color-border)`,
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        <div className="container py-4 flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-3 rounded-lg text-sm font-medium
                  transition-colors duration-150
                  ${
                    isActive
                      ? "bg-[var(--color-brand-50)] text-[var(--color-brand-700)]"
                      : "hover:bg-[var(--color-background-muted)]"
                  }
                `}
                style={{
                  color: isActive
                    ? "var(--color-brand-700)"
                    : "var(--color-text-primary)",
                }}
                aria-current={isActive ? "page" : undefined}
                onClick={onClose}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Divider */}
          <div
            className="my-2 border-t"
            style={{ borderColor: "var(--color-border)" }}
          />

          {/* Auth section */}
          {user ? (
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{ color: "var(--color-text-secondary)" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center
                           text-sm font-semibold flex-shrink-0"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-brand-500) 15%, transparent)",
                  color: "var(--color-brand-700)",
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {user.name}
                </p>
                <p className="text-xs">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 px-4 pt-2">
              <Link
                href="/login"
                className="btn-outline w-full justify-center"
                onClick={onClose}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn-primary w-full justify-center"
                onClick={onClose}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
