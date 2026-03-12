import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bed, Bath, Maximize } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface PropertyWithImage {
  id: string;
  title: string;
  slug: string;
  city: string | null;
  neighborhood: string | null;
  price_sale: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_m2: number | null;
  image_url: string | null;
}

const PropertiesSlider = () => {
  const [properties, setProperties] = useState<PropertyWithImage[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("properties")
        .select("id, title, slug, city, neighborhood, price_sale, bedrooms, bathrooms, area_m2")
        .neq("status", "draft");

      if (!data || data.length === 0) { setProperties([]); return; }

      const ids = data.map((p) => p.id);
      const { data: media } = await supabase
        .from("property_media")
        .select("property_id, url")
        .in("property_id", ids)
        .eq("is_main", true);

      const mediaMap = new Map(media?.map((m) => [m.property_id, m.url]));
      setProperties(data.map((p) => ({ ...p, image_url: mediaMap.get(p.id) || null })));
    };
    load();
  }, []);

  const formatPrice = (price: number | null) => {
    if (!price) return null;
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);
  };

  const duration = properties.length * 8;
  const items = properties.length > 0 ? [...properties, ...properties] : [];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-2 block">Portafolio</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Propiedades Destacadas</h2>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          {/* Marquee */}
          <div className="flex-1 overflow-hidden">
            {properties.length === 0 ? (
              <div className="flex gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-72 h-80 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div
                className="flex gap-4 hover:[animation-play-state:paused]"
                style={{
                  animation: `marquee-scroll ${duration}s linear infinite`,
                  width: "max-content",
                }}
              >
                {items.map((p, idx) => (
                  <Link
                    key={`${p.id}-${idx}`}
                    to={`/propiedades/${p.slug}`}
                    className="flex-shrink-0 w-72 rounded-xl overflow-hidden border border-border bg-background group shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Sin imagen</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-sm font-semibold text-foreground mb-1 truncate">{p.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{[p.neighborhood, p.city].filter(Boolean).join(", ")}</p>
                      {p.price_sale && <p className="text-sm font-bold text-primary mb-2">{formatPrice(p.price_sale)}</p>}
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        {p.bedrooms != null && <span className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> {p.bedrooms}</span>}
                        {p.bathrooms != null && <span className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> {p.bathrooms}</span>}
                        {p.area_m2 != null && <span className="flex items-center gap-1"><Maximize className="h-3.5 w-3.5" /> {p.area_m2}m²</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Fixed CTA */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full md:w-64 shrink-0">
            <div className="h-full rounded-xl bg-primary p-8 flex flex-col justify-center items-start text-primary-foreground">
              <h3 className="font-display text-xl font-bold mb-3">Encuentra tu propiedad ideal</h3>
              <p className="text-sm opacity-80 mb-6 leading-relaxed">Explora nuestro catálogo completo de propiedades disponibles.</p>
              <Link to="/propiedades" className="inline-flex items-center gap-2 bg-background text-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:gap-3 transition-all">
                Ver todas <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PropertiesSlider;
