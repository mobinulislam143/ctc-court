import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { endOfMonth, endOfWeek, format } from 'date-fns';
import { Save, Loader2, Eye } from 'lucide-react';

function getExpiryDate(mode) {
  const now = new Date();
  if (mode === 'end_of_week') return endOfWeek(now, { weekStartsOn: 1 });
  return endOfMonth(now);
}

export default function ShippingBannerManager() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ is_active: true, message: '', expiry_mode: 'end_of_month' });

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['shippingBanner'],
    queryFn: () => base44.entities.ShippingBanner.list(),
  });

  useEffect(() => {
    if (banners.length > 0) setForm(banners[0]);
  }, [banners]);

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (banners.length > 0) return base44.entities.ShippingBanner.update(banners[0].id, data);
      return base44.entities.ShippingBanner.create(data);
    },
    onSuccess: () => queryClient.invalidateQueries(['shippingBanner']),
  });

  const expiryDate = getExpiryDate(form.expiry_mode);
  const expiryLabel = format(expiryDate, 'MMMM d, yyyy');
  const previewMessage = form.message?.trim()
    ? form.message
    : `🇺🇸 FREE Shipping on All U.S. Orders — Valid through ${format(expiryDate, 'MMMM d')}!`;

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Shipping Banner</h3>
        <p className="text-sm text-slate-500">The banner appears at the top of every page. The expiry date updates automatically.</p>
      </div>

      {/* Preview */}
      {form.is_active && (
        <div className="rounded-lg overflow-hidden border border-slate-200">
          <div className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 flex items-center gap-1">
            <Eye className="h-3 w-3" /> Preview
          </div>
          <div className="bg-[#3fb9ff] text-white text-center text-sm font-semibold py-2.5 px-4">
            {previewMessage}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex items-center gap-3">
          <Switch
            checked={form.is_active}
            onCheckedChange={(v) => setForm(f => ({ ...f, is_active: v }))}
          />
          <Label>Banner Active</Label>
        </div>

        <div>
          <Label>Expiry Mode</Label>
          <Select value={form.expiry_mode} onValueChange={(v) => setForm(f => ({ ...f, expiry_mode: v }))}>
            <SelectTrigger className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="end_of_month">End of Month (auto-updates monthly)</SelectItem>
              <SelectItem value="end_of_week">End of Week (auto-updates weekly)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-400 mt-1">Current deadline: <strong>{expiryLabel}</strong></p>
        </div>

        <div className="md:col-span-2">
          <Label>Custom Message (optional)</Label>
          <Input
            placeholder={`Leave blank to use: "${previewMessage}"`}
            value={form.message || ''}
            onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
            className="mt-1.5"
          />
          <p className="text-xs text-slate-400 mt-1">Leave blank to use the auto-generated message above.</p>
        </div>
      </div>

      <Button
        onClick={() => saveMutation.mutate(form)}
        disabled={saveMutation.isPending}
        className="bg-[#3fb9ff] hover:bg-[#0ea5e9]"
      >
        {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
        Save Banner
      </Button>
    </div>
  );
}