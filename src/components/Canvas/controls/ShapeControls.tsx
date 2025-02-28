
import React from 'react';
import { Object as FabricObject, Canvas } from 'fabric';
import { Palette, RotateCw, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShapeControlsProps {
  selectedObject: FabricObject;
  canvas: Canvas;
}

export const ShapeControls: React.FC<ShapeControlsProps> = ({ selectedObject, canvas }) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8" 
        onClick={() => {
          selectedObject.rotate((selectedObject.angle || 0) + 45);
          canvas.renderAll();
        }}
      >
        <RotateCw className="w-4 h-4 mr-1" />
        <span>Rotate</span>
      </Button>
      
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4" />
        <input 
          type="color" 
          className="w-6 h-6 bg-transparent border-0 p-0"
          value={selectedObject.get('fill') as string || '#ffffff'}
          onChange={(e) => {
            selectedObject.set('fill', e.target.value);
            canvas.renderAll();
          }}
        />
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8" 
        onClick={() => {
          selectedObject.set('stroke', selectedObject.get('stroke') ? '' : '#ffffff');
          selectedObject.set('strokeWidth', selectedObject.get('stroke') ? 2 : 0);
          canvas.renderAll();
        }}
      >
        <Square className="w-4 h-4 mr-1" />
        <span>{selectedObject.get('stroke') ? 'No Border' : 'Add Border'}</span>
      </Button>
    </div>
  );
};
