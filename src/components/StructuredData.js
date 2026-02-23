'use client';

import { siteConfig } from '@/lib/metadata';
import { cityContent } from '@/lib/cityContent';

export default function StructuredData() {
    // Organization Schema
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteConfig.company.name,
        legalName: siteConfig.company.legalName,
        url: siteConfig.url,
        logo: `${siteConfig.url}/black_logo.png`,
        foundingDate: siteConfig.company.foundingDate,
        description: siteConfig.description,
        sameAs: [
            siteConfig.social.instagram,
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: siteConfig.company.phone,
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

    // AutoRental Schema (more specific than LocalBusiness for vehicle rental)
    const autoRentalSchema = {
        '@context': 'https://schema.org',
        '@type': 'AutoRental',
        '@id': siteConfig.url,
        name: siteConfig.company.name,
        image: `${siteConfig.url}/black_logo.png`,
        description: siteConfig.description,
        url: siteConfig.url,
        telephone: siteConfig.company.phone,
        email: siteConfig.company.email,
        priceRange: '₹₹',
        address: {
            '@type': 'PostalAddress',
            addressLocality: siteConfig.company.address.addressLocality,
            addressRegion: siteConfig.company.address.addressRegion,
            addressCountry: siteConfig.company.address.addressCountry,
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 30.0869, // Rishikesh
            longitude: 78.2676,
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                'Friday', 'Saturday', 'Sunday',
            ],
            opens: '00:00',
            closes: '23:59',
        },
        areaServed: Object.values(cityContent).map(city => ({
            '@type': 'City',
            name: city.name,
        })),
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
        areaServed: Object.values(cityContent).map(city => ({
            '@type': 'City',
            name: city.name,
        })),
        description: 'Self-drive bike, scooty and car rental services across India. Hourly, daily, weekly, and monthly rental options available in Rishikesh, Delhi, Bangalore, and Gurugram.',
        offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'INR',
            lowPrice: '20',
            highPrice: '5000',
            offerCount: '100+',
            availability: 'https://schema.org/InStock',
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Vehicle Rental Catalog',
            itemListElement: [
                {
                    '@type': 'OfferCatalog',
                    name: 'Bike Rentals',
                    description: 'Self-drive bike and motorcycle rentals',
                },
                {
                    '@type': 'OfferCatalog',
                    name: 'Scooty Rentals',
                    description: 'Scooter and scooty on rent',
                },
                {
                    '@type': 'OfferCatalog',
                    name: 'Car Rentals',
                    description: 'Self-drive car rentals',
                },
            ],
        },
    };

    // SiteNavigationElement Schema — dynamic from cityContent
    const siteNavigationSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: Object.entries(cityContent).map(([key, city], idx) => ({
            '@type': 'SiteNavigationElement',
            position: idx + 1,
            name: `Bike Rental in ${city.name}`,
            description: `Rent bikes and scooters in ${city.name}`,
            url: `${siteConfig.url}/bikes-for-rent/${key}`,
        })),
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
                    __html: JSON.stringify(autoRentalSchema),
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
