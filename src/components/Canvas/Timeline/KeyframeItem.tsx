
import { Keyframe } from "@/types/animation";
import { Button } from "@/components/ui/button";
import { 
  Move,
  Maximize2,
  RotateCw,
  EyeOff as FadeIcon,
  Palette,
  ArrowDown as BlurIcon,
  RotateCcw
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface KeyframeItemProps {
  keyframe: Keyframe;
  layerIndex: number;
  layerIsVisible: boolean;
  isDragging: boolean;
  isSelected?: boolean;
  onDragStart: (e: React.MouseEvent, keyframeId: string, type: "keyframe" | "duration" | "startTime") => void;
  changeAnimationType: (keyframeId: string, newType: Keyframe['animationType']) => void;
  onKeyframeSelect?: (keyframeId: string) => void;
}

export const KeyframeItem = ({
  keyframe,
  layerIndex,
  layerIsVisible,
  isDragging,
  isSelected = false,
  onDragStart,
  changeAnimationType,
  onKeyframeSelect
}: KeyframeItemProps) => {
  
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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onKeyframeSelect) {
      onKeyframeSelect(keyframe.id);
    }
  };

  // Count number of effects if present
  const effectsCount = keyframe.effects?.length || 0;

  return (
    <div
      className="absolute h-8 mt-1 flex items-center group cursor-move"
      style={{
        left: `${keyframe.startTime}%`,
        width: `${keyframe.duration}%`,
        top: `${layerIndex * 40}px`,
      }}
      onMouseDown={e => onDragStart(e, keyframe.id, "keyframe")}
      onClick={handleClick}
    >
      <div 
        className={`
          bg-black border rounded-md w-full h-full 
          flex items-center group-hover:border-blue-400
          ${isSelected ? 'border-blue-500' : 'border-blue-300/70'}
          ${isDragging ? 'border-blue-400' : ''}
          ${layerIsVisible === false ? 'opacity-50' : ''}
        `}
      >
        <div 
          className="absolute left-0 w-2 h-full cursor-ew-resize hover:bg-blue-400/50"
          onMouseDown={e => {
            e.stopPropagation();
            onDragStart(e, keyframe.id, "startTime");
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
            {effectsCount > 0 && ` (${effectsCount})`}
          </span>
        </div>
        <div
          className="absolute right-0 w-2 h-full cursor-ew-resize hover:bg-blue-400/50"
          onMouseDown={e => {
            e.stopPropagation();
            onDragStart(e, keyframe.id, "duration");
          }}
        />
      </div>
    </div>
  );
};
