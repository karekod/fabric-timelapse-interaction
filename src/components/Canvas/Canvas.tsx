
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Toolbar } from "./Toolbar";
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
    <div className="min-h-screen bg-[#0f1116] text-white">
      <div className="flex h-screen">
        <Sidebar canvas={canvas} />
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-neutral-800 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <button className="p-2 hover:bg-neutral-800 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Download
              </button>
            </div>
          </div>
          <div className="flex-1 p-8 flex justify-center items-center">
            <div className="relative border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900 shadow-xl">
              <canvas ref={canvasRef} className="w-full" />
            </div>
          </div>
          <div className="border-t border-neutral-800">
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
        <div className="w-64 border-l border-neutral-800 p-4 bg-[#0f1116]">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Layout</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-neutral-400">Position</label>
                    <div className="flex gap-2">
                      <input type="text" className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm" placeholder="X" />
                      <input type="text" className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm" placeholder="Y" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-neutral-400">Size</label>
                    <div className="flex gap-2">
                      <input type="text" className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm" placeholder="W" />
                      <input type="text" className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm" placeholder="H" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-neutral-400">Rotation</label>
                  <input type="text" className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm" placeholder="0°" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
