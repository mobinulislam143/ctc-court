import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Loader2, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const FIELDS = [
  { key: 'contact_email', label: 'Contact Email', placeholder: 'info@coasttocoastcourts.com', icon: null, type: 'email' },
  { key: 'facebook_url', label: 'Facebook URL', placeholder: 'https://facebook.com/yourpage', icon: Facebook },
  { key: 'instagram_url', label: 'Instagram URL', placeholder: 'https://instagram.com/yourhandle', icon: Instagram },
  { key: 'twitter_url', label: 'Twitter / X URL', placeholder: 'https://x.com/yourhandle', icon: Twitter },
  { key: 'youtube_url', label: 'YouTube URL', placeholder: 'https://youtube.com/@yourchannel', icon: Youtube },
  { key: 'tiktok_url', label: 'TikTok URL', placeholder: 'https://tiktok.com/@yourhandle', icon: null },
];

export default function SiteSettingsManager() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({});

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => base44.entities.SiteSettings.list(),
  });

  useEffect(() => {
    if (settings.length > 0) setForm(settings[0]);
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (settings.length > 0) {
        return base44.entities.SiteSettings.update(settings[0].id, data);
      }
      return base44.entities.SiteSettings.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['siteSettings']);
      alert('Settings saved!');
    },
  });

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>;

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">Site Settings</h3>
      <p className="text-sm text-slate-500 mb-6">Manage your contact email and social media links shown in the site footer.</p>

      <div className="grid md:grid-cols-2 gap-6">
        {FIELDS.map(({ key, label, placeholder, icon: Icon, type }) => (
          <div key={key}>
            <Label className="flex items-center gap-2 mb-1.5">
              {Icon && <Icon className="h-4 w-4 text-slate-400" />}
              {label}
            </Label>
            <Input
              type={type || 'url'}
              placeholder={placeholder}
              value={form[key] || ''}
              onChange={(e) => setForm(prev => ({ ...prev, [key]: e.target.value }))}
            />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button
          onClick={() => saveMutation.mutate(form)}
          disabled={saveMutation.isPending}
          className="bg-[#3fb9ff] hover:bg-[#0ea5e9]"
        >
          {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Settings
        </Button>
      </div>
    </div>
  );
}