
import { Canvas } from "fabric";
import { TimelineLayer } from "./animation";
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

export interface SidebarProps {
  canvas: Canvas | null;
  timelineLayers?: TimelineLayer[];
  setTimelineLayers?: React.Dispatch<React.SetStateAction<TimelineLayer[]>>;
  selectedObject?: ExtendedFabricObject | null;
}

export interface PanelProps {
  canvas: Canvas | null;
}
