const withNextIntl = require("next-intl/plugin")("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = withNextIntl({
  images: {
    unoptimized: true,
  },
  // Add any existing config here
});

module.exports = nextConfig;
