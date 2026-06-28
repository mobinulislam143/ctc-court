import React, { useState, useEffect } from 'react';

const STARS = ['★', '★', '★', '★', '★'];

export default function ShippingBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative w-full overflow-hidden" style={{ background: 'linear-gradient(90deg, #B22234 0%, #B22234 33%, #3C3B6E 33%, #3C3B6E 66%, #B22234 66%, #B22234 100%)' }}>
      <div className="relative flex items-center justify-center gap-x-2 gap-y-0.5 py-1.5 md:py-2.5 px-3 text-white text-xs sm:text-sm font-bold text-center flex-wrap">
        <span className="text-yellow-300 tracking-widest hidden sm:inline">★ ★ ★</span>
        <span className="text-yellow-300 font-black text-sm sm:text-base">USA 250th Anniversary Sale</span>
        <span className="bg-white/20 rounded-full px-2.5 py-0.5 text-white font-black text-sm sm:text-base">50% OFF</span>
        <span className="hidden sm:inline">—</span>
        <span className="w-full sm:w-auto">Court tiles now <span className="line-through text-white/60 font-normal">$9.50/sq ft</span> <span className="text-yellow-300">$4.75/sq ft</span> All Summer Long!</span>
        <span className="text-yellow-300 tracking-widest hidden sm:inline">★ ★ ★</span>
      </div>
    </div>
  );
}