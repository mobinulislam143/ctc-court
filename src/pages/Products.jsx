import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SEO from '@/components/SEO';
import SiteFooter from '@/components/SiteFooter';
import ShippingBanner from '@/components/ShippingBanner';
import SiteNav from '@/components/SiteNav';
import { useSiteImages } from '@/hooks/useSiteImages';
import { 
  ArrowRight, Check, Circle, Square, Grid3X3, Car, 
  Sun, Droplets, Wrench, Palette, ShieldCheck, 
  Thermometer, Wind, Sparkles
} from 'lucide-react';

const PRODUCTS = [
  {
    id: 'basketball',
    name: 'Basketball Courts',
    tagline: 'Full court dreams, any size',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/768f94d59_original-9C2CE967-E509-467A-A4F9-60BA1F7BA526.jpg',
    icon: Circle,
    description: 'From regulation full courts to compact driveway half courts, our basketball flooring delivers professional-grade performance at home.',
    options: [
      { name: 'Full Court', size: '94\' × 50\'', tiles: '1,175 packs (4,700 tiles)', popular: false },
      { name: 'Half Court', size: '47\' × 50\'', tiles: '588 packs (2,350 tiles)', popular: true },
      { name: 'Key/Training', size: '25\' × 20\'', tiles: '125 packs (500 tiles)', popular: false },
    ],
    features: [
      'Regulation 3-point arc options',
      'Custom key & free throw paint',
      'Multiple line color choices',
      'Pro-level ball response',
    ],
  },
  {
    id: 'pickleball',
    name: 'Pickleball Courts',
    tagline: "America's fastest-growing sport",
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/84dce9a45_DE3C9764-40F9-4B33-8757-92999BD56B9A.jpg',
    icon: Square,
    description: 'Tournament-ready pickleball courts with proper non-volley zones, vibrant colors, and surfaces that deliver consistent play.',
    options: [
      { name: 'Single Court', size: '30\' × 60\'', tiles: '450 packs (1,800 tiles)', popular: true },
      { name: 'Dual Courts', size: '64\' × 60\'', tiles: '960 packs (3,840 tiles)', popular: false },
      { name: 'Tournament', size: '34\' × 64\'', tiles: '544 packs (2,176 tiles)', popular: false },
    ],
    features: [
      'Regulation 20\' × 44\' playing area',
      'Highlighted kitchen zones',
      'Multiple court color options',
      'Optimal grip for lateral movement',
    ],
  },
  {
    id: 'multisport',
    name: 'Multi-Sport Courts',
    tagline: 'The best of both worlds',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/059731f0c_original-708AB469-D7EB-4D2F-9A2F-39E474666293.jpg',
    icon: Grid3X3,
    description: 'Combine basketball and pickleball on one surface. Color-coded line systems keep each sport distinct and playable.',
    options: [
      { name: 'Standard Multi', size: '50\' × 84\'', tiles: '1,050 packs (4,200 tiles)', popular: true },
      { name: 'Compact Multi', size: '40\' × 70\'', tiles: '700 packs (2,800 tiles)', popular: false },
    ],
    features: [
      'Basketball + pickleball lines',
      'Distinct line colors per sport',
      'Maximize your space investment',
      'Quick sport switching',
    ],
  },
  {
    id: 'garage',
    name: 'Garage Floors',
    tagline: 'Transform your space',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/10633339e_original-6B598F0B-B835-43A0-B525-5B29450691ED.jpeg',
    icon: Car,
    description: 'Upgrade your garage with durable, easy-clean flooring. Resist oil, chemicals, and wear while looking amazing.',
    options: [
      { name: 'Single Car', size: '12\' × 24\'', tiles: '72 packs (288 tiles)', popular: false },
      { name: 'Double Car', size: '24\' × 24\'', tiles: '144 packs (576 tiles)', popular: true },
      { name: 'Triple Car', size: '36\' × 24\'', tiles: '216 packs (864 tiles)', popular: false },
    ],
    features: [
      'Oil & chemical resistant',
      'Easy to clean surface',
      'Multiple color patterns',
      'Comfortable standing surface',
    ],
  },
];

const TILE_SPECS = [
  { icon: Grid3X3, label: 'Size', value: '12" × 12" (1 sq ft)' },
  { icon: Wrench, label: 'Material', value: 'High-impact polypropylene' },
  { icon: Sun, label: 'UV Protection', value: 'Fade-resistant coating' },
  { icon: Droplets, label: 'Drainage', value: 'Built-in flow-through design' },
  { icon: Thermometer, label: 'Temp Range', value: '-30°F to 140°F' },
  { icon: ShieldCheck, label: 'Warranty', value: '15-year limited' },
];

