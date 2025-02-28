
import { Canvas as FabricCanvas, Circle, Rect, IText, Image as FabricImage } from "fabric";
import { 
  FileText, Image, Shapes, FolderOpen, Upload, 
  Play, Settings, Layout, ChevronRight,
  Key, Monitor, Check, Palette, Type, ImagePlus
} from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Keyframe } from "@/types/animation";
import { toast } from "sonner";

interface SidebarProps {
  canvas: FabricCanvas | null;
}

type MenuSection = 
  | "text" 
  | "image" 
  | "shapes" 
  | "projects" 
  | "uploads" 
  | "animations" 
  | "settings" 
  | "templates";

export const Sidebar = ({ canvas }: SidebarProps) => {
  const [activeSection, setActiveSection] = useState<MenuSection>("text");
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [startTime, setStartTime] = useState("0");
  const [duration, setDuration] = useState("20");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * 0.7);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight * 0.6);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addShape = (type: "rectangle" | "circle") => {
    if (!canvas) return;

    let object;
    switch (type) {
      case "rectangle":
        object = new Rect({
          left: 100,
          top: 100,
          fill: "#ffffff",
          width: 100,
          height: 100,
        });
        break;
      case "circle":
        object = new Circle({
          left: 100,
          top: 100,
          fill: "#ffffff",
          radius: 50,
        });
        break;
    }

    if (object) {
      canvas.add(object);
      canvas.setActiveObject(object);
      canvas.renderAll();
      setSelectedShape(type);
    }
  };

  const addText = (type: "heading" | "subheading" | "body") => {
    if (!canvas) return;

    const styles = {
      heading: { fontSize: 32, fontWeight: "bold" },
      subheading: { fontSize: 24, fontWeight: "semibold" },
      body: { fontSize: 16 },
    };

    const text = new IText(`Double click to edit ${type}`, {
      left: 100,
      top: 100,
      fill: "#ffffff",
      ...styles[type],
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (!e.target || typeof e.target.result !== 'string') return;
      
      const imgElement = document.createElement('img');
      imgElement.src = e.target.result;
      
      imgElement.onload = () => {
        const fabricImg = new FabricImage(imgElement);
        fabricImg.scaleToWidth(200);
        canvas.add(fabricImg);
        canvas.setActiveObject(fabricImg);
        canvas.renderAll();
        toast.success("Image uploaded successfully!");
      };
    };
    
    reader.readAsDataURL(file);
  };

  const loadExampleImage = (url: string) => {
    if (!canvas) return;
    
    const imgElement = document.createElement('img');
    imgElement.crossOrigin = "anonymous";
    imgElement.src = url;
    
    imgElement.onload = () => {
      const fabricImg = new FabricImage(imgElement);
      fabricImg.scaleToWidth(200);
      canvas.add(fabricImg);
      canvas.setActiveObject(fabricImg);
      canvas.renderAll();
      toast.success("Example image added!");
    };
  };

  const verifyGeminiApiKey = () => {
    if (!geminiApiKey.trim()) {
      toast.error("Please enter a Gemini API key");
      return;
    }
    
    // This is just a placeholder for API verification logic
    // In a real implementation, you would check the API key validity
    toast.success("API key saved!");
  };

  const resizeCanvas = () => {
    if (!canvas) return;
    
    canvas.setWidth(canvasWidth);
    canvas.setHeight(canvasHeight);
    canvas.renderAll();
    toast.success("Canvas resized successfully!");
  };

  const loadTemplate = (templateType: string) => {
    if (!canvas) return;
    
    // Clear the canvas first
    canvas.clear();
    
    switch (templateType) {
      case "presentation":
        // Add a title
        const title = new IText("Presentation Title", {
          left: canvas.width! / 2,
          top: 100,
          originX: 'center',
          originY: 'center',
          fill: "#ffffff",
          fontSize: 40,
          fontWeight: "bold"
        });
        
        // Add a subtitle
        const subtitle = new IText("Your subtitle here", {
          left: canvas.width! / 2,
          top: 180,
          originX: 'center',
          originY: 'center',
          fill: "#cccccc",
          fontSize: 24
        });
        
        canvas.add(title, subtitle);
        break;
        
      case "social":
        // Add a headline
        const headline = new IText("Social Media Post", {
          left: canvas.width! / 2,
          top: canvas.height! / 3,
          originX: 'center',
          originY: 'center',
          fill: "#ffffff",
          fontSize: 36,
          fontWeight: "bold"
        });
        
        // Add a call to action
        const cta = new IText("Click here to learn more!", {
          left: canvas.width! / 2,
          top: canvas.height! * 2/3,
          originX: 'center',
          originY: 'center',
          fill: "#9b87f5",
          fontSize: 24,
          fontWeight: "bold"
        });
        
        canvas.add(headline, cta);
        break;
        
      case "infographic":
        // Add a title
        const infoTitle = new IText("Infographic Title", {
          left: canvas.width! / 2,
          top: 60,
          originX: 'center',
          originY: 'center',
          fill: "#ffffff",
          fontSize: 32,
          fontWeight: "bold"
        });
        
        // Add some shapes
        const circle1 = new Circle({
          left: canvas.width! * 0.25,
          top: canvas.height! * 0.4,
          fill: "#9b87f5",
          radius: 50,
        });
        
        const circle2 = new Circle({
          left: canvas.width! * 0.5,
          top: canvas.height! * 0.4,
          fill: "#7E69AB",
          radius: 50,
        });
        
        const circle3 = new Circle({
          left: canvas.width! * 0.75,
          top: canvas.height! * 0.4,
          fill: "#6E59A5",
          radius: 50,
        });
        
        // Add labels
        const label1 = new IText("Data 1", {
          left: canvas.width! * 0.25,
          top: canvas.height! * 0.4 + 80,
          originX: 'center',
          originY: 'center',
          fill: "#ffffff",
          fontSize: 16
        });
        
        const label2 = new IText("Data 2", {
          left: canvas.width! * 0.5,
          top: canvas.height! * 0.4 + 80,
          originX: 'center',
          originY: 'center',
          fill: "#ffffff",
          fontSize: 16
        });
        
        const label3 = new IText("Data 3", {
          left: canvas.width! * 0.75,
          top: canvas.height! * 0.4 + 80,
          originX: 'center',
          originY: 'center',
          fill: "#ffffff",
          fontSize: 16
        });
        
        canvas.add(infoTitle, circle1, circle2, circle3, label1, label2, label3);
        break;
    }
    
    canvas.renderAll();
    toast.success(`${templateType} template loaded!`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "text":
        return (
          <div className="space-y-4">
            <div className="text-xs text-neutral-500 mb-4">ADD TEXT</div>
            <div className="space-y-2">
              <button 
                onClick={() => addText("heading")}
                className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
              >
                <span className="text-sm font-semibold">H1</span>
                <span>Heading</span>
              </button>
              <button 
                onClick={() => addText("subheading")}
                className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
              >
                <span className="text-sm font-semibold">H2</span>
                <span>Subheading</span>
              </button>
              <button 
                onClick={() => addText("body")}
                className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
              >
                <span className="text-sm font-semibold">T</span>
                <span>Body Text</span>
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

      case "shapes":
        return (
          <div className="space-y-4">
            <div className="text-xs text-neutral-500 mb-4">ADD SHAPE</div>
            <div className="space-y-2">
              <button 
                onClick={() => addShape("rectangle")}
                className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
              >
                <span className="text-sm">◻️</span>
                <span>Rectangle</span>
              </button>
              <button 
                onClick={() => addShape("circle")}
                className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
              >
                <span className="text-sm">⭕</span>
                <span>Circle</span>
              </button>
            </div>
          </div>
        );

      case "uploads":
        return (
          <div className="space-y-4">
            <div className="text-xs text-neutral-500 mb-4">UPLOAD IMAGES</div>
            <div className="space-y-3">
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={uploadImage} 
                className="hidden" 
                id="file-upload"
              />
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              <p className="text-xs text-neutral-400">
                Upload your images here. Supported formats: JPG, PNG, SVG, GIF
              </p>
              <div className="h-px bg-neutral-800 my-3"></div>
              <p className="text-xs text-neutral-500">OR DRAG AND DROP</p>
              <div 
                className="border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  if (!canvas || !e.dataTransfer || e.dataTransfer.files.length === 0) return;
                  
                  const file = e.dataTransfer.files[0];
                  if (!file.type.includes('image')) {
                    toast.error("Please drop an image file");
                    return;
                  }
                  
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    if (!e.target || typeof e.target.result !== 'string') return;
                    
                    const imgElement = document.createElement('img');
                    imgElement.src = e.target.result;
                    
                    imgElement.onload = () => {
                      const fabricImg = new FabricImage(imgElement);
                      fabricImg.scaleToWidth(200);
                      canvas.add(fabricImg);
                      canvas.setActiveObject(fabricImg);
                      canvas.renderAll();
                      toast.success("Image uploaded successfully!");
                    };
                  };
                  
                  reader.readAsDataURL(file);
                }}
              >
                <ImagePlus className="w-10 h-10 mx-auto text-neutral-500 mb-2" />
                <p className="text-neutral-400 text-sm">Drag and drop your image here</p>
              </div>
            </div>
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <div className="text-xs text-neutral-500 mb-4">EXAMPLE IMAGES</div>
            <div className="space-y-2 grid grid-cols-2 gap-2">
              <button 
                onClick={() => loadExampleImage('https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80')}
                className="aspect-square bg-neutral-800/50 hover:bg-neutral-800 rounded-lg overflow-hidden"
              >
                <img 
                  src="https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                  alt="Mountains" 
                  className="w-full h-full object-cover"
                />
              </button>
              <button 
                onClick={() => loadExampleImage('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80')}
                className="aspect-square bg-neutral-800/50 hover:bg-neutral-800 rounded-lg overflow-hidden"
              >
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                  alt="Computer" 
                  className="w-full h-full object-cover"
                />
              </button>
              <button 
                onClick={() => loadExampleImage('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80')}
                className="aspect-square bg-neutral-800/50 hover:bg-neutral-800 rounded-lg overflow-hidden"
              >
                <img 
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                  alt="Code" 
                  className="w-full h-full object-cover"
                />
              </button>
              <button 
                onClick={() => loadExampleImage('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80')}
                className="aspect-square bg-neutral-800/50 hover:bg-neutral-800 rounded-lg overflow-hidden"
              >
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" 
                  alt="Woman working" 
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-4">
            <div className="text-xs text-neutral-500 mb-4">GEMINI API</div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400">API Key</label>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    className="w-full text-sm text-black"
                    placeholder="Enter your Gemini API key"
                  />
                  <Button variant="outline" size="icon" onClick={verifyGeminiApiKey}>
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-neutral-500 mt-1">Used for advanced AI features</p>
              </div>
            </div>
            
            <div className="h-px bg-neutral-800 my-3"></div>
            
            <div className="text-xs text-neutral-500 mb-4">CANVAS SIZE</div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400">Width (px)</label>
                <Input
                  type="number"
                  value={canvasWidth}
                  onChange={(e) => setCanvasWidth(Number(e.target.value))}
                  className="w-full text-sm text-black"
                  placeholder="Width"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400">Height (px)</label>
                <Input
                  type="number"
                  value={canvasHeight}
                  onChange={(e) => setCanvasHeight(Number(e.target.value))}
                  className="w-full text-sm text-black"
                  placeholder="Height"
                />
              </div>
              <Button variant="outline" className="w-full" onClick={resizeCanvas}>
                <Monitor className="w-4 h-4 mr-2" />
                Resize Canvas
              </Button>
            </div>
          </div>
        );
        
      case "templates":
        return (
          <div className="space-y-4">
            <div className="text-xs text-neutral-500 mb-4">TEMPLATES</div>
            <div className="space-y-2">
              <button 
                onClick={() => loadTemplate("presentation")}
                className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
              >
                <span className="text-sm">📊</span>
                <span>Presentation</span>
              </button>
              <button 
                onClick={() => loadTemplate("social")}
                className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
              >
                <span className="text-sm">📱</span>
                <span>Social Media</span>
              </button>
              <button 
                onClick={() => loadTemplate("infographic")}
                className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
              >
                <span className="text-sm">📈</span>
                <span>Infographic</span>
              </button>
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
      <div className="w-16 border-r border-neutral-800 py-4">
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={() => setActiveSection("text")}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${
              activeSection === "text" ? "bg-neutral-800" : "hover:bg-neutral-800/50"
            }`}
          >
            <FileText className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveSection("image")}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${
              activeSection === "image" ? "bg-neutral-800" : "hover:bg-neutral-800/50"
            }`}
          >
            <Image className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveSection("shapes")}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${
              activeSection === "shapes" ? "bg-neutral-800" : "hover:bg-neutral-800/50"
            }`}
          >
            <Shapes className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveSection("animations")}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${
              activeSection === "animations" ? "bg-neutral-800" : "hover:bg-neutral-800/50"
            }`}
          >
            <Play className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveSection("projects")}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${
              activeSection === "projects" ? "bg-neutral-800" : "hover:bg-neutral-800/50"
            }`}
          >
            <FolderOpen className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveSection("uploads")}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${
              activeSection === "uploads" ? "bg-neutral-800" : "hover:bg-neutral-800/50"
            }`}
          >
            <Upload className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveSection("settings")}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${
              activeSection === "settings" ? "bg-neutral-800" : "hover:bg-neutral-800/50"
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveSection("templates")}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${
              activeSection === "templates" ? "bg-neutral-800" : "hover:bg-neutral-800/50"
            }`}
          >
            <Layout className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex-1">
        <div className="p-4 border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold capitalize">{activeSection}</span>
            <ChevronRight className="w-5 h-5 text-neutral-500" />
          </div>
        </div>
        <div className="p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
