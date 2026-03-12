import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import GridBackground from "./GridBackground";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center bg-luxury-bg overflow-hidden">
    <GridBackground />

    <div className="container mx-auto px-4 relative z-10 text-center">
      <motion.h1
        className="font-display text-4xl md:text-5xl lg:text-7xl font-bold mb-6 max-w-5xl mx-auto leading-tight bg-gradient-to-r from-gold-light via-gold to-gold-light bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Tu próxima propiedad, una decisión inteligente
      </motion.h1>

      <motion.p
        className="font-body text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Tu aliado de confianza en el camino hacia tu nuevo hogar
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Link
          to="/propiedades"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-luxury-bg font-display font-semibold rounded-lg hover:bg-gold-light transition-colors"
        >
          Ver propiedades
          <ArrowRight className="h-5 w-5" />
        </Link>
        <a
          href="#contacto"
          className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gold text-gold font-display font-semibold rounded-lg hover:bg-gold/10 transition-colors"
        >
          Quiero invertir
        </a>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