export default function Products() {
  const siteImages = useSiteImages();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Modular Court Tiles",
    "description": "Premium interlocking modular tiles for basketball, pickleball, and multi-sport courts. UV-protected, all-weather, DIY-friendly installation.",
    "brand": {
      "@type": "Brand",
      "name": "Coast to Coast Courts"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "4.75",
      "highPrice": "6.00",
      "priceValidUntil": "2026-12-31"
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Modular Court Tiles - Basketball & Pickleball Flooring"
        description="Premium interlocking modular tiles for basketball courts, pickleball courts, multi-sport courts & garage floors. UV-protected, all-weather, easy DIY installation."
        keywords="modular court tiles, basketball court tiles, pickleball court flooring, interlocking tiles, outdoor court tiles, garage floor tiles"
        canonical="/products"
        structuredData={structuredData}
      />
      <SiteNav />

      {/* Hero */}
      <section className="pt-36 pb-12 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-[#3fb9ff]/10 text-[#3fb9ff] border-[#3fb9ff]/20 mb-4">Our Products</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Premium Modular Flooring
            </h1>
            <p className="text-lg text-slate-500">
              Durable, interlocking 1 sq ft tiles for basketball, pickleball, multi-sport, and garage applications.
            </p>
          </div>
        </div>
      </section>

      {/* Tile Specs Banner */}
      <section className="py-8 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {TILE_SPECS.map((spec, i) => (
              <div key={i} className="text-center">
                <spec.icon className="h-6 w-6 text-[#3fb9ff] mx-auto mb-2" />
                <p className="text-xs text-slate-400 uppercase tracking-wide">{spec.label}</p>
                <p className="text-white font-medium text-sm">{spec.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs defaultValue="basketball" className="space-y-8">
            <TabsList className="w-full max-w-xl mx-auto grid grid-cols-4 h-auto p-1 bg-slate-100 rounded-full">
              {PRODUCTS.map((product) => (
                <TabsTrigger 
                  key={product.id} 
                  value={product.id}
                  className="rounded-full py-2.5 data-[state=active]:bg-white data-[state=active]:text-[#3fb9ff] data-[state=active]:shadow-sm"
                >
                  <product.icon className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">{product.name.split(' ')[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {PRODUCTS.map((product) => (
              <TabsContent key={product.id} value={product.id} className="space-y-12">
                {/* Product Hero */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    <img 
                      src={siteImages[`products_${product.id}`] || product.image} 
                      alt={product.name}
                      className="w-full h-[400px] object-cover"
                    />
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-white/90 text-slate-800">
                        <product.icon className="h-3 w-3 mr-1" />
                        {product.name}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Badge className="bg-[#3fb9ff]/10 text-[#3fb9ff] border-[#3fb9ff]/20 mb-4">
                      {product.tagline}
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                      {product.name}
                    </h2>
                    <p className="text-lg text-slate-500 mb-6">
                      {product.description}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                            <Check className="h-3 w-3 text-emerald-600" />
                          </div>
                          <span className="text-slate-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button asChild size="lg" className="bg-[#3fb9ff] hover:bg-[#0ea5e9] rounded-full">
                      <Link to={createPageUrl('Builder')}>
                        Configure Your {product.name.split(' ')[0]}
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Size Options */}
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Popular Configurations</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {product.options.map((option, i) => (
                      <Card 
                        key={i} 
                        className={`p-6 border-2 transition-all hover:shadow-lg ${
                          option.popular ? 'border-[#3fb9ff] bg-[#3fb9ff]/5' : 'border-slate-100'
                        }`}
                      >
                        {option.popular && (
                          <Badge className="bg-[#3fb9ff] text-white mb-3">Most Popular</Badge>
                        )}
                        <h4 className="text-xl font-bold text-slate-800 mb-2">{option.name}</h4>
                        <p className="text-slate-500 mb-1">{option.size}</p>
                        <p className="text-sm text-[#3fb9ff] font-medium">{option.tiles}</p>
                        <Button asChild variant="outline" className="w-full mt-4">
                          <Link to={createPageUrl('Builder')}>Configure</Link>
                        </Button>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Tile Deep Dive */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 mb-4">The Tile System</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Built to Last, <br />Easy to Install
              </h2>
              <p className="text-lg text-slate-500 mb-8">
                Our 1 sq ft interlocking tiles are engineered for professional performance and DIY simplicity. 
                No special tools, no adhesives — just click and play.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Grid3X3, title: '1 sq ft Each', desc: 'Easy area calculation' },
                  { icon: Wrench, title: 'Tool-Free', desc: 'Snap-together design' },
                  { icon: Wind, title: 'Perforated', desc: 'Superior drainage' },
                  { icon: Sparkles, title: '16 Colors', desc: 'Endless customization' },
                ].map((item, i) => (
                  <Card key={i} className="p-4 border-0 shadow-sm">
                    <item.icon className="h-8 w-8 text-[#3fb9ff] mb-2" />
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-4 gap-2 p-8 bg-white rounded-3xl shadow-xl">
                {[
                  '#844C82', '#1E5945', '#CF3476', '#F6F6F6',
                  '#F9A800', '#D7D7D7', '#4E5452', '#007CB0',
                  '#007F5F', '#00F700', '#00387B', '#2F1B0C',
                  '#CC0605', '#EC7C26', '#7B1F1F', '#000000'
                ].map((color, i) => (
                  <div 
                    key={i} 
                    className="aspect-square rounded-lg border border-slate-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="absolute -bottom-4 -right-4 bg-[#3fb9ff] text-white px-6 py-3 rounded-2xl shadow-lg">
                <p className="font-bold">16 Colors Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#3fb9ff] to-[#0ea5e9]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Configure Your Court?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Use our interactive builder to design your perfect surface.
          </p>
          <Button asChild size="lg" className="bg-white text-[#3fb9ff] hover:bg-slate-100 rounded-full">
            <Link to={createPageUrl('Builder')}>
              <Palette className="h-5 w-5 mr-2" />
              Start Building
            </Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}