import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';
import SiteFooter from '@/components/SiteFooter';
import ShippingBanner from '@/components/ShippingBanner';
import SiteNav from '@/components/SiteNav';
import { 
  ArrowRight, Check, Package, Wrench, Grid3X3, 
  Calculator, Phone, HelpCircle, DollarSign, Loader2
} from 'lucide-react';

const PRICE_FACTORS = [
  {
    factor: 'Court Size',
    impact: 'Primary driver',
    description: 'Total square footage determines your tile count. Each tile covers 1 sq ft.',
  },
  {
    factor: 'Tile Color',
    impact: 'Minor variation',
    description: 'Most colors are standard pricing. Some specialty colors have small upcharges.',
  },
  {
    factor: 'Line Package',
    impact: '+$249–$399',
    description: 'Professional court lines for basketball, pickleball, or both.',
  },
  {
    factor: 'Logo Inlay',
    impact: '+$499+',
    description: 'Custom logo printed or inlaid into your court surface.',
  },
  {
    factor: 'Edge Ramps',
    impact: '+$3/linear ft',
    description: 'Smooth transition ramps around the perimeter.',
  },
  {
    factor: 'Waste Factor',
    impact: '5-10%',
    description: 'Extra tiles for cuts and future repairs. Typically 5% is sufficient.',
  },
];

const EXAMPLE_QUOTES = [
  {
    name: 'Half Basketball Court',
    size: '47\' × 50\'',
    sqft: 2350,
    materialsPrice: 10575,
    installedPrice: 15275,
    popular: true,
  },
  {
    name: 'Single Pickleball',
    size: '30\' × 60\'',
    sqft: 1800,
    materialsPrice: 8100,
    installedPrice: 12700,
    popular: false,
  },
  {
    name: 'Multi-Sport Court',
    size: '50\' × 84\'',
    sqft: 4200,
    materialsPrice: 18900,
    installedPrice: 27300,
    popular: false,
  },
  {
    name: 'Double Garage',
    size: '24\' × 24\'',
    sqft: 576,
    materialsPrice: 2592,
    installedPrice: 3752,
    popular: false,
  },
];

