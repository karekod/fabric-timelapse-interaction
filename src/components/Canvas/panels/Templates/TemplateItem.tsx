
import { Canvas as FabricCanvas } from "fabric";
import { Template } from "@/types/sidebar";
import { toast } from "sonner";

interface TemplateItemProps {
  template: Template;
  canvas: FabricCanvas | null;
  onSelect: (templateId: string) => void;
}

export const TemplateItem = ({ template, canvas, onSelect }: TemplateItemProps) => {
  return (
    <div 
      key={template.id}
      onClick={() => onSelect(template.id)}
      className="border border-neutral-700 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-colors shadow-sm hover:shadow-md"
    >
      <div className="h-24 relative">
        <img 
          src={template.thumbnail} 
          alt={template.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors">
          <span className="text-white font-bold text-sm">{template.name}</span>
        </div>
      </div>
      <div className="p-2 bg-neutral-800/50">
        <div className="text-xs text-center text-neutral-300">{template.type}</div>
      </div>
    </div>
  );
};
