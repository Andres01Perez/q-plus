import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, MoreVertical, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import type { Tables } from '@/integrations/supabase/types';

type FeaturedSection = Tables<'featured_sections'>;
type SectionType = 'servicios' | 'propiedades' | 'inversiones';

const emptyForm = {
  type: 'servicios' as SectionType,
  title: '',
  subtitle: '',
  image_url: '',
  cta_label: '',
  cta_url: '',
  display_order: 0,
  active: true,
};

const FeaturedSectionsList = () => {
  const [sections, setSections] = useState<FeaturedSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    const { data, error } = await supabase
      .from('featured_sections')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      toast({ title: 'Error', description: 'No se pudieron cargar las secciones', variant: 'destructive' });
    } else {
      setSections(data || []);
    }
    setLoading(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (section: FeaturedSection) => {
    setEditingId(section.id);
    setForm({
      type: section.type as SectionType,
      title: section.title,
      subtitle: section.subtitle || '',
      image_url: section.image_url || '',
      cta_label: section.cta_label || '',
      cta_url: section.cta_url || '',
      display_order: section.display_order ?? 0,
      active: section.active ?? true,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: 'Error', description: 'El título es obligatorio', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const payload = {
      type: form.type as SectionType,
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || null,
      image_url: form.image_url.trim() || null,
      cta_label: form.cta_label.trim() || null,
      cta_url: form.cta_url.trim() || null,
      display_order: form.display_order,
      active: form.active,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from('featured_sections').update(payload).eq('id', editingId));
    } else {
      ({ error } = await supabase.from('featured_sections').insert(payload));
    }

    if (error) {
      toast({ title: 'Error', description: 'No se pudo guardar la sección', variant: 'destructive' });
    } else {
      toast({ title: editingId ? 'Sección actualizada' : 'Sección creada' });
      setDialogOpen(false);
      loadSections();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('featured_sections').delete().eq('id', deleteId);
    if (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar la sección', variant: 'destructive' });
    } else {
      toast({ title: 'Sección eliminada' });
      loadSections();
    }
    setDeleteId(null);
  };

  const typeBadge = (type: string) => {
    const map: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      servicios: { label: 'Servicios', variant: 'default' },
      propiedades: { label: 'Propiedades', variant: 'secondary' },
      inversiones: { label: 'Inversiones', variant: 'outline' },
    };
    return map[type] || { label: type, variant: 'outline' as const };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div className="min-w-0">
          <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-foreground truncate">
            Contenido Destacado
          </h1>
          <p className="font-body text-muted-foreground text-sm sm:text-base mt-1">
            Gestiona las secciones destacadas del sitio
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button onClick={openCreate} className="gap-2 w-full sm:w-auto">
            <Plus className="h-5 w-5" />
            Nueva Sección
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse">Cargando secciones...</div>
          </div>
        ) : sections.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-body text-muted-foreground mb-4">No hay secciones destacadas</p>
            <Button variant="outline" className="gap-2" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Agregar primera sección
            </Button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 sm:px-6 py-4 text-left font-body text-sm font-medium text-muted-foreground">Título</th>
                <th className="px-4 sm:px-6 py-4 text-left font-body text-sm font-medium text-muted-foreground hidden sm:table-cell">Tipo</th>
                <th className="px-4 sm:px-6 py-4 text-left font-body text-sm font-medium text-muted-foreground hidden md:table-cell">Orden</th>
                <th className="px-4 sm:px-6 py-4 text-left font-body text-sm font-medium text-muted-foreground hidden sm:table-cell">Estado</th>
                <th className="px-4 sm:px-6 py-4 text-right font-body text-sm font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sections.map((section) => {
                const badge = typeBadge(section.type);
                return (
                  <tr key={section.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <p className="font-body font-medium text-foreground">{section.title}</p>
                      {section.subtitle && (
                        <p className="font-body text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">{section.subtitle}</p>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      <span className="font-body text-sm text-muted-foreground">{section.display_order}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <Badge variant={section.active ? 'default' : 'outline'}>
                        {section.active ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(section)} className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteId(section.id)}
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
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Sección' : 'Nueva Sección'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as SectionType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="servicios">Servicios</SelectItem>
                  <SelectItem value="propiedades">Propiedades</SelectItem>
                  <SelectItem value="inversiones">Inversiones</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título de la sección" />
            </div>
            <div className="space-y-2">
              <Label>Subtítulo</Label>
              <Textarea value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Descripción corta" rows={2} />
            </div>
            <div className="space-y-2">
              <Label>URL de imagen</Label>
              <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
              {form.image_url && (
                <div className="mt-2 rounded-lg overflow-hidden border border-border">
                  <img src={form.image_url} alt="Preview" className="w-full h-32 object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Label CTA</Label>
                <Input value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} placeholder="Ver más" />
              </div>
              <div className="space-y-2">
                <Label>URL CTA</Label>
                <Input value={form.cta_url} onChange={(e) => setForm({ ...form, cta_url: e.target.value })} placeholder="/propiedades" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Orden</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                <Label>Activo</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar sección?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La sección será eliminada permanentemente.
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

export default FeaturedSectionsList;
