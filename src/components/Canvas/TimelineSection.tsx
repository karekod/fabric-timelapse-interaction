
import { useState } from "react";
import { TimelineHeader } from "./Timeline/TimelineHeader";
import { TimelineControl } from "./TimelineControl";
import { Canvas as FabricCanvas } from "fabric";
import { TimelineLayer } from "@/types/animation";
import { toast } from "sonner";
import { ExtendedFabricObject } from "@/hooks/useCanvasState";
import { AnimationsPanel } from "./panels/AnimationsPanel";

interface TimelineSectionProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  timelineLayers: TimelineLayer[];
  setTimelineLayers: React.Dispatch<React.SetStateAction<TimelineLayer[]>>;
  canvas: FabricCanvas | null;
  selectedObject: ExtendedFabricObject | null;
}

export const TimelineSection = ({
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  timelineLayers,
  setTimelineLayers,
  canvas,
  selectedObject
}: TimelineSectionProps) => {
  const [selectedKeyframeId, setSelectedKeyframeId] = useState<string | null>(null);

  const handleAddTimeline = () => {
    if (!selectedObject || !selectedObject.customId) {
      toast("Lütfen önce bir nesne seçin", { 
        description: "Bir katman eklemek için önce tuval üzerinde bir nesne seçin",
        duration: 3000
      });
      return;
    }

    // Check if this object already has a timeline
    const existingLayer = timelineLayers.find(layer => layer.elementId === selectedObject.customId);
    if (existingLayer) {
      toast("Bu nesne için zaten bir katman var", { duration: 3000 });
      return;
    }

    // Use the current blue marker position (currentTime) as the starting point for the new keyframe
    const startTime = currentTime;
    
    const newLayer: TimelineLayer = {
      id: crypto.randomUUID(),
      elementId: selectedObject.customId,
      name: selectedObject.type === 'i-text' ? 'Metin' : selectedObject.type || 'Nesne',
      isVisible: true,
      keyframes: [{
        id: crypto.randomUUID(),
        startTime: startTime, // Set the keyframe to start at the current timeline position
        duration: 20,
        animationType: 'move',
        properties: {},
        effects: []
      }],
    };

    setTimelineLayers(prev => [...prev, newLayer]);
    toast("Yeni katman eklendi", { 
      description: `${newLayer.name} katmanı ${startTime > 0 ? startTime + 's konumunda' : 'başlangıçta'} başarıyla eklendi`, 
      duration: 3000 
    });
  };

  return (
    <div className="border-t border-neutral-800 bg-[#0f1116]">
      <TimelineHeader 
        isPlaying={isPlaying} 
        setIsPlaying={setIsPlaying}
        currentTime={currentTime}
        onAddTimeline={handleAddTimeline}
      />
      <TimelineControl
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        isPlaying={isPlaying}
        timelineLayers={timelineLayers}
        setTimelineLayers={setTimelineLayers}
        canvas={canvas}
        selectedKeyframeId={selectedKeyframeId}
        setSelectedKeyframeId={setSelectedKeyframeId}
      />
    </div>
  );
};
