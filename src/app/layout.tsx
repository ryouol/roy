import type { Metadata, Viewport } from "next";
import { Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Roy Luo — Software Engineer",
  description:
    "Software engineer at Squint. Backend and ML systems — inference, pipelines, and the plumbing that makes AI products fast. EE at Waterloo.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0e14" },
  ],
};

// Applies the stored theme before first paint to avoid a flash.
const themeInit = `try{var t=localStorage.getItem("theme");var l=t?t==="light":matchMedia("(prefers-color-scheme: light)").matches;if(l)document.documentElement.classList.add("light")}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${instrument.variable} ${plexMono.variable} antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
