import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SEO from '@/components/SEO';
import SiteFooter from '@/components/SiteFooter';
import SiteNav from '@/components/SiteNav';
import {
  ArrowRight, Check, DollarSign, Phone, CreditCard,
  Calendar, ShieldCheck, Zap, HelpCircle, Calculator
} from 'lucide-react';

const MONTHLY_EXAMPLES = [
  { price: 2900, months: 12, label: 'Garage Floor or Small Pickleball' },
  { price: 9000, months: 18, label: 'Half Basketball Court' },
  { price: 11700, months: 24, label: 'Half Basketball Court (Premium)' },
  { price: 21000, months: 36, label: 'Full Multi-Sport Combo Court' },
];

function approxMonthly(total, months) {
  const monthly = (total * 1.08) / months;
  return Math.round(monthly);
}

export default function Financing() {
  React.useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Court Financing — Pay Monthly with Affirm | Coast to Coast Courts"
        description="Finance your custom basketball or pickleball court with Affirm. Get approved in seconds, pay monthly. No hidden fees. Courts starting as low as $80/mo."
        keywords="court financing, basketball court financing, pickleball court payment plan, Affirm financing, buy now pay later court"
        canonical="/financing"
      />

      <SiteNav />

      {/* Hero */}
      <section className="pt-36 pb-14 bg-gradient-to-br from-[#3fb9ff]/10 via-white to-emerald-50/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4">Financing Available</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Get Your Court Now.<br />
            <span className="text-[#3fb9ff]">Pay Over Time.</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            We partner with <strong>Affirm</strong> so you can finance your dream court and spread payments over
            3, 6, 12, 24, or 36 months. Get approved in seconds at checkout with no hard credit pull to check your rate.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-[#3fb9ff] hover:bg-[#0ea5e9] text-white rounded-full h-12 px-8">
              <Link to={createPageUrl('Builder')}>
                <Calculator className="h-5 w-5 mr-2" />
                Build and Price Your Court
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full h-12 px-8">
              <a href="tel:7168072108">
                <Phone className="h-5 w-5 mr-2" />
                Call: 716-807-2108
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Affirm Banner */}
      <section className="py-8 bg-[#0fa0e1]/5 border-y border-[#3fb9ff]/20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center shrink-0">
                <span className="text-white font-black text-xl tracking-tight">affirm</span>
              </div>
              <div>
                <p className="font-bold text-slate-800 text-lg">Powered by Affirm</p>
                <p className="text-slate-500 text-sm">Buy now, pay over time</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-12 bg-slate-200" />
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-[#3fb9ff]">0%</p>
                <p className="text-xs text-slate-500">Promo rates available</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#3fb9ff]">Seconds</p>
                <p className="text-xs text-slate-500">To get approved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#3fb9ff]">36 mo</p>
                <p className="text-xs text-slate-500">Max term</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-[#3fb9ff]/10 text-[#3fb9ff] border-[#3fb9ff]/20 mb-4">Simple Process</Badge>
            <h2 className="text-3xl font-bold text-slate-800">How Financing Works</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', icon: Calculator, title: 'Design Your Court', desc: 'Use our builder to pick your size, colors, and options. See your total instantly.' },
              { step: '2', icon: CreditCard, title: 'Choose Affirm at Checkout', desc: 'Select Affirm as your payment method when you proceed to checkout.' },
              { step: '3', icon: Zap, title: 'Approved in Seconds', desc: 'Check your rate with no hard credit pull. Choose your preferred payment plan.' },
              { step: '4', icon: ShieldCheck, title: 'Your Court Ships', desc: 'We process your order and ship your tiles. Enjoy your court while you pay monthly.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#3fb9ff]/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-7 w-7 text-[#3fb9ff]" />
                </div>
                <div className="w-7 h-7 rounded-full bg-[#3fb9ff] text-white text-sm font-bold flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Monthly Payments */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4">Payment Examples</Badge>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">What Could Your Monthly Payment Look Like?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm">
              Estimates shown are for illustration purposes. Your actual rate and monthly payment will depend on creditworthiness, loan term, and Affirm's current APR. 0% APR available for qualifying customers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {MONTHLY_EXAMPLES.map((ex, i) => (
              <Card key={i} className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">{ex.label}</p>
                    <p className="text-2xl font-bold text-slate-800">${ex.price.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">Total court price</p>
                  </div>
                  <Badge variant="secondary">{ex.months} months</Badge>
                </div>
                <div className="p-4 bg-[#3fb9ff]/10 rounded-xl text-center">
                  <p className="text-xs text-slate-500 mb-1">Estimated monthly payment</p>
                  <p className="text-3xl font-bold text-[#3fb9ff]">~${approxMonthly(ex.price, ex.months).toLocaleString()}<span className="text-base font-normal text-slate-500">/mo</span></p>
                </div>
                <Button asChild className="w-full mt-4 bg-[#3fb9ff] hover:bg-[#0ea5e9] text-white">
                  <Link to={createPageUrl('Builder')}>Design This Court</Link>
                </Button>
              </Card>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-6">
            *Monthly payment estimates assume ~8% APR. Actual terms vary. Check your rate at checkout with no impact to your credit score.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-[#3fb9ff]/10 text-[#3fb9ff] border-[#3fb9ff]/20 mb-4">Why Finance?</Badge>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Don't Let Budget Hold You Back</h2>
              <ul className="space-y-4">
                {[
                  'Get your court built now, not years from now',
                  'Keep cash on hand for other projects',
                  'Spread the cost over 3 to 36 months',
                  'Check your rate without affecting your credit score',
                  '0% APR available for qualifying customers',
                  'Simple, transparent payments with no surprise fees',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-[#3fb9ff] to-[#0ea5e9] rounded-2xl p-8 text-white text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-2">Courts Starting at</h3>
              <p className="text-5xl font-black mb-2">~$80<span className="text-xl font-normal">/mo</span></p>
              <p className="text-white/80 text-sm mb-6">For a garage floor kit with 36-mo Affirm financing</p>
              <Button asChild size="lg" className="bg-white text-[#3fb9ff] hover:bg-slate-100 rounded-full w-full">
                <Link to={createPageUrl('Builder')}>
                  Get Started <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-4">FAQ</Badge>
            <h2 className="text-3xl font-bold text-slate-800">Financing Questions</h2>
          </div>
          <div className="space-y-5">
            {[
              {
                q: 'Does checking my rate affect my credit score?',
                a: 'No. Affirm does a soft credit check when you check your rate, which does not impact your credit score.',
              },
              {
                q: 'What credit score do I need?',
                a: 'Affirm considers many factors beyond just your credit score. Many customers with fair credit are approved. Check your rate in seconds at checkout.',
              },
              {
                q: 'How do I apply for financing?',
                a: 'Design your court and proceed to checkout. At the payment step, select Affirm and follow the quick application. You will get a decision in seconds.',
              },
              {
                q: 'Are there any prepayment penalties?',
                a: 'No. You can pay off your Affirm loan early at any time with no fees or penalties.',
              },
              {
                q: 'Can I finance a custom court from the builder?',
                a: 'Yes! Both our pre-configured shop packages and custom-built designs from the court builder are eligible for Affirm financing.',
              },
            ].map((item, i) => (
              <Card key={i} className="p-6 border-0 shadow-sm">
                <div className="flex items-start gap-4">
                  <HelpCircle className="h-5 w-5 text-[#3fb9ff] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-slate-800 mb-2">{item.q}</h3>
                    <p className="text-slate-500">{item.a}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#3fb9ff] to-[#0ea5e9] text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Your Court?</h2>
          <p className="text-white/80 mb-8">
            Design your court, choose Affirm at checkout, and get approved in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-white text-[#3fb9ff] hover:bg-slate-100 rounded-full h-12 px-8">
              <Link to={createPageUrl('Builder')}>
                <Calculator className="h-5 w-5 mr-2" /> Build and Finance Your Court
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#3fb9ff] rounded-full h-12 px-8">
              <a href="tel:7168072108">
                <Phone className="h-5 w-5 mr-2" /> Talk to Sales
              </a>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter variant="full" />
    </div>
  );
}