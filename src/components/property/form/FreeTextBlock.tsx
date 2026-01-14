import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Attribute } from "@/types/property";

interface FreeTextBlockProps {
  attributes: Attribute[];
  values: Record<string, string>;
  onChange: (attributeId: string, value: string) => void;
}

export function FreeTextBlock({ attributes, values, onChange }: FreeTextBlockProps) {
  // For free_text blocks, we typically have one main textarea
  // but support multiple if configured
  return (
    <div className="space-y-4">
      {attributes.map((attr) => {
        const value = values[attr.id] || "";
        
        return (
          <div key={attr.id} className="space-y-2">
            <Label htmlFor={`attr-${attr.id}`}>
              {attr.name}
              {attr.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              id={`attr-${attr.id}`}
              value={value}
              onChange={(e) => onChange(attr.id, e.target.value)}
              placeholder={`Escribe ${attr.name.toLowerCase()}...`}
              className="min-h-[120px] resize-y"
              rows={5}
            />
          </div>
        );
      })}
    </div>
  );
}
