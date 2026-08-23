import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User } from 'lucide-react';
import { GoogleSheetDatabase, ChatMessage } from '../types';
import { formatImageUrl } from '../utils/mediaUtils';
import { getSheetFallbackAnswer } from '../utils/sheetChatFallback';

interface ChatbotAgentProps {
  sheetData: GoogleSheetDatabase;
  primaryColor?: string;
  geminiApiKey?: string;
}

export const ChatbotAgent: React.FC<ChatbotAgentProps> = ({ 
  sheetData, 
  primaryColor = '#1d4ed8',
  geminiApiKey = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ! আমি ${sheetData.Settings.site_title || 'প্রবর্তন'}-এর স্মার্ট ও ইসলামিক ভাবাপন্ন এআই সহকারী।\n\nআলহামদুলিল্লাহ, আমাদের গুগল শিট ডাটাবেসের সেবা, পণ্য, মূল্য তালিকা, যোগাযোগের তথ্যের পাশাপাশি যেকোনো দ্বীনি ও নীতিগত বিষয়ে আমি আপনাকে তথ্যবহুল সহায়তা দিতে প্রস্তুত। ইনশাআল্লাহ বলুন কীভাবে সাহায্য করতে পারি?`,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const suggestedQuestions = [
    'পণ্য ও সেবাসমূহ কী কী আছে?',
    'মূল্য তালিকা ও প্যাকেজ কেমন?',
    'ব্যবসায়িক সততা ও ইসলামিক মূলনীতি',
    'যোগাযোগের ঠিকানা ও ফোন নম্বর দিন'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    };

    // Calculate conversation history up to the last 5 user messages and model replies
    const existingHistory = messages
      .filter(m => m.id !== 'welcome-1')
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text
      }));

    // Keep up to 10 entries (5 user turns + 5 assistant turns)
    const historyPayload = existingHistory.slice(-10);

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          sheetData,
          geminiApiKey: geminiApiKey || sheetData.Settings.gemini_api_key || localStorage.getItem('gemini_api_key') || '',
          history: historyPayload
        })
      });

      if (!response.ok) {
        throw new Error('সার্ভার থেকে উত্তর পাওয়া যায়নি');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || getSheetFallbackAnswer(query, sheetData),
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      // Fallback seamlessly to Google Sheet knowledge base with Islamic mindset
      const fallbackText = getSheetFallbackAnswer(query, sheetData);
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'bot',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const customBotIcon = sheetData.Settings.chatbot_icon_url ? formatImageUrl(sheetData.Settings.chatbot_icon_url) : '';

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      
      {/* Chat Window Modal */}
      {isOpen && (
        <div className="mb-3 w-[92vw] sm:w-[380px] md:w-[420px] h-[520px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Chat Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                {customBotIcon ? (
                  <img
                    src={customBotIcon}
                    alt="AI Bot"
                    className="w-10 h-10 rounded-2xl object-cover border border-slate-700 shadow-md"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  <span>স্মার্ট এআই সহকারী</span>
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                </h3>
                <p className="text-[11px] text-slate-400">
                  গুগল শিট ও জেমিনি এআই লাইভ
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="চ্যাট বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs overflow-hidden">
                    {customBotIcon ? (
                      <img src={customBotIcon} alt="Bot" className="w-full h-full object-cover" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 ${
                      msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading / Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-600 bg-white p-3 rounded-2xl border border-slate-200 w-fit shadow-xs animate-pulse">
                <Bot className="w-4 h-4 text-blue-600 animate-spin" />
                <span>জেমিনি এআই তথ্য প্রস্তুত করছে...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Questions */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/80 transition cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="ওয়েবসাইট বা দ্বীনি বিষয়ে যেকোনো প্রশ্ন বাংলায় করুন..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              style={{ backgroundColor: primaryColor }}
              className="p-2.5 rounded-xl text-white shadow-md hover:opacity-90 transition disabled:opacity-40 cursor-pointer"
              aria-label="পাঠান"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Action Button (1:1 Ratio, No Text, Customizable Icon, Animated Google Ring) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ backgroundColor: primaryColor }}
        className="w-14 h-14 sm:w-15 sm:h-15 aspect-square rounded-full p-[2.5px] shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center relative overflow-hidden group focus:outline-none focus:ring-4 focus:ring-blue-300"
        title="স্মার্ট এআই চ্যাটবট"
        aria-label="স্মার্ট এআই চ্যাটবট"
      >
        {/* Animated Google RGB Ring Border */}
        <div
          className="absolute inset-0 rounded-full animate-[spin_5s_linear_infinite]"
          style={{
            background: 'conic-gradient(from 0deg, #4285F4 0% 25%, #EA4335 25% 50%, #FBBC05 50% 75%, #34A853 75% 100%)'
          }}
        />

        {/* Inner 1:1 Content Container */}
        <div className="relative w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden z-10">
          {customBotIcon ? (
            <img
              src={customBotIcon}
              alt="Bot"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600">
              <Bot className="w-6 h-6 text-white group-hover:scale-110 transition duration-200" />
            </div>
          )}
        </div>

        {/* Active Ping Dot */}
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5 z-20">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white shadow-xs" />
        </span>
      </button>

    </div>
  );
};
