
import { Canvas as FabricCanvas } from "fabric";
import { PanelProps } from "@/types/sidebar";
import { TemplateGrid } from "./TemplateGrid";
import { sampleTemplates } from "./TemplateData";
import { createTemplateElements, createAnimationLayers } from "./TemplateCreator";
import { toast } from "sonner";

export const TemplatesPanel = ({ canvas }: PanelProps) => {
  const loadTemplate = (templateId: string) => {
    if (!canvas) return;
    
    canvas.clear();
    
    const templateData = sampleTemplates.find(t => t.id === templateId);
    if (templateData) {
      toast.success(`Loading template: ${templateData.name}`);
      
      const createdElements = createTemplateElements(canvas, templateId, sampleTemplates);
      
      if (templateData.animations && window.parent.postMessage) {
        const animationLayers = createAnimationLayers(templateId, sampleTemplates, createdElements);
        
        window.parent.postMessage({
          type: 'UPDATE_TIMELINE_LAYERS',
          layers: animationLayers
        }, '*');
        
        toast.success("Template animations added to timeline");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-neutral-500 mb-4">TEMPLATE GALLERY</div>
      <TemplateGrid 
        templates={sampleTemplates} 
        canvas={canvas} 
        onSelect={loadTemplate} 
      />
    </div>
  );
};
