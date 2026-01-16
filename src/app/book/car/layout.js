import { generateMetadata as generateSEOMetadata, pageMetadata } from '@/lib/metadata';

export const metadata = generateSEOMetadata({
    title: pageMetadata.bookCar.title,
    description: pageMetadata.bookCar.description,
    keywords: pageMetadata.bookCar.keywords,
    canonical: 'https://zugo.co.in/book/car',
});

export default function BookCarLayout({ children }) {
    return children;
}
