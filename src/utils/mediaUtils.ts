/**
 * Helper utility to normalize and convert Google Drive images, raw IDs,
 * and YouTube video URLs into proper embed and direct display URLs.
 */

// Format Google Drive image URLs and raw IDs into direct CDN links:
// https://lh3.googleusercontent.com/d/{IMAGE_ID}
export function formatImageUrl(urlOrId?: string, fallback: string = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'): string {
  if (!urlOrId || typeof urlOrId !== 'string') return fallback;
  const raw = urlOrId.trim();
  if (!raw) return fallback;

  // 1. If it's already an lh3.googleusercontent.com direct URL
  if (raw.includes('lh3.googleusercontent.com/d/')) {
    return raw;
  }

  // 2. Google Drive /file/d/{ID} format
  const fileDMatch = raw.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileDMatch && fileDMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileDMatch[1]}`;
  }

  // 3. Google Drive id={ID} query format
  const idQueryMatch = raw.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idQueryMatch && idQueryMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${idQueryMatch[1]}`;
  }

  // 4. If user entered only a plain Google Drive File ID (alphanumeric with dashes/underscores, typical length ~25-45)
  if (/^[a-zA-Z0-9_-]{20,50}$/.test(raw)) {
    return `https://lh3.googleusercontent.com/d/${raw}`;
  }

  // 5. Standard Web URL (Unsplash, HTTPS images, etc.)
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:image')) {
    return raw;
  }

  return raw;
}

// Convert any YouTube link into a standard iframe embed URL
export function formatYoutubeEmbedUrl(url?: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const raw = url.trim();
  if (!raw) return null;

  // If already an embed URL
  if (raw.includes('youtube.com/embed/')) {
    return raw;
  }

  // standard youtube.com/watch?v={ID}
  const watchMatch = raw.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  // youtube.com/shorts/{ID}
  const shortsMatch = raw.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch && shortsMatch[1]) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }

  // If user entered only a YouTube video ID (11 chars)
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) {
    return `https://www.youtube.com/embed/${raw}`;
  }

  return raw;
}
