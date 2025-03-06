import { 
  FileText, Image, Shapes, FolderOpen, Upload, 
  Play, Settings, Layout, ChevronRight, Layers,
  Move, Maximize2, RotateCw, Palette, Type, 
  ArrowUp, ArrowDown, EyeOff, Eye, Trash2,
} from "lucide-react";
import { useState, useRef } from "react";
import { Canvas as FabricCanvas, Rect, Circle, IText, Image as FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Keyframe, TimelineLayer } from "@/types/animation";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";
import { TextPanel } from "./panels/TextPanel";
import { ShapesPanel } from "./panels/ShapesPanel";
import { LayersPanel } from "./panels/LayersPanel";
import { SidebarMenuButton } from "./SidebarMenuButton";

type MenuSection = 
  | "text" 
  | "image" 
  | "shapes" 
  | "projects" 
  | "uploads" 
  | "animations" 
  | "settings" 
  | "templates"
  | "layers";

interface Template {
  id: string;
  name: string;
  type: string;
  thumbnail: string;
  preview: string;
  animations?: {
    elementType: string;
    animationType: Keyframe['animationType'];
    startTime: number;
    duration: number;
  }[];
}

interface Project {
  id: string;
  name: string;
  thumbnail: string;
  lastEdited: string;
  elements: {
    type: string;
    properties: Record<string, any>;
  }[];
  animations?: {
    elementType: string;
    animationType: Keyframe['animationType'];
    startTime: number;
    duration: number;
  }[];
}

interface SidebarProps {
  canvas: FabricCanvas | null;
}

