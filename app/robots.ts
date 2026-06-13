import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep the staff portal out of search results.
      disallow: ["/portal/", "/api/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
