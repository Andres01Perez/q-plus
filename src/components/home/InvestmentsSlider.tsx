import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { supabase } from "@/integrations/supabase/client";

interface Investment {
  id: string;
  title: string;
  slug: string;
  country: string;
  city: string | null;
  type: string;
  min_amount: number;
  expected_return: number | null;
  currency: string | null;
  image_url: string | null;
}

const typeLabels: Record<string, string> = {
  residencial: "Residencial",
  comercial: "Comercial",
  fondo: "Fondo",
};

const InvestmentsSlider = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
  });

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("investments")
        .select("*")
        .eq("active", true)
        .limit(4);
      setInvestments((data as Investment[]) || []);
    };
    load();
  }, []);

  const formatAmount = (amount: number, currency: string | null) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-2 block">
            Oportunidades
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Inversiones Internacionales
          </h2>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          {/* Fixed CTA — LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full md:w-64 shrink-0 order-2 md:order-1"
          >
            <div className="h-full rounded-xl bg-primary p-8 flex flex-col justify-center items-start text-primary-foreground">
              <h3 className="font-display text-xl font-bold mb-3">
                Invierte con respaldo experto
              </h3>
              <p className="text-sm opacity-80 mb-6 leading-relaxed">
                Descubre oportunidades de inversión internacional con retornos
                atractivos y asesoría personalizada.
              </p>
              <Link
                to="/inversiones"
                className="inline-flex items-center gap-2 bg-background text-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:gap-3 transition-all"
              >
                Explorar
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          {/* Slider — RIGHT */}
          <div className="flex-1 overflow-hidden order-1 md:order-2" ref={emblaRef}>
            <div className="flex gap-4">
              {investments.length === 0
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 w-72 h-80 rounded-xl bg-muted animate-pulse"
                    />
                  ))
                : investments.map((inv) => (
                    <Link
                      key={inv.id}
                      to={`/inversiones`}
                      className="flex-shrink-0 w-72 rounded-xl overflow-hidden border border-border bg-background group shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-muted">
                        {inv.image_url ? (
                          <img
                            src={inv.image_url}
                            alt={inv.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                            Sin imagen
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                            {typeLabels[inv.type] || inv.type}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Globe className="h-3 w-3" />
                            {inv.country}
                          </span>
                        </div>
                        <h3 className="font-display text-sm font-semibold text-foreground mb-1 truncate">
                          {inv.title}
                        </h3>
                        <p className="text-sm font-bold text-primary mb-1">
                          Desde {formatAmount(inv.min_amount, inv.currency)}
                        </p>
                        {inv.expected_return != null && (
                          <p className="flex items-center gap-1 text-xs text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            Retorno esperado: {inv.expected_return}%
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentsSlider;
