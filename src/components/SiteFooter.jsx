import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Facebook, Instagram, Twitter, Youtube, ArrowRight } from 'lucide-react';

function SocialIcon({ url, Icon, label }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-full bg-slate-700 hover:bg-[#3fb9ff] flex items-center justify-center transition-colors"
    >
      <Icon className="h-4 w-4 text-white" />
    </a>
  );
}

// TikTok SVG since lucide doesn't have it
function TikTokIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.28 8.28 0 004.84 1.55V7.06a4.85 4.85 0 01-1.07-.37z"/>
    </svg>
  );
}

export default function SiteFooter({ variant = 'simple' }) {
  const settings = useSiteSettings();
  const contactEmail = settings.contact_email || 'info@coasttocoastcourts.com';

  const hasSocials = settings.facebook_url || settings.instagram_url || settings.twitter_url || settings.youtube_url || settings.tiktok_url;

  if (variant === 'simple') {
    return (
      <footer className="py-8 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          {hasSocials && (
            <div className="flex items-center justify-center gap-3 mb-4">
              <SocialIcon url={settings.facebook_url} Icon={Facebook} label="Facebook" />
              <SocialIcon url={settings.instagram_url} Icon={Instagram} label="Instagram" />
              <SocialIcon url={settings.twitter_url} Icon={Twitter} label="Twitter/X" />
              <SocialIcon url={settings.youtube_url} Icon={Youtube} label="YouTube" />
              {settings.tiktok_url && (
                <a
                  href={settings.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-9 h-9 rounded-full bg-slate-700 hover:bg-[#3fb9ff] flex items-center justify-center transition-colors"
                >
                  <TikTokIcon className="h-4 w-4 text-white" />
                </a>
              )}
            </div>
          )}
          <p className="text-slate-400 text-sm">
            Questions? Email us at{' '}
            <a href={`mailto:${contactEmail}`} className="text-white font-semibold hover:text-[#3fb9ff]">
              {contactEmail}
            </a>
          </p>
          <p className="text-slate-500 text-sm mt-2">© 2026 Coast to Coast Courts. All rights reserved.</p>
        </div>
      </footer>
    );
  }

  // Full footer (for Home page)
  return (
    <footer className="py-12 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/a8c19e1c9_Untitleddesign4.png"
                alt="Coast to Coast Courts"
                className="h-10 w-10"
              />
              <span className="font-bold text-lg">Coast to Coast Courts</span>
            </div>
            <p className="text-slate-400 text-sm">
              Premium modular sports flooring for basketball, pickleball, and more.
            </p>
            {hasSocials && (
              <div className="flex items-center gap-2 mt-4">
                <SocialIcon url={settings.facebook_url} Icon={Facebook} label="Facebook" />
                <SocialIcon url={settings.instagram_url} Icon={Instagram} label="Instagram" />
                <SocialIcon url={settings.twitter_url} Icon={Twitter} label="Twitter/X" />
                <SocialIcon url={settings.youtube_url} Icon={Youtube} label="YouTube" />
                {settings.tiktok_url && (
                  <a
                    href={settings.tiktok_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="w-9 h-9 rounded-full bg-slate-700 hover:bg-[#3fb9ff] flex items-center justify-center transition-colors"
                  >
                    <TikTokIcon className="h-4 w-4 text-white" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link to={createPageUrl('Products')} className="hover:text-white">Basketball Courts</Link></li>
              <li><Link to={createPageUrl('Products')} className="hover:text-white">Pickleball Courts</Link></li>
              <li><Link to={createPageUrl('Products')} className="hover:text-white">Multi-Sport</Link></li>
              <li><Link to={createPageUrl('Products')} className="hover:text-white">Garage Floors</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link to={createPageUrl('HowItWorks')} className="hover:text-white">How It Works</Link></li>
              <li><Link to={createPageUrl('Gallery')} className="hover:text-white">Gallery</Link></li>
              <li><Link to={createPageUrl('Pricing')} className="hover:text-white">Pricing</Link></li>
              <li><Link to="/Financing" className="hover:text-white">Financing</Link></li>
              <li><Link to={createPageUrl('Contact')} className="hover:text-white">Contact</Link></li>
              <li><Link to="/Partners" className="hover:text-white">Partner With Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Get Started</h4>
            <Button asChild className="w-full bg-[#3fb9ff] hover:bg-[#0ea5e9]">
              <Link to={createPageUrl('Builder')}>Build Your Court</Link>
            </Button>
            <p className="text-slate-400 text-sm mt-4">
              Questions? Email us at<br />
              <a href={`mailto:${contactEmail}`} className="text-white font-semibold hover:text-[#3fb9ff]">
                {contactEmail}
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© 2026 Coast to Coast Courts. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to={createPageUrl('PrivacyPolicy')} className="hover:text-white">Privacy Policy</Link>
            <Link to={createPageUrl('TermsOfService')} className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}