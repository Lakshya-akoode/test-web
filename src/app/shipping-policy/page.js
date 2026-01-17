export const metadata = {
    title: 'Shipping & Delivery Policy | Zugo',
    description: 'Shipping and Delivery Policy for Zugo - Understand how vehicle handover works.',
};

export default function ShippingPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Shipping & Delivery Policy</h1>

            <div className="prose prose-lg text-gray-600 max-w-none space-y-6">
                <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">1. Nature of Service</h2>
                    <p>
                        Zugo provides vehicle rental services. We do not ship physical products to your address in the traditional sense via couriers. Instead, "Delivery" refers to the handover of the rented vehicle.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">2. Order Fulfillment</h2>
                    <p>
                        Upon successful payment and booking confirmation:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Instant Confirmation:</strong> You will receive an immediate booking confirmation via email and SMS / WhatsApp.</li>
                        <li><strong>Access to Service:</strong> The vehicle will be available for pickup at the designated location and time selected during the booking process.</li>
                        <li><strong>Vehicle Handover:</strong> You are required to visit the pickup location to collect the vehicle. Please carry your valid Driving License and ID proof for verification.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">3. Delivery Timeline</h2>
                    <p>
                        The service is fulfilled at the specific "Start Time" chosen by you during the booking. There is no waiting period for shipping.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">4. Shipping Costs</h2>
                    <p>
                        There are no shipping charges. However, if you explicitly requested a "Doorstep Delivery" service (if available in your city), additional delivery charges may apply as shown at the time of checkout.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">5. Contact Us</h2>
                    <p>If you face any issues with locating your vehicle or the pickup point, please contact us immediately:</p>
                    <div className="mt-2 font-medium">
                        Phone: +91 9692031010<br />
                        Email: info@zugo.co.in
                    </div>
                </section>
            </div>
        </div>
    );
}
