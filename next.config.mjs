import removeImports from 'next-remove-imports';

/** @type {import('next').NextConfig} */
const nextConfig = removeImports({
  reactStrictMode: true
  // transpilePackages: ['antd', '@ant-design/icons'] // useless. Now I am just using 'antd/lib/component' to run away from the problem
});

export default nextConfig;
