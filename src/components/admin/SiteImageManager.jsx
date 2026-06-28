import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Loader2, Upload } from 'lucide-react';
import { SITE_IMAGE_DEFAULTS } from '@/hooks/useSiteImages';

const SITE_IMAGE_SLOTS = {
  home: [
    { key: 'home_cta_image', label: 'CTA Section Image', page: 'home' },
    { key: 'home_basketball', label: 'Basketball Court Card', page: 'home' },
    { key: 'home_pickleball', label: 'Pickleball Court Card', page: 'home' },
    { key: 'home_multisport', label: 'Multi-Sport Court Card', page: 'home' },
    { key: 'home_garage', label: 'Garage Court Card', page: 'home' },
  ],
  products: [
    { key: 'products_basketball', label: 'Basketball Product Image', page: 'products' },
    { key: 'products_pickleball', label: 'Pickleball Product Image', page: 'products' },
    { key: 'products_multisport', label: 'Multi-Sport Product Image', page: 'products' },
    { key: 'products_garage', label: 'Garage Product Image', page: 'products' },
  ],
  howitworks: [
    { key: 'hiw_step1', label: 'Step 1: Design Your Court', page: 'howitworks' },
    { key: 'hiw_step2', label: 'Step 2: Get Instant Pricing', page: 'howitworks' },
    { key: 'hiw_step3', label: 'Step 3: Order & Ship', page: 'howitworks' },
    { key: 'hiw_step4', label: 'Step 4: Setup & Play', page: 'howitworks' },
  ],
  shop: [
    { key: 'shop_pickleball_starter', label: 'Pickleball Starter Court', page: 'shop' },
    { key: 'shop_basketball_half', label: 'Half Basketball Court', page: 'shop' },
    { key: 'shop_multisport_combo', label: 'Multi-Sport Combo Court', page: 'shop' },
    { key: 'shop_garage_double', label: 'Double Car Garage Floor', page: 'shop' },
  ],
};

export default function SiteImageManager() {
  const queryClient = useQueryClient();
  const [editingSlot, setEditingSlot] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const { data: siteImages = [] } = useQuery({
    queryKey: ['siteImages'],
    queryFn: () => base44.entities.SiteImage.list(),
  });

  const imageMap = {};
  siteImages.forEach(img => { imageMap[img.key] = img; });

  const saveMutation = useMutation({
    mutationFn: async ({ slot, url }) => {
      const existing = imageMap[slot.key];
      if (existing) {
        return base44.entities.SiteImage.update(existing.id, { image_url: url });
      } else {
        return base44.entities.SiteImage.create({ key: slot.key, page: slot.page, label: slot.label, image_url: url });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['siteImages']);
      setEditingSlot(null);
    },
  });

  const openEdit = (slot) => {
    const existing = imageMap[slot.key];
    setImageUrl(existing?.image_url || SITE_IMAGE_DEFAULTS[slot.key] || '');
    setEditingSlot(slot);
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setImageUrl(file_url);
    } finally {
      setUploading(false);
    }
  };

  const renderSlots = (slots) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {slots.map((slot) => {
        const existing = imageMap[slot.key];
        const currentUrl = existing?.image_url || SITE_IMAGE_DEFAULTS[slot.key];
        return (
          <div key={slot.key} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <div className="aspect-video overflow-hidden bg-slate-100">
              {currentUrl && <img src={currentUrl} alt={slot.label} className="w-full h-full object-cover" />}
            </div>
            <div className="p-3 flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-700 truncate">{slot.label}</p>
              <Button size="sm" variant="outline" className="gap-1 shrink-0" onClick={() => openEdit(slot)}>
                <Pencil className="h-3 w-3" />
                Edit
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div>
      <Tabs defaultValue="home">
        <TabsList className="mb-6">
          <TabsTrigger value="home">Home Page</TabsTrigger>
          <TabsTrigger value="products">Products Page</TabsTrigger>
          <TabsTrigger value="howitworks">How It Works</TabsTrigger>
          <TabsTrigger value="shop">Shop</TabsTrigger>
        </TabsList>
        <TabsContent value="home">{renderSlots(SITE_IMAGE_SLOTS.home)}</TabsContent>
        <TabsContent value="products">{renderSlots(SITE_IMAGE_SLOTS.products)}</TabsContent>
        <TabsContent value="howitworks">{renderSlots(SITE_IMAGE_SLOTS.howitworks)}</TabsContent>
        <TabsContent value="shop">{renderSlots(SITE_IMAGE_SLOTS.shop)}</TabsContent>
      </Tabs>

      <Dialog open={!!editingSlot} onOpenChange={() => setEditingSlot(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit: {editingSlot?.label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {imageUrl && (
              <div className="h-48 rounded-xl overflow-hidden bg-slate-100">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <Label>Image URL or Upload</Label>
              <div className="flex gap-2 mt-1.5">
                <Input placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files[0])} />
                  <Button asChild variant="outline" disabled={uploading}>
                    <span>{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}</span>
                  </Button>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingSlot(null)}>Cancel</Button>
              <Button
                onClick={() => saveMutation.mutate({ slot: editingSlot, url: imageUrl })}
                disabled={saveMutation.isPending || !imageUrl}
                className="bg-[#3fb9ff] hover:bg-[#0ea5e9]"
              >
                {saveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Save Image
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}