
import { Slider } from "@/components/ui/slider";
import { useEffect, useState } from "react";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";

interface TimelineItem {
  id: string;
  name: string;
  type: string;
  startTime: number;
  duration: number;
  track: number;
}

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
  const [items, setItems] = useState<TimelineItem[]>([
    {
      id: "1",
      name: "Heading Text",
      type: "text",
      startTime: 10,
      duration: 20,
      track: 0,
    },
    {
      id: "2",
      name: "Circle Shape",
      type: "shape",
      startTime: 30,
      duration: 15,
      track: 1,
    },
  ]);

  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const [dragType, setDragType] = useState<"position" | "duration" | null>(null);
  const [startDragX, setStartDragX] = useState(0);
  const [startDragY, setStartDragY] = useState(0);

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

  const handleDragStart = (
    e: React.MouseEvent,
    itemId: string,
    type: "position" | "duration"
  ) => {
    setDraggingItem(itemId);
    setDragType(type);
    setStartDragX(e.clientX);
    setStartDragY(e.clientY);
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!draggingItem || !dragType) return;

    const deltaX = e.clientX - startDragX;
    const deltaY = e.clientY - startDragY;

    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === draggingItem) {
          if (dragType === "position") {
            // Move timeline position horizontally and track vertically
            const newStartTime = Math.max(0, Math.min(100 - item.duration, item.startTime + deltaX * 0.1));
            const newTrack = Math.max(0, Math.min(3, item.track + Math.round(deltaY / 40)));
            return { ...item, startTime: newStartTime, track: newTrack };
          } else {
            // Adjust duration
            const newDuration = Math.max(5, Math.min(100 - item.startTime, item.duration + deltaX * 0.1));
            return { ...item, duration: newDuration };
          }
        }
        return item;
      })
    );

    setStartDragX(e.clientX);
    setStartDragY(e.clientY);
  };

  const handleDragEnd = () => {
    setDraggingItem(null);
    setDragType(null);
  };

  return (
    <div className="bg-[#0f1116] p-4 select-none">
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-neutral-400">
            {[...Array(11)].map((_, i) => (
              <span key={i}>{i}s</span>
            ))}
          </div>
          <div className="border-t border-b border-neutral-800">
            <div className="relative h-[160px]">
              {/* Time indicator */}
              <div
                className="absolute top-0 bottom-0 w-px bg-blue-500 transition-all duration-100"
                style={{ left: `${currentTime}%` }}
              />

              {/* Timeline tracks */}
              {[...Array(4)].map((_, trackIndex) => (
                <div
                  key={trackIndex}
                  className="h-10 border-b border-neutral-800 last:border-b-0"
                />
              ))}

              {/* Timeline items */}
              {items.map(item => (
                <div
                  key={item.id}
                  className="absolute h-9 flex items-center group"
                  style={{
                    left: `${item.startTime}%`,
                    width: `${item.duration}%`,
                    top: `${item.track * 40}px`,
                  }}
                  onMouseDown={e => handleDragStart(e, item.id, "position")}
                  onMouseMove={e => draggingItem && handleDragMove(e)}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                >
                  <div className="bg-blue-500/20 border border-blue-500 rounded-md w-full h-full flex items-center group-hover:border-blue-400">
                    <div className="px-2 flex items-center gap-2 min-w-0">
                      <DragHandleDots2Icon className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                      <span className="text-xs truncate">{item.name}</span>
                      <span className="text-xs text-neutral-400">
                        {item.startTime.toFixed(1)}s - {(item.startTime + item.duration).toFixed(1)}s
                      </span>
                    </div>
                    {/* Resize handle */}
                    <div
                      className="absolute right-0 w-2 h-full cursor-ew-resize hover:bg-blue-400/50"
                      onMouseDown={e => {
                        e.stopPropagation();
                        handleDragStart(e, item.id, "duration");
                      }}
                    />
                  </div>
                </div>
              ))}

              {/* Grid lines */}
              <div className="absolute inset-0 grid grid-cols-10 pointer-events-none">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="border-l border-neutral-800 h-full" />
                ))}
              </div>
            </div>
          </div>
          <Slider
            value={[currentTime]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={(value) => setCurrentTime(value[0])}
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
};
