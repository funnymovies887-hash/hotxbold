import React, { useState } from 'react';
import { ShieldAlert, ExternalLink } from 'lucide-react';

interface AgeModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  adUrl: string;
}

export const AgeModal: React.FC<AgeModalProps> = ({ isOpen, onConfirm, adUrl }) => {
  const [exitClicked, setExitClicked] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    // 1. Open the Ad Smartlink in a new tab
    if (adUrl) {
      try {
        const adWindow = window.open(adUrl, '_blank', 'noopener,noreferrer');
        if (!adWindow || adWindow.closed || typeof adWindow.closed === 'undefined') {
          // Fallback if popup blocked: create temporary anchor
          const a = document.createElement('a');
          a.href = adUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } catch (e) {
        console.error('Error opening ad:', e);
      }
    }

    // 2. Notify parent to start 30s countdown and unlock flow
    onConfirm();
  };

  const handleExit = () => {
    setExitClicked(true);
  };

  return (
    <div 
      id="ageModal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ageModalTitle"
    >
      <div className="w-full max-w-md bg-[#151518]/95 border border-white/10 rounded-3xl p-7 text-center shadow-2xl shadow-black/80 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="text-xs tracking-[0.15em] font-black text-rose-400 mb-2 uppercase">
          18+ Content Warning
        </div>

        <h2 id="ageModalTitle" className="text-2xl font-bold tracking-tight text-white mb-2">
          Age Confirmation
        </h2>

        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
          This preview and video content is strictly intended for adults aged 18 and over.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            id="confirmAge"
            onClick={handleConfirm}
            type="button"
            className="w-full min-h-[50px] rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 active:scale-[0.98] text-white font-extrabold text-sm tracking-wide shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
          >
            <span>I AM 18+</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </button>

          <button
            id="exitAge"
            onClick={handleExit}
            type="button"
            disabled={exitClicked}
            className={`w-full min-h-[50px] rounded-xl font-bold text-sm tracking-wide transition-all duration-150 border cursor-pointer ${
              exitClicked 
                ? 'bg-neutral-800/40 text-neutral-500 border-neutral-800 cursor-not-allowed'
                : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/10'
            }`}
          >
            EXIT
          </button>
        </div>

        {exitClicked && (
          <div id="exitMessage" className="mt-4 text-rose-400 text-xs font-semibold animate-pulse">
            Access denied. You must be 18+ to view this content.
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-neutral-500">
          <span>Clicking 'I AM 18+' verifies age & opens sponsor</span>
        </div>
      </div>
    </div>
  );
};
