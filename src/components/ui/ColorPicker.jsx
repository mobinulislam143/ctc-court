import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, Pipette } from 'lucide-react';

// 16 COLORS - RAL specified
const PRESET_COLORS = [
  { name: 'Purple', hex: '#844C82' },           // RAL 4008
  { name: 'Blue Green', hex: '#1E5945' },        // RAL 6004
  { name: 'Pink', hex: '#CF3476' },              // RAL 4010
  { name: 'White', hex: '#F6F6F6' },             // RAL 9016
  { name: 'Yellow', hex: '#F9A800' },            // RAL 1023
  { name: 'Light Gray', hex: '#D7D7D7' },        // RAL 7035
  { name: 'Dark Gray', hex: '#4E5452' },         // RAL 7043
  { name: 'Sky Blue', hex: '#007CB0' },          // RAL 5015
  { name: 'Turquoise Green', hex: '#007F5F' },   // RAL 6016
  { name: 'Luminous Green', hex: '#00F700' },    // RAL 6038
  { name: 'Ultramarine Blue', hex: '#00387B' },  // RAL 5002
  { name: 'Chocolate Brown', hex: '#2F1B0C' },   // RAL 8017
  { name: 'Pure Red', hex: '#CC0605' },          // RAL 3028
  { name: 'Deep Orange', hex: '#EC7C26' },       // RAL 2011
  { name: 'Brown Red', hex: '#7B1F1F' },         // RAL 3011
  { name: 'Black', hex: '#000000' },
];

export default function ColorPicker({ 
  label, 
  value, 
  onChange, 
  presets = PRESET_COLORS,
  className 
}) {

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium text-slate-700">{label}</Label>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-3 h-11 border-slate-200 hover:border-slate-300"
          >
            <div 
              className="w-6 h-6 rounded-md border border-slate-200 shadow-inner"
              style={{ backgroundColor: value }}
            />
            <span className="text-slate-600 flex-1 text-left">{value?.toUpperCase()}</span>
            <Pipette className="h-4 w-4 text-slate-400" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-72 p-4" align="start">
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {presets.map((color) => (
                <button
                  key={color.hex}
                  className={cn(
                    "w-full aspect-square rounded-lg border-2 transition-all hover:scale-105",
                    value === color.hex 
                      ? "border-slate-900 ring-2 ring-slate-900/20" 
                      : "border-transparent hover:border-slate-300"
                  )}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => onChange(color.hex)}
                  title={color.name}
                >
                  {value === color.hex && (
                    <Check className={cn(
                      "h-4 w-4 mx-auto",
                      ['#F8FAFC', '#D4A574', '#CA8A04'].includes(color.hex) 
                        ? "text-slate-800" 
                        : "text-white"
                    )} />
                  )}
                </button>
              ))}
            </div>


          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}