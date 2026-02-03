import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, ArrowRight, Instagram, Youtube, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

// TikTok icon (not available in Lucide)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface FeaturedProperty {
  id: string;
  slug: string;
  title: string;
  address: string | null;
  city: string | null;
  price_sale: number | null;
  price_rent: number | null;
  display_price_mode: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_m2: number | null;
  status: string | null;
  property_media: { url: string; is_main: boolean | null }[];
}

const Index = () => {
  const [properties, setProperties] = useState<FeaturedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const loadFeaturedProperties = async () => {
      // Get total count of non-draft properties
      const { count } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .neq('status', 'draft');

      setTotalCount(count || 0);

      // Get featured properties
      const { data } = await supabase
        .from('properties')
        .select(`
          id, slug, title, address, city,
          price_sale, price_rent, display_price_mode,
          bedrooms, bathrooms, area_m2, status,
          property_media (url, is_main)
        `)
        .neq('status', 'draft')
        .order('created_at', { ascending: false })
        .limit(3);

      setProperties(data || []);
      setLoading(false);
    };

    loadFeaturedProperties();
  }, []);

  const getMainImage = (property: FeaturedProperty) => {
    const mainMedia = property.property_media?.find(m => m.is_main);
    return mainMedia?.url || property.property_media?.[0]?.url;
  };

  const remainingCount = Math.max(0, totalCount - 3);

  const PropertySkeleton = () => (
    <div className="bg-card rounded-xl overflow-hidden shadow-card">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );

  const CTACard = () => (
    <Link 
      to="/propiedades"
      className="group block bg-primary/5 border-2 border-dashed border-primary/30 rounded-xl overflow-hidden hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 flex flex-col items-center justify-center min-h-[320px] p-6"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Home className="h-8 w-8 text-primary" />
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground text-center mb-2">
        Ver todas nuestras propiedades
      </h3>
      <p className="font-body text-muted-foreground text-center mb-4">
        {remainingCount > 0 
          ? `${remainingCount} propiedad${remainingCount !== 1 ? 'es' : ''} más disponible${remainingCount !== 1 ? 's' : ''}`
          : 'Explora nuestro catálogo completo'
        }
      </p>
      <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
        <span>Explorar</span>
        <ArrowRight className="h-5 w-5" />
      </div>
    </Link>
  );
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-16 min-h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop)'
          }}
        >
          <div className="absolute inset-0 bg-foreground/70" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-6 animate-fade-in max-w-4xl mx-auto leading-tight">
            Donde tus sueños encuentran su dirección
          </h1>
          <p className="font-body text-lg md:text-xl text-background/80 animate-slide-up max-w-2xl mx-auto" style={{ animationDelay: '0.2s' }}>
            Tu aliado de confianza en el camino hacia tu nuevo hogar
          </p>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Propiedades Destacadas
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Descubre nuestras mejores opciones disponibles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {loading ? (
              <>
                <PropertySkeleton />
                <PropertySkeleton />
                <PropertySkeleton />
                <CTACard />
              </>
            ) : (
              <>
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    id={property.id}
                    slug={property.slug}
                    title={property.title}
                    address={property.address || undefined}
                    city={property.city || undefined}
                    price_sale={property.price_sale || undefined}
                    price_rent={property.price_rent || undefined}
                    display_price_mode={property.display_price_mode || 'sale'}
                    bedrooms={property.bedrooms || undefined}
                    bathrooms={property.bathrooms || undefined}
                    area_m2={property.area_m2 || undefined}
                    status={property.status || 'available'}
                    mainImage={getMainImage(property)}
                  />
                ))}
                <CTACard />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Interesado en alguna propiedad?
            </h2>
            <p className="font-body text-muted-foreground mb-12">
              Contáctanos y te ayudaremos a encontrar el hogar perfecto para ti
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="flex flex-col items-center p-6 rounded-xl bg-secondary">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">Teléfono</h3>
                <p className="font-body text-muted-foreground text-sm">+57 316 875 4469</p>
              </div>

              <div className="flex flex-col items-center p-6 rounded-xl bg-secondary">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">Email</h3>
                <p className="font-body text-muted-foreground text-sm">qplusinmobiliaria@gmail.com</p>
              </div>

              <div className="flex flex-col items-center p-6 rounded-xl bg-secondary">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">Dirección</h3>
                <p className="font-body text-muted-foreground text-sm">Calle 100 #15-20, Bogotá</p>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="text-center">
              <p className="font-body text-muted-foreground mb-4">Síguenos en redes</p>
              <div className="flex justify-center gap-4">
                <a 
                  href="https://www.instagram.com/qplus.inmobiliaria/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.tiktok.com/@qplus_inmobiliaria" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.youtube.com/@QPlus_Inmobiliaria" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
