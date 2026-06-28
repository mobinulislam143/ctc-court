import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Check, Phone, Mail, Package, ArrowRight, Loader2, Clock } from 'lucide-react';

export default function OrderSuccess() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (sessionId) {
      base44.functions.invoke('getCheckoutSession', { sessionId })
        .then(res => {
          if (res.data) {
            setSession(res.data);
            // Increment discount code usage now that the order is confirmed
            const discountCodeId = res.data.metadata?.discount_code_id;
            const timesUsedStr = res.data.metadata?.discount_code_times_used;
            if (discountCodeId && timesUsedStr !== '') {
              const timesUsed = parseInt(timesUsedStr || '0', 10);
              base44.entities.DiscountCode.update(discountCodeId, { times_used: timesUsed + 1 }).catch(() => {});
            }
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Success Icon */}
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Order Confirmed! 🎉</h1>
          <p className="text-slate-500">Your payment was successful. We're excited to build your court!</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
        ) : session && (
          <Card className="p-5 bg-slate-900 text-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-400 text-sm">Order Total</span>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Paid</Badge>
            </div>
            <p className="text-3xl font-bold text-[#3fb9ff]">${((session.amountTotal || 0) / 100).toLocaleString()}</p>
            {session.customerEmail && (
              <p className="text-slate-400 text-sm mt-2">Confirmation sent to {session.customerEmail}</p>
            )}
          </Card>
        )}

        {/* What happens next */}
        <Card className="p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#3fb9ff]" />
            What Happens Next
          </h3>
          <div className="space-y-4">
            {[
              { icon: Phone, title: 'We\'ll reach out within 24 hours', desc: 'Our team will contact you to confirm your color preferences and shipping details.' },
              { icon: Package, title: 'Your order ships in 5–7 days', desc: 'Once colors are confirmed, tiles are packed and shipped via freight.' },
              { icon: Check, title: 'Set up in no time', desc: 'Simple snap-together tiles — no tools, no experience needed. Most courts done in under 2 hours!' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#3fb9ff]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="h-4 w-4 text-[#3fb9ff]" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 bg-amber-50 border-amber-200">
          <p className="text-amber-800 text-sm text-center">
            <strong>Questions?</strong> Text or call us at{' '}
            <a href="tel:7168072108" className="font-bold text-amber-900">716-807-2108</a>
            {' '}or email{' '}
            <a href="mailto:coasttocoastcourts@gmail.com" className="font-bold text-amber-900 underline">coasttocoastcourts@gmail.com</a>
          </p>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="flex-1 bg-[#3fb9ff] hover:bg-[#0ea5e9]">
            <Link to={createPageUrl('Home')}>Back to Home</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to={createPageUrl('Shop')}>Browse More Packages <ArrowRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}