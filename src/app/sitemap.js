export default function sitemap() {
    const currentDate = new Date();

    return [
        {
            url: 'https://www.zugo.co.in',
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: 'https://www.zugo.co.in/bikes-for-rent/rishikesh',
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: 'https://www.zugo.co.in/bikes-for-rent/delhi',
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: 'https://www.zugo.co.in/bikes-for-rent/bangalore',
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: 'https://www.zugo.co.in/bikes-for-rent/gurugram',
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.6,
        },
        {
            url: 'https://www.zugo.co.in/bike-rent-pricing',
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: 'https://www.zugo.co.in/book/bike',
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: 'https://www.zugo.co.in/rentals/rishikesh',
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: 'https://www.zugo.co.in/blog',
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: 'https://www.zugo.co.in/blog/bike-rental-guide-rishikesh',
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];
}
