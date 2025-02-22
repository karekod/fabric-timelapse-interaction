
import { Canvas as FabricCanvas, Circle, Rect, IText } from "fabric";
import { 
  FileText, Image, Shapes, FolderOpen, Upload, 
  Play, Settings, Layout, ChevronRight 
} from "lucide-react";
import { useState } from "react";

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
            {selectedShape && (
              <div>
                <div className="text-xs text-neutral-500 mb-4">ANIMATIONS</div>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2">
                    <span>Fade In</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2">
                    <span>Scale Up</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2">
                    <span>Rotate</span>
                  </button>
                </div>
              </div>
            )}
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
            onClick={() => setActiveSection("animations")}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${
              activeSection === "animations" ? "bg-neutral-800" : "hover:bg-neutral-800/50"
            }`}
          >
            <Play className="w-5 h-5" />
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
