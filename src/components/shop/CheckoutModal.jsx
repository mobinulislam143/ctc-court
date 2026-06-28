import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';
import TruliVerifiedBadge from '@/components/TruliVerifiedBadge';
import { ShoppingCart, Loader2, Tag, X, Check, CreditCard, ChevronDown } from 'lucide-react';

export default function CheckoutModal({ pkg, open, onClose }) {
  const [showDiscountField, setShowDiscountField] = useState(false);
  const [discountInput, setDiscountInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState('');
  const [discountLoading, setDiscountLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  if (!pkg) return null;

  const tilesCost = pkg.tiles * 4.75;
  const linesCost = pkg.includesLines ? 299 : 0;
  const subtotal = tilesCost + linesCost;
  const discountAmount = appliedDiscount
    ? appliedDiscount.type === 'percentage'
      ? Math.round(subtotal * appliedDiscount.value / 100)
      : Math.min(appliedDiscount.value, subtotal)
    : 0;
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(afterDiscount * 0.08);
  const total = afterDiscount + taxAmount;

  const applyDiscount = async () => {
    const code = discountInput.toUpperCase().trim();
    if (!code) return;
    setDiscountLoading(true);
    setDiscountError('');
    try {
      const results = await base44.entities.DiscountCode.filter({ code, is_active: true });
      if (results && results.length > 0) {
        const dc = results[0];
        setAppliedDiscount({ id: dc.id, code: dc.code, type: dc.discount_type, value: dc.discount_value, times_used: dc.times_used || 0 });
        setDiscountInput('');
        setShowDiscountField(false);
      } else {
        setDiscountError('Invalid or expired code.');
      }
    } catch {
      setDiscountError('Could not verify code. Please try again.');
    } finally {
      setDiscountLoading(false);
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const response = await base44.functions.invoke('createCheckoutSession', {
        lineItems: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: pkg.stripeProductName,
              description: `${pkg.dimensions} • ${Math.ceil(pkg.tiles / 4).toLocaleString()} packs (${pkg.tiles} tiles) • DIY Installation${appliedDiscount ? ` • Code: ${appliedDiscount.code}` : ''}`,
              images: [pkg.image],
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        }],
        totalAmount: total,
        discountCode: appliedDiscount?.code || null,
        discountCodeId: appliedDiscount?.id || null,
        discountCodeTimesUsed: appliedDiscount ? (appliedDiscount.times_used || 0) : null,
        courtDescription: `${pkg.name} - ${pkg.dimensions}`,
        designData: { packageId: pkg.id, tiles: pkg.tiles, sqft: pkg.sqft },
      });
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <h2 className="text-xl font-bold text-slate-800">Order Summary</h2>
          <p className="text-sm text-slate-500">{pkg.name}</p>
        </DialogHeader>

        {/* Pricing Breakdown */}
        <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">
              Flooring tiles ({Math.ceil(pkg.tiles / 4).toLocaleString()} packs × 4 tiles @ $4.75/tile)
            </span>
            <span className="font-medium">${tilesCost.toLocaleString()}</span>
          </div>
          {linesCost > 0 && (
            <div className="flex justify-between">
              <span className="text-slate-600">Sport lines package</span>
              <span className="font-medium">+${linesCost}</span>
            </div>
          )}
          {appliedDiscount && (
            <div className="flex justify-between text-emerald-600">
              <span className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                Discount ({appliedDiscount.code})
              </span>
              <span>−${discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>Tax (8%)</span>
            <span>+${taxAmount.toLocaleString()}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-bold text-slate-800">
            <span>Total</span>
            <span className="text-[#3fb9ff]">${total.toLocaleString()}</span>
          </div>
          <p className="text-xs text-slate-400 pt-1">{Math.ceil(pkg.tiles / 4).toLocaleString()} packs · {pkg.tiles.toLocaleString()} tiles · {pkg.dimensions} · {pkg.sqft.toLocaleString()} sq ft</p>
        </div>

        {/* Discount Code — hidden behind a toggle */}
        {appliedDiscount ? (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-sm">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold">
              <Check className="h-4 w-4" />
              <span>{appliedDiscount.code}</span>
              <span className="font-normal text-emerald-600">
                — {appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}% off` : `$${appliedDiscount.value} off`}
              </span>
            </div>
            <button onClick={() => setAppliedDiscount(null)} className="text-emerald-400 hover:text-emerald-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div>
            <button
              className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"
              onClick={() => setShowDiscountField(v => !v)}
            >
              <ChevronDown className={`h-3 w-3 transition-transform ${showDiscountField ? 'rotate-180' : ''}`} />
              Have a discount code?
            </button>
            {showDiscountField && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={discountInput}
                    onChange={(e) => { setDiscountInput(e.target.value.toUpperCase()); setDiscountError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && applyDiscount()}
                    className="h-9"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 h-9"
                    onClick={applyDiscount}
                    disabled={!discountInput || discountLoading}
                  >
                    {discountLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Apply'}
                  </Button>
                </div>
                {discountError && <p className="text-red-500 text-xs">{discountError}</p>}
              </div>
            )}
          </div>
        )}

        {/* Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer bg-slate-50 rounded-lg p-3">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded shrink-0"
          />
          <span className="text-xs text-slate-600 leading-relaxed">
            I agree to the{' '}
            <a href="/TermsOfService" target="_blank" className="underline font-semibold text-[#3fb9ff]">Terms of Service</a>
            {', '}
            <a href="/PrivacyPolicy" target="_blank" className="underline font-semibold text-[#3fb9ff]">Privacy Policy</a>
            {', and '}
            <a href="/TermsOfService#refunds" target="_blank" className="underline font-semibold text-[#3fb9ff]">Refund Policy</a>
            . I understand this is a DIY materials-only purchase.
          </span>
        </label>

        <Button
          className="w-full bg-[#3fb9ff] hover:bg-[#0ea5e9] text-white h-12 text-base gap-2 disabled:opacity-50"
          onClick={handleCheckout}
          disabled={checkingOut || !agreedToTerms}
        >
          {checkingOut ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Redirecting...</>
          ) : (
            <><CreditCard className="h-5 w-5" /> Proceed to Checkout — ${total.toLocaleString()}</>
          )}
        </Button>
        <p className="text-xs text-slate-400 text-center">🔒 Secure checkout · Apple Pay · Google Pay · Card</p>
        <div className="flex justify-center pt-1">
          <TruliVerifiedBadge size="sm" />
        </div>
      </DialogContent>
    </Dialog>
  );
}