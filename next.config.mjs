/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  optimizeFonts: false, // load Google Fonts at runtime (avoids build-time fetch)
};
export default nextConfig;
