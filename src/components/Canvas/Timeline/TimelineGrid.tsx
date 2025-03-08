
import { TimelineLayer } from "@/types/animation";
import { KeyframeItem } from "./KeyframeItem";

interface TimelineGridProps {
  timelineLayers: TimelineLayer[];
  currentTime: number;
  draggingItem: string | null;
  handleDragStart: (e: React.MouseEvent, itemId: string, type: "keyframe" | "duration" | "startTime") => void;
  changeAnimationType: (keyframeId: string, newType: any) => void;
}

export const TimelineGrid = ({
  timelineLayers,
  currentTime,
  draggingItem,
  handleDragStart,
  changeAnimationType
}: TimelineGridProps) => {
  return (
    <div className="flex-1">
      <div className="relative">
        <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-neutral-400">
          {[...Array(11)].map((_, i) => (
            <span key={i}>{i}s</span>
          ))}
        </div>
        <div className="border-t border-neutral-800">
          <div className="relative" style={{ height: `${timelineLayers.length * 40}px` }}>
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10"
              style={{ left: `${currentTime}%` }}
            />

            {timelineLayers.map((layer, index) => (
              <div
                key={layer.id}
                className={`h-10 border-b border-neutral-800 last:border-b-0 ${layer.isVisible === false ? 'opacity-50' : ''}`}
              >
                {layer.keyframes.map(keyframe => (
                  <KeyframeItem
                    key={keyframe.id}
                    keyframe={keyframe}
                    layerIndex={index}
                    layerIsVisible={layer.isVisible !== false}
                    isDragging={draggingItem === keyframe.id}
                    onDragStart={handleDragStart}
                    changeAnimationType={changeAnimationType}
                  />
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
      </div>
    </div>
  );
};
