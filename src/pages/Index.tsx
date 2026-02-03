import { Phone, Mail, MapPin, ArrowRight, Instagram, Youtube } from 'lucide-react';

// TikTok icon (not available in Lucide)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';

// Mockup properties data
const mockProperties = [
  {
    id: '1',
    slug: 'apartamento-moderno-chapinero',
    title: 'Apartamento Moderno en Chapinero',
    address: 'Calle 63 #10-45',
    city: 'Bogotá',
    price_sale: 450000000,
    display_price_mode: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    area_m2: 85,
    status: 'available',
    mainImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
  },
  {
    id: '2',
    slug: 'casa-campestre-la-calera',
    title: 'Casa Campestre en La Calera',
    address: 'Vereda el Hato Km 5',
    city: 'La Calera',
    price_sale: 1200000000,
    display_price_mode: 'sale',
    bedrooms: 5,
    bathrooms: 4,
    area_m2: 320,
    status: 'available',
    mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'
  },
  {
    id: '3',
    slug: 'penthouse-vista-usaquen',
    title: 'Penthouse con Vista en Usaquén',
    address: 'Carrera 7 #116-50',
    city: 'Bogotá',
    price_sale: 980000000,
    display_price_mode: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    area_m2: 180,
    status: 'available',
    mainImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
  },
  {
    id: '4',
    slug: 'local-comercial-zona-rosa',
    title: 'Local Comercial en Zona Rosa',
    address: 'Calle 82 #12-15',
    city: 'Bogotá',
    price_rent: 8500000,
    display_price_mode: 'rent',
    bedrooms: 0,
    bathrooms: 2,
    area_m2: 120,
    status: 'available',
    mainImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'
  }
];

const Index = () => {
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
            {mockProperties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                slug={property.slug}
                title={property.title}
                address={property.address}
                city={property.city}
                price_sale={property.price_sale}
                price_rent={property.price_rent}
                display_price_mode={property.display_price_mode}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area_m2={property.area_m2}
                status={property.status}
                mainImage={property.mainImage}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/propiedades">
              <Button size="lg" className="gap-2">
                Ver todas las propiedades
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
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
