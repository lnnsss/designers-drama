import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { CartDrawer } from "@/components/CartDrawer/CartDrawer";
import { Preloader } from "@/components/Preloader/Preloader";
import { CartProvider } from "@/hooks/useCart";
import { configuredSiteUrl } from "@/lib/supabase/config";
import "@/styles/globals.css";

const interDisplay = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-display"
});

const siteUrl = new URL(configuredSiteUrl || "https://designers-drama.ru");
const siteDescription =
  "Minimal designer fashion store with bold accessories, objects, and everyday pieces by Designers Drama.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "Designers Drama",
  title: {
    default: "Designers Drama",
    template: "%s | Designers Drama"
  },
  description: siteDescription,
  keywords: [
    "Designers Drama",
    "designer fashion",
    "fashion accessories",
    "minimal store",
    "statement objects"
  ],
  authors: [{ name: "Designers Drama" }],
  creator: "Designers Drama",
  publisher: "Designers Drama",
  category: "fashion",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Designers Drama",
    title: "Designers Drama",
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Designers Drama"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Designers Drama",
    description: siteDescription,
    images: ["/opengraph-image"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#FC042E" }
    ]
  },
  manifest: "/site.webmanifest"
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={interDisplay.variable}>
      <body>
        <Preloader />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
