import { useState, useCallback, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  generateSrcSet,
  getOptimizedUrl,
  isTransformableUrl,
} from "@/lib/image-utils";

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Additional CSS classes */
  className?: string;
  /** Sizes attribute for responsive images */
  sizes?: string;
  /** Load immediately (for above-the-fold images) */
  priority?: boolean;
  /** Aspect ratio for the container */
  aspectRatio?: "video" | "square" | "portrait" | "auto";
  /** Width for optimization (if not using srcset) */
  width?: number;
  /** Fallback image on error */
  fallbackSrc?: string;
  /** Show skeleton while loading */
  showSkeleton?: boolean;
}

const aspectRatioClasses = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  auto: "",
};

/**
 * OptimizedImage component with lazy loading, skeleton placeholder,
 * and responsive srcset generation for Lovable Cloud Storage images.
 */
export function OptimizedImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
  aspectRatio = "auto",
  width,
  fallbackSrc = "/placeholder.svg",
  showSkeleton = true,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  // Generate optimized URL and srcset
  const isOptimizable = isTransformableUrl(src);
  const optimizedSrc = width ? getOptimizedUrl(src, { width }) : src;
  const srcSet = isOptimizable && sizes ? generateSrcSet(src) : undefined;

  // Determine the final source
  const finalSrc = hasError ? fallbackSrc : optimizedSrc;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {/* Skeleton placeholder */}
      {showSkeleton && isLoading && !hasError && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}

      {/* Actual image */}
      <img
        src={finalSrc}
        srcSet={hasError ? undefined : srcSet}
        sizes={hasError ? undefined : sizes}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        {...props}
      />
    </div>
  );
}

export default OptimizedImage;
