export const metadata = {
    title: 'Zugo Landing',
    description: 'Explore Zugo rentals and travel guides.',
    robots: {
        index: false,
        follow: true,
    },
    alternates: {
        canonical: 'https://www.zugo.co.in/',
    },
};

export default function LandingLayout({ children }) {
    return children;
}
