import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { BlockWithAttributes, Block, Attribute, BlockType, InputType } from "@/types/property";

export interface BlockFormData {
  name: string;
  type: BlockType;
  icon: string | null;
  display_order: number;
  is_active: boolean;
}

export interface AttributeFormData {
  name: string;
  input_type: InputType;
  is_required: boolean;
  display_order: number;
}

export function useBlocksConfig() {
  const [blocks, setBlocks] = useState<BlockWithAttributes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchBlocks = async () => {
    setIsLoading(true);
    try {
      const { data: blocksData, error: blocksError } = await supabase
        .from("blocks")
        .select("*")
        .order("display_order", { ascending: true });

      if (blocksError) throw blocksError;

      const { data: attributesData, error: attributesError } = await supabase
        .from("attributes")
        .select("*")
        .order("display_order", { ascending: true });

      if (attributesError) throw attributesError;

      const blocksWithAttributes: BlockWithAttributes[] = (blocksData || []).map((block) => ({
        ...block,
        attributes: (attributesData || []).filter((attr) => attr.block_id === block.id),
      }));

      setBlocks(blocksWithAttributes);
    } catch (error) {
      console.error("Error fetching blocks:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los bloques",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const createBlock = async (data: BlockFormData) => {
    try {
      const { error } = await supabase.from("blocks").insert({
        name: data.name,
        type: data.type,
        icon: data.icon || null,
        display_order: data.display_order,
        is_active: data.is_active,
      });

      if (error) throw error;

      toast({
        title: "Bloque creado",
        description: `El bloque "${data.name}" se creó correctamente`,
      });

      await fetchBlocks();
      return true;
    } catch (error) {
      console.error("Error creating block:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el bloque",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateBlock = async (id: string, data: BlockFormData) => {
    try {
      const { error } = await supabase
        .from("blocks")
        .update({
          name: data.name,
          type: data.type,
          icon: data.icon || null,
          display_order: data.display_order,
          is_active: data.is_active,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Bloque actualizado",
        description: `El bloque "${data.name}" se actualizó correctamente`,
      });

      await fetchBlocks();
      return true;
    } catch (error) {
      console.error("Error updating block:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el bloque",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteBlock = async (id: string, blockName: string) => {
    try {
      // First delete all property_values for attributes in this block
      const { data: attributes } = await supabase
        .from("attributes")
        .select("id")
        .eq("block_id", id);

      if (attributes && attributes.length > 0) {
        const attributeIds = attributes.map((a) => a.id);
        await supabase
          .from("property_values")
          .delete()
          .in("attribute_id", attributeIds);
      }

      // Delete all attributes in this block
      await supabase.from("attributes").delete().eq("block_id", id);

      // Finally delete the block
      const { error } = await supabase.from("blocks").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Bloque eliminado",
        description: `El bloque "${blockName}" se eliminó correctamente`,
      });

      await fetchBlocks();
      return true;
    } catch (error) {
      console.error("Error deleting block:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el bloque",
        variant: "destructive",
      });
      return false;
    }
  };

  const createAttribute = async (blockId: string, data: AttributeFormData) => {
    try {
      const { error } = await supabase.from("attributes").insert({
        block_id: blockId,
        name: data.name,
        input_type: data.input_type,
        is_required: data.is_required,
        display_order: data.display_order,
      });

      if (error) throw error;

      toast({
        title: "Atributo creado",
        description: `El atributo "${data.name}" se creó correctamente`,
      });

      await fetchBlocks();
      return true;
    } catch (error) {
      console.error("Error creating attribute:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el atributo",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateAttribute = async (id: string, data: AttributeFormData) => {
    try {
      const { error } = await supabase
        .from("attributes")
        .update({
          name: data.name,
          input_type: data.input_type,
          is_required: data.is_required,
          display_order: data.display_order,
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Atributo actualizado",
        description: `El atributo "${data.name}" se actualizó correctamente`,
      });

      await fetchBlocks();
      return true;
    } catch (error) {
      console.error("Error updating attribute:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el atributo",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteAttribute = async (id: string, attrName: string) => {
    try {
      // First delete all property_values for this attribute
      await supabase.from("property_values").delete().eq("attribute_id", id);

      // Then delete the attribute
      const { error } = await supabase.from("attributes").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Atributo eliminado",
        description: `El atributo "${attrName}" se eliminó correctamente`,
      });

      await fetchBlocks();
      return true;
    } catch (error) {
      console.error("Error deleting attribute:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el atributo",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    blocks,
    isLoading,
    fetchBlocks,
    createBlock,
    updateBlock,
    deleteBlock,
    createAttribute,
    updateAttribute,
    deleteAttribute,
  };
}
