import React from 'react';

export default function FluxLogo({ size = 40 }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/693506eded66481533c78097/2a12244f9_image.png"
        alt="FLUX PREMIUM"
        style={{ width: size, height: size }}
        className="rounded-lg"
      />
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight text-white">FLUX</span>
        <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-xs font-medium tracking-widest text-transparent">
          PREMIUM
        </span>
      </div>
    </div>
  );
}
