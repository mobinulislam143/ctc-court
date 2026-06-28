import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowRight, Palette, Calculator, Truck, Wrench, 
  CheckCircle, Grid3X3, Clock, Phone, Play
} from 'lucide-react';
import { useSiteImages } from '@/hooks/useSiteImages';
import SiteFooter from '@/components/SiteFooter';
import ShippingBanner from '@/components/ShippingBanner';
import SiteNav from '@/components/SiteNav';

const STEPS = [
  {
    number: '01',
    icon: Palette,
    title: 'Design Your Court',
    description: 'Use our interactive builder to choose your court type, set dimensions, pick colors, add lines, and even upload your logo.',
    details: [
      'Select from basketball, pickleball, multi-sport, or garage templates',
      'Customize every color zone',
      'Add professional sport lines',
      'Preview in real-time with tile grid visualization',
    ],
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/5d295eb0b_PhotoFix_16_49_54.jpg',
  },
  {
    number: '02',
    icon: Calculator,
    title: 'Get Instant Pricing',
    description: 'See your tile count and estimated price update live as you design. Simple, transparent pricing with no hidden fees.',
    details: [
      'Automatic square footage calculation',
      'Tile count = square feet (1 tile = 1 sq ft)',
      'Optional spare tile percentage',
      'Instant material cost estimates',
    ],
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/5ed3112db_09E84532-92AB-4A80-B6EB-D87261BE4278.jpg',
  },
  {
    number: '03',
    icon: Truck,
    title: 'Order & Ship',
    description: 'Submit your design for a formal quote or proceed directly to checkout for standard configurations. Fast nationwide shipping.',
    details: [
      'Standard orders ship within 5-7 business days',
      'Freight delivery for large orders',
      'Secure packaging for damage-free arrival',
      'Tracking provided on all shipments',
    ],
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/be593f5fa_5CD60603-39ED-400B-9F64-BB790BD0F6E7.jpg',
  },
  {
    number: '04',
    icon: Wrench,
    title: 'Setup & Play',
    description: 'Simple DIY setup — most courts ready in 45 minutes to a few hours. No special tools or experience needed.',
    details: [
      'Easy snap-together interlocking system',
      'No adhesives, screws, or special tools required',
      'Pickleball court: ~45 minutes',
      'Half basketball court: 2-4 hours',
      'Step-by-step video guides included',
    ],
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/db973daa3_F12CF0B6-12D8-42B1-9B71-AC1240BBA684.jpeg',
  },
];

const FAQS = [
  {
    question: 'How long does setup take?',
    answer: 'Most courts can be set up in 45 minutes to a few hours. A pickleball court takes about 45 minutes, while a half basketball court typically takes 2-4 hours. No special tools or experience required — just simple snap-together interlocking tiles.',
  },
  {
    question: 'What surface can the tiles be set up on?',
    answer: 'Our tiles work best on flat, solid surfaces like concrete or asphalt. Minor cracks and imperfections are okay — the tiles will bridge small gaps. We recommend against setup on grass, gravel, or heavily damaged surfaces.',
  },
  {
    question: 'How do I calculate how many tiles I need?',
    answer: 'Each tile is exactly 1 square foot, so your tile count equals your square footage. For a 50\' × 47\' half court, you need 2,350 tiles. We recommend adding 5% for cuts and spares.',
  },
  {
    question: 'Are the tiles suitable for outdoor use?',
    answer: 'Absolutely. Our tiles are UV-stabilized to resist fading and designed with a drainage system for wet weather. They handle temperatures from -30°F to 140°F.',
  },
  {
    question: 'Can I add lines later?',
    answer: 'Yes. Lines can be painted on after setup, or we offer pre-marked tile options. For the cleanest look, we recommend planning your lines during the initial design phase.',
  },
  {
    question: 'Do I need any special tools?',
    answer: 'No special tools required! Our tiles use a simple interlocking system that snaps together by hand. Just make sure your surface is flat and clean, then start clicking tiles together. Assembly guides and video tutorials are included with every order.',
  },
  {
    question: 'Do you offer financing?',
    answer: 'Yes, we offer financing options for qualifying orders. Details are available during the checkout process or by contacting our sales team.',
  },
  {
    question: 'What\'s the warranty?',
    answer: 'Our tiles come with a 15-year limited warranty against manufacturing defects. The warranty covers material quality and structural integrity.',
  },
];

