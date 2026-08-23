/**
 * =========================================================================
 * SCRIPT.JS - Reusable Google Sheets Headless CMS Engine
 * =========================================================================
 * Fetches all site data from Google Apps Script Web App JSON API,
 * dynamically injects content, styles, filters, and handles form submission.
 * =========================================================================
 */

// =========================================================================
// CONFIGURATION: PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
// =========================================================================
// If left empty or null, the application will fallback to DEFAULT_FALLBACK_DATA
let GOOGLE_APPS_SCRIPT_URL = localStorage.getItem('google_sheet_api_url') || "";

// Sample Fallback Data (Matches Google Sheet Structure)
const DEFAULT_FALLBACK_DATA = {
  Settings: {
    site_title: "Apex Cloud Innovations",
    logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    primary_color: "#2563eb", // CHANGE THIS IN GOOGLE SHEET -> Settings: primary_color
    secondary_color: "#0f172a", // CHANGE THIS IN GOOGLE SHEET -> Settings: secondary_color
    hero_title: "Dynamic Digital Experiences Driven by Live Google Sheets",
    hero_subtitle: "Update text, images, products, team, updates, and navigation in real time from your spreadsheet with zero code deployment.",
    hero_btn_text: "Explore Showcase",
    hero_btn_link: "#products",
    hero_bg_image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80",
    contact_email: "hello@apexcloud.io",
    contact_phone: "+1 (555) 438-9201",
    contact_address: "742 Innovation Way, Suite 500, San Francisco, CA 94107",
    footer_text: "© 2026 Apex Cloud Innovations Inc. All content dynamically synced from Google Sheets via Google Apps Script.",
    facebook_url: "https://facebook.com",
    twitter_url: "https://twitter.com",
    linkedin_url: "https://linkedin.com",
    youtube_url: "https://youtube.com"
  },
  Menu: [
    { id: "1", name: "Home", link: "#hero" },
    { id: "2", name: "About", link: "#about" },
    { id: "3", name: "Products", link: "#products" },
    { id: "4", name: "Gallery", link: "#gallery" },
    { id: "5", name: "Updates & Media", link: "#articles" },
    { id: "6", name: "Contact", link: "#contact" }
  ],
  about: [
    {
      name: "Apex Innovation Labs",
      title: "Building Modern Real-Time Architectures",
      badge: "About Our Platform",
      image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&auto=format&fit=crop&q=80",
      description: "We build headless micro-frontends and dynamic portal solutions where business users can manage 100% of website content directly inside Google Sheets. No build pipelines, no CMS subscription fees, and instantaneous real-time sync with enterprise security and speed.",
      highlight1: "Zero-Latency Caching & High Availability",
      highlight2: "Bi-directional Google Sheet Syncing & Form Submissions",
      highlight3: "Full Responsive Layout with Dynamic Theming"
    }
  ],
  Products: [
    {
      id: "prod-1",
      name: "Cloud Sync Engine Pro",
      category: "Enterprise",
      price: "$49 / mo",
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
      description: "Automate spreadsheet data pipelines straight into high-performance web applications with sub-second caching.",
      button_text: "Learn More",
      button_link: "#contact"
    },
    {
      id: "prod-2",
      name: "Executive Analytics Suite",
      category: "Analytics",
      price: "$99 / mo",
      image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
      description: "Real-time interactive dashboard visuals calculated dynamically from rows and formulas in your Google Sheets.",
      button_text: "Request Demo",
      button_link: "#contact"
    },
    {
      id: "prod-3",
      name: "Headless CMS Webpack",
      category: "Tools",
      price: "$29 / mo",
      image_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
      description: "Single-file embeddable script that connects any static HTML landing page to your Google Apps Script endpoint.",
      button_text: "Get Starter Kit",
      button_link: "#contact"
    },
    {
      id: "prod-4",
      name: "Automated Lead Ingestion",
      category: "Enterprise",
      price: "$79 / mo",
      image_url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80",
      description: "Instant web contact form dispatcher that stamps leads directly into your Google Sheets with email triggers.",
      button_text: "Connect Now",
      button_link: "#contact"
    }
  ],
  Gallery: [
    {
      image_uploaded: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
      image_title: "Headquarters Innovation Hub",
      description: "Our state-of-the-art laboratory and collaboration workspace.",
      image_section: "Workspace"
    },
    {
      image_uploaded: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&auto=format&fit=crop&q=80",
      image_title: "Design & Systems Engineering",
      description: "Cross-functional team sprint optimizing spreadsheet API throughput.",
      image_section: "Team"
    },
    {
      image_uploaded: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
      image_title: "Mobile First Architecture",
      description: "Adaptive responsive viewports configured automatically by CSS variables.",
      image_section: "Mobile"
    },
    {
      image_uploaded: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
      image_title: "Cloud Infrastructure Matrix",
      description: "Distributed edge CDN network serving static and dynamic sheet endpoints.",
      image_section: "Architecture"
    },
    {
      image_uploaded: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
      image_title: "Agile Development Sprint",
      description: "Bi-weekly strategy and code review sessions.",
      image_section: "Team"
    },
    {
      image_uploaded: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
      image_title: "Modern Minimalist Workstation",
      description: "Ergonomic hardware workstations designed for focus and productivity.",
      image_section: "Workspace"
    }
  ],
  "Article and update": [
    {
      id: "art-1",
      title: "Building Headless Websites Powered by Google Sheets & Apps Script",
      category: "Engineering",
      date: "August 20, 2026",
      description: "Discover how Google Apps Script acts as a zero-cost, high-reliability REST API for modern single-page applications.",
      content: "Google Sheets provides a flexible, collaborative data store that non-technical users are already comfortable with. Combined with Google Apps Script Web Apps, you can turn any spreadsheet into a structured JSON endpoint that responds to HTTP GET requests and records POST submissions instantly.",
      youtube_video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
      author: "Alex Rivera",
      read_time: "5 min read"
    },
    {
      id: "art-2",
      title: "Automated Lead Intake & Instant Notification Workflows",
      category: "Productivity",
      date: "August 15, 2026",
      description: "Learn how to capture website leads directly into Google Sheets and trigger automatic Gmail alerts in seconds.",
      content: "When a customer submits a contact form on your website, Google Apps Script parses the payload, creates a new row with timestamp in your 'send Message' sheet, and can even dispatch formatted confirmation emails to both you and your client automatically.",
      youtube_video_url: "https://www.youtube.com/watch?v=L_LUpnjgPso",
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      author: "Sarah Chen",
      read_time: "4 min read"
    },
    {
      id: "art-3",
      title: "Responsive Theming via CSS Custom Properties from Sheet Settings",
      category: "Design System",
      date: "August 08, 2026",
      description: "How to bind hex color codes and branding assets from a spreadsheet key-value store to CSS variables.",
      content: "By querying the Settings tab in your Google Sheet, JavaScript dynamically updates :root CSS variables like --primary-color and --secondary-color. Changing a hex code in cell B3 immediately transforms buttons, badges, gradients, and hover states across the entire website.",
      youtube_video_url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
      image_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
      author: "Marcus Vance",
      read_time: "6 min read"
    }
  ]
};

