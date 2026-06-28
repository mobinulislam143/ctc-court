import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Package, Wrench, Truck, FileText, Check, Sparkles, Image, Minus } from 'lucide-react';

export default function PackageSelector({ 
  packageType,
  addOns,
  sqft,
  pricing,
  onPackageChange,
  onAddOnsChange,
  className 
}) {
  const edgePerimeter = Math.sqrt(sqft) * 4; // Rough estimate

  const packages = [
    {
      id: 'materials_only',
      name: 'Complete Court Kit',
      desc: 'Everything you need to build it yourself',
      icon: Package,
      features: [
        'Premium interlocking tiles',
        'Easy snap-together design',
        'Digital layout guide',
        'Step-by-step installation manual',
        'Phone & email support',
        'Can be installed in 45 min to a few hours',
      ],
      badge: 'DIY Friendly',
      badgeColor: 'bg-[#3fb9ff]',
    },
  ];

  const addOnOptions = [
    {
      id: 'lines',
      name: 'Line Package',
      desc: 'Professional court lines',
      icon: Minus,
      price: pricing?.line_package_flat || 299,
    },
    {
      id: 'logo',
      name: 'Logo Inlay',
      desc: 'Custom logo on court',
      icon: Image,
      price: pricing?.logo_addon_price || 299,
    },
    {
      id: 'ramps',
      name: 'Edge Ramps',
      desc: 'Smooth transition edges (included)',
      icon: Sparkles,
      price: pricing?.edge_ramps_flat || 499,
    },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Package Info */}
      <div className="grid grid-cols-1 gap-4">
        {packages.map((pkg) => {
          const Icon = pkg.icon;
          return (
            <Card
              key={pkg.id}
              className="p-6 bg-gradient-to-br from-[#3fb9ff]/5 to-transparent border-2 border-[#3fb9ff]"
            >
              <Badge className="bg-[#3fb9ff] text-white text-xs mb-4">
                {pkg.badge}
              </Badge>
              
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-[#3fb9ff] text-white">
                  <Icon className="h-7 w-7" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-xl text-[#3fb9ff] mb-1">
                    {pkg.name}
                  </p>
                  <p className="text-sm text-slate-600 mb-4">{pkg.desc}</p>
                  
                  <ul className="space-y-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <Check className="h-4 w-4 shrink-0 text-[#3fb9ff]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Separator />

      {/* Add-Ons */}
      <div>
        <h4 className="font-semibold text-slate-800 mb-4">Add-Ons</h4>
        <div className="space-y-3">
          {addOnOptions.map((addon) => {
            const isEnabled = addOns?.[addon.id];
            return (
              <Card
                key={addon.id}
                className={cn(
                  "p-4 transition-all border-2",
                  isEnabled 
                    ? "border-[#3fb9ff]/50 bg-[#3fb9ff]/5" 
                    : "border-transparent bg-slate-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      isEnabled ? "bg-[#3fb9ff] text-white" : "bg-slate-200 text-slate-500"
                    )}>
                      <addon.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{addon.name}</p>
                      <p className="text-sm text-slate-500">{addon.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "font-semibold",
                      isEnabled ? "text-[#3fb9ff]" : "text-slate-600"
                    )}>
                      +${addon.price}
                    </span>
                    <Switch
                      checked={isEnabled || false}
                      onCheckedChange={(v) => onAddOnsChange({ ...addOns, [addon.id]: v })}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}