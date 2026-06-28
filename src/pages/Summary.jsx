import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import CourtPreview from '@/components/ui/CourtPreview';
import { 
  ArrowLeft, Download, Share2, Mail, ShoppingCart, FileText, 
  Check, Grid3X3, Ruler, Palette, Type, Image, Package, 
  MapPin, Calendar, Loader2, CreditCard, Zap, Tag, X, ExternalLink
} from 'lucide-react';

const COURT_TYPE_LABELS = {
  basketball_full: 'Full Basketball Court',
  basketball_half: 'Half Basketball Court',
  basketball_key: 'Basketball Key/Training',
  basketball_custom: 'Custom Basketball',
  pickleball_single: 'Single Pickleball Court',
  pickleball_dual: 'Dual Pickleball Courts',
  pickleball_custom: 'Custom Pickleball',
  multi_sport: 'Multi-Sport Court',
  garage: 'Garage Floor',
  custom: 'Custom Build'
};

const DEFAULT_PRICING = {
  price_per_sqft_base: 4.75,
  line_package_flat: 299,
  logo_addon_price: 299,
  edge_ramps_flat: 499,
};

function usePricing() {
  const { data: pricingConfigs = [] } = useQuery({
    queryKey: ['pricing'],
    queryFn: () => base44.entities.PricingConfig.list(),
  });
  return pricingConfigs[0] || DEFAULT_PRICING;
}

