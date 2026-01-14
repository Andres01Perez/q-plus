import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string;
  title: string;
  slug: string;
  city: string | null;
  status: string;
  price_sale: number | null;
  created_at: string;
}

const PropertyList = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('id, title, slug, city, status, price_sale, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las propiedades',
        variant: 'destructive',
      });
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', deleteId);

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la propiedad',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Propiedad eliminada',
        description: 'La propiedad ha sido eliminada correctamente',
      });
      loadProperties();
    }
    setDeleteId(null);
  };

  const filteredProperties = properties.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.city && p.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      available: { label: 'Disponible', variant: 'default' },
      sold: { label: 'Vendido', variant: 'destructive' },
      rented: { label: 'Arrendado', variant: 'secondary' },
      reserved: { label: 'Reservado', variant: 'outline' },
      draft: { label: 'Borrador', variant: 'outline' },
    };
    return statusMap[status] || { label: status, variant: 'outline' as const };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div className="min-w-0">
          <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
            Propiedades
          </h1>
          <p className="font-body text-muted-foreground text-sm sm:text-base mt-1">
            Gestiona tu inventario inmobiliario
          </p>
        </div>
        <div className="flex-shrink-0">
          <Link to="/admin/propiedades/nueva">
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-5 w-5" />
              Nueva Propiedad
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 sm:mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar propiedades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse">Cargando propiedades...</div>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-body text-muted-foreground mb-4">
              {searchQuery ? 'No se encontraron propiedades' : 'No hay propiedades registradas'}
            </p>
            <Link to="/admin/propiedades/nueva">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar primera propiedad
              </Button>
            </Link>
          </div>
        ) : (
          <div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 sm:px-6 py-4 text-left font-body text-sm font-medium text-muted-foreground">
                    Propiedad
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left font-body text-sm font-medium text-muted-foreground hidden md:table-cell">
                    Ciudad
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left font-body text-sm font-medium text-muted-foreground hidden lg:table-cell">
                    Precio
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-left font-body text-sm font-medium text-muted-foreground hidden sm:table-cell">
                    Estado
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-right font-body text-sm font-medium text-muted-foreground">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProperties.map((property) => {
                  const badge = getStatusBadge(property.status);
                  return (
                    <tr key={property.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 sm:px-6 py-4">
                        <p className="font-body font-medium text-foreground">
                          {property.title}
                        </p>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                        <p className="font-body text-sm text-muted-foreground">
                          {property.city || '—'}
                        </p>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                        <p className="font-body text-sm text-foreground">
                          {property.price_sale ? formatPrice(property.price_sale) : '—'}
                        </p>
                      </td>
                      <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/propiedad/${property.slug}`} className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                Ver
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/propiedades/${property.id}`} className="flex items-center gap-2">
                                <Edit className="h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => setDeleteId(property.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar propiedad?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La propiedad será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PropertyList;
