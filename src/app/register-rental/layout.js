import { generateMetadata as generateSEOMetadata, pageMetadata } from '@/lib/metadata';

export const metadata = generateSEOMetadata({
    title: pageMetadata.registerRental.title,
    description: pageMetadata.registerRental.description,
    keywords: pageMetadata.registerRental.keywords,
    canonical: 'https://zugo.co.in/register-rental',
});

export default function RegisterRentalLayout({ children }) {
    return children;
}
