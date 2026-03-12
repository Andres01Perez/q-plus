import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type SectionType = "servicios" | "propiedades" | "inversiones";

interface FeaturedItem {
  id: string;
  type: SectionType;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  display_order: number;
}

const tabs: { key: SectionType; label: string }[] = [
  { key: "servicios", label: "Servicios" },
  { key: "propiedades", label: "Propiedades Destacadas" },
  { key: "inversiones", label: "Inversiones" },
];

const FeaturedSlider = () => {
  const [active, setActive] = useState<SectionType>("servicios");
  const [items, setItems] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("featured_sections")
        .select("*")
        .eq("active", true)
        .order("display_order", { ascending: true });
      setItems((data as FeaturedItem[]) || []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = items.filter((i) => i.type === active);

  return (
    <section className="py-20 bg-luxury-bg-alt">
      <div className="container mx-auto px-4">
        <motion.h2
          className="font-display text-3xl md:text-4xl font-bold text-white text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Explora nuestras opciones
        </motion.h2>
        <p className="font-body text-white/50 text-center mb-10">
          Descubre lo que Q+ tiene para ti
        </p>

        {/* Tabs */}
        <div className="flex justify-center gap-1 mb-10 bg-luxury-bg rounded-lg p-1 max-w-xl mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`flex-1 px-4 py-2.5 rounded-md text-sm font-display font-semibold transition-all ${
                active === tab.key
                  ? "bg-gold text-luxury-bg"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-80 h-96 rounded-xl bg-luxury-bg animate-pulse snap-start"
                />
              ))
            ) : filtered.length === 0 ? (
              <div className="w-full text-center py-16 text-white/40 font-body">
                No hay elementos disponibles en esta categoría.
              </div>
            ) : (
              filtered.map((item) => (
                <motion.div
                  key={item.id}
                  className="flex-shrink-0 w-80 rounded-xl overflow-hidden border border-gold/20 bg-luxury-bg group snap-start"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.image_url && (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-white mb-1">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="font-body text-sm text-white/50 mb-4">
                        {item.subtitle}
                      </p>
                    )}
                    {item.cta_label && item.cta_url && (
                      <Link
                        to={item.cta_url}
                        className="inline-flex items-center gap-1.5 text-gold text-sm font-semibold hover:gap-2.5 transition-all"
                      >
                        {item.cta_label}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeaturedSlider;
