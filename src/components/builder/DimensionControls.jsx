import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Ruler, AlertCircle, Info, Grid3X3 } from 'lucide-react';

const PRESET_SIZES = {
  basketball_full: [
    { label: 'Regulation', width: 50, length: 94 },
    { label: 'High School', width: 50, length: 84 },
    { label: 'Compact', width: 42, length: 74 },
  ],
  basketball_half: [
    { label: 'Standard', width: 50, length: 47 },
    { label: 'Driveway', width: 30, length: 35 },
    { label: 'Pro Half', width: 50, length: 50 },
  ],
  pickleball_single: [
    { label: 'Regulation + Buffer', width: 30, length: 60 },
    { label: 'Tournament', width: 34, length: 64 },
    { label: 'Compact', width: 24, length: 48 },
  ],
  pickleball_dual: [
    { label: 'Standard Dual', width: 60, length: 64 },
    { label: 'Tournament Dual', width: 68, length: 68 },
  ],
  garage: [
    { label: 'Single Car', width: 12, length: 24 },
    { label: 'Double Car', width: 24, length: 24 },
    { label: 'Triple Car', width: 36, length: 24 },
  ],
};

export default function DimensionControls({ 
  courtType,
  width, 
  length, 
  wasteFactor,
  onWidthChange, 
  onLengthChange,
  onWasteFactorChange,
  className 
}) {
  const presets = PRESET_SIZES[courtType] || [];
  const sqft = width * length;
  const tiles = Math.ceil(sqft);
  const wasteTiles = Math.ceil(tiles * (wasteFactor / 100));

  return (
    <div className={cn("space-y-6", className)}>
      {/* Preset Sizes */}
      {presets.length > 0 && (
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-3 block">
            Recommended Sizes
          </Label>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <Badge
                key={preset.label}
                variant="outline"
                className={cn(
                  "cursor-pointer px-3 py-1.5 text-sm transition-all",
                  width === preset.width && length === preset.length
                    ? "bg-[#3fb9ff] text-white border-[#3fb9ff]"
                    : "hover:bg-slate-100 hover:border-slate-300"
                )}
                onClick={() => {
                  onWidthChange(preset.width);
                  onLengthChange(preset.length);
                }}
              >
                {preset.label} ({preset.width}' × {preset.length}')
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Custom Dimensions */}
      <Card className="p-5 bg-slate-50 border-0">
        <div className="flex items-center gap-2 mb-4">
          <Ruler className="h-4 w-4 text-[#3fb9ff]" />
          <span className="font-semibold text-slate-800">Custom Dimensions</span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-sm text-slate-600">Width (feet)</Label>
            <Input
              type="number"
              min={10}
              max={200}
              value={width}
              onChange={(e) => onWidthChange(Number(e.target.value))}
              className="bg-white border-slate-200"
            />
            <Slider
              value={[width]}
              min={10}
              max={150}
              step={1}
              onValueChange={([v]) => onWidthChange(v)}
              className="py-2"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm text-slate-600">Length (feet)</Label>
            <Input
              type="number"
              min={10}
              max={200}
              value={length}
              onChange={(e) => onLengthChange(Number(e.target.value))}
              className="bg-white border-slate-200"
            />
            <Slider
              value={[length]}
              min={10}
              max={150}
              step={1}
              onValueChange={([v]) => onLengthChange(v)}
              className="py-2"
            />
          </div>
        </div>
      </Card>

      {/* Tile Calculation Info */}
      <Card className="p-4 bg-gradient-to-r from-[#3fb9ff]/10 to-transparent border-[#3fb9ff]/20">
        <div className="flex items-start gap-3">
          <Grid3X3 className="h-5 w-5 text-[#3fb9ff] mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-slate-800">
              {tiles.toLocaleString()} tiles required
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Each tile is exactly 12" × 12" (1 sq ft). Your court covers {sqft.toLocaleString()} sq ft.
            </p>
          </div>
        </div>
      </Card>

      {/* Waste Factor Toggle */}
      <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-medium text-slate-800">Add Spare Tiles?</p>
            <p className="text-sm text-slate-600">
              Recommended +5% for cuts & mistakes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={wasteFactor}
            onChange={(e) => onWasteFactorChange(Number(e.target.value))}
            className="text-sm border border-amber-200 rounded-lg px-3 py-1.5 bg-white"
          >
            <option value={0}>No spares</option>
            <option value={3}>+3% ({Math.ceil(tiles * 0.03)} tiles)</option>
            <option value={5}>+5% ({Math.ceil(tiles * 0.05)} tiles)</option>
            <option value={7}>+7% ({Math.ceil(tiles * 0.07)} tiles)</option>
            <option value={10}>+10% ({Math.ceil(tiles * 0.10)} tiles)</option>
          </select>
        </div>
      </div>

      {/* Warning for fractional inputs */}
      {(width % 1 !== 0 || length % 1 !== 0) && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Tiles are sold in 1 sq ft increments. Dimensions will round to whole tiles.
          </p>
        </div>
      )}
    </div>
  );
}