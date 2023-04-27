/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    appDir: true,
  },
  ignoreDuringBuilds: true,
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
    silent: true,
  },
  serverPort: 8080
};

module.exports = config;