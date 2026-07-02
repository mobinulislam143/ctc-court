import React, { useState } from 'react';
import { X, Zap, Loader2, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { renderCourtCanvas } from '@/components/ui/CourtPreview';
import { cn } from '@/lib/utils';

const PROJECT_TYPES = [
  'Residential',
  'Commercial',
  'School / Church',
  'Municipality / Park',
  'Other',
];

const FIELDS = [
  { key: 'name',    label: 'Name',        type: 'text',  required: true,  placeholder: 'Full name' },
  { key: 'email',   label: 'Email',       type: 'email', required: true,  placeholder: 'you@example.com' },
  { key: 'phone',   label: 'Phone Number', type: 'tel',  required: true,  placeholder: '(555) 555-5555' },
  { key: 'address', label: 'Address',     type: 'text',  required: true,  placeholder: 'Street address' },
  { key: 'postal',  label: 'Postal Code', type: 'text',  required: true,  placeholder: 'ZIP / postal code' },
  { key: 'state',   label: 'State',       type: 'text',  required: true,  placeholder: 'State' },
];

export default function InquiryModal({ open, onClose, design, courtType, linesConfig, sqft, estPrice }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', postal: '', state: '', project: '', promo: '',
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid = FIELDS.every(f => !f.required || form[f.key].trim()) && form.project;

  const designSummary = `
Court Design Summary
--------------------
Court type: ${courtType}
Dimensions: ${design.width}' × ${design.length}' (${sqft.toLocaleString()} sq ft)
Tile: ${design.tileType} (${design.surface})
Colors:
  Main court: ${design.colors.main}
  Border / surround: ${design.colors.border}
  Key zone: ${design.colors.accent}
  Lines: ${design.colors.line}${design.sports?.pickleball?.enabled ? `
  Pickleball zone: ${design.colors.pickle || '#4FC3F7'}` : ''}
Hoop: ${design.hoopVariant}${design.bothEnds ? ' (both ends)' : ''}
Estimated price: $${estPrice.toLocaleString()}`.trim();

  const submit = async () => {
    if (!valid) { setError('Please fill in all required fields.'); return; }
    setBusy(true); setError('');

    // 1. Render the 2D design and download it for the user
    try {
      const canvas = document.createElement('canvas');
      await renderCourtCanvas(canvas, {
        width: design.width,
        length: design.length,
        colors: design.colors,
        linesConfig,
        courtType,
        showTileGrid: false,
        logoUrl: design.logos?.[design.activeLogo]?.url,
      });
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `court-design-${design.width}x${design.length}.png`;
      a.click();
    } catch (e) {
      console.error('Design image download failed:', e);
    }

    // 2. Save the lead (non-blocking on failure)
    try {
      await base44.entities.Lead.create({
        full_name: form.name,
        email: form.email,
        phone: form.phone,
        state: form.state,
        zip_code: form.postal,
        notes: `Address: ${form.address}\nProject type: ${form.project}${form.promo ? `\nPromo code: ${form.promo}` : ''}`,
        design_summary: {
          courtType,
          dimensions: `${design.width}' x ${design.length}'`,
          sqft,
          colors: design.colors,
          tileType: design.tileType,
          estimated: estPrice,
        },
        estimated_value: estPrice,
        status: 'new',
      });
    } catch (e) {
      console.error('Lead save failed:', e);
    }

    // 3. Email the design to the customer + notify the company (non-blocking)
    try {
      await base44.integrations.Core.SendEmail({
        to: form.email,
        subject: 'Your Coast to Coast Courts Design',
        body: `Hi ${form.name},

Thanks for designing your court with Coast to Coast Courts! Your 2D design image has been downloaded to your device, and here is a summary of your design:

${designSummary}

Our team will reach out shortly to talk through next steps.

— Coast to Coast Courts
info@coasttocoastcourts.com`,
      });
      await base44.integrations.Core.SendEmail({
        to: 'coasttocoastcourts@gmail.com',
        subject: `New court design inquiry — ${form.name} — $${estPrice.toLocaleString()}`,
        body: `New inquiry from the court designer:

Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
Address: ${form.address}
Postal code: ${form.postal}
State: ${form.state}
Project type: ${form.project}
Promo code: ${form.promo || 'None'}

${designSummary}

Please follow up with this lead.`,
      });
    } catch (e) {
      console.error('Email send failed:', e);
    }

    setBusy(false);
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="font-bold text-gray-800">Get My Court Design</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
            <p className="font-bold text-gray-800">Your design is on its way!</p>
            <p className="text-sm text-gray-600">
              The 2D design image has been downloaded, and a copy of your design details
              was sent to <strong>{form.email}</strong>.
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full bg-[#2472B3] hover:bg-[#1e63a0] text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
            >
              Back to designer
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-3">
            <p className="text-xs text-gray-500">
              Submit your court design to get the ball rolling on your court project.
            </p>

            {FIELDS.map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  {f.label}{f.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={f.type}
                  value={form[f.key]}
                  placeholder={f.placeholder}
                  onChange={e => set(f.key, e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2472B3]"
                />
              </div>
            ))}

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                What kind of project are you considering?<span className="text-red-500">*</span>
              </label>
              <select
                value={form.project}
                onChange={e => set('project', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2472B3]"
              >
                <option value="">Select…</option>
                {PROJECT_TYPES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Promo code (optional)</label>
              <input
                type="text"
                value={form.promo}
                placeholder="Promo code"
                onChange={e => set('promo', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2472B3]"
              />
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed">
              You may unsubscribe from these communications at any time. By clicking submit
              below, you consent to allow Coast to Coast Courts to store and process the
              personal information submitted above to provide you the content requested.
            </p>

            {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

            <button
              onClick={submit}
              disabled={busy}
              className={cn(
                'w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl transition-colors text-sm shadow-md text-white',
                busy ? 'bg-gray-300 cursor-wait' : 'bg-[#E8600A] hover:bg-[#d45508]'
              )}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {busy ? 'Preparing your design…' : 'Get My Court Design'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
