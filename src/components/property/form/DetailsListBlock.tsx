import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Attribute } from "@/types/property";

interface DetailsListBlockProps {
  attributes: Attribute[];
  values: Record<string, string>;
  onChange: (attributeId: string, value: string) => void;
}

export function DetailsListBlock({ attributes, values, onChange }: DetailsListBlockProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {attributes.map((attr) => {
        const value = values[attr.id] || "";
        
        return (
          <div key={attr.id} className="space-y-2">
            <Label htmlFor={`attr-${attr.id}`}>
              {attr.name}
              {attr.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
            
            {attr.input_type === "textarea" ? (
              <Textarea
                id={`attr-${attr.id}`}
                value={value}
                onChange={(e) => onChange(attr.id, e.target.value)}
                placeholder={`Ingresa ${attr.name.toLowerCase()}`}
                className="resize-none"
                rows={3}
              />
            ) : (
              <Input
                id={`attr-${attr.id}`}
                type={attr.input_type === "number" ? "number" : "text"}
                value={value}
                onChange={(e) => onChange(attr.id, e.target.value)}
                placeholder={`Ingresa ${attr.name.toLowerCase()}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
