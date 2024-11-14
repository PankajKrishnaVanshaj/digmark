import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/dashboard/*", // Disallow /dashboard path
    },
    sitemap: "https://digmark.pankri.com/sitemap.xml", // Location of the sitemap
  };
}
