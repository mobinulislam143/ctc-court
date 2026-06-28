import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowRight, Check, ShoppingCart, Star,
  Clock, Wrench, Package, ChevronRight, ArrowLeft,
  Shield, Truck, RotateCcw, Zap
} from 'lucide-react';
import CheckoutModal from '@/components/shop/CheckoutModal';
import ShippingBanner from '@/components/ShippingBanner';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';
import { useSiteImages } from '@/hooks/useSiteImages';

const COURT_PACKAGES = [
  {
    id: 'pickleball_starter',
    name: 'Pickleball Starter Court',
    tagline: 'Most Popular',
    popular: true,
    description: 'Everything you need for a single regulation pickleball court. Ready to play in a couple hours.',
    dimensions: "30' × 60'",
    sqft: 1800,
    tiles: 1890, // 5% waste included
    price: 8978, // 1890 * 4.75
    includesLines: false,
    imageKey: 'shop_pickleball_starter',
    includes: [
      '1,890 interlocking tiles (1 sq ft each)',
      'Regulation 30\' × 60\' pickleball layout',
      '5% spare tiles included',
      'Assembly guide & video tutorials',
      'Phone & email support',
    ],
    installTime: '1–2 hours',
    color: 'bg-emerald-500',
    stripeProductName: 'Pickleball Starter Court Package',
  },
  {
    id: 'basketball_half',
    name: 'Half Basketball Court',
    tagline: 'Best Value',
    popular: false,
    description: 'A full half-court basketball setup for your driveway or backyard. Includes sport lines.',
    dimensions: "47' × 50'",
    sqft: 2350,
    tiles: 2468, // 5% waste
    price: 11723, // 2468 * 4.75
    includesLines: true,
    imageKey: 'shop_basketball_half',
    includes: [
      '2,468 interlocking tiles (1 sq ft each)',
      'Half-court basketball layout',
      'Sport lines package included',
      '5% spare tiles included',
      'Assembly guide & video tutorials',
      'Phone & email support',
    ],
    installTime: '1–2 hours',
    color: 'bg-[#3fb9ff]',
    stripeProductName: 'Half Basketball Court Package',
  },
  {
    id: 'multisport_combo',
    name: 'Multi-Sport Combo Court',
    tagline: 'Premium',
    popular: false,
    description: 'Basketball AND pickleball on one court. Color-coded lines for both sports. Maximum value.',
    dimensions: "50' × 84'",
    sqft: 4200,
    tiles: 4410, // 5% waste
    price: 20948, // 4410 * 4.75
    includesLines: true,
    imageKey: 'shop_multisport_combo',
    includes: [
      '4,410 interlocking tiles (1 sq ft each)',
      'Basketball + pickleball lines',
      'Dual-sport color-coded line package',
      '5% spare tiles included',
      'Assembly guide & video tutorials',
      'Priority phone & email support',
    ],
    installTime: '2–4 hours',
    color: 'bg-purple-500',
    stripeProductName: 'Multi-Sport Combo Court Package',
  },
  {
    id: 'garage_double',
    name: 'Double Car Garage Floor',
    tagline: 'Quick & Easy',
    popular: false,
    description: 'Transform your double garage with premium interlocking tiles. Oil-resistant and easy to clean.',
    dimensions: "24' × 24'",
    sqft: 576,
    tiles: 605, // 5% waste
    price: 2874,
    includesLines: false,
    imageKey: 'shop_garage_double',
    includes: [
      '605 interlocking tiles (1 sq ft each)',
      'Oil & chemical resistant surface',
      '5% spare tiles included',
      'Assembly guide & video tutorials',
      'Phone & email support',
    ],
    installTime: '~1 hour',
    color: 'bg-amber-500',
    stripeProductName: 'Double Garage Floor Package',
  },
];

const TRUST_BADGES = [
  { icon: Shield, label: 'Secure Checkout', sub: 'SSL encrypted payment' },
  { icon: Truck, label: 'Free Shipping', sub: 'Continental US' },
  { icon: RotateCcw, label: '15-Year Warranty', sub: 'On all tiles' },
  { icon: Zap, label: 'Fast Setup', sub: 'No tools needed' },
];

