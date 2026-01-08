import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: '#0F172A',
}

export const metadata: Metadata = {
  title: {
    default: "ArkAlliance | The Global Command Center for B2B Travel",
    template: "%s | ArkAlliance - Dominate the Global Travel Market"
  },
  description: "ArkAlliance is the premium ecosystem where verified global suppliers and elite travel agents build profitable, exclusive partnerships. Join the Phase 1 Early Bird intake to access vetted inventory and industry-leading ROI.",
  keywords: ["B2B Travel Marketplace", "Travel Supplier Portal", "Global Travel Agent Network", "Hospitality ROI", "Founding Member Program"],
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: "ArkAlliance | The Global Command Center for B2B Travel",
    description: "ArkAlliance is the premium ecosystem where verified global suppliers and elite travel agents build profitable, exclusive partnerships.",
    url: 'https://arkalliance.com',
    siteName: 'ArkAlliance',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'ArkAlliance - Dominate the Global Market',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

import { CurrencyProvider } from "@/context/CurrencyContext";
import { LanguageProvider } from "@/context/LanguageContext";
import GlobalHeader from "@/components/layout/GlobalHeader";
import Footer from "@/components/layout/Footer";

import UserPresenceTracker from "@/components/layout/UserPresenceTracker";

import { Toaster } from 'react-hot-toast'

import GoogleTranslateWidget from "@/components/common/GoogleTranslateWidget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <CurrencyProvider>
            <UserPresenceTracker />
            <Toaster position="top-right" />
            <GoogleTranslateWidget />
            <GlobalHeader />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
