import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyGallery from "@/components/property/detail/PropertyGallery";
import PropertyInfo from "@/components/property/detail/PropertyInfo";
import PropertyContactCard from "@/components/property/detail/PropertyContactCard";
import PropertyFeatures from "@/components/property/detail/PropertyFeatures";
import PropertyMap from "@/components/property/detail/PropertyMap";
import { usePropertyDetail } from "@/hooks/usePropertyDetail";

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Gallery skeleton */}
        <Skeleton className="w-full aspect-[16/10] md:aspect-[16/9] rounded-xl mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="flex gap-6">
              <Skeleton className="h-14 w-24" />
              <Skeleton className="h-14 w-24" />
              <Skeleton className="h-14 w-24" />
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

const NotFound = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Header />
    <main className="flex-1 flex items-center justify-center pt-16">
      <div className="text-center px-4">
        <h1 className="text-3xl font-display font-bold mb-4">
          Propiedad no encontrada
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          La propiedad que buscas no existe o ya no está disponible.
        </p>
        <Link to="/propiedades">
          <Button size="lg" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Ver todas las propiedades
          </Button>
        </Link>
      </div>
    </main>
    <Footer />
  </div>
);

const PropertyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = usePropertyDetail(slug);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !data?.property) {
    return <NotFound />;
  }

  const { property, blocks, propertyValues } = data;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 pb-8">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Back link */}
          <Link
            to="/propiedades"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver a propiedades</span>
          </Link>

          {/* Gallery */}
          <div className="mb-8">
            <PropertyGallery
              media={property.property_media || []}
              title={property.title}
            />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <PropertyInfo property={property} />
              
              <PropertyFeatures
                blocks={blocks}
                propertyValues={propertyValues}
              />

              <PropertyMap
                lat={property.lat}
                lng={property.lng}
                address={property.address}
                city={property.city}
                neighborhood={property.neighborhood}
              />
            </div>

            {/* Sidebar - Desktop only */}
            <div className="hidden lg:block">
              <PropertyContactCard property={property} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
