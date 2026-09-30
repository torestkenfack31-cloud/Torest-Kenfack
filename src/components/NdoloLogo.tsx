import React from 'react';

interface NdoloLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const NdoloLogo: React.FC<NdoloLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  className = ''
}) => {
  const imgDimension = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
  const textClass = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-2xl';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* High-res generated logo emblem */}
      <div className={`relative ${imgDimension} rounded-xl overflow-hidden border border-rose-500/40 shadow-md shadow-rose-950/40 bg-stone-900 shrink-0`}>
        <img
          src="/src/assets/images/ndolo_logo_emblem_1790591334679.jpg"
          alt="Ndolo Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 ring-1 ring-inset ring-rose-500/30 rounded-xl pointer-events-none" />
      </div>

      {/* Brand Wordmark & Romantic Tagline */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-brand font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-300 to-amber-200 ${textClass}`}>
            Ndolo
          </span>
          <span className="text-rose-500 text-sm">♥</span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] tracking-wider text-rose-300/80 uppercase font-medium -mt-0.5">
            L'Amour & Le Mariage
          </span>
        )}
      </div>
    </div>
  );
};
