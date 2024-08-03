/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    domains: ['cdn.sanity.io'],
  },
};

export default nextConfig;
