/**
 * =========================================================================
 * GOOGLE APPS SCRIPT API FOR REUSABLE HEADLESS WEBSITE
 * =========================================================================
 * 
 * Instructions:
 * 1. Open your Google Sheet (or create a new one at sheets.new)
 * 2. Click "Extensions" > "Apps Script"
 * 3. Delete any code in the editor and PASTE this entire script.
 * 4. (Optional) Run the "setupInitialSheets" function once to auto-create all tabs & sample data.
 * 5. Click "Deploy" > "New deployment"
 * 6. Select type: "Web app"
 * 7. Set:
 *    - Description: "Website Headless CMS API"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone" (IMPORTANT: MUST BE "Anyone" for public API access)
 * 8. Click "Deploy", authorize permissions, and COPY your Web App URL.
 * 9. Paste the Web App URL into your website's script.js (or in the live configurator).
 * =========================================================================
 */

// Global Sheet Configuration
var DEFAULT_LEAD_SHEET = "send Message";

/**
 * Handles HTTP GET requests to read data from Google Sheets
 * Supported queries:
 *   - ?action=getAllData              (returns all sheets in one payload)
 *   - ?action=getData&sheet=Products  (returns rows from specific sheet)
 *   - ?action=getData&sheet=Settings  (returns key-value settings object)
 *   - ?action=getSettings             (alias for settings)
 */
function doGet(e) {
  try {
    var params = e ? e.parameter : {};
    var action = params.action || "getAllData";
    var sheetName = params.sheet || "";
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    var result = {};

    if (action === "getAllData") {
      result = {
        status: "success",
        data: {
          Settings: getSheetSettings(ss),
          Menu: getSheetRows(ss, "Menu"),
          about: getSheetRows(ss, "about"),
          Products: getSheetRows(ss, "Products"),
          Gallery: getSheetRows(ss, "Gallery"),
          "Article and update": getSheetRows(ss, "Article and update"),
          "send Message": getSheetRows(ss, "send Message")
        }
      };
    } else if (action === "getData" && sheetName) {
      if (sheetName.toLowerCase() === "settings") {
        result = {
          status: "success",
          sheet: sheetName,
          data: getSheetSettings(ss)
        };
      } else {
        result = {
          status: "success",
          sheet: sheetName,
          data: getSheetRows(ss, sheetName)
        };
      }
    } else if (action === "getSettings") {
      result = {
        status: "success",
        data: getSheetSettings(ss)
      };
    } else {
      result = {
        status: "error",
        message: "Invalid action or parameters. Use ?action=getAllData or ?action=getData&sheet=SheetName"
      };
    }

    return createJsonResponse(result);

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

/**
 * Handles HTTP POST requests to write data into Google Sheets (e.g. Contact Form / Leads)
 * Supported actions:
 *   - action=addLead
 *   - action=sendMessage
 */
function doPost(e) {
  try {
    var params = e ? e.parameter : {};
    var action = params.action || "";
    var postData = {};

    // Support both raw JSON body and standard form URL encoded POSTs
    if (e && e.postData && e.postData.contents) {
      try {
        postData = JSON.parse(e.postData.contents);
      } catch (err) {
        postData = e.parameter;
      }
    } else if (e && e.parameter) {
      postData = e.parameter;
    }

    var targetAction = action || postData.action || "addLead";

    if (targetAction === "addLead" || targetAction === "sendMessage") {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var targetSheetName = params.sheet || postData.sheet || DEFAULT_LEAD_SHEET;
      var sheet = ss.getSheetByName(targetSheetName);

      if (!sheet) {
        // If sheet doesn't exist, create it with standard columns
        sheet = ss.insertSheet(targetSheetName);
        sheet.appendRow(["timestamp", "name", "email", "phone", "message"]);
        sheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#e2e8f0");
      }

      var timestamp = postData.timestamp || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
      var name = postData.name || "";
      var email = postData.email || "";
      var phone = postData.phone || "";
      var message = postData.message || "";

      if (!name && !email && !message) {
        return createJsonResponse({
          status: "error",
          message: "Missing required fields: name, email, or message."
        });
      }

      sheet.appendRow([timestamp, name, email, phone, message]);

      return createJsonResponse({
        status: "success",
        message: "Message recorded successfully in Google Sheet!",
        data: {
          timestamp: timestamp,
          name: name,
          email: email,
          phone: phone,
          message: message
        }
      });
    }

    return createJsonResponse({
      status: "error",
      message: "Unrecognized POST action: " + targetAction
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: error.toString()
    });
  }
}

/**
 * Helper: Converts the 2-column 'Settings' tab (key, value) into a clean JSON object
 */
function getSheetSettings(ss) {
  var sheet = ss.getSheetByName("Settings");
  if (!sheet) return {};

  var data = sheet.getDataRange().getValues();
  var settings = {};

  // Row 0 is typically header (key, value)
  for (var i = 1; i < data.length; i++) {
    var key = String(data[i][0] || "").trim();
    var val = data[i][1];
    if (key) {
      settings[key] = val !== undefined ? String(val).trim() : "";
    }
  }

  return settings;
}

/**
 * Helper: Converts tabular sheets with headers into an array of objects
 */
function getSheetRows(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];

  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  // Sanitize headers: convert spaces to underscores, lowercase for consistency
  var rawHeaders = data[0];
  var headers = [];
  for (var h = 0; h < rawHeaders.length; h++) {
    var headerStr = String(rawHeaders[h] || "").trim().toLowerCase().replace(/[\s\W]+/g, "_");
    headers.push(headerStr);
  }

  var rows = [];
  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    var isBlank = true;
    var rowObj = {};

    for (var c = 0; c < headers.length; c++) {
      var cellVal = row[c];
      if (cellVal !== "" && cellVal !== null && cellVal !== undefined) {
        isBlank = false;
      }
      var headerKey = headers[c];
      if (headerKey) {
        rowObj[headerKey] = cellVal !== undefined ? cellVal : "";
      }
    }

    if (!isBlank) {
      rows.push(rowObj);
    }
  }

  return rows;
}

