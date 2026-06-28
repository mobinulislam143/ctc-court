import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { ArrowRight, Menu } from 'lucide-react';
import ShippingBanner from '@/components/ShippingBanner';

const NAV_LINKS = [
  { label: 'Home', to: createPageUrl('Home') },
  { label: 'Products', to: createPageUrl('Products') },
  { label: 'How It Works', to: createPageUrl('HowItWorks') },
  { label: 'Gallery', to: createPageUrl('Gallery') },
  { label: 'Pricing', to: createPageUrl('Pricing') },
  { label: 'Financing', to: '/Financing' },
  { label: 'Shop', to: createPageUrl('Shop') },
  { label: 'Partners', to: '/Partners' },
];

export default function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (to) => {
    if (to === '/Home' || to === '/') return location.pathname === '/' || location.pathname === '/Home';
    return location.pathname === to;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <ShippingBanner />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 shrink-0">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/a8c19e1c9_Untitleddesign4.png"
              alt="Coast to Coast Courts"
              className="h-10 w-10"
            />
            <span className="font-bold text-xl text-slate-800 hidden sm:block">Coast to Coast Courts</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.to) ? 'text-[#3fb9ff]' : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="h-5 w-5 text-slate-600" />
            </Button>
            <Button asChild className="bg-[#3fb9ff] hover:bg-[#0ea5e9] text-white">
              <Link to={createPageUrl('Builder')}>
                Build Your Court
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <div className="flex items-center gap-2">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/a8c19e1c9_Untitleddesign4.png"
                alt="Coast to Coast Courts"
                className="h-8 w-8"
              />
              <span className="font-bold text-sm">Coast to Coast Courts</span>
            </div>
          </SheetHeader>
          <nav className="flex flex-col gap-4 mt-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="text-slate-700 hover:text-[#3fb9ff] font-medium text-base py-2"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={createPageUrl('Builder')}
              onClick={() => setMenuOpen(false)}
              className="text-slate-700 hover:text-[#3fb9ff] font-medium text-base py-2"
            >
              Build Your Court
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </nav>
  );
}