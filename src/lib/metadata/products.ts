import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DEFAULT_LOCALE, resolveSupportedLocale } from "@/i18n/locales";
import { buildHreflangLanguages } from "@/lib/metadata/alternates";
import { buildCanonicalUrl } from "@/lib/seo";
import { getStoreUrl } from "@/lib/store";

interface ProductsMetadataParams {
  country: string;
  locale: string;
}

export async function generateProductsMetadata({
  country,
  locale,
}: ProductsMetadataParams): Promise<Metadata> {
  const supportedLocale = resolveSupportedLocale(locale) ?? DEFAULT_LOCALE;
  const t = await getTranslations({
    locale: supportedLocale,
    namespace: "products",
  });
  const title = t("allProducts");
  const description = t("browseCollection");
  const storeUrl = getStoreUrl();
  const canonicalUrl = storeUrl
    ? buildCanonicalUrl(storeUrl, `/${country}/${locale}/products`)
    : undefined;
  const languages = storeUrl
    ? await buildHreflangLanguages({
        storeUrl,
        country,
        locale,
        path: "/products",
      })
    : undefined;

  return {
    title,
    description,
    ...(canonicalUrl
      ? {
          alternates: {
            canonical: canonicalUrl,
            ...(languages ? { languages } : {}),
          },
        }
      : {}),
    openGraph: {
      title,
      description,
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      type: "website",
    },
  };
}
