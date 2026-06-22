import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "ru"],
  defaultLocale: "en",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/about-race": "/about-race",
    "/account": "/account",
    "/admin": "/admin",
    "/admin/trainers": "/admin/trainers",
    "/admin/bookings": "/admin/bookings",
    "/admin/packages": "/admin/packages",
    "/admin/documents": "/admin/documents",
    "/admin/package-trainers": "/admin/package-trainers",
    "/blog": "/blog",
    "/booking": "/booking",
    "/cape-town-guide": "/cape-town-guide",
    "/contact": "/contact",
    "/dashboard": "/dashboard",
    "/faq": "/faq",
    "/prep-camp": "/prep-camp",
    "/pricing": "/pricing",
    "/race-week": "/race-week",
    "/terms": "/terms",
    "/trainers": "/trainers",
    "/trainer-dashboard": "/trainer-dashboard",
    "/trainer-dashboard/profile": "/trainer-dashboard/profile",
    "/trainer-dashboard/photos": "/trainer-dashboard/photos",
    "/trainer-dashboard/calendar": "/trainer-dashboard/calendar",
    "/trainer-dashboard/settings": "/trainer-dashboard/settings",
  },
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
