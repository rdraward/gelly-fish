import { Provider as GadgetProvider } from "@gadgetinc/react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Suspense } from "react";
import { api } from "./api";
import "./app.css";
import { ProductionErrorBoundary, DevelopmentErrorBoundary } from "gadget-server/react-router";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/lib/theme-context";
import type { GadgetConfig } from "gadget-server";
import type { Route } from "./+types/root";

const isProduction = process.env.NODE_ENV === "production";

export const links = () => [
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;500;600;700&display=swap",
  },
  {
    rel: "icon",
    type: "image/svg+xml",
    href: "/favicon.svg",
  },
  {
    rel: "apple-touch-icon",
    href: "/gellyfish-superiority.png",
  },
];

export const meta = () => [
  { charset: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
  { title: "gelly.fish - Interactive Gelly Tutorial" },
  { name: "description", content: "Learn Gelly through interactive tutorials" },
  { name: "keywords", content: "gelly, tutorial, learn gelly, interactive tutorial, gelly.fish" },
  { name: "theme-color", content: "#9260d2" },

  // Open Graph tags for social sharing
  { property: "og:title", content: "gelly.fish - Interactive Gelly Tutorial" },
  { property: "og:description", content: "Learn Gelly through interactive tutorials" },
  { property: "og:type", content: "website" },
  { property: "og:image", content: "/gellyfish-superiority.png" },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "630" },
  { property: "og:url", content: "https://gelly.fish" },

  // Twitter Card tags
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "gelly.fish - Interactive Gelly Tutorial" },
  { name: "twitter:description", content: "Learn Gelly through interactive tutorials" },
  { name: "twitter:image", content: "/gellyfish-superiority.png" },
];

export type RootOutletContext = {
  gadgetConfig: GadgetConfig;
  csrfToken: string;
};

export const loader = async ({ context }: Route.LoaderArgs) => {
  const { session, gadgetConfig } = context;

  return {
    gadgetConfig,
    csrfToken: session?.get("csrfToken"),
  };
};

export default function App({ loaderData }: Route.ComponentProps) {
  const { gadgetConfig, csrfToken } = loaderData;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('gelly-fish-theme') || 'system';
                const resolvedTheme = theme === 'system' 
                  ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                  : theme;
                document.documentElement.classList.add(resolvedTheme);
              })();
            `,
          }}
        />
        {!isProduction && <script type="module" src="/@vite/client" async />}
      </head>
      <body>
        <ThemeProvider>
          <Suspense>
            <GadgetProvider api={api}>
              <Outlet context={{ gadgetConfig, csrfToken }} />
              <Toaster richColors />
            </GadgetProvider>
          </Suspense>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Default Gadget error boundary component
// This can be replaced with your own custom error boundary implementation
// For more info, checkout https://reactrouter.com/how-to/error-boundary#1-add-a-root-error-boundary
export const ErrorBoundary = isProduction ? ProductionErrorBoundary : DevelopmentErrorBoundary;