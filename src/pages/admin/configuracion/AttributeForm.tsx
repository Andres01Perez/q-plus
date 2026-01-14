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
import { CheckSquare, Type, Hash, FileText } from "lucide-react";
import type { Attribute, InputType } from "@/types/property";
import type { AttributeFormData } from "@/hooks/useBlocksConfig";

const attributeSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(100),
  input_type: z.enum(["checkbox", "text", "number", "textarea"]),
  is_required: z.boolean(),
  display_order: z.number().min(0),
});

interface AttributeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attribute?: Attribute | null;
  blockName: string;
  onSubmit: (data: AttributeFormData) => Promise<boolean>;
  nextOrder: number;
}

const INPUT_TYPES: { value: InputType; label: string; icon: React.ReactNode }[] = [
  {
    value: "checkbox",
    label: "Checkbox (Sí/No)",
    icon: <CheckSquare className="h-4 w-4" />,
  },
  {
    value: "text",
    label: "Texto corto",
    icon: <Type className="h-4 w-4" />,
  },
  {
    value: "number",
    label: "Número",
    icon: <Hash className="h-4 w-4" />,
  },
  {
    value: "textarea",
    label: "Texto largo",
    icon: <FileText className="h-4 w-4" />,
  },
];

export default function AttributeForm({
  open,
  onOpenChange,
  attribute,
  blockName,
  onSubmit,
  nextOrder,
}: AttributeFormProps) {
  const isEditing = !!attribute;

  const form = useForm<AttributeFormData>({
    resolver: zodResolver(attributeSchema),
    defaultValues: {
      name: "",
      input_type: "checkbox",
      is_required: false,
      display_order: nextOrder,
    },
  });

  useEffect(() => {
    if (attribute) {
      form.reset({
        name: attribute.name,
        input_type: attribute.input_type,
        is_required: attribute.is_required ?? false,
        display_order: attribute.display_order ?? 0,
      });
    } else {
      form.reset({
        name: "",
        input_type: "checkbox",
        is_required: false,
        display_order: nextOrder,
      });
    }
  }, [attribute, nextOrder, form]);

  const handleSubmit = async (data: AttributeFormData) => {
    const success = await onSubmit(data);
    if (success) {
      onOpenChange(false);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar atributo" : "Nuevo atributo"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Bloque: <span className="font-medium">{blockName}</span>
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del atributo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: Cocina integral"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="input_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de campo</FormLabel>
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
                      {INPUT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            {type.icon}
                            <span>{type.label}</span>
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
              name="is_required"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_required">Campo requerido</Label>
                    <p className="text-sm text-muted-foreground">
                      Obligatorio al crear una propiedad
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      id="is_required"
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
                {isEditing ? "Guardar cambios" : "Crear atributo"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
