import { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PropertyCard from '@/components/property/PropertyCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
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
          property_media (url, is_main)
        `)
        .neq('status', 'draft')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique cities for filter
  const cities = useMemo(() => {
    const uniqueCities = new Set(
      properties
        .map((p) => p.city)
        .filter((city): city is string => !!city)
    );
    return Array.from(uniqueCities).sort();
  }, [properties]);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCity =
        cityFilter === 'all' || property.city === cityFilter;

      return matchesSearch && matchesCity;
    });
  }, [properties, searchQuery, cityFilter]);

  const getMainImage = (property: Property) => {
    const mainMedia = property.property_media?.find((m) => m.is_main);
    return mainMedia?.url || property.property_media?.[0]?.url;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
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

      {/* Filters */}
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
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-muted animate-pulse rounded-xl h-80"
                />
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-body text-muted-foreground text-lg">
                No se encontraron propiedades
              </p>
              {(searchQuery || cityFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCityFilter('all');
                  }}
                  className="mt-4 text-primary hover:underline font-body"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="font-body text-muted-foreground mb-6">
                {filteredProperties.length} propiedad
                {filteredProperties.length !== 1 ? 'es' : ''} encontrada
                {filteredProperties.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
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
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Properties;
