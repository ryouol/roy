import type { Metadata, Viewport } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import { Consent } from "@/components/consent";
import { ScrollProvider } from "@/components/scroll-provider";
import { siteUrl } from "@/lib/site";
import "lenis/dist/lenis.css";
import "./globals.css";

const sans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});
const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Roy Luo — A little further", template: "%s | Roy Luo" },
  description:
    "Software engineer. Systems, curiosity, and the road less travelled.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32" },
      { url: "/favicon-16.png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};
export const viewport: Viewport = { themeColor: "#10282b" };
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await headers(); // Per-request rendering lets Next attach the CSP nonce to its scripts.
  return (
    <html lang="en">
      <body className={`${sans.variable} ${mono.variable}`}>
        <ScrollProvider />
        {children}
        <Consent />
      </body>
    </html>
  );
}
