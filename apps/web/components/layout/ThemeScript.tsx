// components/layout/ThemeScript.tsx
// This component renders a plain <script> tag that executes synchronously
// during HTML parsing, before the browser paints anything.
// Because it runs before React hydration, it has access to localStorage
// and can set the correct class on <html> before a single pixel is drawn.
// This is the standard industry solution to the FOUT problem.

export function ThemeScript() {
  // This script is intentionally a string — it will be injected directly
  // into the HTML and run by the browser's HTML parser immediately.
  // It cannot import modules or use TypeScript — it must be plain JavaScript.
  const script = `
    (function() {
      try {
        var stored = localStorage.getItem('civicpulse:theme');
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        // Use stored preference if it exists, otherwise fall back to OS preference
        var theme = stored || (prefersDark ? 'dark' : 'light');
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      } catch (e) {
        // localStorage can throw in private browsing modes in some browsers.
        // The catch ensures a theme preference error never breaks the page.
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      // Adding a nonce here would be part of our Content Security Policy
      // setup in Phase 5 — for now we leave it without one
    />
  );
}
