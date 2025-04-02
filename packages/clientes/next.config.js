/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

module.exports = {
    typescript:{ignoreBuildErrors: true,},
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ['www.abe.bo', 'wwwhatsnew.com'],
    },
    //output: 'standalone',
    experimental: {
        serverActions: true
    },
    basePath,
};