// Global State
let currentSheetData = DEFAULT_FALLBACK_DATA;
let selectedProductCategory = "All";
let selectedGallerySection = "All";

/**
 * Initialize on DOM Load
 */
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  fetchGoogleSheetData();
  renderIcons();
});

/**
 * Render Lucide Icons safely
 */
function renderIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

/**
 * Sets up all UI event listeners (modals, filters, form submissions, mobile nav)
 */
function setupEventListeners() {
  // Mobile Hamburger Toggle
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Refresh Button
  const refreshBtn = document.getElementById("refresh-data-btn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      showToast("Fetching latest changes from Google Sheet...", "info");
      fetchGoogleSheetData();
    });
  }

  // Config Modal
  const openConfigBtn = document.getElementById("open-config-btn");
  const closeConfigBtn = document.getElementById("close-config-modal");
  const configModal = document.getElementById("config-modal");
  const appScriptInput = document.getElementById("app-script-url-input");
  const saveUrlBtn = document.getElementById("save-url-btn");
  const resetDemoBtn = document.getElementById("reset-demo-btn");

  if (openConfigBtn && configModal) {
    openConfigBtn.addEventListener("click", () => {
      if (appScriptInput) appScriptInput.value = GOOGLE_APPS_SCRIPT_URL;
      configModal.classList.remove("hidden");
    });
  }

  if (closeConfigBtn && configModal) {
    closeConfigBtn.addEventListener("click", () => {
      configModal.classList.add("hidden");
    });
  }

  if (saveUrlBtn && appScriptInput) {
    saveUrlBtn.addEventListener("click", () => {
      const url = appScriptInput.value.trim();
      GOOGLE_APPS_SCRIPT_URL = url;
      localStorage.setItem('google_sheet_api_url', url);
      configModal.classList.add("hidden");
      showToast(url ? "Connected to custom Google Sheet API!" : "Switched to demo mode", "success");
      fetchGoogleSheetData();
    });
  }

  if (resetDemoBtn && appScriptInput) {
    resetDemoBtn.addEventListener("click", () => {
      GOOGLE_APPS_SCRIPT_URL = "";
      localStorage.removeItem('google_sheet_api_url');
      appScriptInput.value = "";
      configModal.classList.add("hidden");
      showToast("Restored built-in demo dataset.", "info");
      currentSheetData = DEFAULT_FALLBACK_DATA;
      renderAllSections(DEFAULT_FALLBACK_DATA);
    });
  }

  // Contact Form Submission (doPost to Google Apps Script)
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
  }

  // Modals Close handlers
  const closeVideoBtn = document.getElementById("close-video-modal");
  const videoModal = document.getElementById("video-modal");
  const videoIframe = document.getElementById("video-iframe");
  if (closeVideoBtn && videoModal) {
    closeVideoBtn.addEventListener("click", () => {
      videoModal.classList.add("hidden");
      if (videoIframe) videoIframe.src = "";
    });
  }

  const closeImageBtn = document.getElementById("close-image-modal");
  const imageModal = document.getElementById("image-modal");
  if (closeImageBtn && imageModal) {
    closeImageBtn.addEventListener("click", () => {
      imageModal.classList.add("hidden");
    });
  }

  // Close modals on backdrop click
  window.addEventListener("click", (e) => {
    if (e.target === configModal) configModal.classList.add("hidden");
    if (e.target === videoModal) {
      videoModal.classList.add("hidden");
      if (videoIframe) videoIframe.src = "";
    }
    if (e.target === imageModal) imageModal.classList.add("hidden");
  });
}

