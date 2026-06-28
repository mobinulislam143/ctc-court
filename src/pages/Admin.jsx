import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Users, FileText, Settings, DollarSign, Eye, 
  Loader2, Save, ArrowLeft, Grid3X3, Phone, Mail,
  Calendar, MapPin, CheckCircle, XCircle, Clock, Images, Layout, Tag, Megaphone, Globe
} from 'lucide-react';
import GalleryManager from '@/components/admin/GalleryManager';
import SiteImageManager from '@/components/admin/SiteImageManager';
import DiscountManager from '@/components/admin/DiscountManager';
import ShippingBannerManager from '@/components/admin/ShippingBannerManager';
import SiteSettingsManager from '@/components/admin/SiteSettingsManager';

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  quote_sent: 'bg-purple-100 text-purple-800',
  won: 'bg-emerald-100 text-emerald-800',
  lost: 'bg-red-100 text-red-800',
};

const STATUS_ICONS = {
  new: Clock,
  contacted: Phone,
  quote_sent: FileText,
  won: CheckCircle,
  lost: XCircle,
};

export default function Admin() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const queryClient = useQueryClient();
  const [selectedLead, setSelectedLead] = useState(null);
  const [pricingForm, setPricingForm] = useState(null);

  // Fetch leads
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date'),
  });

  // Fetch designs
  const { data: designs = [], isLoading: designsLoading } = useQuery({
    queryKey: ['designs'],
    queryFn: () => base44.entities.CourtDesign.list('-created_date'),
  });

  // Fetch pricing config
  const { data: pricingConfigs = [], isLoading: pricingLoading } = useQuery({
    queryKey: ['pricing'],
    queryFn: () => base44.entities.PricingConfig.list(),
  });

  // Update lead status
  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Lead.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['leads']),
  });

  // Delete lead
  const deleteLeadMutation = useMutation({
    mutationFn: (id) => base44.entities.Lead.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['leads']);
      alert('Lead deleted successfully');
    },
  });

  // Save pricing
  const savePricingMutation = useMutation({
    mutationFn: (data) => {
      if (pricingConfigs.length > 0) {
        return base44.entities.PricingConfig.update(pricingConfigs[0].id, data);
      } else {
        return base44.entities.PricingConfig.create({ ...data, name: 'default', is_active: true });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['pricing']);
      alert('Pricing saved successfully!');
    },
  });

  React.useEffect(() => {
    if (pricingConfigs.length > 0) {
      setPricingForm(pricingConfigs[0]);
    } else {
      setPricingForm({
        price_per_sqft_base: 4.75,
        line_price_basketball_per_sqft: 0.35,
        line_price_pickleball_per_sqft: 0.30,
        line_price_multisport_per_sqft: 0.45,
        logo_small: 450,
        logo_medium: 750,
        logo_large: 1200,
        two_tone_per_sqft: 0.25,
        installation_per_sqft: 5.00,
      });
    }
  }, [pricingConfigs]);

  const totalLeadValue = leads.reduce((sum, lead) => sum + (lead.estimated_value || 0), 0);
  const newLeadsCount = leads.filter(l => l.status === 'new').length;
  const wonLeadsCount = leads.filter(l => l.status === 'won').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('Home')} className="flex items-center gap-2 text-slate-500 hover:text-slate-700">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Site</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6961b0a24b02f1762a276fd5/a8c19e1c9_Untitleddesign4.png" 
                  alt="Coast to Coast Courts"
                  className="h-8 w-8"
                />
                <span className="font-bold text-slate-800">Admin Dashboard</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Leads</p>
                <p className="text-2xl font-bold text-slate-800">{leads.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">New Leads</p>
                <p className="text-2xl font-bold text-slate-800">{newLeadsCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Won</p>
                <p className="text-2xl font-bold text-slate-800">{wonLeadsCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3fb9ff]/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-[#3fb9ff]" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Pipeline Value</p>
                <p className="text-2xl font-bold text-slate-800">${totalLeadValue.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList>
            <TabsTrigger value="leads" className="gap-2">
              <Users className="h-4 w-4" />
              Leads
            </TabsTrigger>
            <TabsTrigger value="designs" className="gap-2">
              <Grid3X3 className="h-4 w-4" />
              Designs
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2">
              <Settings className="h-4 w-4" />
              Pricing
            </TabsTrigger>
            <TabsTrigger value="gallery" className="gap-2">
              <Images className="h-4 w-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="siteimages" className="gap-2">
              <Layout className="h-4 w-4" />
              Site Images
            </TabsTrigger>
            <TabsTrigger value="discounts" className="gap-2">
              <Tag className="h-4 w-4" />
              Discounts
            </TabsTrigger>
            <TabsTrigger value="banner" className="gap-2">
              <Megaphone className="h-4 w-4" />
              Banner
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Globe className="h-4 w-4" />
              Site Settings
            </TabsTrigger>
          </TabsList>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leadsLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
                      </TableCell>
                    </TableRow>
                  ) : leads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                        No leads yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    leads.map((lead) => {
                      const StatusIcon = STATUS_ICONS[lead.status] || Clock;
                      return (
                        <TableRow key={lead.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-slate-800">{lead.full_name}</p>
                              <p className="text-xs text-slate-400">
                                {lead.created_date && format(new Date(lead.created_date), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <Mail className="h-3 w-3" />
                                {lead.email}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-slate-600">
                                <Phone className="h-3 w-3" />
                                {lead.phone}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <MapPin className="h-3 w-3" />
                              {lead.city}, {lead.state}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="text-xs">
                              {lead.timeline?.replace('_', ' ') || 'Not specified'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-slate-800">
                              ${(lead.estimated_value || 0).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={lead.status}
                              onValueChange={(v) => updateLeadMutation.mutate({ id: lead.id, data: { status: v } })}
                            >
                              <SelectTrigger className="w-32">
                                <Badge className={`${STATUS_COLORS[lead.status]} border-0 gap-1`}>
                                  <StatusIcon className="h-3 w-3" />
                                  {lead.status?.replace('_', ' ')}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.keys(STATUS_COLORS).map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status.replace('_', ' ')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedLead(lead)}>
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Lead Details: {lead.full_name}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-slate-500">Email</Label>
                                      <p>{lead.email}</p>
                                    </div>
                                    <div>
                                      <Label className="text-slate-500">Phone</Label>
                                      <p>{lead.phone}</p>
                                    </div>
                                    <div>
                                      <Label className="text-slate-500">Location</Label>
                                      <p>{lead.city}, {lead.state}</p>
                                    </div>
                                    <div>
                                      <Label className="text-slate-500">Surface Type</Label>
                                      <p>{lead.surface_type || 'Not specified'}</p>
                                    </div>
                                    <div>
                                      <Label className="text-slate-500">Indoor/Outdoor</Label>
                                      <p>{lead.indoor_outdoor || 'Not specified'}</p>
                                    </div>
                                    <div>
                                      <Label className="text-slate-500">Timeline</Label>
                                      <p>{lead.timeline?.replace('_', ' ') || 'Not specified'}</p>
                                    </div>
                                  </div>
                                  {lead.notes && (
                                    <div>
                                      <Label className="text-slate-500">Notes</Label>
                                      <p className="mt-1 p-3 bg-slate-50 rounded-lg text-sm">{lead.notes}</p>
                                    </div>
                                  )}
                                  {lead.design_summary && (
                                    <div>
                                      <Label className="text-slate-500">Design Summary</Label>
                                      <div className="mt-1 p-3 bg-slate-50 rounded-lg text-sm space-y-1">
                                        <p><strong>Type:</strong> {lead.design_summary.courtType}</p>
                                        <p><strong>Size:</strong> {lead.design_summary.dimensions}</p>
                                        <p><strong>Tiles:</strong> {lead.design_summary.tiles}</p>
                                        <p><strong>Package:</strong> {lead.design_summary.packageType}</p>
                                        <p><strong>Estimate:</strong> ${lead.design_summary.total?.toLocaleString()}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                if (confirm(`Delete lead for ${lead.full_name}?`)) {
                                  deleteLeadMutation.mutate(lead.id);
                                }
                              }}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Designs Tab */}
          <TabsContent value="designs">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Court Type</TableHead>
                    <TableHead>Dimensions</TableHead>
                    <TableHead>Tiles</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Estimate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {designsLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
                      </TableCell>
                    </TableRow>
                  ) : designs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                        No designs yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    designs.map((design) => (
                      <TableRow key={design.id}>
                        <TableCell className="font-medium">{design.court_type?.replace(/_/g, ' ')}</TableCell>
                        <TableCell>{design.width_ft}' × {design.length_ft}'</TableCell>
                        <TableCell>{design.tile_count?.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {design.package_type === 'full_installation' ? 'Installed' : 'DIY'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">${design.estimated_price?.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{design.status}</Badge>
                        </TableCell>
                        <TableCell className="text-slate-500">
                          {design.created_date && format(new Date(design.created_date), 'MMM d, yyyy')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing">
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Pricing Configuration</h3>
              
              {pricingForm && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Base Tile Price per Sq Ft ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={pricingForm.price_per_sqft_base || ''}
                      onChange={(e) => setPricingForm(prev => ({ ...prev, price_per_sqft_base: parseFloat(e.target.value) }))}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Two-Tone Layout per Sq Ft ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={pricingForm.two_tone_per_sqft || ''}
                      onChange={(e) => setPricingForm(prev => ({ ...prev, two_tone_per_sqft: parseFloat(e.target.value) }))}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Basketball Lines per Sq Ft ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={pricingForm.line_price_basketball_per_sqft || ''}
                      onChange={(e) => setPricingForm(prev => ({ ...prev, line_price_basketball_per_sqft: parseFloat(e.target.value) }))}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Pickleball Lines per Sq Ft ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={pricingForm.line_price_pickleball_per_sqft || ''}
                      onChange={(e) => setPricingForm(prev => ({ ...prev, line_price_pickleball_per_sqft: parseFloat(e.target.value) }))}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Multi-Sport Lines per Sq Ft ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={pricingForm.line_price_multisport_per_sqft || ''}
                      onChange={(e) => setPricingForm(prev => ({ ...prev, line_price_multisport_per_sqft: parseFloat(e.target.value) }))}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Small Logo ($)</Label>
                    <Input
                      type="number"
                      value={pricingForm.logo_small || ''}
                      onChange={(e) => setPricingForm(prev => ({ ...prev, logo_small: parseFloat(e.target.value) }))}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Medium Logo ($)</Label>
                    <Input
                      type="number"
                      value={pricingForm.logo_medium || ''}
                      onChange={(e) => setPricingForm(prev => ({ ...prev, logo_medium: parseFloat(e.target.value) }))}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Large Logo ($)</Label>
                    <Input
                      type="number"
                      value={pricingForm.logo_large || ''}
                      onChange={(e) => setPricingForm(prev => ({ ...prev, logo_large: parseFloat(e.target.value) }))}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Installation per Sq Ft ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={pricingForm.installation_per_sqft || ''}
                      onChange={(e) => setPricingForm(prev => ({ ...prev, installation_per_sqft: parseFloat(e.target.value) }))}
                      className="mt-1.5"
                    />
                  </div>
                </div>
              )}

              <div className="mt-8">
                <Button 
                  onClick={() => savePricingMutation.mutate(pricingForm)}
                  disabled={savePricingMutation.isPending}
                  className="bg-[#3fb9ff] hover:bg-[#0ea5e9]"
                >
                  {savePricingMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Pricing
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="gallery">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Gallery Images</h3>
              <GalleryManager />
            </div>
          </TabsContent>

          <TabsContent value="siteimages">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Site Images</h3>
              <p className="text-sm text-slate-500 mb-6">Update photos shown on the Home, Products, and How It Works pages.</p>
              <SiteImageManager />
            </div>
          </TabsContent>

          <TabsContent value="discounts">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <DiscountManager />
            </div>
          </TabsContent>

          <TabsContent value="banner">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <ShippingBannerManager />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <SiteSettingsManager />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}