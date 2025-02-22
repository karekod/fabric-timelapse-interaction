
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause, RotateCcw, SkipBack, SkipForward } from "lucide-react";

interface AnimationPanelProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
}

export const AnimationPanel = ({
  isPlaying,
  setIsPlaying,
  currentTime,
}: AnimationPanelProps) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-[#0f1116] border-b border-neutral-800">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPlaying(false)}
          className="w-8 h-8"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-8 h-8"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsPlaying(false)}
          className="w-8 h-8"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-sm text-neutral-400 min-w-[80px]">
        {(currentTime / 10).toFixed(2)}s / 10.00s
      </div>
    </div>
  );
};
