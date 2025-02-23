
import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { TimelineControl } from "./TimelineControl";
import { AnimationPanel } from "./AnimationPanel";
import { Sidebar } from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  PlusCircle,
  Move,
  Maximize2,
  RotateCw,
  Ghost,
  Palette
} from "lucide-react";

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
  const [selectedAnimation, setSelectedAnimation] = useState<Keyframe['animationType']>('move');
  const [startTime, setStartTime] = useState("0");
  const [duration, setDuration] = useState("20");

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth * 0.7,
      height: window.innerHeight * 0.6,
      backgroundColor: "#0f1116",
    });

    fabricCanvas.on("selection:created", (e) => {
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

  const addTimelineLayer = () => {
    if (!selectedObject || !selectedObject.customId) return;

    const start = Math.min(100, Math.max(0, parseFloat(startTime) || 0));
    const dur = Math.min(100 - start, Math.max(1, parseFloat(duration) || 20));

    const newLayer: TimelineLayer = {
      id: crypto.randomUUID(),
      elementId: selectedObject.customId,
      name: selectedObject.type || 'Element',
      keyframes: [{
        id: crypto.randomUUID(),
        startTime: start,
        duration: dur,
        animationType: selectedAnimation,
        properties: {},
      }],
    };

    setTimelineLayers(prev => [...prev, newLayer]);
  };

  const AnimationButton = ({ type, icon: Icon }: { type: Keyframe['animationType'], icon: any }) => (
    <Button
      size="icon"
      variant={selectedAnimation === type ? "default" : "ghost"}
      className="h-8 w-8"
      onClick={() => setSelectedAnimation(type)}
    >
      <Icon className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="h-screen bg-[#0f1116] text-white flex">
      <div className="flex flex-col flex-1">
        <div className="flex-1 flex">
          <Sidebar canvas={canvas} />
          <div className="flex-1 p-8 flex justify-center items-center">
            <div className="relative border border-neutral-800 rounded-lg overflow-hidden bg-[#171717] shadow-xl">
              <canvas ref={canvasRef} />
              {selectedObject && (
                <div className="absolute top-4 right-4 flex flex-col items-end gap-4">
                  <div className="flex items-center gap-2 bg-neutral-900/50 p-2 rounded-lg">
                    <AnimationButton type="move" icon={Move} />
                    <AnimationButton type="scale" icon={Maximize2} />
                    <AnimationButton type="rotate" icon={RotateCw} />
                    <AnimationButton type="opacity" icon={Ghost} />
                    <AnimationButton type="color" icon={Palette} />
                  </div>
                  <div className="flex flex-col gap-2 bg-neutral-900/50 p-2 rounded-lg">
                    <div className="flex gap-2 items-center">
                      <Input
                        type="number"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-20 h-8 text-sm"
                        placeholder="Start"
                      />
                      <span className="text-xs text-neutral-400">to</span>
                      <Input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-20 h-8 text-sm"
                        placeholder="Duration"
                      />
                    </div>
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