export default function Shop() {
  const [selectedPkg, setSelectedPkg] = useState(null);
  const siteImages = useSiteImages();

  React.useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-white">
      <CheckoutModal pkg={selectedPkg} open={!!selectedPkg} onClose={() => setSelectedPkg(null)} />
      <SiteNav />

      {/* Hero */}
      <section className="pt-36 pb-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="bg-[#3fb9ff]/20 text-[#3fb9ff] border-[#3fb9ff]/30 mb-4">Ready-to-Ship Packages</Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Buy Your Court Today</h1>
          <p className="text-slate-300 text-lg mb-4 max-w-2xl mx-auto">
            Pre-configured court packages ready to ship. Order now and we'll follow up to confirm your color preferences and details.
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 text-amber-300 px-4 py-2 rounded-full text-sm font-medium">
            <Wrench className="h-4 w-4" />
            DIY Materials Only — No installation included. Tiles snap together fairly quickly with a little help — no tools needed!
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-6 bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRUST_BADGES.map((badge, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3fb9ff]/10 flex items-center justify-center shrink-0">
                  <badge.icon className="h-5 w-5 text-[#3fb9ff]" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{badge.label}</p>
                  <p className="text-xs text-slate-500">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIY Notice */}
      <section className="py-5 bg-amber-50 border-b border-amber-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-amber-800 text-sm">
            <strong>⚠️ Important:</strong> These are <strong>DIY materials kits only</strong> — installation is not included. 
            Our interlocking tiles snap together with no tools, no glue, and no experience needed.
            A pickleball court can be set up in 1–2 hours with a friend!
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Choose Your Package</h2>
            <p className="text-slate-500">Order now — we'll reach out to confirm your color preferences before shipping.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {COURT_PACKAGES.map((pkg) => (
              <Card key={pkg.id} className={`overflow-hidden border-2 transition-all hover:shadow-xl ${pkg.popular ? 'border-[#3fb9ff]' : 'border-slate-100'}`}>
                {pkg.popular && (
                  <div className="bg-[#3fb9ff] text-white text-center text-sm font-semibold py-2 flex items-center justify-center gap-2">
                    <Star className="h-4 w-4" /> Most Popular
                  </div>
                )}
                <div className="h-48 overflow-hidden">
                  <img src={siteImages[pkg.imageKey]} alt={pkg.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge variant="secondary" className="mb-2">{pkg.tagline}</Badge>
                      <h3 className="text-xl font-bold text-slate-800">{pkg.name}</h3>
                      <p className="text-slate-500 text-sm mt-1">{pkg.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 my-4 p-3 bg-slate-50 rounded-xl">
                    <div className="text-center flex-1">
                      <p className="text-xs text-slate-500">Dimensions</p>
                      <p className="font-bold text-slate-800">{pkg.dimensions}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div className="text-center flex-1">
                      <p className="text-xs text-slate-500">Tiles</p>
                      <p className="font-bold text-slate-800">{pkg.tiles.toLocaleString()}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-200" />
                    <div className="text-center flex-1">
                      <p className="text-xs text-slate-500">Setup Time</p>
                      <p className="font-bold text-slate-800">{pkg.installTime}</p>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-slate-500">Package Price</p>
                      <p className="text-3xl font-bold text-slate-800">${pkg.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">per sq ft</p>
                      <p className="font-semibold text-[#3fb9ff]">$4.75</p>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-[#3fb9ff] hover:bg-[#0ea5e9] text-white h-12 text-base gap-2"
                    onClick={() => setSelectedPkg(pkg)}
                  >
                    <ShoppingCart className="h-5 w-5" /> Proceed to Checkout
                  </Button>
                  <p className="text-xs text-slate-400 text-center mt-2">
                    Apple Pay • Google Pay • Card • Affirm Financing
                  </p>
                  <Link to="/Financing" className="block text-center text-xs text-[#3fb9ff] hover:underline mt-1">
                    Pay monthly with Affirm — financing available
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-slate-500 mb-4">Need a custom size or design?</p>
            <Button asChild variant="outline" size="lg" className="rounded-full gap-2">
              <Link to={createPageUrl('Builder')}>
                Use the Custom Court Builder
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-10">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Order Online', desc: 'Pick your package and pay securely with any payment method' },
              { step: '2', title: 'We Confirm Colors', desc: "We'll text or call you to confirm your color preferences" },
              { step: '3', title: 'Ships to You', desc: 'Tiles ship within 5–7 business days, freight delivery for large orders' },
              { step: '4', title: 'Snap & Play', desc: 'Set up your court in hours — no tools, no experience needed!' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#3fb9ff] text-white text-xl font-bold flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}