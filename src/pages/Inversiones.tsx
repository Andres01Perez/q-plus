import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { TrendingUp, Shield, PieChart, FileCheck, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import heroImg from '@/assets/investment-hero.jpg';

const countryFlags: Record<string, string> = {
  'Estados Unidos': '🇺🇸', 'España': '🇪🇸', 'Portugal': '🇵🇹', 'Colombia': '🇨🇴',
  'México': '🇲🇽', 'Panamá': '🇵🇦', 'Costa Rica': '🇨🇷', 'Chile': '🇨🇱',
  'Argentina': '🇦🇷', 'Uruguay': '🇺🇾', 'Brasil': '🇧🇷', 'Perú': '🇵🇪',
  'República Dominicana': '🇩🇴', 'Italia': '🇮🇹', 'Francia': '🇫🇷', 'Alemania': '🇩🇪',
  'Reino Unido': '🇬🇧', 'Canadá': '🇨🇦', 'Dubai': '🇦🇪', 'Emiratos Árabes Unidos': '🇦🇪',
};
const getFlag = (country: string) => countryFlags[country] ?? '🌍';

function AnimatedCounter({ target, suffix, prefix }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count}{suffix}
    </span>
  );
}

interface Investment {
  id: string;
  title: string;
  country: string;
  city: string | null;
  type: 'residencial' | 'comercial' | 'fondo';
  min_amount: number;
  expected_return: number | null;
  currency: string | null;
  image_url: string | null;
  slug: string;
}

const typeLabels: Record<string, string> = {
  residencial: 'Residencial',
  comercial: 'Comercial',
  fondo: 'Fondo',
};

export default function Inversiones() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('investments')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setInvestments((data as Investment[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ══════════ HERO ══════════ */}
      <section className="relative h-[70vh] min-h-[500px] mt-16 flex items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Skyline internacional"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <Badge className="mb-6 bg-primary text-primary-foreground font-semibold text-sm px-4 py-1.5 border-none">
              Inversiones Internacionales
            </Badge>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Invierte en el exterior con respaldo experto
            </h1>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base px-8 py-6 rounded-lg"
              onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Descubre tu perfil de inversor
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ══════════ METRICS ══════════ */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { target: 2, prefix: 'USD ', suffix: 'M+', label: 'gestionados' },
              { target: 15, suffix: '+', label: 'países' },
              { target: 200, suffix: '+', label: 'inversores' },
            ].map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  <AnimatedCounter target={m.target} suffix={m.suffix} prefix={m.prefix} />
                </p>
                <p className="text-muted-foreground text-sm mt-1">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ GRID DE OPORTUNIDADES ══════════ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Oportunidades de inversión
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Accede a propiedades y fondos seleccionados en los mercados más rentables del mundo.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-72 rounded-xl" />
              ))}
            </div>
          ) : investments.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">Próximamente nuevas oportunidades de inversión.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investments.map((inv, i) => (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="group relative rounded-xl border border-border bg-background overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {inv.image_url && (
                    <div className="h-44 overflow-hidden">
                      <img
                        src={inv.image_url}
                        alt={inv.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{getFlag(inv.country)}</span>
                      <span className="text-muted-foreground text-sm">{inv.country}{inv.city ? `, ${inv.city}` : ''}</span>
                    </div>
                    <h3 className="text-foreground font-semibold text-lg mb-3 line-clamp-2">{inv.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                        {typeLabels[inv.type]}
                      </Badge>
                      {inv.expected_return != null && (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs border">
                          {inv.expected_return}% retorno
                        </Badge>
                      )}
                    </div>
                    <p className="text-primary font-semibold text-sm">
                      Desde {inv.currency ?? 'USD'} {inv.min_amount.toLocaleString('es')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ══════════ CTA QUIZ ══════════ */}
      <section id="quiz" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center rounded-2xl p-10 md:p-16 bg-primary"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-6">
              <TrendingUp className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              ¿Qué tipo de inversor eres?
            </h2>
            <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
              En 3 minutos descubre si eres un inversor conservador, moderado o agresivo y qué oportunidades son para ti.
            </p>
            <Button
              size="lg"
              className="bg-background hover:bg-background/90 text-foreground font-semibold text-base px-10 py-6 rounded-lg"
              asChild
            >
              <a href="#quiz">Hacer el test gratuito</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ══════════ BLOQUE DE CONFIANZA ══════════ */}
      <section className="py-20 md:py-28 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Asesoría personalizada',
                desc: 'Un experto dedicado te guía en cada paso, desde la selección hasta el cierre de tu inversión.',
              },
              {
                icon: PieChart,
                title: 'Portafolio diversificado',
                desc: 'Accede a oportunidades en múltiples países y sectores para minimizar riesgos y maximizar retornos.',
              },
              {
                icon: FileCheck,
                title: 'Retornos documentados',
                desc: 'Reportes transparentes y auditados sobre el rendimiento de cada oportunidad de inversión.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-xl border border-border bg-background"
              >
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-foreground font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
