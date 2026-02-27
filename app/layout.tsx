import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const Jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"]
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mytradingjournal.com"), // Placeholder domain
  title: {
    default: "MySaaS Trading Journal | Track, Analyze, and Improve Your Trades",
    template: "%s | MySaaS Trading Journal",
  },
  description: "The ultimate trading journal to track your performance, analyze trades, and improve your edge in forex, crypto, and stocks.",
  keywords: [
    "trading journal",
    "forex tracker",
    "trading performance",
    "crypto portfolio",
    "trade analytics",
    "trade log",
    "day trading journal",
  ],
  authors: [{ name: "MySaaS Team" }],
  creator: "MySaaS Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "MySaaS Trading Journal | Track, Analyze, and Improve Your Trades",
    description: "The ultimate trading journal to track your performance, analyze trades, and improve your edge in forex, crypto, and stocks.",
    siteName: "MySaaS Trading Journal",
    images: [
      {
        url: "/og-image.jpg", // We assume a default OG image will be added later
        width: 1200,
        height: 630,
        alt: "MySaaS Trading Journal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MySaaS Trading Journal | Track, Analyze, and Improve Your Trades",
    description: "The ultimate trading journal to track your performance, analyze trades, and improve your edge in forex, crypto, and stocks.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${Jakarta.variable} font-jakarta antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
