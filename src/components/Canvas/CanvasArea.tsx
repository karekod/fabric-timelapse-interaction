
import { useRef } from "react";
import { Canvas as FabricCanvas } from "fabric";

interface CanvasAreaProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const CanvasArea = ({ canvasRef }: CanvasAreaProps) => {
  return (
    <div className="flex-1 p-8 flex justify-center items-center">
      <div className="relative border border-neutral-800 rounded-lg overflow-hidden bg-[#171717] shadow-xl">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};
