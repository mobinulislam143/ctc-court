import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Loader2, Upload } from 'lucide-react';

const EMPTY_FORM = {
  category: 'basketball',
  image_url: '',
  title: '',
  location: '',
  specs: '',
  sort_order: 0,
  is_active: true,
};

export default function GalleryManager() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['galleryImages'],
    queryFn: () => base44.entities.GalleryImage.list('sort_order'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.GalleryImage.create(data),
    onSuccess: () => { queryClient.invalidateQueries(['galleryImages']); closeDialog(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.GalleryImage.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries(['galleryImages']); closeDialog(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.GalleryImage.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['galleryImages']),
  });

  const openAdd = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({ ...item });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = () => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm(prev => ({ ...prev, image_url: file_url }));
    } finally {
      setUploading(false);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{images.length} images in gallery</p>
        <Button onClick={openAdd} className="bg-[#3fb9ff] hover:bg-[#0ea5e9] gap-2">
          <Plus className="h-4 w-4" />
          Add Image
        </Button>
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p>No gallery images yet. Add your first image above.</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white">
            <div className="aspect-[4/3] overflow-hidden bg-slate-100">
              <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" />
            </div>
            {!img.is_active && (
              <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                <Badge className="bg-red-500 text-white">Hidden</Badge>
              </div>
            )}
            <div className="p-3">
              <p className="font-medium text-sm text-slate-800 truncate">{img.title}</p>
              <p className="text-xs text-slate-500 truncate">{img.location}</p>
              <Badge variant="secondary" className="text-xs mt-1 capitalize">{img.category}</Badge>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon" variant="secondary" className="h-7 w-7 bg-white shadow" onClick={() => openEdit(img)}>
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                size="icon" variant="secondary" className="h-7 w-7 bg-white shadow text-red-500"
                onClick={() => { if (confirm('Delete this image?')) deleteMutation.mutate(img.id); }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Image' : 'Add Gallery Image'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {form.image_url && (
              <div className="h-40 rounded-xl overflow-hidden bg-slate-100">
                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <Label>Image</Label>
              <div className="flex gap-2 mt-1.5">
                <Input
                  placeholder="https://..."
                  value={form.image_url}
                  onChange={(e) => setForm(prev => ({ ...prev, image_url: e.target.value }))}
                />
                <label className="cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files[0])} />
                  <Button asChild variant="outline" disabled={uploading}>
                    <span>{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}</span>
                  </Button>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input className="mt-1.5" value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Backyard Half Court" />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm(prev => ({ ...prev, category: v }))}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="pickleball">Pickleball</SelectItem>
                    <SelectItem value="multisport">Multi-Sport</SelectItem>
                    <SelectItem value="garage">Garage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Location</Label>
                <Input className="mt-1.5" value={form.location} onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))} placeholder="San Diego, CA" />
              </div>
              <div>
                <Label>Specs</Label>
                <Input className="mt-1.5" value={form.specs} onChange={(e) => setForm(prev => ({ ...prev, specs: e.target.value }))} placeholder="47' × 50' • Blue & Navy" />
              </div>
              <div>
                <Label>Sort Order</Label>
                <Input type="number" className="mt-1.5" value={form.sort_order} onChange={(e) => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={!!form.is_active} onCheckedChange={(v) => setForm(prev => ({ ...prev, is_active: v }))} />
                <Label>Show in gallery</Label>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={closeDialog}>Cancel</Button>
              <Button onClick={handleSave} disabled={isPending || !form.image_url || !form.title} className="bg-[#3fb9ff] hover:bg-[#0ea5e9]">
                {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {editingItem ? 'Save Changes' : 'Add Image'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}