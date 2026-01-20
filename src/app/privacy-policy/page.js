export const metadata = {
    title: 'Privacy Policy | Zugo',
    description: 'Privacy Policy for Zugo - Learn how we collect, use, and protect your data.',
};

export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Privacy Policy</h1>

            <div className="prose prose-lg text-gray-600 max-w-none space-y-6">
                <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
                    <p>
                        Welcome to Zugo ("we," "our," or "us"). We are committed to protecting your privacy and ensuring your personal information is handled in a safe and responsible manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website [zugo.co.in] and use our vehicle rental services.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
                    <p>We collect information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Personal Information:</strong> Name, phone number, email address, mailing address, date of birth, and driver's license details.</li>
                        <li><strong>Payment Information:</strong> We do NOT store your credit/debit card details. All payment transactions are processed through secure payment gateways (e.g., Razorpay, Stripe).</li>
                        <li><strong>Vehicle Usage Data:</strong> Dates and times of rental, mileage, and location data during the rental period for safety and tracking purposes.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
                    <p>We use the information we collect or receive:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>To facilitate account creation and logon process.</li>
                        <li>To fulfill and manage your orders and rentals.</li>
                        <li>To send you administrative information, such as product, service, and new feature information and/or information about changes to our terms, conditions, and policies.</li>
                        <li>To protect our Services and for legal compliance.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">4. Information Sharing</h2>
                    <p>
                        We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">5. Contact Us</h2>
                    <p>If you have any questions or comments about this policy, you may contact us by email at <strong>info@zugo.co.in</strong> or by post to:</p>

                </section>
            </div>
        </div>
    );
}
