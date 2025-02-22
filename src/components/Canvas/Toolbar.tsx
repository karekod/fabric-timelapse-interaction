
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Square, Circle, Type, Trash2, 
  Move, RotateCw, ZoomIn, ZoomOut 
} from "lucide-react";
import { Canvas as FabricCanvas, Circle as FabricCircle, Rect, IText } from "fabric";

interface ToolbarProps {
  canvas: FabricCanvas | null;
  selectedObject: any;
}

export const Toolbar = ({ canvas, selectedObject }: ToolbarProps) => {
  const addShape = (type: string) => {
    if (!canvas) return;

    let object;
    switch (type) {
      case "rectangle":
        object = new Rect({
          left: 100,
          top: 100,
          fill: "#ffffff",
          width: 100,
          height: 100,
        });
        break;
      case "circle":
        object = new FabricCircle({
          left: 100,
          top: 100,
          fill: "#ffffff",
          radius: 50,
        });
        break;
      case "text":
        object = new IText("Double click to edit", {
          left: 100,
          top: 100,
          fill: "#ffffff",
          fontSize: 20,
        });
        break;
    }

    if (object) {
      canvas.add(object);
      canvas.setActiveObject(object);
      canvas.renderAll();
    }
  };

  const deleteSelected = () => {
    if (!canvas || !selectedObject) return;
    canvas.remove(selectedObject);
    canvas.renderAll();
  };

  return (
    <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700 space-y-4">
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => addShape("rectangle")}
          className="w-10 h-10"
        >
          <Square className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => addShape("circle")}
          className="w-10 h-10"
        >
          <Circle className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => addShape("text")}
          className="w-10 h-10"
        >
          <Type className="h-5 w-5" />
        </Button>
      </div>
      <Separator className="bg-neutral-700" />
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10"
          disabled={!selectedObject}
        >
          <Move className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10"
          disabled={!selectedObject}
        >
          <RotateCw className="h-5 w-5" />
        </Button>
      </div>
      <Separator className="bg-neutral-700" />
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10"
          onClick={deleteSelected}
          disabled={!selectedObject}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
