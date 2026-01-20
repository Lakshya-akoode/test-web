import { generateMetadata as generateSEOMetadata, pageMetadata } from '@/lib/metadata';

export const metadata = generateSEOMetadata({
    title: pageMetadata.rentals.title,
    description: pageMetadata.rentals.description,
    keywords: pageMetadata.rentals.keywords,
    canonical: 'https://zugo.co.in/rentals',
});

export default function RentalsLayout({ children }) {
    return children;
}
