import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Search, User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-xl">Q+</span>
            </div>
            <span className="font-display font-semibold text-xl text-foreground hidden sm:block">Qplus</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/propiedades" 
              className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Propiedades
            </Link>
            <Link 
              to="/buscar" 
              className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Buscar
            </Link>
            <Link 
              to="/contacto" 
              className="font-body text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contacto
            </Link>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    <Link to="/admin">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Admin
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                      <LogOut className="h-4 w-4" />
                      Salir
                    </Button>
                  </div>
                ) : (
                  <Link to="/login">
                    <Button variant="default" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      Iniciar Sesión
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>

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
                to="/propiedades" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Home className="h-5 w-5 text-primary" />
                <span className="font-body">Propiedades</span>
              </Link>
              <Link 
                to="/buscar" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                <Search className="h-5 w-5 text-primary" />
                <span className="font-body">Buscar</span>
              </Link>
              {!loading && (
                <>
                  {user ? (
                    <>
                      <Link 
                        to="/admin" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Settings className="h-5 w-5 text-primary" />
                        <span className="font-body">Admin</span>
                      </Link>
                      <button 
                        onClick={() => { handleLogout(); setIsOpen(false); }}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                      >
                        <LogOut className="h-5 w-5 text-primary" />
                        <span className="font-body">Cerrar Sesión</span>
                      </button>
                    </>
                  ) : (
                    <Link 
                      to="/login" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <User className="h-5 w-5 text-primary" />
                      <span className="font-body">Iniciar Sesión</span>
                    </Link>
                  )}
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
