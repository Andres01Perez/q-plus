import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">Q+</span>
              </div>
              <span className="font-display font-semibold text-xl">Qplus</span>
            </div>
            <p className="font-body text-sm opacity-80 leading-relaxed">
              Tu aliado inmobiliario de confianza. Encontramos el hogar perfecto para ti con tecnología de vanguardia.
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
                <span className="font-body text-sm opacity-80">+57 300 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 opacity-80" />
                <span className="font-body text-sm opacity-80">info@qplus.com</span>
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
                href="#" 
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/20">
          <p className="font-body text-sm text-center opacity-60">
            © {new Date().getFullYear()} Qplus Inmobiliaria. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
