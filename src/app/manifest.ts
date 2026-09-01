import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hotel Ambarish Grand Residency by Divine View",
    short_name: "Hotel Ambarish",
    description: "3-Star Business & Transit Hotel in Paltan Bazaar, Guwahati. Direct booking & best rate guarantee.",
    start_url: "/",
    display: "standalone",
    background_color: "#0C0B0B",
    theme_color: "#0C0B0B",
    icons: [
      {
        src: "/images/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
