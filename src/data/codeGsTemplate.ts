export const CODE_GS_SCRIPT = `/**
 * ============================================================================
 * GOOGLE APPS SCRIPT: বাংলা গুগল শিট সিএমএস ও ব্যাকএন্ড এপিআই
 * ============================================================================
 * এই স্ক্রিপ্টটি আপনার গুগল স্প্রেডশিটকে একটি পূর্ণাঙ্গ রিয়েল-টাইম হেডলেস
 * সিএমএস (REST API)-এ রূপান্তরিত করে।
 * 
 * প্রস্তুত করেছেন: প্রবর্তন ডিজিটাল হাব
 * সংস্করণ: 2.0 (১৬:৯ স্লাইডার, চ্যাটবট ও অল-ইন-ওয়ান সিঙ্ক সহ)
 * ============================================================================
 */

// ১. প্রথমবার ব্যবহারের জন্য শিটগুলোর কলাম ও প্রাথমিক ডাটা তৈরির ফাংশন
function setupInitialSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // ১. Settings Sheet
  var settingsSheet = ss.getSheetByName("Settings") || ss.insertSheet("Settings");
  if (settingsSheet.getLastRow() === 0) {
    settingsSheet.appendRow(["Key", "Value"]);
    var defaultSettings = [
      ["site_title", "প্রবর্তন ডিজিটাল হাব"],
      ["logo_url", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80"],
      ["avatar_icon_url", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"],
      ["about_me_summary", "আমি একজন পেশাদার ওয়েব ডেভেলপার এবং গুগল ওয়ার্কস্পেস অটোমেশন বিশেষজ্ঞ। আধুনিক ও ডায়নামিক ওয়েবসাইট তৈরিতে নিয়োজিত।"],
      ["about_me_designation", "প্রতিষ্ঠাতা ও লিড আর্কিটেক্ট"],
      ["primary_color", "#1d4ed8"],
      ["secondary_color", "#0f172a"],
      ["hero_title", "গুগল শিট চালিত আধুনিক ডায়নামিক প্ল্যাটফর্ম"],
      ["hero_subtitle", "আপনার গুগল শিট থেকে স্বয়ংক্রিয়ভাবে পরিচালিত হবে ওয়েবসাইটের স্লাইডার, পণ্য, গ্যালারি ও কন্টেন্ট।"],
      ["hero_btn_text", "পণ্যসমূহ দেখুন"],
      ["hero_btn_link", "#products"],
      ["hero_bg_image", "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80"],
      ["contact_email", "contact@probortonhub.com"],
      ["contact_phone", "+৮৮০১৭১২-৩৪৫৬৭৮"],
      ["contact_address", "কারওয়ান বাজার, ঢাকা ১২১৫"],
      ["footer_text", "© ২০২৬ প্রবর্তন ডিজিটাল হাব। গুগল শিট দ্বারা সরাসরি পরিচালিত।"],
      ["facebook_url", "https://facebook.com"],
      ["twitter_url", "https://twitter.com"],
      ["linkedin_url", "https://linkedin.com"],
      ["youtube_url", "https://youtube.com"]
    ];
    for (var i = 0; i < defaultSettings.length; i++) {
      settingsSheet.appendRow(defaultSettings[i]);
    }
  }

  // ২. Sliders Sheet (১৬:৯ এইচডি ইমেজ স্লাইডার)
  var slidersSheet = ss.getSheetByName("Sliders") || ss.insertSheet("Sliders");
  if (slidersSheet.getLastRow() === 0) {
    slidersSheet.appendRow(["id", "image_url", "badge", "title", "subtitle", "button_text", "button_link"]);
    slidersSheet.appendRow(["slide-1", "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1600&auto=format&fit=crop&q=80", "নতুন উদ্ভাবন", "গুগল শিট দিয়ে ওয়েবসাইট পরিচালনার সহজ সমাধান", "কোনো জটিল সিএমএস ছাড়া শুধুমাত্র আপনার স্প্রেডশিট থেকে কনটেন্ট পরিচালনা করুন।", "সেবাসমূহ দেখুন", "#products"]);
    slidersSheet.appendRow(["slide-2", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&auto=format&fit=crop&q=80", "উচ্চ গতি", "এক ক্লিকে রিয়েল-টাইম ডাটা সিঙ্ক ও অটোমেশন", "স্প্রেডশিট আপডেট করলেই ওয়েবসাইটে স্বয়ংক্রিয়ভাবে পরিবর্তিত হবে।", "গ্যালারি দেখুন", "#gallery"]);
  }

  // ৩. Menu Sheet
  var menuSheet = ss.getSheetByName("Menu") || ss.insertSheet("Menu");
  if (menuSheet.getLastRow() === 0) {
    menuSheet.appendRow(["id", "name", "link"]);
    menuSheet.appendRow(["1", "হোম", "#hero"]);
    menuSheet.appendRow(["2", "আমাদের সম্পর্কে", "#about"]);
    menuSheet.appendRow(["3", "পণ্য ও সেবা", "#products"]);
    menuSheet.appendRow(["4", "গ্যালারি", "#gallery"]);
    menuSheet.appendRow(["5", "ব্লগ ও খবর", "#articles"]);
    menuSheet.appendRow(["6", "যোগাযোগ", "#contact"]);
  }

  // ৪. about Sheet
  var aboutSheet = ss.getSheetByName("about") || ss.insertSheet("about");
  if (aboutSheet.getLastRow() === 0) {
    aboutSheet.appendRow(["name", "title", "badge", "image_url", "description", "highlight1", "highlight2", "highlight3"]);
    aboutSheet.appendRow([
      "প্রবর্তন ডিজিটাল ল্যাবস",
      "আধুনিক ডিজিটাল আর্কিটেকচার ও বিজনেস অটোমেশন",
      "আমাদের পরিচিতি",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80",
      "আমরা উদ্ভাবনী হেডলেস প্রযুক্তি সরবরাহ করি যেখানে প্রতিষ্ঠানগুলো তাদের সম্পূর্ণ ওয়েবসাইট কন্টেন্ট সরাসরি গুগল শিটের মাধ্যমে নিয়ন্ত্রণ করতে পারে।",
      "১০০% গুগল শিট ইন্টিগ্রেশন ও লাইভ সিঙ্ক",
      "স্মার্ট এআই চ্যাটবট অ্যাসিস্ট্যান্টের সার্বক্ষণিক সহায়তা",
      "১৬:৯ রেস্পন্সিভ ইমেজ স্লাইডার ও মডার্ন ডিজাইন"
    ]);
  }

  // ৫. Products Sheet
  var productsSheet = ss.getSheetByName("Products") || ss.insertSheet("Products");
  if (productsSheet.getLastRow() === 0) {
    productsSheet.appendRow(["id", "name", "category", "price", "image_url", "description", "button_text", "button_link"]);
    productsSheet.appendRow(["prod-1", "ক্লাউড শিট সিএমএস ইঞ্জিন প্রো", "সফটওয়্যার", "৳ ৩,৫০০ / মাস", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80", "গুগল স্প্রেডশিটের যেকোনো তথ্য সরাসরি আধুনিক ওয়েবসাইটে প্রদর্শনের ব্যবস্থা।", "বিস্তারিত", "#contact"]);
    productsSheet.appendRow(["prod-2", "স্মার্ট লিড জেনারেশন ও সিআরএম", "অটোমেশন", "৳ ৫,০০০ / মাস", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80", "ওয়েবসাইটের মেসেজ সরাসরি গুগল শিটে সংরক্ষণ ও অ্যালার্ট।", "ডেমো দেখুন", "#contact"]);
  }

  // ৬. Gallery Sheet
  var gallerySheet = ss.getSheetByName("Gallery") || ss.insertSheet("Gallery");
  if (gallerySheet.getLastRow() === 0) {
    gallerySheet.appendRow(["image_uploaded", "image_title", "image_section", "description"]);
    gallerySheet.appendRow(["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80", "আমাদের প্রধান ইনোভেশন সেন্টার", "অফিস", "ঢাকার অত্যাধুনিক ল্যাব এবং টিম কোলাবোরেশন হাব।"]);
    gallerySheet.appendRow(["https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=80", "সফটওয়্যার ও আর্কিটেকচার টিম", "টিম", "আমাদের ইঞ্জিনিয়ারিং দলের নিবেদিত কর্মপ্রয়াস।"]);
  }

  // ৭. Article and update Sheet
  var articlesSheet = ss.getSheetByName("Article and update") || ss.insertSheet("Article and update");
  if (articlesSheet.getLastRow() === 0) {
    articlesSheet.appendRow(["id", "title", "category", "date", "description", "content", "youtube_video_url", "image_url", "author", "read_time", "link"]);
    articlesSheet.appendRow([
      "art-1",
      "গুগল শিট ও অ্যাপস স্ক্রিপ্ট দিয়ে ওয়েবসাইট তৈরির সহজ উপায়",
      "টিউটোরিয়াল",
      "২০ আগস্ট, ২০২৬",
      "কীভাবে গুগল শিটকে ডাটাবেস হিসেবে ব্যবহার করে পুরো ওয়েবসাইট স্বয়ংক্রিয়ভাবে নিয়ন্ত্রণ করা যায়।",
      "গুগল শিট এবং গুগল অ্যাপস স্ক্রিপ্ট দিয়ে অতি দ্রুত রেস্ট এপিআই তৈরি করে সিঙ্গেল পেজ অ্যাপ্লিকেশন চালনা করা সম্ভব।",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
      "আরিফুল ইসলাম",
      "৫ মিনিট পঠন",
      "#"
    ]);
  }

  // ৮. send Message Sheet (মেসেজ সংরক্ষণের জন্য)
  var messageSheet = ss.getSheetByName("send Message") || ss.insertSheet("send Message");
  if (messageSheet.getLastRow() === 0) {
    messageSheet.appendRow(["timestamp", "name", "email", "phone", "message"]);
    messageSheet.appendRow(["2026-08-23 10:00:00", "সাদিয়া আফরোজ", "sadia@example.com", "+৮৮০১৭১১-০০০০০০", "গুগল শিট সিএমএস সম্পর্কে জানতে চাই।"]);
  }
}

// ২. HTTP GET: সমস্ত শিটের ডাটা JSON ফরম্যাটে পাঠানো
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result = {
    status: "success",
    timestamp: new Date().toISOString(),
    data: {}
  };

  try {
    // ক. Settings
    var settingsSheet = ss.getSheetByName("Settings");
    if (settingsSheet && settingsSheet.getLastRow() > 1) {
      var settingsValues = settingsSheet.getDataRange().getValues();
      var settingsObj = {};
      for (var i = 1; i < settingsValues.length; i++) {
        var key = String(settingsValues[i][0]).trim();
        var val = String(settingsValues[i][1]).trim();
        if (key) {
          settingsObj[key] = val;
        }
      }
      result.data["Settings"] = settingsObj;
    }

    // খ. Sliders
    result.data["Sliders"] = getSheetDataAsJson(ss, "Sliders");

    // গ. Menu
    result.data["Menu"] = getSheetDataAsJson(ss, "Menu");

    // ঘ. about
    result.data["about"] = getSheetDataAsJson(ss, "about");

    // ঙ. Products
    result.data["Products"] = getSheetDataAsJson(ss, "Products");

    // চ. Gallery
    result.data["Gallery"] = getSheetDataAsJson(ss, "Gallery");

    // ছ. Article and update
    result.data["Article and update"] = getSheetDataAsJson(ss, "Article and update");

    // জ. send Message
    result.data["send Message"] = getSheetDataAsJson(ss, "send Message");

  } catch (err) {
    result.status = "error";
    result.message = err.toString();
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ৩. HTTP POST: কন্টাক্ট ফর্ম মেসেজ সংরক্ষণ বা বাল্ক ডাটা আপডেট
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var result = { status: "success", message: "Data received successfully" };

  try {
    var params = e.parameter || {};
    var postData = "";
    if (e.postData && e.postData.contents) {
      try {
        var jsonBody = JSON.parse(e.postData.contents);
        params = Object.assign(params, jsonBody);
      } catch (err) {
        // Form encoded fallback
      }
    }

    var action = params.action || "addLead";

    // কন্টাক্ট ফর্ম থেকে মেসেজ যুক্ত করা
    if (action === "addLead" || action === "sendMessage") {
      var msgSheet = ss.getSheetByName("send Message") || ss.insertSheet("send Message");
      if (msgSheet.getLastRow() === 0) {
        msgSheet.appendRow(["timestamp", "name", "email", "phone", "message"]);
      }
      var now = Utilities.formatDate(new Date(), "GMT+6", "yyyy-MM-dd HH:mm:ss");
      var name = params.name || "Anonymous";
      var email = params.email || "";
      var phone = params.phone || "";
      var message = params.message || "";

      msgSheet.appendRow([now, name, email, phone, message]);
      result.message = "Message successfully added to 'send Message' sheet";
    }

  } catch (err) {
    result.status = "error";
    result.message = err.toString();
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// শিটের ডাটা অবজেক্ট অ্যারেতে কনভার্ট করার হেল্পার
function getSheetDataAsJson(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];

  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  var rows = [];

  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    var item = {};
    var hasData = false;

    for (var j = 0; j < headers.length; j++) {
      var key = String(headers[j]).trim();
      var val = row[j];
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        hasData = true;
      }
      item[key] = val !== undefined && val !== null ? String(val).trim() : "";
    }

    if (hasData) {
      rows.push(item);
    }
  }

  return rows;
}
`;
