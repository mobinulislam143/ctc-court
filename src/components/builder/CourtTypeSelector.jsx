import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Circle, Square, Maximize2, LayoutGrid, Car, Sparkles } from 'lucide-react';

const COURT_TEMPLATES = [
  {
    category: 'Basketball',
    icon: Circle,
    options: [
      { 
        id: 'basketball_full', 
        name: 'Full Court', 
        desc: 'Regulation size',
        defaultWidth: 50,
        defaultLength: 94,
        popular: true
      },
      { 
        id: 'basketball_half', 
        name: 'Half Court', 
        desc: 'Most popular for driveways',
        defaultWidth: 50,
        defaultLength: 47,
        popular: true
      },
      { 
        id: 'basketball_key', 
        name: 'Key / Training', 
        desc: 'Compact practice zone',
        defaultWidth: 20,
        defaultLength: 25
      },
      { 
        id: 'basketball_custom', 
        name: 'Custom Basketball', 
        desc: 'Your dimensions',
        defaultWidth: 30,
        defaultLength: 35
      },
    ]
  },
  {
    category: 'Pickleball',
    icon: Square,
    options: [
      { 
        id: 'pickleball_single', 
        name: 'Single Court', 
        desc: '20\' x 44\' regulation',
        defaultWidth: 30,
        defaultLength: 60,
        popular: true
      },
      { 
        id: 'pickleball_dual', 
        name: 'Dual Courts', 
        desc: 'Side-by-side setup',
        defaultWidth: 60,
        defaultLength: 64,
      },
      { 
        id: 'pickleball_custom', 
        name: 'Custom Pickleball', 
        desc: 'Your dimensions',
        defaultWidth: 34,
        defaultLength: 64
      },
    ]
  },
  {
    category: 'Multi-Sport',
    icon: LayoutGrid,
    options: [
      { 
        id: 'multi_sport_half_basketball_pickleball', 
        name: 'Half Basketball + Pickleball', 
        desc: 'Half court with dual pickleball courts',
        defaultWidth: 50,
        defaultLength: 84,
        popular: true
      },
      { 
        id: 'multi_sport_full_basketball_pickleball', 
        name: 'Full Basketball + Pickleball', 
        desc: 'Full court with dual pickleball courts',
        defaultWidth: 94,
        defaultLength: 84,
        popular: true
      },
      { 
        id: 'multi_sport_basketball_pickleball', 
        name: 'Custom Multi-Sport', 
        desc: 'Choose your own combination',
        defaultWidth: 50,
        defaultLength: 84
      },
    ]
  },
  {
    category: 'Other',
    icon: LayoutGrid,
    options: [
      { 
        id: 'garage', 
        name: 'Garage Floor', 
        desc: 'No sport lines',
        defaultWidth: 24,
        defaultLength: 24,
        icon: Car
      },
      { 
        id: 'custom', 
        name: 'Custom Build', 
        desc: 'Blank canvas',
        defaultWidth: 30,
        defaultLength: 30,
        icon: Sparkles
      },
    ]
  }
];

export default function CourtTypeSelector({ selected, onChange, className }) {
  return (
    <div className={cn("space-y-6", className)}>
      {COURT_TEMPLATES.map((category) => (
        <div key={category.category}>
          <div className="flex items-center gap-2 mb-3">
            <category.icon className="h-4 w-4 text-[#3fb9ff]" />
            <h4 className="font-semibold text-slate-800">{category.category}</h4>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {category.options.map((court) => {
              const Icon = court.icon || category.icon;
              const isSelected = selected === court.id;
              
              return (
                <Card
                  key={court.id}
                  onClick={() => onChange(court)}
                  className={cn(
                    "p-4 cursor-pointer transition-all border-2 hover:shadow-md",
                    isSelected 
                      ? "border-[#3fb9ff] bg-[#3fb9ff]/5 shadow-md" 
                      : "border-transparent bg-slate-50 hover:bg-white hover:border-slate-200"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        isSelected 
                          ? "bg-[#3fb9ff] text-white" 
                          : "bg-slate-200 text-slate-500"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className={cn(
                          "font-semibold transition-colors",
                          isSelected ? "text-[#3fb9ff]" : "text-slate-800"
                        )}>
                          {court.name}
                        </p>
                        <p className="text-sm text-slate-500">{court.desc}</p>
                      </div>
                    </div>
                    {court.popular && (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                  
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-[#3fb9ff]/20">
                      <p className="text-xs text-slate-500">
                        Default: {court.defaultWidth}' × {court.defaultLength}' ({court.defaultWidth * court.defaultLength} sq ft)
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}