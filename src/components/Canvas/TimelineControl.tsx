import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { 
  Ghost, 
  Move, 
  Maximize2, 
  RotateCw, 
  Palette,
  PlusCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface TimelineControlProps {
  currentTime: number;
  setCurrentTime: (time: number) => void;
  isPlaying: boolean;
  timelineLayers: TimelineLayer[];
  setTimelineLayers: (layers: TimelineLayer[]) => void;
}

export const TimelineControl = ({
  currentTime,
  setCurrentTime,
  isPlaying,
  timelineLayers,
  setTimelineLayers,
}: TimelineControlProps) => {
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const [dragType, setDragType] = useState<"layer" | "keyframe" | "duration" | null>(null);
  const [startDragX, setStartDragX] = useState(0);
  const [startDragY, setStartDragY] = useState(0);

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      if (isPlaying) {
        setCurrentTime((currentTime >= 100 ? 0 : currentTime + 0.5));
        animationFrame = requestAnimationFrame(animate);
      }
    };

    if (isPlaying) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isPlaying, currentTime, setCurrentTime]);

  const addKeyframe = (layerId: string, type: Keyframe['animationType']) => {
    setTimelineLayers(timelineLayers.map(layer => {
      if (layer.id === layerId) {
        const newKeyframe: Keyframe = {
          id: crypto.randomUUID(),
          startTime: currentTime,
          duration: 20,
          animationType: type,
          properties: {},
        };
        return {
          ...layer,
          keyframes: [...layer.keyframes, newKeyframe],
        };
      }
      return layer;
    }));
  };

  const handleDragStart = (
    e: React.MouseEvent,
    itemId: string,
    type: "layer" | "keyframe" | "duration"
  ) => {
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
      const updatedLayers = timelineLayers.map(layer => ({
        ...layer,
        keyframes: layer.keyframes.map(keyframe => {
          if (keyframe.id === draggingItem) {
            if (dragType === "keyframe") {
              const newStartTime = Math.max(
                0,
                Math.min(100 - keyframe.duration, keyframe.startTime + deltaX * 0.1)
              );
              return { ...keyframe, startTime: newStartTime };
            } else if (dragType === "duration") {
              const newDuration = Math.max(
                5,
                Math.min(100 - keyframe.startTime, keyframe.duration + deltaX * 0.1)
              );
              return { ...keyframe, duration: newDuration };
            }
          }
          return keyframe;
        }),
      }));
      setTimelineLayers(updatedLayers);
      setStartDragX(e.clientX);
    }
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
    setDragType(null);
  };

  return (
    <div className="bg-[#0f1116] p-4 select-none flex">
      <div className="w-48 border-r border-neutral-800 pr-4 space-y-2">
        {timelineLayers.map(layer => (
          <div
            key={layer.id}
            className="h-10 flex items-center justify-between group"
            onMouseDown={e => handleDragStart(e, layer.id, "layer")}
          >
            <div className="flex items-center gap-2">
              <DragHandleDots2Icon className="w-4 h-4 text-neutral-400" />
              <span className="text-sm truncate">{layer.name}</span>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => addKeyframe(layer.id, 'move')}
              >
                <Move className="w-3 h-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => addKeyframe(layer.id, 'scale')}
              >
                <Maximize2 className="w-3 h-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => addKeyframe(layer.id, 'rotate')}
              >
                <RotateCw className="w-3 h-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => addKeyframe(layer.id, 'opacity')}
              >
                <Ghost className="w-3 h-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => addKeyframe(layer.id, 'color')}
              >
                <Palette className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1">
        <div className="relative">
          <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-neutral-400">
            {[...Array(11)].map((_, i) => (
              <span key={i}>{i}s</span>
            ))}
          </div>
          <div className="border-t border-b border-neutral-800">
            <div className="relative" style={{ height: `${timelineLayers.length * 40}px` }}>
              <div
                className="absolute top-0 bottom-0 w-px bg-blue-500 transition-all duration-100"
                style={{ left: `${currentTime}%` }}
              />

              {timelineLayers.map((layer, index) => (
                <div
                  key={layer.id}
                  className="h-10 border-b border-neutral-800 last:border-b-0"
                >
                  {layer.keyframes.map(keyframe => (
                    <div
                      key={keyframe.id}
                      className="absolute h-8 mt-1 flex items-center group"
                      style={{
                        left: `${keyframe.startTime}%`,
                        width: `${keyframe.duration}%`,
                        top: `${index * 40}px`,
                      }}
                      onMouseDown={e => handleDragStart(e, keyframe.id, "keyframe")}
                      onMouseMove={e => draggingItem && handleDragMove(e)}
                      onMouseUp={handleDragEnd}
                      onMouseLeave={handleDragEnd}
                    >
                      <div 
                        className={`
                          bg-blue-500/20 border border-blue-500 rounded-md w-full h-full 
                          flex items-center group-hover:border-blue-400
                          ${draggingItem === keyframe.id ? 'border-blue-400' : ''}
                        `}
                      >
                        <div className="px-2 flex items-center gap-2 min-w-0">
                          {keyframe.animationType === 'move' && <Move className="w-3 h-3" />}
                          {keyframe.animationType === 'scale' && <Maximize2 className="w-3 h-3" />}
                          {keyframe.animationType === 'rotate' && <RotateCw className="w-3 h-3" />}
                          {keyframe.animationType === 'opacity' && <Ghost className="w-3 h-3" />}
                          {keyframe.animationType === 'color' && <Palette className="w-3 h-3" />}
                          <span className="text-xs text-neutral-400">
                            {keyframe.startTime.toFixed(1)}s - {(keyframe.startTime + keyframe.duration).toFixed(1)}s
                          </span>
                        </div>
                        <div
                          className="absolute right-0 w-2 h-full cursor-ew-resize hover:bg-blue-400/50"
                          onMouseDown={e => {
                            e.stopPropagation();
                            handleDragStart(e, keyframe.id, "duration");
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              <div className="absolute inset-0 grid grid-cols-10 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="border-l border-neutral-800 h-full" />
                ))}
              </div>
            </div>
          </div>
          <Slider
            value={[currentTime]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={(value) => setCurrentTime(value[0])}
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
};
