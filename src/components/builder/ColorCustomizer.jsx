import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ColorPicker from '@/components/ui/ColorPicker';
import { cn } from '@/lib/utils';
import { Palette, Sun, Building2, Car, Sparkles } from 'lucide-react';

// 16 COLORS - RAL specified
const AVAILABLE_COLORS = {
  'Purple': '#844C82',           // RAL 4008
  'Blue Green': '#1E5945',       // RAL 6004
  'Pink': '#CF3476',             // RAL 4010
  'White': '#F6F6F6',            // RAL 9016
  'Yellow': '#F9A800',           // RAL 1023
  'Light Gray': '#D7D7D7',       // RAL 7035
  'Dark Gray': '#4E5452',        // RAL 7043
  'Sky Blue': '#007CB0',         // RAL 5015
  'Turquoise Green': '#007F5F',  // RAL 6016
  'Luminous Green': '#00F700',   // RAL 6038
  'Ultramarine Blue': '#00387B', // RAL 5002
  'Chocolate Brown': '#2F1B0C',  // RAL 8017
  'Pure Red': '#CC0605',         // RAL 3028
  'Deep Orange': '#EC7C26',      // RAL 2011
  'Brown Red': '#7B1F1F',        // RAL 3011
  'Black': '#000000',
};

const COLOR_PALETTES = {
  outdoor: [
    { name: 'Coastal Blue', main: AVAILABLE_COLORS['Sky Blue'], border: AVAILABLE_COLORS['Dark Gray'], accent: AVAILABLE_COLORS['Ultramarine Blue'], line: AVAILABLE_COLORS['White'] },
    { name: 'Classic Court', main: AVAILABLE_COLORS['Ultramarine Blue'], border: AVAILABLE_COLORS['Black'], accent: AVAILABLE_COLORS['Pure Red'], line: AVAILABLE_COLORS['White'] },
    { name: 'Forest Green', main: AVAILABLE_COLORS['Turquoise Green'], border: AVAILABLE_COLORS['Dark Gray'], accent: AVAILABLE_COLORS['Luminous Green'], line: AVAILABLE_COLORS['White'] },
    { name: 'Sunset Orange', main: AVAILABLE_COLORS['Deep Orange'], border: AVAILABLE_COLORS['Brown Red'], accent: AVAILABLE_COLORS['Yellow'], line: AVAILABLE_COLORS['White'] },
  ],
  indoor: [
    { name: 'Pro Arena', main: AVAILABLE_COLORS['Dark Gray'], border: AVAILABLE_COLORS['Black'], accent: AVAILABLE_COLORS['Pure Red'], line: AVAILABLE_COLORS['White'] },
    { name: 'Bold Pink', main: AVAILABLE_COLORS['Pink'], border: AVAILABLE_COLORS['Black'], accent: AVAILABLE_COLORS['Deep Orange'], line: AVAILABLE_COLORS['White'] },
    { name: 'Championship Yellow', main: AVAILABLE_COLORS['Yellow'], border: AVAILABLE_COLORS['Black'], accent: AVAILABLE_COLORS['Ultramarine Blue'], line: AVAILABLE_COLORS['White'] },
    { name: 'Modern Blue', main: AVAILABLE_COLORS['Ultramarine Blue'], border: AVAILABLE_COLORS['Dark Gray'], accent: AVAILABLE_COLORS['Sky Blue'], line: AVAILABLE_COLORS['White'] },
  ],
  garage: [
    { name: 'Graphite', main: AVAILABLE_COLORS['Dark Gray'], border: AVAILABLE_COLORS['Black'], accent: AVAILABLE_COLORS['Pure Red'], line: AVAILABLE_COLORS['White'] },
    { name: 'Checkered', main: AVAILABLE_COLORS['Black'], border: AVAILABLE_COLORS['Pure Red'], accent: AVAILABLE_COLORS['Dark Gray'], line: AVAILABLE_COLORS['White'] },
    { name: 'Industrial', main: AVAILABLE_COLORS['Light Gray'], border: AVAILABLE_COLORS['Black'], accent: AVAILABLE_COLORS['Deep Orange'], line: AVAILABLE_COLORS['White'] },
    { name: 'Vibrant Yellow', main: AVAILABLE_COLORS['Yellow'], border: AVAILABLE_COLORS['Dark Gray'], accent: AVAILABLE_COLORS['Sky Blue'], line: AVAILABLE_COLORS['Black'] },
  ],
};

