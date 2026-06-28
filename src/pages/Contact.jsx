import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowRight, Phone, Mail, MapPin, Clock, 
  Send, Loader2, CheckCircle, MessageSquare
} from 'lucide-react';

export default function Contact() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await base44.entities.Lead.create({
        ...form,
        city: '',
        state: '',
        surface_type: '',
        indoor_outdoor: '',
        timeline: 'browsing',
        notes: `Subject: ${form.subject}\n\nMessage: ${form.message}`,
        status: 'new',
        estimated_value: 0,
      });

      // Send to master Base44 website (don't block on errors)
      try {
        await fetch('https://base44-command-center-1b9e765e.base44.app/api/functions/receiveInquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            business_name: "Coast to Coast Courts",
            type: "contact_form",
            priority: "normal",
            source: "Coast to Coast Courts - Contact Form",
            contact_name: form.full_name,
            contact_email: form.email,
            contact_phone: form.phone,
            subject: form.subject,
            message: form.message
          })
        });
      } catch (err) {
        console.error('Failed to send to master website:', err);
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
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

            <div className="hidden md:flex items-center gap-8">
              <Link to={createPageUrl('Products')} className="text-slate-600 hover:text-slate-800 text-sm font-medium">Products</Link>
              <Link to={createPageUrl('HowItWorks')} className="text-slate-600 hover:text-slate-800 text-sm font-medium">How It Works</Link>
              <Link to={createPageUrl('Gallery')} className="text-slate-600 hover:text-slate-800 text-sm font-medium">Gallery</Link>
              <Link to={createPageUrl('Pricing')} className="text-slate-600 hover:text-slate-800 text-sm font-medium">Pricing</Link>
            </div>

            <Button asChild className="bg-[#3fb9ff] hover:bg-[#0ea5e9] text-white">
              <Link to={createPageUrl('Builder')}>
                Build Your Court
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-[#3fb9ff]/10 text-[#3fb9ff] border-[#3fb9ff]/20 mb-4">Get In Touch</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              We're Here to Help
            </h1>
            <p className="text-lg text-slate-500">
              Have questions about our products or your project? Our team is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-[#3fb9ff] to-[#0ea5e9] text-white">
                <Phone className="h-8 w-8 mb-4" />
                <h3 className="font-bold text-xl mb-2">Text Us</h3>
                <p className="text-white/80 mb-4">Available 24/7</p>
                <a href="tel:7168072108" className="text-2xl font-bold hover:underline">
                  716-807-2108
                </a>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <Card className="p-12 text-center border-0 shadow-lg">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Message Sent!</h2>
                  <p className="text-slate-500 mb-6">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <Button asChild className="bg-[#3fb9ff] hover:bg-[#0ea5e9]">
                    <Link to={createPageUrl('Home')}>Back to Home</Link>
                  </Button>
                </Card>
              ) : (
                <Card className="p-8 border-0 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="h-6 w-6 text-[#3fb9ff]" />
                    <h2 className="text-2xl font-bold text-slate-800">Send Us a Message</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          required
                          value={form.full_name}
                          onChange={(e) => setForm(prev => ({ ...prev, full_name: e.target.value }))}
                          placeholder="John Smith"
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="john@example.com"
                          className="mt-1.5"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="(555) 123-4567"
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label>Subject</Label>
                        <Select
                          value={form.subject}
                          onValueChange={(v) => setForm(prev => ({ ...prev, subject: v }))}
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="quote">Quote Request</SelectItem>
                            <SelectItem value="installation">Installation Questions</SelectItem>
                            <SelectItem value="support">Product Support</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        required
                        value={form.message}
                        onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Tell us about your project or question..."
                        className="mt-1.5 min-h-[150px]"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-[#3fb9ff] hover:bg-[#0ea5e9] h-12 text-base"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800">We Serve Nationwide</h2>
            <p className="text-slate-500">Shipping to all 50 states</p>
          </div>
          <div className="h-80 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/1200px-Flag_of_the_United_States.svg.png"
              alt="United States Coverage"
              className="absolute inset-0 w-full h-full object-cover opacity-10"
            />
            <div className="text-center relative z-10">
              <MapPin className="h-16 w-16 text-[#3fb9ff] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Coast to Coast Coverage</h3>
              <p className="text-slate-600">Serving all 50 states with premium modular court tiles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          © 2026 Coast to Coast Courts. All rights reserved.
        </div>
      </footer>
    </div>
  );
}