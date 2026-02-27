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
  metadataBase: new URL("https://trading-mars.vercel.app/"), // Placeholder domain
  title: {
    default: "MARS Trading Journal | Track, Analyze, and Improve Your Trades",
    template: "%s | MARS Trading Journal",
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
  authors: [{ name: "Catalin Toro" }],
  creator: "Catalin Toro",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://trading-mars.vercel.app/",
    title: "MARS Trading Journal | Track, Analyze, and Improve Your Trades",
    description: "The ultimate trading journal to track your performance, analyze trades, and improve your edge in forex, crypto, and stocks.",
    siteName: "MARS Trading Journal",
    images: [
      {
        url: "/mars.svg", // Using the Mars planet logo for SEO og:image
        width: 1200,
        height: 630,
        alt: "MARS Trading Journal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MARS Trading Journal | Track, Analyze, and Improve Your Trades",
    description: "The ultimate trading journal to track your performance, analyze trades, and improve your edge in forex, crypto, and stocks.",
    images: ["/mars.svg"],
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
