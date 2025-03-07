
import { useState } from "react";
import { Object as FabricObject } from "fabric";
import { TimelineLayer } from "@/types/animation";

export interface ExtendedFabricObject extends FabricObject {
  customId?: string;
}

export interface CanvasState {
  selectedObject: ExtendedFabricObject | null;
  isPlaying: boolean;
  currentTime: number;
  timelineLayers: TimelineLayer[];
}

export function useCanvasState() {
  const [selectedObject, setSelectedObject] = useState<ExtendedFabricObject | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timelineLayers, setTimelineLayers] = useState<TimelineLayer[]>([]);

  return {
    selectedObject,
    setSelectedObject,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    timelineLayers,
    setTimelineLayers
  };
}
