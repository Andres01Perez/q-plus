import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Settings } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xl">Q+</span>
            </div>
            <span className="font-display font-semibold text-xl text-foreground hidden sm:block">Qplus</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="font-body text-sm text-foreground hover:text-primary transition-colors"
            >
              Inicio
            </Link>
            <Link 
              to="/propiedades" 
              className="font-body text-sm text-foreground hover:text-primary transition-colors"
            >
              Propiedades
            </Link>
            <a 
              href="#contacto" 
              className="font-body text-sm text-foreground hover:text-primary transition-colors"
            >
              Contacto
            </a>
            <Link 
              to="/login" 
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Acceso administrativo"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <nav className="flex flex-col gap-2">
              <Link 
                to="/" 
                onClick={() => setIsOpen(false)}
                className="p-3 rounded-lg hover:bg-muted transition-colors font-body text-foreground"
              >
                Inicio
              </Link>
              <Link 
                to="/propiedades" 
                onClick={() => setIsOpen(false)}
                className="p-3 rounded-lg hover:bg-muted transition-colors font-body text-foreground"
              >
                Propiedades
              </Link>
              <a 
                href="#contacto" 
                onClick={() => setIsOpen(false)}
                className="p-3 rounded-lg hover:bg-muted transition-colors font-body text-foreground"
              >
                Contacto
              </a>
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="font-body text-muted-foreground text-sm">Admin</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