export default function HowItWorks() {
  const siteImages = useSiteImages();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      {/* Hero */}
      <section className="pt-36 pb-12 bg-gradient-to-br from-[#3fb9ff]/5 via-white to-amber-50/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-[#3fb9ff]/10 text-[#3fb9ff] border-[#3fb9ff]/20 mb-4">The Process</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              From Dream to Dunk <br />in 4 Simple Steps
            </h1>
            <p className="text-lg text-slate-500 mb-8">
              Our streamlined process makes getting your perfect court easy. Design online, get pricing instantly, and be playing in weeks.
            </p>
            <Button asChild size="lg" className="bg-[#3fb9ff] hover:bg-[#0ea5e9] rounded-full">
              <Link to={createPageUrl('Builder')}>
                <Play className="h-5 w-5 mr-2" />
                Start Your Design
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 space-y-24">
          {STEPS.map((step, index) => (
            <div 
              key={step.number}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="text-7xl font-bold text-[#3fb9ff]/10 mb-4">
                  {step.number}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#3fb9ff] flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800">{step.title}</h2>
                </div>
                <p className="text-lg text-slate-500 mb-6">{step.description}</p>
                <ul className="space-y-3">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-600">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={siteImages[`hiw_step${parseInt(step.number)}`] || step.image} 
                    alt={step.title}
                    className="w-full h-[350px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                  <step.icon className="h-5 w-5 text-[#3fb9ff]" />
                  <span className="font-semibold text-slate-800">Step {step.number}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tile Explanation */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-[#3fb9ff]/20 text-[#3fb9ff] border-[#3fb9ff]/30 mb-4">
                The Math Is Simple
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                1 Tile = 1 Square Foot
              </h2>
              <p className="text-slate-300 text-lg mb-6">
                Every tile in our system is exactly 12" × 12" — making it incredibly easy to calculate what you need. 
                Your court's square footage is your tile count. No complex formulas, no guessing.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-slate-800 border-slate-700 p-4">
                  <Grid3X3 className="h-8 w-8 text-[#3fb9ff] mb-2" />
                  <p className="text-white font-semibold">50' × 47' Court</p>
                  <p className="text-slate-400 text-sm">= 2,350 tiles</p>
                </Card>
                <Card className="bg-slate-800 border-slate-700 p-4">
                  <Clock className="h-8 w-8 text-[#3fb9ff] mb-2" />
                  <p className="text-white font-semibold">DIY Weekend</p>
                  <p className="text-slate-400 text-sm">Typical install time</p>
                </Card>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-1 p-6 bg-slate-800 rounded-3xl">
              {[...Array(36)].map((_, i) => (
                <div 
                  key={i} 
                  className="aspect-square bg-[#3fb9ff] rounded-sm opacity-80 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 mb-4">Timeline</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              What to Expect
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200" />
            
            {[
              { day: 'Day 1', title: 'Design Complete', desc: 'Finalize your court design and submit for quote' },
              { day: 'Day 2-3', title: 'Quote Approved', desc: 'Review and approve your custom quote' },
              { day: 'Week 1-2', title: 'Production', desc: 'Your tiles are prepared and quality checked' },
              { day: 'Week 2-3', title: 'Shipping', desc: 'Freight delivery to your location' },
              { day: 'Week 3-4', title: 'Setup', desc: 'DIY setup complete' },
              { day: 'Week 4+', title: 'Game Time!', desc: 'Enjoy your new court' },
            ].map((item, i) => (
              <div key={i} className="relative pl-20 pb-8 last:pb-0">
                <div className="absolute left-6 w-4 h-4 bg-[#3fb9ff] rounded-full border-4 border-white shadow" />
                <p className="text-sm font-semibold text-[#3fb9ff]">{item.day}</p>
                <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                <p className="text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4">FAQs</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Common Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-white rounded-xl border-0 shadow-sm px-6">
                <AccordionTrigger className="text-left font-semibold text-slate-800 hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-500 pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#3fb9ff] to-[#0ea5e9]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Design your court in minutes with our interactive builder.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-[#3fb9ff] hover:bg-slate-100 rounded-full">
              <Link to={createPageUrl('Builder')}>
                <Palette className="h-5 w-5 mr-2" />
                Build Your Court
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-[#3fb9ff] rounded-full">
              <Link to={createPageUrl('Contact')}>
                <Phone className="h-5 w-5 mr-2" />
                Talk to Sales
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}