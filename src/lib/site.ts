import type { Metadata } from "next";

export const siteUrl =
  process.env.SITE_URL ?? "https://roy-nu-three.vercel.app";
export const email = "r55luo@uwaterloo.ca";
export const socialLinks = {
  github: "https://github.com/ryouol",
  linkedin: "https://linkedin.com/in/ee-royluo",
};
export function pageMetadata(
  title: string,
  description: string,
  path = "/",
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Roy Luo — Software engineer.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}
