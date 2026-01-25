'use client';

import { siteConfig } from '@/lib/metadata';

export default function StructuredData() {
    // Organization Schema
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteConfig.company.name,
        legalName: siteConfig.company.legalName,
        url: siteConfig.url,
        logo: `${siteConfig.url}/path2.png`,
        foundingDate: siteConfig.company.foundingDate,
        description: siteConfig.description,
        sameAs: [
            siteConfig.social.instagram,
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            email: siteConfig.company.email,
            contactType: 'Customer Service',
            areaServed: 'IN',
            availableLanguage: ['English', 'Hindi'],
        },
    };

    // WebSite Schema with Search Action
    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteConfig.url}/rentals?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };

    // LocalBusiness Schema
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': siteConfig.url,
        name: siteConfig.company.name,
        image: `${siteConfig.url}/path2.png`,
        description: siteConfig.description,
        url: siteConfig.url,
        telephone: siteConfig.company.phone,
        email: siteConfig.company.email,
        priceRange: '₹₹',
        address: {
            '@type': 'PostalAddress',
            addressCountry: siteConfig.company.address.addressCountry,
            addressLocality: siteConfig.company.address.addressLocality,
            addressRegion: siteConfig.company.address.addressRegion,
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 28.7041, // Delhi - Update with actual coordinates
            longitude: 77.1025,
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
            ],
            opens: '00:00',
            closes: '23:59',
        },
        sameAs: [
            siteConfig.social.instagram,
        ],
    };

    // Service Schema for Vehicle Rental
    const serviceSchema = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: 'Vehicle Rental Service',
        provider: {
            '@type': 'Organization',
            name: siteConfig.company.name,
            url: siteConfig.url,
        },
        areaServed: {
            '@type': 'Country',
            name: 'India',
        },
        description: 'Self-drive bike and car rental services across India. Hourly, daily, and weekly rental options available.',
        offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
        },
    };

    // SiteNavigationElement Schema
    const siteNavigationSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: [
            {
                '@type': 'SiteNavigationElement',
                position: 1,
                name: 'Bikes in Bangalore',
                description: 'Rent bikes in Bangalore',
                url: `${siteConfig.url}/bikes-for-rent/bangalore`,
            },
            {
                '@type': 'SiteNavigationElement',
                position: 2,
                name: 'Bikes in Delhi',
                description: 'Rent bikes in Delhi',
                url: `${siteConfig.url}/bikes-for-rent/delhi`,
            },
            {
                '@type': 'SiteNavigationElement',
                position: 3,
                name: 'Bikes in Gurugram',
                description: 'Rent bikes in Gurugram',
                url: `${siteConfig.url}/bikes-for-rent/gurugram`,
            },
            {
                '@type': 'SiteNavigationElement',
                position: 4,
                name: 'Bikes in Rishikesh',
                description: 'Rent bikes in Rishikesh',
                url: `${siteConfig.url}/bikes-for-rent/rishikesh`,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(websiteSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(localBusinessSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(serviceSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(siteNavigationSchema),
                }}
            />
        </>
    );
}
