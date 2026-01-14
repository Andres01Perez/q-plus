import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, Video, Plus, Trash2, Star, GripVertical } from "lucide-react";
import type { MediaFormItem, MediaType } from "@/types/property";

interface PropertyMediaSectionProps {
  mediaItems: MediaFormItem[];
  onChange: (items: MediaFormItem[]) => void;
}

const mediaTypeOptions: { value: MediaType; label: string; icon: React.ReactNode }[] = [
  { value: "image", label: "Imagen", icon: <Image className="h-4 w-4" /> },
  { value: "video", label: "Video", icon: <Video className="h-4 w-4" /> },
];

export function PropertyMediaSection({ mediaItems, onChange }: PropertyMediaSectionProps) {
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState<MediaType>("image");

  const addMedia = () => {
    if (!newUrl.trim()) return;

    // Detect provider from URL
    let provider = "";
    if (newUrl.includes("youtube.com") || newUrl.includes("youtu.be")) {
      provider = "youtube";
    } else if (newUrl.includes("drive.google.com")) {
      provider = "google_drive";
    } else if (newUrl.includes("vimeo.com")) {
      provider = "vimeo";
    }

    const newItem: MediaFormItem = {
      url: newUrl.trim(),
      type: newType,
      caption: "",
      provider,
      is_main: mediaItems.length === 0, // First item is main by default
      display_order: mediaItems.length,
    };

    onChange([...mediaItems, newItem]);
    setNewUrl("");
    setNewType("image");
  };

  const removeMedia = (index: number) => {
    const updated = mediaItems.filter((_, i) => i !== index);
    // If we removed the main image, set the first one as main
    if (mediaItems[index].is_main && updated.length > 0) {
      updated[0].is_main = true;
    }
    onChange(updated);
  };

  const setAsMain = (index: number) => {
    const updated = mediaItems.map((item, i) => ({
      ...item,
      is_main: i === index,
    }));
    onChange(updated);
  };

  const updateCaption = (index: number, caption: string) => {
    const updated = [...mediaItems];
    updated[index] = { ...updated[index], caption };
    onChange(updated);
  };

  const getYouTubeThumbnail = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
  };

  const getPreviewUrl = (item: MediaFormItem): string | null => {
    if (item.type === "image") {
      return item.url;
    }
    if (item.provider === "youtube") {
      return getYouTubeThumbnail(item.url);
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Image className="h-5 w-5" />
          Galería Multimedia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add new media */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="URL de imagen o video (YouTube, Google Drive...)"
            />
          </div>
          <Select value={newType} onValueChange={(v: MediaType) => setNewType(v)}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mediaTypeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <span className="flex items-center gap-2">
                    {opt.icon}
                    {opt.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addMedia} disabled={!newUrl.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </div>

        {/* Media list */}
        {mediaItems.length === 0 ? (
          <div className="bg-muted/50 rounded-lg p-8 text-center text-sm text-muted-foreground">
            <Image className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No hay archivos multimedia agregados</p>
            <p className="text-xs mt-1">
              Agrega URLs de imágenes o videos de YouTube/Google Drive
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {mediaItems.map((item, index) => {
              const previewUrl = getPreviewUrl(item);
              
              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 border rounded-lg ${
                    item.is_main ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="cursor-move text-muted-foreground">
                    <GripVertical className="h-5 w-5" />
                  </div>

                  {/* Preview */}
                  <div className="w-24 h-16 rounded bg-muted overflow-hidden flex-shrink-0">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={item.caption || `Media ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {item.type === "video" ? (
                          <Video className="h-6 w-6 text-muted-foreground" />
                        ) : (
                          <Image className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      {item.type === "video" ? (
                        <Video className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Image className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-xs text-muted-foreground truncate">
                        {item.url}
                      </span>
                      {item.provider && (
                        <span className="text-xs bg-secondary px-2 py-0.5 rounded">
                          {item.provider}
                        </span>
                      )}
                      {item.is_main && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          Principal
                        </span>
                      )}
                    </div>
                    <Input
                      value={item.caption}
                      onChange={(e) => updateCaption(index, e.target.value)}
                      placeholder="Descripción de la imagen..."
                      className="h-8 text-sm"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {!item.is_main && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setAsMain(index)}
                        title="Establecer como imagen principal"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMedia(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
