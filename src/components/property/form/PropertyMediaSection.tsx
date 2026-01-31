import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, Video, Plus, Trash2, Star, GripVertical, Upload, Link, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getThumbnailUrl } from "@/lib/image-utils";
import type { MediaFormItem, MediaType } from "@/types/property";

interface PropertyMediaSectionProps {
  mediaItems: MediaFormItem[];
  onChange: (items: MediaFormItem[]) => void;
  propertyId?: string;
}

const mediaTypeOptions: { value: MediaType; label: string; icon: React.ReactNode }[] = [
  { value: "image", label: "Imagen", icon: <Image className="h-4 w-4" /> },
  { value: "video", label: "Video", icon: <Video className="h-4 w-4" /> },
];

const ACCEPTED_FILE_TYPES = "image/jpeg,image/png,image/webp,image/gif,video/mp4";
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function PropertyMediaSection({ mediaItems, onChange, propertyId }: PropertyMediaSectionProps) {
  const [newUrl, setNewUrl] = useState("");
  const [newType, setNewType] = useState<MediaType>("image");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const addMediaFromUrl = () => {
    if (!newUrl.trim()) return;

    // Detect provider from URL
    let provider = "";
    let type: MediaType = newType;
    
    if (newUrl.includes("youtube.com") || newUrl.includes("youtu.be")) {
      provider = "youtube";
      type = "video";
    } else if (newUrl.includes("drive.google.com")) {
      provider = "google_drive";
    } else if (newUrl.includes("vimeo.com")) {
      provider = "vimeo";
      type = "video";
    }

    const newItem: MediaFormItem = {
      url: newUrl.trim(),
      type,
      caption: "",
      provider,
      is_main: mediaItems.length === 0,
      display_order: mediaItems.length,
    };

    onChange([...mediaItems, newItem]);
    setNewUrl("");
    setNewType("image");
  };

  // Helper function to parse storage upload errors
  const getUploadErrorMessage = (error: any, fileName: string): string => {
    const errorMessage = error?.message || '';
    const statusCode = error?.statusCode || error?.status;

    // File size exceeded
    if (statusCode === '413' || statusCode === 413 || errorMessage.includes('exceeded the maximum')) {
      return `${fileName} excede el límite de tamaño permitido por el servidor (50MB)`;
    }
    
    // Invalid mime type
    if (statusCode === '415' || statusCode === 415 || errorMessage.includes('mime type') || errorMessage.includes('not allowed')) {
      return `${fileName} tiene un formato de archivo no permitido`;
    }
    
    // Auth errors
    if (statusCode === '401' || statusCode === 401 || statusCode === '403' || statusCode === 403) {
      return `No tienes permisos para subir ${fileName}. Intenta iniciar sesión nuevamente.`;
    }
    
    // Network/connection errors
    if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
      return `Error de conexión al subir ${fileName}. Verifica tu conexión a internet.`;
    }
    
    // Bucket not found
    if (errorMessage.includes('Bucket not found') || errorMessage.includes('bucket')) {
      return `Error de configuración del almacenamiento. Contacta al administrador.`;
    }

    // Return server message if available
    if (errorMessage) {
      return `Error al subir ${fileName}: ${errorMessage}`;
    }
    
    return `No se pudo subir ${fileName}. Intenta de nuevo.`;
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    const uploadedItems: MediaFormItem[] = [];
    const totalFiles = files.length;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
        const isVideo = file.type.startsWith("video/");

        // Validate file size with more descriptive message
        if (file.size > MAX_FILE_SIZE) {
          toast({
            title: "Archivo muy grande",
            description: isVideo 
              ? `El video ${file.name} pesa ${fileSizeMB}MB. El límite es 50MB. Considera comprimir el video antes de subirlo.`
              : `${file.name} (${fileSizeMB}MB) excede el límite de 50MB`,
            variant: "destructive",
          });
          continue;
        }

        // Validate file type
        if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
          toast({
            title: "Tipo de archivo no permitido",
            description: `${file.name} no es un formato válido. Formatos permitidos: JPG, PNG, WebP, GIF, MP4`,
            variant: "destructive",
          });
          continue;
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(2, 8);
        const extension = file.name.split('.').pop();
        const fileName = `${propertyId || 'new'}/${timestamp}-${randomId}.${extension}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from("property-media")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Upload error details:", {
            message: error.message,
            statusCode: (error as any).statusCode,
            error: error,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
          });
          toast({
            title: "Error al subir archivo",
            description: getUploadErrorMessage(error, file.name),
            variant: "destructive",
          });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("property-media")
          .getPublicUrl(data.path);

        uploadedItems.push({
          url: urlData.publicUrl,
          type: isVideo ? "video" : "image",
          caption: "",
          provider: "supabase",
          is_main: mediaItems.length === 0 && uploadedItems.length === 0,
          display_order: mediaItems.length + uploadedItems.length,
        });

        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
      }

      if (uploadedItems.length > 0) {
        onChange([...mediaItems, ...uploadedItems]);
        toast({
          title: "Archivos subidos",
          description: `Se subieron ${uploadedItems.length} archivo(s) correctamente`,
        });
      }
    } catch (error: any) {
      console.error("Upload error:", {
        message: error?.message,
        stack: error?.stack,
        error: error
      });
      toast({
        title: "Error inesperado",
        description: `Ocurrió un error al subir los archivos: ${error?.message || 'Error desconocido'}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeMedia = async (index: number) => {
    const item = mediaItems[index];
    
    // If it's a Supabase file, try to delete it from storage
    if (item.provider === "supabase" && item.url.includes("property-media")) {
      try {
        const path = item.url.split("/property-media/")[1];
        if (path) {
          await supabase.storage.from("property-media").remove([path]);
        }
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }

    const updated = mediaItems.filter((_, i) => i !== index);
    // If we removed the main image, set the first one as main
    if (item.is_main && updated.length > 0) {
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
      // Use optimized thumbnail for form previews (96px thumbnails)
      return getThumbnailUrl(item.url, 96);
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
        {/* Upload Methods Tabs */}
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="h-4 w-4" />
              Subir archivo
            </TabsTrigger>
            <TabsTrigger value="url" className="gap-2">
              <Link className="h-4 w-4" />
              Desde URL
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                transition-colors hover:border-primary hover:bg-primary/5
                ${isUploading ? "pointer-events-none opacity-50" : ""}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_FILE_TYPES}
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              
              {isUploading ? (
                <div className="space-y-3">
                  <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">
                    Subiendo archivos... {uploadProgress}%
                  </p>
                  <div className="w-full max-w-xs mx-auto bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="font-medium">Arrastra imágenes aquí</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    o haz clic para seleccionar archivos
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG, WebP, GIF o MP4 (máx. 50MB)
                  </p>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="url" className="mt-4">
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
              <Button type="button" onClick={addMediaFromUrl} disabled={!newUrl.trim()}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Media list */}
        {mediaItems.length === 0 ? (
          <div className="bg-muted/50 rounded-lg p-8 text-center text-sm text-muted-foreground">
            <Image className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No hay archivos multimedia agregados</p>
            <p className="text-xs mt-1">
              Sube imágenes o agrega URLs de YouTube/Google Drive
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {mediaItems.length} archivo(s) agregado(s)
            </p>
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
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.type === "video" ? (
                        <Video className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <Image className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
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
