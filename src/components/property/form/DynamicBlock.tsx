import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChecklistBlock } from "./ChecklistBlock";
import { DetailsListBlock } from "./DetailsListBlock";
import { FreeTextBlock } from "./FreeTextBlock";
import type { BlockWithAttributes } from "@/types/property";
import { icons } from "lucide-react";

interface DynamicBlockProps {
  block: BlockWithAttributes;
  values: Record<string, string>;
  onChange: (attributeId: string, value: string) => void;
}

// Convert kebab-case to PascalCase for icon lookup
function getIconComponent(iconName: string | null) {
  if (!iconName) return null;
  
  // Convert kebab-case to PascalCase (e.g., "map-pin" -> "MapPin")
  const pascalCase = iconName
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  
  return icons[pascalCase as keyof typeof icons] || null;
}

export function DynamicBlock({ block, values, onChange }: DynamicBlockProps) {
  if (block.attributes.length === 0) {
    return null;
  }

  const renderBlockContent = () => {
    switch (block.type) {
      case "checklist":
        return (
          <ChecklistBlock
            attributes={block.attributes}
            values={values}
            onChange={onChange}
          />
        );
      case "details_list":
        return (
          <DetailsListBlock
            attributes={block.attributes}
            values={values}
            onChange={onChange}
          />
        );
      case "free_text":
        return (
          <FreeTextBlock
            attributes={block.attributes}
            values={values}
            onChange={onChange}
          />
        );
      default:
        return null;
    }
  };

  const IconComponent = getIconComponent(block.icon);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          {IconComponent && <IconComponent className="h-5 w-5" />}
          {block.name}
        </CardTitle>
      </CardHeader>
      <CardContent>{renderBlockContent()}</CardContent>
    </Card>
  );
}
