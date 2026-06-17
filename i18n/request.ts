import { getRequestConfig } from "next-intl/server";
import { Locale, defaultLocale, locales } from "./config";

export default getRequestConfig(async ({ locale }) => {
  // Validate locale — ensure it's always a string
  const validLocale: Locale = locales.includes(locale as Locale) 
    ? (locale as Locale) 
    : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`../messages/${validLocale}.json`)).default,
    timeZone: "Africa/Johannesburg",
    now: new Date(),
  };
});
