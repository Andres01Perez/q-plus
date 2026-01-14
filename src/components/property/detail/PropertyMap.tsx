import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertyMapProps {
  lat: number | null;
  lng: number | null;
  address: string | null;
  city: string | null;
  neighborhood: string | null;
}

const PropertyMap = ({ lat, lng, address, city, neighborhood }: PropertyMapProps) => {
  const fullAddress = [address, neighborhood, city].filter(Boolean).join(", ");
  
  const hasCoordinates = lat !== null && lng !== null;
  
  const googleMapsUrl = hasCoordinates
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : fullAddress
    ? `https://www.google.com/maps/search/${encodeURIComponent(fullAddress)}`
    : null;

  // Static map image URL (no API key needed for embed preview)
  const staticMapUrl = hasCoordinates
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&markers=color:red%7C${lat},${lng}&key=`
    : null;

  if (!googleMapsUrl) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="w-5 h-5 text-primary" />
          Ubicación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map placeholder with link */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden group cursor-pointer">
            {/* Decorative map pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10">
              <svg
                className="absolute inset-0 w-full h-full opacity-10"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                {[...Array(10)].map((_, i) => (
                  <line
                    key={`h-${i}`}
                    x1="0"
                    y1={i * 10}
                    x2="100"
                    y2={i * 10}
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                ))}
                {[...Array(10)].map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * 10}
                    y1="0"
                    x2={i * 10}
                    y2="100"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                ))}
              </svg>
            </div>
            
            {/* Center marker */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rotate-45 -z-10" />
              </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-lg px-4 py-2 shadow-lg flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium">Ver en Google Maps</span>
              </div>
            </div>
          </div>
        </a>

        {/* Address */}
        {fullAddress && (
          <p className="text-sm text-muted-foreground">{fullAddress}</p>
        )}

        {/* Button */}
        <Button
          variant="outline"
          className="w-full gap-2"
          asChild
        >
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <MapPin className="w-4 h-4" />
            Abrir en Google Maps
            <ExternalLink className="w-4 h-4 ml-auto" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default PropertyMap;
