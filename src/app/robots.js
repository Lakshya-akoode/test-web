export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/login', '/register', '/dashboard', '/admin'],
        },
        sitemap: 'https://www.zugo.co.in/sitemap.xml',
    };
}