/**
 * Fetches data from Google Apps Script Web App JSON endpoint
 */
async function fetchGoogleSheetData() {
  const connectionDot = document.getElementById("connection-dot");
  const connectionText = document.getElementById("connection-text");

  if (!GOOGLE_APPS_SCRIPT_URL) {
    // Using built-in demo data
    if (connectionDot) connectionDot.className = "w-2.5 h-2.5 rounded-full bg-blue-400";
    if (connectionText) connectionText.textContent = "Data Source: Built-in Demo Dataset (Click API Config to connect live sheet)";
    currentSheetData = DEFAULT_FALLBACK_DATA;
    renderAllSections(DEFAULT_FALLBACK_DATA);
    return;
  }

  if (connectionDot) connectionDot.className = "w-2.5 h-2.5 rounded-full bg-amber-400 animate-spin";
  if (connectionText) connectionText.textContent = "Syncing with Google Sheets...";

  try {
    const fetchUrl = `${GOOGLE_APPS_SCRIPT_URL}?action=getAllData&_t=${Date.now()}`;
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    if (json.status === "success" && json.data) {
      currentSheetData = {
        Settings: json.data.Settings || DEFAULT_FALLBACK_DATA.Settings,
        Menu: Array.isArray(json.data.Menu) && json.data.Menu.length ? json.data.Menu : DEFAULT_FALLBACK_DATA.Menu,
        about: Array.isArray(json.data.about) && json.data.about.length ? json.data.about : DEFAULT_FALLBACK_DATA.about,
        Products: Array.isArray(json.data.Products) && json.data.Products.length ? json.data.Products : DEFAULT_FALLBACK_DATA.Products,
        Gallery: Array.isArray(json.data.Gallery) && json.data.Gallery.length ? json.data.Gallery : DEFAULT_FALLBACK_DATA.Gallery,
        "Article and update": Array.isArray(json.data["Article and update"]) && json.data["Article and update"].length ? json.data["Article and update"] : DEFAULT_FALLBACK_DATA["Article and update"],
        "send Message": json.data["send Message"] || []
      };

      if (connectionDot) connectionDot.className = "w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse";
      if (connectionText) connectionText.textContent = "Data Source: Live Google Sheet Connected";
      showToast("Website synchronized with Google Sheets!", "success");
    } else {
      throw new Error(json.message || "Invalid JSON payload format");
    }
  } catch (error) {
    console.warn("Could not fetch live Google Sheet, falling back to local dataset:", error);
    if (connectionDot) connectionDot.className = "w-2.5 h-2.5 rounded-full bg-rose-500";
    if (connectionText) connectionText.textContent = "Connection Error - Showing Cached Dataset";
    showToast("Error connecting to Apps Script: " + error.message, "error");
    currentSheetData = DEFAULT_FALLBACK_DATA;
  }

  renderAllSections(currentSheetData);
}

