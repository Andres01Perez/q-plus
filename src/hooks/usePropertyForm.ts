import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type {
  BlockWithAttributes,
  PropertyFormData,
  PropertyValue,
  PropertyMedia,
  MediaFormItem,
  defaultPropertyFormData,
} from "@/types/property";

interface UsePropertyFormOptions {
  propertyId?: string;
}

interface UsePropertyFormReturn {
  // Data
  blocks: BlockWithAttributes[];
  formData: PropertyFormData;
  mediaItems: MediaFormItem[];
  existingPropertyValues: PropertyValue[];
  
  // Loading states
  isLoadingBlocks: boolean;
  isLoadingProperty: boolean;
  isSaving: boolean;
  
  // Actions
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  setMediaItems: React.Dispatch<React.SetStateAction<MediaFormItem[]>>;
  updateField: <K extends keyof PropertyFormData>(field: K, value: PropertyFormData[K]) => void;
  updateDynamicValue: (attributeId: string, value: string) => void;
  saveProperty: () => Promise<string | null>;
  generateSlug: (title: string) => string;
}

export function usePropertyForm({ propertyId }: UsePropertyFormOptions = {}): UsePropertyFormReturn {
  const { toast } = useToast();
  
  // State
  const [blocks, setBlocks] = useState<BlockWithAttributes[]>([]);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    slug: "",
    main_description: "",
    price_sale: null,
    price_rent: null,
    display_price_mode: "sale",
    address: "",
    city: "",
    neighborhood: "",
    lat: null,
    lng: null,
    bedrooms: null,
    bathrooms: null,
    area_m2: null,
    status: "draft",
    dynamicValues: {},
  });
  const [mediaItems, setMediaItems] = useState<MediaFormItem[]>([]);
  const [existingPropertyValues, setExistingPropertyValues] = useState<PropertyValue[]>([]);
  
  // Loading states
  const [isLoadingBlocks, setIsLoadingBlocks] = useState(true);
  const [isLoadingProperty, setIsLoadingProperty] = useState(!!propertyId);
  const [isSaving, setIsSaving] = useState(false);

  // Load blocks with attributes
  useEffect(() => {
    async function loadBlocks() {
      try {
        const { data: blocksData, error: blocksError } = await supabase
          .from("blocks")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (blocksError) throw blocksError;

        const { data: attributesData, error: attrsError } = await supabase
          .from("attributes")
          .select("*")
          .order("display_order", { ascending: true });

        if (attrsError) throw attrsError;

        // Combine blocks with their attributes
        const blocksWithAttrs: BlockWithAttributes[] = (blocksData || []).map((block) => ({
          ...block,
          attributes: (attributesData || []).filter((attr) => attr.block_id === block.id),
        }));

        setBlocks(blocksWithAttrs);
      } catch (error) {
        console.error("Error loading blocks:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los bloques de configuración",
          variant: "destructive",
        });
      } finally {
        setIsLoadingBlocks(false);
      }
    }

    loadBlocks();
  }, [toast]);

  // Load existing property if editing
  useEffect(() => {
    if (!propertyId) {
      setIsLoadingProperty(false);
      return;
    }

    async function loadProperty() {
      try {
        // Load property data
        const { data: property, error: propError } = await supabase
          .from("properties")
          .select("*")
          .eq("id", propertyId)
          .single();

        if (propError) throw propError;

        // Load property values
        const { data: values, error: valuesError } = await supabase
          .from("property_values")
          .select("*")
          .eq("property_id", propertyId);

        if (valuesError) throw valuesError;

        // Load media
        const { data: media, error: mediaError } = await supabase
          .from("property_media")
          .select("*")
          .eq("property_id", propertyId)
          .order("display_order", { ascending: true });

        if (mediaError) throw mediaError;

        // Build dynamic values map
        const dynamicValues: Record<string, string> = {};
        (values || []).forEach((v) => {
          dynamicValues[v.attribute_id] = v.value || "";
        });

        setFormData({
          title: property.title || "",
          slug: property.slug || "",
          main_description: property.main_description || "",
          price_sale: property.price_sale ? Number(property.price_sale) : null,
          price_rent: property.price_rent ? Number(property.price_rent) : null,
          display_price_mode: property.display_price_mode || "sale",
          address: property.address || "",
          city: property.city || "",
          neighborhood: property.neighborhood || "",
          lat: property.lat,
          lng: property.lng,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area_m2: property.area_m2 ? Number(property.area_m2) : null,
          status: property.status || "draft",
          dynamicValues,
        });

        setExistingPropertyValues(values || []);

        setMediaItems(
          (media || []).map((m) => ({
            id: m.id,
            url: m.url,
            type: m.type,
            caption: m.caption || "",
            provider: m.provider || "",
            is_main: m.is_main || false,
            display_order: m.display_order || 0,
          }))
        );
      } catch (error) {
        console.error("Error loading property:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar la propiedad",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProperty(false);
      }
    }

    loadProperty();
  }, [propertyId, toast]);

  // Update single field
  const updateField = useCallback(<K extends keyof PropertyFormData>(
    field: K,
    value: PropertyFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Update dynamic value
  const updateDynamicValue = useCallback((attributeId: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      dynamicValues: {
        ...prev.dynamicValues,
        [attributeId]: value,
      },
    }));
  }, []);

  // Generate slug from title
  const generateSlug = useCallback((title: string): string => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }, []);

  // Save property
  const saveProperty = useCallback(async (): Promise<string | null> => {
    setIsSaving(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Debes iniciar sesión para guardar propiedades",
          variant: "destructive",
        });
        return null;
      }

      // Prepare property data
      const propertyData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        main_description: formData.main_description || null,
        price_sale: formData.price_sale,
        price_rent: formData.price_rent,
        display_price_mode: formData.display_price_mode,
        address: formData.address || null,
        city: formData.city || null,
        neighborhood: formData.neighborhood || null,
        lat: formData.lat,
        lng: formData.lng,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        area_m2: formData.area_m2,
        status: formData.status,
        created_by: user.id,
      };

      let savedPropertyId: string;

      if (propertyId) {
        // Update existing property
        const { error } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", propertyId);

        if (error) throw error;
        savedPropertyId = propertyId;
      } else {
        // Create new property
        const { data, error } = await supabase
          .from("properties")
          .insert(propertyData)
          .select("id")
          .single();

        if (error) throw error;
        savedPropertyId = data.id;
      }

      // Handle property values (upsert)
      const valuesToUpsert = Object.entries(formData.dynamicValues)
        .filter(([, value]) => value !== "" && value !== "false")
        .map(([attributeId, value]) => ({
          property_id: savedPropertyId,
          attribute_id: attributeId,
          value: value === "true" ? "true" : value,
        }));

      // Delete old values first, then insert new ones
      if (propertyId) {
        await supabase
          .from("property_values")
          .delete()
          .eq("property_id", savedPropertyId);
      }

      if (valuesToUpsert.length > 0) {
        const { error: valuesError } = await supabase
          .from("property_values")
          .insert(valuesToUpsert);

        if (valuesError) throw valuesError;
      }

      // Handle media
      if (propertyId) {
        await supabase
          .from("property_media")
          .delete()
          .eq("property_id", savedPropertyId);
      }

      if (mediaItems.length > 0) {
        const mediaToInsert = mediaItems.map((item, index) => ({
          property_id: savedPropertyId,
          url: item.url,
          type: item.type,
          caption: item.caption || null,
          provider: item.provider || null,
          is_main: item.is_main,
          display_order: index,
        }));

        const { error: mediaError } = await supabase
          .from("property_media")
          .insert(mediaToInsert);

        if (mediaError) throw mediaError;
      }

      toast({
        title: "Éxito",
        description: propertyId ? "Propiedad actualizada correctamente" : "Propiedad creada correctamente",
      });

      return savedPropertyId;
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Error",
        description: "No se pudo guardar la propiedad",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [formData, mediaItems, propertyId, generateSlug, toast]);

  return {
    blocks,
    formData,
    mediaItems,
    existingPropertyValues,
    isLoadingBlocks,
    isLoadingProperty,
    isSaving,
    setFormData,
    setMediaItems,
    updateField,
    updateDynamicValue,
    saveProperty,
    generateSlug,
  };
}