export default function ColorCustomizer({ 
  colors, 
  environment,
  courtType,
  onChange,
  onEnvironmentChange,
  className 
}) {
  const palettes = COLOR_PALETTES[environment] || COLOR_PALETTES.outdoor;
  const isPickleball = courtType?.includes('pickleball');

  const applyPalette = (palette) => {
    onChange({
      main: palette.main,
      border: palette.border,
      accent: palette.accent,
      line: palette.line,
      kitchen: palette.accent,
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Environment Selector */}
      <div>
        <Label className="text-sm font-medium text-slate-700 mb-3 block">
          Court Environment
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'outdoor', label: 'Outdoor', icon: Sun, desc: 'Bright, UV-ready' },
            { id: 'indoor', label: 'Indoor', icon: Building2, desc: 'Gym vibe' },
            { id: 'garage', label: 'Garage', icon: Car, desc: 'Industrial' },
          ].map((env) => (
            <Card
              key={env.id}
              onClick={() => onEnvironmentChange(env.id)}
              className={cn(
                "p-4 cursor-pointer transition-all border-2 text-center",
                environment === env.id
                  ? "border-[#3fb9ff] bg-[#3fb9ff]/5"
                  : "border-transparent bg-slate-50 hover:bg-white hover:border-slate-200"
              )}
            >
              <env.icon className={cn(
                "h-6 w-6 mx-auto mb-2",
                environment === env.id ? "text-[#3fb9ff]" : "text-slate-400"
              )} />
              <p className={cn(
                "font-medium text-sm",
                environment === env.id ? "text-[#3fb9ff]" : "text-slate-700"
              )}>{env.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{env.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Preset Palettes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium text-slate-700">Quick Palettes</Label>
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            Curated
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {palettes.map((palette) => (
            <Card
              key={palette.name}
              onClick={() => applyPalette(palette)}
              className="p-3 cursor-pointer hover:shadow-md transition-all border-2 border-transparent hover:border-slate-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="flex -space-x-1">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: palette.main }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: palette.border }}
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: palette.accent }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-700">{palette.name}</span>
              </div>
              <div 
                className="h-2 rounded-full overflow-hidden flex"
              >
                <div className="flex-1" style={{ backgroundColor: palette.main }} />
                <div className="w-4" style={{ backgroundColor: palette.border }} />
                <div className="w-4" style={{ backgroundColor: palette.accent }} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Individual Color Pickers */}
      <Card className="p-5 bg-slate-50 border-0">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-4 w-4 text-[#3fb9ff]" />
          <span className="font-semibold text-slate-800">Custom Colors</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ColorPicker
            label="Main Court"
            value={colors?.main || '#3FB9FF'}
            onChange={(c) => onChange({ ...colors, main: c })}
          />
          <ColorPicker
            label="Border"
            value={colors?.border || '#1E3A5F'}
            onChange={(c) => onChange({ ...colors, border: c })}
          />
          <ColorPicker
            label={isPickleball ? "Kitchen Zone" : "Key / Accent"}
            value={colors?.accent || '#0EA5E9'}
            onChange={(c) => onChange({ ...colors, accent: c, kitchen: c })}
          />
          <ColorPicker
            label="Line Color"
            value={colors?.line || '#FFFFFF'}
            onChange={(c) => onChange({ ...colors, line: c })}
          />
        </div>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 text-center italic">
        Digital previews are for visualization. Tile colors may vary slightly due to screen settings and manufacturing batches.
      </p>
    </div>
  );
}