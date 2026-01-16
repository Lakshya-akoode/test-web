import { generateMetadata as generateSEOMetadata, pageMetadata } from '@/lib/metadata';

export const metadata = generateSEOMetadata({
    title: pageMetadata.bookBike.title,
    description: pageMetadata.bookBike.description,
    keywords: pageMetadata.bookBike.keywords,
    canonical: 'https://zugo.co.in/book/bike',
});

export default function BookBikeLayout({ children }) {
    return children;
}
