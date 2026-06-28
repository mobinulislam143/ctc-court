import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/a8c19e1c9_Untitleddesign4.png" 
                alt="Coast to Coast Courts"
                className="h-10 w-10"
              />
              <span className="font-bold text-xl text-slate-800 hidden sm:block">Coast to Coast Courts</span>
            </Link>
            <Button variant="ghost" asChild>
              <Link to={createPageUrl('Home')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-slate-500 mb-8">Coast to Coast Courts LLC</p>
          <p className="text-sm text-slate-500 mb-12">Effective Date: January 30, 2026</p>

          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed mb-8">
              Coast to Coast Courts ("Company," "we," "our," or "us") respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, store, and disclose information when you access our website, purchase our products, or otherwise interact with us.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Information We Collect</h2>

            <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-3">A. Information You Provide Directly</h3>
            <p className="text-slate-600 mb-4">We may collect personal information you voluntarily provide, including:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Billing and shipping address</li>
              <li>Order details and correspondence</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Payment Information</h3>
            <p className="text-slate-600 mb-4">All payment transactions are processed through third-party payment processors.</p>
            <p className="text-slate-600 mb-6">We do not store or have access to full credit card numbers or banking details.</p>

            <h3 className="text-xl font-semibold text-slate-900 mt-8 mb-3">Automatically Collected Information</h3>
            <p className="text-slate-600 mb-4">When you access our website, we may automatically collect:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>IP address</li>
              <li>Device type and browser information</li>
              <li>Pages viewed and time spent on site</li>
              <li>Referring URLs</li>
            </ul>
            <p className="text-slate-600 mb-6">This data is used for analytics, security, and site optimization.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">How We Use Your Information</h2>
            <p className="text-slate-600 mb-4">We use collected information strictly for legitimate business purposes, including to:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Process and fulfill orders</li>
              <li>Ship products and communicate delivery updates</li>
              <li>Respond to customer inquiries</li>
              <li>Improve website performance and user experience</li>
              <li>Prevent fraud and unauthorized access</li>
              <li>Comply with legal and regulatory obligations</li>
            </ul>
            <p className="text-slate-600 font-semibold mb-6">We do not sell, rent, or trade personal information.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Cookies & Tracking Technologies</h2>
            <p className="text-slate-600 mb-4">We may use cookies or similar technologies to:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Enable core site functionality</li>
              <li>Analyze traffic and performance</li>
              <li>Improve user experience</li>
            </ul>
            <p className="text-slate-600 mb-6">You may disable cookies through your browser settings; however, certain site features may not function properly.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Third-Party Service Providers</h2>
            <p className="text-slate-600 mb-4">We may share limited personal information with trusted third parties strictly as necessary to operate our business, including:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Payment processors</li>
              <li>Shipping and freight carriers</li>
              <li>Website hosting and analytics providers</li>
            </ul>
            <p className="text-slate-600 mb-6">All third-party partners are required to maintain appropriate data protection standards.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Data Retention</h2>
            <p className="text-slate-600 mb-4">We retain personal information only as long as necessary to:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Fulfill orders</li>
              <li>Maintain business records</li>
              <li>Comply with legal requirements</li>
            </ul>
            <p className="text-slate-600 mb-6">When data is no longer required, it is securely deleted or anonymized.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Data Security</h2>
            <p className="text-slate-600 mb-4">We implement commercially reasonable administrative, technical, and physical safeguards designed to protect your personal information.</p>
            <p className="text-slate-600 mb-6">However, no method of transmission or storage is 100% secure. You acknowledge and accept this risk.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Your Privacy Rights</h2>
            <p className="text-slate-600 mb-4">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Request access to your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of certain data</li>
              <li>Opt out of non-essential communications</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Children's Privacy</h2>
            <p className="text-slate-600 mb-4">Our website and products are not intended for individuals under the age of 13.</p>
            <p className="text-slate-600 mb-6">We do not knowingly collect personal information from children.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">International Users</h2>
            <p className="text-slate-600 mb-6">If you access our site from outside the United States, you acknowledge that your information may be transferred to and processed in the U.S., where data protection laws may differ from those in your jurisdiction.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Changes to This Policy</h2>
            <p className="text-slate-600 mb-4">We reserve the right to update this Privacy Policy at any time. Updates will be posted on this page with a revised effective date.</p>
            <p className="text-slate-600 mb-6">Continued use of our services constitutes acceptance of the updated policy.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Contact Information</h2>
            <p className="text-slate-600 mb-2">Coast to Coast Courts LLC</p>
            <p className="text-slate-600">Email: <a href="mailto:coasttocoastcourts@gmail.com" className="text-[#3fb9ff] hover:underline">coasttocoastcourts@gmail.com</a></p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          © 2026 Coast to Coast Courts. All rights reserved.
        </div>
      </footer>
    </div>
  );
}