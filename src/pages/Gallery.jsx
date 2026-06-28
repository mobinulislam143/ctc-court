import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, X, ChevronLeft, ChevronRight, Circle, Square, Grid3X3, Car, Loader2 } from 'lucide-react';
import ShippingBanner from '@/components/ShippingBanner';
import SiteNav from '@/components/SiteNav';
import SiteFooter from '@/components/SiteFooter';

const GALLERY_ITEMS = [
  {
    id: 1,
    category: 'basketball',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/768f94d59_original-9C2CE967-E509-467A-A4F9-60BA1F7BA526.jpg',
    title: 'Backyard Half Court',
    location: 'San Diego, CA',
    specs: '47\' × 50\' • Blue & Navy',
  },
  {
    id: 2,
    category: 'pickleball',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/84dce9a45_DE3C9764-40F9-4B33-8757-92999BD56B9A.jpg',
    title: 'Dual Pickleball Setup',
    location: 'Austin, TX',
    specs: '60\' × 64\' • Green & Gray',
  },
  {
    id: 3,
    category: 'garage',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/2553e2c43_lam2.png',
    title: 'Premium Garage Floor',
    location: 'Miami, FL',
    specs: '24\' × 24\' • Yellow & Black',
  },
  {
    id: 4,
    category: 'basketball',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/bc8316561_JPEGimage.jpg',
    title: 'Full Regulation Court',
    location: 'Phoenix, AZ',
    specs: '94\' × 50\' • Blue & Red',
  },
  {
    id: 5,
    category: 'multisport',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/059731f0c_original-708AB469-D7EB-4D2F-9A2F-39E474666293.jpg',
    title: 'Multi-Sport Complex',
    location: 'Denver, CO',
    specs: '84\' × 50\' • Basketball + Pickleball',
  },
  {
    id: 6,
    category: 'basketball',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/91d04e642_PhotoFix_16_21_47.jpg',
    title: 'Driveway Court',
    location: 'Seattle, WA',
    specs: '35\' × 30\' • Blue & Gray',
  },
  {
    id: 7,
    category: 'pickleball',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/84dce9a45_DE3C9764-40F9-4B33-8757-92999BD56B9A.jpg',
    title: 'Tournament Court',
    location: 'Tampa, FL',
    specs: '34\' × 64\' • Pro Green',
  },
  {
    id: 8,
    category: 'garage',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/79b11db04_kjh.jpg',
    title: 'Checkered Garage',
    location: 'Chicago, IL',
    specs: '36\' × 24\' • Black & Red',
  },
  {
    id: 9,
    category: 'multisport',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/059731f0c_original-708AB469-D7EB-4D2F-9A2F-39E474666293.jpg',
    title: 'Family Recreation Court',
    location: 'Dallas, TX',
    specs: '70\' × 40\' • Coastal Blue',
  },
  {
    id: 10,
    category: 'basketball',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/768f94d59_original-9C2CE967-E509-467A-A4F9-60BA1F7BA526.jpg',
    title: 'Indoor Training Facility',
    location: 'Boston, MA',
    specs: '94\' × 50\' • Hardwood Look',
  },
  {
    id: 11,
    category: 'pickleball',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/84dce9a45_DE3C9764-40F9-4B33-8757-92999BD56B9A.jpg',
    title: 'Community Courts',
    location: 'Portland, OR',
    specs: '4 Courts • Mixed Colors',
  },
  {
    id: 12,
    category: 'garage',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/10633339e_original-6B598F0B-B835-43A0-B525-5B29450691ED.jpeg',
    title: 'Luxury Garage',
    location: 'Las Vegas, NV',
    specs: '48\' × 24\' • Premium Gray',
  },
  {
    id: 13,
    category: 'pickleball',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/121cd6c7d_132319F4-B78A-4F4D-8979-0CECDCBA9E95.jpeg',
    title: 'Backyard Pickleball Oasis',
    location: 'California, CA',
    specs: '60\' × 30\' • Blue & Tan',
  },
  {
    id: 14,
    category: 'basketball',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/8ae20a11b_0B43BFDF-C4A2-4156-9297-2683FDA8700A.jpg',
    title: 'Active Family Court',
    location: 'Nashville, TN',
    specs: '50\' × 47\' • Gray & Charcoal',
  },
  {
    id: 15,
    category: 'basketball',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/408730e97_PhotoFix_16_33_2.jpg',
    title: 'Indoor Training Center',
    location: 'Atlanta, GA',
    specs: '94\' × 50\' • Professional Grade',
  },
  {
    id: 16,
    category: 'pickleball',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/867233ecb_A33E9BD5-047D-40E9-A321-FB8E4EDC4ED0.jpg',
    title: 'Community Pickleball Complex',
    location: 'Scottsdale, AZ',
    specs: 'Triple Court • Blue & Green',
  },
  {
    id: 17,
    category: 'multisport',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/aed32f5d6_BF5F2F8D-A062-4252-ACB9-7CB285D370C2.jpg',
    title: 'Aerial Multi-Sport Park',
    location: 'Denver, CO',
    specs: 'Basketball + Pickleball • Premium Setup',
  },
  {
    id: 18,
    category: 'pickleball',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/608c63b0d_D83A8153-AC80-4EFF-B322-8B929312E16F.jpeg',
    title: 'Indoor Pickleball Facility',
    location: 'Portland, OR',
    specs: 'Multi-Court • Professional Venue',
  },
  {
    id: 19,
    category: 'basketball',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/93de57ba2_IMG_9488.jpg',
    title: 'Modern Home Court',
    location: 'Chicago, IL',
    specs: '50\' × 47\' • Black & Gray',
  },
  {
    id: 20,
    category: 'basketball',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/f0ad966b4_DBA214DD-6430-4EFD-945B-9D818D1A5179.jpg',
    title: 'Contemporary Backyard Court',
    location: 'Boise, ID',
    specs: '50\' × 47\' • Blue Professional',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Grid3X3 },
  { id: 'basketball', label: 'Basketball', icon: Circle },
  { id: 'pickleball', label: 'Pickleball', icon: Square },
  { id: 'multisport', label: 'Multi-Sport', icon: Grid3X3 },
  { id: 'garage', label: 'Garage', icon: Car },
];

