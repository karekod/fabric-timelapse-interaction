
import { Canvas } from "fabric";
import { TimelineLayer, Keyframe } from "./animation";
import { ExtendedFabricObject } from "@/hooks/useCanvasState";

export type MenuSection = 
  | "text" 
  | "shapes" 
  | "layers"
  | "image"
  | "animations"
  | "projects"
  | "uploads"
  | "templates"
  | "settings";

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
  canvas: Canvas | null;
  timelineLayers?: TimelineLayer[];
  setTimelineLayers?: React.Dispatch<React.SetStateAction<TimelineLayer[]>>;
  selectedObject?: ExtendedFabricObject | null;
}

export interface PanelProps {
  canvas: Canvas | null;
}
