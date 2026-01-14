import { MessageCircle, Phone, Share2, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { Property, PriceDisplayMode } from "@/types/property";

interface PropertyContactCardProps {
  property: Property;
}

const formatPrice = (price: number | null): string => {
  if (!price) return "";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const PropertyContactCard = ({ property }: PropertyContactCardProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Phone number - this should come from settings/config
  const phoneNumber = "573001234567";

  const getPriceDisplay = () => {
    const mode = property.display_price_mode as PriceDisplayMode;
    
    if (mode === "both") {
      return (
        <div className="space-y-1">
          {property.price_sale && (
            <div>
              <div className="text-2xl font-bold text-foreground">
                {formatPrice(property.price_sale)}
              </div>
              <div className="text-sm text-muted-foreground">Precio de venta</div>
            </div>
          )}
          {property.price_rent && (
            <div className="pt-2 border-t border-border mt-2">
              <div className="text-xl font-semibold text-foreground">
                {formatPrice(property.price_rent)}/mes
              </div>
              <div className="text-sm text-muted-foreground">Precio de arriendo</div>
            </div>
          )}
        </div>
      );
    }
    
    if (mode === "rent" && property.price_rent) {
      return (
        <div>
          <div className="text-2xl font-bold text-foreground">
            {formatPrice(property.price_rent)}/mes
          </div>
          <div className="text-sm text-muted-foreground">Precio de arriendo</div>
        </div>
      );
    }
    
    if (property.price_sale) {
      return (
        <div>
          <div className="text-2xl font-bold text-foreground">
            {formatPrice(property.price_sale)}
          </div>
          <div className="text-sm text-muted-foreground">Precio de venta</div>
        </div>
      );
    }
    
    return (
      <div className="text-lg text-muted-foreground">Precio a consultar</div>
    );
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hola, estoy interesado en la propiedad: ${property.title}\n${window.location.href}`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const handleCall = () => {
    window.open(`tel:+${phoneNumber}`, "_self");
  };

  const handleShare = async () => {
    const shareData = {
      title: property.title,
      text: property.main_description || `Mira esta propiedad: ${property.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast({
          title: "Link copiado",
          description: "El enlace se ha copiado al portapapeles",
        });
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      // User cancelled or error
      if ((error as Error).name !== "AbortError") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast({
          title: "Link copiado",
          description: "El enlace se ha copiado al portapapeles",
        });
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <>
      {/* Desktop Card */}
      <Card className="hidden lg:block sticky top-24 shadow-lg">
        <CardHeader className="pb-4">
          {getPriceDisplay()}
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
            size="lg"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2"
            size="lg"
            onClick={handleCall}
          >
            <Phone className="w-5 h-5" />
            Llamar
          </Button>
          <Button
            variant="ghost"
            className="w-full gap-2"
            onClick={handleShare}
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Share2 className="w-5 h-5" />
            )}
            {copied ? "¡Copiado!" : "Compartir"}
          </Button>
        </CardContent>
      </Card>

    </>
  );
};

export default PropertyContactCard;
