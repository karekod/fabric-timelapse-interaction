
import { Canvas, Rect, Circle, IText, Image as FabricImage } from "fabric";
import { Template } from "@/types/sidebar";
import { toast } from "sonner";

interface CreatedElement {
  id: string;
  type: string;
  name: string;
}

export const createTemplateElements = (canvas: Canvas | null, templateId: string, templates: Template[]): CreatedElement[] => {
  if (!canvas) return [];
  
  const templateData = templates.find(t => t.id === templateId);
  if (!templateData) return [];
  
  const createdElements: CreatedElement[] = [];
  
  if (templateData.type === 'presentation') {
    // Create a heading text
    const text = new IText(`Heading for ${templateData.name}`, {
      left: 100,
      top: 100,
      fill: "#ffffff",
      fontFamily: "Arial",
      fontSize: 32,
      fontWeight: "bold"
    });
    text.customId = crypto.randomUUID();
    canvas.add(text);
    createdElements.push({id: text.customId, type: 'text', name: 'Heading'});
  } else if (templateData.type === 'social') {
    // Create a rectangle
    const rect = new Rect({
      left: 100,
      top: 100,
      fill: "#ffffff",
      width: 100,
      height: 100,
    });
    rect.customId = crypto.randomUUID();
    canvas.add(rect);
    createdElements.push({id: rect.customId, type: 'shape', name: 'Rectangle'});
    
    // Create a subheading text
    const text = new IText(`Subheading for ${templateData.name}`, {
      left: 100,
      top: 220,
      fill: "#ffffff",
      fontFamily: "Arial",
      fontSize: 24,
      fontWeight: "semibold"
    });
    text.customId = crypto.randomUUID();
    canvas.add(text);
    createdElements.push({id: text.customId, type: 'text', name: 'Subheading'});
  } else if (templateData.type === 'banner') {
    // Create a rectangle
    const rect = new Rect({
      left: 100,
      top: 100,
      fill: "#ffffff",
      width: 200,
      height: 100,
    });
    rect.customId = crypto.randomUUID();
    canvas.add(rect);
    createdElements.push({id: rect.customId, type: 'shape', name: 'Rectangle'});
    
    // Add an image
    FabricImage.fromURL("https://picsum.photos/id/1018/300/200")
      .then((img) => {
        if (img.width && img.width > 300) {
          const scale = 300 / img.width;
          img.scale(scale);
        }
        
        img.set({
          left: 100,
          top: 220,
        });
        
        img.customId = crypto.randomUUID();
        canvas.add(img);
        createdElements.push({id: img.customId, type: 'image', name: 'Image'});
        canvas.renderAll();
      })
      .catch(err => {
        console.error("Error loading image:", err);
      });
  } else if (templateData.type === 'infographic') {
    // Create a circle
    const circle = new Circle({
      left: 100,
      top: 100,
      fill: "#ffffff",
      radius: 50,
    });
    circle.customId = crypto.randomUUID();
    canvas.add(circle);
    createdElements.push({id: circle.customId, type: 'shape', name: 'Circle'});
    
    // Create body text
    const text = new IText(`Body text for ${templateData.name}`, {
      left: 100,
      top: 220,
      fill: "#ffffff",
      fontFamily: "Arial",
      fontSize: 16,
    });
    text.customId = crypto.randomUUID();
    canvas.add(text);
    createdElements.push({id: text.customId, type: 'text', name: 'Body Text'});
  }
  
  canvas.renderAll();
  return createdElements;
};

export const createAnimationLayers = (templateId: string, templates: Template[], createdElements: CreatedElement[]) => {
  const templateData = templates.find(t => t.id === templateId);
  if (!templateData || !templateData.animations) return [];
  
  const animationLayers = [];
  
  templateData.animations.forEach((anim, index) => {
    if (createdElements[index]) {
      const element = createdElements[index];
      const layer = {
        id: crypto.randomUUID(),
        elementId: element.id,
        name: element.name,
        keyframes: [{
          id: crypto.randomUUID(),
          startTime: anim.startTime,
          duration: anim.duration,
          animationType: anim.animationType,
          properties: {},
          effects: [], // Add empty effects array for compatibility
        }],
      };
      animationLayers.push(layer);
    }
  });
  
  return animationLayers;
};
