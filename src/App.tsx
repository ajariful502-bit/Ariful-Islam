import React, { useState, useEffect } from 'react';
import { GoogleSheetDatabase, MessageItem } from './types';
import { DEFAULT_SHEET_DATA } from './data/defaultSheetData';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { ProfileHeroSection } from './components/ProfileHeroSection';
import { AboutSection } from './components/AboutSection';
import { ProductsSection } from './components/ProductsSection';
import { GallerySection } from './components/GallerySection';
import { ArticlesSection } from './components/ArticlesSection';
import { ContactSection } from './components/ContactSection';
import { AboutMeSummary } from './components/AboutMeSummary';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { ChatbotAgent } from './components/ChatbotAgent';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  // State for Google Sheet database
  const [sheetData, setSheetData] = useState<GoogleSheetDatabase>(() => {
    const saved = localStorage.getItem('gs_cms_database');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.Sliders || parsed.Sliders.length === 0) {
          parsed.Sliders = DEFAULT_SHEET_DATA.Sliders;
        }
        return parsed;
      } catch (e) {
        return DEFAULT_SHEET_DATA;
      }
    }
    return DEFAULT_SHEET_DATA;
  });

  const [appsScriptUrl, setAppsScriptUrl] = useState<string>(() => {
    return localStorage.getItem('gs_api_url') || '';
  });

  // Admin Credentials (default username: ariful, password: 180655)
  const [savedUsername, setSavedUsername] = useState<string>(() => {
    return localStorage.getItem('admin_username') || 'ariful';
  });

  const [savedPassword, setSavedPassword] = useState<string>(() => {
    return localStorage.getItem('admin_password') || '180655';
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_logged_in') === 'true';
  });

  // Gemini API Key state (saved in localStorage and accessible from Admin Panel)
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    return localStorage.getItem('gemini_api_key') || sheetData.Settings.gemini_api_key || '';
  });

  // Dedicated Full-Page View state for Admin
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Auto persist sheetData
  useEffect(() => {
    localStorage.setItem('gs_cms_database', JSON.stringify(sheetData));
  }, [sheetData]);

  // Persist API URL
  const handleUpdateUrl = (newUrl: string) => {
    setAppsScriptUrl(newUrl);
    localStorage.setItem('gs_api_url', newUrl);
  };

  // Update Gemini Key
  const handleUpdateGeminiKey = (newKey: string) => {
    setGeminiApiKey(newKey);
    localStorage.setItem('gemini_api_key', newKey);
    setSheetData(prev => ({
      ...prev,
      Settings: { ...prev.Settings, gemini_api_key: newKey }
    }));
  };

  // Update Admin Credentials
  const handleUpdateCredentials = (newUser: string, newPass: string) => {
    setSavedUsername(newUser);
    setSavedPassword(newPass);
    localStorage.setItem('admin_username', newUser);
    localStorage.setItem('admin_password', newPass);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('admin_logged_in', 'true');
    showToast('এডমিন প্যানেলে স্বাগতম!', 'success');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('admin_logged_in');
    setIsAdminOpen(false);
    showToast('এডমিন সেশন থেকে সফলভাবে লগআউট করা হয়েছে।', 'info');
  };

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync live from Google Apps Script Web App
  const handleSyncLive = async () => {
    if (!appsScriptUrl.trim()) {
      showToast('গুগল অ্যাপস স্ক্রিপ্ট এপিআই ইউআরএল সেট করা নেই। এডমিন প্যানেলের "এপিআই কনফিগ" ট্যাবে ইউআরএল দিন।', 'info');
      return;
    }

    setIsSyncing(true);
    try {
      const url = `${appsScriptUrl.trim()}?action=getAllData&_t=${Date.now()}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`সার্ভার এরর: HTTP ${res.status}`);
      const json = await res.json();

      if (json.status === 'success' && json.data) {
        setSheetData(prev => ({
          Settings: json.data.Settings || prev.Settings,
          Sliders: json.data.Sliders?.length ? json.data.Sliders : prev.Sliders,
          Menu: json.data.Menu?.length ? json.data.Menu : prev.Menu,
          about: json.data.about?.length ? json.data.about : prev.about,
          Products: json.data.Products?.length ? json.data.Products : prev.Products,
          Gallery: json.data.Gallery?.length ? json.data.Gallery : prev.Gallery,
          "Article and update": json.data["Article and update"]?.length ? json.data["Article and update"] : prev["Article and update"],
          "send Message": json.data["send Message"] || prev["send Message"]
        }));
        showToast('গুগল শিট থেকে সমস্ত ডাটা সফলভাবে সিঙ্ক হয়েছে!', 'success');
      } else {
        throw new Error(json.message || 'গুগল শিট থেকে সঠিক ফরম্যাটে ডাটা আসেনি।');
      }
    } catch (err: any) {
      console.error('Sync failed:', err);
      showToast('ডাটা সিঙ্ক করতে ব্যর্থ: ' + (err.message || 'নেটওয়ার্ক সমস্যা'), 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleNewMessage = (newMsg: MessageItem) => {
    setSheetData(prev => ({
      ...prev,
      "send Message": [newMsg, ...prev["send Message"]]
    }));
  };

  const primaryColor = sheetData.Settings.primary_color || '#1d4ed8';

  // --- DEDICATED FULL-PAGE VIEW FOR ADMIN PANEL ---
  if (isAdminOpen) {
    if (!isAdminLoggedIn) {
      return (
        <>
          {toastMessage && (
            <div className="fixed top-6 right-5 z-50 animate-in slide-in-from-top-3 duration-300">
              <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-bold ${
                toastMessage.type === 'success' ? 'bg-emerald-600 text-white border-emerald-700' :
                toastMessage.type === 'error' ? 'bg-rose-600 text-white border-rose-700' :
                'bg-slate-900 text-white border-slate-800'
              }`}>
                {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-200" />}
                {toastMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-200" />}
                {toastMessage.type === 'info' && <Info className="w-5 h-5 text-blue-300" />}
                <span>{toastMessage.text}</span>
              </div>
            </div>
          )}
          <AdminLogin
            settings={sheetData.Settings}
            onLoginSuccess={handleAdminLoginSuccess}
            onBackToSite={() => setIsAdminOpen(false)}
            savedUsername={savedUsername}
            savedPassword={savedPassword}
          />
        </>
      );
    }

    return (
      <>
        {toastMessage && (
          <div className="fixed top-6 right-5 z-50 animate-in slide-in-from-top-3 duration-300">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-bold ${
              toastMessage.type === 'success' ? 'bg-emerald-600 text-white border-emerald-700' :
              toastMessage.type === 'error' ? 'bg-rose-600 text-white border-rose-700' :
              'bg-slate-900 text-white border-slate-800'
            }`}>
              {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-200" />}
              {toastMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-200" />}
              {toastMessage.type === 'info' && <Info className="w-5 h-5 text-blue-300" />}
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}
        <AdminDashboard
          isOpen={true}
          onClose={() => setIsAdminOpen(false)}
          onLogout={handleAdminLogout}
          data={sheetData}
          onUpdateData={setSheetData}
          appsScriptUrl={appsScriptUrl}
          onUpdateUrl={handleUpdateUrl}
          onSyncLive={handleSyncLive}
          isSyncing={isSyncing}
          onShowToast={showToast}
          savedUsername={savedUsername}
          savedPassword={savedPassword}
          onUpdateCredentials={handleUpdateCredentials}
          geminiApiKey={geminiApiKey}
          onUpdateGeminiKey={handleUpdateGeminiKey}
        />
      </>
    );
  }

  // --- MAIN HOME PAGE VIEW ---
  return (
    <div className="min-h-screen bg-white text-slate-900 font-serif-bn flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-5 z-50 animate-in slide-in-from-top-3 duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-bold ${
            toastMessage.type === 'success' ? 'bg-emerald-600 text-white border-emerald-700' :
            toastMessage.type === 'error' ? 'bg-rose-600 text-white border-rose-700' :
            'bg-slate-900 text-white border-slate-800'
          }`}>
            {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-200" />}
            {toastMessage.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-200" />}
            {toastMessage.type === 'info' && <Info className="w-5 h-5 text-blue-300" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* 1. Header / Navbar with Google RGB avatar, Name on top, Subtitle, and Admin button strictly in menu bar */}
      <Navbar
        settings={sheetData.Settings}
        menuItems={sheetData.Menu}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* 2. 16:9 Image Slider with text & multiple image support */}
      <HeroSlider
        sliders={sheetData.Sliders}
        primaryColor={primaryColor}
      />

      {/* 3. Personal Profile Hero Section (Immediately Below the 16:9 Slider) with Round Profile, RGB Ring, Name, Bio & Contact button */}
      <ProfileHeroSection
        settings={sheetData.Settings}
        primaryColor={primaryColor}
      />

      {/* 4. About Company / Platform Section */}
      <AboutSection
        aboutItem={sheetData.about[0]}
        primaryColor={primaryColor}
      />

      {/* 5. Products & Services Section */}
      <ProductsSection
        products={sheetData.Products}
        primaryColor={primaryColor}
      />

      {/* 6. Visual Photo Gallery */}
      <GallerySection
        galleryItems={sheetData.Gallery}
        primaryColor={primaryColor}
      />

      {/* 7. Blog & Video Articles */}
      <ArticlesSection
        articles={sheetData["Article and update"]}
        primaryColor={primaryColor}
        onShowToast={showToast}
      />

      {/* 8. Contact Us & Message Form */}
      <ContactSection
        settings={sheetData.Settings}
        appsScriptUrl={appsScriptUrl}
        primaryColor={primaryColor}
        onNewMessage={handleNewMessage}
        onShowToast={showToast}
      />

      {/* 9. About Me Summary with Google RGB Avatar above footer */}
      <AboutMeSummary
        settings={sheetData.Settings}
        primaryColor={primaryColor}
      />

      {/* 10. Comprehensive Bengali Footer with menu links */}
      <Footer
        settings={sheetData.Settings}
        menuItems={sheetData.Menu}
      />

      {/* 11. AI Chatbot Agent with Gemini 3.7 AI & Google Sheet knowledge base */}
      <ChatbotAgent
        sheetData={sheetData}
        primaryColor={primaryColor}
        geminiApiKey={geminiApiKey}
      />

    </div>
  );
}
