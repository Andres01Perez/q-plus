import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/admin');
    }
  }, [user, authLoading, navigate]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Don't render form if user is authenticated (redirect is in progress)
  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: '¡Cuenta creada!',
          description: 'Tu cuenta ha sido creada exitosamente.',
        });
        navigate('/admin');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: '¡Bienvenido!',
          description: 'Has iniciado sesión correctamente.',
        });
        navigate('/admin');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Ocurrió un error al procesar tu solicitud.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=1600&fit=crop)'
        }}
      >
        <div className="absolute inset-0 gradient-hero opacity-80" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center">
              <span className="text-primary font-display font-bold text-2xl">Q+</span>
            </div>
            <span className="font-display font-semibold text-2xl text-background">Qplus</span>
          </Link>
          
          <div>
            <h1 className="font-display text-4xl font-bold text-background mb-4">
              Gestiona tus propiedades con facilidad
            </h1>
            <p className="font-body text-lg text-background/80">
              Accede al panel de administración para gestionar tu inventario inmobiliario.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-body text-sm">Volver al inicio</span>
          </Link>

          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg gradient-hero flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">Q+</span>
              </div>
              <span className="font-display font-semibold text-xl">Qplus</span>
            </div>
          </div>

          <h2 className="font-display text-3xl font-bold text-foreground mb-2">
            {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>
          <p className="font-body text-muted-foreground mb-8">
            {isSignUp 
              ? 'Crea una cuenta para acceder al panel de administración' 
              : 'Ingresa tus credenciales para acceder al panel'
            }
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-body">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-body">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12" disabled={loading}>
              {loading ? 'Procesando...' : isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isSignUp 
                ? '¿Ya tienes cuenta? Inicia sesión' 
                : '¿No tienes cuenta? Regístrate'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
