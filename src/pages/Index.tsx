import { Phone, Mail, MapPin, Instagram, Youtube } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import PropertiesSlider from "@/components/home/PropertiesSlider";
import InvestmentsSlider from "@/components/home/InvestmentsSlider";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <AboutSection />
      <PropertiesSlider />
      <InvestmentsSlider />

      {/* Contact Section */}
      <section id="contacto" className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Interesado en alguna propiedad?
            </h2>
            <p className="font-body text-muted-foreground mb-12">
              Contáctanos y te ayudaremos a encontrar el hogar perfecto para ti
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="flex flex-col items-center p-6 rounded-xl bg-background border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">Teléfono</h3>
                <p className="font-body text-muted-foreground text-sm">+57 316 875 4469</p>
              </div>

              <div className="flex flex-col items-center p-6 rounded-xl bg-background border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">Email</h3>
                <p className="font-body text-muted-foreground text-sm">qplusinmobiliaria@gmail.com</p>
              </div>

              <div className="flex flex-col items-center p-6 rounded-xl bg-background border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">Conoce más</h3>
                <p className="font-body text-muted-foreground text-sm">Contáctanos y agenda tu visita</p>
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
                  className="w-12 h-12 rounded-full bg-background border border-border hover:bg-primary hover:text-primary-foreground text-foreground flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@qplus_inmobiliaria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-background border border-border hover:bg-primary hover:text-primary-foreground text-foreground flex items-center justify-center transition-colors"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="h-5 w-5" />
                </a>
                <a
                  href="https://www.youtube.com/@QPlus_Inmobiliaria"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-background border border-border hover:bg-primary hover:text-primary-foreground text-foreground flex items-center justify-center transition-colors"
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
