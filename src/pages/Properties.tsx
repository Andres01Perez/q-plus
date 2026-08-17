import { useState, useEffect, useMemo } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import { PrivateListingsSection } from '@/components/property/PrivateListingsSection';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PAGE_SIZE = 8;

interface Property {
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
  property_media: { url: string; is_main: boolean }[];
}

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [page, setPage] = useState(0);

  useEffect(() => {
    loadProperties();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [searchQuery, cityFilter]);

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id, slug, title, address, city,
          price_sale, price_rent, display_price_mode,
          bedrooms, bathrooms, area_m2, status,
          property_media (url, is_main)
        `)
        .neq('status', 'draft')
        .eq('is_private', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const cities = useMemo(() => {
    const uniqueCities = new Set(
      properties.map((p) => p.city).filter((city): city is string => !!city)
    );
    return Array.from(uniqueCities).sort();
  }, [properties]);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = cityFilter === 'all' || property.city === cityFilter;
      return matchesSearch && matchesCity;
    });
  }, [properties, searchQuery, cityFilter]);

  const totalFiltered = filteredProperties.length;
  const pageStart = page * PAGE_SIZE;
  const pageItems = filteredProperties.slice(pageStart, pageStart + PAGE_SIZE);
  const hasMore = pageStart + PAGE_SIZE < totalFiltered;
  const displayItems = hasMore ? pageItems.slice(0, 7) : pageItems;
  const remaining = totalFiltered - pageStart - displayItems.length;

  const getMainImage = (property: Property) => {
    const mainMedia = property.property_media?.find((m) => m.is_main);
    return mainMedia?.url || property.property_media?.[0]?.url;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="pt-24 pb-12 bg-secondary">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Propiedades
          </h1>
          <p className="font-body text-muted-foreground">
            Encuentra tu próximo hogar entre nuestra selección
          </p>
        </div>
      </section>

      <section className="py-6 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar propiedades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Todas las ciudades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las ciudades</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-muted animate-pulse rounded-xl h-80" />
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-body text-muted-foreground text-lg">
                No se encontraron propiedades
              </p>
              {(searchQuery || cityFilter !== 'all') && (
                <button
                  onClick={() => { setSearchQuery(''); setCityFilter('all'); }}
                  className="mt-4 text-primary hover:underline font-body"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="font-body text-muted-foreground mb-6">
                {totalFiltered} propiedad{totalFiltered !== 1 ? 'es' : ''} encontrada{totalFiltered !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayItems.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <PropertyCard
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
                  </motion.div>
                ))}

                {hasMore && (
                  <motion.button
                    key={`see-more-${page}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 7 * 0.05 }}
                    onClick={() => setPage((p) => p + 1)}
                    className="group flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-muted/50 p-6 text-center transition-all duration-300 hover:border-primary hover:bg-primary/5 aspect-[4/3]"
                  >
                    <span className="font-display text-2xl font-bold text-foreground">
                      + {remaining}
                    </span>
                    <span className="font-body text-muted-foreground">
                      propiedad{remaining !== 1 ? 'es' : ''} más
                    </span>
                    <span className="inline-flex items-center gap-2 font-body text-sm font-medium text-primary group-hover:gap-3 transition-all">
                      Ver más <ArrowRight className="h-4 w-4" />
                    </span>
                  </motion.button>
                )}
              </div>

              {page > 0 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setPage(0)}
                    className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Volver al inicio
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <PrivateListingsSection />

      <Footer />
    </div>
  );
};

export default Properties;
