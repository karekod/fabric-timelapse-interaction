
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, IText } from "fabric";
import { TimelineControl } from "./TimelineControl";
import { AnimationPanel } from "./AnimationPanel";
import { Sidebar } from "./Sidebar";
import { ContextMenu } from "./ContextMenu";
import { Button } from "@/components/ui/button";
import { TimelineLayer, Keyframe } from "@/types/animation";

interface ExtendedFabricObject extends FabricObject {
  customId?: string;
}

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<ExtendedFabricObject | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timelineLayers, setTimelineLayers] = useState<TimelineLayer[]>([]);

  const handleAddTimeline = () => {
    if (!selectedObject || !selectedObject.customId) return;

    const newLayer: TimelineLayer = {
      id: crypto.randomUUID(),
      elementId: selectedObject.customId,
      name: selectedObject.type || 'Element',
      keyframes: [{
        id: crypto.randomUUID(),
        startTime: 0,
        duration: 20,
        animationType: 'move',
        properties: {},
      }],
    };

    setTimelineLayers(prev => [...prev, newLayer]);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth * 0.7,
      height: window.innerHeight * 0.6,
      backgroundColor: "#0f1116",
    });

    // Add welcome text
    const welcomeText = new IText("Welcome to Canvas Animation", {
      left: fabricCanvas.width! / 2,
      top: fabricCanvas.height! / 2,
      originX: 'center',
      originY: 'center',
      fill: "#ffffff",
      fontSize: 24,
      fontWeight: "bold"
    });
    fabricCanvas.add(welcomeText);

    fabricCanvas.on("selection:created", (e) => {
      const selectedObj = fabricCanvas.getActiveObject() as ExtendedFabricObject;
      if (!selectedObj.customId) {
        selectedObj.customId = crypto.randomUUID();
      }
      setSelectedObject(selectedObj);
    });

    fabricCanvas.on("selection:updated", (e) => {
      const selectedObj = fabricCanvas.getActiveObject() as ExtendedFabricObject;
      if (!selectedObj.customId) {
        selectedObj.customId = crypto.randomUUID();
      }
      setSelectedObject(selectedObj);
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

  return (
    <div className="h-screen bg-[#0f1116] text-white flex">
      <div className="flex flex-col flex-1">
        <div className="flex-1 flex">
          <Sidebar canvas={canvas} />
          <div className="flex-1 p-8 flex justify-center items-center">
            <div className="relative border border-neutral-800 rounded-lg overflow-hidden bg-[#171717] shadow-xl">
              {selectedObject && canvas && <ContextMenu selectedObject={selectedObject} canvas={canvas} />}
              <canvas ref={canvasRef} />
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-800 bg-[#0f1116]">
          <AnimationPanel 
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
          />
        </div>
      </div>
    </div>
  );
};
