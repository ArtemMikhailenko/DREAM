import createNextIntlPlugin from "next-intl/plugin";
import { withPayload } from "@payloadcms/next/withPayload";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // the hosting build box reports dozens of CPUs; dozens of page-generation workers
    // (each with its own database pool) are more than it can actually carry
    cpus: 4,
  },
};

export default withPayload(withNextIntl(nextConfig));
