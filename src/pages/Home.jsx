import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SEO from '@/components/SEO';
import SiteFooter from '@/components/SiteFooter';
import ShippingBanner from '@/components/ShippingBanner';
import SiteNav from '@/components/SiteNav';
import TruliVerifiedBadge from '@/components/TruliVerifiedBadge';
import { useSiteImages } from '@/hooks/useSiteImages';
import { 
  ArrowRight, Check, Grid3X3, Sun, Droplets, Wrench, 
  Palette, Ruler, ShieldCheck, Phone, ChevronRight,
  Play, Circle, Square, Package, Menu, X
} from 'lucide-react';

const FEATURES = [
  { icon: Grid3X3, title: '1 sq ft Tiles', desc: 'Each interlocking tile is exactly 12"×12"' },
  { icon: Sun, title: 'UV Protected', desc: 'Fade-resistant colors for outdoor use' },
  { icon: Droplets, title: 'All-Weather', desc: 'Drains quickly, handles any climate' },
  { icon: Wrench, title: 'Easy Install', desc: 'DIY friendly interlocking system' },
];

const COURT_TYPES = [
  { name: 'Basketball Courts', imageKey: 'home_basketball', desc: 'Full, half, or training zones', icon: Circle },
  { name: 'Pickleball Courts', imageKey: 'home_pickleball', desc: 'Single or dual court layouts', icon: Square },
  { name: 'Multi-Sport', imageKey: 'home_multisport', desc: 'Basketball + pickleball combo', icon: Grid3X3 },
  { name: 'Garage Floors', imageKey: 'home_garage', desc: 'Durable industrial finish', icon: Wrench },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const siteImages = useSiteImages();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Coast to Coast Courts",
    "url": "https://coasttocoastcourts.com",
    "logo": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/a8c19e1c9_Untitleddesign4.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-716-807-2108",
      "contactType": "Customer Service",
      "areaServed": "US",
      "availableLanguage": "English"
    },
    "description": "Premium modular court flooring for basketball, pickleball, and multi-sport courts. DIY-friendly interlocking tiles with professional results.",
    "sameAs": []
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Premium Modular Basketball & Pickleball Court Tiles"
        description="Design custom basketball, pickleball & multi-sport courts with premium 1 sq ft interlocking tiles. DIY installation, UV-protected, all-weather. Get instant pricing!"
        keywords="modular court tiles, basketball court flooring, pickleball court tiles, interlocking court tiles, DIY court installation, outdoor court tiles"
        canonical="/"
        structuredData={structuredData}
      />
      <SiteNav />

      {/* Hero Section */}
      <section className="relative pt-44 pb-12 md:pt-40 md:pb-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3fb9ff]/5 via-white to-amber-50/30" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#3fb9ff]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-100/50 rounded-full blur-3xl" />
        
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <Badge className="bg-[#3fb9ff]/10 text-[#3fb9ff] border-[#3fb9ff]/20 mb-4">
            Premium Modular Sports Flooring
          </Badge>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-4">
            Design Your Custom
            <span className="text-[#3fb9ff]"> Basketball & Pickleball Court</span>
            <br />with Modular Tiles in Minutes
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-6 max-w-2xl mx-auto">
            Build basketball courts, pickleball courts, or multi-sport courts with our interactive configurator. 
            Premium 1 sq ft interlocking modular court tiles. DIY-friendly installation with professional results.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center mb-8">
            <Button asChild size="lg" className="bg-[#3fb9ff] hover:bg-[#0ea5e9] text-white h-12 px-8 rounded-full shadow-lg shadow-[#3fb9ff]/25">
              <Link to={createPageUrl('Builder')}>
                <Play className="h-5 w-5 mr-2" />
                Start Building
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 rounded-full">
              <Link to={createPageUrl('HowItWorks')}>
                See How It Works
                <ChevronRight className="h-5 w-5 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="flex justify-center mb-4">
            <TruliVerifiedBadge size="md" />
          </div>
          <Link to="/Financing" className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full hover:bg-emerald-100 transition-colors">
            💳 Financing available — pay as low as ~$80/mo with Affirm
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Call to Action Widget */}
      <section className="py-8 md:py-10 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="rounded-xl overflow-hidden shadow-lg h-48 md:h-56">
              <img 
                src={siteImages['home_cta_image']}
                alt="Custom multi-sport court with interlocking modular tiles for basketball and pickleball"
                className="w-full h-full object-cover"
              />
            </div>
            <Card className="p-5 bg-gradient-to-br from-[#3fb9ff] to-[#0ea5e9] border-0 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-2">Start Building Your Court</h3>
              <p className="text-white/90 text-sm mb-4">
                Design your perfect court with our interactive builder. Get instant pricing.
              </p>
              <Button asChild className="w-full bg-white text-[#3fb9ff] hover:bg-slate-100">
                <Link to={createPageUrl('Builder')}>
                  Start Building
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">Premium Modular Court Tile Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-[#3fb9ff]/10 flex items-center justify-center mx-auto mb-2">
                  <feature.icon className="h-6 w-6 text-[#3fb9ff]" />
                </div>
                <p className="font-semibold text-slate-800 text-sm mb-1">{feature.title}</p>
                <p className="text-xs text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Court Types */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
              Modular Court Flooring for Every Sport & Space
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              From backyard basketball courts to tournament pickleball courts, our interlocking modular tile system adapts to any vision. Perfect for outdoor courts, indoor courts, and garage floors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURT_TYPES.map((court, i) => (
              <Card key={i} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={siteImages[court.imageKey]} 
                    alt={`${court.name} - ${court.desc} with premium interlocking modular tiles`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <court.icon className="h-4 w-4" />
                      <span className="font-bold">{court.name}</span>
                    </div>
                    <p className="text-sm text-white/80">{court.desc}</p>
                  </div>
                </div>
                <div className="p-4">
                  <Link 
                    to={createPageUrl('Builder')}
                    className="flex items-center justify-between text-[#3fb9ff] hover:text-[#0ea5e9] font-medium text-sm"
                  >
                    Configure Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
              How to Install Your Custom Court in 3 Easy Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Design Your Court', desc: 'Use our interactive builder to customize dimensions, colors, and lines.' },
              { step: '02', title: 'Get Your Quote', desc: 'Receive instant pricing for all your materials with no hidden fees.' },
              { step: '03', title: 'Install & Play', desc: 'Tiles ship fast. Simple snap-together system — pickleball courts ready in ~45 minutes!' },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="text-5xl md:text-6xl font-bold text-[#3fb9ff]/10 mb-3">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild size="lg" className="bg-[#3fb9ff] hover:bg-[#0ea5e9] rounded-full h-12 px-8">
              <Link to={createPageUrl('Builder')}>
                Start Your Design
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">What Our Customers Are Saying</h2>
            <p className="text-slate-500 text-sm mb-5">Real courts, real people.</p>
            <div className="flex justify-center">
              <TruliVerifiedBadge size="md" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'K.C. Mullett',
                location: 'Buffalo, NY',
                text: "We've had this court for about seven months now and it's absolutely amazing. Kids love it, they're out there every single day. Best thing we've done for the backyard, hands down.",
              },
              {
                name: 'Joseph D.',
                location: 'Sarasota, FL',
                text: "Pickleball court in the driveway — held up all summer in the Florida heat, no issues at all. Neighbors love it.",
              },
              {
                name: 'Ryan Kagels',
                location: 'Buffalo, NY',
                text: "Ordered a full basketball court setup for my son. Shipping was fast, everything came packaged well. Assembly instructions were clear and it actually snapped together like they said. The quality is legit — not some cheap stuff.",
              },
              {
                name: 'Stephanie M.',
                location: 'Sarasota, FL',
                text: "Honestly I wasn't sure about ordering something like this online but I'm so glad I did. It came out so cute and my kids are obsessed. I've already told like three of my friends to get one.",
              },
            ].map((r, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="h-4 w-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed flex-1">"{r.text}"</p>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{r.name}</p>
                  <p className="text-xs text-slate-400">{r.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-[#3fb9ff] to-[#0ea5e9]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Build Your Court?
          </h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Start designing today and get an instant quote. No obligation, no pressure — just your dream court visualized.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-white text-[#3fb9ff] hover:bg-slate-100 h-12 px-6 rounded-full">
              <Link to={createPageUrl('Builder')}>
                <Palette className="h-5 w-5 mr-2" />
                Start Building
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-[#3fb9ff] h-12 px-6 rounded-full backdrop-blur-sm">
              <a href="tel:7168072108">
                <Phone className="h-5 w-5 mr-2" />
                Call: 716-807-2108
              </a>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter variant="full" />
    </div>
  );
}