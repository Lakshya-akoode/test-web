export const metadata = {
    title: 'Terms and Conditions | Zugo',
    description: 'Terms and Conditions for using Zugo services.',
};

export default function TermsAndConditions() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Terms and Conditions</h1>

            <div className="prose prose-lg text-gray-600 max-w-none space-y-6">
                <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">1. Agreement to Terms</h2>
                    <p>
                        These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and Zugo (“we,” “us” or “our”), concerning your access to and use of the zugo.co.in website website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”).
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">2. Service Description</h2>
                    <p>
                        Zugo provides an online platform that connects vehicle owners with individuals seeking to rent vehicles for short-term periods. We act as an intermediary to facilitate the booking transaction.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">3. User Responsibilities</h2>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>You must be at least 18 years of age and possess a valid driving license to rent a vehicle.</li>
                        <li>You are responsible for the vehicle during the rental period and must return it in the same condition as received.</li>
                        <li>You agree to pay all rental fees, security deposits, and any penalties for traffic violations or damage.</li>
                        <li>You agree not to use the vehicle for any illegal purposes or for racing.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">4. Limitation of Liability</h2>
                    <p>
                        In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site or the vehicle rental service.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">5. Governing Law</h2>
                    <p>
                        These Terms shall be governed by and defined following the laws of India. Zugo and yourself irrevocably consent that the courts of Pune, Maharashtra shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">6. Contact Us</h2>
                    <p>
                        In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
                    </p>
                    <div className="mt-2 font-medium">
                        Email: info@zugo.co.in<br />
                        Phone: +91 9692031010
                    </div>
                </section>
            </div>
        </div>
    );
}
