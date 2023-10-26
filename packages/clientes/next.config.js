/** @type {import('next').NextConfig} */
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
    }
};
