import { generateMetadata as generateSEOMetadata, pageMetadata } from '@/lib/metadata';

export const metadata = generateSEOMetadata({
    title: pageMetadata.registerVehicle.title,
    description: pageMetadata.registerVehicle.description,
    keywords: pageMetadata.registerVehicle.keywords,
    canonical: 'https://zugo.co.in/register-vehicle',
});

export default function RegisterVehicleLayout({ children }) {
    return children;
}
