
import React from 'react';
import { Object as FabricObject, Canvas } from 'fabric';
import { FlipHorizontal, FlipVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageControlsProps {
  selectedObject: FabricObject;
  canvas: Canvas;
}

export const ImageControls: React.FC<ImageControlsProps> = ({ selectedObject, canvas }) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8" 
        onClick={() => {
          selectedObject.flipX = !selectedObject.flipX;
          canvas.renderAll();
        }}
      >
        <FlipHorizontal className="w-4 h-4 mr-1" />
        <span>Flip H</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8" 
        onClick={() => {
          selectedObject.flipY = !selectedObject.flipY;
          canvas.renderAll();
        }}
      >
        <FlipVertical className="w-4 h-4 mr-1" />
        <span>Flip V</span>
      </Button>
      
      <div className="flex items-center gap-1">
        <span className="text-xs">Opacity</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1"
          className="w-20"
          value={selectedObject.opacity || 1}
          onChange={(e) => {
            selectedObject.set('opacity', parseFloat(e.target.value));
            canvas.renderAll();
          }}
        />
      </div>
    </div>
  );
};
