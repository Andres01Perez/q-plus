import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PropertyData {
  title: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_m2: number | null;
  city: string;
  neighborhood: string;
}

interface DescriptionAIButtonProps {
  currentDescription: string;
  propertyData: PropertyData;
  onDescriptionGenerated: (description: string) => void;
}

export function DescriptionAIButton({
  currentDescription,
  propertyData,
  onDescriptionGenerated,
}: DescriptionAIButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!propertyData.title) {
      toast({
        title: "Información requerida",
        description: "Por favor ingresa al menos el título de la propiedad",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-description", {
        body: {
          currentDescription,
          propertyData,
        },
      });

      if (error) {
        console.error("Edge function error:", error);
        
        // Handle rate limiting
        if (error.message?.includes("429") || error.message?.includes("rate")) {
          toast({
            title: "Límite alcanzado",
            description: "Por favor espera un momento e intenta de nuevo",
            variant: "destructive",
          });
          return;
        }

        throw error;
      }

      if (data?.description) {
        onDescriptionGenerated(data.description);
        toast({
          title: "Descripción generada",
          description: "La descripción ha sido mejorada con IA",
        });
      }
    } catch (error) {
      console.error("Error generating description:", error);
      toast({
        title: "Error",
        description: "No se pudo generar la descripción. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleGenerate}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generando...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 mr-2" />
          {currentDescription ? "Mejorar con IA" : "Generar con IA"}
        </>
      )}
    </Button>
  );
}
