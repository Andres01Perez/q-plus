import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Attribute } from "@/types/property";

interface ChecklistBlockProps {
  attributes: Attribute[];
  values: Record<string, string>;
  onChange: (attributeId: string, value: string) => void;
}

export function ChecklistBlock({ attributes, values, onChange }: ChecklistBlockProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {attributes.map((attr) => {
        const isChecked = values[attr.id] === "true";
        
        return (
          <div key={attr.id} className="flex items-center space-x-3">
            <Checkbox
              id={`attr-${attr.id}`}
              checked={isChecked}
              onCheckedChange={(checked) => {
                onChange(attr.id, checked ? "true" : "false");
              }}
            />
            <Label
              htmlFor={`attr-${attr.id}`}
              className="text-sm font-normal cursor-pointer"
            >
              {attr.name}
              {attr.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
          </div>
        );
      })}
    </div>
  );
}
