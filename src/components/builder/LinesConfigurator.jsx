import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ColorPicker from '@/components/ui/ColorPicker';
import { cn } from '@/lib/utils';
import { Minus, Circle, Square, Layers } from 'lucide-react';

const LINE_COLORS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Yellow', hex: '#FACC15' },
  { name: 'Gold', hex: '#CA8A04' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Black', hex: '#1F2937' },
  { name: 'Blue', hex: '#2563EB' },
];

export default function LinesConfigurator({ 
  config, 
  courtType,
  onChange,
  className 
}) {
  const isBasketball = courtType?.includes('basketball');
  const isPickleball = courtType?.includes('pickleball');
  const isMultiSport = courtType?.includes('multi_sport');
  const isGarage = courtType === 'garage';
  const isCustom = courtType === 'custom';

  if (isGarage) {
    return (
      <div className={cn("space-y-4", className)}>
        <Card className="p-5 bg-slate-50 border-0 text-center">
          <p className="text-slate-500">
            Garage floors don't require sport lines by default. 
            Need custom markings? Request a quote.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Line Toggles */}
      <div className="space-y-4">
        {(isBasketball || isMultiSport || isCustom) && (
          <Card className={cn(
            "p-4 transition-all border-2",
            config?.basketball 
              ? "border-[#3fb9ff] bg-[#3fb9ff]/5" 
              : "border-transparent bg-slate-50"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  config?.basketball ? "bg-[#3fb9ff] text-white" : "bg-slate-200 text-slate-500"
                )}>
                  <Circle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Basketball Lines</p>
                  <p className="text-sm text-slate-500">3-point arc, key, free throw</p>
                </div>
              </div>
              <Switch
                checked={config?.basketball || false}
                onCheckedChange={(v) => onChange({ ...config, basketball: v })}
              />
            </div>
          </Card>
        )}

        {(isPickleball || isMultiSport || isCustom) && (
          <Card className={cn(
            "p-4 transition-all border-2",
            config?.pickleball 
              ? "border-[#3fb9ff] bg-[#3fb9ff]/5" 
              : "border-transparent bg-slate-50"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  config?.pickleball ? "bg-[#3fb9ff] text-white" : "bg-slate-200 text-slate-500"
                )}>
                  <Square className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Pickleball Lines</p>
                  <p className="text-sm text-slate-500">Kitchen, baseline, sidelines</p>
                </div>
              </div>
              <Switch
                checked={config?.pickleball || false}
                onCheckedChange={(v) => onChange({ ...config, pickleball: v })}
              />
            </div>
          </Card>
        )}

        {isMultiSport && (
          <Card className={cn(
            "p-4 transition-all border-2",
            config?.multiSport 
              ? "border-amber-400 bg-amber-50" 
              : "border-transparent bg-slate-50"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  config?.multiSport ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-500"
                )}>
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Multi-Sport Package</p>
                  <p className="text-sm text-slate-500">Both line sets with distinct colors</p>
                </div>
              </div>
              <Switch
                checked={config?.multiSport || false}
                onCheckedChange={(v) => onChange({ 
                  ...config, 
                  multiSport: v,
                  basketball: v,
                  pickleball: v 
                })}
              />
            </div>
          </Card>
        )}

        {isMultiSport && config?.basketball && (
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-3 block">
              Basketball Orientation
            </Label>
            <RadioGroup
              value={config?.basketballOrientation || 'full'}
              onValueChange={(v) => onChange({ ...config, basketballOrientation: v })}
              className="space-y-2"
            >
              <label className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all border-2",
                config?.basketballOrientation === 'full'
                  ? "border-[#3fb9ff] bg-[#3fb9ff]/5"
                  : "border-slate-200 hover:border-slate-300"
              )}>
                <RadioGroupItem value="full" id="full-bball" />
                <span className="text-sm font-medium">Full Court (End to End)</span>
              </label>
              
              <label className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all border-2",
                config?.basketballOrientation === 'half'
                  ? "border-[#3fb9ff] bg-[#3fb9ff]/5"
                  : "border-slate-200 hover:border-slate-300"
              )}>
                <RadioGroupItem value="half" id="half-bball" />
                <span className="text-sm font-medium">Half Court (Side by Side)</span>
              </label>
            </RadioGroup>
          </div>
        )}
      </div>

      {/* Line Color */}
      {(config?.basketball || config?.pickleball) && (
        <div className="space-y-4">
          <Label className="text-sm font-medium text-slate-700">Line Color</Label>
          
          {!isMultiSport || !config?.multiSport ? (
            <ColorPicker
              label="All Lines"
              value={config?.color || '#FFFFFF'}
              onChange={(c) => onChange({ ...config, color: c })}
              presets={LINE_COLORS}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker
                label="Basketball Lines"
                value={config?.basketballColor || '#FFFFFF'}
                onChange={(c) => onChange({ ...config, basketballColor: c })}
                presets={LINE_COLORS}
              />
              <ColorPicker
                label="Pickleball Lines"
                value={config?.pickleballColor || '#FACC15'}
                onChange={(c) => onChange({ ...config, pickleballColor: c })}
                presets={LINE_COLORS}
              />
            </div>
          )}
        </div>
      )}

      {/* Line Thickness */}
      {(config?.basketball || config?.pickleball) && (
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-3 block">
            Line Thickness
          </Label>
          <RadioGroup
            value={config?.thickness || 'standard'}
            onValueChange={(v) => onChange({ ...config, thickness: v })}
            className="flex gap-4"
          >
            <label className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all border-2",
              config?.thickness === 'standard' || !config?.thickness
                ? "border-[#3fb9ff] bg-[#3fb9ff]/5"
                : "border-slate-200 hover:border-slate-300"
            )}>
              <RadioGroupItem value="standard" id="standard" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-slate-800 rounded-full" />
                <span className="text-sm font-medium">Standard</span>
              </div>
            </label>
            
            <label className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all border-2",
              config?.thickness === 'bold'
                ? "border-[#3fb9ff] bg-[#3fb9ff]/5"
                : "border-slate-200 hover:border-slate-300"
            )}>
              <RadioGroupItem value="bold" id="bold" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-1 bg-slate-800 rounded-full" />
                <span className="text-sm font-medium">Bold</span>
              </div>
            </label>
          </RadioGroup>
        </div>
      )}
    </div>
  );
}