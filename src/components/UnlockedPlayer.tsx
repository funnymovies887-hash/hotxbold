import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle, ExternalLink, RotateCcw, Send, Sparkles } from 'lucide-react';

interface UnlockedPlayerProps {
  mode: 'redirect' | 'embedded';
  redirectUrl: string;
  videoUrl: string;
  onReset: () => void;
}

export const UnlockedPlayer: React.FC<UnlockedPlayerProps> = ({
  mode,
  redirectUrl,
  videoUrl,
  onReset,
}) => {
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const isTelegram = redirectUrl.includes('t.me') || redirectUrl.includes('telegram');

  useEffect(() => {
    if (mode === 'redirect') {
      setRedirectAttempted(true);
      // Attempt multiple redirect strategies for browser & iframe compatibility
      try {
        window.location.assign(redirectUrl);
      } catch (e) {
        console.warn('window.location.assign blocked:', e);
      }

      try {
        if (window.top && window.top !== window) {
          window.top.location.href = redirectUrl;
        } else {
          window.location.href = redirectUrl;
        }
      } catch (e) {
        console.warn('Iframe policy blocked navigation, attempting popup/tab redirect:', e);
        try {
          const w = window.open(redirectUrl, '_blank', 'noopener,noreferrer');
          if (!w) {
            // Popup blocker might intercept background window.open
            const link = document.createElement('a');
            link.href = redirectUrl;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } catch (err) {
          console.error('All automatic redirect attempts failed:', err);
        }
      }
    }
  }, [mode, redirectUrl]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  if (mode === 'redirect') {
    return (
      <div className="w-full aspect-video min-h-[260px] md:min-h-[360px] rounded-3xl bg-neutral-900 border border-emerald-500/30 flex flex-col items-center justify-center p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-black/80 pointer-events-none" />
        
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${
          isTelegram 
            ? 'bg-sky-500/20 border border-sky-500/40 text-sky-400' 
            : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
        }`}>
          {isTelegram ? <Send className="w-8 h-8 -rotate-12 translate-x-0.5" /> : <CheckCircle className="w-8 h-8" />}
        </div>

        <h3 className="text-xl md:text-2xl font-black text-white mb-2">
          {isTelegram ? 'Unlocked! Redirecting to Telegram...' : '30 Seconds Completed!'}
        </h3>

        <p className="text-neutral-300 text-sm md:text-base max-w-md mb-6 leading-relaxed">
          {isTelegram ? (
            <>
              Main content channel:
              <br />
              <span className="font-mono text-sm text-sky-400 font-bold bg-sky-950/60 border border-sky-500/30 px-3 py-1.5 rounded-lg mt-2 inline-flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>@hotxbold (Telegram)</span>
              </span>
            </>
          ) : (
            <>
              Redirecting to main content at:
              <br />
              <span className="font-mono text-xs text-emerald-400 break-all bg-black/40 px-2 py-1 rounded mt-1 inline-block">
                {redirectUrl}
              </span>
            </>
          )}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md z-10">
          <a
            href={redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-4 px-6 rounded-xl active:scale-95 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
              isTelegram
                ? 'bg-gradient-to-r from-sky-500 via-blue-600 to-sky-500 hover:from-sky-400 hover:to-blue-500 shadow-sky-900/50'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/40'
            }`}
          >
            {isTelegram ? (
              <>
                <Send className="w-4 h-4" />
                <span>JOIN TELEGRAM CHANNEL NOW</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </>
            ) : (
              <>
                <span>Open Main Content Now</span>
                <ExternalLink className="w-4 h-4" />
              </>
            )}
          </a>

          <button
            onClick={onReset}
            type="button"
            className="w-full sm:w-auto py-4 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-neutral-300 font-semibold text-sm flex items-center justify-center gap-1.5 border border-white/10 transition-all cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Test Again</span>
          </button>
        </div>
      </div>
    );
  }

  // Embedded Video Player
  return (
    <div className="w-full aspect-video min-h-[260px] md:min-h-[400px] relative overflow-hidden rounded-3xl bg-black border border-emerald-500/30 shadow-2xl group">
      <video
        ref={videoRef}
        src={videoUrl}
        autoPlay
        playsInline
        controls
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Top Unlocked Badge */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 border border-emerald-500/50 backdrop-blur-md text-emerald-400 text-xs font-bold shadow-lg">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>MAIN CONTENT UNLOCKED</span>
        </div>
      </div>

      {/* Floating reset button */}
      <button
        onClick={onReset}
        type="button"
        className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/15 text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Re-lock Preview</span>
      </button>
    </div>
  );
};
