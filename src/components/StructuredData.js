import { siteConfig } from '@/lib/metadata';

export default function StructuredData() {
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
        </>
    );
}
