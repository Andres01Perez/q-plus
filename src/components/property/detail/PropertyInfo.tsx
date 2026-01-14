import { MapPin, Bed, Bath, Maximize } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Property, PropertyStatus, PriceDisplayMode } from "@/types/property";

interface PropertyInfoProps {
  property: Property;
}

const statusLabels: Record<PropertyStatus, string> = {
  draft: "Borrador",
  available: "Disponible",
  reserved: "Reservado",
  sold: "Vendido",
  rented: "Arrendado",
};

const statusColors: Record<PropertyStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  available: "bg-green-100 text-green-800",
  reserved: "bg-yellow-100 text-yellow-800",
  sold: "bg-red-100 text-red-800",
  rented: "bg-blue-100 text-blue-800",
};

const formatPrice = (price: number | null): string => {
  if (!price) return "";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const PropertyInfo = ({ property }: PropertyInfoProps) => {
  const location = [property.neighborhood, property.city]
    .filter(Boolean)
    .join(", ");

  const getPriceDisplay = () => {
    const mode = property.display_price_mode as PriceDisplayMode;
    
    if (mode === "both") {
      return (
        <div className="space-y-1">
          {property.price_sale && (
            <div>
              <span className="text-2xl md:text-3xl font-bold text-foreground">
                {formatPrice(property.price_sale)}
              </span>
              <span className="text-muted-foreground ml-2">Venta</span>
            </div>
          )}
          {property.price_rent && (
            <div>
              <span className="text-xl md:text-2xl font-semibold text-foreground">
                {formatPrice(property.price_rent)}
              </span>
              <span className="text-muted-foreground ml-2">/mes Arriendo</span>
            </div>
          )}
        </div>
      );
    }
    
    if (mode === "rent" && property.price_rent) {
      return (
        <div>
          <span className="text-2xl md:text-3xl font-bold text-foreground">
            {formatPrice(property.price_rent)}
          </span>
          <span className="text-muted-foreground ml-2">/mes</span>
        </div>
      );
    }
    
    if (property.price_sale) {
      return (
        <span className="text-2xl md:text-3xl font-bold text-foreground">
          {formatPrice(property.price_sale)}
        </span>
      );
    }
    
    return <span className="text-muted-foreground">Precio a consultar</span>;
  };

  return (
    <div className="space-y-4">
      {/* Status badge */}
      <Badge
        className={statusColors[property.status as PropertyStatus]}
        variant="secondary"
      >
        {statusLabels[property.status as PropertyStatus]}
      </Badge>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground">
        {property.title}
      </h1>

      {/* Location */}
      {location && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-5 h-5 flex-shrink-0" />
          <span className="font-body">{location}</span>
        </div>
      )}

      {/* Price - visible on mobile, hidden on desktop (shown in ContactCard) */}
      <div className="lg:hidden">{getPriceDisplay()}</div>

      {/* Stats */}
      <div className="flex flex-wrap gap-6 py-4 border-y border-border">
        {property.bedrooms !== null && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bed className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold">{property.bedrooms}</p>
              <p className="text-xs text-muted-foreground">Habitaciones</p>
            </div>
          </div>
        )}
        {property.bathrooms !== null && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bath className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold">{property.bathrooms}</p>
              <p className="text-xs text-muted-foreground">Baños</p>
            </div>
          </div>
        )}
        {property.area_m2 !== null && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Maximize className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold">{property.area_m2}</p>
              <p className="text-xs text-muted-foreground">m²</p>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {property.main_description && (
        <div className="pt-2">
          <h2 className="text-lg font-semibold mb-3">Descripción</h2>
          <p className="text-muted-foreground font-body leading-relaxed whitespace-pre-line">
            {property.main_description}
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyInfo;
