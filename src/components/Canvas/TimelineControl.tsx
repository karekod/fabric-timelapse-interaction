
import { Slider } from "@/components/ui/slider";
import { useEffect } from "react";

interface TimelineControlProps {
  currentTime: number;
  setCurrentTime: (time: number) => void;
  isPlaying: boolean;
}

export const TimelineControl = ({
  currentTime,
  setCurrentTime,
  isPlaying,
}: TimelineControlProps) => {
  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      if (isPlaying) {
        setCurrentTime((prev) => {
          if (prev >= 100) return 0;
          return prev + 0.5;
        });
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
  }, [isPlaying, setCurrentTime]);

  return (
    <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-neutral-400">
            <span>0s</span>
            <span>2s</span>
            <span>4s</span>
            <span>6s</span>
            <span>8s</span>
            <span>10s</span>
          </div>
          <Slider
            value={[currentTime]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={(value) => setCurrentTime(value[0])}
            className="py-4"
          />
        </div>
      </div>
    </div>
  );
};

