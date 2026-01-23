import { generateMetadata as generateSEOMetadata, pageMetadata } from '@/lib/metadata';

export const metadata = generateSEOMetadata({
    title: pageMetadata.register.title,
    description: pageMetadata.register.description,
    keywords: pageMetadata.register.keywords,
    canonical: 'https://zugo.co.in/register',
});

export default function RegisterLayout({ children }) {
    return children;
}
