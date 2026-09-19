/**
 * CONFIGURATION FILE (কনফিগারেশন ফাইল)
 * 
 * আপনি এখান থেকে সহজেই আপনার লিংক ও সেটিংস পরিবর্তন করতে পারেন:
 * 1. AD_URL: ইউজার 'I AM 18+' বাটনে ক্লিক করলে এই বিজ্ঞাপন লিংকটি নতুন ট্যাবে ওপেন হবে।
 * 2. AD_TIMER_SECONDS: বিজ্ঞাপনের পর কত সেকেন্ড অপেক্ষা করবে (ডিফল্ট: 30 সেকেন্ড)।
 * 3. MAIN_CONTENT_MODE: 
 *    - 'redirect': ৩০ সেকেন্ড পর সরাসরি আপনার দেওয়া মেইন লিংকে (MAIN_CONTENT_REDIRECT_URL) চলে যাবে।
 *    - 'embedded': এই পেজেই লক খুলে আসল ফুল ভিডিও প্লেয়ার চালু হয়ে যাবে (MAIN_CONTENT_VIDEO_URL)।
 * 4. MAIN_CONTENT_REDIRECT_URL: আপনার কাঙ্ক্ষিত কন্টেন্টের লিংক (যেমন Telegram, Drive, বা অন্য কোনো সাইটের লিংক)।
 * 5. MAIN_CONTENT_VIDEO_URL: সরাসরি এই পেজে ভিডিও দেখাতে চাইলে তার MP4 / Stream লিংক।
 */

export interface AppConfig {
  adUrl: string;
  adTimerSeconds: number;
  unlockMode: 'redirect' | 'embedded';
  mainContentRedirectUrl: string;
  mainContentVideoUrl: string;
  previewImage: string;
  videoTitle: string;
  videoDuration: string;
}

export const DEFAULT_CONFIG: AppConfig = {
  // আপনার দেওয়া বিজ্ঞাপনের লিংক
  adUrl: 'https://splendid-garage.com/cKshzF',
  
  // ৩০ সেকেন্ড টাইমার
  adTimerSeconds: 30,

  // মোড: 'redirect' - ৩০ সেকেন্ড পর সরাসরি টেলিগ্রাম চ্যানেলে চলে যাবে
  unlockMode: 'redirect',

  // মেইন কন্টেন্ট: টেলিগ্রাম চ্যানেল লিংক
  mainContentRedirectUrl: 'https://t.me/hotxbold',

  // যদি সরাসরি ভিডিও চালাতে চান
  mainContentVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',

  // থাম্বনেইল ছবি
  previewImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop',

  videoTitle: 'Private Premium Video Stream',
  videoDuration: '12:48',
};
