import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Settings, HelpCircle, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import { DEFAULT_CONFIG, AppConfig } from './config';
import { AgeModal } from './components/AgeModal';
import { VideoModal } from './components/VideoModal';
import { LockedPlayer } from './components/LockedPlayer';
import { UnlockedPlayer } from './components/UnlockedPlayer';
import { ContentConfigModal } from './components/ContentConfigModal';
import { NativeBanner } from './components/NativeBanner';

const STORAGE_CONFIG_KEY = 'video_locker_config_v4';
const AGE_STORAGE_KEY = 'premium_video_age_confirmed';

export default function App() {
  // Config state (editable live by user)
  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.adUrl || parsed.adUrl.includes('data527.click') || parsed.adUrl.includes('splendid-garage')) {
          parsed.adUrl = DEFAULT_CONFIG.adUrl;
        }
        // Ensure telegram channel is preserved if previous had placeholder
        if (!parsed.mainContentRedirectUrl || parsed.mainContentRedirectUrl.includes('example.com')) {
          parsed.mainContentRedirectUrl = 'https://t.me/hotxbold';
          parsed.unlockMode = 'redirect';
        }
        return { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CONFIG;
  });

  // Modal & Flow states
  const [isAgeModalOpen, setIsAgeModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Content unlock & timer states
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(config.adTimerSeconds);

  // Reference for timer interval
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if age already verified on load
  useEffect(() => {
    try {
      const confirmed = localStorage.getItem(AGE_STORAGE_KEY) === 'true';
      if (!confirmed) {
        setIsAgeModalOpen(true);
      }
    } catch (e) {
      setIsAgeModalOpen(true);
    }
  }, []);

  // Handle countdown interval
  useEffect(() => {
    if (isCountingDown) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Timer finished! Unlock main content
            if (timerRef.current) clearInterval(timerRef.current);
            setIsCountingDown(false);
            setIsUnlocked(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCountingDown]);

  // Handle "I AM 18+" confirmation from Age Modal
  const handleAgeConfirmed = () => {
    try {
      localStorage.setItem(AGE_STORAGE_KEY, 'true');
    } catch (e) {
      console.error(e);
    }
    setIsAgeModalOpen(false);

    // Start 30s countdown
    setSecondsRemaining(config.adTimerSeconds);
    setIsCountingDown(true);
  };

  // Open Ad and trigger timer from Unlock buttons
  const triggerAdAndTimer = () => {
    // Open ad smartlink in new tab
    if (config.adUrl) {
      try {
        const adWindow = window.open(config.adUrl, '_blank', 'noopener,noreferrer');
        if (!adWindow || adWindow.closed || typeof adWindow.closed === 'undefined') {
          const a = document.createElement('a');
          a.href = config.adUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } catch (e) {
        console.error(e);
      }
    }

    setIsVideoModalOpen(false);
    setSecondsRemaining(config.adTimerSeconds);
    setIsCountingDown(true);
  };

  const handlePlayClick = () => {
    let confirmed = false;
    try {
      confirmed = localStorage.getItem(AGE_STORAGE_KEY) === 'true';
    } catch (e) {
      confirmed = false;
    }

    if (!confirmed) {
      setIsAgeModalOpen(true);
      return;
    }

    if (!isUnlocked && !isCountingDown) {
      setIsVideoModalOpen(true);
    }
  };

  const handleUnlockButtonClick = () => {
    let confirmed = false;
    try {
      confirmed = localStorage.getItem(AGE_STORAGE_KEY) === 'true';
    } catch (e) {
      confirmed = false;
    }

    if (!confirmed) {
      setIsAgeModalOpen(true);
      return;
    }

    triggerAdAndTimer();
  };

  const handleSaveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.error(e);
    }
    // Reset timer
    setSecondsRemaining(newConfig.adTimerSeconds);
  };

  const handleResetLock = () => {
    setIsUnlocked(false);
    setIsCountingDown(false);
    setSecondsRemaining(config.adTimerSeconds);
  };

  const handleSkipTimer = () => {
    setIsCountingDown(false);
    setSecondsRemaining(0);
    setIsUnlocked(true);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col items-center justify-between relative overflow-x-hidden selection:bg-rose-500 selection:text-white font-sans antialiased">
      
      {/* Background Ambient Glow */}
      <div 
        className="fixed top-12 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-rose-600/[0.08] blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Helper Bar for configuring content link */}
      <nav className="w-full max-w-5xl px-4 pt-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-black text-xs">
            18+ PORTAL
          </span>
          <span className="hidden sm:inline-block text-xs text-neutral-400">
            Auto-Unlock Gateway
          </span>
        </div>

        {/* Setting Button to easily answer "main content kivabe dibo" */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          type="button"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-neutral-200 text-xs font-semibold cursor-pointer transition-all hover:scale-105"
          title="Configure ad and main content links"
        >
          <Settings className="w-3.5 h-3.5 text-rose-400" />
          <span>কন্টেন্ট লিংক সেটিংস</span>
        </button>
      </nav>

      {/* Main Container */}
      <main id="mainContent" className="w-full max-w-4xl px-4 py-6 md:py-10 z-10 flex flex-col items-center">
        
        {/* Header */}
        <header className="text-center mb-6 max-w-xl">
          <div className="inline-flex items-center justify-center min-w-[44px] h-[26px] px-2.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-black tracking-wider mb-3">
            18+
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-2.5">
            Your Video Is Ready
          </h1>
          <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
            Verify 18+ access below to unlock and watch the full video.
          </p>
        </header>

        {/* Video Player Component (Locked or Unlocked) */}
        <div className="w-full max-w-3xl">
          {isUnlocked ? (
            <UnlockedPlayer
              mode={config.unlockMode}
              redirectUrl={config.mainContentRedirectUrl}
              videoUrl={config.mainContentVideoUrl}
              onReset={handleResetLock}
            />
          ) : (
            <LockedPlayer
              previewImage={config.previewImage}
              duration={config.videoDuration}
              onPlayClick={handlePlayClick}
              isCountingDown={isCountingDown}
              secondsRemaining={secondsRemaining}
              totalSeconds={config.adTimerSeconds}
              adUrl={config.adUrl}
              onSkipTimer={handleSkipTimer}
            />
          )}
        </div>

        {/* Native Banner Slot */}
        <NativeBanner sponsorUrl={config.adUrl} />

        {/* CTA Unlock Button Area */}
        <section className="w-full max-w-md mt-2 flex flex-col items-center text-center">
          {!isUnlocked && (
            <button
              id="unlockButton"
              onClick={handleUnlockButtonClick}
              type="button"
              className="w-full min-h-[58px] rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-400 active:scale-[0.99] text-white text-base font-extrabold tracking-wide shadow-xl shadow-rose-600/30 border border-rose-400/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer animate-pulse hover:animate-none"
            >
              <Unlock className="w-5 h-5" />
              <span>{isCountingDown ? `UNLOCKING (${secondsRemaining}s)...` : '🔓 UNLOCK VIDEO'}</span>
            </button>
          )}

          <p className="text-neutral-500 text-xs mt-3">
            Secure 256-bit SSL Access • Adults 18+ Only
          </p>
        </section>

        {/* Instructions Card: Clear guidance for Bengali user */}
        <div className="w-full max-w-2xl mt-8 p-4 rounded-2xl bg-neutral-900/40 border border-white/5 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              আপনার কনফিগারেশন স্ট্যাটাস:
            </span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-xs text-rose-400 hover:underline cursor-pointer"
            >
              লিংক পরিবর্তন করুন
            </button>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed space-y-1">
            <span>• <strong className="text-neutral-200">বিজ্ঞাপন লিংক:</strong> {config.adUrl.substring(0, 45)}...</span>
            <br />
            <span>• <strong className="text-neutral-200">টাইমার:</strong> {config.adTimerSeconds} সেকেন্ড (I AM 18+ এ ক্লিক করলে নতুন ট্যাবে অ্যাড খুলবে এবং টাইমার চালু হবে)</span>
            <br />
            <span>• <strong className="text-neutral-200">মেইন কন্টেন্ট (Telegram):</strong> <span className="text-sky-400 font-mono font-semibold">{config.mainContentRedirectUrl}</span></span>
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-neutral-600 border-t border-white/5 z-10">
        © {new Date().getFullYear()} • Premium Video Preview Gateway
      </footer>

      {/* 18+ Age Modal */}
      <AgeModal
        isOpen={isAgeModalOpen}
        onConfirm={handleAgeConfirmed}
        adUrl={config.adUrl}
      />

      {/* Video Locked Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onUnlock={triggerAdAndTimer}
      />

      {/* Content & Ads Settings Modal */}
      <ContentConfigModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSave={handleSaveConfig}
      />

    </div>
  );
}