/**
 * Formats data as JSON response with CORS headers
 */
function createJsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ONE-CLICK SETUP FUNCTION: Run this in Apps Script editor to auto-create all 6 tabs with initial data!
 */
function setupInitialSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Settings Sheet (Key, Value)
  var settingsSheet = ss.getSheetByName("Settings") || ss.insertSheet("Settings");
  settingsSheet.clear();
  settingsSheet.appendRow(["key", "value"]);
  var defaultSettings = [
    ["site_title", "Apex Cloud Innovations"],
    ["logo_url", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80"],
    ["primary_color", "#2563eb"],
    ["secondary_color", "#0f172a"],
    ["hero_title", "Dynamic Digital Experiences Driven by Live Google Sheets"],
    ["hero_subtitle", "Update text, images, products, team, updates, and navigation in real time from your spreadsheet with zero code deployment."],
    ["hero_btn_text", "Explore Showcase"],
    ["hero_btn_link", "#gallery"],
    ["hero_bg_image", "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80"],
    ["contact_email", "hello@apexcloud.io"],
    ["contact_phone", "+1 (555) 438-9201"],
    ["contact_address", "742 Innovation Way, Suite 500, San Francisco, CA 94107"],
    ["footer_text", "© 2026 Apex Cloud Innovations Inc. All content managed seamlessly via Google Sheets."],
    ["facebook_url", "https://facebook.com"],
    ["twitter_url", "https://twitter.com"],
    ["linkedin_url", "https://linkedin.com"],
    ["youtube_url", "https://youtube.com"]
  ];
  for (var s = 0; s < defaultSettings.length; s++) {
    settingsSheet.appendRow(defaultSettings[s]);
  }
  settingsSheet.getRange(1, 1, 1, 2).setFontWeight("bold").setBackground("#dbeafe");

  // 2. Menu Sheet (id, name, link)
  var menuSheet = ss.getSheetByName("Menu") || ss.insertSheet("Menu");
  menuSheet.clear();
  menuSheet.appendRow(["id", "name", "link"]);
  var defaultMenu = [
    ["1", "Home", "#hero"],
    ["2", "About", "#about"],
    ["3", "Products", "#products"],
    ["4", "Gallery", "#gallery"],
    ["5", "Updates & Media", "#articles"],
    ["6", "Contact", "#contact"]
  ];
  for (var m = 0; m < defaultMenu.length; m++) {
    menuSheet.appendRow(defaultMenu[m]);
  }
  menuSheet.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#dbeafe");

  // 3. About Sheet (name, image_url, description)
  var aboutSheet = ss.getSheetByName("about") || ss.insertSheet("about");
  aboutSheet.clear();
  aboutSheet.appendRow(["name", "image_url", "description", "title", "badge"]);
  aboutSheet.appendRow([
    "Apex Innovation Labs",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80",
    "We build headless micro-frontends and dynamic portal solutions where business users can manage 100% of website content directly inside Google Sheets. No build pipelines, no CMS subscription fees, and instantaneous real-time sync with enterprise security and speed.",
    "Building Modern Real-Time Architectures",
    "About Our Platform"
  ]);
  aboutSheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#dbeafe");

  // 4. Products Sheet (id, name, category, price, image_url, description, button_text, button_link)
  var prodSheet = ss.getSheetByName("Products") || ss.insertSheet("Products");
  prodSheet.clear();
  prodSheet.appendRow(["id", "name", "category", "price", "image_url", "description", "button_text", "button_link"]);
  var defaultProducts = [
    ["prod-1", "Cloud Sync Engine Pro", "Enterprise", "$49 / mo", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80", "Automate spreadsheet data pipelines straight into high-performance web applications with sub-second caching.", "Learn More", "#contact"],
    ["prod-2", "Executive Analytics Suite", "Analytics", "$99 / mo", "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80", "Real-time interactive dashboard visuals calculated dynamically from rows and formulas in your Google Sheets.", "Request Demo", "#contact"],
    ["prod-3", "Headless CMS Webpack", "Tools", "$29 / mo", "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80", "Single-file embeddable script that connects any static HTML landing page to your Google Apps Script endpoint.", "Get Starter Kit", "#contact"],
    ["prod-4", "Automated Lead Ingestion", "Enterprise", "$79 / mo", "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80", "Instant web contact form dispatcher that stamps leads directly into your Google Sheets with email triggers.", "Connect Now", "#contact"]
  ];
  for (var p = 0; p < defaultProducts.length; p++) {
    prodSheet.appendRow(defaultProducts[p]);
  }
  prodSheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#dbeafe");

  // 5. Gallery Sheet (image uploaded, image title, description, image section)
  var gallerySheet = ss.getSheetByName("Gallery") || ss.insertSheet("Gallery");
  gallerySheet.clear();
  gallerySheet.appendRow(["image uploaded", "image title", "description", "image section"]);
  var defaultGallery = [
    ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80", "Headquarters Innovation Hub", "Our state-of-the-art laboratory and collaboration workspace.", "Workspace"],
    ["https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=80", "Design & Systems Engineering", "Cross-functional team sprint optimizing spreadsheet API throughput.", "Team"],
    ["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80", "Mobile First Architecture", "Adaptive responsive viewports configured automatically by CSS variables.", "Mobile"],
    ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80", "Cloud Infrastructure Matrix", "Distributed edge CDN network serving static and dynamic sheet endpoints.", "Architecture"],
    ["https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80", "Agile Development Sprint", "Bi-weekly strategy and code review sessions.", "Team"],
    ["https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80", "Modern Minimalist Workstation", "Ergonomic hardware workstations designed for focus and productivity.", "Workspace"]
  ];
  for (var g = 0; g < defaultGallery.length; g++) {
    gallerySheet.appendRow(defaultGallery[g]);
  }
  gallerySheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#dbeafe");

  // 6. Article and update Sheet (title, category, date, description, content, youtube_video_url, image_url, author)
  var articlesSheet = ss.getSheetByName("Article and update") || ss.insertSheet("Article and update");
  articlesSheet.clear();
  articlesSheet.appendRow(["title", "category", "date", "description", "content", "youtube_video_url", "image_url", "author"]);
  var defaultArticles = [
    [
      "Building Headless Websites Powered by Google Sheets & Apps Script",
      "Engineering",
      "August 20, 2026",
      "Discover how Google Apps Script acts as a zero-cost, high-reliability REST API for modern single-page applications.",
      "Google Sheets provides a flexible, collaborative data store that non-technical users are already comfortable with. Combined with Google Apps Script Web Apps, you can turn any spreadsheet into a structured JSON endpoint that responds to HTTP GET requests and records POST submissions instantly.",
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
      "Alex Rivera"
    ],
    [
      "Automated Lead Intake & Instant Notification Workflows",
      "Productivity",
      "August 15, 2026",
      "Learn how to capture website leads directly into Google Sheets and trigger automatic Gmail alerts in seconds.",
      "When a customer submits a contact form on your website, Google Apps Script parses the payload, creates a new row with timestamp in your 'send Message' sheet, and can even dispatch formatted confirmation emails to both you and your client automatically.",
      "https://www.youtube.com/watch?v=L_LUpnjgPso",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      "Sarah Chen"
    ],
    [
      "Responsive Theming via CSS Custom Properties from Sheet Settings",
      "Design System",
      "August 08, 2026",
      "How to bind hex color codes and branding assets from a spreadsheet key-value store to CSS variables.",
      "By querying the Settings tab in your Google Sheet, JavaScript dynamically updates :root CSS variables like --primary-color and --secondary-color. Changing a hex code in cell B3 immediately transforms buttons, badges, gradients, and hover states across the entire website.",
      "https://www.youtube.com/watch?v=9bZkp7q19f0",
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
      "Marcus Vance"
    ]
  ];
  for (var a = 0; a < defaultArticles.length; a++) {
    articlesSheet.appendRow(defaultArticles[a]);
  }
  articlesSheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#dbeafe");

  // 7. send Message Sheet (timestamp, name, email, phone, message)
  var messageSheet = ss.getSheetByName("send Message") || ss.insertSheet("send Message");
  messageSheet.clear();
  messageSheet.appendRow(["timestamp", "name", "email", "phone", "message"]);
  messageSheet.appendRow([
    "2026-08-22 14:32:00",
    "Elena Rostova",
    "elena@example.com",
    "+1 555 0192",
    "We would like to connect our team's Google Sheet inventory to our public showroom landing page."
  ]);
  messageSheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#dbeafe");

  SpreadsheetApp.flush();
  Logger.log("✅ All 6 Google Sheet tabs initialized successfully with sample data!");
}
