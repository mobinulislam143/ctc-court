import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Grid3X3, Ruler, DollarSign, Package, Wrench, Palette, Type, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

const COURT_TYPE_LABELS = {
  basketball_full: 'Full Basketball Court',
  basketball_half: 'Half Basketball Court',
  basketball_key: 'Basketball Key/Training',
  basketball_custom: 'Custom Basketball',
  pickleball_single: 'Single Pickleball Court',
  pickleball_dual: 'Dual Pickleball Courts',
  pickleball_custom: 'Custom Pickleball',
  multi_sport: 'Multi-Sport Court',
  garage: 'Garage Floor',
  custom: 'Custom Build'
};

export default function EstimatorCard({ 
  courtType,
  width,
  length,
  wasteFactor = 0,
  addOns = {},
  pricing,
  className 
}) {
  const sqft = width * length;
  const baseTiles = Math.ceil(sqft);
  const wasteTiles = Math.ceil(baseTiles * (wasteFactor / 100));
  const totalTiles = baseTiles + wasteTiles;

  // Calculate pricing
  const basePrice = pricing?.price_per_sqft_base || 4.75;
  const materialsTotal = totalTiles * basePrice;
  
  // Flat add-on pricing
  const linesCost = addOns.lines ? (pricing?.line_package_flat || 299) : 0;
  const logoCost = addOns.logo ? (pricing?.logo_addon_price || 299) : 0;
  const rampsCost = addOns.ramps ? (pricing?.edge_ramps_flat || 499) : 0;
  
  const total = materialsTotal + linesCost + logoCost + rampsCost;

  return (
    <Card className={cn("bg-white border-0 shadow-xl rounded-2xl overflow-hidden", className)}>
      <div className="bg-gradient-to-r from-[#3fb9ff] to-[#0ea5e9] p-5">
        <h3 className="text-white font-semibold text-lg">Your Estimate</h3>
        <p className="text-white/80 text-sm mt-1">Real-time pricing</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Court Type */}
        <div className="flex items-center justify-between">
          <span className="text-slate-500 text-sm">Court Type</span>
          <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-medium">
            {COURT_TYPE_LABELS[courtType] || 'Select Type'}
          </Badge>
        </div>

        {/* Dimensions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Ruler className="h-4 w-4" />
            Dimensions
          </div>
          <span className="font-semibold text-slate-800">{width}' × {length}'</span>
        </div>

        {/* Square Footage */}
        <div className="flex items-center justify-between">
          <span className="text-slate-500 text-sm">Total Area</span>
          <span className="font-semibold text-slate-800">{sqft.toLocaleString()} sq ft</span>
        </div>

        <Separator />

        {/* Tile Count */}
        <div className="bg-gradient-to-r from-[#3fb9ff]/10 to-transparent p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Grid3X3 className="h-5 w-5 text-[#3fb9ff]" />
            <span className="font-semibold text-slate-800">Tile Calculation</span>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Area (1 tile = 1 sq ft)</span>
              <span className="font-medium">{baseTiles.toLocaleString()} tiles</span>
            </div>
            {wasteFactor > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-500">Spare (+{wasteFactor}%)</span>
                <span className="font-medium text-amber-600">+{wasteTiles} tiles</span>
              </div>
            )}
            <div className="flex justify-between pt-1 border-t border-slate-100">
              <span className="text-slate-700 font-medium">Tile Packages Needed</span>
              <span className="font-bold text-[#3fb9ff]">{Math.ceil(totalTiles / 4).toLocaleString()} packs</span>
            </div>
            <p className="text-xs text-slate-400">Tiles ship in packs of 4 ({totalTiles.toLocaleString()} total tiles)</p>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <DollarSign className="h-4 w-4" />
            Price Breakdown
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <div className="flex items-center gap-2 text-slate-500">
                <Package className="h-3.5 w-3.5" />
                Flooring Material
              </div>
              <span className="font-medium">${materialsTotal.toLocaleString()}</span>
            </div>

            {addOns.lines && (
              <div className="flex justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <Type className="h-3.5 w-3.5" />
                  Sport Lines
                </div>
                <span className="font-medium">+${linesCost}</span>
              </div>
            )}

            {addOns.logo && (
              <div className="flex justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <Image className="h-3.5 w-3.5" />
                  Logo Inlay
                </div>
                <span className="font-medium">+${logoCost}</span>
              </div>
            )}

            {addOns.ramps && (
              <div className="flex justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <Package className="h-3.5 w-3.5" />
                  Edge Ramps
                </div>
                <span className="font-medium">+${rampsCost}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="bg-slate-900 text-white p-4 rounded-xl -mx-1">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wide">Estimated Total</p>
              <p className="text-2xl font-bold mt-0.5">${total.toLocaleString()}</p>
            </div>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
              DIY Materials
            </Badge>
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center">
          Tiles ship in packs of 4 (1 sq ft each). Final pricing confirmed upon quote.
        </p>
      </div>
    </Card>
  );
}