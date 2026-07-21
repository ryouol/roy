import type { Metadata, Viewport } from "next";
import { Archivo, Big_Shoulders, Martian_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const display = Big_Shoulders({
  variable: "--font-shoulders",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const body = Archivo({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Roy Luo — Software Engineer",
  description:
    "Software engineer at Squint. Backend and ML systems — inference, pipelines, and the plumbing that makes AI products fast. EE at Waterloo.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E9ECE6" },
    { media: "(prefers-color-scheme: dark)", color: "#122B44" },
  ],
};

// Applies the stored theme before first paint to avoid a flash.
// Default is the drafting film (light); .dark is the cyanotype.
const themeInit = `try{var t=localStorage.getItem("theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
