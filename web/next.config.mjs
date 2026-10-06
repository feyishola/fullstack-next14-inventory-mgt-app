/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Self-contained server for the Docker image (Vercel ignores this)
  output: "standalone",
  // This app lives in web/ beside the legacy app's lockfile; pin the root
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