export const Sidebar = ({ canvas }: SidebarProps) => {
  const [activeSection, setActiveSection] = useState<MenuSection>("text");
  const [timelineLayers, setTimelineLayers] = useState<TimelineLayer[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<{id: string, src: string}[]>([]);
  const [selectedUploadedImage, setSelectedUploadedImage] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [selectedAnimation, setSelectedAnimation] = useState<Keyframe['animationType']>('move');
  const [startTime, setStartTime] = useState("0");
  const [duration, setDuration] = useState("20");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [shapeColor, setShapeColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const imgElement = document.createElement('img');
      imgElement.src = event.target?.result as string;
      
      imgElement.onload = () => {
        const imageId = crypto.randomUUID();
        setUploadedImages(prev => [...prev, {
          id: imageId,
          src: event.target?.result as string
        }]);
        
        toast.success("Image uploaded successfully");
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
    };
    
    reader.readAsDataURL(file);
  };

  const addUploadedImageToCanvas = (imageSrc: string) => {
    if (!canvas) return;
    
    const imgElement = document.createElement('img');
    imgElement.src = imageSrc;
    
    imgElement.onload = () => {
      const fabricImage = new FabricImage(imgElement);
      
      if (fabricImage.width && fabricImage.width > 300) {
        const scale = 300 / fabricImage.width;
        fabricImage.scale(scale);
      }
      
      fabricImage.set({
        left: 100,
        top: 100,
      });
      
      fabricImage.customId = crypto.randomUUID();
      canvas.add(fabricImage);
      canvas.setActiveObject(fabricImage);
      canvas.renderAll();
      toast.success("Image added to canvas");
    };
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

  const validateGeminiApiKey = () => {
    if (!geminiApiKey.trim()) {
      toast.error("Please enter a Gemini API key");
      return;
    }
    
    toast.success("API key saved successfully!");
    localStorage.setItem("gemini_api_key", geminiApiKey);
  };

  const applyColorToSelectedObject = (color: string) => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set('fill', color);
      canvas.renderAll();
      toast.success("Color applied");
    } else {
      toast.error("No object selected");
    }
  };

  const applyFontToSelectedText = () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
      (activeObject as IText).set('fontFamily', fontFamily);
      canvas.renderAll();
      toast.success("Font applied");
    } else {
      toast.error("No text selected");
    }
  };

  const applyFontSizeToSelectedText = () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
      (activeObject as IText).set('fontSize', fontSize);
      canvas.renderAll();
      toast.success("Font size applied");
    } else {
      toast.error("No text selected");
    }
  };

  const addAnimationLayer = (elementId: string, elementName: string, animationType: Keyframe['animationType'], startTime: number, duration: number) => {
    const newLayer: TimelineLayer = {
      id: crypto.randomUUID(),
      elementId: elementId,
      name: elementName,
      keyframes: [{
        id: crypto.randomUUID(),
        startTime: startTime,
        duration: duration,
        animationType: animationType,
        properties: {},
      }],
    };
    
    return newLayer;
  };

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
          fill: textColor,
          fontFamily: fontFamily,
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
          fill: shapeColor,
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
          fill: textColor,
          fontFamily: fontFamily,
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
          fill: shapeColor,
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
          fill: shapeColor,
          radius: 50,
        });
        circle.customId = crypto.randomUUID();
        canvas.add(circle);
        createdElements.push({id: circle.customId, type: 'shape', name: 'Circle'});
        
        // Create body text
        const text = new IText(`Body text for ${templateData.name}`, {
          left: 100,
          top: 220,
          fill: textColor,
          fontFamily: fontFamily,
          fontSize: 16,
        });
        text.customId = crypto.randomUUID();
        canvas.add(text);
        createdElements.push({id: text.customId, type: 'text', name: 'Body Text'});
      }
      
      canvas.renderAll();
      
      if (templateData.animations && window.parent.postMessage) {
        const animationLayers: TimelineLayer[] = [];
        
        templateData.animations.forEach((anim, index) => {
          if (createdElements[index]) {
            const element = createdElements[index];
            const layer = addAnimationLayer(
              element.id,
              element.name,
              anim.animationType,
              anim.startTime,
              anim.duration
            );
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
        const animationLayers: TimelineLayer[] = [];
        
        projectData.animations.forEach((anim, index) => {
          if (createdElements[index]) {
            const element = createdElements[index];
            const layer = addAnimationLayer(
              element.id,
              element.name,
              anim.animationType,
              anim.startTime,
              anim.duration
            );
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

  const moveLayerUp = (layerId: string) => {
    setTimelineLayers(prev => {
      const index = prev.findIndex(layer => layer.id === layerId);
      if (index <= 0) return prev;
      
      const newLayers = [...prev];
      const temp = newLayers[index];
      newLayers[index] = newLayers[index - 1];
      newLayers[index - 1] = temp;
      
      return newLayers;
    });
  };

  const moveLayerDown = (layerId: string) => {
    setTimelineLayers(prev => {
      const index = prev.findIndex(layer => layer.id === layerId);
      if (index === -1 || index === prev.length - 1) return prev;
      
      const newLayers = [...prev];
      const temp = newLayers[index];
      newLayers[index] = newLayers[index + 1];
      newLayers[index + 1] = temp;
      
      return newLayers;
    });
  };

  const toggleLayerVisibility = (layerId: string) => {
    setTimelineLayers(prev => prev.map(layer => {
      if (layer.id === layerId) {
        const isVisible = !layer.isVisible;
        
        if (canvas) {
          const objects = canvas.getObjects();
          const targetObject = objects.find(obj => obj.customId === layer.elementId);
          if (targetObject) {
            targetObject.visible = isVisible;
            canvas.renderAll();
          }
        }
        
        return { ...layer, isVisible };
      }
      return layer;
    }));
  };

  const deleteLayer = (layerId: string) => {
    setTimelineLayers(prev => {
      const layerToDelete = prev.find(layer => layer.id === layerId);
      if (layerToDelete && canvas) {
        const objects = canvas.getObjects();
        const targetObject = objects.find(obj => obj.customId === layerToDelete.elementId);
        if (targetObject) {
          canvas.remove(targetObject);
          canvas.renderAll();
        }
      }
      return prev.filter(layer => layer.id !== layerId);
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case "text":
        return <TextPanel canvas={canvas} />;
      case "shapes":
        return <ShapesPanel canvas={canvas} />;
      case "layers":
        return (
          <LayersPanel 
            canvas={canvas}
            timelineLayers={timelineLayers}
            setTimelineLayers={setTimelineLayers}
          />
        );
      case "image":
        return (
          <div className="space-y-4">
            <div className="text-xs text-neutral-500 mb-4">EXAMPLE IMAGES</div>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => addExampleImage("https://picsum.photos/id/237/200/300")}
                className="bg-neutral-800/50 hover:bg-neutral-800 rounded-lg p-1 h-24 flex items-center justify-center overflow-hidden"
              >
                <img 
                  src="https://picsum.photos/id/237/200/300" 
                  alt="Example dog" 
                  className="max-h-full max-w-full object-contain"
                />
              </button>
              <button 
                onClick={() => addExampleImage("https://picsum.photos/id/1005/200/300")}
                className="bg-neutral-800/50 hover:bg-neutral-800 rounded-lg p-1 h-24 flex items-center justify-center overflow-hidden"
              >
                <img 
                  src="https://picsum.photos/id/1005/200/300" 
                  alt="Example person" 
                  className="max-h-full max-w-full object-contain"
                />
              </button>
              <button 
                onClick={() => addExampleImage("https://picsum.photos/id/1074/200/300")}
                className="bg-neutral-800/50 hover:bg-neutral-800 rounded-lg p-1 h-24 flex items-center justify-center overflow-hidden"
              >
                <img 
                  src="https://picsum.photos/id/1074/200/300" 
                  alt="Example landscape" 
                  className="max-h-full max-w-full object-contain"
                />
              </button>
              <button 
                onClick={() => addExampleImage("https://picsum.photos/id/96/200/300")}
                className="bg-neutral-800/50 hover:bg-neutral-800 rounded-lg p-1 h-24 flex items-center justify-center overflow-hidden"
              >
                <img 
                  src="https://picsum.photos/id/96/200/300" 
                  alt="Example object" 
                  className="max-h-full max-w-full object-contain"
                />
              </button>
            </div>
          </div>
        );

      case "animations":
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="text-xs text-neutral-500">ANIMATION TIME</div>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-neutral-400">Start Time (s)</label>
                  <Input
                    type="number"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full h-8 text-sm text-black"
                    placeholder="Start"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400">Duration (s)</label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full h-8 text-sm text-black"
                    placeholder="Duration"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-xs text-neutral-500">PRESETS</div>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg">
                  Fade In
                </button>
                <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg">
                  Bounce
                </button>
                <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg">
                  Slide In
                </button>
              </div>
            </div>
          </div>
        );

      case "uploads":
        return (
          <div className="space-y-4">
            <div className="text-xs text-neutral-500 mb-4">UPLOAD IMAGE</div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              ref={fileInputRef}
            />
            <Button 
              variant="secondary" 
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select Image
            </Button>
            
            <div className="text-xs text-neutral-500 mt-6 mb-2">UPLOADED IMAGES</div>
            <div className={`${uploadedImages.length === 0 ? 'flex items-center justify-center' : 'grid grid-cols-2 gap-2'} h-40 bg-neutral-800/30 rounded-lg overflow-auto p-2`}>
              {uploadedImages.length === 0 ? (
                <span className="text-neutral-500 text-xs">Your uploaded images will appear here</span>
              ) : (
                uploadedImages.map(img => (
                  <div 
                    key={img.id}
                    onClick={() => addUploadedImageToCanvas(img.src)}
                    className={`cursor-pointer border-2 rounded p-1 flex items-center justify-center h-full
                      ${selectedUploadedImage === img.id ? 'border-blue-500' : 'border-transparent hover:border-neutral-500'}`}
                  >
                    <img 
                      src={img.src} 
                      alt="Uploaded image" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "projects":
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

      case "templates":
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

      case "settings":
        return (
          <div className="space-y-4">
            <div className="text-xs text-neutral-500 mb-4">API SETTINGS</div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400">Gemini API Key</label>
                <Input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="w-full h-8 text-sm text-black"
                  placeholder="Enter your Gemini API key"
                />
              </div>
              <Button 
                variant="default"
                onClick={validateGeminiApiKey}
                className="w-full flex items-center"
              >
                <span className="w-4 h-4 mr-2">🔑</span>
                Validate API Key
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-neutral-500">
            Coming soon...
          </div>
        );
    }
  };

  return (
    <div className="w-64 border-r border-neutral-800 bg-[#0f1116] flex">
      <div className="w-14 border-r border-neutral-800 py-2">
        <div className="flex flex-col items-center space-y-1">
          <SidebarMenuButton
            icon={FileText}
            active={activeSection === "text"}
            onClick={() => setActiveSection("text")}
          >
            Text
          </SidebarMenuButton>
          <SidebarMenuButton
            icon={Image}
            active={activeSection === "image"}
            onClick={() => setActiveSection("image")}
          >
            Image
          </SidebarMenuButton>
          <SidebarMenuButton
            icon={Shapes}
            active={activeSection === "shapes"}
            onClick={() => setActiveSection("shapes")}
          >
            Shapes
          </SidebarMenuButton>
          <SidebarMenuButton
            icon={Layers}
            active={activeSection === "layers"}
            onClick={() => setActiveSection("layers")}
          >
            Layers
          </SidebarMenuButton>
          <SidebarMenuButton
            icon={Play}
            active={activeSection === "animations"}
            onClick={() => setActiveSection("animations")}
          >
            Anim
          </SidebarMenuButton>
          <SidebarMenuButton
            icon={FolderOpen}
            active={activeSection === "projects"}
            onClick={() => setActiveSection("projects")}
          >
            Proj
          </SidebarMenuButton>
          <SidebarMenuButton
            icon={Upload}
            active={activeSection === "uploads"}
            onClick={() => setActiveSection("uploads")}
          >
            Upload
          </SidebarMenuButton>
          <SidebarMenuButton
            icon={Layout}
            active={activeSection === "templates"}
            onClick={() => setActiveSection("templates")}
          >
            Temp
          </SidebarMenuButton>
          <SidebarMenuButton
            icon={Settings}
            active={activeSection === "settings"}
            onClick={() => setActiveSection("settings")}
          >
            Settings
          </SidebarMenuButton>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {renderContent()}
      </div>
    </div>
  );
};
