import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Helper function to generate content with fallback models when experiencing 503 high demand
const CANDIDATE_MODELS = ["gemini-3.7-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];

async function generateWithFallback(client: GoogleGenAI, contents: any) {
  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await client.models.generateContent({
        model,
        contents
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.code || (err?.message?.includes("503") ? 503 : 0);
      console.warn(`Model ${model} request error (${status}): ${err?.message || err}. Trying next fallback candidate...`);
      // If error is 503 (high demand) or 429, continue to next model in loop
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  throw lastError || new Error("All candidate Gemini models are currently busy.");
}

// Dedicated Gemini API test connection endpoint
app.post("/api/test-gemini", async (req, res) => {
  try {
    const { apiKey } = req.body;
    const keyToUse = (apiKey && typeof apiKey === 'string' && apiKey.trim()) 
      ? apiKey.trim() 
      : process.env.GEMINI_API_KEY;

    if (!keyToUse) {
      return res.status(400).json({ 
        success: false, 
        error: "কোনো Gemini API Key পাওয়া যায়নি। এডমিন প্যানেল থেকে আপনার এপিআই কি দিন।" 
      });
    }

    const testClient = new GoogleGenAI({ apiKey: keyToUse });
    const reply = await generateWithFallback(
      testClient,
      "অনুগ্রহ করে নিশ্চিত করুন যে Gemini API সফলভাবে কাজ করছে। সংক্ষেপে বাংলায় এক লাইনে উত্তর দিন।"
    );

    return res.json({ success: true, message: reply || "Gemini API সফলভাবে সংযুক্ত হয়েছে!" });
  } catch (err: any) {
    console.error("Gemini test failed:", err);
    return res.status(400).json({ 
      success: false, 
      error: err.message || "জেমিনি এপিআই সংযোগ স্থাপন করা যায়নি। অনুগ্রহ করে এপিআই কি সঠিক কিনা যাচাই করুন।" 
    });
  }
});

// AI Chatbot endpoint - Answers user questions with Islamic mindset and website knowledge
app.post("/api/chat", async (req, res) => {
  try {
    const { message, sheetData, geminiApiKey, history } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const settings = sheetData?.Settings || {};
    const sliders = sheetData?.Sliders || [];
    const about = sheetData?.about || [];
    const products = sheetData?.Products || [];
    const gallery = sheetData?.Gallery || [];
    const articles = sheetData?.["Article and update"] || [];

    // Context summary for grounding the AI
    const knowledgeBase = `
ওয়েবসাইট ও প্রতিষ্ঠানের নাম: ${settings.site_title || "প্রবর্তন ডিজিটাল হাব"}
মূল লক্ষ্য ও পরিচিতি: ${settings.about_me_summary || ""}
প্রতিষ্ঠাতা/পদবী: ${settings.about_me_designation || ""}
ইমেইল: ${settings.contact_email || ""}
ফোন: ${settings.contact_phone || ""}
ঠিকানা: ${settings.contact_address || ""}

আমাদের সেবা ও পণ্যসমূহ (Products):
${products.map((p: any, idx: number) => `${idx + 1}. নাম: ${p.name}, ক্যাটাগরি: ${p.category}, মূল্য: ${p.price}, বিবরণ: ${p.description}`).join("\n")}

আমাদের পরিচিতি (About):
${about.map((a: any) => `${a.name} - ${a.title || ""}. বিবরণ: ${a.description || ""}`).join("\n")}

ব্লগ ও আপডেট (Articles):
${articles.map((art: any) => `- শিরোনাম: ${art.title}, ক্যাটাগরি: ${art.category}, তারিখ: ${art.date}, বিবরণ: ${art.description}`).join("\n")}

গ্যালারি (Gallery):
${gallery.map((g: any) => `- ছবি: ${g.image_title || g["image title"]}, সেকশন: ${g.image_section || g["image section"]}`).join("\n")}
`;

    // Process last 5 user messages conversation history
    const rawHistory = Array.isArray(history) ? history : [];
    const recentHistory = rawHistory
      .slice(-10) // Up to last 5 user turns and their responses
      .map((h: any) => ({
        role: (h.role === 'user' || h.role === 'model') ? h.role : (h.sender === 'user' ? 'user' : 'model'),
        text: String(h.text || h.content || '').trim()
      }))
      .filter((h: any) => h.text.length > 0);

    const islamicSystemPrompt = `তুমি "${settings.site_title || "প্রবর্তন ডিজিটাল হাব"}" ওয়েবসাইটের একজন সত্যবাদী, বিনয়ী, প্রজ্ঞাবান ও দায়িত্বশীল ইসলামিক ভাবাপন্ন এআই সহকারী (Islamic Mindset & Ethical AI Assistant)।

তোমার মূল নীতিমালা ও আদব (Islamic Values & Ethics):
১. **ইসলামিক শিষ্টাচার ও সম্ভাষণ:**
   - আলাপের শুরুতে বা যথোপযুক্ত স্থানে মার্জিত ইসলামিক বাক্য যেমন "আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ", "আলহামদুলিল্লাহ", "ইনশাআল্লাহ", "মাশাআল্লাহ", "জাযাকাল্লাহু খাইরান", "বারাকাল্লাহু ফিক" ব্যবহার করো।
   - সবসময় অত্যন্ত নম্র, শালীন, সৎ, গঠনমূলক ও আন্তরিক ভাষায় কথা বলো।

২. **উত্তর প্রদানের দ্বৈত পরিধি (Scope):**
   - **ওয়েবসাইট ও বাণিজ্যিক সেবা:** নলেজ বেসে থাকা গুগল স্প্রেডশিটের তথ্যাবলী (পণ্য, সেবা, মূল্য তালিকা, প্যাকেজ, গ্যালারি, ব্লগ, ভিডিও, প্রতিষ্ঠাতা পরিচিতি ও যোগাযোগের মাধ্যম) থেকে নির্ভুল, সৎ ও স্বচ্ছ তথ্য দাও।
   - **ইসলামিক জ্ঞান ও জীবনবোধ:** ইসলাম সম্পর্কিত যেকোনো মৌলিক প্রশ্ন (যেমন: হালাল উপার্জন ও রিজিক, ব্যবসায়িক সততা ও আমানতদারিতা, ইনসাফ, লেনদেনের মূলনীতি, নামাজ, রোজা, উত্তম আখলাক, দৈনন্দিন জীবনের দোয়াসমূহ ও কুরআনিক শিক্ষা) প্রজ্ঞাপূর্ণভাবে সাবলীল বাংলায় বুঝিয়ে দাও।
   - **সমন্বয়:** ওয়েবসাইট ও ইসলামিক মূলবোধ—এই দুইয়ের মেলবন্ধনে ব্যবহারকারীকে সর্বোত্তম হালাল ও নৈতিক সমাধান এবং পরামর্শ প্রদান করো।

৩. **কনটেক্সট সচেতনতা:** ব্যবহারকারীর সাথে পূর্বের কথোপকথনের ধারাবাহিকতা মনে রেখে প্রাসঙ্গিকভাবে উত্তর দাও।

নলেজ বেস (গুগল শিটের তথ্যাবলী):
${knowledgeBase}`;

    // Prioritize user-provided custom API key, then environment variable
    const keyToUse = (geminiApiKey && typeof geminiApiKey === 'string' && geminiApiKey.trim())
      ? geminiApiKey.trim()
      : process.env.GEMINI_API_KEY;

    let client: GoogleGenAI | null = null;
    if (keyToUse) {
      try {
        client = new GoogleGenAI({ apiKey: keyToUse });
      } catch (clientInitErr) {
        console.warn("Gemini client initialization failed, falling back to sheet data:", clientInitErr);
      }
    } else {
      client = getGeminiClient();
    }

    if (client) {
      try {
        const contents: any[] = [
          {
            role: "user",
            parts: [{ text: islamicSystemPrompt }]
          },
          {
            role: "model",
            parts: [{ text: "ওয়ালাইকুম আসসালাম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহ। আলহামদুলিল্লাহ, আমি নির্দেশনা যথাযথভাবে গ্রহণ করেছি। আমি সর্বশক্তিমান আল্লাহর সন্তুষ্টির উদ্দেশ্যে ইসলামিক শালীনতা, সততা ও প্রজ্ঞার সাথে ওয়েবসাইট ও দ্বীনি বিষয়ের সকল প্রশ্নের সঠিক ও তথ্যবহুল উত্তর ইনশাআল্লাহ প্রদান করব।" }]
          }
        ];

        // Append conversation history (up to last 5 user messages)
        recentHistory.forEach((h: any) => {
          contents.push({
            role: h.role,
            parts: [{ text: h.text }]
          });
        });

        // Append current user message
        contents.push({
          role: "user",
          parts: [{ text: message }]
        });

        const replyText = await generateWithFallback(client, contents);
        if (replyText && replyText.trim().length > 0) {
          return res.json({ reply: replyText, source: "gemini" });
        }
      } catch (geminiErr: any) {
        console.warn("Gemini API call failed or quota exceeded, seamlessly using sheet & Islamic knowledge base:", geminiErr?.message || geminiErr);
      }
    }

    // Default Fallback Semantic Bengali & Islamic intelligence Engine using Google Sheet data
    const reply = generateSheetSemanticReply(message, sheetData);
    return res.json({ reply, source: "sheet_fallback" });

  } catch (err: any) {
    console.error("Chat API error:", err);
    // Even on server exception, return a courteous sheet response instead of failing
    const safeFallback = generateSheetSemanticReply(req.body?.message || "", req.body?.sheetData);
    return res.json({ reply: safeFallback, source: "emergency_fallback" });
  }
});

// Helper for generating intelligent Islamic & Sheet-based answers
function generateSheetSemanticReply(message: string, sheetData: any): string {
  const query = (message || "").toLowerCase().trim();
  const settings = sheetData?.Settings || {};
  const products: any[] = Array.isArray(sheetData?.Products) ? sheetData.Products : [];
  const articles: any[] = Array.isArray(sheetData?.["Article and update"]) ? sheetData["Article and update"] : [];
  const about: any[] = Array.isArray(sheetData?.about) ? sheetData.about : [];
  const gallery: any[] = Array.isArray(sheetData?.Gallery) ? sheetData.Gallery : [];
  const siteTitle = settings.site_title || "প্রবর্তন ডিজিটাল হাব";

  // 1. Salam & Greetings
  if (query.includes("সালাম") || query.includes("salam") || query.includes("আসসালামু") || query.includes("হাই") || query.includes("hello") || query.includes("hi") || query.includes("হেলো") || query.includes("কেমন আছেন")) {
    return `ওয়ালাইকুম আসসালাম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহ! আলহামদুলিল্লাহ, আমি "${siteTitle}"-এর ইসলামিক ভাবাপন্ন এআই সহকারী।\n\nসর্বশক্তিমান আল্লাহর রহমতে আমরা সকলেই ভালো আছি। আমি আপনাকে আমাদের পণ্য ও সেবার তালিকা, নির্ধারিত মূল্য, যোগাযোগের তথ্য কিংবা যেকোনো দ্বীনি ও নীতিগত বিষয়ে তথ্য দিয়ে সাহায্য করতে পারি। ইনশাআল্লাহ বলুন কীভাবে সাহায্য করতে পারি?`;
  }

  // 2. Islamic values, trade ethics, prayers, halal
  if (query.includes("ইসলাম") || query.includes("হালাল") || query.includes("হারাম") || query.includes("নামাজ") || query.includes("সালাত") || query.includes("রোজা") || query.includes("সততা") || query.includes("আমানত") || query.includes("দোয়া") || query.includes("কুরআন") || query.includes("হাদিস") || query.includes("রিজিক") || query.includes("ব্যবসায়িক") || query.includes("ইনসাফ") || query.includes("লেনদেন")) {
    return `আলহামদুলিল্লাহ, ইসলাম মানবজীবনের সর্বাঙ্গীন ও ভারসাম্যপূর্ণ পূর্ণাঙ্গ জীবনব্যবস্থা।\n\nরাসূলুল্লাহ (সা.) ইরশাদ করেছেন:\n"সৎ ও বিশ্বস্ত আমানতদার ব্যবসায়ী কিয়ামতের দিন নবীগণ, সত্যবাদী (সিদ্দিক্বীন) ও শহীদদের সঙ্গী হবেন।" (জামে আত-তিরমিজি: ১২০৯)\n\nআমাদের ব্যবসা ও প্রযুক্তি সেবার মূল ভিত্তি হলো সততা, হালাল উপার্জন, ইনসাফ এবং মানুষের কল্যাণ। পণ্য, সেবা বা দ্বীনি যেকোনো বিষয়ে আরও জানতে চাইলে নির্দ্বিধায় প্রশ্ন করুন।`;
  }

  // 3. Search for specific product match
  const matchedProduct = products.find(p => {
    const pName = (p.name || "").toLowerCase();
    const pCat = (p.category || "").toLowerCase();
    const pDesc = (p.description || "").toLowerCase();
    return query.split(" ").some(word => word.length > 2 && (pName.includes(word) || pCat.includes(word) || pDesc.includes(word)));
  });

  if (matchedProduct) {
    return `আলহামদুলিল্লাহ, আপনি "${matchedProduct.name}" সম্পর্কে জানতে চেয়েছেন:\n\n• ক্যাটাগরি: ${matchedProduct.category}\n• মূল্য: ${matchedProduct.price}\n• বিবরণ: ${matchedProduct.description || "উন্নত মানসম্পন্ন ও বিশ্বস্ত সেবা।"}\n\nইনশাআল্লাহ এই সেবাটি গ্রহণ করতে চাইলে সরাসরি আমাদের ওয়েবসাইট থেকে মেসেজ পাঠাতে পারেন অথবা ফোনে যোগাযোগ করুন।`;
  }

  // 4. Products & Services General list
  if (query.includes("পণ্য") || query.includes("সেবা") || query.includes("সার্ভিস") || query.includes("প্যাকেজ") || query.includes("প্রোডাক্ট") || query.includes("product") || query.includes("service")) {
    if (products.length > 0) {
      const pList = products.map((p, i) => `${i + 1}. ✦ ${p.name} [${p.category}]\n   মূল্য: ${p.price}\n   বিবরণ: ${p.description || ""}`).join("\n\n");
      return `আলহামদুলিল্লাহ, আমাদের গুগল স্প্রেডশিটে থাকা হালাল ও মানসম্পন্ন পণ্য ও সেবাসমূহ:\n\n${pList}\n\nইনশাআল্লাহ বিস্তারিত জানতে যেকোনো পণ্যের নাম উল্লেখ করে প্রশ্ন করতে পারেন।`;
    }
    return `আলহামদুলিল্লাহ, বর্তমানে আমাদের পণ্য ও সেবার ডাটাবেস আপডেট করা হচ্ছে। খুব শীঘ্রই বিস্তারিত যুক্ত হবে ইনশাআল্লাহ।`;
  }

  // 5. Pricing / Cost
  if (query.includes("দাম") || query.includes("মূল্য") || query.includes("খরচ") || query.includes("রেট") || query.includes("টাকা") || query.includes("price") || query.includes("cost") || query.includes("ফি")) {
    if (products.length > 0) {
      const priceList = products.map(p => `• ${p.name}: ${p.price}`).join("\n");
      return `আমাদের স্বচ্ছ ও ইনসাফভিত্তিক মূল্য তালিকা:\n\n${priceList}\n\nইনশাআল্লাহ কাস্টম প্রয়োজন বা বড় প্রোজেক্টের ক্ষেত্রে আলোচনার মাধ্যমে নির্ধারিত হবে।`;
    }
    return `আমাদের সকল পণ্যের মূল্য তালিকা স্বচ্ছ ও সাশ্রয়ী। বিস্তারিত জানতে যোগাযোগ করুন।`;
  }

  // 6. Contact & Address
  if (query.includes("যোগাযোগ") || query.includes("ফোন") || query.includes("মোবাইল") || query.includes("নাম্বার") || query.includes("ইমেইল") || query.includes("মেইল") || query.includes("ঠিকানা") || query.includes("লোকেশন") || query.includes("অফিস") || query.includes("contact") || query.includes("phone") || query.includes("email") || query.includes("address")) {
    return `আমাদের সাথে সরাসরি যোগাযোগের সঠিক তথ্য:\n\n• ইমেইল: ${settings.contact_email || "contact@probortonhub.com"}\n• মোবাইল/ফোন: ${settings.contact_phone || "+৮৮০১৭১২-৩৪৫৬৭৮"}\n• ঠিকানা: ${settings.contact_address || "কারওয়ান বাজার, ঢাকা, বাংলাদেশ"}\n• ফেসবুক: ${settings.social_facebook || "উপলব্ধ"}\n• হোয়াটসঅ্যাপ: ${settings.social_whatsapp || "উপলব্ধ"}\n\nআপনি ওয়েবসাইটের নিচের মেসেজ ফর্ম থেকেও সরাসরি বার্তা পাঠাতে পারেন, ইনশাআল্লাহ দ্রুত যোগাযোগ করা হবে।`;
  }

  // 7. About / Founder / Identity
  if (query.includes("সম্পর্কে") || query.includes("পরিচয়") || query.includes("কে") || query.includes("মালিক") || query.includes("প্রতিষ্ঠাতা") || query.includes("আর্কিটেক্ট") || query.includes("who") || query.includes("about")) {
    const founderName = about.length > 0 ? about[0].name : "প্রতিষ্ঠাতা";
    const founderTitle = settings.about_me_designation || (about.length > 0 ? about[0].title : "লিড আর্কিটেক্ট ও টেকনোলজি স্পেশালিস্ট");
    return `"${siteTitle}" সম্পর্কে পরিচিতি:\n\n${settings.about_me_summary || "আমরা গুগল শিট ও ক্লাউড অটোমেশনের মাধ্যমে ডায়নামিক ওয়েবসাইট ও হালাল ডিজিটাল সমাধান সরবরাহ করি।"}\n\n• প্রতিষ্ঠাতা/পদবী: ${founderName} (${founderTitle})\n• মূল লক্ষ্য: সততা, স্বচ্ছতা ও প্রযুক্তির মাধ্যমে মানুষের জীবন সহজ করা।`;
  }

  // 8. Blog & Articles & Videos
  if (query.includes("ব্লগ") || query.includes("খবর") || query.includes("ভিডিও") || query.includes("আর্টিকেল") || query.includes("পোস্ট") || query.includes("blog") || query.includes("article") || query.includes("video")) {
    if (articles.length > 0) {
      const artList = articles.slice(0, 4).map((a, i) => `${i + 1}. ${a.title} (${a.category}) - ${a.date}`).join("\n");
      return `আলহামদুলিল্লাহ, আমাদের সর্বশেষ প্রকাশিত ব্লগ ও আপডেট:\n\n${artList}\n\nওয়েবসাইটের "ব্লগ ও ভিডিও" সেকশনে সরাসরি ভিডিও প্লেয়ারে দেখতে পারবেন ইনশাআল্লাহ।`;
    }
    return `আলহামদুলিল্লাহ, নিয়মিত নতুন প্রযুক্তি ও শিক্ষণীয় ব্লগ প্রকাশ করা হয়। বিস্তারিত দেখতে ব্লগ সেকশন ভিজিট করুন।`;
  }

  // 9. Gallery
  if (query.includes("ছবি") || query.includes("গ্যালারি") || query.includes("ফটো") || query.includes("image") || query.includes("gallery")) {
    return `আমাদের গ্যালারিতে মোট ${gallery.length || 0}টি চমৎকার ছবি রয়েছে। ওয়েবসাইটের "চিত্রশালা ও ফটো গ্যালারি" সেকশনে গুগল ড্রাইভের লাইভ ছবিগুলো পূর্ণ রেজ্যুলেশনে দেখতে পারবেন।`;
  }

  // 10. General courteous fallback
  return `আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ! আমি "${siteTitle}"-এর এআই সহকারী।\n\nগুগল স্প্রেডশিটের তথ্যের ভিত্তিতে আমি আপনাকে সহায়তা করতে পারি:\n১. পণ্য ও সেবাসমূহ এবং বিবরণ\n২. নির্ধারিত মূল্য তালিকা ও প্যাকেজ\n৩. যোগাযোগের ঠিকানা ও ফোন নম্বর\n৪. আমাদের ব্লগ, ভিডিও ও গ্যালারি\n৫. ব্যবসায়িক সততা ও ইসলামিক মূলনীতি\n\nইনশাআল্লাহ আপনার নির্দিষ্ট প্রশ্নটি বাংলায় লিখুন, আমি তথ্য জানিয়ে দিচ্ছি।`;
}

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
