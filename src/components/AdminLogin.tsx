import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ArrowLeft, ShieldCheck, KeyRound, Sparkles, AlertCircle, HelpCircle, ChevronDown, ChevronUp, Code, Database } from 'lucide-react';
import { GoogleProfileAvatar } from './GoogleProfileAvatar';
import { SheetSettings } from '../types';

interface AdminLoginProps {
  settings: SheetSettings;
  onLoginSuccess: () => void;
  onBackToSite: () => void;
  savedUsername: string;
  savedPassword: string;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  settings,
  onLoginSuccess,
  onBackToSite,
  savedUsername,
  savedPassword
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotGuide, setShowForgotGuide] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      const trimmedUser = username.trim();
      const trimmedPass = password.trim();

      if (trimmedUser === savedUsername && trimmedPass === savedPassword) {
        onLoginSuccess();
      } else {
        setErrorMsg('ব্যবহারকারীর নাম (Username) অথবা পাসওয়ার্ড ভুল হয়েছে। অনুগ্রহ করে সঠিক তথ্য দিন।');
      }
      setIsSubmitting(false);
    }, 300);
  };

  const handleUseDefault = () => {
    setUsername(savedUsername);
    setPassword(savedPassword);
    setErrorMsg('');
  };

  const primaryColor = settings.primary_color || '#1d4ed8';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-serif-bn relative selection:bg-blue-600 selection:text-white">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Back to Site */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between relative z-10">
        <button
          onClick={onBackToSite}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold border border-slate-800 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ওয়েবসাইটে ফিরে যান</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>সুরক্ষিত এডমিন লগইন</span>
        </div>
      </div>

      {/* Center: Login Card */}
      <div className="max-w-md mx-auto w-full my-auto py-6 relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          
          {/* Header & Google RGB Avatar */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <GoogleProfileAvatar
                src={settings.avatar_icon_url || settings.logo_url}
                alt={settings.site_title}
                size="lg"
                showBadge={true}
                animateRing={true}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                এডমিন প্যানেল লগইন
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {settings.site_title || 'প্রবর্তন'} — গুগল শিট ও ওয়েবসাইট কনট্রোল সিস্টেম
              </p>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-in shake duration-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                ইউজার নেম (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="যেমন: ariful"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  পাসওয়ার্ড (Password)
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotGuide(!showForgotGuide)}
                  className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition cursor-pointer"
                  aria-label={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ backgroundColor: primaryColor }}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white shadow-lg hover:opacity-90 transition transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isSubmitting ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}</span>
            </button>

          </form>

          {/* Forgot Password Accordion / Help Box */}
          {showForgotGuide && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-blue-800/70 text-xs text-slate-300 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-bold text-blue-400">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>পাসওয়ার্ড রিসেট করার নির্দেশিকা:</span>
              </div>
              <ol className="list-decimal pl-5 space-y-1.5 text-slate-400 leading-relaxed text-[11px]">
                <li>আপনার সংযুক্ত <strong className="text-white">গুগল স্প্রেডশিট</strong> ওপেন করুন।</li>
                <li>উপরের মেনু থেকে <strong className="text-white">Extensions &gt; Apps Script</strong> এ যান।</li>
                <li>Apps Script এর কোডে নতুন এডমিন পাসওয়ার্ড কনফিগার করুন বা স্ক্রিপ্ট থেকে রিসেট ফাংশন রান করুন।</li>
                <li>নিরাপত্তাজনিত কারণে সিস্টেম এডমিন ছাড়া পাসওয়ার্ড অন্য কোথাও সরাসরি প্রদর্শিত হয় না।</li>
              </ol>
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="max-w-5xl mx-auto w-full text-center text-xs text-slate-500 relative z-10 py-2">
        <span>© ২০২৬ {settings.site_title || 'প্রবর্তন'} | গুগল শিট সিএমএস কন্ট্রোল প্যানেল</span>
      </div>

    </div>
  );
};
