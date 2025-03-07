
import { useState } from "react";
import { TimelineLayer } from "@/types/animation";

interface UseTimelineDragProps {
  timelineLayers: TimelineLayer[];
  setTimelineLayers: React.Dispatch<React.SetStateAction<TimelineLayer[]>>;
}

export function useTimelineDrag({
  timelineLayers,
  setTimelineLayers
}: UseTimelineDragProps) {
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const [dragType, setDragType] = useState<"layer" | "keyframe" | "duration" | "startTime" | null>(null);
  const [startDragX, setStartDragX] = useState(0);
  const [startDragY, setStartDragY] = useState(0);

  const handleDragStart = (
    e: React.MouseEvent,
    itemId: string,
    type: "layer" | "keyframe" | "duration" | "startTime"
  ) => {
    e.stopPropagation();
    setDraggingItem(itemId);
    setDragType(type);
    setStartDragX(e.clientX);
    setStartDragY(e.clientY);
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!draggingItem || !dragType) return;

    const deltaX = e.clientX - startDragX;
    const deltaY = e.clientY - startDragY;

    if (dragType === "layer") {
      const layerHeight = 40;
      const moveAmount = Math.round(deltaY / layerHeight);
      if (moveAmount !== 0) {
        const newLayers = [...timelineLayers];
        const currentIndex = newLayers.findIndex(l => l.id === draggingItem);
        const newIndex = Math.max(0, Math.min(newLayers.length - 1, currentIndex + moveAmount));
        const [layer] = newLayers.splice(currentIndex, 1);
        newLayers.splice(newIndex, 0, layer);
        setTimelineLayers(newLayers);
        setStartDragY(e.clientY);
      }
    } else {
      setTimelineLayers(timelineLayers.map(layer => ({
        ...layer,
        keyframes: layer.keyframes.map(keyframe => {
          if (keyframe.id === draggingItem) {
            if (dragType === "keyframe") {
              const moveSpeed = 0.5;
              const newStartTime = Math.max(
                0,
                Math.min(100 - keyframe.duration, keyframe.startTime + deltaX * moveSpeed)
              );
              return { ...keyframe, startTime: newStartTime };
            } else if (dragType === "duration") {
              const resizeSpeed = 0.3;
              const newDuration = Math.max(
                5,
                Math.min(100 - keyframe.startTime, keyframe.duration + deltaX * resizeSpeed)
              );
              return { ...keyframe, duration: newDuration };
            } else if (dragType === "startTime") {
              const resizeSpeed = 0.3;
              const maxReduction = Math.min(keyframe.startTime, deltaX * resizeSpeed);
              const newStartTime = Math.max(0, keyframe.startTime - maxReduction);
              const newDuration = keyframe.duration + maxReduction;
              return { 
                ...keyframe, 
                startTime: newStartTime,
                duration: newDuration
              };
            }
          }
          return keyframe;
        }),
      })));
      setStartDragX(e.clientX);
    }
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
    setDragType(null);
  };

  return {
    draggingItem,
    handleDragStart,
    handleDragMove,
    handleDragEnd
  };
}
