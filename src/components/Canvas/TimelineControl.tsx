import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import { 
  GripVertical,
  EyeOff,
  Eye,
  Trash2,
  Copy,
  Move,
  Maximize2,
  RotateCw,
  EyeOff as FadeIcon,
  Palette,
  ArrowDown as BlurIcon,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TimelineLayer, Keyframe } from "@/types/animation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TimelineControlProps {
  currentTime: number;
  setCurrentTime: (time: number) => void;
  isPlaying: boolean;
  timelineLayers: TimelineLayer[];
  setTimelineLayers: (layers: TimelineLayer[]) => void;
  canvas: any;
}

export const TimelineControl = ({
  currentTime,
  setCurrentTime,
  isPlaying,
  timelineLayers,
  setTimelineLayers,
  canvas
}: TimelineControlProps) => {
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const [dragType, setDragType] = useState<"layer" | "keyframe" | "duration" | "startTime" | null>(null);
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
        id: crypto.randomUUID()
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

  const getAnimationTypeIcon = (type: Keyframe['animationType']) => {
    switch (type) {
      case 'move': return <Move className="w-3 h-3" />;
      case 'scale': return <Maximize2 className="w-3 h-3" />;
      case 'rotate': return <RotateCw className="w-3 h-3" />;
      case 'fade': return <FadeIcon className="w-3 h-3" />;
      case 'color': return <Palette className="w-3 h-3" />;
      case 'blur': return <BlurIcon className="w-3 h-3" />;
      case 'flip': return <RotateCcw className="w-3 h-3" />;
      default: return <Move className="w-3 h-3" />;
    }
  };

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

  return (
    <div className="bg-[#0f1116] p-4 select-none flex">
      <div className="w-48 border-r border-neutral-800 pr-4 space-y-2">
        {timelineLayers.map(layer => (
          <div
            key={layer.id}
            className="h-10 flex items-center justify-between group"
          >
            <div 
              className="flex items-center gap-2 flex-1"
              onMouseDown={e => handleDragStart(e, layer.id, "layer")}
            >
              <GripVertical className="w-4 h-4 text-neutral-400 cursor-move" />
              <span className="text-sm truncate flex-1">{layer.name}</span>
            </div>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => toggleLayerVisibility(layer.id)}
              >
                {layer.isVisible === false ? (
                  <EyeOff className="w-3 h-3" />
                ) : (
                  <Eye className="w-3 h-3" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => deleteLayer(layer.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => duplicateLayer(layer.id)}
              >
                <Copy className="w-3 h-3" />
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
                  className={`h-10 border-b border-neutral-800 last:border-b-0 ${layer.isVisible === false ? 'opacity-50' : ''}`}
                >
                  {layer.keyframes.map(keyframe => (
                    <div
                      key={keyframe.id}
                      className="absolute h-8 mt-1 flex items-center group cursor-move"
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
                          bg-black border border-blue-500 rounded-md w-full h-full 
                          flex items-center group-hover:border-blue-400
                          ${draggingItem === keyframe.id ? 'border-blue-400' : ''}
                          ${layer.isVisible === false ? 'opacity-50' : ''}
                        `}
                      >
                        <div 
                          className="absolute left-0 w-2 h-full cursor-ew-resize hover:bg-blue-400/50"
                          onMouseDown={e => {
                            e.stopPropagation();
                            handleDragStart(e, keyframe.id, "startTime");
                          }}
                        />
                        <div className="px-2 min-w-0 ml-2 flex items-center gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-5 w-5 rounded-full bg-neutral-800"
                              >
                                {getAnimationTypeIcon(keyframe.animationType)}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem onClick={() => changeAnimationType(keyframe.id, 'move')}>
                                <Move className="w-4 h-4 mr-2" /> Move
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => changeAnimationType(keyframe.id, 'scale')}>
                                <Maximize2 className="w-4 h-4 mr-2" /> Scale
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => changeAnimationType(keyframe.id, 'rotate')}>
                                <RotateCw className="w-4 h-4 mr-2" /> Rotate
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => changeAnimationType(keyframe.id, 'fade')}>
                                <FadeIcon className="w-4 h-4 mr-2" /> Fade
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => changeAnimationType(keyframe.id, 'color')}>
                                <Palette className="w-4 h-4 mr-2" /> Color
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => changeAnimationType(keyframe.id, 'blur')}>
                                <BlurIcon className="w-4 h-4 mr-2" /> Blur
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => changeAnimationType(keyframe.id, 'flip')}>
                                <RotateCcw className="w-4 h-4 mr-2" /> Flip
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <span className="text-xs font-medium text-white">
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
