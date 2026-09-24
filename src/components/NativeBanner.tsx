import React, { useEffect, useRef } from 'react';

interface NativeBannerProps {
  sponsorUrl: string;
}

export const NativeBanner: React.FC<NativeBannerProps> = ({ sponsorUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject the native banner script
    const container = containerRef.current;
    if (!container) return;

    // Remove existing script if any to prevent duplicate calls
    const existingScript = document.getElementById('adsterra-native-banner-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'adsterra-native-banner-script';
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://researchingsweatexit.com/2bf5971ff77eaa86e3d9f12a8ae86801/invoke.js';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full max-w-3xl my-6 flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-neutral-900/60 border border-white/10 p-3 min-h-[90px]">
      <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider mb-2">
        Sponsored Ad
      </span>
      {/* Adsterra Native Banner Target Container */}
      <div id="container-2bf5971ff77eaa86e3d9f12a8ae86801" ref={containerRef} className="w-full text-center">
        {/* Clickable Sponsor fallback in case script is pending/adblocked */}
        <a
          href={sponsorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group block p-3 rounded-xl bg-gradient-to-r from-rose-950/40 via-neutral-900 to-rose-950/40 border border-rose-500/20 hover:border-rose-500/50 transition-all text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                ✨
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                  Exclusive 18+ Sponsor Offers
                </div>
                <div className="text-[11px] text-neutral-400">
                  Click to unlock high-speed VIP streaming
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 group-hover:bg-rose-500 text-white font-bold text-xs shrink-0 shadow">
              <span>Visit Sponsor</span>
              <span className="text-xs">↗</span>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};
