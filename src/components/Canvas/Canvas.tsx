
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { TimelineControl } from "./TimelineControl";
import { AnimationPanel } from "./AnimationPanel";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface TimelineLayer {
  id: string;
  elementId: string;
  name: string;
  keyframes: Keyframe[];
}

interface Keyframe {
  id: string;
  startTime: number;
  duration: number;
  animationType: 'move' | 'scale' | 'color' | 'opacity' | 'rotate';
  properties: Record<string, any>;
}

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timelineLayers, setTimelineLayers] = useState<TimelineLayer[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth * 0.7,
      height: window.innerHeight * 0.6,
      backgroundColor: "#0f1116",
    });

    fabricCanvas.on("selection:created", (e) => {
      setSelectedObject(fabricCanvas.getActiveObject());
    });

    fabricCanvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    setCanvas(fabricCanvas);

    const handleResize = () => {
      fabricCanvas.setWidth(window.innerWidth * 0.7);
      fabricCanvas.setHeight(window.innerHeight * 0.6);
      fabricCanvas.renderAll();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      fabricCanvas.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const addTimelineLayer = () => {
    if (!selectedObject) return;

    const newLayer: TimelineLayer = {
      id: crypto.randomUUID(),
      elementId: selectedObject.id!,
      name: selectedObject.type || 'Element',
      keyframes: [],
    };

    setTimelineLayers(prev => [...prev, newLayer]);
  };

  return (
    <div className="h-screen bg-[#0f1116] text-white flex">
      <div className="flex flex-col flex-1">
        <div className="flex-1 flex">
          <Sidebar canvas={canvas} />
          <div className="flex-1 p-8 flex justify-center items-center">
            <div className="relative border border-neutral-800 rounded-lg overflow-hidden bg-[#171717] shadow-xl">
              <canvas ref={canvasRef} />
              {selectedObject && (
                <div className="absolute top-4 right-4">
                  <Button 
                    onClick={addTimelineLayer}
                    className="flex items-center gap-2"
                    variant="secondary"
                    size="sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Timeline
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-800 bg-[#0f1116]">
          <AnimationPanel 
            isPlaying={isPlaying} 
            setIsPlaying={setIsPlaying}
            currentTime={currentTime}
          />
          <TimelineControl
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            isPlaying={isPlaying}
            timelineLayers={timelineLayers}
            setTimelineLayers={setTimelineLayers}
          />
        </div>
      </div>
    </div>
  );
};
