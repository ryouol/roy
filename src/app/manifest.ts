import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Roy Luo — Software engineer",
    short_name: "Roy Luo",
    start_url: "/",
    display: "standalone",
    background_color: "#edf2f7",
    theme_color: "#edf2f7",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
