import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// next/font automatically downloads and optimises fonts at build time.
// They're self-hosted — no external request to Google Fonts at runtime,
// which improves privacy, performance, and removes a render-blocking resource.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// The metadata export is how Next.js populates <head> tags.
// This object is the default — individual pages can override or extend it
// using their own exported 'metadata' or 'generateMetadata' function.
export const metadata: Metadata = {
  title: {
    // The 'template' means individual pages set their title with %s
    // and Next.js appends " | CivicPulse" automatically.
    // e.g. "Pothole on Ngong Road | CivicPulse"
    template: "%s | CivicPulse",
    default: "CivicPulse — Report. Vote. Resolve.",
  },
  description:
    "A civic engagement platform where Nairobi citizens report infrastructure issues and track government resolution in real time.",
  // Open Graph tags control how the page looks when shared on WhatsApp, Twitter, etc.
  openGraph: {
    siteName: "CivicPulse",
    locale: "en_KE", // Kenya English locale
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode; // 'children' is whatever page.tsx renders
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      /*
        suppressHydrationWarning on <html> prevents a React warning when
        browser extensions (like dark mode extensions) modify the DOM before
        React can hydrate. Without it, you'd see constant "hydration mismatch"
        warnings in development that aren't actually your bugs.
      */
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
