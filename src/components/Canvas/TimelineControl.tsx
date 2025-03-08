
import { Slider } from "@/components/ui/slider";
import { TimelineLayer, Keyframe } from "@/types/animation";
import { TimelineLayers } from "./Timeline/TimelineLayers";
import { TimelineGrid } from "./Timeline/TimelineGrid";
import { useTimelineAnimation } from "@/hooks/useTimelineAnimation";
import { useTimelineDrag } from "@/hooks/useTimelineDrag";
import { useState } from "react";

interface TimelineControlProps {
  currentTime: number;
  setCurrentTime: (time: number) => void;
  isPlaying: boolean;
  timelineLayers: TimelineLayer[];
  setTimelineLayers: (layers: TimelineLayer[]) => void;
  canvas: any;
  selectedKeyframeId?: string;
  setSelectedKeyframeId?: (id: string | null) => void;
}

export const TimelineControl = ({
  currentTime,
  setCurrentTime,
  isPlaying,
  timelineLayers,
  setTimelineLayers,
  canvas,
  selectedKeyframeId,
  setSelectedKeyframeId
}: TimelineControlProps) => {
  const [localSelectedKeyframeId, setLocalSelectedKeyframeId] = useState<string | null>(null);
  
  // Use the passed setter if available, otherwise use local state
  const handleKeyframeSelect = (keyframeId: string) => {
    if (setSelectedKeyframeId) {
      setSelectedKeyframeId(keyframeId);
    } else {
      setLocalSelectedKeyframeId(keyframeId);
    }
  };
  
  // Use the passed value if available, otherwise use local state
  const effectiveSelectedKeyframeId = selectedKeyframeId || localSelectedKeyframeId;

  // Use the animation hook
  useTimelineAnimation({
    isPlaying,
    currentTime,
    setCurrentTime
  });

  // Use the drag hook
  const {
    draggingItem,
    handleDragStart,
    handleDragMove,
    handleDragEnd
  } = useTimelineDrag({
    timelineLayers,
    setTimelineLayers
  });

  const toggleLayerVisibility = (layerId: string) => {
    setTimelineLayers(timelineLayers.map(layer => {
      const isLayerVisible = !layer.isVisible;
      
      if (canvas) {
        const objects = canvas.getObjects();
        const targetObject = objects.find((obj: any) => obj.customId === layer.elementId);
        if (targetObject) {
          targetObject.visible = isLayerVisible;
          canvas.renderAll();
        }
      }
      
      return layer.id === layerId ? { ...layer, isVisible: isLayerVisible } : layer;
    }));
  };

  const deleteLayer = (layerId: string) => {
    setTimelineLayers(timelineLayers.filter(layer => layer.id !== layerId));
  };

  const duplicateLayer = (layerId: string) => {
    const layerToDuplicate = timelineLayers.find(layer => layer.id === layerId);
    if (!layerToDuplicate || !canvas) return;

    const newLayerId = crypto.randomUUID();
    const newElementId = crypto.randomUUID();

    const objects = canvas.getObjects();
    const sourceObject = objects.find((obj: any) => obj.customId === layerToDuplicate.elementId);
    
    if (sourceObject) {
      sourceObject.clone((cloned: any) => {
        cloned.customId = newElementId;
        cloned.set({
          left: sourceObject.left + 20,
          top: sourceObject.top + 20,
        });
        canvas.add(cloned);
        canvas.renderAll();
      });
    }

    const newLayer: TimelineLayer = {
      ...layerToDuplicate,
      id: newLayerId,
      elementId: newElementId,
      name: `${layerToDuplicate.name} (copy)`,
      keyframes: layerToDuplicate.keyframes.map(keyframe => ({
        ...keyframe,
        id: crypto.randomUUID(),
        effects: keyframe.effects ? keyframe.effects.map(effect => ({
          ...effect,
          id: crypto.randomUUID()
        })) : []
      }))
    };

    setTimelineLayers([...timelineLayers, newLayer]);
  };

  const changeAnimationType = (keyframeId: string, newType: Keyframe['animationType']) => {
    setTimelineLayers(timelineLayers.map(layer => ({
      ...layer,
      keyframes: layer.keyframes.map(keyframe => 
        keyframe.id === keyframeId 
          ? { ...keyframe, animationType: newType }
          : keyframe
      )
    })));
  };

  return (
    <div className="bg-[#0f1116] p-4 select-none flex flex-col"
      onMouseMove={e => draggingItem && handleDragMove(e)}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <div className="flex">
        <TimelineLayers
          timelineLayers={timelineLayers}
          toggleLayerVisibility={toggleLayerVisibility}
          deleteLayer={deleteLayer}
          duplicateLayer={duplicateLayer}
          onDragStart={handleDragStart}
        />

        <TimelineGrid
          timelineLayers={timelineLayers}
          currentTime={currentTime}
          draggingItem={draggingItem}
          handleDragStart={handleDragStart}
          changeAnimationType={changeAnimationType}
        />
      </div>

      <div className="mt-4 absolute bottom-4 left-52 right-4 opacity-30 hover:opacity-100 transition-opacity">
        <Slider
          value={[currentTime]}
          min={0}
          max={100}
          step={0.1}
          onValueChange={(value) => setCurrentTime(value[0])}
        />
      </div>
    </div>
  );
};