export default function Summary() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch pricing from admin config
  const { data: pricingConfigs = [] } = useQuery({
    queryKey: ['pricing'],
    queryFn: () => base44.entities.PricingConfig.list(),
  });

  const pricing = pricingConfigs[0] || DEFAULT_PRICING;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [discountInput, setDiscountInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null); // { code, type, value }
  const [discountError, setDiscountError] = useState('');
  const [discountLoading, setDiscountLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [leadForm, setLeadForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    surface_type: '',
    indoor_outdoor: '',
    timeline: '',
    notes: '',
  });

  // Parse design from URL — fall back to sessionStorage so back-from-Stripe still works
  const design = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const designParam = params.get('design');
    if (designParam) {
      try {
        const parsed = JSON.parse(designParam);
        sessionStorage.setItem('ctc_last_design', designParam);
        return parsed;
      } catch {
        return null;
      }
    }
    // Fallback: restore from session (e.g. user pressed back from Stripe)
    const saved = sessionStorage.getItem('ctc_last_design');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    return null;
  }, []);

  // Auto-apply discount code from URL ?discount=CODE
  const urlDiscount = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('discount') || '';
  }, []);

  const applyDiscountCode = async (codeToApply) => {
    const code = (codeToApply || discountInput).toUpperCase().trim();
    if (!code) return;
    setDiscountLoading(true);
    setDiscountError('');
    try {
      const results = await base44.entities.DiscountCode.filter({ code, is_active: true });
      if (results && results.length > 0) {
        const dc = results[0];
        setAppliedDiscount({ id: dc.id, code: dc.code, type: dc.discount_type, value: dc.discount_value, times_used: dc.times_used || 0 });
        setDiscountInput('');
        // Note: times_used is incremented only after successful order in OrderSuccess
      } else {
        setDiscountError('Invalid or expired code.');
      }
    } catch {
      setDiscountError('Could not verify code. Please try again.');
    } finally {
      setDiscountLoading(false);
    }
  };

  React.useEffect(() => {
    if (urlDiscount) {
      setDiscountInput(urlDiscount);
      applyDiscountCode(urlDiscount);
    }
  }, [urlDiscount]);

  if (!design) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-bold mb-4">Design Not Found</h2>
          <p className="text-slate-500 mb-6">Use the court builder to design your custom court, or browse our ready-to-ship packages.</p>
          <div className="space-y-3">
            <Button asChild className="w-full bg-[#3fb9ff] hover:bg-[#0ea5e9]">
              <Link to={createPageUrl('Builder')}>Build Your Custom Court</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to={createPageUrl('Shop')}>View Shop Packages</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const sqft = design.width * design.length;
  const tiles = Math.ceil(sqft);
  const wasteTiles = Math.ceil(tiles * ((design.wasteFactor || 0) / 100));
  const totalTiles = tiles + wasteTiles;

  // Calculate total price
  const materialsTotal = totalTiles * (pricing.price_per_sqft_base || 4.75);
  
  // Flat add-on pricing
  const linesCost = design.addOns?.lines ? (pricing.line_package_flat || 299) : 0;
  const logoCost = design.addOns?.logo ? (pricing.logo_addon_price || 299) : 0;
  const rampsCost = design.addOns?.ramps ? (pricing.edge_ramps_flat || 499) : 0;
  
  const subtotal = materialsTotal + linesCost + logoCost + rampsCost;
  const discountAmount = appliedDiscount
    ? appliedDiscount.type === 'percentage'
      ? Math.round(subtotal * appliedDiscount.value / 100)
      : Math.min(appliedDiscount.value, subtotal)
    : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleBuyNow = async () => {
    setIsCheckingOut(true);
    try {
      const response = await base44.functions.invoke('createCheckoutSession', {
        lineItems: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Custom ${COURT_TYPE_LABELS[design.courtType] || 'Court'} Package`,
              description: `${design.width}' × ${design.length}' • ${Math.ceil(totalTiles / 4).toLocaleString()} packs (${totalTiles} tiles) • DIY Installation${appliedDiscount ? ` • Code: ${appliedDiscount.code}` : ''}`,
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        }],
        totalAmount: total,
        discountCode: appliedDiscount?.code || null,
        courtDescription: `${COURT_TYPE_LABELS[design.courtType]} - ${design.width}' × ${design.length}'`,
        designData: {
          courtType: design.courtType,
          width: design.width,
          length: design.length,
          tiles: totalTiles,
          addOns: design.addOns,
        },
        discountCodeId: appliedDiscount?.id || null,
        discountCodeTimesUsed: appliedDiscount ? (appliedDiscount.times_used || 0) : null,
      });
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save the design
      const savedDesign = await base44.entities.CourtDesign.create({
        court_type: design.courtType,
        width_ft: design.width,
        length_ft: design.length,
        total_sqft: sqft,
        tile_count: totalTiles,
        waste_factor: design.wasteFactor,
        colors: design.colors,
        lines_config: design.linesConfig,
        logo_url: design.logoUrl,
        logo_config: design.logoConfig,
        environment: design.environment,
        package_type: 'materials_only',
        add_ons: design.addOns,
        estimated_price: total,
        status: 'submitted',
      });

      // Save the lead
      await base44.entities.Lead.create({
        ...leadForm,
        design_id: savedDesign.id,
        design_summary: {
          courtType: design.courtType,
          dimensions: `${design.width}' x ${design.length}'`,
          sqft,
          tiles: totalTiles,
          colors: design.colors,
          total,
        },
        estimated_value: total,
        status: 'new',
      });
      
      // Send email notification (don't block on errors)
      try {
        await base44.integrations.Core.SendEmail({
          to: 'coasttocoastcourts@gmail.com',
          subject: `New Quote Request - ${leadForm.full_name} - $${total.toLocaleString()}`,
          body: `
New quote request submitted:

Customer Information:
Name: ${leadForm.full_name}
Email: ${leadForm.email}
Phone: ${leadForm.phone}
City: ${leadForm.city || 'N/A'}
State: ${leadForm.state || 'N/A'}

Project Details:
Court Type: ${COURT_TYPE_LABELS[design.courtType]}
Dimensions: ${design.width}' × ${design.length}' (${sqft} sq ft)
Total Tiles: ${totalTiles}
Package: DIY Materials
Surface Type: ${leadForm.surface_type || 'N/A'}
Location: ${leadForm.indoor_outdoor || 'N/A'}
Timeline: ${leadForm.timeline || 'N/A'}

Estimated Total: $${total.toLocaleString()}

Materials: $${materialsTotal.toLocaleString()}
${linesCost > 0 ? `Sport Lines: +$${linesCost}` : ''}
${logoCost > 0 ? `Logo Inlay: +$${logoCost}` : ''}
${rampsCost > 0 ? `Edge Ramps: +$${rampsCost}` : ''}

Additional Notes:
${leadForm.notes || 'None'}

Please follow up with this lead.
        `
        });
      } catch (err) {
        console.error('Failed to send email notification:', err);
      }

      // Send to master Base44 website (don't block on errors)
      try {
        await fetch('https://base44-command-center-1b9e765e.base44.app/api/functions/receiveInquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            business_name: "Coast to Coast Courts",
            type: "quote_request",
            priority: "high",
            source: "Coast to Coast Courts - Quote Request",
            contact_name: leadForm.full_name,
            contact_email: leadForm.email,
            contact_phone: leadForm.phone,
            subject: `Quote Request - ${COURT_TYPE_LABELS[design.courtType]}`,
            message: `Court Design Quote Request

Dimensions: ${design.width}' × ${design.length}' (${sqft} sq ft)
Total Tiles: ${totalTiles}
Estimated Total: $${total.toLocaleString()}

Surface Type: ${leadForm.surface_type || 'N/A'}
Location: ${leadForm.indoor_outdoor || 'N/A'}
Timeline: ${leadForm.timeline || 'N/A'}

Additional Notes: ${leadForm.notes || 'None'}`
          })
        });
      } catch (err) {
        console.error('Failed to send to master website:', err);
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Quote Request Submitted!</h2>
          <p className="text-slate-500 mb-6">
            Thank you for your interest! Our team will review your design and contact you within 24-48 hours with a detailed quote.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full bg-[#3fb9ff] hover:bg-[#0ea5e9]">
              <Link to={createPageUrl('Home')}>Back to Home</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to={createPageUrl('Builder')}>Build Another Court</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/a8c19e1c9_Untitleddesign4.png" 
                alt="Coast to Coast Courts"
                className="h-10 w-10"
              />
            </Link>
            <Link to={createPageUrl('Builder')} className="text-slate-600 hover:text-slate-800 text-sm">
              <ArrowLeft className="h-4 w-4 inline mr-1" />
              <span>Edit Design</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button
                variant="outline" size="sm" className="flex gap-2"
                onClick={() => {
                  const shareUrl = 'https://ctccourts.com/Summary?' + new URLSearchParams(window.location.search).toString();
                  if (navigator.share) {
                    navigator.share({ title: 'My Court Design', url: shareUrl });
                  } else {
                    navigator.clipboard.writeText(shareUrl);
                    alert('Link copied to clipboard!');
                  }
                }}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline" size="sm" className="flex gap-2"
                onClick={() => window.print()}
              >
                <Download className="h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Your Court Design</h1>
          <p className="text-slate-500">Review your design and request a quote</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Design Summary */}
          <div className="space-y-6">
            {/* Preview */}
            <CourtPreview
              width={design.width}
              length={design.length}
              colors={design.colors}
              linesConfig={design.linesConfig}
              logoUrl={design.logoUrl}
              logoConfig={design.logoConfig}
              courtType={design.courtType}
            />

            {/* Specifications */}
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-lg text-slate-800">Design Specifications</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Grid3X3 className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Court Type</p>
                    <p className="font-semibold text-slate-800">
                      {COURT_TYPE_LABELS[design.courtType]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Ruler className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Dimensions</p>
                    <p className="font-semibold text-slate-800">
                      {design.width}' × {design.length}'
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3fb9ff]/10 flex items-center justify-center">
                    <Grid3X3 className="h-5 w-5 text-[#3fb9ff]" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Tile Packages</p>
                    <p className="font-semibold text-[#3fb9ff]">
                      {Math.ceil(totalTiles / 4).toLocaleString()} packs
                    </p>
                    <p className="text-xs text-slate-400">{totalTiles.toLocaleString()} tiles · 4 per pack</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Package className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Package</p>
                    <p className="font-semibold text-slate-800">
                      DIY Materials
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Colors */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="h-4 w-4 text-slate-500" />
                  <span className="font-medium text-slate-700">Colors</span>
                </div>
                <div className="flex gap-2">
                  {Object.entries(design.colors || {}).map(([key, color]) => (
                    <div key={key} className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
                      <div 
                        className="w-4 h-4 rounded-full border border-slate-200"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs text-slate-600 capitalize">{key}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-slate-500" />
                  <span className="font-medium text-slate-700">Add-ons</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {design.addOns?.lines && (
                    <Badge variant="secondary">Line Package</Badge>
                  )}
                  {design.addOns?.logo && (
                    <Badge variant="secondary">Logo Inlay</Badge>
                  )}
                  {design.addOns?.ramps && (
                    <Badge variant="secondary">Edge Ramps</Badge>
                  )}
                  {!design.addOns?.lines && !design.addOns?.logo && !design.addOns?.ramps && (
                    <span className="text-sm text-slate-400">No add-ons selected</span>
                  )}
                </div>
              </div>
            </Card>

            {/* Price Summary */}
            <Card className="p-6 bg-slate-900 text-white">
              <h3 className="font-bold text-lg mb-4">Estimated Total</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Flooring ({Math.ceil(totalTiles / 4).toLocaleString()} packs × 4 tiles)</span>
                  <span>${materialsTotal.toLocaleString()}</span>
                </div>
                {design.addOns?.lines && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sport Lines</span>
                    <span>+${linesCost}</span>
                  </div>
                )}
                {design.addOns?.logo && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Logo Inlay</span>
                    <span>+${logoCost}</span>
                  </div>
                )}
                {design.addOns?.ramps && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Edge Ramps</span>
                    <span>+${rampsCost}</span>
                  </div>
                )}
                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      Discount ({appliedDiscount.code})
                    </span>
                    <span>−${discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <Separator className="bg-slate-700 my-3" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-[#3fb9ff]">${total.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Quote Request Form */}
          <div className="space-y-4">
            {/* Buy Now CTA */}
            <Card className="p-5 bg-gradient-to-br from-[#3fb9ff] to-[#0ea5e9] border-0 text-white">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="https://media.base44.com/images/public/6961b0a24b02f1762a276fd5/b8ba23fe8_CTCCOURTS.jpg"
                  alt="Coast to Coast Courts"
                  className="h-12 w-12 rounded-lg bg-white p-1 object-contain"
                />
                <div>
                  <h3 className="font-bold text-lg leading-tight">Ready to Order Now?</h3>
                  <p className="text-white/70 text-xs">Coast to Coast Courts</p>
                </div>
              </div>
              <p className="text-white/80 text-sm mb-4">
                Pay securely online with Apple Pay, Google Pay, or card. We'll contact you to confirm colors before shipping.
              </p>
              <div className="p-3 bg-white/10 rounded-lg text-sm mb-4">
                <p className="font-semibold">⚠️ DIY Materials Only — Installation not included.</p>
                <p className="text-white/80 mt-0.5">Tiles snap together fairly quickly with a little help — no tools needed!</p>
              </div>

              {/* Discount Code Input */}
              {appliedDiscount ? (
                <div className="flex items-center justify-between bg-white/20 rounded-lg px-3 py-2 mb-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Tag className="h-4 w-4" />
                    <span>{appliedDiscount.code}</span>
                    <span className="text-white/80 font-normal">
                      — {appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}% off` : `$${appliedDiscount.value} off`}
                    </span>
                  </div>
                  <button onClick={() => setAppliedDiscount(null)} className="text-white/70 hover:text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Discount code"
                    value={discountInput}
                    onChange={(e) => { setDiscountInput(e.target.value.toUpperCase()); setDiscountError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && applyDiscountCode()}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50 h-9"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="shrink-0 h-9 bg-white/20 hover:bg-white/30 text-white border-0"
                    onClick={() => applyDiscountCode()}
                    disabled={!discountInput || discountLoading}
                  >
                    {discountLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Apply'}
                  </Button>
                </div>
              )}
              {discountError && <p className="text-red-200 text-xs mb-2">{discountError}</p>}

              {/* Terms agreement */}
              <label className="flex items-start gap-2.5 cursor-pointer mb-3 bg-white/10 rounded-lg p-3">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded accent-white shrink-0"
                />
                <span className="text-xs text-white/90 leading-relaxed">
                  I agree to the{' '}
                  <a href="/TermsOfService" target="_blank" className="underline font-semibold hover:text-white">Terms of Service</a>
                  {', '}
                  <a href="/PrivacyPolicy" target="_blank" className="underline font-semibold hover:text-white">Privacy Policy</a>
                  {', and '}
                  <a href="/TermsOfService#refunds" target="_blank" className="underline font-semibold hover:text-white">Refund Policy</a>
                  . I understand this is a DIY materials-only purchase and installation is not included.
                </span>
              </label>

              <Button
                className="w-full bg-white text-[#3fb9ff] hover:bg-slate-100 h-12 text-base font-bold gap-2 disabled:opacity-50"
                onClick={handleBuyNow}
                disabled={isCheckingOut || !agreedToTerms}
              >
                {isCheckingOut ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Redirecting...</>
                ) : (
                  <><CreditCard className="h-5 w-5" /> Proceed to Checkout — ${total.toLocaleString()}</>
                )}
              </Button>
              <p className="text-white/70 text-xs text-center mt-2">🔒 Secure checkout · Apple Pay · Google Pay · Card</p>
            </Card>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-sm text-slate-400 font-medium">or get a free quote</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <Card className="p-6 md:p-8">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Request a Free Quote</h3>
              <p className="text-slate-500 mb-6">Fill out the form below and we'll send you a detailed quote within 24-48 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={leadForm.full_name}
                      onChange={(e) => setLeadForm(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="John Smith"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={leadForm.email}
                      onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@example.com"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={leadForm.city}
                      onChange={(e) => setLeadForm(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Miami"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={leadForm.state}
                      onChange={(e) => setLeadForm(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="FL"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Surface Type</Label>
                    <Select
                      value={leadForm.surface_type}
                      onValueChange={(v) => setLeadForm(prev => ({ ...prev, surface_type: v }))}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select surface" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="concrete">Concrete</SelectItem>
                        <SelectItem value="asphalt">Asphalt</SelectItem>
                        <SelectItem value="wood">Wood</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Location</Label>
                    <Select
                      value={leadForm.indoor_outdoor}
                      onValueChange={(v) => setLeadForm(prev => ({ ...prev, indoor_outdoor: v }))}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Indoor/Outdoor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indoor">Indoor</SelectItem>
                        <SelectItem value="outdoor">Outdoor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Label>Timeline</Label>
                    <RadioGroup
                      value={leadForm.timeline}
                      onValueChange={(v) => setLeadForm(prev => ({ ...prev, timeline: v }))}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5"
                    >
                      {[
                        { value: 'asap', label: 'ASAP' },
                        { value: '30_days', label: '30 Days' },
                        { value: '60_days', label: '60 Days' },
                        { value: 'browsing', label: 'Browsing' },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          className={cn(
                            "flex items-center justify-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all border-2 text-sm",
                            leadForm.timeline === opt.value
                              ? "border-[#3fb9ff] bg-[#3fb9ff]/5 text-[#3fb9ff]"
                              : "border-slate-200 hover:border-slate-300"
                          )}
                        >
                          <RadioGroupItem value={opt.value} className="sr-only" />
                          {opt.label}
                        </label>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={leadForm.notes}
                      onChange={(e) => setLeadForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Tell us about your project..."
                      className="mt-1.5 min-h-[100px]"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#3fb9ff] hover:bg-[#0ea5e9] h-12 text-base gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5" />
                      Request Quote
                    </>
                  )}
                </Button>

                <p className="text-xs text-slate-400 text-center">
                  By submitting, you agree to receive communications from Coast to Coast Courts.
                </p>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}