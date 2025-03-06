
import { useState } from 'react';
import { Canvas, Rect, Circle } from 'fabric';
import { toast } from "sonner";

interface ShapesPanelProps {
  canvas: Canvas | null;
}

export const ShapesPanel = ({ canvas }: ShapesPanelProps) => {
  const [shapeColor, setShapeColor] = useState("#ffffff");

  const addShape = (type: "rectangle" | "circle") => {
    if (!canvas) return;

    let object;
    switch (type) {
      case "rectangle":
        object = new Rect({
          left: 100,
          top: 100,
          fill: shapeColor,
          width: 100,
          height: 100,
        });
        break;
      case "circle":
        object = new Circle({
          left: 100,
          top: 100,
          fill: shapeColor,
          radius: 50,
        });
        break;
    }

    if (object) {
      object.customId = crypto.randomUUID();
      canvas.add(object);
      canvas.setActiveObject(object);
      canvas.renderAll();
    }
  };

  const applyColorToSelectedObject = (color: string) => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.set('fill', color);
      canvas.renderAll();
      toast.success("Color applied");
    } else {
      toast.error("No object selected");
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-neutral-500 mb-4">ADD SHAPE</div>
      <div className="space-y-2">
        <button 
          onClick={() => addShape("rectangle")}
          className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
        >
          <span className="text-sm">◻️</span>
          <span>Rectangle</span>
        </button>
        <button 
          onClick={() => addShape("circle")}
          className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
        >
          <span className="text-sm">⭕</span>
          <span>Circle</span>
        </button>
      </div>
      
      <div className="text-xs text-neutral-500 mt-6 mb-2">SHAPE COLOR</div>
      <div className="space-y-2">
        <input 
          type="color" 
          value={shapeColor}
          onChange={(e) => {
            setShapeColor(e.target.value);
            applyColorToSelectedObject(e.target.value);
          }}
          className="w-full h-8 rounded cursor-pointer"
        />
        
        <div className="grid grid-cols-5 gap-2">
          {["#FF5733", "#33FF57", "#3357FF", "#F3FF33", "#FF33F3"].map(color => (
            <button 
              key={color}
              onClick={() => {
                setShapeColor(color);
                applyColorToSelectedObject(color);
              }}
              className="w-full h-8 rounded-md"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
