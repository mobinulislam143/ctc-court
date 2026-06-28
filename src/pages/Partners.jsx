import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import {
  ArrowRight, Check, DollarSign, Wrench, Users, Send, Loader2, CheckCircle, Star
} from 'lucide-react';

const BENEFITS = [
  {
    icon: Wrench,
    title: 'Installation Referrals',
    desc: 'If a customer in your area wants professional installation, we call you first. Courts snap together with a simple interlocking design — fast, simple installs that fit your schedule.',
  },
  {
    icon: DollarSign,
    title: '15% Referral Commission',
    desc: 'Send us a client who orders a court and earn 15% of our profit margin. Our margins are strong, so this adds up fast.',
  },
  {
    icon: Star,
    title: 'Stack Your Earnings',
    desc: 'Charge for the install AND earn the referral commission. One deal can put a few hundred to a few thousand dollars in your pocket.',
  },
];

const WHO_WE_WORK_WITH = [
  'Concrete contractors',
  'Asphalt contractors',
  'Home builders & GCs',
  'Landscapers',
  'Handymen & renovation crews',
  'Athletic facility managers',
];

export default function Partners() {
  React.useEffect(() => { window.scrollTo(0, 0); }, []);

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    trade: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await base44.entities.Lead.create({
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        city: form.city,
        state: form.state,
        notes: `PARTNER APPLICATION\nTrade: ${form.trade}\n\n${form.message}`,
        timeline: 'browsing',
        status: 'new',
        estimated_value: 0,
      });
      setSubmitted(true);
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Become a Certified Court Partner | Coast to Coast Courts"
        description="Partner with Coast to Coast Courts. Earn installation referrals and 15% commission on court sales in your area. Ideal for contractors, builders, and landscapers."
        canonical="/partners"
      />

      <SiteNav />

      {/* Hero */}
      <section className="pt-36 pb-14 bg-gradient-to-br from-[#3fb9ff]/8 via-white to-amber-50/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="bg-[#3fb9ff]/10 text-[#3fb9ff] border-[#3fb9ff]/20 mb-4">Certified Court Partner Program</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Partner With Us.<br />
            <span className="text-[#3fb9ff]">Get Paid in Your City.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            We're looking for reliable local partners across the US — contractors, builders, and tradespeople
            who can handle installs when clients need them, and earn referral commissions when they send us business.
          </p>
          <a href="#apply" className="inline-flex items-center gap-2 bg-[#3fb9ff] hover:bg-[#0ea5e9] text-white font-semibold px-8 py-3 rounded-full transition-colors">
            Apply to Be a Partner <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      {/* Two Opportunities */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4">Two Ways to Earn</Badge>
            <h2 className="text-3xl font-bold text-slate-800">How the Partnership Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {BENEFITS.map((b, i) => (
              <Card key={i} className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#3fb9ff]/10 flex items-center justify-center mb-4">
                  <b.icon className="h-6 w-6 text-[#3fb9ff]" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{b.title}</h3>
                <p className="text-slate-500 text-sm">{b.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Earning Example */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">What Can You Make?</h2>
          <p className="text-slate-400 mb-10">Here's a realistic example from a single court deal.</p>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm mb-2">Installation Fee</p>
              <p className="text-3xl font-bold text-[#3fb9ff]">$500–$2,000</p>
              <p className="text-slate-500 text-xs mt-2">You set your own rate</p>
            </div>
            <div className="bg-slate-800 rounded-2xl p-6">
              <p className="text-slate-400 text-sm mb-2">Referral Commission</p>
              <p className="text-3xl font-bold text-[#3fb9ff]">15%</p>
              <p className="text-slate-500 text-xs mt-2">Of our profit margin</p>
            </div>
            <div className="bg-[#3fb9ff] rounded-2xl p-6">
              <p className="text-white/80 text-sm mb-2">Combined Per Deal</p>
              <p className="text-3xl font-bold text-white">$500–$3,000+</p>
              <p className="text-white/70 text-xs mt-2">From a single referral</p>
            </div>
          </div>
          <p className="text-slate-500 text-sm mt-8">
            No guaranteed volume — but when deals come to your area, you're our first call.
          </p>
        </div>
      </section>

      {/* Who We're Looking For */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 mb-4">Who We Work With</Badge>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Ideal for Local Tradespeople</h2>
              <p className="text-slate-500 mb-6">
                Our tiles snap together with a simple interlocking design — no special tools or experience needed.
                If you work with concrete, asphalt, or general construction, you can handle installs.
                And anyone with a local network can send us referrals.
              </p>
              <ul className="space-y-3">
                {WHO_WE_WORK_WITH.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-[#3fb9ff] to-[#0ea5e9] rounded-2xl p-8 text-white">
              <Users className="h-10 w-10 mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-3">No Exclusivity. No Minimums.</h3>
              <p className="text-white/85 mb-4">
                This isn't a franchise. There's no required monthly volume and no upfront cost. 
                You stay in your lane doing what you do — we just want someone reliable we can call 
                when the opportunity comes to your market.
              </p>
              <p className="text-white/70 text-sm">
                The more local deals we land together, the more consistent the work becomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <Badge className="bg-[#3fb9ff]/10 text-[#3fb9ff] border-[#3fb9ff]/20 mb-4">Apply Now</Badge>
            <h2 className="text-3xl font-bold text-slate-800">Apply to Be a Certified Partner</h2>
            <p className="text-slate-500 mt-2">Tell us a bit about yourself and where you operate. We'll be in touch.</p>
          </div>

          {submitted ? (
            <Card className="p-12 text-center border-0 shadow-lg">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Application Received!</h2>
              <p className="text-slate-500 mb-6">
                Thanks for your interest. We'll review your application and reach out soon.
              </p>
              <Button asChild className="bg-[#3fb9ff] hover:bg-[#0ea5e9]">
                <Link to={createPageUrl('Home')}>Back to Home</Link>
              </Button>
            </Card>
          ) : (
            <Card className="p-8 border-0 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" required className="mt-1.5" placeholder="John Smith"
                      value={form.full_name} onChange={(e) => setForm(p => ({ ...p, full_name: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" required className="mt-1.5" placeholder="john@example.com"
                      value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" type="tel" required className="mt-1.5" placeholder="(555) 123-4567"
                      value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div>
                    <Label>Trade / Business Type *</Label>
                    <Select required value={form.trade} onValueChange={(v) => setForm(p => ({ ...p, trade: v }))}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select your trade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concrete">Concrete Contractor</SelectItem>
                        <SelectItem value="asphalt">Asphalt Contractor</SelectItem>
                        <SelectItem value="builder">Home Builder / GC</SelectItem>
                        <SelectItem value="landscaper">Landscaper</SelectItem>
                        <SelectItem value="handyman">Handyman / Renovation</SelectItem>
                        <SelectItem value="facility">Athletic Facility Manager</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" required className="mt-1.5" placeholder="Buffalo"
                      value={form.city} onChange={(e) => setForm(p => ({ ...p, city: e.target.value }))} />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" required className="mt-1.5" placeholder="NY"
                      value={form.state} onChange={(e) => setForm(p => ({ ...p, state: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message">Tell Us About Your Business</Label>
                  <Textarea id="message" className="mt-1.5 min-h-[100px]"
                    placeholder="How long have you been in business? What services do you offer? Anything else we should know."
                    value={form.message} onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))} />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#3fb9ff] hover:bg-[#0ea5e9] h-12 text-base">
                  {isSubmitting ? (
                    <><Loader2 className="h-5 w-5 animate-spin mr-2" />Submitting...</>
                  ) : (
                    <><Send className="h-5 w-5 mr-2" />Submit Application</>
                  )}
                </Button>
              </form>
            </Card>
          )}
        </div>
      </section>

      <SiteFooter variant="full" />
    </div>
  );
}