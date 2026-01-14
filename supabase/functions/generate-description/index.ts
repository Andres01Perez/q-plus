import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PropertyData {
  title: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_m2: number | null;
  city: string;
  neighborhood: string;
}

interface RequestBody {
  currentDescription: string;
  propertyData: PropertyData;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { currentDescription, propertyData }: RequestBody = await req.json();

    // Build context from property data
    const propertyContext = [
      `Título: ${propertyData.title}`,
      propertyData.bedrooms ? `Habitaciones: ${propertyData.bedrooms}` : null,
      propertyData.bathrooms ? `Baños: ${propertyData.bathrooms}` : null,
      propertyData.area_m2 ? `Área: ${propertyData.area_m2}m²` : null,
      propertyData.city ? `Ciudad: ${propertyData.city}` : null,
      propertyData.neighborhood ? `Barrio: ${propertyData.neighborhood}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const systemPrompt = `Eres un copywriter experto en anuncios inmobiliarios para Colombia.
Tu objetivo es crear descripciones CORTAS, IMPACTANTES y que vendan.

REGLAS ESTRICTAS:
- Máximo 80-100 palabras
- Primera oración debe ser un GANCHO IRRESISTIBLE que capture atención inmediata
- Usa verbos de acción: "Vive", "Disfruta", "Descubre", "Imagina"
- Destaca el BENEFICIO PRINCIPAL inmediatamente
- Evita palabras genéricas como "bonito", "lindo", "agradable"
- Usa adjetivos poderosos: "Espectacular", "Exclusivo", "Privilegiado", "Impactante"
- Incluye una frase de cierre que invite a la acción
- NO uses emojis
- NO uses listas con viñetas
- NO inventes características que no se mencionen
- Español colombiano profesional

ESTRUCTURA IDEAL:
[Gancho irresistible - 1 oración] + [2-3 beneficios clave] + [Cierre con llamada a acción sutil]

EJEMPLO DE TONO:
"Despierta cada mañana con una vista que te quita el aliento. Este espectacular apartamento en el corazón de [zona] combina acabados de lujo con la ubicación más privilegiada de la ciudad. Agenda tu visita y enamórate."`;

    const userPrompt = currentDescription
      ? `Mejora esta descripción haciéndola MÁS CORTA (máximo 100 palabras), más impactante y con un gancho inicial irresistible.

Datos de la propiedad:
${propertyContext}

Descripción actual:
${currentDescription}

Reescribe de forma más vendedora y concisa. El primer impacto lo es todo.`
      : `Crea una descripción de venta CORTA (máximo 100 palabras) e IMPACTANTE para esta propiedad:

${propertyContext}

Recuerda: Primera oración = gancho que atrape. Sé directo, persuasivo y vendedor.`;

    console.log("Calling Lovable AI gateway for short description...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const description = data.choices?.[0]?.message?.content?.trim();

    if (!description) {
      throw new Error("No description generated");
    }

    console.log("Short description generated successfully");

    return new Response(
      JSON.stringify({ description }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-description:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
