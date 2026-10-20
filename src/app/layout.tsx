import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ThemeSync } from "@/components/theme-sync";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { SITE, SITE_ASSETS } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "UI components",
    "design resources",
    "shadcn ui",
    "tailwind",
    "animation",
    "shaders",
    "icons",
    "design systems",
  ],
  authors: [{ name: SITE.author.name, url: SITE.author.github }],
  manifest: SITE_ASSETS.manifest,
  appleWebApp: {
    capable: true,
    title: SITE.name,
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    url: SITE.url,
    title: SITE.title,
    description: SITE.description,
    siteName: SITE.name,
    images: [
      {
        url: SITE_ASSETS.icon512,
        width: 512,
        height: 512,
        alt: SITE.name,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE.title,
    description: SITE.description,
    images: [SITE_ASSETS.icon512],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf6f4" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1220" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@600&text=%E7%AF%A0%E5%B4%8E&display=swap"
        />
      </head>
      <body className="min-h-dvh font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ThemeSync />
          <TooltipProvider>
            <div className="relative z-[1] flex min-h-dvh flex-col">
              <div className="safe-area-top" />
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
            <Toaster />
            <Analytics />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
