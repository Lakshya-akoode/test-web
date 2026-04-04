export const metadata = {
    title: 'Zugo Dashboard',
    description: 'Browse current Zugo availability and manage your rentals.',
    robots: {
        index: false,
        follow: true,
    },
    alternates: {
        canonical: 'https://www.zugo.co.in/',
    },
};

export default function HomeLayout({ children }) {
    return children;
}
