
import React from 'react';
import { Object as FabricObject, Canvas } from 'fabric';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommonControlsProps {
  selectedObject: FabricObject;
  canvas: Canvas;
}

export const CommonControls: React.FC<CommonControlsProps> = ({ selectedObject, canvas }) => {
  const handleBringForward = () => {
    if (!canvas || !selectedObject) return;
    
    const objects = canvas.getObjects();
    const currentIndex = objects.indexOf(selectedObject);
    const newIndex = currentIndex + 1;
    
    if (newIndex < objects.length) {
      // In Fabric.js v6, we need to rearrange the objects array
      objects.splice(currentIndex, 1);
      objects.splice(newIndex, 0, selectedObject);
      canvas.renderAll();
    }
  };
  
  const handleSendBackward = () => {
    if (!canvas || !selectedObject) return;
    
    const objects = canvas.getObjects();
    const currentIndex = objects.indexOf(selectedObject);
    const newIndex = Math.max(0, currentIndex - 1);
    
    if (currentIndex > 0) {
      // In Fabric.js v6, we need to rearrange the objects array
      objects.splice(currentIndex, 1);
      objects.splice(newIndex, 0, selectedObject);
      canvas.renderAll();
    }
  };
  
  const handleRemove = () => {
    canvas.remove(selectedObject);
    canvas.renderAll();
  };

  return (
    <div className="flex gap-2 items-center">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8" 
        onClick={handleBringForward}
      >
        <ArrowUp className="w-4 h-4" />
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8" 
        onClick={handleSendBackward}
      >
        <ArrowDown className="w-4 h-4" />
      </Button>
      
      <Button 
        variant="destructive" 
        size="sm" 
        className="h-8" 
        onClick={handleRemove}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};
