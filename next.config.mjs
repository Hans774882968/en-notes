import removeImports from 'next-remove-imports';

/** @type {import('next').NextConfig} */
const nextConfig = removeImports({
  reactStrictMode: true
  // transpilePackages: ['antd', '@ant-design/icons'] // useless
});

export default nextConfig;
