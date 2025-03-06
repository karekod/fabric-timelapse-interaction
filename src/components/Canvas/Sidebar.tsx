
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
import { TemplatesPanel } from "./panels/TemplatesPanel";
import { SettingsPanel } from "./panels/SettingsPanel";

export const Sidebar = ({ canvas }: SidebarProps) => {
  const [activeSection, setActiveSection] = useState<MenuSection>("text");

  const renderContent = () => {
    switch (activeSection) {
      case "text":
        return <TextPanel canvas={canvas} />;
      case "shapes":
        return <ShapesPanel canvas={canvas} />;
      case "layers":
        return <LayersPanel canvas={canvas} />;
      case "image":
        return <ImagePanel canvas={canvas} />;
      case "animations":
        return <AnimationsPanel canvas={canvas} />;
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
