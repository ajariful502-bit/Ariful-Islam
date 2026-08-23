import { GoogleSheetDatabase } from '../types';

export const DEFAULT_SHEET_DATA: GoogleSheetDatabase = {
  Settings: {
    site_title: "প্রবর্তন ডিজিটাল হাব",
    logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    avatar_icon_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    about_me_summary: "আমি একজন পেশাদার ওয়েব ডেভেলপার এবং গুগল ওয়ার্কস্পেস অটোমেশন বিশেষজ্ঞ। আধুনিক ও ডায়নামিক ওয়েবসাইট তৈরি এবং গুগল শিটকে ডাটাবেস হিসেবে ব্যবহার করে বিজনেস অটোমেশনে সাহায্য করাই আমার লক্ষ্য।",
    about_me_designation: "প্রতিষ্ঠাতা ও লিড সলিউশন আর্কিটেক্ট",
    primary_color: "#1d4ed8", // Royal Blue
    secondary_color: "#0f172a", // Dark Slate
    hero_title: "গুগল শিট চালিত আধুনিক ডায়নামিক ওয়েব প্ল্যাটফর্ম",
    hero_subtitle: "আপনার গুগল শিটের প্রতিটি রো থেকে সরাসরি পরিচালিত হবে ওয়েবসাইটের স্লাইডার, পণ্য, গ্যালারি, খবর ও ফর্মের ডাটা। কোনো কোডিং ছাড়াই রিয়েল-টাইমে আপডেট করুন।",
    hero_btn_text: "আমাদের পণ্য দেখুন",
    hero_btn_link: "#products",
    hero_bg_image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80",
    contact_email: "contact@probortonhub.com",
    contact_phone: "+৮৮০১৭১২-৩৪৫৬৭৮",
    contact_address: "লেভেল ৫, আইটি ইনোভেশন পার্ক, কারওয়ান বাজার, ঢাকা ১২১৫",
    footer_text: "© ২০২৬ প্রবর্তন ডিজিটাল হাব। সর্বস্বত্ব সংরক্ষিত। গুগল শিট ও অ্যাপস স্ক্রিপ্ট এপিআই দ্বারা সরাসরি পরিচালিত।",
    facebook_url: "https://facebook.com",
    twitter_url: "https://twitter.com",
    linkedin_url: "https://linkedin.com",
    youtube_url: "https://youtube.com",
  },
  Sliders: [
    {
      id: "slide-1",
      image_url: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&auto=format&fit=crop&q=80",
      badge: "নতুন উদ্ভাবন",
      title: "গুগল শিট দিয়ে ওয়েবসাইট পরিচালনার সহজ সমাধান",
      subtitle: "কোনো জটিল সিএমএস ছাড়া শুধুমাত্র আপনার পছন্দের স্প্রেডশিট থেকে কনটেন্ট পরিচালনা করুন мгণেই।",
      button_text: "সেবাসমূহ দেখুন",
      button_link: "#products"
    },
    {
      id: "slide-2",
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&auto=format&fit=crop&q=80",
      badge: "উচ্চ পারফরম্যান্স",
      title: "এক ক্লিকে রিয়েল-টাইম ডাটা সিঙ্ক ও অটোমেশন",
      subtitle: "আপনার মোবাইল বা ল্যাপটপ থেকে স্প্রেডশিট আপডেট করলেই ওয়েবসাইটে স্বয়ংক্রিয়ভাবে পরিবর্তিত হবে।",
      button_text: "গ্যালারি ঘুরে আসুন",
      button_link: "#gallery"
    },
    {
      id: "slide-3",
      image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1600&auto=format&fit=crop&q=80",
      badge: "এআই পাওয়ারড",
      title: "স্মার্ট এআই চ্যাটবট সহকারী যুক্ত প্রতিটি পেজে",
      subtitle: "গুগল শিটের তথ্যের ভিত্তিতে স্বয়ংক্রিয়ভাবে গ্রাহকের প্রশ্নের নিখুঁত উত্তর দেবে ইন্টেলিজেন্ট এআই।",
      button_text: "যোগাযোগ করুন",
      button_link: "#contact"
    }
  ],
  Menu: [
    { id: "1", name: "হোম", link: "#hero" },
    { id: "2", name: "আমাদের সম্পর্কে", link: "#about" },
    { id: "3", name: "পণ্য ও সেবা", link: "#products" },
    { id: "4", name: "গ্যালারি", link: "#gallery" },
    { id: "5", name: "ব্লগ ও খবর", link: "#articles" },
    { id: "6", name: "যোগাযোগ", link: "#contact" }
  ],
  about: [
    {
      name: "প্রবর্তন ডিজিটাল ল্যাবস",
      title: "আধুনিক ডিজিটাল আর্কিটেকচার ও বিজনেস অটোমেশন",
      badge: "আমাদের পরিচিতি",
      image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80",
      description: "আমরা উদ্ভাবনী হেডলেস ওয়েব ও ক্লাউড প্রযুক্তি সরবরাহ করি যেখানে প্রতিষ্ঠানগুলো তাদের সম্পূর্ণ ওয়েবসাইট কন্টেন্ট সরাসরি গুগল শিটের মাধ্যমে অতি সহজে নিয়ন্ত্রণ করতে পারে। কোনো অতিরিক্ত হোস্টিং বা ডেটাবেস ফি ছাড়াই সর্বোচ্চ গতি ও নিরাপত্তার নিশ্চয়তা।",
      highlight1: "১০০% গুগল শিট ইন্টিগ্রেশন ও লাইভ এপিআই সিঙ্ক",
      highlight2: "স্মার্ট এআই চ্যাটবট অ্যাসিস্ট্যান্টের সার্বক্ষণিক সহায়তা",
      highlight3: "১৬:৯ রেস্পন্সিভ ইমেজ স্লাইডার ও মডার্ন ইউজার ইন্টারফেস"
    }
  ],
  Products: [
    {
      id: "prod-1",
      name: "ক্লাউড শিট সিএমএস ইঞ্জিন প্রো",
      category: "সফটওয়্যার",
      price: "৳ ৩,৫০০ / মাস",
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
      description: "গুগল স্প্রেডশিটের যেকোনো তথ্য সরাসরি আধুনিক ওয়েবসাইট ও মোবাইল ভিউতে সেকেন্ডের মধ্যে রেন্ডার করার প্রফেশনাল ইঞ্জিন।",
      button_text: "বিস্তারিত দেখুন",
      button_link: "#contact"
    },
    {
      id: "prod-2",
      name: "স্মার্ট লিড জেনারেশন ও সিআরএম",
      category: "অটোমেশন",
      price: "৳ ৫,০০০ / মাস",
      image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
      description: "ওয়েবসাইট থেকে আসা সকল কাস্টমার মেসেজ ও লিড স্বয়ংক্রিয়ভাবে গুগল শিটে টাইমস্ট্যাম্প সহ জমা এবং তাৎক্ষণিক ইমেইল অ্যালার্ট।",
      button_text: "ডেমো দেখুন",
      button_link: "#contact"
    },
    {
      id: "prod-3",
      name: "এআই নলেজবেস চ্যাটবট সিস্টেম",
      category: "এআই সলিউশন",
      price: "৳ ৪,২০০ / মাস",
      image_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
      description: "গুগল শিটের প্রতিটি তথ্য পড়ে নিয়ে গ্রাহকদের নিখুঁত ও মার্জিত বাংলায় ২৪/৭ স্বয়ংক্রিয় উত্তর প্রদানের এআই চালিত এজেন্ট।",
      button_text: "শুরু করুন",
      button_link: "#contact"
    },
    {
      id: "prod-4",
      name: "ডাইনামিক পোর্টফোলিও ও শোরুম",
      category: "ডিজাইন",
      price: "৳ ২,৮০০ / এককালীন",
      image_url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80",
      description: "১৬:৯ এইচডি ইমেজ স্লাইডার, ভিডিও গ্যালারি ও ক্যাটাগরি ফিল্টারিং সমন্বিত রেডিমেড রেস্পন্সিভ শোকেস।",
      button_text: "প্যাকেজ নিন",
      button_link: "#contact"
    }
  ],
  Gallery: [
    {
      image_uploaded: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
      image_title: "আমাদের প্রধান ইনোভেশন সেন্টার",
      description: "ঢাকার অত্যাধুনিক ল্যাব এবং টিম কোলাবোরেশন হাব।",
      image_section: "অফিস"
    },
    {
      image_uploaded: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=80",
      image_title: "সফটওয়্যার ও ক্লাউড আর্কিটেকচার টিম",
      description: "আমাদের ইঞ্জিনিয়ারিং দলের নিবেদিত কর্মপ্রয়াস।",
      image_section: "টিম"
    },
    {
      image_uploaded: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
      image_title: "মোবাইল ও ওয়েব রেস্পন্সিভ ডিসপ্লে",
      description: "সব ডিভাইসে স্বাচ্ছন্দ্যে প্রদর্শনযোগ্য অভিযোজিত ডিজাইন।",
      image_section: "প্রযুক্তি"
    },
    {
      image_uploaded: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
      image_title: "ক্লাউড সার্ভার ও ডাটাবেস মেট্রিক্স",
      description: "জিরো ডাউনটাইম ও সুপারফাস্ট কনটেন্ট ডেলিভারি নেটওয়ার্ক।",
      image_section: "ইনফ্রাস্ট্রাকচার"
    },
    {
      image_uploaded: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
      image_title: "সাপ্তাহিক স্ট্র্যাটেজি ও রিভিউ সেশন",
      description: "নতুন প্রযুক্তি প্রয়োগ ও কাস্টমার সন্তুষ্টি পরিকল্পনা।",
      image_section: "টিম"
    },
    {
      image_uploaded: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
      image_title: "ওয়ার্কস্টেশন ও ফোকাস জোন",
      description: "শান্ত ও রুচিশীল পরিবেশে কোডিং ও ডিজাইনিং অভিজ্ঞতা।",
      image_section: "অফিস"
    }
  ],
  "Article and update": [
    {
      id: "art-1",
      title: "গুগল শিট ও অ্যাপস স্ক্রিপ্ট দিয়ে ওয়েবসাইট তৈরির সহজ উপায়",
      category: "টিউটোরিয়াল",
      date: "২০ আগস্ট, ২০২৬",
      description: "কীভাবে গুগল শিটকে ডাটাবেস হিসেবে ব্যবহার করে কোনো কোডিং ছাড়াই পুরো ওয়েবসাইট স্বয়ংক্রিয়ভাবে নিয়ন্ত্রণ করা যায়।",
      content: "গুগল শিট আমাদের সবার পরিচিত একটি স্প্রেডশিট টুল। গুগল অ্যাপস স্ক্রিপ্টের Web App ডিপ্লয়মেন্ট ফিচারের মাধ্যমে এটি একটি শক্তিশালী রেস্ট এপিআই (REST API) হিসেবে কাজ করতে পারে। ফলে ওয়েবসাইটে যেকোনো লেখা, ছবি বা পণ্য সেকেন্ডের মধ্যে আপডেট করা সম্ভব হয়।",
      youtube_video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
      author: "আরিফুল ইসলাম",
      read_time: "৫ মিনিট পঠন",
      link: "#"
    },
    {
      id: "art-2",
      title: "ওয়েবসাইটে এআই চ্যাটবট যুক্ত করার ব্যবসায়িক সুবিধা",
      category: "এআই ও অটোমেশন",
      date: "১৫ আগস্ট, ২০২৬",
      description: "গুগল শিটের তথ্যের উপর ভিত্তি করে গ্রাহকদের প্রতিটি প্রশ্নের তাৎক্ষণিক উত্তর প্রদানকারী স্মার্ট চ্যাটবট।",
      content: "গ্রাহকরা যখন আপনার ওয়েবসাইটে প্রবেশ করেন, তখন তাদের প্রয়োজনীয় তথ্যের জন্য অপেক্ষা করতে হয় না। এআই চ্যাটবট সরাসরি গুগল শিটের পণ্য তালিকা, মূল্য এবং বিবরণ পড়ে নিয়ে প্রতিটি ভিজিটরকে সঠিক পরামর্শ দিতে পারে।",
      youtube_video_url: "https://www.youtube.com/watch?v=L_LUpnjgPso",
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      author: "তানভীর আহমেদ",
      read_time: "৪ মিনিট পঠন",
      link: "#"
    },
    {
      id: "art-3",
      title: "১৬:৯ এইচডি ইমেজ স্লাইডার ও ভিজ্যুয়াল ব্র্যান্ডিং",
      category: "ডিজাইন টিপস",
      date: "০৮ আগস্ট, ২০২৬",
      description: "ওয়েবসাইটের হেডারকে আকর্ষণীয় করতে ১৬:৯ রেশিওর ইমেজ স্লাইডারের ভূমিকা ও সেরা অনুশীলন।",
      content: "১৬:৯ অ্যাসপেক্ট রেশিও হলো বর্তমানে ডিজিটাল স্ক্রিন এবং মোবাইল ডিভাইসের জন্য আদর্শ অনুপাত। এতে ছবি না কেটে সম্পূর্ণ দৃশ্যপট সুন্দরভাবে ফুটে ওঠে এবং সাথে আকর্ষণীয় টেক্সট ও বাটন যুক্ত করা যায়।",
      youtube_video_url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
      image_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
      author: "নুসরাত জাহান",
      read_time: "৬ মিনিট পঠন",
      link: "#"
    }
  ],
  "send Message": [
    {
      timestamp: "2026-08-22 14:32:00",
      name: "মাহমুদুর রহমান",
      email: "mahmud@example.com",
      phone: "+৮৮০১৭১১-২২৩৩৪৪",
      message: "আমরা আমাদের প্রতিষ্ঠানের প্রোডাক্ট ক্যাটালগ গুগল শিট থেকে ওয়েবসাইটে সরাসরি সিঙ্ক করতে আগ্রহী।"
    },
    {
      timestamp: "2026-08-23 09:15:22",
      name: "সাদিয়া আফরোজ",
      email: "sadia@techbangla.com",
      phone: "+৮৮০১৮১২-৯৯৮৮৭৭",
      message: "১৬:৯ ইমেজ স্লাইডার ও এআই চ্যাটবটের ফিচারটি খুবই চমৎকার লেগেছে। ধন্যবাদ!"
    }
  ]
};
