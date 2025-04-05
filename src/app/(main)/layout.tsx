import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FirebaseProvider } from "@/context/FirebaseContext";
import { RootLayout } from "@/components/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KodeNextDoor | Tech Consultancy",
  description: "Innovative Tech Solutions For Your Business",
  keywords: ["tech consultancy", "web development", "mobile apps", "cloud solutions", "cybersecurity"],
  authors: [{ name: "KodeNextDoor Team" }],
  creator: "KodeNextDoor",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  manifest: "/manifest.json",
  applicationName: "KodeNextDoor",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KodeNextDoor",
  },
  formatDetection: {
    telephone: true,
    date: false,
    email: true,
    address: false,
  },
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="format-detection" content="telephone=yes,email=yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FirebaseProvider>
          <RootLayout>
            {children}
          </RootLayout>
        </FirebaseProvider>
      </body>
    </html>
  );
}
