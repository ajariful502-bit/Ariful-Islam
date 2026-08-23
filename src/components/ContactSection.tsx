import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { SheetSettings, MessageItem } from '../types';

interface ContactSectionProps {
  settings: SheetSettings;
  appsScriptUrl: string;
  primaryColor?: string;
  onNewMessage: (msg: MessageItem) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  appsScriptUrl,
  primaryColor = '#1d4ed8',
  onNewMessage,
  onShowToast
}) => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const badgeText = settings.contact_section_badge || 'যোগাযোগের তথ্য';
  const titleText = settings.contact_section_title || 'আমাদের সাথে সরাসরি কথা বলুন';
  const subtitleText = settings.contact_section_subtitle || 'যেকোনো প্রশ্ন, পরামর্শ বা সেবার জন্য নিচের ফর্মটি পূরণ করুন। আপনার বার্তাটি সরাসরি গুগল শিটের send Message ট্যাবে রিয়েল-টাইমে সংরক্ষিত হবে।';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      onShowToast('অনুগ্রহ করে প্রয়োজনীয় তথ্যগুলো পূরণ করুন।', 'error');
      return;
    }

    setIsSubmitting(true);
    setFormSuccess(null);

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    const newEntry: MessageItem = {
      timestamp,
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      message: formState.message
    };

    try {
      if (appsScriptUrl.trim()) {
        const payload = {
          action: 'addLead',
          sheet: 'send Message',
          timestamp,
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          message: formState.message
        };

        await fetch(appsScriptUrl.trim(), {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams(payload).toString()
        });
      }

      onNewMessage(newEntry);
      setFormSuccess('ধন্যবাদ! আপনার বার্তাটি সফলভাবে সংরক্ষিত হয়েছে। আমরা দ্রুত যোগাযোগ করব।');
      setFormState({ name: '', email: '', phone: '', message: '' });
      onShowToast('মেসেজটি গুগল শিটে সংরক্ষিত হয়েছে!', 'success');
    } catch (err: any) {
      console.error('Submission failed:', err);
      onShowToast('মেসেজ পাঠাতে সমস্যা হয়েছে: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Information from Settings */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
                {badgeText}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                {titleText}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {subtitleText}
              </p>
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div style={{ backgroundColor: primaryColor }} className="p-3 rounded-xl text-white shadow-xs shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">ইমেইল ঠিকানা</h4>
                  <a href={`mailto:${settings.contact_email}`} className="text-sm sm:text-base font-bold text-slate-900 hover:text-blue-700 transition">
                    {settings.contact_email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div style={{ backgroundColor: primaryColor }} className="p-3 rounded-xl text-white shadow-xs shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">হটলাইন / মোবাইল</h4>
                  <a href={`tel:${settings.contact_phone}`} className="text-sm sm:text-base font-bold text-slate-900 hover:text-blue-700 transition">
                    {settings.contact_phone}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div style={{ backgroundColor: primaryColor }} className="p-3 rounded-xl text-white shadow-xs shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">প্রধান কার্যালয়</h4>
                  <p className="text-sm sm:text-base font-semibold text-slate-800">
                    {settings.contact_address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 bg-slate-50/80 p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs relative">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span>বার্তা পাঠান</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">আপনার পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                    placeholder="যেমন: আরিফুল ইসলাম"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">ইমেইল ঠিকানা *</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={e => setFormState({ ...formState, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">ফোন নম্বর (ঐচ্ছিক)</label>
                <input
                  type="tel"
                  value={formState.phone}
                  onChange={e => setFormState({ ...formState, phone: e.target.value })}
                  placeholder="+৮৮০১..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">আপনার বিস্তারিত বার্তা *</label>
                <textarea
                  rows={4}
                  required
                  value={formState.message}
                  onChange={e => setFormState({ ...formState, message: e.target.value })}
                  placeholder="আপনার কাঙ্ক্ষিত সেবা বা অনুসন্ধান সম্পর্কে লিখুন..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium transition resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: primaryColor }}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-md hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base cursor-pointer"
              >
                <span>{isSubmitting ? 'গুগল শিটে সেভ হচ্ছে...' : 'গুগল শিটে বার্তা জমা দিন'}</span>
                <Send className="w-4 h-4" />
              </button>

              {formSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-sm font-medium flex items-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};
