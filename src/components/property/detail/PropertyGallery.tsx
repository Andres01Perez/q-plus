import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Play, Expand } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { PropertyMedia } from "@/types/property";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  media: PropertyMedia[];
  title: string;
}

const getYouTubeThumbnail = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
};

const getVimeoId = (url: string): string | null => {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? match[1] : null;
};

const getEmbedUrl = (url: string): string => {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
  }

  // Vimeo
  const vimeoId = getVimeoId(url);
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
  }

  return url;
};

const getPreviewUrl = (item: PropertyMedia): string => {
  if (item.type === "video") {
    const ytThumb = getYouTubeThumbnail(item.url);
    if (ytThumb) return ytThumb;
    // For Vimeo, we'd need an API call, so fallback to placeholder
    return "/placeholder.svg";
  }
  return item.url;
};

const PropertyGallery = ({ media, title }: PropertyGalleryProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useState(() => {
    if (!api) return;
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setLightboxIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    } else {
      setLightboxIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    }
  };

  if (!media.length) {
    return (
      <div className="w-full aspect-video bg-muted rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground">Sin imágenes disponibles</p>
      </div>
    );
  }

  const currentItem = media[lightboxIndex];

  return (
    <>
      <div className="space-y-4">
        {/* Main Carousel */}
        <Carousel
          setApi={setApi}
          className="w-full"
          opts={{ loop: true }}
        >
          <CarouselContent>
            {media.map((item, index) => (
              <CarouselItem key={item.id}>
                <div
                  className="relative aspect-[16/10] md:aspect-[16/9] rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => openLightbox(index)}
                >
                  {item.type === "video" ? (
                    <>
                      <img
                        src={getPreviewUrl(item)}
                        alt={item.caption || `${title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="w-8 h-8 text-foreground ml-1" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.caption || `${title} - ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Expand className="w-4 h-4" />
                  </Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>

        {/* Thumbnails */}
        {media.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {media.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollTo(index)}
                className={cn(
                  "relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all",
                  current === index
                    ? "ring-2 ring-primary ring-offset-2"
                    : "opacity-70 hover:opacity-100"
                )}
              >
                <img
                  src={getPreviewUrl(item)}
                  alt={item.caption || `Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {item.type === "video" && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Dots indicator for mobile */}
        {media.length > 1 && (
          <div className="flex justify-center gap-1.5 md:hidden">
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  current === index ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black border-none">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>

            {media.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                  onClick={() => navigateLightbox("prev")}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
                  onClick={() => navigateLightbox("next")}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}

            {currentItem?.type === "video" ? (
              <iframe
                src={getEmbedUrl(currentItem.url)}
                className="w-full h-full max-w-5xl"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            ) : (
              <img
                src={currentItem?.url}
                alt={currentItem?.caption || title}
                className="max-w-full max-h-full object-contain"
              />
            )}

            {currentItem?.caption && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-lg">
                {currentItem.caption}
              </div>
            )}

            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {lightboxIndex + 1} / {media.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyGallery;
