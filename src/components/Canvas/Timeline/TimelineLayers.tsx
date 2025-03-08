
import { TimelineLayer } from "@/types/animation";
import { Button } from "@/components/ui/button";
import { GripVertical, EyeOff, Eye, Trash2, Copy } from "lucide-react";

interface TimelineLayersProps {
  timelineLayers: TimelineLayer[];
  toggleLayerVisibility: (layerId: string) => void;
  deleteLayer: (layerId: string) => void;
  duplicateLayer: (layerId: string) => void;
  onDragStart: (e: React.MouseEvent, itemId: string, type: "layer" | "keyframe" | "duration" | "startTime") => void;
}

export const TimelineLayers = ({
  timelineLayers,
  toggleLayerVisibility,
  deleteLayer,
  duplicateLayer,
  onDragStart
}: TimelineLayersProps) => {
  return (
    <div className="w-48 border-r border-neutral-800 pr-4">
      {timelineLayers.map(layer => (
        <div
          key={layer.id}
          className="h-10 flex items-center justify-between group border-b border-neutral-800 last:border-b-0"
        >
          <div 
            className="flex items-center gap-2 flex-1"
            onMouseDown={e => onDragStart(e, layer.id, "layer")}
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
  );
};
