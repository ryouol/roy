import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import { Consent } from "@/components/consent";
import { ScrollProvider } from "@/components/scroll-provider";
import { siteUrl } from "@/lib/site";
import "lenis/dist/lenis.css";
import "./globals.css";

const sans = Inter({
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
  title: { default: "Roy Luo", template: "%s | Roy Luo" },
  description:
    "Software engineer and Electrical Engineering student at the University of Waterloo.",
  icons: {
    icon: [
      { url: "/favicon-32.png?v=alpine-2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png?v=alpine-2", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png?v=alpine-2",
  },
  manifest: "/manifest.webmanifest",
};
export const viewport: Viewport = { themeColor: "#edf2f7" };
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
