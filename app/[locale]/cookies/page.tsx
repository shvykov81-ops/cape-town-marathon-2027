export default function CookiesPage() {
  return (
    <div className="pt-20">
      <section className="py-24 bg-neutral-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-neutral-400 mb-6">Last updated: January 1, 2027</p>

            <h2 className="text-2xl font-bold mt-8 mb-4">What Are Cookies</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              Cookies are small text files that are placed on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences, 
              analyzing site usage, and personalizing content.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Types of Cookies We Use</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">Essential Cookies</h3>
            <p className="text-neutral-300 leading-relaxed mb-4">
              These cookies are necessary for the website to function properly. They enable core 
              functionality such as security, network management, and accessibility. You cannot 
              opt out of these cookies.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Analytics Cookies</h3>
            <p className="text-neutral-300 leading-relaxed mb-4">
              We use Google Analytics and similar tools to understand how visitors interact with 
              our website. This helps us improve our services and user experience. All data is 
              anonymized.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Marketing Cookies</h3>
            <p className="text-neutral-300 leading-relaxed mb-4">
              These cookies track your browsing habits to deliver relevant advertisements. They 
              are only set with your explicit consent. You can manage these preferences in your 
              account settings.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Managing Cookies</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              You can control and manage cookies through your browser settings. Most browsers allow 
              you to refuse all cookies or to indicate when a cookie is being sent. Please note that 
              disabling cookies may affect the functionality of our website.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Third-Party Cookies</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              We may allow third-party service providers to place cookies on your device for analytics 
              and advertising purposes. These providers have their own privacy policies and cookie practices.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Contact</h2>
            <p className="text-neutral-300 leading-relaxed mb-4">
              For questions about our cookie policy, please contact us at privacy@capetownmarathon.com.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
