import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChecklistBlock } from "./ChecklistBlock";
import { DetailsListBlock } from "./DetailsListBlock";
import { FreeTextBlock } from "./FreeTextBlock";
import type { BlockWithAttributes } from "@/types/property";

interface DynamicBlockProps {
  block: BlockWithAttributes;
  values: Record<string, string>;
  onChange: (attributeId: string, value: string) => void;
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

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          {block.icon && <span>{block.icon}</span>}
          {block.name}
        </CardTitle>
      </CardHeader>
      <CardContent>{renderBlockContent()}</CardContent>
    </Card>
  );
}
