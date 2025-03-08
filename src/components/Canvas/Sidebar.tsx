
import { 
  FileText, Image, Shapes, FolderOpen, Upload, 
  Play, Settings, Layout, Layers
} from "lucide-react";
import { useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { SidebarMenuButton } from "./SidebarMenuButton";
import { MenuSection, SidebarProps } from "@/types/sidebar";
import { TextPanel } from "./panels/TextPanel";
import { ShapesPanel } from "./panels/ShapesPanel";
import { LayersPanel } from "./panels/LayersPanel";
import { ImagePanel } from "./panels/ImagePanel";
import { AnimationsPanel } from "./panels/AnimationsPanel";
import { ProjectsPanel } from "./panels/ProjectsPanel";
import { UploadsPanel } from "./panels/UploadsPanel";
import { TemplatesPanel } from "./panels/Templates/TemplatesPanel";
import { SettingsPanel } from "./panels/SettingsPanel";

export const Sidebar = ({ canvas, timelineLayers = [], setTimelineLayers, selectedObject = null }: SidebarProps) => {
  const [activeSection, setActiveSection] = useState<MenuSection>("layers"); // Set default to layers panel
  
  // This ensures the timelineLayers array is never undefined
  const layers = timelineLayers || [];
  const updateLayers = setTimelineLayers || (() => {});

  const renderContent = () => {
    switch (activeSection) {
      case "text":
        return <TextPanel canvas={canvas} />;
      case "shapes":
        return <ShapesPanel canvas={canvas} />;
      case "layers":
        return <LayersPanel 
          canvas={canvas} 
          timelineLayers={layers} 
          setTimelineLayers={updateLayers} 
        />;
      case "image":
        return <ImagePanel canvas={canvas} />;
      case "animations":
        return <AnimationsPanel 
          canvas={canvas} 
          selectedObject={selectedObject} 
          timelineLayers={layers} 
          setTimelineLayers={updateLayers} 
        />;
      case "uploads":
        return <UploadsPanel canvas={canvas} />;
      case "projects":
        return <ProjectsPanel canvas={canvas} />;
      case "templates":
        return <TemplatesPanel canvas={canvas} />;
      case "settings":
        return <SettingsPanel canvas={canvas} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-neutral-500">
            Yakında gelecek...
          </div>
        );
    }
  };

  return (
    <div className="w-64 border-r border-neutral-800 bg-[#0f1116] flex">
      <div className="w-14 border-r border-neutral-800 py-2">
        <div className="flex flex-col items-center space-y-1">
          <SidebarMenuButton
            icon={Layers}
            active={activeSection === "layers"}
            onClick={() => setActiveSection("layers")}
          >
            Katman
          </SidebarMenuButton>
          <SidebarMenuButton
            icon={FileText}
            active={activeSection === "text"}
            onClick={() => setActiveSection("text")}
          >
            Metin
          </SidebarMenuButton>
          <SidebarMenuButton
            icon={Image}
            active={activeSection === "image"}
            onClick={() => setActiveSection("image")}
          >
            Resim
          </SidebarMenuButton>
          <SidebarMenuButton
            icon={Shapes}
            active={activeSection === "shapes"}
            onClick={() => setActiveSection("shapes")}
          >
            Şekil
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
            Proje
          </SidebarMenuButton>
          <SidebarMenuButton
            icon={Upload}
            active={activeSection === "uploads"}
            onClick={() => setActiveSection("uploads")}
          >
            Yükle
          </SidebarMenuButton>
          <SidebarMenuButton
            icon={Layout}
            active={activeSection === "templates"}
            onClick={() => setActiveSection("templates")}
          >
            Şablon
          </SidebarMenuButton>
          <SidebarMenuButton
            icon={Settings}
            active={activeSection === "settings"}
            onClick={() => setActiveSection("settings")}
          >
            Ayarlar
          </SidebarMenuButton>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {renderContent()}
      </div>
    </div>
  );
};
