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

  return (
    <div className="bg-[#0f1116] p-4">
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-neutral-400">
            {[...Array(6)].map((_, i) => (
              <span key={i}>{i.toFixed(2)}</span>
            ))}
          </div>
          <div className="h-20 border-t border-b border-neutral-800">
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
    </div>
  );
};
