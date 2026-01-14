import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import * as LucideIcons from "lucide-react";
import type { BlockWithAttributes, BlockType } from "@/types/property";
import type { BlockFormData } from "@/hooks/useBlocksConfig";

const blockSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  type: z.enum(["checklist", "details_list", "free_text"]),
  icon: z.string().nullable(),
  display_order: z.number().min(0),
  is_active: z.boolean(),
});

interface BlockFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  block?: BlockWithAttributes | null;
  onSubmit: (data: BlockFormData) => Promise<boolean>;
  nextOrder: number;
}

const COMMON_ICONS = [
  { name: "home", label: "Casa" },
  { name: "tree", label: "Árbol" },
  { name: "zap", label: "Rayo" },
  { name: "map-pin", label: "Ubicación" },
  { name: "file-text", label: "Documento" },
  { name: "message-square", label: "Mensaje" },
  { name: "settings", label: "Configuración" },
  { name: "star", label: "Estrella" },
  { name: "heart", label: "Corazón" },
  { name: "shield", label: "Escudo" },
  { name: "building", label: "Edificio" },
  { name: "car", label: "Carro" },
  { name: "wifi", label: "WiFi" },
  { name: "droplet", label: "Agua" },
  { name: "sun", label: "Sol" },
];

const BLOCK_TYPES: { value: BlockType; label: string; description: string }[] = [
  {
    value: "checklist",
    label: "Lista de verificación",
    description: "Atributos como checkboxes (Sí/No)",
  },
  {
    value: "details_list",
    label: "Lista de detalles",
    description: "Atributos con campos de texto/número",
  },
  {
    value: "free_text",
    label: "Texto libre",
    description: "Un campo de texto largo (textarea)",
  },
];

function getIconComponent(iconName: string): React.ComponentType<{ className?: string }> | null {
  const pascalCase = iconName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  
  const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
  return icons[pascalCase] || null;
}

export default function BlockForm({
  open,
  onOpenChange,
  block,
  onSubmit,
  nextOrder,
}: BlockFormProps) {
  const isEditing = !!block;

  const form = useForm<BlockFormData>({
    resolver: zodResolver(blockSchema),
    defaultValues: {
      name: "",
      type: "checklist",
      icon: null,
      display_order: nextOrder,
      is_active: true,
    },
  });

  useEffect(() => {
    if (block) {
      form.reset({
        name: block.name,
        type: block.type,
        icon: block.icon,
        display_order: block.display_order ?? 0,
        is_active: block.is_active ?? true,
      });
    } else {
      form.reset({
        name: "",
        type: "checklist",
        icon: null,
        display_order: nextOrder,
        is_active: true,
      });
    }
  }, [block, nextOrder, form]);

  const handleSubmit = async (data: BlockFormData) => {
    const success = await onSubmit(data);
    if (success) {
      onOpenChange(false);
      form.reset();
    }
  };

  const selectedIcon = form.watch("icon");
  const IconComponent = selectedIcon ? getIconComponent(selectedIcon) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar bloque" : "Nuevo bloque"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del bloque</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Características Internas"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de bloque</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {BLOCK_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex flex-col">
                            <span>{type.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {type.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icono</FormLabel>
                  <div className="flex gap-3 items-center">
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Selecciona un icono" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {COMMON_ICONS.map((icon) => {
                          const Icon = getIconComponent(icon.name);
                          return (
                            <SelectItem key={icon.name} value={icon.name}>
                              <div className="flex items-center gap-2">
                                {Icon && <Icon className="h-4 w-4" />}
                                <span>{icon.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {IconComponent && (
                      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="display_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orden de visualización</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_active">Activo</Label>
                    <p className="text-sm text-muted-foreground">
                      Los bloques inactivos no se muestran en el formulario de propiedades
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      id="is_active"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Guardar cambios" : "Crear bloque"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
