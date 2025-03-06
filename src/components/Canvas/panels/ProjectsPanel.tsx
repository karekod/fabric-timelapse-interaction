
import { Canvas as FabricCanvas, IText, Rect, Image as FabricImage } from "fabric";
import { PanelProps } from "@/types/sidebar";
import { Project } from "@/types/sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ProjectsPanel = ({ canvas }: PanelProps) => {
  const savedProjects: Project[] = [
    {
      id: "project1",
      name: "My Animation Project",
      thumbnail: "https://picsum.photos/id/1005/500/300",
      lastEdited: "2023-09-15T10:30:00Z",
      elements: [
        { type: "text", properties: { text: "Sample Title", fontSize: 32 } },
        { type: "shape", properties: { type: "rectangle", fill: "#FF5733" } }
      ],
      animations: [
        {
          elementType: "text",
          animationType: "move",
          startTime: 10,
          duration: 30
        },
        {
          elementType: "shape",
          animationType: "scale",
          startTime: 40,
          duration: 20
        }
      ]
    },
    {
      id: "project2",
      name: "Product Showcase",
      thumbnail: "https://picsum.photos/id/1011/500/300",
      lastEdited: "2023-09-10T14:45:00Z",
      elements: [
        { type: "image", properties: { src: "https://picsum.photos/id/1011/500/300" } },
        { type: "text", properties: { text: "Our New Product", fontSize: 24 } }
      ],
      animations: [
        {
          elementType: "image",
          animationType: "fade",
          startTime: 5,
          duration: 25
        },
        {
          elementType: "text",
          animationType: "move",
          startTime: 30,
          duration: 20
        }
      ]
    }
  ];

  const loadProject = (projectId: string) => {
    if (!canvas) return;
    
    canvas.clear();
    
    const projectData = savedProjects.find(p => p.id === projectId);
    if (projectData) {
      toast.success(`Loading project: ${projectData.name}`);
      
      let createdElements: {id: string, type: string, name: string}[] = [];
      
      projectData.elements.forEach((element, index) => {
        if (element.type === 'text') {
          const text = new IText(element.properties.text, {
            left: 100,
            top: 100,
            fill: "#ffffff",
            fontSize: element.properties.fontSize,
          });
          text.customId = crypto.randomUUID();
          canvas.add(text);
          createdElements.push({id: text.customId, type: 'text', name: `Text ${index + 1}`});
        } else if (element.type === 'shape' && element.properties.type === 'rectangle') {
          const rect = new Rect({
            left: 100,
            top: 100,
            fill: element.properties.fill,
            width: 100,
            height: 100,
          });
          rect.customId = crypto.randomUUID();
          canvas.add(rect);
          createdElements.push({id: rect.customId, type: 'shape', name: `Shape ${index + 1}`});
        } else if (element.type === 'image' && element.properties.src) {
          addExampleImage(element.properties.src);
        }
      });
      
      if (projectData.animations && window.parent.postMessage) {
        const animationLayers = [];
        
        projectData.animations.forEach((anim, index) => {
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
        
        toast.success("Project animations added to timeline");
      }
      
      canvas.renderAll();
    }
  };

  const addExampleImage = (url: string) => {
    if (!canvas) return;
    
    FabricImage.fromURL(url)
      .then((img) => {
        if (img.width && img.width > 300) {
          const scale = 300 / img.width;
          img.scale(scale);
        }
        
        img.set({
          left: 100,
          top: 100,
        });
        
        img.customId = crypto.randomUUID();
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      })
      .catch(err => {
        console.error("Error loading image:", err);
        toast.error("Failed to load image");
      });
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-neutral-500 mb-4">SAVED PROJECTS</div>
      <div className="grid grid-cols-2 gap-3">
        {savedProjects.map(project => (
          <div 
            key={project.id}
            onClick={() => loadProject(project.id)}
            className="border border-neutral-700 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-colors shadow-sm hover:shadow-md"
          >
            <div className="h-24 relative">
              <img 
                src={project.thumbnail} 
                alt={project.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors">
                <span className="text-white font-bold text-sm">{project.name}</span>
              </div>
            </div>
            <div className="p-2 bg-neutral-800/50">
              <div className="text-xs text-center text-neutral-300">
                Last edited: {new Date(project.lastEdited).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Button 
        variant="default" 
        className="w-full"
        onClick={() => toast.info("Creating new project feature will be implemented soon")}
      >
        New Project
      </Button>
    </div>
  );
};
