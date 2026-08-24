import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  RefreshCw, 
  LogOut, 
  Plus, 
  ExternalLink,
  ShieldAlert,
  User as UserIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  googleSignIn, 
  googleLogout, 
  getCachedAccessToken, 
  initGoogleAuth 
} from '../lib/googleAuth';

interface GoogleChatSpace {
  name: string;
  displayName?: string;
  spaceType?: string;
  type?: string;
}

interface GoogleChatMessage {
  name: string;
  text?: string;
  createTime?: string;
  sender?: {
    name?: string;
    displayName?: string;
    avatarUrl?: string;
    type?: string;
  };
}

interface GoogleChatTabProps {
  primaryColor?: string;
  adminEmail?: string;
}

export const GoogleChatTab: React.FC<GoogleChatTabProps> = ({
  primaryColor = '#1d4ed8',
  adminEmail = 'arifulislam.qinfo@gmail.com'
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Spaces & Messages
  const [spaces, setSpaces] = useState<GoogleChatSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<GoogleChatSpace | null>(null);
  const [messages, setMessages] = useState<GoogleChatMessage[]>([]);
  const [isLoadingSpaces, setIsLoadingSpaces] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState('');
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Destructive / Outgoing Confirmation Modal state
  const [pendingMessageText, setPendingMessageText] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = initGoogleAuth(
      (authUser, authToken) => {
        setUser(authUser);
        setToken(authToken);
        setAuthError(null);
      },
      () => {
        const cached = getCachedAccessToken();
        if (cached) {
          setToken(cached);
        } else {
          setUser(null);
          setToken(null);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (token) {
      loadSpaces();
    }
  }, [token]);

  useEffect(() => {
    if (selectedSpace && token) {
      loadMessages(selectedSpace.name);
    }
  }, [selectedSpace, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingMessages]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
      }
    } catch (err: any) {
      const errorCode = err?.code || '';
      if (
        errorCode === 'auth/popup-closed-by-user' || 
        errorCode === 'auth/cancelled-popup-request' ||
        err?.message?.includes('popup-closed-by-user')
      ) {
        // User closed the popup intentionally, no error to display
        return;
      }
      setAuthError(err?.message || 'গুগল সাইন ইন সম্পন্ন করা সম্ভব হয়নি।');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await googleLogout();
    setUser(null);
    setToken(null);
    setSpaces([]);
    setSelectedSpace(null);
    setMessages([]);
  };

  const loadSpaces = async () => {
    if (!token) return;
    setIsLoadingSpaces(true);
    try {
      const res = await fetch('/api/chat/spaces', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.spaces) {
        setSpaces(data.spaces);
        if (data.spaces.length > 0 && !selectedSpace) {
          setSelectedSpace(data.spaces[0]);
        }
      } else if (!res.ok) {
        if (res.status === 401) {
          setAuthError('Google এক্সেস টোকেন মেয়াদোত্তীর্ণ হয়েছে। অনুগ্রহ করে পুনরায় সাইন ইন করুন।');
          setToken(null);
        }
      }
    } catch (err: any) {
      console.error('Load spaces error:', err);
    } finally {
      setIsLoadingSpaces(false);
    }
  };

  const loadMessages = async (spaceName: string) => {
    if (!token) return;
    setIsLoadingMessages(true);
    try {
      const encoded = encodeURIComponent(spaceName);
      const res = await fetch(`/api/chat/spaces/${encoded}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.messages) {
        // Chat messages are listed newest or oldest; sort by createTime ascending
        const sorted = [...data.messages].sort((a, b) => 
          new Date(a.createTime || 0).getTime() - new Date(b.createTime || 0).getTime()
        );
        setMessages(sorted);
      } else {
        setMessages([]);
      }
    } catch (err: any) {
      console.error('Load messages error:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handlePromptSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedSpace || isSending) return;
    setPendingMessageText(messageInput.trim());
    setShowConfirmModal(true);
  };

  const executeSendMessage = async () => {
    if (!pendingMessageText || !selectedSpace || !token) return;
    setIsSending(true);
    setShowConfirmModal(false);

    try {
      const encoded = encodeURIComponent(selectedSpace.name);
      const res = await fetch(`/api/chat/spaces/${encoded}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: pendingMessageText })
      });

      if (res.ok) {
        setMessageInput('');
        setPendingMessageText(null);
        await loadMessages(selectedSpace.name);
      } else {
        const errData = await res.json();
        alert(errData.error || 'মেসেজ পাঠাতে সমস্যা হয়েছে');
      }
    } catch (err: any) {
      alert(err.message || 'মেসেজ পাঠানো সম্ভব হয়নি');
    } finally {
      setIsSending(false);
    }
  };

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim() || !token || isCreatingSpace) return;
    setIsCreatingSpace(true);
    try {
      const res = await fetch('/api/chat/spaces', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          displayName: newSpaceName.trim(),
          spaceType: 'SPACE'
        })
      });

      const data = await res.json();
      if (res.ok) {
        setNewSpaceName('');
        setShowCreateModal(false);
        await loadSpaces();
        setSelectedSpace(data);
      } else {
        alert(data.error || 'স্পেস তৈরি করা যায়নি');
      }
    } catch (err: any) {
      alert(err.message || 'স্পেস তৈরিতে ত্রুটি');
    } finally {
      setIsCreatingSpace(false);
    }
  };

  // Not signed in state
  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 min-h-[380px]">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
          <MessageSquare className="w-7 h-7" />
        </div>

        <div className="space-y-1.5 max-w-xs">
          <h3 className="font-bold text-slate-900 text-base">এডমিনের সাথে সরাসরি গুগল চ্যাট</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            আপনার অফিসিয়াল গুগল অ্যাকাউন্ট দিয়ে সাইন ইন করে এডমিনের সাথে রিয়েল-টাইম গুগল চ্যাটে এসএমএস বা মেসেজিং করুন।
          </p>
        </div>

        {authError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2 max-w-xs text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* Official Style Sign in with Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoggingIn}
          className="flex items-center justify-center gap-3 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm rounded-xl border border-slate-300 shadow-xs hover:shadow-md transition cursor-pointer disabled:opacity-60"
        >
          <svg className="w-4 h-4" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <span>{isLoggingIn ? 'সাইন ইন হচ্ছে...' : 'Sign in with Google'}</span>
        </button>

        <div className="text-[11px] text-slate-400 max-w-xs text-center flex items-center justify-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>এডমিন ইমেইল: {adminEmail}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/70">
      
      {/* Top User Bar */}
      <div className="px-3 py-2 bg-white border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0" 
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
              {user?.displayName?.[0] || 'U'}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate leading-tight">
              {user?.displayName || 'Google User'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => loadSpaces()}
            title="রিফ্রেশ করুন"
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSpaces ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            title="নতুন স্পেস বা চ্যাট রুম তৈরি করুন"
            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleGoogleLogout}
            title="সাইন আউট"
            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Space Selector / Header */}
      <div className="px-3 py-2 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
        <div className="flex-1 min-w-0">
          {spaces.length > 0 ? (
            <select
              value={selectedSpace?.name || ''}
              onChange={(e) => {
                const found = spaces.find(s => s.name === e.target.value);
                if (found) setSelectedSpace(found);
              }}
              className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 truncate"
            >
              {spaces.map((s) => (
                <option key={s.name} value={s.name}>
                  💬 {s.displayName || s.name.replace('spaces/', 'Space ')}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-xs text-slate-500 italic">
              {isLoadingSpaces ? 'চ্যাট রুম লোড হচ্ছে...' : 'কোনো স্পেস পাওয়া যায়নি। নতুন স্পেস তৈরি করুন।'}
            </p>
          )}
        </div>

        <a
          href="https://chat.google.com"
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium shrink-0"
          title="Google Chat ওয়েব অ্যাপ খুলুন"
        >
          <span>Chat App</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Messages List Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2.5 min-h-0">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full text-xs text-slate-400 py-8">
            <RefreshCw className="w-4 h-4 animate-spin mr-2 text-blue-600" />
            <span>গুগল চ্যাট মেসেজ লোড হচ্ছে...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4 text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300" />
            <p className="text-xs">
              এই চ্যাট রুমে এখনও কোনো মেসেজ নেই। এডমিনকে প্রথম মেসেজটি পাঠান।
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.sender?.displayName === user?.displayName;
            const timeStr = m.createTime 
              ? new Date(m.createTime).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) 
              : '';

            return (
              <div 
                key={m.name} 
                className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 overflow-hidden">
                    {m.sender?.avatarUrl ? (
                      <img src={m.sender.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>{m.sender?.displayName?.[0] || 'A'}</span>
                    )}
                  </div>
                )}

                <div 
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-2xs ${
                    isMe 
                      ? 'bg-blue-600 text-white rounded-br-xs' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  {!isMe && m.sender?.displayName && (
                    <p className="text-[10px] font-bold text-blue-600 mb-0.5">
                      {m.sender.displayName}
                    </p>
                  )}
                  <p className="whitespace-pre-line break-words">{m.text}</p>
                  {timeStr && (
                    <span 
                      className={`block text-[9px] mt-0.5 text-right ${
                        isMe ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      {timeStr}
                    </span>
                  )}
                </div>

                {isMe && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span>{user?.displayName?.[0] || 'U'}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input / Send Form */}
      <form
        onSubmit={handlePromptSend}
        className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder={selectedSpace ? "এডমিনকে সরাসরি এসএমএস লিখুন..." : "আগে একটি চ্যাট স্পেস নির্বাচন করুন"}
          disabled={!selectedSpace || isSending}
          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-slate-100"
        />
        <button
          type="submit"
          disabled={!selectedSpace || !messageInput.trim() || isSending}
          style={{ backgroundColor: primaryColor }}
          className="p-2 rounded-xl text-white shadow-xs hover:opacity-90 transition disabled:opacity-40 cursor-pointer"
          title="মেসেজ পাঠান"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Create New Space Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>নতুন গুগল চ্যাট স্পেস তৈরি করুন</span>
            </h4>

            <form onSubmit={handleCreateSpace} className="space-y-3">
              <input
                type="text"
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                placeholder="যেমন: প্রজেক্ট আলোচনা / সাপোর্ট"
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isCreatingSpace || !newSpaceName.trim()}
                  className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isCreatingSpace ? 'তৈরি হচ্ছে...' : 'তৈরি করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Dialog before sending message to Workspace */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl border border-slate-200 space-y-3.5 animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">মেসেজ প্রেরণের অনুমোদন</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                আপনার Google একাউন্ট দিয়ে চ্যাট স্পেসে এই মেসেজটি পাঠানো হবে:
              </p>
              <div className="p-2.5 bg-slate-100 rounded-xl text-xs text-slate-800 font-medium italic border border-slate-200 break-words">
                "{pendingMessageText}"
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  setPendingMessageText(null);
                }}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={executeSendMessage}
                disabled={isSending}
                className="px-4 py-1.5 text-xs bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isSending ? 'পাঠানো হচ্ছে...' : 'নিশ্চিত ও প্রেরণ'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
