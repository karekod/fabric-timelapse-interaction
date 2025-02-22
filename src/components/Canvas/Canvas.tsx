
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { TimelineControl } from "./TimelineControl";
import { AnimationPanel } from "./AnimationPanel";
import { Sidebar } from "./Sidebar";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth * 0.6,
      height: window.innerHeight * 0.6,
      backgroundColor: "#0f1116",
    });

    fabricCanvas.on("selection:created", () => {
      setSelectedObject(fabricCanvas.getActiveObject());
    });

    fabricCanvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    setCanvas(fabricCanvas);

    const handleResize = () => {
      fabricCanvas.setWidth(window.innerWidth * 0.6);
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
      <div className="w-16 bg-[#0f1116] border-r border-neutral-800">
        <div className="flex flex-col items-center py-4 space-y-6">
          <button className="w-10 h-10 flex items-center justify-center bg-neutral-800 rounded-lg">
            A
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-neutral-800 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-neutral-800 rounded-lg">
            ⚪
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-neutral-800 rounded-lg">
            ⬜
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-neutral-800 rounded-lg">
            ⭐
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-neutral-800 rounded-lg">
            ⚡
          </button>
          <button className="w-10 h-10 flex items-center justify-center hover:bg-neutral-800 rounded-lg">
            ⚙️
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex-1 flex">
          <Sidebar canvas={canvas} />
          <div className="flex-1 p-8 flex justify-center items-center">
            <div className="relative border border-neutral-800 rounded-lg overflow-hidden bg-[#171717] shadow-xl">
              <canvas ref={canvasRef} className="w-full" />
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
          />
        </div>
      </div>
    </div>
  );
};
