import React, { useState } from 'react';
import { Settings, X, Save, HelpCircle, Link as LinkIcon, Film, ExternalLink, RefreshCw } from 'lucide-react';
import { AppConfig } from '../config';

interface ContentConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSave: (newConfig: AppConfig) => void;
}

export const ContentConfigModal: React.FC<ContentConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
}) => {
  const [adUrl, setAdUrl] = useState(config.adUrl);
  const [adTimerSeconds, setAdTimerSeconds] = useState(config.adTimerSeconds);
  const [unlockMode, setUnlockMode] = useState<'redirect' | 'embedded'>(config.unlockMode);
  const [mainContentRedirectUrl, setMainContentRedirectUrl] = useState(config.mainContentRedirectUrl);
  const [mainContentVideoUrl, setMainContentVideoUrl] = useState(config.mainContentVideoUrl);
  const [previewImage, setPreviewImage] = useState(config.previewImage);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...config,
      adUrl,
      adTimerSeconds: Number(adTimerSeconds) || 30,
      unlockMode,
      mainContentRedirectUrl,
      mainContentVideoUrl,
      previewImage,
    });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl bg-[#151518] border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl text-left relative my-8">
        
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Main Content & Ad Settings
            </h2>
            <p className="text-xs text-neutral-400">
              মেইন কন্টেন্ট এবং বিজ্ঞাপনের লিংক কনফিগারেশন
            </p>
          </div>
        </div>

        {/* Bengali guidance box answering user's questions */}
        <div className="bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-4 mb-6 text-sm text-neutral-300 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>আপনার প্রশ্নের উত্তর ও নির্দেশিকা:</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            <strong className="text-white">১. ৩০ সেকেন্ডের হিসাব:</strong> ইউজার <span className="text-rose-400 font-semibold">I AM 18+</span> বাটনে ক্লিক করলে আপনার বিজ্ঞাপন লিংকটি একটি নতুন ট্যাবে খুলে যাবে। আর আসল ট্যাবে ৩০ সেকেন্ডের লাইভ কাউন্টডাউন টাইমার চলবে।
          </p>
          <p className="text-xs text-neutral-300 leading-relaxed">
            <strong className="text-white">২. মেইন কন্টেন্ট কোথায় দেবেন?</strong> নিচের অপশন থেকে যেকোনো একটি বেছে নিন:
          </p>
          <ul className="text-xs text-neutral-400 list-disc list-inside space-y-1 pl-2">
            <li><strong className="text-neutral-200">রিডাইরেক্ট মোড:</strong> ৩০ সেকেন্ড পর ইউজার সরাসরি আপনার দেওয়া টেলিগ্রাম চ্যানেল, ড্রাইভ লিংক বা অন্য সাইটের ফুল ভিডিও পেজে চলে যাবে।</li>
            <li><strong className="text-neutral-200">এমবেডেড প্লেয়ার মোড:</strong> এই পেজেই সরাসরি ভিডিও প্লেয়ার আনলক হয়ে আসল ভিডিও চলবে।</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Ad Smartlink */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              1. Sponsor Ad Link (বিজ্ঞাপনের লিংক)
            </label>
            <div className="relative">
              <input
                type="url"
                value={adUrl}
                onChange={(e) => setAdUrl(e.target.value)}
                placeholder="https://..."
                required
                className="w-full bg-black/50 border border-white/10 focus:border-rose-500 rounded-xl py-2.5 px-3.5 text-xs text-neutral-200 font-mono focus:outline-none"
              />
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              বর্তমানে আপনার দেওয়া লিংকটি সেট করা আছে।
            </span>
          </div>

          {/* Countdown Timer */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              2. Countdown Seconds (অপেক্ষার সময় সেকেন্ডে)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="3"
                max="120"
                value={adTimerSeconds}
                onChange={(e) => setAdTimerSeconds(Number(e.target.value))}
                className="w-32 bg-black/50 border border-white/10 focus:border-rose-500 rounded-xl py-2 px-3 text-sm text-white font-mono focus:outline-none"
              />
              <span className="text-xs text-neutral-400">
                (টেস্ট করার জন্য চাইলে ৫ বা ১০ সেকেন্ড দিয়েও দ্রুত পরীক্ষা করতে পারেন)
              </span>
            </div>
          </div>

          {/* Main Content Delivery Mode */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
              3. ৩০ সেকেন্ড পর মেইন কন্টেন্ট কিভাবে পাবে?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUnlockMode('embedded')}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  unlockMode === 'embedded'
                    ? 'bg-rose-500/15 border-rose-500 text-white'
                    : 'bg-black/30 border-white/10 text-neutral-400 hover:border-white/20'
                }`}
              >
                <Film className={`w-5 h-5 shrink-0 mt-0.5 ${unlockMode === 'embedded' ? 'text-rose-400' : 'text-neutral-500'}`} />
                <div>
                  <div className="font-bold text-xs text-white">এই পেজেই ভিডিও চলবে</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">Player আনলক হয়ে সরাসরি ভিডিও প্লে হবে</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUnlockMode('redirect')}
                className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  unlockMode === 'redirect'
                    ? 'bg-rose-500/15 border-rose-500 text-white'
                    : 'bg-black/30 border-white/10 text-neutral-400 hover:border-white/20'
                }`}
              >
                <ExternalLink className={`w-5 h-5 shrink-0 mt-0.5 ${unlockMode === 'redirect' ? 'text-rose-400' : 'text-neutral-500'}`} />
                <div>
                  <div className="font-bold text-xs text-white">অন্য লিংকে রিডাইরেক্ট হবে</div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">টেলিগ্রাম/ড্রাইভ বা যেকোনো লিংকে যাবে</div>
                </div>
              </button>
            </div>
          </div>

          {/* Dynamic input according to mode */}
          {unlockMode === 'redirect' ? (
            <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10">
              <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Main Content Redirect URL (মেইন কন্টেন্টের লিংক):</span>
              </label>
              <input
                type="url"
                value={mainContentRedirectUrl}
                onChange={(e) => setMainContentRedirectUrl(e.target.value)}
                placeholder="https://t.me/hotxbold"
                className="w-full bg-black/60 border border-white/10 focus:border-emerald-500 rounded-xl py-2.5 px-3.5 text-xs text-emerald-300 font-mono focus:outline-none"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                ইউজার ৩০ সেকেন্ড বিজ্ঞাপন দেখার পর অটোমেটিক এই টেলিগ্রাম চ্যানেলে চলে যাবে।
              </span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-neutral-900 border border-white/10">
              <label className="block text-xs font-bold text-white mb-1.5 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-rose-400" />
                <span>Direct Video Stream URL (সরাসরি ভিডিও ফাইল লিংক):</span>
              </label>
              <input
                type="url"
                value={mainContentVideoUrl}
                onChange={(e) => setMainContentVideoUrl(e.target.value)}
                placeholder="https://.../video.mp4"
                className="w-full bg-black/60 border border-white/10 focus:border-rose-500 rounded-xl py-2.5 px-3.5 text-xs text-neutral-200 font-mono focus:outline-none"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                লক খোলার পর প্লেয়ারে এই ভিডিওটি সরাসরি চলবে (যেমন MP4, WebM ইত্যাদি)।
              </span>
            </div>
          )}

          {/* Preview Image Thumbnail */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              4. Video Preview Thumbnail (লকড অবস্থার থাম্বনেইল ছবি)
            </label>
            <input
              type="url"
              value={previewImage}
              onChange={(e) => setPreviewImage(e.target.value)}
              placeholder="https://.../image.jpg"
              className="w-full bg-black/50 border border-white/10 focus:border-white/30 rounded-xl py-2 px-3 text-xs text-neutral-300 font-mono focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-neutral-400">
              {savedNotice ? '✓ সংরক্ষিত হয়েছে!' : 'সেভ করলে এখনই লাইভ প্রিভিউতে কাজ করবে'}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-rose-600/30"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Settings</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