/**
 * Master Render: Renders all website sections based on Google Sheet payload
 */
function renderAllSections(data) {
  renderThemeAndSettings(data.Settings);
  renderMenu(data.Menu);
  renderHero(data.Settings);
  renderAbout(data.about);
  renderProducts(data.Products);
  renderGallery(data.Gallery);
  renderArticles(data["Article and update"]);
  renderFooter(data.Settings);
  renderIcons();
}

/**
 * 1. THEME & SETTINGS (CHANGE THIS IN GOOGLE SHEET -> Settings tab)
 */
function renderThemeAndSettings(settings) {
  if (!settings) return;

  // Update Page Title
  if (settings.site_title) {
    document.title = settings.site_title;
    const tabTitle = document.getElementById("tab-title");
    if (tabTitle) tabTitle.textContent = settings.site_title;
  }

  // Update Dynamic CSS Variables (Primary & Secondary Colors)
  const primaryColor = settings.primary_color || "#2563eb";
  const secondaryColor = settings.secondary_color || "#0f172a";

  const dynamicStyles = document.getElementById("dynamic-theme-vars");
  if (dynamicStyles) {
    dynamicStyles.innerHTML = `
      :root {
        --primary-color: ${primaryColor};
        --secondary-color: ${secondaryColor};
      }
    `;
  }
}

/**
 * 2. MENU (CHANGE THIS IN GOOGLE SHEET -> Menu tab)
 */
function renderMenu(menuList) {
  const desktopMenu = document.getElementById("desktop-menu");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!desktopMenu || !Array.isArray(menuList)) return;

  // Build Desktop Nav HTML
  desktopMenu.innerHTML = menuList.map((item, index) => {
    const isLast = index === menuList.length - 1;
    if (isLast) {
      return `
        <a href="${item.link}" class="px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition">
          ${item.name}
        </a>
      `;
    }
    return `
      <a href="${item.link}" class="text-sm font-semibold text-slate-700 hover:text-blue-600 transition">
        ${item.name}
      </a>
    `;
  }).join("");

  // Build Mobile Nav HTML
  if (mobileMenu) {
    mobileMenu.innerHTML = menuList.map(item => `
      <a href="${item.link}" class="block py-2 text-base font-semibold text-slate-700 hover:text-blue-600 transition" onclick="document.getElementById('mobile-menu').classList.add('hidden')">
        ${item.name}
      </a>
    `).join("");
  }
}

