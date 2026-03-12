import { motion } from "framer-motion";
import { Target, TrendingUp, Users, Shield } from "lucide-react";

const highlights = [
  { icon: Target, label: "Evaluación estratégica" },
  { icon: TrendingUp, label: "Seguimiento continuo" },
  { icon: Users, label: "Administración de capital" },
  { icon: Shield, label: "Inversiones seguras" },
];

const AboutSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            className="relative rounded-2xl overflow-hidden aspect-[4/3]"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&fm=webp"
              alt="Equipo profesional Q+ trabajando en estrategia de inversión"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-2 block">
              Quiénes somos
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Somos Q+
            </h2>
            <p className="font-body text-muted-foreground leading-relaxed mb-4">
              Somos la mejor elección para generar rentabilidad con inversiones
              seguras a corto, mediano y largo plazo, según tus necesidades.
              Ofrecemos servicios de evaluación, seguimiento, venta y
              administración de capital por medio de propiedades e inversiones
              estratégicas.
            </p>
            <p className="font-body text-muted-foreground leading-relaxed mb-8">
              Un equipo multidisciplinario con experiencia en marketing digital,
              análisis financiero y relaciones estratégicas con empresarios e
              inversionistas. Nuestra red de contactos y alianzas nos permite
              identificar oportunidades antes que el mercado, garantizando
              decisiones informadas y resultados medibles para cada uno de
              nuestros clientes.
            </p>

            {/* Highlight pills */}
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((h) => (
                <div
                  key={h.label}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-secondary/50"
                >
                  <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <h.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {h.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
