/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
    // Only use static export during the production build
    ...(isProd ? { output: 'export' } : {}),
    images: {
        unoptimized: true
    },
    // In local development, proxy API calls from port 3000 -> port 8000
    async rewrites() {
        if (isProd) return [];
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/api/:path*'
            }
        ];
    }
};

export default nextConfig;
