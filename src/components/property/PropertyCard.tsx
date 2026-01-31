import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { getSizesForCard } from '@/lib/image-utils';
interface PropertyCardProps {
  id: string;
  slug: string;
  title: string;
  address?: string;
  city?: string;
  price_sale?: number;
  price_rent?: number;
  display_price_mode: string;
  bedrooms?: number;
  bathrooms?: number;
  area_m2?: number;
  status: string;
  mainImage?: string;
}

const PropertyCard = ({
  slug,
  title,
  address,
  city,
  price_sale,
  price_rent,
  display_price_mode,
  bedrooms,
  bathrooms,
  area_m2,
  status,
  mainImage,
}: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = () => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      available: { label: 'Disponible', variant: 'default' },
      sold: { label: 'Vendido', variant: 'destructive' },
      rented: { label: 'Arrendado', variant: 'secondary' },
      reserved: { label: 'Reservado', variant: 'outline' },
    };
    return statusMap[status] || { label: status, variant: 'outline' as const };
  };

  const badgeInfo = getStatusBadge();

  return (
    <Link 
      to={`/propiedad/${slug}`}
      className="group block bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 animate-scale-in"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <OptimizedImage
          src={mainImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'}
          alt={title}
          sizes={getSizesForCard()}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          aspectRatio="auto"
        />
        <div className="absolute inset-0 gradient-overlay opacity-60 pointer-events-none" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant={badgeInfo.variant} className="font-body text-xs">
            {badgeInfo.label}
          </Badge>
        </div>

        {/* Price */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-background">
            {display_price_mode !== 'hidden' && (
              <>
                {(display_price_mode === 'sale' || display_price_mode === 'both') && price_sale && (
                  <p className="font-display text-2xl font-bold">
                    {formatPrice(price_sale)}
                  </p>
                )}
                {(display_price_mode === 'rent' || display_price_mode === 'both') && price_rent && (
                  <p className="font-body text-sm opacity-90">
                    {formatPrice(price_rent)}/mes
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-card-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        
        {(address || city) && (
          <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span className="font-body text-sm line-clamp-1">
              {[address, city].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

        {/* Features */}
        <div className="flex items-center gap-4 text-muted-foreground">
          {bedrooms !== undefined && (
            <div className="flex items-center gap-1.5">
              <Bed className="h-4 w-4" />
              <span className="font-body text-sm">{bedrooms}</span>
            </div>
          )}
          {bathrooms !== undefined && (
            <div className="flex items-center gap-1.5">
              <Bath className="h-4 w-4" />
              <span className="font-body text-sm">{bathrooms}</span>
            </div>
          )}
          {area_m2 !== undefined && (
            <div className="flex items-center gap-1.5">
              <Maximize className="h-4 w-4" />
              <span className="font-body text-sm">{area_m2} m²</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
