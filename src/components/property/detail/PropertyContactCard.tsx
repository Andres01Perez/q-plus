import { MessageCircle, Phone, Share2, Mail, Link, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

// Social media icons as SVG components
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const MessengerIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const PropertyContactCard = ({ property }: PropertyContactCardProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Phone number - this should come from settings/config
  const phoneNumber = "573001234567";

  const shareMessage = `¡Mira esta propiedad! ${property.title}`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const fullMessage = `${shareMessage}\n${shareUrl}`;

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

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(fullMessage)}`, "_blank");
    setShareOpen(false);
  };

  const handleShareMessenger = () => {
    window.open(`fb-messenger://share/?link=${encodeURIComponent(shareUrl)}&app_id=0`, "_blank");
    setShareOpen(false);
  };

  const handleShareInstagram = async () => {
    await navigator.clipboard.writeText(fullMessage);
    toast({
      title: "Link copiado",
      description: "Pega el enlace en tu historia o mensaje de Instagram",
    });
    window.open("instagram://", "_blank");
    setShareOpen(false);
  };

  const handleShareEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent(shareMessage)}&body=${encodeURIComponent(fullMessage)}`, "_self");
    setShareOpen(false);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Link copiado",
      description: "El enlace se ha copiado al portapapeles",
    });
    setTimeout(() => setCopied(false), 2000);
    setShareOpen(false);
  };

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: <WhatsAppIcon />,
      onClick: handleShareWhatsApp,
      className: "text-green-600 hover:bg-green-50",
    },
    {
      name: "Messenger",
      icon: <MessengerIcon />,
      onClick: handleShareMessenger,
      className: "text-blue-600 hover:bg-blue-50",
    },
    {
      name: "Instagram",
      icon: <InstagramIcon />,
      onClick: handleShareInstagram,
      className: "text-pink-600 hover:bg-pink-50",
    },
    {
      name: "Correo electrónico",
      icon: <Mail className="w-5 h-5" />,
      onClick: handleShareEmail,
      className: "text-muted-foreground hover:bg-muted",
    },
  ];

  return (
    <Card className="sticky top-24 shadow-lg">
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
          
          <Popover open={shareOpen} onOpenChange={setShareOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="w-full gap-2"
              >
                <Share2 className="w-5 h-5" />
                Compartir
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="center">
              <div className="text-sm font-medium text-muted-foreground px-2 py-1.5">
                Compartir propiedad
              </div>
              <div className="space-y-1">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={option.onClick}
                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors ${option.className}`}
                  >
                    {option.icon}
                    {option.name}
                  </button>
                ))}
              </div>
              <div className="border-t border-border mt-2 pt-2">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  {copied ? <Check className="w-5 h-5 text-green-600" /> : <Link className="w-5 h-5" />}
                  {copied ? "¡Copiado!" : "Copiar link"}
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </CardContent>
    </Card>
  );
};

export default PropertyContactCard;
