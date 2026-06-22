import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Navigation />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
