import { useState } from "react";
import type { FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

type Status = "idle" | "submitting" | "success";

export function PrivateListingLeadForm() {
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>("idle");
  const [consiente, setConsiente] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const nombre = String(form.get("nombre") ?? "").trim();
    const identificacion = String(form.get("identificacion") ?? "").trim();
    const celular = String(form.get("celular") ?? "").trim();
    const correo = String(form.get("correo") ?? "").trim();

    const nextErrors: Record<string, string> = {};
    if (nombre.length < 2) nextErrors.nombre = "Escribe tu nombre completo.";
    if (identificacion.length < 5) nextErrors.identificacion = "Escribe un número válido.";
    if (celular.length < 7) nextErrors.celular = "Escribe un número válido.";
    if (!/^\S+@\S+\.\S+$/.test(correo)) nextErrors.correo = "Escribe un correo válido.";
    if (!consiente) nextErrors.consiente = "Debes autorizar el tratamiento de tus datos.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setStatus("submitting");

    const { error } = await supabase.from("private_listing_leads").insert({
      nombre,
      identificacion,
      celular,
      correo,
      consiente_tratamiento_datos: true,
    });

    if (error) {
      setStatus("idle");
      toast({
        title: "No pudimos enviar tu registro",
        description: "Intenta de nuevo en un momento.",
        variant: "destructive",
      });
      return;
    }

    setStatus("success");
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-gold/30 bg-white/5 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-gold mx-auto mb-4" />
        <p className="font-display text-xl font-semibold mb-2">Quedaste registrado</p>
        <p className="font-body text-white/70 text-sm">
          Un asesor de Q+ Inmobiliaria te escribirá por celular o correo con
          el detalle de las propiedades privadas.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border border-gold/30 bg-white p-6 md:p-8 text-foreground"
    >
      <h3 className="font-display text-xl font-semibold mb-1">Solicita acceso</h3>
      <p className="font-body text-sm text-muted-foreground mb-6">
        Completa tus datos para desbloquear el detalle de estas propiedades.
      </p>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="pl-nombre">Nombre completo</Label>
          <Input id="pl-nombre" name="nombre" autoComplete="name" />
          {errors.nombre && <p className="text-xs text-destructive">{errors.nombre}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pl-identificacion">Número de identificación</Label>
          <Input id="pl-identificacion" name="identificacion" />
          {errors.identificacion && (
            <p className="text-xs text-destructive">{errors.identificacion}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pl-celular">Celular</Label>
          <Input id="pl-celular" name="celular" type="tel" autoComplete="tel" />
          {errors.celular && <p className="text-xs text-destructive">{errors.celular}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pl-correo">Correo electrónico</Label>
          <Input id="pl-correo" name="correo" type="email" autoComplete="email" />
          {errors.correo && <p className="text-xs text-destructive">{errors.correo}</p>}
        </div>

        <div className="flex items-start gap-2.5 pt-1">
          <Checkbox
            id="pl-consiente"
            checked={consiente}
            onCheckedChange={(checked) => setConsiente(checked === true)}
            className="mt-0.5"
          />
          <Label htmlFor="pl-consiente" className="font-normal text-xs text-muted-foreground leading-relaxed">
            Autorizo a Q+ Inmobiliaria a tratar mis datos personales conforme
            a la Ley 1581 de 2012 (Habeas Data) para ser contactado o
            contactada sobre propiedades privadas. Puedo solicitar la
            actualización o eliminación de mis datos escribiendo a
            qplusinmobiliaria@gmail.com.
          </Label>
        </div>
        {errors.consiente && <p className="text-xs text-destructive">{errors.consiente}</p>}

        <Button type="submit" className="w-full bg-gold hover:bg-gold-dark text-foreground font-semibold" disabled={status === "submitting"}>
          {status === "submitting" ? "Enviando..." : "Solicitar acceso"}
        </Button>
      </div>
    </form>
  );
}
