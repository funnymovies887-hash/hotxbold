import React from 'react';
import { Lock, X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  onUnlock,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="videoModal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="videoModalTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-[#151518]/95 border border-white/10 rounded-3xl p-7 text-center shadow-2xl shadow-black/90 transform transition-all animate-in fade-in zoom-in-95 duration-200 relative">
        
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 text-2xl shadow-inner">
          <Lock className="w-7 h-7" />
        </div>

        <h2 id="videoModalTitle" className="text-2xl font-bold tracking-tight text-white mb-2">
          Video Locked
        </h2>

        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
          Complete the age confirmation & sponsor unlock step to access this full video.
        </p>

        <div className="flex flex-col gap-3">
          <button
            id="modalUnlockButton"
            onClick={onUnlock}
            type="button"
            className="w-full min-h-[50px] rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 active:scale-[0.98] text-white font-extrabold text-sm tracking-wide shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>🔓 UNLOCK VIDEO NOW</span>
          </button>

          <button
            id="closeVideoModal"
            onClick={onClose}
            type="button"
            className="w-full min-h-[48px] rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 font-bold text-sm tracking-wide border border-white/10 transition-all cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
