import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Youtube } from 'lucide-react';
import logo from '@/assets/logo_qplus.png';

// TikTok icon (not available in Lucide)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src={logo} 
                alt="Q+ Inmobiliaria" 
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="font-body text-sm opacity-80 leading-relaxed">
              Tu aliado inmobiliario de confianza. Encontramos el hogar perfecto para ti.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="font-body text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/propiedades" className="font-body text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Propiedades
                </Link>
              </li>
              <li>
                <Link to="/propiedades#privadas" className="font-body text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Propiedades privadas
                </Link>
              </li>
              <li>
                <Link to="/herramientas" className="font-body text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Herramientas
                </Link>
              </li>
              <li>
                <Link to="/mesa-inversionistas" className="font-body text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Mesa de Inversionistas
                </Link>
              </li>
              <li>
                <a href="#contacto" className="font-body text-sm opacity-80 hover:opacity-100 transition-opacity">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 opacity-80" />
                <span className="font-body text-sm opacity-80">+57 316 875 4469</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 opacity-80" />
                <span className="font-body text-sm opacity-80">qplusinmobiliaria@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 opacity-80 mt-0.5" />
                <span className="font-body text-sm opacity-80">Calle 100 #15-20, Bogotá</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Síguenos</h4>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/qplus.inmobiliaria/" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@qplus_inmobiliaria" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
              <a 
                href="https://www.youtube.com/@QPlus_Inmobiliaria" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20">
          <p className="font-body text-sm text-center opacity-60">
            © {new Date().getFullYear()} Q+ Inmobiliaria. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
