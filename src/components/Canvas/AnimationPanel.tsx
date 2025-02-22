
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause, RotateCcw } from "lucide-react";

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
    <div className="flex items-center gap-4 bg-neutral-800 p-4 rounded-lg border border-neutral-700">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
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
          variant="outline"
          size="icon"
          onClick={() => setIsPlaying(false)}
          className="w-8 h-8"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Animation type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="fade">Fade</SelectItem>
          <SelectItem value="scale">Scale</SelectItem>
          <SelectItem value="rotate">Rotate</SelectItem>
        </SelectContent>
      </Select>
      <div className="text-sm text-neutral-400">
        Time: {(currentTime / 10).toFixed(1)}s
      </div>
    </div>
  );
};

