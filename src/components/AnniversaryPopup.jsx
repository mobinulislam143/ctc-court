import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Star } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AnniversaryPopup() {
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('anniversary_popup_dismissed');
    if (dismissed) {
      setMinimized(true);
      return;
    }
    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setMinimized(true);
    sessionStorage.setItem('anniversary_popup_dismissed', 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email && !phone) return;
    setLoading(true);
    try {
      await base44.entities.Lead.create({
        full_name: 'Anniversary Promo Lead',
        email: email || '',
        phone: phone || '',
        notes: 'USA 250th Anniversary popup opt-in',
        status: 'new',
      });
    } catch (_) {}
    setLoading(false);
    setSubmitted(true);
    sessionStorage.setItem('anniversary_popup_dismissed', 'true');
    setTimeout(() => {
      setVisible(false);
      setMinimized(true);
    }, 2500);
  };

  if (!visible && !minimized) return null;

  // Minimized widget
  if (minimized && !visible) {
    return (
      <button
        onClick={() => { setMinimized(false); setVisible(true); }}
        className="fixed bottom-5 right-5 z-50 bg-gradient-to-r from-red-600 via-white to-blue-700 p-[2px] rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <div className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-full flex items-center gap-1.5">
          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
          50% OFF SALE
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 pointer-events-none">
      <div className="pointer-events-auto w-full sm:w-80 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-600 via-slate-800 to-blue-700 px-5 py-4 text-white">
          <button onClick={handleDismiss} className="absolute top-2 right-2 text-white/70 hover:text-white">
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold tracking-widest uppercase text-yellow-300">Limited Time</span>
          </div>
          <p className="text-lg font-black leading-tight">USA 250TH ANNIVERSARY SALE</p>
          <p className="text-2xl font-black text-yellow-300">50% OFF</p>
          <p className="text-xs text-white/80 mt-1">All court tiles — while the sale lasts</p>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {submitted ? (
            <div className="text-center py-2">
              <div className="text-2xl mb-2">🎉</div>
              <p className="font-bold text-slate-800">You're in!</p>
              <p className="text-sm text-slate-500 mt-1">Your discount is already applied sitewide. Start building your court!</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-600 mb-3">
                Enter your email or phone to claim this exclusive anniversary pricing.
              </p>
              <form onSubmit={handleSubmit} className="space-y-2">
                <Input
                  placeholder="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-sm"
                />
                <Input
                  placeholder="Phone number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9 text-sm"
                />
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-10"
                  disabled={loading || (!email && !phone)}
                >
                  {loading ? 'Saving...' : 'CLAIM MY 50% OFF'}
                </Button>
              </form>
              <p className="text-xs text-slate-400 text-center mt-2">No spam. Unsubscribe anytime.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}