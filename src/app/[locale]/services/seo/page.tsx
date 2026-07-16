import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternates } from "@/i18n/paths";
import type { Locale } from "@/i18n/routing";
import { ServicePage } from "@/components/ServicePage";

const NS = "Services.seo";
const SLUG = "/services/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: `${NS}.meta` });
  return {
    title: t("title"),
    description: t("description"),
    alternates: alternates(locale as Locale, SLUG),
  };
}

export default async function SeoServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicePage namespace={NS} />;
}