/**
 * 3. HERO (CHANGE THIS IN GOOGLE SHEET -> Settings tab)
 */
function renderHero(settings) {
  if (!settings) return;

  const siteLogo = document.getElementById("site-logo");
  const siteTitle = document.getElementById("site-title");
  const heroTitle = document.getElementById("hero-title");
  const heroSubtitle = document.getElementById("hero-subtitle");
  const heroBtnText = document.getElementById("hero-btn-text");
  const heroCtaBtn = document.getElementById("hero-cta-btn");
  const heroBgContainer = document.getElementById("hero-bg-container");

  if (siteLogo && settings.logo_url) siteLogo.src = settings.logo_url;
  if (siteTitle && settings.site_title) siteTitle.textContent = settings.site_title;
  if (heroTitle && settings.hero_title) heroTitle.textContent = settings.hero_title;
  if (heroSubtitle && settings.hero_subtitle) heroSubtitle.textContent = settings.hero_subtitle;
  if (heroBtnText && settings.hero_btn_text) heroBtnText.textContent = settings.hero_btn_text;
  if (heroCtaBtn && settings.hero_btn_link) heroCtaBtn.href = settings.hero_btn_link;
  if (heroBgContainer && settings.hero_bg_image) {
    heroBgContainer.style.backgroundImage = `url('${settings.hero_bg_image}')`;
  }
}

/**
 * 4. ABOUT (CHANGE THIS IN GOOGLE SHEET -> about tab)
 */
function renderAbout(aboutList) {
  if (!Array.isArray(aboutList) || aboutList.length === 0) return;
  const item = aboutList[0];

  const aboutBadge = document.getElementById("about-badge");
  const aboutTitle = document.getElementById("about-title");
  const aboutDesc = document.getElementById("about-description");
  const aboutImage = document.getElementById("about-image");
  const aboutHighlights = document.getElementById("about-highlights");

  if (aboutBadge) aboutBadge.textContent = item.badge || item.title || "About Us";
  if (aboutTitle) aboutTitle.textContent = item.name || "About Our Platform";
  if (aboutDesc) aboutDesc.textContent = item.description || "";
  if (aboutImage && item.image_url) aboutImage.src = item.image_url;

  if (aboutHighlights) {
    const highlights = [item.highlight1, item.highlight2, item.highlight3].filter(Boolean);
    if (highlights.length > 0) {
      aboutHighlights.innerHTML = highlights.map(h => `
        <div class="flex items-start gap-3">
          <div class="p-1 rounded-lg bg-blue-100 text-blue-600 mt-1">
            <i data-lucide="check" class="w-4 h-4"></i>
          </div>
          <span class="text-slate-700 font-medium">${h}</span>
        </div>
      `).join("");
    }
  }
}

/**
 * 5. PRODUCTS (CHANGE THIS IN GOOGLE SHEET -> Products tab)
 */
