/**
 * Image optimization utilities for Lovable Cloud Storage
 * 
 * These utilities handle URL transformations and responsive image generation
 * to improve loading performance across different devices.
 */

// Storage domains that support image transformations
const TRANSFORMABLE_DOMAINS = [
  'supabase.co',
  'lovable.dev',
];

/**
 * Check if a URL supports image transformations
 */
export function isTransformableUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return TRANSFORMABLE_DOMAINS.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
}

/**
 * Generate an optimized URL with width and quality parameters
 */
export function getOptimizedUrl(
  url: string,
  options: {
    width?: number;
    quality?: number;
  } = {}
): string {
  if (!url || !isTransformableUrl(url)) {
    return url;
  }

  const { width, quality = 80 } = options;
  
  try {
    const urlObj = new URL(url);
    
    // Add transformation parameters
    if (width) {
      urlObj.searchParams.set('width', String(width));
    }
    urlObj.searchParams.set('quality', String(quality));
    
    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Standard breakpoint widths for srcset generation
 */
const SRCSET_WIDTHS = [400, 800, 1200, 1600, 2000];

/**
 * Generate srcset string for responsive images
 */
export function generateSrcSet(url: string, quality = 80): string {
  if (!url || !isTransformableUrl(url)) {
    return '';
  }

  return SRCSET_WIDTHS
    .map(width => `${getOptimizedUrl(url, { width, quality })} ${width}w`)
    .join(', ');
}

/**
 * Get a thumbnail URL optimized for small previews
 */
export function getThumbnailUrl(url: string, size = 200): string {
  return getOptimizedUrl(url, { width: size, quality: 60 });
}

/**
 * Get a medium-quality URL for grid displays
 */
export function getGridImageUrl(url: string): string {
  return getOptimizedUrl(url, { width: 600, quality: 75 });
}

/**
 * Get sizes attribute based on common use cases
 */
export function getSizesForCard(): string {
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
}

export function getSizesForGalleryMain(): string {
  return '(max-width: 768px) 100vw, 60vw';
}

export function getSizesForGalleryThumb(): string {
  return '(max-width: 768px) 50vw, 20vw';
}

/**
 * Placeholder data URL for skeleton loading
 */
export const PLACEHOLDER_BLUR =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2UyZThmMCIvPjwvc3ZnPg==';
