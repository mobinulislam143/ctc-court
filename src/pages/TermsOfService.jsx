import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-slate-500 mb-8">Coast to Coast Courts LLC</p>
          <p className="text-sm text-slate-500 mb-12">Last Updated: January 30, 2026</p>

          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Agreement to Terms</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              These Terms of Service ("Terms") govern your access to and use of the Coast to Coast Courts website, products, and services ("Services"). By purchasing products from or accessing Coast to Coast Courts ("Company," "we," "us," or "our"), you agree to be bound by these Terms.
            </p>
            <p className="text-slate-600 mb-6">If you do not agree, do not use our Services.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Scope of Services (Materials Only)</h2>
            <p className="text-slate-600 mb-4">Coast to Coast Courts is a materials-only supplier of modular sports court systems.</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>We do not provide installation services</li>
              <li>We do not supervise installation</li>
              <li>We do not provide labor, permitting, or inspections</li>
              <li>All installations are performed solely at the customer's discretion and risk</li>
            </ul>
            <p className="text-slate-600 mb-6">Any installation guidance, diagrams, or instructions are informational only.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Eligibility</h2>
            <p className="text-slate-600 mb-6">You must be at least 18 years old or have legal authority to enter into a binding agreement to purchase our products.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Orders & Payment</h2>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>All orders are subject to acceptance and availability</li>
              <li>Prices are listed in USD unless stated otherwise</li>
              <li>Full payment is required prior to shipment</li>
              <li>We reserve the right to cancel or refuse any order</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Shipping & Delivery</h2>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Shipping timelines are estimates only</li>
              <li>Risk of loss transfers to the customer upon carrier pickup</li>
              <li>We are not responsible for delays caused by freight carriers, weather, or force majeure events</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Installation Responsibility & Assumption of Risk</h2>
            <p className="text-slate-600 mb-4">By purchasing from Coast to Coast Courts, you acknowledge and agree that:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Installation is performed entirely by you or your contractor</li>
              <li>You assume all risks related to installation, surface preparation, and usage</li>
              <li>Coast to Coast Courts is not liable for improper installation, misuse, or failure to follow provided documentation</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Disclaimer of Warranties</h2>
            <p className="text-slate-600 mb-4">All products are provided "AS IS" and "AS AVAILABLE" unless otherwise stated in writing.</p>
            <p className="text-slate-600 mb-4">We disclaim all warranties, express or implied, including:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Limitation of Liability</h2>
            <p className="text-slate-600 mb-4">To the fullest extent permitted by law:</p>
            <p className="text-slate-600 mb-4">Coast to Coast Courts shall not be liable for:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Personal injury</li>
              <li>Property damage</li>
              <li>Lost profits</li>
              <li>Installation errors</li>
              <li>Indirect or consequential damages</li>
            </ul>
            <p className="text-slate-600 mb-6">Our total liability shall not exceed the amount paid for the product.</p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Indemnification</h2>
            <p className="text-slate-600 mb-4">You agree to indemnify and hold harmless Coast to Coast Courts from any claims, damages, losses, or expenses arising from:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Installation</li>
              <li>Use or misuse of products</li>
              <li>Violation of these Terms</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-4">Governing Law</h2>
            <p className="text-slate-600 mb-6">These Terms are governed by the laws of the State of Florida, without regard to conflict-of-law principles.</p>

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