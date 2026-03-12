import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Building, Settings, Menu, X, LogOut, ChevronRight, LayoutGrid, PlusCircle, List, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import logo from '@/assets/logo_qplus.png';
const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    loading
  } = useAuth();
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };
  const menuItems = [{
    label: 'Dashboard',
    icon: LayoutGrid,
    path: '/admin',
    exact: true
  }, {
    label: 'Propiedades',
    icon: Building,
    path: '/admin/propiedades',
    children: [{
      label: 'Todas',
      path: '/admin/propiedades',
      icon: List
    }, {
      label: 'Nueva',
      path: '/admin/propiedades/nueva',
      icon: PlusCircle
    }]
  }, {
    label: 'Contenido Destacado',
    icon: Star,
    path: '/admin/contenido-destacado'
  }, {
    label: 'Configuración',
    icon: Settings,
    path: '/admin/configuracion',
    children: [{
      label: 'Bloques',
      path: '/admin/configuracion/bloques',
      icon: LayoutGrid
    }]
  }];
  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <img src={logo} alt="Q+ Inmobiliaria" className="h-12 w-auto" />
        </div>
      </div>;
  }
  if (!user) return null;
  return <div className="min-h-screen bg-muted">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b border-border flex items-center px-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-muted transition-colors">
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <div className="flex items-center gap-2 ml-4">
          <img src={logo} alt="Q+ Inmobiliaria" className="h-8 w-auto" />
          <span className="font-display font-semibold">Admin</span>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && <div className="lg:hidden fixed inset-0 z-40 bg-foreground/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-sidebar text-sidebar-foreground 
          transform transition-transform duration-300 lg:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
            <img src={logo} alt="Q+ Inmobiliaria" className="h-10 w-auto" />
            <div>
              <p className="text-xs text-sidebar-foreground/60">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {menuItems.map(item => <div key={item.path} className="mb-1">
                <Link to={item.children ? item.children[0].path : item.path} onClick={() => setSidebarOpen(false)} className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                    ${isActive(item.path, item.exact) ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'}
                  `}>
                  <item.icon className="h-5 w-5" />
                  <span className="font-body text-sm font-medium">{item.label}</span>
                  {item.children && <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${isActive(item.path) ? 'rotate-90' : ''}`} />}
                </Link>
                
                {item.children && isActive(item.path) && <div className="ml-4 mt-1 space-y-1">
                    {item.children.map(child => <Link key={child.path} to={child.path} onClick={() => setSidebarOpen(false)} className={`
                          flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm
                          ${location.pathname === child.path ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30'}
                        `}>
                        <child.icon className="h-4 w-4" />
                        <span className="font-body">{child.label}</span>
                      </Link>)}
                  </div>}
              </div>)}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-sidebar-border">
            <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
              <Home className="h-5 w-5" />
              <span className="font-body text-sm">Ver Sitio</span>
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
              <LogOut className="h-5 w-5" />
              <span className="font-body text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>;
};
export default AdminLayout;