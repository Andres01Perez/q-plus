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

    const systemPrompt = `Eres un experto redactor de anuncios inmobiliarios en español para Colombia. 
Tu objetivo es crear descripciones atractivas, profesionales y persuasivas que destaquen las mejores características de las propiedades.

Reglas:
- Escribe en español colombiano profesional
- Usa un tono cálido pero formal
- Destaca beneficios, no solo características
- Mantén la descripción entre 150-250 palabras
- Incluye llamadas a la acción sutiles
- No uses emojis
- No inventes características que no se mencionen`;

    const userPrompt = currentDescription
      ? `Mejora la siguiente descripción de propiedad inmobiliaria, haciéndola más atractiva y profesional.

Datos de la propiedad:
${propertyContext}

Descripción actual:
${currentDescription}

Por favor, mejora esta descripción manteniendo los datos reales.`
      : `Genera una descripción atractiva y profesional para la siguiente propiedad inmobiliaria.

Datos de la propiedad:
${propertyContext}

Crea una descripción que destaque los beneficios de vivir en esta propiedad.`;

    console.log("Calling Lovable AI gateway...");

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

    console.log("Description generated successfully");

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
