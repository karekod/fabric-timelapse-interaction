
import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Toolbar } from "./Toolbar";
import { TimelineControl } from "./TimelineControl";
import { AnimationPanel } from "./AnimationPanel";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth * 0.8,
      height: window.innerHeight * 0.6,
      backgroundColor: "#1a1a1a",
    });

    fabricCanvas.on("selection:created", (e) => {
      setSelectedObject(fabricCanvas.getActiveObject());
    });

    fabricCanvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    setCanvas(fabricCanvas);

    const handleResize = () => {
      fabricCanvas.setWidth(window.innerWidth * 0.8);
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
    <div className="min-h-screen bg-neutral-900 text-white p-4">
      <div className="max-w-[95vw] mx-auto space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="relative border border-neutral-700 rounded-lg overflow-hidden bg-neutral-800 shadow-xl">
              <canvas ref={canvasRef} className="w-full" />
            </div>
          </div>
          <Toolbar canvas={canvas} selectedObject={selectedObject} />
        </div>
        <div className="space-y-4">
          <AnimationPanel 
            isPlaying={isPlaying} 
            setIsPlaying={setIsPlaying}
            currentTime={currentTime}
          />
          <TimelineControl
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            isPlaying={isPlaying}
          />
        </div>
      </div>
    </div>
  );
};

