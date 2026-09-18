import React from 'react';
import { Lock, Play, Volume2, Maximize2, Loader2, Sparkles, ExternalLink } from 'lucide-react';

interface LockedPlayerProps {
  previewImage: string;
  duration: string;
  onPlayClick: () => void;
  isCountingDown: boolean;
  secondsRemaining: number;
  totalSeconds: number;
  adUrl: string;
  onSkipTimer?: () => void;
}

export const LockedPlayer: React.FC<LockedPlayerProps> = ({
  previewImage,
  duration,
  onPlayClick,
  isCountingDown,
  secondsRemaining,
  totalSeconds,
  adUrl,
  onSkipTimer,
}) => {
  const progressPercent = totalSeconds > 0 
    ? Math.min(100, Math.max(0, ((totalSeconds - secondsRemaining) / totalSeconds) * 100))
    : 0;

  return (
    <section 
      id="lockedPlayerSection" 
      className="w-full aspect-video min-h-[240px] md:min-h-[380px] relative overflow-hidden rounded-2xl md:rounded-3xl bg-[#111] border border-white/10 shadow-2xl shadow-black/80 isolate group select-none"
      aria-label="Locked video preview player"
    >
      {/* Background preview image */}
      <img
        id="previewImage"
        src={previewImage}
        alt="Locked preview content"
        className="absolute inset-0 w-full h-full object-cover object-center filter blur-[2px] brightness-[0.45] scale-105 transition-transform duration-700"
        onError={(e) => {
          // Fallback if image fails
          (e.target as HTMLElement).style.display = 'none';
        }}
      />

      {/* Gradients and Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/90 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />

      {/* Top Bar with Status and Duration */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-white text-xs font-bold tracking-wider uppercase shadow-lg">
          <Lock className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          <span>VIDEO LOCKED</span>
        </div>

        <div className="px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-xs font-bold backdrop-blur-md">
          {duration}
        </div>
      </div>

      {/* Normal Locked Center Play Button OR Countdown State */}
      {!isCountingDown ? (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button
            id="playButton"
            onClick={onPlayClick}
            type="button"
            className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/15 hover:bg-rose-500/30 border border-white/30 hover:border-rose-500/50 backdrop-blur-xl flex items-center justify-center text-white shadow-2xl shadow-black/60 transition-all duration-300 hover:scale-110 active:scale-95 group/btn cursor-pointer"
            aria-label="Play locked video"
          >
            {/* Pulsing ring */}
            <span className="absolute -inset-2 rounded-full border border-rose-500/30 animate-ping opacity-60 pointer-events-none" />
            <Play className="w-8 h-8 md:w-10 md:h-10 fill-white text-white translate-x-0.5 filter drop-shadow-lg transition-transform group-hover/btn:scale-105" />
          </button>
        </div>
      ) : (
        /* Active 30-Second Countdown Overlay */
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/75 backdrop-blur-sm p-6 text-center animate-in fade-in duration-300">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
            <span>Ad Verification in Progress</span>
          </div>

          <div className="flex items-baseline justify-center gap-1.5 mb-2 text-white">
            <span className="text-5xl md:text-6xl font-black font-mono tracking-tight text-white drop-shadow-md">
              {secondsRemaining}
            </span>
            <span className="text-xl md:text-2xl font-bold text-rose-400 font-mono">s</span>
          </div>

          <p className="text-sm md:text-base font-medium text-neutral-200 max-w-sm mb-4">
            Unlocking main content automatically in {secondsRemaining} seconds...
          </p>

          {/* Progress Bar */}
          <div className="w-full max-w-xs h-2 rounded-full bg-white/15 overflow-hidden p-0.5 mb-4 border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-400 rounded-full transition-all duration-1000 ease-linear shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-3 mt-1">
            <a
              href={adUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 underline underline-offset-4"
            >
              <span>Reopen sponsor ad</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {onSkipTimer && (
              <>
                <span className="text-neutral-600">•</span>
                <button
                  onClick={onSkipTimer}
                  type="button"
                  className="text-xs text-rose-400/90 hover:text-rose-300 font-medium cursor-pointer"
                >
                  Skip timer (Preview)
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Fake Bottom Player Controls */}
      <div className="absolute bottom-3 left-4 right-4 z-10">
        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-3">
          <div className="w-[18%] h-full bg-rose-500 rounded-full" />
        </div>

        <div className="flex items-center justify-between text-white/80 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="cursor-pointer hover:text-white transition-colors">▶</span>
            <Volume2 className="w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors" />
          </div>

          <div className="flex items-center gap-3">
            <span>{isCountingDown ? `00:${String(30 - secondsRemaining).padStart(2, '0')}` : '00:00'} / {duration}</span>
            <Maximize2 className="w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </section>
  );
};
