import type { Database } from "@/integrations/supabase/types";

// Base types from database
export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type PropertyInsert = Database["public"]["Tables"]["properties"]["Insert"];
export type PropertyUpdate = Database["public"]["Tables"]["properties"]["Update"];

export type PrivateListingLead = Database["public"]["Tables"]["private_listing_leads"]["Row"];
export type PrivateListingLeadInsert = Database["public"]["Tables"]["private_listing_leads"]["Insert"];

export type Block = Database["public"]["Tables"]["blocks"]["Row"];
export type Attribute = Database["public"]["Tables"]["attributes"]["Row"];
export type PropertyValue = Database["public"]["Tables"]["property_values"]["Row"];
export type PropertyMedia = Database["public"]["Tables"]["property_media"]["Row"];

export type BlockType = Database["public"]["Enums"]["block_type"];
export type InputType = Database["public"]["Enums"]["input_type"];
export type PropertyStatus = Database["public"]["Enums"]["property_status"];
export type MediaType = Database["public"]["Enums"]["media_type"];
export type PriceDisplayMode = Database["public"]["Enums"]["price_display_mode"];

// Extended types with relations
export interface BlockWithAttributes extends Block {
  attributes: Attribute[];
}

export interface PropertyWithMedia extends Property {
  property_media: PropertyMedia[];
}

// Form data types
export interface PropertyFormData {
  // Fixed fields
  title: string;
  slug: string;
  main_description: string;
  price_sale: number | null;
  price_rent: number | null;
  display_price_mode: PriceDisplayMode;
  address: string;
  city: string;
  neighborhood: string;
  lat: number | null;
  lng: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_m2: number | null;
  status: PropertyStatus;
  is_private: boolean;

  // Dynamic values - indexed by attribute_id
  dynamicValues: Record<string, string>;
}

export interface DynamicFieldValue {
  attribute_id: string;
  value: string;
}

// Media form types
export interface MediaFormItem {
  id?: string;
  url: string;
  type: MediaType;
  caption: string;
  provider: string;
  is_main: boolean;
  display_order: number;
}

// Default form values
export const defaultPropertyFormData: PropertyFormData = {
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
  is_private: false,
  dynamicValues: {},
};
