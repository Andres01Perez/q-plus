import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { PropertyFormData } from "@/types/property";

interface PropertyLocationFieldsProps {
  formData: PropertyFormData;
  onFieldChange: <K extends keyof PropertyFormData>(field: K, value: PropertyFormData[K]) => void;
}

export function PropertyLocationFields({
  formData,
  onFieldChange,
}: PropertyLocationFieldsProps) {
  const hasCoordinates = formData.lat !== null && formData.lng !== null;
  const mapUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${formData.lat},${formData.lng}&z=15&output=embed`
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Address Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => onFieldChange("address", e.target.value)}
              placeholder="Ej: Calle 100 #15-25"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => onFieldChange("city", e.target.value)}
              placeholder="Ej: Bogotá"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="neighborhood">Barrio / Sector</Label>
            <Input
              id="neighborhood"
              value={formData.neighborhood}
              onChange={(e) => onFieldChange("neighborhood", e.target.value)}
              placeholder="Ej: Chapinero"
            />
          </div>
        </div>

        {/* Coordinates */}
        <div className="space-y-4">
          <Label>Coordenadas (Google Maps)</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat" className="text-sm text-muted-foreground">
                Latitud
              </Label>
              <Input
                id="lat"
                type="number"
                step="any"
                value={formData.lat ?? ""}
                onChange={(e) =>
                  onFieldChange("lat", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="4.6097"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng" className="text-sm text-muted-foreground">
                Longitud
              </Label>
              <Input
                id="lng"
                type="number"
                step="any"
                value={formData.lng ?? ""}
                onChange={(e) =>
                  onFieldChange("lng", e.target.value ? Number(e.target.value) : null)
                }
                placeholder="-74.0817"
              />
            </div>
          </div>
        </div>

        {/* Map Preview */}
        {hasCoordinates && (
          <div className="space-y-2">
            <Label>Vista Previa del Mapa</Label>
            <div className="aspect-video w-full rounded-lg overflow-hidden border bg-muted">
              <iframe
                src={mapUrl!}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de la propiedad"
              />
            </div>
          </div>
        )}

        {!hasCoordinates && (
          <div className="bg-muted/50 rounded-lg p-4 text-center text-sm text-muted-foreground">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Ingresa las coordenadas para ver el mapa</p>
            <p className="text-xs mt-1">
              Puedes obtenerlas desde Google Maps haciendo clic derecho en la ubicación
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
