export interface SliderItem {
  id: string | number;
  image_url: string;
  title: string;
  subtitle: string;
  badge?: string;
  button_text?: string;
  button_link?: string;
}

export interface SheetSettings {
  site_title: string;
  logo_url: string;
  avatar_icon_url?: string;
  chatbot_icon_url?: string;
  about_me_summary?: string;
  about_me_designation?: string;
  primary_color: string;
  secondary_color: string;
  hero_title: string;
  hero_subtitle: string;
  hero_btn_text: string;
  hero_btn_link: string;
  hero_bg_image: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  footer_text: string;
  footer_tagline?: string;
  facebook_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  instagram_url?: string;
  whatsapp_url?: string;
  telegram_url?: string;
  github_url?: string;
  profile_hero_btn_text?: string;
  profile_hero_sec_btn_text?: string;
  about_section_badge?: string;
  about_section_title?: string;
  about_section_subtitle?: string;
  products_section_badge?: string;
  products_section_title?: string;
  products_section_subtitle?: string;
  gallery_section_badge?: string;
  gallery_section_title?: string;
  gallery_section_subtitle?: string;
  articles_section_badge?: string;
  articles_section_title?: string;
  articles_section_subtitle?: string;
  contact_section_badge?: string;
  contact_section_title?: string;
  contact_section_subtitle?: string;
  about_me_badge?: string;
  about_me_btn_text?: string;
  gemini_api_key?: string;
  [key: string]: string | undefined;
}

export interface AdminAuth {
  username: string;
  passwordHash: string; // or raw password for lightweight client state
}

export interface MenuItem {
  id: string | number;
  name: string;
  link: string;
}

export interface AboutItem {
  name: string;
  image_url: string;
  description: string;
  title?: string;
  badge?: string;
  highlight1?: string;
  highlight2?: string;
  highlight3?: string;
}

export interface ProductItem {
  id: string | number;
  name: string;
  category: string;
  price: string;
  image_url: string;
  description: string;
  button_text?: string;
  button_link?: string;
  featured?: string | boolean;
}

export interface GalleryItem {
  image_uploaded: string;
  image_title: string;
  description: string;
  image_section: string;
}

export interface ArticleItem {
  id?: string | number;
  title: string;
  category: string;
  date: string;
  description: string;
  content?: string;
  youtube_video_url?: string;
  image_url?: string;
  author?: string;
  read_time?: string;
  link?: string;
}

export interface MessageItem {
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface GoogleSheetDatabase {
  Settings: SheetSettings;
  Sliders: SliderItem[];
  Menu: MenuItem[];
  about: AboutItem[];
  Products: ProductItem[];
  Gallery: GalleryItem[];
  "Article and update": ArticleItem[];
  "send Message": MessageItem[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}
