
import { Canvas as FabricCanvas, Rect, Circle, IText, Image as FabricImage } from "fabric";
import { PanelProps } from "@/types/sidebar";
import { Template } from "@/types/sidebar";
import { toast } from "sonner";

export const TemplatesPanel = ({ canvas }: PanelProps) => {
  const sampleTemplates: Template[] = [
    {
      id: "template1",
      name: "Basic Presentation",
      type: "presentation",
      thumbnail: "https://picsum.photos/id/1015/300/200",
      preview: "https://picsum.photos/id/1015/300/200",
      animations: [
        {
          elementType: "heading",
          animationType: "fade",
          startTime: 10,
          duration: 20
        }
      ]
    },
    {
      id: "template2",
      name: "Instagram Story",
      type: "social",
      thumbnail: "https://picsum.photos/id/1016/300/200",
      preview: "https://picsum.photos/id/1016/300/200",
      animations: [
        {
          elementType: "rectangle",
          animationType: "scale",
          startTime: 0,
          duration: 15
        },
        {
          elementType: "subheading",
          animationType: "move",
          startTime: 20,
          duration: 25
        }
      ]
    },
    {
      id: "template3",
      name: "YouTube Banner",
      type: "banner",
      thumbnail: "https://picsum.photos/id/1018/300/200",
      preview: "https://picsum.photos/id/1018/300/200",
      animations: [
        {
          elementType: "rectangle",
          animationType: "color",
          startTime: 5,
          duration: 30
        }
      ]
    },
    {
      id: "template4",
      name: "Data Visualization",
      type: "infographic",
      thumbnail: "https://picsum.photos/id/1019/300/200",
      preview: "https://picsum.photos/id/1019/300/200",
      animations: [
        {
          elementType: "circle",
          animationType: "rotate",
          startTime: 0,
          duration: 40
        },
        {
          elementType: "text",
          animationType: "blur",
          startTime: 45,
          duration: 20
        }
      ]
    }
  ];

  const loadTemplate = (templateId: string) => {
    if (!canvas) return;
    
    canvas.clear();
    
    const templateData = sampleTemplates.find(t => t.id === templateId);
    if (templateData) {
      toast.success(`Loading template: ${templateData.name}`);
      
      let createdElements: {id: string, type: string, name: string}[] = [];
      
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
      
      if (templateData.animations && window.parent.postMessage) {
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
              }],
            };
            animationLayers.push(layer);
          }
        });
        
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
      <div className="grid grid-cols-2 gap-3">
        {sampleTemplates.map(template => (
          <div 
            key={template.id}
            onClick={() => loadTemplate(template.id)}
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
        ))}
      </div>
    </div>
  );
};
