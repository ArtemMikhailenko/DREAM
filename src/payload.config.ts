import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { en } from "@payloadcms/translations/languages/en";
import { ru } from "@payloadcms/translations/languages/ru";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Leads } from "./collections/Leads";
import { Services } from "./collections/Services";
import { Cases } from "./collections/Cases";
import { Testimonials } from "./collections/Testimonials";
import { Home } from "./globals/Home";
import { About } from "./globals/About";
import { Nav } from "./globals/Nav";
import { Showreel } from "./globals/Showreel";
import { LeadForm } from "./globals/LeadForm";
import { ServicesIndex } from "./globals/ServicesIndex";
import { PortfolioPage } from "./globals/PortfolioPage";
import { TestimonialsPage } from "./globals/TestimonialsPage";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  // Keep Payload's REST API off /api — the site already owns /api/lead.
  routes: { admin: "/admin", api: "/payload-api" },
  admin: {
    user: Users.slug,
    theme: "dark",
    // Local convenience only: set PAYLOAD_AUTOLOGIN_EMAIL in .env to skip the login
    // screen while working on the admin. Never enabled outside development, and the
    // variable is absent in production, so this cannot weaken the live panel.
    autoLogin:
      process.env.NODE_ENV === "development" && process.env.PAYLOAD_AUTOLOGIN_EMAIL
        ? { email: process.env.PAYLOAD_AUTOLOGIN_EMAIL }
        : false,
    meta: {
      titleSuffix: " — dc.prod",
      description: "Панель управления сайтом dc.prod",
    },
    components: {
      graphics: {
        Logo: "@/admin/Brand#Logo",
        Icon: "@/admin/Brand#Icon",
      },
      // Branded landing above Payload's default card grid.
      beforeDashboard: ["@/admin/Dashboard#Dashboard"],
      // Fills the empty stretch of the header with the link editors want most.
      actions: ["@/admin/HeaderActions#HeaderActions"],
    },
  },
  // The site ships en (root), /ru and /he (RTL) — mirror that here so every
  // editable field can be translated per locale from one place.
  localization: {
    locales: [
      { label: "English", code: "en" },
      { label: "Русский", code: "ru" },
      { label: "עברית", code: "he", rtl: true },
    ],
    defaultLocale: "en",
    fallback: true,
  },
  collections: [Services, Cases, Testimonials, Media, Leads, Users],
  globals: [Home, Showreel, ServicesIndex, PortfolioPage, TestimonialsPage, About, Nav, LeadForm],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || "" },
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  sharp,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  // Admin UI language (separate from the site's content locales above).
  i18n: { supportedLanguages: { ru, en }, fallbackLanguage: "ru" },
});
