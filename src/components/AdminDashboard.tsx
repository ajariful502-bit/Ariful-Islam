import React, { useState } from 'react';
import {
  RefreshCw, Database, Code, BookOpen, Settings, Sliders as SlidersIcon,
  Package, Image as ImageIcon, FileText, MessageSquare, Check, Copy,
  Plus, Trash2, Edit2, ExternalLink, Save, ArrowLeft, ShieldCheck, Sparkles,
  Bot, Lock, LogOut, KeyRound, CheckCircle2, AlertCircle, Eye, EyeOff, User,
  Globe, Phone, Mail, MapPin, Send, HelpCircle, ChevronRight, Menu as MenuIcon,
  X, Play, Video, Share2, Info, CheckCircle
} from 'lucide-react';
import { GoogleSheetDatabase, SheetSettings, SliderItem, ProductItem, GalleryItem, ArticleItem, MessageItem } from '../types';
import { CODE_GS_SCRIPT } from '../data/codeGsTemplate';
import { GoogleProfileAvatar } from './GoogleProfileAvatar';
import { formatImageUrl, formatYoutubeEmbedUrl } from '../utils/mediaUtils';
import { GoogleChatTab } from './GoogleChatTab';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  data: GoogleSheetDatabase;
  onUpdateData: (newData: GoogleSheetDatabase) => void;
  appsScriptUrl: string;
  onUpdateUrl: (url: string) => void;
  onSyncLive: () => void;
  isSyncing: boolean;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  savedUsername: string;
  savedPassword: string;
  onUpdateCredentials: (newUser: string, newPass: string) => void;
  geminiApiKey: string;
  onUpdateGeminiKey: (newKey: string) => void;
}

