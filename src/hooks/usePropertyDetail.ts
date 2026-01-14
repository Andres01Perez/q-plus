import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PropertyWithMedia, BlockWithAttributes, PropertyValue } from "@/types/property";

export interface PropertyDetailData {
  property: PropertyWithMedia | null;
  blocks: BlockWithAttributes[];
  propertyValues: Record<string, string>;
}

export const usePropertyDetail = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["property-detail", slug],
    queryFn: async (): Promise<PropertyDetailData> => {
      if (!slug) {
        return { property: null, blocks: [], propertyValues: {} };
      }

      // Fetch property with media
      const { data: property, error: propertyError } = await supabase
        .from("properties")
        .select(`
          *,
          property_media (id, url, type, caption, is_main, display_order, provider)
        `)
        .eq("slug", slug)
        .neq("status", "draft")
        .maybeSingle();

      if (propertyError) throw propertyError;
      if (!property) {
        return { property: null, blocks: [], propertyValues: {} };
      }

      // Sort media by display_order, main image first
      const sortedMedia = [...(property.property_media || [])].sort((a, b) => {
        if (a.is_main && !b.is_main) return -1;
        if (!a.is_main && b.is_main) return 1;
        return (a.display_order || 0) - (b.display_order || 0);
      });

      // Fetch active blocks with attributes
      const { data: blocks, error: blocksError } = await supabase
        .from("blocks")
        .select(`
          *,
          attributes (*)
        `)
        .eq("is_active", true)
        .order("display_order");

      if (blocksError) throw blocksError;

      // Sort attributes within each block
      const sortedBlocks = (blocks || []).map(block => ({
        ...block,
        attributes: [...(block.attributes || [])].sort(
          (a, b) => (a.display_order || 0) - (b.display_order || 0)
        ),
      }));

      // Fetch property values
      const { data: values, error: valuesError } = await supabase
        .from("property_values")
        .select("*")
        .eq("property_id", property.id);

      if (valuesError) throw valuesError;

      // Create a map of attribute_id -> value
      const propertyValues: Record<string, string> = {};
      (values || []).forEach((v: PropertyValue) => {
        propertyValues[v.attribute_id] = v.value || "";
      });

      return {
        property: { ...property, property_media: sortedMedia } as PropertyWithMedia,
        blocks: sortedBlocks as BlockWithAttributes[],
        propertyValues,
      };
    },
    enabled: !!slug,
  });
};
