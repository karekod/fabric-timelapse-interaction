
import { useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { PanelProps } from "@/types/sidebar";
import { Input } from "@/components/ui/input";

export const AnimationsPanel = ({ canvas }: PanelProps) => {
  const [startTime, setStartTime] = useState("0");
  const [duration, setDuration] = useState("20");
  const [selectedAnimation, setSelectedAnimation] = useState<'move' | 'scale' | 'rotate' | 'fade' | 'color' | 'blur' | 'flip'>('move');

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="text-xs text-neutral-500">ANIMATION TIME</div>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-neutral-400">Start Time (s)</label>
            <Input
              type="number"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full h-8 text-sm text-black"
              placeholder="Start"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400">Duration (s)</label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full h-8 text-sm text-black"
              placeholder="Duration"
            />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="text-xs text-neutral-500">PRESETS</div>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg">
            Fade In
          </button>
          <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg">
            Bounce
          </button>
          <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg">
            Slide In
          </button>
        </div>
      </div>
    </div>
  );
};
