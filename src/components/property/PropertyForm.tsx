import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2, FileText, MapPin, Image, Layers } from "lucide-react";
import { usePropertyForm } from "@/hooks/usePropertyForm";
import { PropertyBasicFields } from "./form/PropertyBasicFields";
import { PropertyLocationFields } from "./form/PropertyLocationFields";
import { PropertyMediaSection } from "./form/PropertyMediaSection";
import { DynamicBlock } from "./form/DynamicBlock";

interface PropertyFormProps {
  propertyId?: string;
}

export function PropertyForm({ propertyId }: PropertyFormProps) {
  const navigate = useNavigate();
  const {
    blocks,
    formData,
    mediaItems,
    isLoadingBlocks,
    isLoadingProperty,
    isSaving,
    updateField,
    updateDynamicValue,
    setMediaItems,
    saveProperty,
    generateSlug,
  } = usePropertyForm({ propertyId });

  const isLoading = isLoadingBlocks || isLoadingProperty;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      return;
    }

    const savedId = await saveProperty();
    if (savedId) {
      navigate("/admin/propiedades");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between sticky top-0 bg-background z-10 py-4 border-b">
        <h1 className="text-2xl font-bold">
          {propertyId ? "Editar Propiedad" : "Nueva Propiedad"}
        </h1>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/propiedades")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving || !formData.title.trim()}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="basic" className="gap-2">
            <FileText className="h-4 w-4 hidden sm:block" />
            Básico
          </TabsTrigger>
          <TabsTrigger value="location" className="gap-2">
            <MapPin className="h-4 w-4 hidden sm:block" />
            Ubicación
          </TabsTrigger>
          <TabsTrigger value="details" className="gap-2">
            <Layers className="h-4 w-4 hidden sm:block" />
            Detalles
          </TabsTrigger>
          <TabsTrigger value="media" className="gap-2">
            <Image className="h-4 w-4 hidden sm:block" />
            Multimedia
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="basic" className="mt-0">
            <PropertyBasicFields
              formData={formData}
              onFieldChange={updateField}
              generateSlug={generateSlug}
            />
          </TabsContent>

          <TabsContent value="location" className="mt-0">
            <PropertyLocationFields
              formData={formData}
              onFieldChange={updateField}
            />
          </TabsContent>

          <TabsContent value="details" className="mt-0 space-y-6">
            {blocks.length === 0 ? (
              <div className="bg-muted/50 rounded-lg p-8 text-center">
                <Layers className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  No hay bloques de características configurados
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ve a Configuración → Bloques para crear bloques y atributos
                </p>
              </div>
            ) : (
              blocks.map((block) => (
                <DynamicBlock
                  key={block.id}
                  block={block}
                  values={formData.dynamicValues}
                  onChange={updateDynamicValue}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="media" className="mt-0">
            <PropertyMediaSection
              mediaItems={mediaItems}
              onChange={setMediaItems}
            />
          </TabsContent>
        </div>
      </Tabs>
    </form>
  );
}
