import React from 'react';

export default function TruliVerifiedBadge({ size = 'md' }) {
  const sizes = {
    sm: { img: 'h-8 w-8', text: 'text-xs', wrapper: 'gap-1.5 px-3 py-1.5' },
    md: { img: 'h-10 w-10', text: 'text-sm', wrapper: 'gap-2 px-4 py-2' },
    lg: { img: 'h-14 w-14', text: 'text-base', wrapper: 'gap-3 px-5 py-3' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className={`inline-flex items-center ${s.wrapper} bg-white border border-green-200 rounded-full shadow-sm`}>
      <img
        src="https://media.base44.com/images/public/6961b0a24b02f1762a276fd5/fb3d320ba_B1836990-E1D5-414B-9EC1-1958D0D7D413.png"
        alt="Truli Verified"
        className={`${s.img} object-contain`}
      />
      <div className="flex flex-col leading-tight">
        <span className={`font-bold text-green-700 ${s.text}`}>Truli Verified</span>
        <span className="text-green-600 text-xs">Trusted & Certified Business</span>
      </div>
    </div>
  );
}