export type AdminTab =
  | 'overview'
  | 'settings'
  | 'sliders'
  | 'products'
  | 'gallery'
  | 'articles'
  | 'messages'
  | 'gemini'
  | 'googlechat'
  | 'security'
  | 'api'
  | 'codegs'
  | 'guide';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onLogout,
  data,
  onUpdateData,
  appsScriptUrl,
  onUpdateUrl,
  onSyncLive,
  isSyncing,
  onShowToast,
  savedUsername,
  savedPassword,
  onUpdateCredentials,
  geminiApiKey,
  onUpdateGeminiKey
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [urlInput, setUrlInput] = useState(appsScriptUrl);
  
  // Gemini API state
  const [geminiKeyInput, setGeminiKeyInput] = useState(geminiApiKey);
  const [isTestingGemini, setIsTestingGemini] = useState(false);
  const [geminiTestResult, setGeminiTestResult] = useState<{ success: boolean; text: string } | null>(null);

  // Security Credentials state
  const [newUsername, setNewUsername] = useState(savedUsername);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Local state for editing
  const [formData, setFormData] = useState<GoogleSheetDatabase>(data);

  // Sync internal state when data updates from parent
  React.useEffect(() => {
    setFormData(data);
  }, [data]);

  React.useEffect(() => {
    setGeminiKeyInput(geminiApiKey);
  }, [geminiApiKey]);

  React.useEffect(() => {
    setUrlInput(appsScriptUrl);
  }, [appsScriptUrl]);

  if (!isOpen) return null;

  const handleCopyCodeGs = () => {
    navigator.clipboard.writeText(CODE_GS_SCRIPT);
    setCopiedCode(true);
    onShowToast('Code.gs স্ক্রিপ্ট ক্লিপবোর্ডে কপি করা হয়েছে!', 'success');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleSaveAll = () => {
    onUpdateData(formData);
    onShowToast('সমস্ত পরিবর্তন সফলভাবে সংরক্ষণ করা হয়েছে!', 'success');
  };

  const handleSaveApiUrl = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUrl(urlInput.trim());
    onShowToast('গুগল অ্যাপস স্ক্রিপ্ট এপিআই ইউআরএল আপডেট হয়েছে!', 'success');
  };

  // Gemini API Key Save & Test
  const handleSaveGeminiKey = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGeminiKey(geminiKeyInput.trim());
    onShowToast('জেমিনি এআই এপিআই কি সফলভাবে সংরক্ষিত হয়েছে!', 'success');
  };

  const handleTestGeminiConnection = async () => {
    setIsTestingGemini(true);
    setGeminiTestResult(null);
    try {
      const res = await fetch('/api/test-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: geminiKeyInput.trim() })
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setGeminiTestResult({ success: true, text: json.message || 'Gemini API কানেকশন সফল হয়েছে!' });
        onShowToast('Gemini API সফলভাবে কানেক্টেড!', 'success');
      } else {
        setGeminiTestResult({ success: false, text: json.error || 'সংযোগ স্থাপন ব্যর্থ হয়েছে।' });
        onShowToast('Gemini API টেস্ট ব্যর্থ: ' + (json.error || 'ত্রুটি'), 'error');
      }
    } catch (err: any) {
      setGeminiTestResult({ success: false, text: err.message || 'সার্ভারে অনুরোধ পাঠানো যায়নি।' });
      onShowToast('সার্ভার এরর: ' + err.message, 'error');
    } finally {
      setIsTestingGemini(false);
    }
  };

  // Security Credentials Update
  const handleUpdatePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPassword.trim() !== savedPassword) {
      onShowToast('বর্তমান পাসওয়ার্ড ভুল হয়েছে!', 'error');
      return;
    }
    if (!newPassword.trim()) {
      onShowToast('নতুন পাসওয়ার্ড ফাঁকা রাখা যাবে না!', 'error');
      return;
    }
    if (newPassword.trim() !== confirmPassword.trim()) {
      onShowToast('নতুন পাসওয়ার্ড ও কনফার্ম পাসওয়ার্ড মিলছে না!', 'error');
      return;
    }

    onUpdateCredentials(newUsername.trim() || savedUsername, newPassword.trim());
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onShowToast('ইউজারনেম ও পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!', 'success');
  };

  // Slider editing helpers
  const handleAddSlide = () => {
    const newSlide: SliderItem = {
      id: `slide-${Date.now()}`,
      image_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&auto=format&fit=crop&q=80',
      badge: 'নতুন ব্যানার',
      title: 'নতুন স্লাইডার শিরোনাম',
      subtitle: 'এখানে আপনার স্লাইডারের বিবরণ যুক্ত করুন।',
      button_text: 'বিস্তারিত দেখুন',
      button_link: '#products'
    };
    const updated = {
      ...formData,
      Sliders: [...formData.Sliders, newSlide]
    };
    setFormData(updated);
    onUpdateData(updated);
    onShowToast('নতুন ১৬:৯ স্লাইডার যুক্ত করা হয়েছে!', 'success');
  };

  const handleRemoveSlide = (idx: number) => {
    const updatedSliders = formData.Sliders.filter((_, i) => i !== idx);
    const updated = { ...formData, Sliders: updatedSliders };
    setFormData(updated);
    onUpdateData(updated);
    onShowToast('স্লাইডার মুছে ফেলা হয়েছে!', 'info');
  };

  // Products helpers
  const handleAddProduct = () => {
    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      name: 'নতুন সেবা বা পণ্য',
      category: 'সাধারণ',
      price: '৳ ১,৫০০',
      image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      description: 'নতুন পণ্যের আকর্ষণীয় বিবরণ এখানে লিখুন।',
      button_text: 'অর্ডার করুন',
      button_link: '#contact'
    };
    const updated = {
      ...formData,
      Products: [...formData.Products, newProd]
    };
    setFormData(updated);
    onUpdateData(updated);
    onShowToast('নতুন পণ্য যুক্ত হয়েছে!', 'success');
  };

  const handleRemoveProduct = (idx: number) => {
    const updated = {
      ...formData,
      Products: formData.Products.filter((_, i) => i !== idx)
    };
    setFormData(updated);
    onUpdateData(updated);
    onShowToast('পণ্য তালিকা থেকে সরানো হয়েছে!', 'info');
  };

  // Gallery helpers
  const handleAddGalleryItem = () => {
    const newItem: GalleryItem = {
      image_uploaded: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=80',
      image_title: 'নতুন গ্যালারি ছবি',
      image_section: 'অফিস',
      description: 'ছবির সংক্ষিপ্ত বিবরণ।'
    };
    const updated = {
      ...formData,
      Gallery: [...formData.Gallery, newItem]
    };
    setFormData(updated);
    onUpdateData(updated);
    onShowToast('গ্যালারিতে নতুন ছবি যুক্ত হয়েছে!', 'success');
  };

  const handleRemoveGalleryItem = (idx: number) => {
    const updated = {
      ...formData,
      Gallery: formData.Gallery.filter((_, i) => i !== idx)
    };
    setFormData(updated);
    onUpdateData(updated);
    onShowToast('গ্যালারি ছবি সরানো হয়েছে!', 'info');
  };

  // Articles helpers
  const handleAddArticle = () => {
    const newArt: ArticleItem = {
      id: `art-${Date.now()}`,
      title: 'নতুন ব্লগ বা আপডেট শিরোনাম',
      category: 'সংবাদ',
      date: '২৪ আগস্ট, ২০২৬',
      description: 'ব্লগ পোস্টের সারসংক্ষেপ এখানে লিখুন।',
      content: 'এখানে আপনার বিস্তারিত কনটেন্ট যুক্ত করুন...',
      youtube_video_url: '',
      image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
      author: 'আরিফুল ইসলাম',
      read_time: '৩ মিনিট পঠন',
      link: '#'
    };
    const updated = {
      ...formData,
      "Article and update": [...formData["Article and update"], newArt]
    };
    setFormData(updated);
    onUpdateData(updated);
    onShowToast('নতুন আর্টিকেল যুক্ত হয়েছে!', 'success');
  };

  const handleRemoveArticle = (idx: number) => {
    const updated = {
      ...formData,
      "Article and update": formData["Article and update"].filter((_, i) => i !== idx)
    };
    setFormData(updated);
    onUpdateData(updated);
    onShowToast('আর্টিকেল সরানো হয়েছে!', 'info');
  };

  const handleRemoveMessage = (idx: number) => {
    const updated = {
      ...formData,
      "send Message": formData["send Message"].filter((_, i) => i !== idx)
    };
    setFormData(updated);
    onUpdateData(updated);
    onShowToast('বার্তা মুছে ফেলা হয়েছে!', 'info');
  };

  // Tab definitions
  const tabs = [
    { id: 'overview', label: 'সামগ্রিক তথ্য ও সারসংক্ষেপ', icon: Database, color: 'text-blue-400', badge: null },
    { id: 'settings', label: 'সাধারণ সেটিংস ও টাইটেল', icon: Settings, color: 'text-blue-400', badge: null },
    { id: 'sliders', label: '১৬:৯ ব্যানার স্লাইডার', icon: SlidersIcon, color: 'text-blue-400', badge: formData.Sliders.length },
    { id: 'products', label: 'পণ্য ও সেবাসমূহ', icon: Package, color: 'text-emerald-400', badge: formData.Products.length },
    { id: 'gallery', label: 'ফটো গ্যালারি', icon: ImageIcon, color: 'text-purple-400', badge: formData.Gallery.length },
    { id: 'articles', label: 'ব্লগ ও ভিডিও আপডেট', icon: FileText, color: 'text-amber-400', badge: formData["Article and update"].length },
    { id: 'messages', label: 'গ্রাহক বার্তা ইনবক্স', icon: MessageSquare, color: 'text-rose-400', badge: formData["send Message"].length },
    { id: 'gemini', label: 'জেমিনি এআই কনফিগারেশন', icon: Bot, color: 'text-purple-300', badge: 'AI' },
    { id: 'googlechat', label: 'গুগল চ্যাট ইনবক্স (লাইভ)', icon: MessageSquare, color: 'text-emerald-400', badge: 'Live' },
    { id: 'security', label: 'পাসওয়ার্ড ও নিরাপত্তা', icon: Lock, color: 'text-emerald-300', badge: null },
    { id: 'api', label: 'এপিআই সংযোগ ও সিঙ্ক', icon: ExternalLink, color: 'text-sky-400', badge: null },
    { id: 'codegs', label: 'অ্যাপস স্ক্রিপ্ট কোড', icon: Code, color: 'text-indigo-300', badge: null },
    { id: 'guide', label: 'ব্যবহার নির্দেশিকা', icon: BookOpen, color: 'text-amber-300', badge: null },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col font-serif-bn selection:bg-blue-600 selection:text-white overflow-hidden animate-in fade-in duration-200">
      
      {/* 1. TOP HEADER BAR */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-3 sm:px-6 flex items-center justify-between shrink-0 shadow-md z-20">
        
        {/* Left: Brand / Profile Info */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>

          <GoogleProfileAvatar
            src={formData.Settings.avatar_icon_url || formData.Settings.logo_url}
            alt={formData.Settings.site_title}
            size="xs"
            showBadge={true}
            animateRing={true}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-bold text-sm sm:text-base text-white leading-tight truncate">
                {formData.Settings.site_title || 'প্রবর্তন'}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-900/80 text-blue-300 border border-blue-700">
                এডমিন প্যানেল
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-tight truncate">
              গুগল শিট ও জেমিনি ৩.৭ এআই সিঙ্কড
            </p>
          </div>
        </div>

        {/* Right: Actions (Save All, Live Sync, Back to Site, Logout) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm cursor-pointer"
            title="সব পরিবর্তন সেভ করুন"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">সংরক্ষণ</span>
          </button>

          <button
            onClick={onSyncLive}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition disabled:opacity-50 shadow-sm cursor-pointer"
            title="গুগল শিট থেকে ডাটা আনুন"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? 'সিঙ্ক...' : 'লাইভ সিঙ্ক'}</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
            title="মূল ওয়েবসাইটে ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span className="hidden md:inline">ওয়েবসাইটে যান</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-bold border border-rose-800 transition cursor-pointer"
            title="লগআউট করুন"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">লগআউট</span>
          </button>

        </div>

      </header>

      {/* 2. HORIZONTAL SCROLLABLE TAB BAR (Visible on Mobile & Tablet for Ultra Fast Access) */}
      <div className="bg-slate-900/95 border-b border-slate-800 px-2 sm:px-4 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0 z-10">
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as AdminTab);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
              }`}
            >
              <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.color}`} />
              <span>{tab.label}</span>
              {tab.badge !== null && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-950 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. BODY LAYOUT: SIDEBAR (Desktop) + MAIN WORKSPACE */}
      <div className="flex flex-1 overflow-hidden bg-slate-950 relative">
        
        {/* DESKTOP SIDEBAR NAVIGATION */}
        <aside className="hidden lg:flex w-64 bg-slate-900 border-r border-slate-800 p-3 flex-col gap-1 overflow-y-auto shrink-0 shadow-lg">
          
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            সিস্টেম মেনু
          </div>

          {tabs.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition text-left cursor-pointer ${
                  isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : tab.color}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

        </aside>

        {/* MOBILE SLIDE-OUT MENU OVERLAY */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-30 bg-slate-950/80 backdrop-blur-sm lg:hidden flex">
            <div className="w-72 bg-slate-900 border-r border-slate-800 h-full p-4 flex flex-col gap-1 overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>এডমিন ট্যাবসমূহ</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {tabs.map((tab) => {
                const IconComp = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as AdminTab);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                      isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : tab.color}`} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge !== null && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        isActive ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* MAIN WORKSPACE CONTENT */}
        <main className="flex-1 bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">ওয়েবসাইট পরিসংখ্যান ও স্ট্যাটাস</h2>
                    <p className="text-xs text-slate-400">আপনার গুগল শিট, জেমিনি এআই ও সাইটের রিয়েল-টাইম অবস্থা</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('gemini')}
                      className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Bot className="w-4 h-4" />
                      <span>জেমিনি এআই সেটআপ</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('guide')}
                      className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>গাইড দেখুন</span>
                    </button>
                  </div>
                </div>

                {/* Status Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-xs font-bold text-blue-400 uppercase">১৬:৯ স্লাইডার</span>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{formData.Sliders.length}</p>
                    <span className="text-[11px] text-slate-400">হোম ব্যানার</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 uppercase">পণ্য ও সেবা</span>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{formData.Products.length}</p>
                    <span className="text-[11px] text-slate-400">লাইভ ক্যাটালগ</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-xs font-bold text-purple-400 uppercase">গ্যালারি ছবি</span>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{formData.Gallery.length}</p>
                    <span className="text-[11px] text-slate-400">ভিজ্যুয়াল শোকেস</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                    <span className="text-xs font-bold text-rose-400 uppercase">আগত বার্তা</span>
                    <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{formData["send Message"].length}</p>
                    <span className="text-[11px] text-slate-400">ইনবক্স জমা</span>
                  </div>
                </div>

                {/* Status Card: Gemini AI */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Bot className="w-4 h-4 text-purple-400" />
                      <span>Gemini 3.7 Flash AI চ্যাটবট স্ট্যাটাস</span>
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${geminiApiKey ? 'bg-purple-900 text-purple-200 border border-purple-700' : 'bg-slate-800 text-slate-400'}`}>
                      {geminiApiKey ? 'কাস্টম এপিআই কি অ্যাক্টিভ' : 'ডিফল্ট মোডে চালু'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    ভিজিটররা যেকোনো সময় ওয়েবসাইটের এআই চ্যাটবটের মাধ্যমে আপনার গুগল শিটের পণ্যের বিবরণ, দাম ও যোগাযোগের তথ্য জানতে পারেন।
                  </p>
                  <button
                    onClick={() => setActiveTab('gemini')}
                    className="text-xs text-purple-400 hover:text-purple-300 font-bold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                  >
                    <span>জেমিনি এপিআই কি পরিবর্তন বা পরীক্ষা করুন &rarr;</span>
                  </button>
                </div>

                {/* Status Card: Google Sheet URL */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>গুগল শিট এপিআই কানেকশন স্ট্যাটাস</span>
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${appsScriptUrl ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                      {appsScriptUrl ? 'কানেক্টেড' : 'ইউআরএল সেট করা নেই'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono break-all bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    {appsScriptUrl || 'কোনো ইউআরএল নেই — "এপিআই কনফিগ" ট্যাবে গিয়ে আপনার গুগল অ্যাপস স্ক্রিপ্ট ইউআরএল দিন।'}
                  </p>
                </div>
              </div>
            )}

            {/* TAB: SETTINGS & SECTION TITLES (সম্পূর্ণ সেটিংস, সামাজিক যোগাযোগ ও সেকশন টাইটেল এডিটর) */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">ওয়েবসাইট, প্রোফাইল ও টাইটেল সেটিংস</h2>
                    <p className="text-xs text-slate-400">প্রতিটি সেকশনের টাইটেল, সাবটাইটেল, সোশ্যাল মিডিয়া ও প্রোফাইল ডাটা এডিট করুন</p>
                  </div>
                  <button
                    onClick={handleSaveAll}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>সংরক্ষণ করুন</span>
                  </button>
                </div>

                {/* 1. Basic Site Info */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>মূল ওয়েবসাইট ও ব্র্যান্ডিং</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">ওয়েবসাইটের নাম (Site Title)</label>
                      <input
                        type="text"
                        value={formData.Settings.site_title || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, site_title: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">প্রাইমারি থিম কালার (Hex Code)</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={formData.Settings.primary_color || '#1d4ed8'}
                          onChange={(e) => setFormData({
                            ...formData,
                            Settings: { ...formData.Settings, primary_color: e.target.value }
                          })}
                          className="h-10 w-12 rounded-xl bg-slate-950 border border-slate-700 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.Settings.primary_color || '#1d4ed8'}
                          onChange={(e) => setFormData({
                            ...formData,
                            Settings: { ...formData.Settings, primary_color: e.target.value }
                          })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        গোল প্রোফাইল ছবি / Google Drive Image URL or ID
                      </label>
                      <input
                        type="text"
                        value={formData.Settings.avatar_icon_url || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, avatar_icon_url: e.target.value }
                        })}
                        placeholder="https://... অথবা Google Drive ID"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <span className="text-[10px] text-slate-400">Google Drive ID দিলে স্বয়ংক্রিয়ভাবে lh3.googleusercontent.com/d/ID এ রূপান্তরিত হবে।</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        AI চ্যাটবট আইকন / Avatar URL
                      </label>
                      <input
                        type="text"
                        value={formData.Settings.chatbot_avatar_url || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, chatbot_avatar_url: e.target.value }
                        })}
                        placeholder="চ্যাটবট আইকনের ইমেজ ইউআরএল"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Personal Profile Hero Section Inputs */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>প্রোফাইল সেকশন (স্লাইডারের নিচের অংশ)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">পদবি / পেশা (Designation)</label>
                      <input
                        type="text"
                        value={formData.Settings.about_me_designation || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, about_me_designation: e.target.value }
                        })}
                        placeholder="যেমন: ফুলস্ট্যাক ওয়েব ডেভেলপার"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">অভিজ্ঞতা ব্যাজ (Experience Badge)</label>
                      <input
                        type="text"
                        value={formData.Settings.profile_experience_badge || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, profile_experience_badge: e.target.value }
                        })}
                        placeholder="যেমন: ৫+ বছরের অভিজ্ঞতা"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">প্রোফাইল সংক্ষিপ্ত বিবরণ (Bio / Summary)</label>
                    <textarea
                      rows={3}
                      value={formData.Settings.about_me_summary || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        Settings: { ...formData.Settings, about_me_summary: e.target.value }
                      })}
                      placeholder="আপনার কর্মদক্ষতা ও সেবা সম্পর্কে লিখুন..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">প্রোফাইল বাটন ১ টেক্সট</label>
                      <input
                        type="text"
                        value={formData.Settings.profile_btn1_text || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, profile_btn1_text: e.target.value }
                        })}
                        placeholder="যোগাযোগ করুন"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">প্রোফাইল বাটন ১ লিংক</label>
                      <input
                        type="text"
                        value={formData.Settings.profile_btn1_link || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, profile_btn1_link: e.target.value }
                        })}
                        placeholder="#contact"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Section Titles and Subtitles */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
                  <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    <span>সেকশন শিরোনাম ও সাবটাইটেল কনফিগারেশন</span>
                  </h3>

                  {/* Products Section Titles */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-xs text-slate-200">পণ্য ও সেবা সেকশন (Products Section)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={formData.Settings.products_section_badge || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, products_section_badge: e.target.value }
                        })}
                        placeholder="ব্যাজ: আমাদের সেবা ও পণ্য"
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={formData.Settings.products_section_title || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, products_section_title: e.target.value }
                        })}
                        placeholder="শিরোনাম: প্রিমিয়াম প্যাকেজ ও সেবাসমূহ"
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={formData.Settings.products_section_subtitle || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, products_section_subtitle: e.target.value }
                        })}
                        placeholder="সাবটাইটেল: গুগল শিট থেকে পরিচালিত..."
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Gallery Section Titles */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-xs text-slate-200">ফটো গ্যালারি সেকশন (Gallery Section)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={formData.Settings.gallery_section_badge || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, gallery_section_badge: e.target.value }
                        })}
                        placeholder="ব্যাজ: ফটো গ্যালারি"
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={formData.Settings.gallery_section_title || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, gallery_section_title: e.target.value }
                        })}
                        placeholder="শিরোনাম: কাজের দৃশ্য ও মুহূর্ত"
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={formData.Settings.gallery_section_subtitle || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, gallery_section_subtitle: e.target.value }
                        })}
                        placeholder="সাবটাইটেল: গুগল স্প্রেডশিট গ্যালারি..."
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Articles Section Titles */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-xs text-slate-200">ব্লগ ও ভিডিও সেকশন (Articles Section)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={formData.Settings.articles_section_badge || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, articles_section_badge: e.target.value }
                        })}
                        placeholder="ব্যাজ: খবর ও ব্লগ পোস্ট"
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={formData.Settings.articles_section_title || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, articles_section_title: e.target.value }
                        })}
                        placeholder="শিরোনাম: সর্বশেষ আপডেট ও ভিডিও"
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={formData.Settings.articles_section_subtitle || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, articles_section_subtitle: e.target.value }
                        })}
                        placeholder="সাবটাইটেল: সরাসরি পরিচালিত..."
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Contact Section Titles */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="font-bold text-xs text-slate-200">যোগাযোগ সেকশন (Contact Section)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={formData.Settings.contact_section_badge || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, contact_section_badge: e.target.value }
                        })}
                        placeholder="ব্যাজ: যোগাযোগের তথ্য"
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={formData.Settings.contact_section_title || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, contact_section_title: e.target.value }
                        })}
                        placeholder="শিরোনাম: আমাদের সাথে সরাসরি কথা বলুন"
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={formData.Settings.contact_section_subtitle || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, contact_section_subtitle: e.target.value }
                        })}
                        placeholder="সাবটাইটেল: যেকোনো প্রশ্ন..."
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Social Media URLs */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    <span>সামাজিক যোগাযোগ লিংকসমূহ (Social Media Links)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">Facebook URL</label>
                      <input
                        type="text"
                        value={formData.Settings.facebook_url || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, facebook_url: e.target.value }
                        })}
                        placeholder="https://facebook.com/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">YouTube URL</label>
                      <input
                        type="text"
                        value={formData.Settings.youtube_url || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, youtube_url: e.target.value }
                        })}
                        placeholder="https://youtube.com/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">WhatsApp নম্বর বা লিংক</label>
                      <input
                        type="text"
                        value={formData.Settings.whatsapp_url || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, whatsapp_url: e.target.value }
                        })}
                        placeholder="+8801700000000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">Telegram লিংক বা ইউজারনেম</label>
                      <input
                        type="text"
                        value={formData.Settings.telegram_url || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, telegram_url: e.target.value }
                        })}
                        placeholder="https://t.me/username"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">LinkedIn URL</label>
                      <input
                        type="text"
                        value={formData.Settings.linkedin_url || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, linkedin_url: e.target.value }
                        })}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">GitHub URL</label>
                      <input
                        type="text"
                        value={formData.Settings.github_url || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, github_url: e.target.value }
                        })}
                        placeholder="https://github.com/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Contact Details */}
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>যোগাযোগের ঠিকানা ও তথ্য</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">ইমেইল ঠিকানা</label>
                      <input
                        type="email"
                        value={formData.Settings.contact_email || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, contact_email: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">ফোন নম্বর</label>
                      <input
                        type="tel"
                        value={formData.Settings.contact_phone || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, contact_phone: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">অফিস ঠিকানা</label>
                      <input
                        type="text"
                        value={formData.Settings.contact_address || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          Settings: { ...formData.Settings, contact_address: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: SLIDERS (১৬:৯ স্লাইডার) */}
            {activeTab === 'sliders' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">১৬:৯ ইমেজ স্লাইডার পরিচালনা</h2>
                    <p className="text-xs text-slate-400">ওয়েবসাইটের হোমপেজের ১৬:৯ অ্যাসপেক্ট রেশিও স্লাইডার ইমেজ ও টেক্সট যুক্ত করুন</p>
                  </div>
                  <button
                    onClick={handleAddSlide}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন স্লাইড</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.Sliders.map((slide, idx) => {
                    const previewImg = formatImageUrl(slide.image_url);
                    return (
                      <div key={slide.id || idx} className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                          <span className="text-xs font-bold text-blue-400">স্লাইড #{idx + 1}</span>
                          <button
                            onClick={() => handleRemoveSlide(idx)}
                            className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-950/60 transition cursor-pointer"
                            title="স্লাইড মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                          {/* Image preview 16:9 */}
                          <div className="md:col-span-4 aspect-video rounded-xl bg-slate-950 overflow-hidden border border-slate-800 relative">
                            <img
                              src={previewImg}
                              alt={slide.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&auto=format&fit=crop&q=80';
                              }}
                            />
                            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-slate-300 font-mono">
                              16:9
                            </span>
                          </div>

                          {/* Inputs */}
                          <div className="md:col-span-8 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-400">ইমেজ URL অথবা Google Drive ID</label>
                                <input
                                  type="text"
                                  value={slide.image_url}
                                  onChange={(e) => {
                                    const updated = [...formData.Sliders];
                                    updated[idx].image_url = e.target.value;
                                    setFormData({ ...formData, Sliders: updated });
                                  }}
                                  placeholder="Drive ID or Image Link"
                                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-400">ট্যাগ / ব্যাজ</label>
                                <input
                                  type="text"
                                  value={slide.badge}
                                  onChange={(e) => {
                                    const updated = [...formData.Sliders];
                                    updated[idx].badge = e.target.value;
                                    setFormData({ ...formData, Sliders: updated });
                                  }}
                                  placeholder="যেমন: অফার / নতুন সেবা"
                                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-400">স্লাইডার শিরোনাম (Title)</label>
                              <input
                                type="text"
                                value={slide.title}
                                onChange={(e) => {
                                  const updated = [...formData.Sliders];
                                  updated[idx].title = e.target.value;
                                  setFormData({ ...formData, Sliders: updated });
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-400">বিবরণ (Subtitle)</label>
                              <input
                                type="text"
                                value={slide.subtitle}
                                onChange={(e) => {
                                  const updated = [...formData.Sliders];
                                  updated[idx].subtitle = e.target.value;
                                  setFormData({ ...formData, Sliders: updated });
                                }}
                                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={slide.button_text}
                                onChange={(e) => {
                                  const updated = [...formData.Sliders];
                                  updated[idx].button_text = e.target.value;
                                  setFormData({ ...formData, Sliders: updated });
                                }}
                                placeholder="বাটন টেক্সট"
                                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <input
                                type="text"
                                value={slide.button_link}
                                onChange={(e) => {
                                  const updated = [...formData.Sliders];
                                  updated[idx].button_link = e.target.value;
                                  setFormData({ ...formData, Sliders: updated });
                                }}
                                placeholder="বাটন লিংক"
                                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: PRODUCTS (পণ্য ও সেবা) */}
            {activeTab === 'products' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">পণ্য ও সেবাসমূহ পরিচালনা</h2>
                    <p className="text-xs text-slate-400">ক্যাটালগে নতুন আইটেম যুক্ত করুন অথবা বিদ্যমান তথ্য পরিবর্তন করুন</p>
                  </div>
                  <button
                    onClick={handleAddProduct}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন পণ্য</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.Products.map((prod, idx) => {
                    const formattedImg = formatImageUrl(prod.image_url);
                    return (
                      <div key={prod.id || idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400">পণ্য #{idx + 1}</span>
                          <button
                            onClick={() => handleRemoveProduct(idx)}
                            className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-950/60 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex gap-3 items-center">
                          <div className="w-16 h-16 rounded-xl bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                            <img src={formattedImg} alt={prod.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={prod.name}
                              onChange={(e) => {
                                const updated = [...formData.Products];
                                updated[idx].name = e.target.value;
                                setFormData({ ...formData, Products: updated });
                              }}
                              placeholder="পণ্যের নাম"
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold text-xs outline-none"
                            />
                            <div className="grid grid-cols-2 gap-2 mt-1.5">
                              <input
                                type="text"
                                value={prod.category}
                                onChange={(e) => {
                                  const updated = [...formData.Products];
                                  updated[idx].category = e.target.value;
                                  setFormData({ ...formData, Products: updated });
                                }}
                                placeholder="ক্যাটাগরি"
                                className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 text-[11px] outline-none"
                              />
                              <input
                                type="text"
                                value={prod.price}
                                onChange={(e) => {
                                  const updated = [...formData.Products];
                                  updated[idx].price = e.target.value;
                                  setFormData({ ...formData, Products: updated });
                                }}
                                placeholder="মূল্য"
                                className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-emerald-400 font-bold text-[11px] outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <input
                          type="text"
                          value={prod.image_url}
                          onChange={(e) => {
                            const updated = [...formData.Products];
                            updated[idx].image_url = e.target.value;
                            setFormData({ ...formData, Products: updated });
                          }}
                          placeholder="ইমেজ URL অথবা Google Drive ID"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 text-xs outline-none"
                        />

                        <textarea
                          rows={2}
                          value={prod.description}
                          onChange={(e) => {
                            const updated = [...formData.Products];
                            updated[idx].description = e.target.value;
                            setFormData({ ...formData, Products: updated });
                          }}
                          placeholder="পণ্যের বিবরণ..."
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 text-xs outline-none resize-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: GALLERY (ফটো গ্যালারি) */}
            {activeTab === 'gallery' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">ফটো গ্যালারি পরিচালনা</h2>
                    <p className="text-xs text-slate-400">গ্যালারিতে সরাসরি ছবি বা Google Drive ID যুক্ত করুন</p>
                  </div>
                  <button
                    onClick={handleAddGalleryItem}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন ছবি</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {formData.Gallery.map((item, idx) => {
                    const formattedImg = formatImageUrl(item.image_uploaded);
                    return (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                        <div className="aspect-video rounded-xl bg-slate-950 overflow-hidden relative border border-slate-800">
                          <img src={formattedImg} alt={item.image_title} className="w-full h-full object-cover" />
                          <button
                            onClick={() => handleRemoveGalleryItem(idx)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition cursor-pointer shadow-md"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={item.image_uploaded}
                          onChange={(e) => {
                            const updated = [...formData.Gallery];
                            updated[idx].image_uploaded = e.target.value;
                            setFormData({ ...formData, Gallery: updated });
                          }}
                          placeholder="ইমেজ URL অথবা Google Drive ID"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 text-xs outline-none"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={item.image_title}
                            onChange={(e) => {
                              const updated = [...formData.Gallery];
                              updated[idx].image_title = e.target.value;
                              setFormData({ ...formData, Gallery: updated });
                            }}
                            placeholder="ছবির শিরোনাম"
                            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-semibold text-xs outline-none"
                          />
                          <input
                            type="text"
                            value={item.image_section}
                            onChange={(e) => {
                              const updated = [...formData.Gallery];
                              updated[idx].image_section = e.target.value;
                              setFormData({ ...formData, Gallery: updated });
                            }}
                            placeholder="ক্যাটাগরি"
                            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 text-xs outline-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: ARTICLES & YOUTUBE VIDEOS (ব্লগ ও ইউটিউব ভিডিও) */}
            {activeTab === 'articles' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">ব্লগ পোস্ট ও ইউটিউব ভিডিও আপডেট</h2>
                    <p className="text-xs text-slate-400">ইউটিউব ভিডিওর লিংক বা আইডি দিলে স্বয়ংক্রিয়ভাবে ভিডিও এম্বেড হবে</p>
                  </div>
                  <button
                    onClick={handleAddArticle}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন আর্টিকেল</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData["Article and update"].map((art, idx) => {
                    const videoUrl = art.youtube_video_url || (art as any).video_url;
                    return (
                      <div key={art.id || idx} className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-xs font-bold text-amber-400">পোস্ট #{idx + 1}</span>
                          <button
                            onClick={() => handleRemoveArticle(idx)}
                            className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-950/60 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-[11px] font-bold text-slate-400">শিরোনাম</label>
                            <input
                              type="text"
                              value={art.title}
                              onChange={(e) => {
                                const updated = [...formData["Article and update"]];
                                updated[idx].title = e.target.value;
                                setFormData({ ...formData, "Article and update": updated });
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-400">ক্যাটাগরি</label>
                            <input
                              type="text"
                              value={art.category}
                              onChange={(e) => {
                                const updated = [...formData["Article and update"]];
                                updated[idx].category = e.target.value;
                                setFormData({ ...formData, "Article and update": updated });
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-400">ইমেজ URL অথবা Google Drive ID</label>
                            <input
                              type="text"
                              value={art.image_url}
                              onChange={(e) => {
                                const updated = [...formData["Article and update"]];
                                updated[idx].image_url = e.target.value;
                                setFormData({ ...formData, "Article and update": updated });
                              }}
                              placeholder="Drive ID or Image link"
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-red-400 flex items-center gap-1">
                              <Video className="w-3.5 h-3.5" />
                              <span>YouTube ভিডিও লিংক / Video ID (ঐচ্ছিক)</span>
                            </label>
                            <input
                              type="text"
                              value={art.youtube_video_url || ''}
                              onChange={(e) => {
                                const updated = [...formData["Article and update"]];
                                updated[idx].youtube_video_url = e.target.value;
                                setFormData({ ...formData, "Article and update": updated });
                              }}
                              placeholder="https://youtube.com/watch?v=... অথবা Video ID"
                              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-400">সংক্ষিপ্ত বিবরণ</label>
                          <textarea
                            rows={2}
                            value={art.description}
                            onChange={(e) => {
                              const updated = [...formData["Article and update"]];
                              updated[idx].description = e.target.value;
                              setFormData({ ...formData, "Article and update": updated });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs outline-none resize-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: MESSAGES (বার্তা ইনবক্স) */}
            {activeTab === 'messages' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">আগত বার্তা ইনবক্স (send Message)</h2>
                    <p className="text-xs text-slate-400">ওয়েবসাইট থেকে ভিজিটরদের পাঠানো বার্তাগুলো এখানে রিয়েল-টাইমে প্রদর্শিত হয়</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800">
                    মোট বার্তা: {formData["send Message"].length}
                  </span>
                </div>

                {formData["send Message"].length === 0 ? (
                  <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                    <MessageSquare className="w-10 h-10 text-slate-600 mx-auto" />
                    <p className="text-sm text-slate-400">এখনো কোনো নতুন বার্তা আসেনি।</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData["send Message"].map((msg, idx) => (
                      <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{msg.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                              {msg.timestamp}
                            </span>
                          </div>
                          <button
                            onClick={() => handleRemoveMessage(idx)}
                            className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-950/60 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                          {msg.email && <span>ইমেইল: <strong className="text-blue-400">{msg.email}</strong></span>}
                          {msg.phone && <span>ফোন: <strong className="text-emerald-400">{msg.phone}</strong></span>}
                        </div>

                        <p className="p-3 rounded-xl bg-slate-950 text-xs sm:text-sm text-slate-200 border border-slate-800 whitespace-pre-wrap leading-relaxed">
                          {msg.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: GEMINI AI CONFIG */}
            {activeTab === 'gemini' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="pb-4 border-b border-slate-800">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-950 text-purple-300 border border-purple-800 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Gemini 3.7 Flash AI ইন্টিগ্রেশন</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">জেমিনি এআই কনফিগারেশন</h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    এখানে আপনার নিজস্ব Google Gemini API Key যুক্ত ও পরিবর্তন করতে পারবেন।
                  </p>
                </div>

                {/* API Key Form */}
                <form onSubmit={handleSaveGeminiKey} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Gemini API Key (জেমিনি এপিআই কি)
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={geminiKeyInput}
                        onChange={(e) => setGeminiKeyInput(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-sm placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">
                      আপনার কিটি সুরক্ষিতভাবে সংরক্ষিত থাকবে এবং চ্যাটবট রেসপন্স তৈরিতে ব্যবহৃত হবে।
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>এপিআই কি সেভ করুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleTestGeminiConnection}
                      disabled={isTestingGemini}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs sm:text-sm border border-slate-700 transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      <Bot className={`w-4 h-4 ${isTestingGemini ? 'animate-spin' : ''}`} />
                      <span>{isTestingGemini ? 'টেস্ট চলছে...' : 'টেস্ট কানেকশন (Test API)'}</span>
                    </button>
                  </div>

                  {/* Test Output Box */}
                  {geminiTestResult && (
                    <div className={`p-4 rounded-xl text-xs font-mono border mt-3 ${
                      geminiTestResult.success
                        ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
                        : 'bg-rose-950/80 border-rose-800 text-rose-200'
                    }`}>
                      <p className="font-bold mb-1 flex items-center gap-1.5">
                        {geminiTestResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                        <span>{geminiTestResult.success ? 'টেস্ট সফল হয়েছে:' : 'টেস্ট ব্যর্থ হয়েছে:'}</span>
                      </p>
                      <p>{geminiTestResult.text}</p>
                    </div>
                  )}
                </form>

                {/* How to get a free API key */}
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-400" />
                    <span>কীভাবে বিনামূল্যে Gemini API Key পাবেন?</span>
                  </h3>
                  <ol className="text-xs sm:text-sm text-slate-400 space-y-2 pl-4 list-decimal leading-relaxed">
                    <li>
                      <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-purple-400 font-bold underline">
                        Google AI Studio (aistudio.google.com)
                      </a> এ আপনার গুগল অ্যাকাউন্ট দিয়ে লগইন করুন।
                    </li>
                    <li><strong>"Create API key"</strong> বাটনে ক্লিক করে একটি নতুন API Key তৈরি করুন।</li>
                    <li>তৈরিকৃত কী-টি কপি করে উপরের বক্সে পেস্ট করে <strong>"এপিআই কি সেভ করুন"</strong> বাটনে ক্লিক করুন।</li>
                  </ol>
                </div>
              </div>
            )}

            {/* TAB: GOOGLE CHAT INBOX (এডমিন ও ইউজার গুগল চ্যাট) */}
            {activeTab === 'googlechat' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="pb-4 border-b border-slate-800">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 mb-2">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Google Chat API লাইভ মেসেজিং</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">গুগল চ্যাট ইনবক্স ও যোগাযোগ</h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    ব্যবহারকারী ও কাস্টমারদের সাথে গুগল চ্যাটের মাধ্যমে সরাসরি এসএমএস ও চ্যাট রুম ম্যানেজ করুন।
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl h-[580px] flex flex-col">
                  <GoogleChatTab
                    primaryColor="#2563eb"
                    adminEmail={formData.Settings.contact_email || 'arifulislam.qinfo@gmail.com'}
                  />
                </div>
              </div>
            )}

            {/* TAB: SECURITY & PASSWORD (পাসওয়ার্ড পরিবর্তন ও রিসেট গাইড) */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="pb-4 border-b border-slate-800">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>প্রবেশাধিকার ও পাসওয়ার্ড নিয়ন্ত্রণ</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">পাসওয়ার্ড ও ইউজারনেম পরিবর্তন</h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    এডমিন প্যানেলে প্রবেশের ইউজারনেম এবং পাসওয়ার্ড যেকোনো সময় আপডেট করুন।
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <form onSubmit={handleUpdatePasswordSubmit} className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                    
                    {/* Current info notice */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                      <span>বর্তমান ইউজারনেম: <strong className="text-blue-400">{savedUsername}</strong></span>
                      <span className="text-[11px] text-emerald-400 font-mono">সুরক্ষিত মোড</span>
                    </div>

                    {/* New Username */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        ইউজার নেম (Username)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder="যেমন: ariful"
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    {/* Old Password */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        বর্তমান পাসওয়ার্ড (Current Password)
                      </label>
                      <div className="relative">
                        <input
                          type={showPass ? 'text' : 'password'}
                          required
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="বর্তমান পাসওয়ার্ড দিন"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass(!showPass)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white cursor-pointer"
                        >
                          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        নতুন পাসওয়ার্ড (New Password)
                      </label>
                      <input
                        type={showPass ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="নতুন পাসওয়ার্ড লিখুন"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        কনফার্ম নতুন পাসওয়ার্ড
                      </label>
                      <input
                        type={showPass ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="নতুন পাসওয়ার্ডটি আবার লিখুন"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>পাসওয়ার্ড পরিবর্তন করুন</span>
                      </button>
                    </div>

                  </form>

                  {/* Password Forgot & Reset Guide */}
                  <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-blue-900/60 space-y-4">
                    <h3 className="font-bold text-sm text-blue-400 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />
                      <span>পাসওয়ার্ড ভুলে গেলে করণীয়</span>
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      যদি কোনো কারণে এডমিন পাসওয়ার্ড ভুলে যান, তবে সহজেই গুগল অ্যাপস স্ক্রিপ্ট বা শিট থেকে তা রিসেট করতে পারবেন:
                    </p>
                    <ol className="list-decimal pl-4 space-y-2 text-xs text-slate-400 leading-relaxed">
                      <li>আপনার কানেক্টেড <strong>Google Spreadsheet</strong> ওপেন করুন।</li>
                      <li>মেনু থেকে <strong>Extensions &gt; Apps Script</strong> এ যান।</li>
                      <li>Apps Script ফাইলে <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">ADMIN_DEFAULT_PASSWORD</code> ভেরিয়েবল পরিবর্তন করুন অথবা <strong>resetAdminPassword()</strong> ফাংশন রান করুন।</li>
                      <li>তাৎক্ষণিকভাবে ব্রাউজারের Local Storage ক্লিয়ার করলে পাসওয়ার্ড ডিফল্ট (<code className="text-emerald-400">180655</code>) এ রিসেট হয়ে যাবে।</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: GOOGLE SHEET API CONFIG */}
            {activeTab === 'api' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="pb-4 border-b border-slate-800">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">গুগল শিট এপিআই (Google Apps Script URL)</h2>
                  <p className="text-xs text-slate-400">আপনার Google Apps Script ওয়েব অ্যাপ্লিকেশনের URL এখানে সেট করুন</p>
                </div>

                <form onSubmit={handleSaveApiUrl} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">Google Apps Script Web App URL</label>
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>ইউআরএল সেভ করুন</span>
                    </button>
                    <button
                      type="button"
                      onClick={onSyncLive}
                      disabled={isSyncing}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs sm:text-sm border border-slate-700 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'এখনই ডাটা সিঙ্ক করুন'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: CODE.GS SCRIPT */}
            {activeTab === 'codegs' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Google Apps Script Code.gs</h2>
                    <p className="text-xs text-slate-400">এই কোডটি কপি করে আপনার গুগল শিটের Apps Script এ পেস্ট করুন</p>
                  </div>
                  <button
                    onClick={handleCopyCodeGs}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedCode ? 'কপি হয়েছে!' : 'কোড কপি করুন'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <pre className="text-xs font-mono text-slate-300 overflow-x-auto max-h-96 p-4 rounded-xl bg-slate-950 border border-slate-800 leading-relaxed">
                    {CODE_GS_SCRIPT}
                  </pre>
                </div>
              </div>
            )}

            {/* TAB: SETUP GUIDE */}
            {activeTab === 'guide' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="pb-4 border-b border-slate-800">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-950 text-amber-300 border border-amber-800 mb-2">
                    সহজ ৩-ধাপের টিউটোরিয়াল
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    গুগল শিট সিএমএস ওয়েবসাইট পরিচালনা গাইড
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    নিচের ৩টি সহজ ধাপ অনুসরণ করে আপনার নিজস্ব গুগল শিটের সাথে ওয়েবসাইটটি যুক্ত করুন:
                  </p>
                </div>

                {/* Step 1 */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">১</span>
                    <h3 className="font-bold text-white text-sm sm:text-base">আপনার গুগল স্প্রেডশিট ওপেন করুন ও স্ক্রিপ্ট এডিটর খুলুন</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 pl-9 leading-relaxed">
                    আপনার তৈরি স্প্রেডশিট লিঙ্ক: <a href="https://docs.google.com/spreadsheets/d/1lBQGVctd6OK0-YInzM8FfKUoUqzRkB_7IgEY5_fRAgI/edit" target="_blank" rel="noreferrer" className="text-blue-400 font-bold underline break-all">Google Spreadsheet খুলুন</a>। এরপর মেনুবার থেকে <strong>Extensions &gt; Apps Script</strong> এ ক্লিক করুন।
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">২</span>
                    <h3 className="font-bold text-white text-sm sm:text-base">Code.gs কোড পেস্ট করুন এবং setupSheets ফাংশন রান করুন</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 pl-9 leading-relaxed">
                    Apps Script এডিটর উইন্ডোতে থাকা পূর্বের সব কোড মুছে দিন। এরপর পাশের <strong>Code.gs কোড</strong> ট্যাব থেকে <strong>"কোড কপি করুন"</strong> বাটনে ক্লিক করে পুরো কোডটি পেস্ট করুন। ফাইলটি Save (Ctrl+S) করুন। ড্রপডাউন থেকে <code>setupSheets</code> সিলেক্ট করে <strong>Run</strong> এ ক্লিক করুন (অনুমতি চাইলে এক্সেস Allow দিন)। এতে স্বয়ংক্রিয়ভাবে সকল শিট ও কলাম তৈরি হয়ে যাবে।
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">৩</span>
                    <h3 className="font-bold text-white text-sm sm:text-base">Deploy as Web App এবং URL যুক্ত করুন</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 pl-9 leading-relaxed">
                    Apps Script এর উপরে ডানপাশে <strong>Deploy &gt; New deployment</strong> এ ক্লিক করুন। গিয়ার আইকন থেকে <strong>Web app</strong> সিলেক্ট করুন। <em>Execute as</em>: <strong>Me</strong> এবং <em>Who has access</em>: <strong>Anyone</strong> দিয়ে <strong>Deploy</strong> এ ক্লিক করুন। তৈরিকৃত Web App URL-টি কপি করে এডমিন প্যানেলের <strong>"এপিআই কনফিগ"</strong> ট্যাবে পেস্ট করুন।
                  </p>
                </div>
              </div>
            )}

          </div>
        </main>

      </div>

    </div>
  );
};
