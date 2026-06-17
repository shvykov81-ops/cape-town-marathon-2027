export default function PrivacyPage() {
  return (
    <div className="pt-20">
      <section className="py-24 bg-neutral-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-neutral-400 mb-6">Last updated: January 1, 2027</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              We collect personal information that you provide directly to us, including your name, email address, 
              phone number, date of birth, nationality, and emergency contact details. We also collect health-related 
              information such as medical certificates required for race participation.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              We use your information to process your registration, communicate race updates, provide medical support 
              on race day, and improve our services. With your consent, we may send you promotional materials about 
              future events and partner offers.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Security</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal data against 
              unauthorized access, alteration, disclosure, or destruction. All payment processing is handled by 
              PCI-DSS compliant third-party providers.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">4. Data Sharing</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              We do not sell your personal data. We may share your information with medical personnel on race day, 
              timing service providers, and government authorities when required by law. Partner offers are only sent 
              with your explicit consent.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">5. Your Rights</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              You have the right to access, correct, or delete your personal data. You may also withdraw consent 
              for marketing communications at any time through your account settings or by contacting us directly.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">6. Cookies</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
              You can manage cookie preferences through your browser settings.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">7. Contact</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              For privacy-related inquiries, please contact us at privacy@capetownmarathon.com.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
