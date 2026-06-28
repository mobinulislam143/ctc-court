import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Copy, Check, Trash2, Pencil, Loader2 } from 'lucide-react';

const DEFAULT_FORM = {
  code: '',
  description: '',
  discount_type: 'percentage',
  discount_value: 10,
  is_active: true,
};

export default function DiscountManager() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState(null); // holds the code being edited
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const { data: codes = [], isLoading } = useQuery({
    queryKey: ['discountCodes'],
    queryFn: () => base44.entities.DiscountCode.list('-created_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.DiscountCode.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['discountCodes']);
      setForm(DEFAULT_FORM);
      setDialogOpen(false);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }) => base44.entities.DiscountCode.update(id, { is_active }),
    onSuccess: () => queryClient.invalidateQueries(['discountCodes']),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.DiscountCode.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['discountCodes']),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.DiscountCode.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['discountCodes']);
      setEditDialogOpen(false);
      setEditingCode(null);
    },
  });

  const openEdit = (c) => {
    setEditingCode({ ...c });
    setEditDialogOpen(true);
  };

  const getShareableLink = (code) => {
    return `https://ctccourts.com/Builder?discount=${encodeURIComponent(code)}`;
  };

  const copyLink = (code, id) => {
    navigator.clipboard.writeText(getShareableLink(code));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = () => {
    createMutation.mutate({
      ...form,
      code: form.code.toUpperCase().trim(),
      times_used: 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Discount Codes</h3>
          <p className="text-sm text-slate-500 mt-0.5">Create codes and share links that auto-apply the discount</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#3fb9ff] hover:bg-[#0ea5e9] gap-2">
              <Plus className="h-4 w-4" />
              New Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Discount Code</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Code *</Label>
                <Input
                  className="mt-1.5 uppercase"
                  placeholder="e.g. SUMMER20"
                  value={form.code}
                  onChange={(e) => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                />
              </div>
              <div>
                <Label>Description (internal)</Label>
                <Input
                  className="mt-1.5"
                  placeholder="e.g. Summer promotion"
                  value={form.description}
                  onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Discount Type</Label>
                  <Select
                    value={form.discount_type}
                    onValueChange={(v) => setForm(p => ({ ...p, discount_type: v }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>
                    {form.discount_type === 'percentage' ? 'Percent Off' : 'Dollars Off'}
                  </Label>
                  <Input
                    type="number"
                    className="mt-1.5"
                    placeholder={form.discount_type === 'percentage' ? '10' : '100'}
                    value={form.discount_value}
                    onChange={(e) => setForm(p => ({ ...p, discount_value: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                <strong>Preview:</strong> Code <span className="font-mono font-bold">{form.code || 'CODE'}</span> gives{' '}
                {form.discount_type === 'percentage'
                  ? `${form.discount_value}% off`
                  : `$${form.discount_value} off`}
              </div>
              <Button
                className="w-full bg-[#3fb9ff] hover:bg-[#0ea5e9]"
                onClick={handleCreate}
                disabled={!form.code || !form.discount_value || createMutation.isPending}
              >
                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Code
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Discount Code</DialogTitle>
          </DialogHeader>
          {editingCode && (
            <div className="space-y-4 pt-2">
              <div>
                <Label>Code</Label>
                <Input
                  className="mt-1.5 uppercase font-mono"
                  value={editingCode.code}
                  onChange={(e) => setEditingCode(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                />
              </div>
              <div>
                <Label>Description (internal)</Label>
                <Input
                  className="mt-1.5"
                  placeholder="e.g. Summer promotion"
                  value={editingCode.description || ''}
                  onChange={(e) => setEditingCode(p => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Discount Type</Label>
                  <Select
                    value={editingCode.discount_type}
                    onValueChange={(v) => setEditingCode(p => ({ ...p, discount_type: v }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{editingCode.discount_type === 'percentage' ? 'Percent Off' : 'Dollars Off'}</Label>
                  <Input
                    type="number"
                    className="mt-1.5"
                    value={editingCode.discount_value}
                    onChange={(e) => setEditingCode(p => ({ ...p, discount_value: parseFloat(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                <strong>Preview:</strong> Code <span className="font-mono font-bold">{editingCode.code}</span> gives{' '}
                {editingCode.discount_type === 'percentage' ? `${editingCode.discount_value}% off` : `$${editingCode.discount_value} off`}
              </div>
              <Button
                className="w-full bg-[#3fb9ff] hover:bg-[#0ea5e9]"
                onClick={() => updateMutation.mutate({ id: editingCode.id, data: editingCode })}
                disabled={!editingCode.code || !editingCode.discount_value || updateMutation.isPending}
              >
                {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
        ) : codes.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No discount codes yet. Create one above.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Used</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Shareable Link</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <span className="font-mono font-bold text-slate-800">{c.code}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={c.discount_type === 'percentage' ? 'bg-emerald-100 text-emerald-800 border-0' : 'bg-amber-100 text-amber-800 border-0'}>
                      {c.discount_type === 'percentage' ? `${c.discount_value}% off` : `$${c.discount_value} off`}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm">{c.description || '—'}</TableCell>
                  <TableCell className="text-slate-500">{c.times_used || 0}×</TableCell>
                  <TableCell>
                    <Switch
                      checked={c.is_active}
                      onCheckedChange={(val) => toggleMutation.mutate({ id: c.id, is_active: val })}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs"
                      onClick={() => copyLink(c.code, c.id)}
                    >
                      {copiedId === c.id ? (
                        <><Check className="h-3 w-3 text-emerald-500" /> Copied!</>
                      ) : (
                        <><Copy className="h-3 w-3" /> Copy Link</>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-500 hover:text-slate-700"
                        onClick={() => openEdit(c)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => { if (confirm(`Delete code ${c.code}?`)) deleteMutation.mutate(c.id); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}