import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, TrendingUp, Shield, ArrowRight, Building, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import { supabase } from '@/integrations/supabase/client';

interface Property {
  id: string;
  slug: string;
  title: string;
  address: string | null;
  city: string | null;
  price_sale: number | null;
  price_rent: number | null;
  display_price_mode: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_m2: number | null;
  status: string;
}

const Index = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('status', 'available')
      .limit(6);
    
    setFeaturedProperties(data || []);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/buscar?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-16 min-h-[90vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-6 animate-fade-in">
              Encuentra tu hogar <span className="text-primary">ideal</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-background/80 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Descubre las mejores propiedades con Q+, tu inmobiliaria de confianza con tecnología avanzada.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por ciudad, barrio o tipo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-base bg-background border-0 shadow-lg"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 gap-2">
                Buscar
                <ArrowRight className="h-5 w-5" />
              </Button>
            </form>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8 mt-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-background">
                <p className="font-display text-3xl font-bold">500+</p>
                <p className="font-body text-sm opacity-80">Propiedades</p>
              </div>
              <div className="text-background">
                <p className="font-display text-3xl font-bold">150+</p>
                <p className="font-body text-sm opacity-80">Clientes Felices</p>
              </div>
              <div className="text-background">
                <p className="font-display text-3xl font-bold">10+</p>
                <p className="font-body text-sm opacity-80">Años de Experiencia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Por qué elegir Q+?
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Combinamos experiencia inmobiliaria con tecnología de punta para brindarte la mejor experiencia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-card text-center group hover:shadow-card-hover transition-all">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                <Home className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Propiedades Premium</h3>
              <p className="font-body text-muted-foreground">
                Selección exclusiva de las mejores propiedades del mercado.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-card text-center group hover:shadow-card-hover transition-all">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                <TrendingUp className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Valoración Precisa</h3>
              <p className="font-body text-muted-foreground">
                Análisis de mercado con IA para precios justos y competitivos.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl shadow-card text-center group hover:shadow-card-hover transition-all">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                <Shield className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Seguridad Total</h3>
              <p className="font-body text-muted-foreground">
                Acompañamiento legal y documentación verificada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Propiedades Destacadas
              </h2>
              <p className="font-body text-muted-foreground">
                Descubre nuestras mejores opciones disponibles
              </p>
            </div>
            <Link to="/propiedades">
              <Button variant="outline" className="gap-2">
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-muted rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  slug={property.slug}
                  title={property.title}
                  address={property.address || undefined}
                  city={property.city || undefined}
                  price_sale={property.price_sale || undefined}
                  price_rent={property.price_rent || undefined}
                  display_price_mode={property.display_price_mode}
                  bedrooms={property.bedrooms || undefined}
                  bathrooms={property.bathrooms || undefined}
                  area_m2={property.area_m2 || undefined}
                  status={property.status}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/50 rounded-xl">
              <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-display text-xl font-semibold mb-2">Sin propiedades disponibles</h3>
              <p className="font-body text-muted-foreground mb-6">
                Pronto tendremos propiedades increíbles para ti.
              </p>
              <Link to="/admin/propiedades/nueva">
                <Button>Agregar Propiedad</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            ¿Listo para encontrar tu hogar?
          </h2>
          <p className="font-body text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Contáctanos hoy y te ayudaremos a encontrar la propiedad perfecta para ti y tu familia.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/propiedades">
              <Button size="lg" variant="secondary" className="gap-2">
                <MapPin className="h-5 w-5" />
                Explorar Propiedades
              </Button>
            </Link>
            <Link to="/contacto">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Contactar Asesor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
