import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DescriptionAIButton } from "./DescriptionAIButton";
import type { PropertyFormData, PropertyStatus, PriceDisplayMode } from "@/types/property";

interface PropertyBasicFieldsProps {
  formData: PropertyFormData;
  onFieldChange: <K extends keyof PropertyFormData>(field: K, value: PropertyFormData[K]) => void;
  generateSlug: (title: string) => string;
}

const statusOptions: { value: PropertyStatus; label: string }[] = [
  { value: "draft", label: "Borrador" },
  { value: "available", label: "Disponible" },
  { value: "reserved", label: "Reservado" },
  { value: "sold", label: "Vendido" },
  { value: "rented", label: "Arrendado" },
];

const priceDisplayOptions: { value: PriceDisplayMode; label: string }[] = [
  { value: "sale", label: "Solo venta" },
  { value: "rent", label: "Solo arriendo" },
  { value: "both", label: "Venta y arriendo" },
];

export function PropertyBasicFields({
  formData,
  onFieldChange,
  generateSlug,
}: PropertyBasicFieldsProps) {
  const handleTitleChange = (title: string) => {
    onFieldChange("title", title);
    // Auto-generate slug if empty or matches previous auto-generated slug
    if (!formData.slug || formData.slug === generateSlug(formData.title)) {
      onFieldChange("slug", generateSlug(title));
    }
  };

  const handleDescriptionImproved = (newDescription: string) => {
    onFieldChange("main_description", newDescription);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Información Principal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title and Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Título <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ej: Apartamento moderno en Chapinero"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => onFieldChange("slug", e.target.value)}
              placeholder="apartamento-moderno-chapinero"
              className="font-mono text-sm"
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Estado</Label>
          <Select
            value={formData.status}
            onValueChange={(value: PropertyStatus) => onFieldChange("status", value)}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Main Description with AI Button */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="main_description">Descripción Principal</Label>
            <DescriptionAIButton
              currentDescription={formData.main_description}
              propertyData={{
                title: formData.title,
                bedrooms: formData.bedrooms,
                bathrooms: formData.bathrooms,
                area_m2: formData.area_m2,
                city: formData.city,
                neighborhood: formData.neighborhood,
              }}
              onDescriptionGenerated={handleDescriptionImproved}
            />
          </div>
          <Textarea
            id="main_description"
            value={formData.main_description}
            onChange={(e) => onFieldChange("main_description", e.target.value)}
            placeholder="Describe la propiedad en detalle..."
            className="min-h-[150px] resize-y"
          />
        </div>

        {/* Prices */}
        <div className="space-y-4">
          <Label>Configuración de Precios</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="display_price_mode" className="text-sm text-muted-foreground">
                Mostrar precio de
              </Label>
              <Select
                value={formData.display_price_mode}
                onValueChange={(value: PriceDisplayMode) =>
                  onFieldChange("display_price_mode", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priceDisplayOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_sale" className="text-sm text-muted-foreground">
                Precio de Venta (COP)
              </Label>
              <Input
                id="price_sale"
                type="number"
                value={formData.price_sale ?? ""}
                onChange={(e) =>
                  onFieldChange("price_sale", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price_rent" className="text-sm text-muted-foreground">
                Precio de Arriendo (COP)
              </Label>
              <Input
                id="price_rent"
                type="number"
                value={formData.price_rent ?? ""}
                onChange={(e) =>
                  onFieldChange("price_rent", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Basic Stats */}
        <div className="space-y-4">
          <Label>Características Básicas</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms" className="text-sm text-muted-foreground">
                Habitaciones
              </Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                value={formData.bedrooms ?? ""}
                onChange={(e) =>
                  onFieldChange("bedrooms", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms" className="text-sm text-muted-foreground">
                Baños
              </Label>
              <Input
                id="bathrooms"
                type="number"
                min="0"
                value={formData.bathrooms ?? ""}
                onChange={(e) =>
                  onFieldChange("bathrooms", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area_m2" className="text-sm text-muted-foreground">
                Área (m²)
              </Label>
              <Input
                id="area_m2"
                type="text"
                value={formData.area_m2 ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const num = parseFloat(val);
                  onFieldChange("area_m2", val === "" ? null : (isNaN(num) ? null : num));
                }}
                placeholder="Ej: 120"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
