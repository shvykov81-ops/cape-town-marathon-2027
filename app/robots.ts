import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/trainer-dashboard",
        "/api",
        "/_next",
        "/uploads",
      ],
    },
    sitemap: "https://cape-town-marathon-2027.vercel.app/sitemap.xml",
    host: "https://cape-town-marathon-2027.vercel.app",
  };
}
