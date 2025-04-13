
import { Trash2, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { ExtendedFabricObject } from "@/hooks/useCanvasState";
import { toast } from "sonner";

interface FloatingToolbarProps {
  canvas: FabricCanvas | null;
  selectedObject: ExtendedFabricObject | null;
}

export const FloatingToolbar = ({ canvas, selectedObject }: FloatingToolbarProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  
  useEffect(() => {
    if (!canvas || !selectedObject) return;
    
    const updatePosition = () => {
      if (!selectedObject) return;
      
      const objBounds = selectedObject.getBoundingRect();
      if (!objBounds) return;
      
      const zoom = canvas.getZoom();
      const canvasOffset = canvas.calcOffset();
      
      setPosition({
        top: (objBounds.top * zoom) + canvasOffset.top - 40,
        left: (objBounds.left + objBounds.width / 2) * zoom + canvasOffset.left - 40,
      });
    };
    
    updatePosition();
    
    canvas.on("object:moving", updatePosition);
    canvas.on("object:scaling", updatePosition);
    canvas.on("object:rotating", updatePosition);
    canvas.on("zoom", updatePosition); // Changed from "zoom:changed" to "zoom"
    
    return () => {
      canvas.off("object:moving", updatePosition);
      canvas.off("object:scaling", updatePosition);
      canvas.off("object:rotating", updatePosition);
      canvas.off("zoom", updatePosition); // Changed from "zoom:changed" to "zoom"
    };
  }, [canvas, selectedObject]);
  
  const handleCopy = () => {
    if (!canvas || !selectedObject) return;
    
    // Fixed the clone method usage to match Fabric.js v6 API
    selectedObject.clone((clonedObj: ExtendedFabricObject) => {
      clonedObj.set({
        left: (selectedObject.left || 0) + 20,
        top: (selectedObject.top || 0) + 20,
        customId: crypto.randomUUID(),
      });
      
      canvas.add(clonedObj);
      canvas.setActiveObject(clonedObj);
      canvas.renderAll();
      toast.success("Öğe kopyalandı");
    });
  };
  
  const handleDelete = () => {
    if (!canvas || !selectedObject) return;
    
    canvas.remove(selectedObject);
    canvas.renderAll();
    toast.success("Öğe silindi");
  };
  
  if (!selectedObject) return null;
  
  return (
    <div 
      className="fixed z-50 flex gap-1 bg-black/70 backdrop-blur-sm rounded-md p-1"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <button 
        onClick={handleCopy}
        className="p-1.5 hover:bg-white/20 rounded-sm text-white"
        title="Kopyala"
      >
        <Copy size={16} />
      </button>
      <button 
        onClick={handleDelete}
        className="p-1.5 hover:bg-white/20 rounded-sm text-white"
        title="Sil"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};