export default function Gallery() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: galleryImages = [], isLoading } = useQuery({
    queryKey: ['galleryImages'],
    queryFn: () => base44.entities.GalleryImage.list('sort_order'),
  });

  const activeImages = galleryImages.filter(img => img.is_active !== false);
  const filteredItems = filter === 'all' ? activeImages : activeImages.filter(item => item.category === filter);

  const currentIndex = selectedImage 
    ? filteredItems.findIndex(item => item.id === selectedImage.id) 
    : -1;

  const goToNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setSelectedImage(filteredItems[currentIndex + 1]);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setSelectedImage(filteredItems[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteNav />

      {/* Hero */}
      <section className="pt-36 pb-12 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-[#3fb9ff]/10 text-[#3fb9ff] border-[#3fb9ff]/20 mb-4">Inspiration</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Project Gallery
            </h1>
            <p className="text-lg text-slate-500">
              Browse real installations from customers across the country. Get inspired for your own project.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-6 border-b border-slate-100 sticky top-16 bg-white/95 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto px-4">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="w-full max-w-xl mx-auto grid grid-cols-5 h-auto p-1 bg-slate-100 rounded-full">
              {CATEGORIES.map((cat) => (
                <TabsTrigger 
                  key={cat.id} 
                  value={cat.id}
                  className="rounded-full py-2 data-[state=active]:bg-white data-[state=active]:text-[#3fb9ff] data-[state=active]:shadow-sm text-sm"
                >
                  <cat.icon className="h-4 w-4 mr-1.5 hidden sm:block" />
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {isLoading && <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-[#3fb9ff]" /></div>}
          {!isLoading && filteredItems.length === 0 && <div className="text-center py-16 text-slate-400">No images in this category yet.</div>}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all"
              >
                <div className="aspect-[4/3]">
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 mb-2 text-xs">
                    {CATEGORIES.find(c => c.id === item.category)?.label}
                  </Badge>
                  <h3 className="text-white font-bold text-lg">{item.title}</h3>
                  <p className="text-white/70 text-sm">{item.location}</p>
                  <p className="text-white/50 text-xs mt-1">{item.specs}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-5xl p-0 bg-slate-900 border-0">
          <div className="relative">
            <img 
              src={selectedImage?.image_url} 
              alt={selectedImage?.title}
              className="w-full h-auto max-h-[80vh] object-contain"
            />
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>

            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                onClick={goToPrev}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {currentIndex < filteredItems.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900 to-transparent">
              <Badge className="bg-[#3fb9ff]/20 text-[#3fb9ff] border-[#3fb9ff]/30 mb-2">
                {CATEGORIES.find(c => c.id === selectedImage?.category)?.label}
              </Badge>
              <h3 className="text-white font-bold text-xl">{selectedImage?.title}</h3>
              <p className="text-white/70">{selectedImage?.location}</p>
              <p className="text-white/50 text-sm mt-1">{selectedImage?.specs}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#3fb9ff] to-[#0ea5e9]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Create Yours?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Start designing your custom court today and join our gallery of happy customers.
          </p>
          <Button asChild size="lg" className="bg-white text-[#3fb9ff] hover:bg-slate-100 rounded-full">
            <Link to={createPageUrl('Builder')}>
              Build Your Court
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}