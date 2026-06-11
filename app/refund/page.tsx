export default function RefundPage() {
  return (
    <div className="pt-20">
      <section className="py-24 bg-neutral-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-neutral-400 mb-6">Last updated: January 1, 2027</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Standard Refunds</h2>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 text-sm font-semibold text-neutral-400">Cancellation Period</th>
                    <th className="text-left py-2 text-sm font-semibold text-neutral-400">Refund Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="py-3">60+ days before event</td>
                    <td className="py-3 text-teal-400 font-semibold">100% refund</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-3">30-59 days before event</td>
                    <td className="py-3 text-yellow-400 font-semibold">50% refund</td>
                  </tr>
                  <tr>
                    <td className="py-3">Less than 30 days</td>
                    <td className="py-3 text-red-400 font-semibold">No refund</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Entry Transfer</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              If you cannot participate, you may transfer your entry to another runner up to 14 days before the event. 
              A $25 administrative fee applies. The new participant must meet all eligibility requirements and provide 
              a valid medical certificate.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Event Cancellation</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              In the unlikely event that the marathon is cancelled by organizers due to force majeure (natural disasters, 
              pandemic, government restrictions), participants will receive a full refund or the option to defer their 
              entry to the following year at no additional cost.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Medical Withdrawal</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              If you withdraw due to documented medical reasons (doctor's note required), you may receive a 75% refund 
              up to 14 days before the event, or defer your entry to the following year at no cost.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">How to Request a Refund</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              Log into your account dashboard and navigate to "My Bookings." Select the booking you wish to cancel 
              and follow the cancellation process. Refunds are processed within 14 business days to the original 
              payment method.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Contact</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              For refund inquiries, please contact us at refunds@capetownmarathon.com.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