function renderProducts(productsList) {
  const productsGrid = document.getElementById("products-grid");
  const filtersContainer = document.getElementById("product-filters");

  if (!productsGrid || !Array.isArray(productsList)) return;

  // Extract unique categories for filtering
  const categories = ["All", ...new Set(productsList.map(p => p.category || "General").filter(Boolean))];

  // Render Filter Buttons
  if (filtersContainer) {
    filtersContainer.innerHTML = categories.map(cat => `
      <button class="product-filter-btn px-4 py-2 rounded-full text-sm font-semibold transition ${cat === selectedProductCategory ? 'active' : ''}" data-category="${cat}">
        ${cat}
      </button>
    `).join("");

    filtersContainer.querySelectorAll(".product-filter-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        selectedProductCategory = e.currentTarget.getAttribute("data-category");
        renderProducts(currentSheetData.Products);
      });
    });
  }

  // Filter Products
  const filteredProducts = selectedProductCategory === "All"
    ? productsList
    : productsList.filter(p => (p.category || "General") === selectedProductCategory);

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-500">
        No products found in category "${selectedProductCategory}".
      </div>
    `;
    return;
  }

  // Render Product Cards
  productsGrid.innerHTML = filteredProducts.map(prod => `
    <div class="product-card bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col group">
      <div class="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img src="${prod.image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'}" alt="${prod.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
        <span class="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm">
          ${prod.category || 'Product'}
        </span>
      </div>
      <div class="p-6 flex flex-col flex-grow">
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-lg text-slate-900 leading-tight group-hover:text-blue-600 transition">${prod.name}</h3>
        </div>
        <p class="text-sm text-slate-600 line-clamp-3 mb-6 flex-grow">${prod.description || ''}</p>
        <div class="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
          <span class="font-extrabold text-lg text-slate-900">${prod.price || 'Contact us'}</span>
          <a href="${prod.button_link || '#contact'}" class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition inline-flex items-center gap-1">
            <span>${prod.button_text || 'Inquire'}</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </a>
        </div>
      </div>
    </div>
  `).join("");
}

/**
 * 6. GALLERY (CHANGE THIS IN GOOGLE SHEET -> Gallery tab)
 */
function renderGallery(galleryList) {
  const galleryGrid = document.getElementById("gallery-grid");
  const filtersContainer = document.getElementById("gallery-filters");

  if (!galleryGrid || !Array.isArray(galleryList)) return;

  // Extract unique sections
  const sections = ["All", ...new Set(galleryList.map(g => g.image_section || g["image section"] || "General").filter(Boolean))];

  // Render Filter Buttons
  if (filtersContainer) {
    filtersContainer.innerHTML = sections.map(sec => `
      <button class="gallery-filter-btn px-4 py-2 rounded-full text-sm font-semibold transition ${sec === selectedGallerySection ? 'active' : ''}" data-section="${sec}">
        ${sec}
      </button>
    `).join("");

    filtersContainer.querySelectorAll(".gallery-filter-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        selectedGallerySection = e.currentTarget.getAttribute("data-section");
        renderGallery(currentSheetData.Gallery);
      });
    });
  }

  // Filter Gallery
  const filteredGallery = selectedGallerySection === "All"
    ? galleryList
    : galleryList.filter(g => (g.image_section || g["image section"] || "General") === selectedGallerySection);

  galleryGrid.innerHTML = filteredGallery.map((item, idx) => {
    const imgUrl = item.image_uploaded || item["image uploaded"] || item.image_url || "";
    const imgTitle = item.image_title || item["image title"] || "Gallery Image";
    const imgDesc = item.description || "";
    const imgSection = item.image_section || item["image section"] || "Visual";

    return `
      <div class="gallery-card group relative rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 aspect-[4/3] cursor-pointer bg-slate-100" onclick="openImageModal('${imgUrl}', '${escapeHtml(imgTitle)}', '${escapeHtml(imgDesc)}')">
        <img src="${imgUrl}" alt="${imgTitle}" class="w-full h-full object-cover group-hover:scale-108 transition duration-700 ease-out" loading="lazy" />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 text-white">
          <span class="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">${imgSection}</span>
          <h4 class="font-bold text-lg">${imgTitle}</h4>
          <p class="text-xs text-slate-300 line-clamp-2 mt-1">${imgDesc}</p>
        </div>
      </div>
    `;
  }).join("");
}

/**
 * 7. ARTICLES AND UPDATES (CHANGE THIS IN GOOGLE SHEET -> Article and update tab)
 */
function renderArticles(articlesList) {
  const articlesGrid = document.getElementById("articles-grid");
  if (!articlesGrid || !Array.isArray(articlesList)) return;

  articlesGrid.innerHTML = articlesList.map(art => {
    const videoUrl = art.youtube_video_url || art.video_url || "";
    const embedId = getYouTubeId(videoUrl);
    const hasVideo = Boolean(embedId);

    return `
      <article class="article-card bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col group">
        
        <!-- Media / Header: YouTube Embed or Image -->
        <div class="relative aspect-video bg-slate-900 overflow-hidden">
          ${hasVideo ? `
            <div class="relative w-full h-full cursor-pointer group/video" onclick="openVideoModal('${embedId}', '${escapeHtml(art.title)}')">
              <img src="https://img.youtube.com/vi/${embedId}/hqdefault.jpg" alt="${art.title}" class="w-full h-full object-cover opacity-80 group-hover/video:opacity-100 group-hover/video:scale-105 transition duration-500" />
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform group-hover/video:scale-110 transition">
                  <i data-lucide="play" class="w-6 h-6 fill-current ml-0.5"></i>
                </div>
              </div>
              <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-sm flex items-center gap-1">
                <i data-lucide="youtube" class="w-3.5 h-3.5"></i>
                <span>Video Post</span>
              </span>
            </div>
          ` : `
            <img src="${art.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'}" alt="${art.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-800 backdrop-blur-sm shadow-sm">
              ${art.category || 'Article'}
            </span>
          `}
        </div>

        <!-- Article Content -->
        <div class="p-6 sm:p-7 flex flex-col flex-grow space-y-4">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span>${art.date || 'Recent Update'}</span>
            <span>${art.read_time || art.author || '3 min read'}</span>
          </div>

          <h3 class="font-extrabold text-xl text-slate-900 group-hover:text-blue-600 transition leading-snug">
            ${art.title}
          </h3>

          <p class="text-slate-600 text-sm leading-relaxed line-clamp-3 flex-grow">
            ${art.description || art.content || ''}
          </p>

          <!-- Footer Actions: Copy Link & Learn More -->
          <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
            <button onclick="copyArticleLink('${escapeHtml(art.title)}', '${window.location.href}')" class="text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-1.5 transition">
              <i data-lucide="link" class="w-4 h-4"></i>
              <span>Copy Link</span>
            </button>
            <a href="#contact" class="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 transition">
              <span>Read Full</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>
          </div>
        </div>

      </article>
    `;
  }).join("");
}

/**
 * 8. FOOTER & CONTACT (CHANGE THIS IN GOOGLE SHEET -> Settings tab)
 */
function renderFooter(settings) {
  if (!settings) return;

  const contactEmailLink = document.getElementById("contact-email-link");
  const contactEmailText = document.getElementById("contact-email-text");
  const contactPhoneLink = document.getElementById("contact-phone-link");
  const contactPhoneText = document.getElementById("contact-phone-text");
  const contactAddressText = document.getElementById("contact-address-text");

  const footerLogo = document.getElementById("footer-logo");
  const footerSiteTitle = document.getElementById("footer-site-title");
  const footerCopyright = document.getElementById("footer-copyright");

  if (contactEmailText && settings.contact_email) {
    contactEmailText.textContent = settings.contact_email;
    if (contactEmailLink) contactEmailLink.href = `mailto:${settings.contact_email}`;
  }

  if (contactPhoneText && settings.contact_phone) {
    contactPhoneText.textContent = settings.contact_phone;
    if (contactPhoneLink) contactPhoneLink.href = `tel:${settings.contact_phone.replace(/[^0-9+]/g, '')}`;
  }

  if (contactAddressText && settings.contact_address) {
    contactAddressText.textContent = settings.contact_address;
  }

  if (footerLogo && settings.logo_url) footerLogo.src = settings.logo_url;
  if (footerSiteTitle && settings.site_title) footerSiteTitle.textContent = settings.site_title;
  if (footerCopyright && settings.footer_text) footerCopyright.textContent = settings.footer_text;

  // Social Links
  const fb = document.getElementById("social-facebook");
  const tw = document.getElementById("social-twitter");
  const li = document.getElementById("social-linkedin");
  const yt = document.getElementById("social-youtube");

  if (fb) fb.href = settings.facebook_url || "#";
  if (tw) tw.href = settings.twitter_url || "#";
  if (li) li.href = settings.linkedin_url || "#";
  if (yt) yt.href = settings.youtube_url || "#";
}

/**
 * Handles Contact Form Submission: POST to Apps Script `addLead`
 */
async function handleContactSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = document.getElementById("form-submit-btn");
  const btnText = document.getElementById("btn-text");
  const formStatus = document.getElementById("form-status");

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const message = form.message.value.trim();

  if (!name || !email || !message) {
    showFormStatus("Please fill in all required fields (Name, Email, Message).", "error");
    return;
  }

  // Set Loading UI
  if (submitBtn) submitBtn.disabled = true;
  if (btnText) btnText.textContent = "Saving to Google Sheet...";
  if (formStatus) formStatus.classList.add("hidden");

  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  try {
    if (GOOGLE_APPS_SCRIPT_URL) {
      // POST to Google Apps Script Web App
      // Notice: When using Apps Script doPost, URL encoded params or FormData handles cross-origin POST seamlessly
      const payload = {
        action: "addLead",
        sheet: "send Message",
        timestamp: timestamp,
        name: name,
        email: email,
        phone: phone,
        message: message
      };

      // In browser to Apps Script, POST with mode: 'no-cors' or sending form-urlencoded payload works reliably
      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(payload).toString()
      });
    }

    // Success response
    form.reset();
    showFormStatus("✅ Thank you! Your message has been saved into our Google Sheet. We will reach out shortly.", "success");
    showToast("Message recorded in Google Sheet!", "success");

  } catch (error) {
    console.error("Submission failed:", error);
    showFormStatus("Error sending message. Please check Apps Script permissions or try again.", "error");
  } finally {
    if (submitBtn) submitBtn.disabled = false;
    if (btnText) btnText.textContent = "Send Message to Google Sheet";
  }
}

/**
 * Display Form Status Feedback
 */
function showFormStatus(msg, type) {
  const formStatus = document.getElementById("form-status");
  if (!formStatus) return;

  formStatus.textContent = msg;
  formStatus.className = `p-4 rounded-xl text-sm font-medium ${
    type === "success" 
      ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
      : "bg-rose-50 text-rose-800 border border-rose-200"
  }`;
  formStatus.classList.remove("hidden");
}

/**
 * Toast Notification Banner
 */
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");
  const toastIcon = document.getElementById("toast-icon");
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

/**
 * YouTube Helpers: Extract Video ID
 */
function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Video Modal Opener
 */
function openVideoModal(embedId, title) {
  const videoModal = document.getElementById("video-modal");
  const videoIframe = document.getElementById("video-iframe");
  const videoTitle = document.getElementById("video-modal-title");

  if (videoModal && videoIframe) {
    videoIframe.src = `https://www.youtube.com/embed/${embedId}?autoplay=1`;
    if (videoTitle) videoTitle.textContent = title || "Watch Video";
    videoModal.classList.remove("hidden");
    renderIcons();
  }
}

/**
 * Image Modal Opener
 */
function openImageModal(src, title, desc) {
  const imageModal = document.getElementById("image-modal");
  const modalImg = document.getElementById("image-modal-src");
  const modalTitle = document.getElementById("image-modal-title");
  const modalDesc = document.getElementById("image-modal-desc");

  if (imageModal && modalImg) {
    modalImg.src = src;
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;
    imageModal.classList.remove("hidden");
    renderIcons();
  }
}

/**
 * Copy Article Link
 */
function copyArticleLink(title, url) {
  navigator.clipboard.writeText(url).then(() => {
    showToast(`Link copied to clipboard: "${title}"`, "success");
  }).catch(() => {
    showToast("Unable to copy link to clipboard", "error");
  });
}

/**
 * Escape HTML for safe interpolation
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
