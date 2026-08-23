import { GoogleSheetDatabase } from '../types';

export function getSheetFallbackAnswer(message: string, sheetData: GoogleSheetDatabase): string {
  const query = (message || '').toLowerCase().trim();
  const settings = sheetData.Settings || ({} as any);
  const products = Array.isArray(sheetData.Products) ? sheetData.Products : [];
  const articles = Array.isArray(sheetData['Article and update']) ? sheetData['Article and update'] : [];
  const about = Array.isArray(sheetData.about) ? sheetData.about : [];
  const gallery = Array.isArray(sheetData.Gallery) ? sheetData.Gallery : [];
  const siteTitle = settings.site_title || 'প্রবর্তন ডিজিটাল হাব';

  // 1. Salam & Greetings
  if (
    query.includes('সালাম') ||
    query.includes('salam') ||
    query.includes('আসসালামু') ||
    query.includes('হাই') ||
    query.includes('hello') ||
    query.includes('hi') ||
    query.includes('হেলো') ||
    query.includes('কেমন আছেন')
  ) {
    return `ওয়ালাইকুম আসসালাম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহ! আলহামদুলিল্লাহ, আমি "${siteTitle}"-এর ইসলামিক ভাবাপন্ন এআই সহকারী।\n\nসর্বশক্তিমান আল্লাহর রহমতে আমরা ভালো আছি। আমাদের পণ্য ও সেবার তালিকা, নির্ধারিত মূল্য, যোগাযোগের তথ্য কিংবা যেকোনো দ্বীনি ও নীতিগত বিষয়ে আমি আপনাকে তথ্য দিয়ে সাহায্য করতে পারি। ইনশাআল্লাহ বলুন কীভাবে সাহায্য করতে পারি?`;
  }

  // 2. Islamic values, trade ethics, prayers, halal
  if (
    query.includes('ইসলাম') ||
    query.includes('হালাল') ||
    query.includes('হারাম') ||
    query.includes('নামাজ') ||
    query.includes('সালাত') ||
    query.includes('রোজা') ||
    query.includes('সততা') ||
    query.includes('আমানত') ||
    query.includes('দোয়া') ||
    query.includes('কুরআন') ||
    query.includes('হাদিস') ||
    query.includes('রিজিক') ||
    query.includes('ব্যবসায়িক') ||
    query.includes('ইনসাফ') ||
    query.includes('লেনদেন')
  ) {
    return `আলহামদুলিল্লাহ, ইসলাম মানবজীবনের সর্বাঙ্গীন ও ভারসাম্যপূর্ণ পূর্ণাঙ্গ জীবনব্যবস্থা।\n\nরাসূলুল্লাহ (সা.) ইরশাদ করেছেন:\n"সৎ ও বিশ্বস্ত আমানতদার ব্যবসায়ী কিয়ামতের দিন নবীগণ, সত্যবাদী (সিদ্দিক্বীন) ও শহীদদের সঙ্গী হবেন।" (জামে আত-তিরমিজি: ১২০৯)\n\nআমাদের ব্যবসা ও প্রযুক্তি সেবার মূল ভিত্তি হলো সততা, হালাল উপার্জন, ইনসাফ এবং মানুষের কল্যাণ। পণ্য, সেবা বা দ্বীনি যেকোনো বিষয়ে আরও জানতে চাইলে নির্দ্বিধায় প্রশ্ন করুন।`;
  }

  // 3. Search for specific product match
  const matchedProduct = products.find((p) => {
    const pName = (p.name || '').toLowerCase();
    const pCat = (p.category || '').toLowerCase();
    const pDesc = (p.description || '').toLowerCase();
    return query
      .split(' ')
      .some(
        (word) =>
          word.length > 2 &&
          (pName.includes(word) || pCat.includes(word) || pDesc.includes(word))
      );
  });

  if (matchedProduct) {
    return `আলহামদুলিল্লাহ, আপনি "${matchedProduct.name}" সম্পর্কে জানতে চেয়েছেন:\n\n• ক্যাটাগরি: ${matchedProduct.category}\n• মূল্য: ${matchedProduct.price}\n• বিবরণ: ${matchedProduct.description || 'উন্নত মানসম্পন্ন ও বিশ্বস্ত সেবা।'}\n\nইনশাআল্লাহ এই সেবাটি গ্রহণ করতে চাইলে সরাসরি আমাদের ওয়েবসাইট থেকে মেসেজ পাঠাতে পারেন অথবা ফোনে যোগাযোগ করুন।`;
  }

  // 4. Products & Services General list
  if (
    query.includes('পণ্য') ||
    query.includes('সেবা') ||
    query.includes('সার্ভিস') ||
    query.includes('প্যাকেজ') ||
    query.includes('প্রোডাক্ট') ||
    query.includes('product') ||
    query.includes('service')
  ) {
    if (products.length > 0) {
      const pList = products
        .map(
          (p, i) =>
            `${i + 1}. ✦ ${p.name} [${p.category}]\n   মূল্য: ${p.price}\n   বিবরণ: ${p.description || ''}`
        )
        .join('\n\n');
      return `আলহামদুলিল্লাহ, আমাদের গুগল স্প্রেডশিটে থাকা হালাল ও মানসম্পন্ন পণ্য ও সেবাসমূহ:\n\n${pList}\n\nইনশাআল্লাহ বিস্তারিত জানতে যেকোনো পণ্যের নাম উল্লেখ করে প্রশ্ন করতে পারেন।`;
    }
    return `আলহামদুলিল্লাহ, বর্তমানে আমাদের পণ্য ও সেবার ডাটাবেস আপডেট করা হচ্ছে। খুব শীঘ্রই বিস্তারিত যুক্ত হবে ইনশাআল্লাহ।`;
  }

  // 5. Pricing / Cost
  if (
    query.includes('দাম') ||
    query.includes('মূল্য') ||
    query.includes('খরচ') ||
    query.includes('রেট') ||
    query.includes('টাকা') ||
    query.includes('price') ||
    query.includes('cost') ||
    query.includes('ফি')
  ) {
    if (products.length > 0) {
      const priceList = products.map((p) => `• ${p.name}: ${p.price}`).join('\n');
      return `আমাদের স্বচ্ছ ও ইনসাফভিত্তিক মূল্য তালিকা:\n\n${priceList}\n\nইনশাআল্লাহ কাস্টম প্রয়োজন বা বড় প্রোজেক্টের ক্ষেত্রে আলোচনার মাধ্যমে নির্ধারিত হবে।`;
    }
    return `আমাদের সকল পণ্যের মূল্য তালিকা স্বচ্ছ ও সাশ্রয়ী। বিস্তারিত জানতে যোগাযোগ করুন।`;
  }

  // 6. Contact & Address
  if (
    query.includes('যোগাযোগ') ||
    query.includes('ফোন') ||
    query.includes('মোবাইল') ||
    query.includes('নাম্বার') ||
    query.includes('ইমেইল') ||
    query.includes('মেইল') ||
    query.includes('ঠিকানা') ||
    query.includes('লোকেশন') ||
    query.includes('অফিস') ||
    query.includes('contact') ||
    query.includes('phone') ||
    query.includes('email') ||
    query.includes('address')
  ) {
    return `আমাদের সাথে সরাসরি যোগাযোগের সঠিক তথ্য:\n\n• ইমেইল: ${settings.contact_email || 'contact@probortonhub.com'}\n• মোবাইল/ফোন: ${settings.contact_phone || '+৮৮০১৭১২-৩৪৫৬৭৮'}\n• ঠিকানা: ${settings.contact_address || 'কারওয়ান বাজার, ঢাকা, বাংলাদেশ'}\n• ফেসবুক: ${settings.social_facebook || 'উপলব্ধ'}\n• হোয়াটসঅ্যাপ: ${settings.social_whatsapp || 'উপলব্ধ'}\n\nআপনি ওয়েবসাইটের নিচের মেসেজ ফর্ম থেকেও সরাসরি বার্তা পাঠাতে পারেন, ইনশাআল্লাহ দ্রুত যোগাযোগ করা হবে।`;
  }

  // 7. About / Founder / Identity
  if (
    query.includes('সম্পর্কে') ||
    query.includes('পরিচয়') ||
    query.includes('কে') ||
    query.includes('মালিক') ||
    query.includes('প্রতিষ্ঠাতা') ||
    query.includes('আর্কিটেক্ট') ||
    query.includes('who') ||
    query.includes('about')
  ) {
    const founderName = about.length > 0 ? about[0].name : 'প্রতিষ্ঠাতা';
    const founderTitle =
      settings.about_me_designation ||
      (about.length > 0 ? about[0].title : 'লিড আর্কিটেক্ট ও টেকনোলজি স্পেশালিস্ট');
    return `"${siteTitle}" সম্পর্কে পরিচিতি:\n\n${settings.about_me_summary || 'আমরা গুগল শিট ও ক্লাউড অটোমেশনের মাধ্যমে ডায়নামিক ওয়েবসাইট ও হালাল ডিজিটাল সমাধান সরবরাহ করি।'}\n\n• প্রতিষ্ঠাতা/পদবী: ${founderName} (${founderTitle})\n• মূল লক্ষ্য: সততা, স্বচ্ছতা ও প্রযুক্তির মাধ্যমে মানুষের জীবন সহজ করা।`;
  }

  // 8. Blog & Articles & Videos
  if (
    query.includes('ব্লগ') ||
    query.includes('খবর') ||
    query.includes('ভিডিও') ||
    query.includes('আর্টিকেল') ||
    query.includes('পোস্ট') ||
    query.includes('blog') ||
    query.includes('article') ||
    query.includes('video')
  ) {
    if (articles.length > 0) {
      const artList = articles
        .slice(0, 4)
        .map((a, i) => `${i + 1}. ${a.title} (${a.category}) - ${a.date}`)
        .join('\n');
      return `আলহামদুলিল্লাহ, আমাদের সর্বশেষ প্রকাশিত ব্লগ ও আপডেট:\n\n${artList}\n\nওয়েবসাইটের "ব্লগ ও ভিডিও" সেকশনে সরাসরি ভিডিও প্লেয়ারে দেখতে পারবেন ইনশাআল্লাহ।`;
    }
    return `আলহামদুলিল্লাহ, নিয়মিত নতুন প্রযুক্তি ও শিক্ষণীয় ব্লগ প্রকাশ করা হয়। বিস্তারিত দেখতে ব্লগ সেকশন ভিজিট করুন।`;
  }

  // 9. Gallery
  if (
    query.includes('ছবি') ||
    query.includes('গ্যালারি') ||
    query.includes('ফটো') ||
    query.includes('image') ||
    query.includes('gallery')
  ) {
    return `আমাদের গ্যালারিতে মোট ${gallery.length || 0}টি চমৎকার ছবি রয়েছে। ওয়েবসাইটের "চিত্রশালা ও ফটো গ্যালারি" সেকশনে গুগল ড্রাইভের লাইভ ছবিগুলো পূর্ণ রেজ্যুলেশনে দেখতে পারবেন।`;
  }

  // 10. General courteous fallback
  return `আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ! আমি "${siteTitle}"-এর এআই সহকারী।\n\nগুগল স্প্রেডশিটের তথ্যের ভিত্তিতে আমি আপনাকে সহায়তা করতে পারি:\n১. পণ্য ও সেবাসমূহ এবং বিবরণ\n২. নির্ধারিত মূল্য তালিকা ও প্যাকেজ\n৩. যোগাযোগের ঠিকানা ও ফোন নম্বর\n৪. আমাদের ব্লগ, ভিডিও ও গ্যালারি\n৫. ব্যবসায়িক সততা ও ইসলামিক মূলনীতি\n\nইনশাআল্লাহ আপনার নির্দিষ্ট প্রশ্নটি বাংলায় লিখুন, আমি তথ্য জানিয়ে দিচ্ছি।`;
}
