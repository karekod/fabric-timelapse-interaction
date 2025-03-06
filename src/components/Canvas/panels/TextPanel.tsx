
import { useState } from 'react';
import { Canvas, IText } from 'fabric';
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface TextPanelProps {
  canvas: Canvas | null;
}

export const TextPanel = ({ canvas }: TextPanelProps) => {
  const [textColor, setTextColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");

  const addText = (type: "heading" | "subheading" | "body") => {
    if (!canvas) return;

    const styles = {
      heading: { fontSize: 32, fontWeight: "bold" },
      subheading: { fontSize: 24, fontWeight: "semibold" },
      body: { fontSize: 16 },
    };

    const text = new IText(`Double click to edit ${type}`, {
      left: 100,
      top: 100,
      fill: textColor,
      fontFamily: fontFamily,
      ...styles[type],
    });

    text.customId = crypto.randomUUID();
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const applyColorToSelectedText = (color: string) => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'i-text') {
      activeObject.set('fill', color);
      canvas.renderAll();
      toast.success("Color applied");
    } else {
      toast.error("No text selected");
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-neutral-500 mb-4">ADD TEXT</div>
      <div className="space-y-2">
        <button 
          onClick={() => addText("heading")}
          className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
        >
          <span className="text-sm font-semibold">H1</span>
          <span>Heading</span>
        </button>
        <button 
          onClick={() => addText("subheading")}
          className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
        >
          <span className="text-sm font-semibold">H2</span>
          <span>Subheading</span>
        </button>
        <button 
          onClick={() => addText("body")}
          className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2"
        >
          <span className="text-sm font-semibold">T</span>
          <span>Body Text</span>
        </button>
      </div>
      
      <div className="text-xs text-neutral-500 mt-6 mb-2">TEXT OPTIONS</div>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Text Color</label>
          <input 
            type="color" 
            value={textColor}
            onChange={(e) => {
              setTextColor(e.target.value);
              applyColorToSelectedText(e.target.value);
            }}
            className="w-full h-8 rounded cursor-pointer"
          />
        </div>
        
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Font Family</label>
          <select 
            value={fontFamily}
            onChange={(e) => {
              const oldValue = fontFamily;
              setFontFamily(e.target.value);
              
              const activeObject = canvas?.getActiveObject();
              if (activeObject && activeObject.type === 'i-text') {
                (activeObject as IText).set('fontFamily', e.target.value);
                canvas?.renderAll();
              }
            }}
            className="w-full rounded bg-neutral-800 p-2 text-sm"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
        </div>
        
        <div>
          <label className="text-xs text-neutral-400 block mb-1">Font Size: {fontSize}px</label>
          <Slider
            value={[fontSize]}
            min={8}
            max={72}
            step={1}
            onValueChange={(value) => {
              setFontSize(value[0]);
              
              const activeObject = canvas?.getActiveObject();
              if (activeObject && activeObject.type === 'i-text') {
                (activeObject as IText).set('fontSize', value[0]);
                canvas?.renderAll();
              }
            }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
