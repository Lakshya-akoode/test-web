export default function sitemap() {
    const baseUrl = 'https://zugo.co.in';

    return [
        {
            url: baseUrl,
            lastModified: '2026-01-01',
            changeFrequency: 'daily',
            priority: 1,
        },
        // {
        //     url: `${baseUrl}/login`,
        //     lastModified: '2026-01-01',
        //     changeFrequency: 'monthly',
        //     priority: 0.8,
        // },
        // {
        //     url: `${baseUrl}/register`,
        //     lastModified: '2026-01-01',
        //     changeFrequency: 'monthly',
        //     priority: 0.8,
        // },
        {
            url: `${baseUrl}/book/bike`,
            lastModified: '2026-01-01',
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/book/car`,
            lastModified: '2026-01-01',
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/rentals`,
            lastModified: '2026-01-01',
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/register-vehicle`,
            lastModified: '2026-01-01',
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/register-rental`,
            lastModified: '2026-01-01',
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/my-vehicles`,
            lastModified: '2026-01-01',
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: `${baseUrl}/bookings`,
            lastModified: '2026-01-01',
            changeFrequency: 'daily',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: '2026-01-01',
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/terms-and-conditions`,
            lastModified: '2026-01-01',
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/cancellation-refund-policy`,
            lastModified: '2026-01-01',
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/shipping-policy`,
            lastModified: '2026-01-01',
            changeFrequency: 'yearly',
            priority: 0.5,
        },
    ];
}
