import { generateMetadata as generateSEOMetadata, pageMetadata } from '@/lib/metadata';

export const metadata = generateSEOMetadata({
    title: pageMetadata.login.title,
    description: pageMetadata.login.description,
    keywords: pageMetadata.login.keywords,
    canonical: 'https://zugo.co.in/login',
});

export default function LoginLayout({ children }) {
    return children;
}
