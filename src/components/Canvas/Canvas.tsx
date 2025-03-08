
import { useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Sidebar } from "./Sidebar";
import { CanvasArea } from "./CanvasArea";
import { TimelineSection } from "./TimelineSection";
import { useCanvasState } from "@/hooks/useCanvasState";
import { useCanvasInitialization } from "@/hooks/useCanvasInitialization";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const {
    selectedObject,
    setSelectedObject,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    timelineLayers,
    setTimelineLayers
  } = useCanvasState();

  // Initialize canvas
  useCanvasInitialization({
    canvasRef,
    setCanvas,
    setSelectedObject,
    setTimelineLayers,
    timelineLayers
  });

  return (
    <div className="h-screen bg-[#0f1116] text-white flex">
      <div className="flex flex-col flex-1">
        <div className="flex-1 flex">
          <Sidebar 
            canvas={canvas} 
            timelineLayers={timelineLayers} 
            setTimelineLayers={setTimelineLayers}
            selectedObject={selectedObject}
          />
          <CanvasArea canvasRef={canvasRef} />
        </div>
        <TimelineSection 
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          timelineLayers={timelineLayers}
          setTimelineLayers={setTimelineLayers}
          canvas={canvas}
          selectedObject={selectedObject}
        />
      </div>
    </div>
  );
};
