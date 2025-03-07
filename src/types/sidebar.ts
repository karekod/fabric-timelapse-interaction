
import { LucideIcon } from "lucide-react";
import { TimelineLayer, Keyframe } from "./animation";
import { Canvas as FabricCanvas } from "fabric";

export type MenuSection = 
  | "text" 
  | "image" 
  | "shapes" 
  | "projects" 
  | "uploads" 
  | "animations" 
  | "settings" 
  | "templates"
  | "layers";

export interface Template {
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

export interface Project {
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

export interface SidebarProps {
  canvas: FabricCanvas | null;
  timelineLayers?: TimelineLayer[];
  setTimelineLayers?: React.Dispatch<React.SetStateAction<TimelineLayer[]>>;
}

export interface PanelProps {
  canvas: FabricCanvas | null;
}

