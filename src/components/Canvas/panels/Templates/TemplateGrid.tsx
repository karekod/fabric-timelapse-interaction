
import { Canvas as FabricCanvas } from "fabric";
import { Template } from "@/types/sidebar";
import { TemplateItem } from "./TemplateItem";

interface TemplateGridProps {
  templates: Template[];
  canvas: FabricCanvas | null;
  onSelect: (templateId: string) => void;
}

export const TemplateGrid = ({ templates, canvas, onSelect }: TemplateGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {templates.map(template => (
        <TemplateItem 
          key={template.id}
          template={template} 
          canvas={canvas} 
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};