export default function Pricing() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch pricing from admin config
  const { data: pricingConfigs = [], isLoading } = useQuery({
    queryKey: ['pricing'],
    queryFn: () => base44.entities.PricingConfig.list(),
  });

  const pricing = pricingConfigs[0] || {
    price_per_sqft_base: 4.75,
  };

  const basePricePerSqft = pricing.price_per_sqft_base || 4.75;

  // Calculate example quotes dynamically
  const exampleQuotes = [
    { name: 'Half Basketball Court', size: '47\' × 50\'', sqft: 2350 },
    { name: 'Single Pickleball', size: '30\' × 60\'', sqft: 1800 },
    { name: 'Multi-Sport Court', size: '50\' × 84\'', sqft: 4200 },
    { name: 'Double Garage', size: '24\' × 24\'', sqft: 576 },
  ].map((quote, i) => ({
    ...quote,
    materialsPrice: Math.round(quote.sqft * basePricePerSqft),
    popular: i === 0,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#3fb9ff]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Basketball & Pickleball Court Pricing Calculator"
        description="Transparent pricing for modular court tiles. Base price $4.75/sq ft. Calculate costs for basketball courts, pickleball courts & custom designs. No hidden fees."
        keywords="court flooring cost, basketball court price, pickleball court pricing, modular tile cost calculator, court installation cost"
        canonical="/pricing"
      />
      {/* Navigation */}
      <SiteNav />

      {/* Hero */}
      <section className="pt-36 pb-12 bg-gradient-to-br from-[#3fb9ff]/5 via-white to-amber-50/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-[#3fb9ff]/10 text-[#3fb9ff] border-[#3fb9ff]/20 mb-4">Transparent Pricing</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Simple, Honest Pricing
            </h1>
            <p className="text-lg text-slate-500 mb-8">
              No hidden fees, no surprises. Our pricing is based on your court size and options. 
              Use the builder to get an instant estimate.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-[#3fb9ff] hover:bg-[#0ea5e9] rounded-full">
                <Link to={createPageUrl('Builder')}>
                  <Calculator className="h-5 w-5 mr-2" />
                  Get Your Quote
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to={createPageUrl('Contact')}>
                  <Phone className="h-5 w-5 mr-2" />
                  Talk to Sales
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Base Pricing */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 mb-4">
              <span className="text-red-600 font-bold text-sm">USA 250th Anniversary Sale — 50% OFF All Summer!</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Base Tile Pricing</h2>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl text-slate-400 line-through">$9.50/sq ft</span>
              <span className="text-4xl font-bold text-[#3fb9ff]">${basePricePerSqft.toFixed(2)}</span>
              <span className="text-slate-500 text-lg">per square foot</span>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">50% OFF</span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="p-8 border-2 border-[#3fb9ff] bg-gradient-to-br from-[#3fb9ff]/5 to-transparent relative">
              <Badge className="absolute top-4 right-4 bg-[#3fb9ff] text-white">DIY Friendly</Badge>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#3fb9ff] flex items-center justify-center">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Complete Court Kit</h3>
                  <p className="text-slate-500">Everything you need to build it yourself</p>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Premium interlocking tiles',
                  'Easy snap-together design — no tools needed',
                  'Set up a pickleball court in ~45 minutes',
                  'Step-by-step assembly guides & videos',
                  'Phone & email support',
                  'Free standard shipping*',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center p-4 bg-white rounded-xl border border-[#3fb9ff]/20">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-slate-400 line-through text-lg">$9.50/sq ft</span>
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">50% OFF</span>
                </div>
                <p className="text-sm text-slate-500">USA 250th Anniversary Sale Price</p>
                <p className="text-3xl font-bold text-[#3fb9ff]">${basePricePerSqft.toFixed(2)} <span className="text-lg font-normal text-slate-500">/sq ft</span></p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* What Affects Price */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-amber-100 text-amber-700 border-amber-200 mb-4">Price Factors</Badge>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">What Affects Your Quote?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Several factors influence your final price. Here's a breakdown of what goes into your quote.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRICE_FACTORS.map((item, i) => (
              <Card key={i} className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-slate-800">{item.factor}</h3>
                  <Badge variant="secondary" className="text-xs">{item.impact}</Badge>
                </div>
                <p className="text-slate-500 text-sm">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Example Quotes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4">Examples</Badge>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Sample Estimates</h2>
            <p className="text-slate-500">
              Real pricing examples for popular court sizes. Your quote may vary based on options.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {exampleQuotes.map((quote, i) => (
              <Card 
                key={i} 
                className={`p-6 border-2 transition-all hover:shadow-lg ${
                  quote.popular ? 'border-[#3fb9ff] bg-[#3fb9ff]/5' : 'border-slate-100'
                }`}
              >
                {quote.popular && (
                  <Badge className="bg-[#3fb9ff] text-white mb-3">Most Popular</Badge>
                )}
                <h3 className="font-bold text-lg text-slate-800 mb-1">{quote.name}</h3>
                <p className="text-slate-500 text-sm mb-4">{quote.size} • {quote.sqft} sq ft</p>
                
                <div className="p-4 bg-[#3fb9ff]/10 rounded-lg border-2 border-[#3fb9ff]/20 text-center">
                  <p className="text-sm text-slate-500 line-through">${(quote.sqft * 9.50).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                  <p className="text-2xl font-bold text-[#3fb9ff]">${quote.materialsPrice.toLocaleString()}</p>
                  <p className="text-xs text-red-500 font-semibold mt-0.5">50% OFF — USA 250th Anniversary</p>
                </div>

                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to={createPageUrl('Builder')}>Configure</Link>
                </Button>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-slate-400 mt-8">
            * Estimates shown are for standard colors without add-ons. Actual pricing calculated in builder.
          </p>
        </div>
      </section>

      {/* Simple Math */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Grid3X3 className="h-8 w-8 text-[#3fb9ff]" />
            <h2 className="text-3xl font-bold">The Math Is Simple</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 items-center mb-8">
            <div className="text-center">
              <p className="text-slate-400 mb-2">Your Court Size</p>
              <p className="text-4xl font-bold">50' × 47'</p>
            </div>
            <div className="text-4xl font-light text-slate-600">=</div>
            <div className="text-center">
              <p className="text-slate-400 mb-2">Tiles Needed</p>
              <p className="text-4xl font-bold text-[#3fb9ff]">2,350</p>
            </div>
          </div>

          <p className="text-slate-400 text-lg">
            Each tile is exactly 1 square foot. No complex calculations — your square footage is your tile count.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-4">FAQ</Badge>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Pricing Questions</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'Do you offer financing?',
                a: 'Yes! We partner with Affirm to offer flexible financing. Pay over 3, 6, 12, 24, or 36 months. Check your rate in seconds at checkout with no hard credit pull. 0% APR available for qualifying customers.',
              },
              {
                q: 'Is shipping included?',
                a: 'Standard ground shipping is included for most orders within the continental US. Oversized or expedited orders may incur additional fees.',
              },
              {
                q: 'Can I get a formal quote before ordering?',
                a: 'Absolutely. Use our builder to design your court, then submit for a formal quote. Our team will review and provide a detailed breakdown within 24-48 hours.',
              },
              {
                q: 'Are there any hidden fees?',
                a: 'No hidden fees. Your quote includes everything specified — tiles, add-ons, and installation if selected. Sales tax varies by location.',
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
      <section className="py-20 bg-gradient-to-r from-[#3fb9ff] to-[#0ea5e9]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get Your Exact Price
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Use our builder to design your court and see pricing update in real-time.
          </p>
          <Button asChild size="lg" className="bg-white text-[#3fb9ff] hover:bg-slate-100 rounded-full">
            <Link to={createPageUrl('Builder')}>
              <DollarSign className="h-5 w-5 mr-2" />
              Build & Price Your Court
            </Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}