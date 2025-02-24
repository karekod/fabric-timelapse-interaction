
import { Button } from "@/components/ui/button";
import { Play, Pause, PlusCircle } from "lucide-react";
import { TimelineLayer } from "@/types/animation";

interface AnimationPanelProps {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentTime: number;
  onAddTimeline?: () => void;
}

export const AnimationPanel = ({
  isPlaying,
  setIsPlaying,
  currentTime,
  onAddTimeline
}: AnimationPanelProps) => {
  return (
    <div className="p-4 flex items-center gap-4">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="flex items-center gap-2"
        onClick={onAddTimeline}
      >
        <PlusCircle className="h-4 w-4" />
        Add Timeline
      </Button>
      <div className="text-sm text-neutral-400">
        {currentTime.toFixed(1)}s
      </div>
    </div>
  );
};
