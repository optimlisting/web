/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@optim/ui"],
  basePath: "/dashboard",
  outputFileTracingRoot: path.resolve(__dirname, "../../"),
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
};

export default nextConfig;
