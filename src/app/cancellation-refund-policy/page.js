export const metadata = {
    title: 'Refund & Cancellation Policy | Zugo',
    description: 'Cancellation and Refund Policy for Zugo vehicle rentals.',
};

export default function RefundPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16 md:py-24">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Cancellation & Refund Policy</h1>

            <div className="prose prose-lg text-gray-600 max-w-none space-y-6">
                <p className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">1. Cancellation Policy</h2>
                    <p>We understand that plans can change. Our cancellation policy is designed to be fair to both renters and vehicle owners.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li><strong>Free Cancellation:</strong> You can cancel your booking for free up to 24 hours before the scheduled pick-up time.</li>
                        <li><strong>Late Cancellation:</strong> Cancellations made within 24 hours of the scheduled pick-up time will incur a cancellation fee equal to 50% of the daily rental rate.</li>
                        <li><strong>No-Show:</strong> If you fail to show up for your booking without prior notice, no refund will be issued.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">2. Refund Policy</h2>
                    <p>
                        Refunds will be processed based on the cancellation policy mentioned above.
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li><strong>Refund Eligibility:</strong> Eligible refunds will be processed within 5-7 working days.</li>
                        <li><strong>Refund Method:</strong> Refunds will be credited back to the original payment source (Credit Card, Debit Card, UPI, etc.) used during the booking.</li>
                        <li><strong>Security Deposit:</strong> Security deposits (if any) are fully refundable upon the safe return of the vehicle, subject to inspection for damages. The deposit refund is typically initiated within 24 hours of vehicle return.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">3. How to Request a Cancellation</h2>
                    <p>
                        To cancel your booking, please log in to your account, go to "My Bookings," and select the "Cancel Booking" option. Alternatively, you can contact our support team.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">4. Contact Us</h2>
                    <p>If you have any questions about our Refunds & Cancellations, please contact us:</p>
                    <div className="mt-2 font-medium">
                        Email: info@zugo.co.in<br />
                        Phone: +91 9692031010
                    </div>
                </section>
            </div>
        </div>
    );
}
