
import { useEffect } from "react";

interface UseTimelineAnimationProps {
  isPlaying: boolean;
  currentTime: number;
  setCurrentTime: (time: number) => void;
}

export function useTimelineAnimation({
  isPlaying,
  currentTime,
  setCurrentTime
}: UseTimelineAnimationProps) {
  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      if (isPlaying) {
        setCurrentTime((currentTime >= 100 ? 0 : currentTime + 0.2));
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
}
