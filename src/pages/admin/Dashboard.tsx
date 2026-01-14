import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building, Eye, DollarSign, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  rentedProperties: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalProperties: 0,
    availableProperties: 0,
    soldProperties: 0,
    rentedProperties: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data: properties } = await supabase
      .from('properties')
      .select('status');

    if (properties) {
      setStats({
        totalProperties: properties.length,
        availableProperties: properties.filter(p => p.status === 'available').length,
        soldProperties: properties.filter(p => p.status === 'sold').length,
        rentedProperties: properties.filter(p => p.status === 'rented').length,
      });
    }
    setLoading(false);
  };

  const statCards = [
    { 
      label: 'Total Propiedades', 
      value: stats.totalProperties, 
      icon: Building, 
      color: 'bg-primary',
      textColor: 'text-primary'
    },
    { 
      label: 'Disponibles', 
      value: stats.availableProperties, 
      icon: Eye, 
      color: 'bg-qplus-success',
      textColor: 'text-qplus-success'
    },
    { 
      label: 'Vendidas', 
      value: stats.soldProperties, 
      icon: DollarSign, 
      color: 'bg-qplus-warning',
      textColor: 'text-qplus-warning'
    },
    { 
      label: 'Arrendadas', 
      value: stats.rentedProperties, 
      icon: TrendingUp, 
      color: 'bg-accent',
      textColor: 'text-accent'
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="font-body text-muted-foreground mt-1">
            Bienvenido al panel de administración Q+
          </p>
        </div>
        <Link to="/admin/propiedades/nueva">
          <Button className="gap-2">
            <Plus className="h-5 w-5" />
            Nueva Propiedad
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div 
            key={stat.label}
            className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color}/10 flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
            <p className="font-display text-3xl font-bold text-foreground">
              {loading ? '...' : stat.value}
            </p>
            <p className="font-body text-sm text-muted-foreground mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <Link 
              to="/admin/propiedades/nueva"
              className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-body font-medium">Agregar Propiedad</p>
                  <p className="font-body text-sm text-muted-foreground">Crea una nueva propiedad</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Link>
            
            <Link 
              to="/admin/configuracion/bloques"
              className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-body font-medium">Configurar Bloques</p>
                  <p className="font-body text-sm text-muted-foreground">Gestiona atributos dinámicos</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6 shadow-card">
          <h2 className="font-display text-lg font-semibold mb-4">Sistema Q+</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-qplus-success/10">
              <div className="w-3 h-3 rounded-full bg-qplus-success" />
              <span className="font-body text-sm">Motor de contenido modular activo</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="font-body text-sm">IA para descripciones habilitada</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-qplus-warning/10">
              <div className="w-3 h-3 rounded-full bg-qplus-warning" />
              <span className="font-body text-sm">PWA lista para producción</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
