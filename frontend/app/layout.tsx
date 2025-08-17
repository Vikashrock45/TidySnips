import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Developer Snippet Formatter & Minifier - Format JSON, JavaScript, Go, PHP Online",
  description: "Free online code formatter and minifier for developers. Format and minify JavaScript, JSON, Go, and PHP code snippets instantly. Clean up your code with our fast, browser-based tool.",
  keywords: [
    "minify javascript online",
    "format json online", 
    "golang formatter",
    "php formatter",
    "code beautifier",
    "javascript minifier",
    "json validator",
    "go code formatter",
    "php beautifier",
    "online code formatter",
    "developer tools",
    "code minifier"
  ],
  authors: [{ name: "TidySnips" }],
  robots: "index, follow",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>"
  },
  openGraph: {
    title: "Developer Snippet Formatter & Minifier",
    description: "Format and minify JavaScript, JSON, Go, and PHP code snippets online. Free developer tool for cleaning up code.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developer Snippet Formatter & Minifier",
    description: "Format and minify JavaScript, JSON, Go, and PHP code snippets online. Free developer tool for cleaning up code.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adSenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;
  
  return (
    <html lang="en">
      <head>
        {/* Google AdSense */}
        {adSenseId && adSenseId !== 'ca-pub-YOUR_PUBLISHER_ID' && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
