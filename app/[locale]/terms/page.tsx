export default function TermsPage() {
  return (
    <div className="pt-20">
      <section className="py-24 bg-neutral-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-neutral-400 mb-6">Last updated: January 1, 2027</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              By accessing and using the Cape Town Marathon website and services, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. Registration and Eligibility</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              Participants must be at least 18 years old on race day to enter the full marathon. 
              Participants aged 16-17 may enter the half marathon with parental consent. 
              All participants must provide a valid medical certificate dated within 12 months of the event.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Entry Fees and Payments</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              All entry fees are quoted in US Dollars and must be paid in full at the time of registration. 
              Prices are subject to change without notice. Early bird pricing is available until June 30, 2027.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Cancellation and Refunds</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              Full refunds are available up to 60 days before the event. A 50% refund is available up to 30 days before the event. 
              No refunds are provided within 30 days of the event, but entries may be transferred to another runner for a $25 fee 
              or deferred to the following year's event for a $50 fee.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Event Changes</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              The organizers reserve the right to modify the course, start time, or event format due to safety concerns, 
              weather conditions, or other circumstances beyond our control. Participants will be notified of any changes 
              via email and on our website.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Liability Waiver</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              By registering, participants acknowledge that running is a physically demanding activity with inherent risks. 
              Participants agree to waive all claims against the organizers, sponsors, and volunteers for any injury, loss, 
              or damage sustained during the event.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Photography and Media</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              Participants consent to the use of their image, voice, and name in photographs, videos, and other media 
              captured during the event for promotional purposes. If you do not wish to be photographed, please notify 
              the media team at the event.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">8. Contact</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              For questions about these terms, please contact us at legal@capetownmarathon.com.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
