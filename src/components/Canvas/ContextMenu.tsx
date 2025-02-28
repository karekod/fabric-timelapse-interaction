
import React from 'react';
import { Object as FabricObject, IText, Image as FabricImage, Canvas } from 'fabric';
import { 
  ChevronDown, 
  Type, 
  Palette, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Trash2,
  ArrowUp,
  ArrowDown,
  Image,
  Square
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface ContextMenuProps {
  selectedObject: FabricObject | null;
  canvas: Canvas | null;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ selectedObject, canvas }) => {
  if (!selectedObject || !canvas) return null;
  
  // Determine type of selected object
  const isText = selectedObject instanceof IText;
  const isImage = selectedObject instanceof FabricImage;
  const isShape = !isText && !isImage;
  
  // Common controls for all types
  const handleRemove = () => {
    canvas.remove(selectedObject);
    canvas.renderAll();
  };
  
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
  
  // For text objects
  const renderTextControls = () => {
    const textObject = selectedObject as IText;
    
    return (
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4" />
          <select 
            className="bg-neutral-800 border border-neutral-700 rounded text-sm p-1" 
            value={textObject.get('fontFamily') || 'Arial'}
            onChange={(e) => {
              textObject.set('fontFamily', e.target.value);
              canvas.renderAll();
            }}
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            min="6" 
            max="72" 
            className="w-14 bg-neutral-800 border border-neutral-700 rounded text-sm p-1"
            value={textObject.get('fontSize') || 16}
            onChange={(e) => {
              textObject.set('fontSize', parseInt(e.target.value));
              canvas.renderAll();
            }}
          />
        </div>
        
        <div className="flex items-center bg-neutral-800 border border-neutral-700 rounded overflow-hidden">
          <button 
            className="p-1 hover:bg-neutral-700"
            onClick={() => {
              textObject.set('textAlign', 'left');
              canvas.renderAll();
            }}
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button 
            className="p-1 hover:bg-neutral-700"
            onClick={() => {
              textObject.set('textAlign', 'center');
              canvas.renderAll();
            }}
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button 
            className="p-1 hover:bg-neutral-700"
            onClick={() => {
              textObject.set('textAlign', 'right');
              canvas.renderAll();
            }}
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4" />
          <input 
            type="color" 
            className="w-6 h-6 bg-transparent border-0 p-0"
            value={textObject.get('fill') as string || '#ffffff'}
            onChange={(e) => {
              textObject.set('fill', e.target.value);
              canvas.renderAll();
            }}
          />
        </div>
      </div>
    );
  };
  
  // For image objects
  const renderImageControls = () => {
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
  
  // For shape objects
  const renderShapeControls = () => {
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
  
  // Common controls
  const commonControls = (
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
  
  // Render based on object type
  return (
    <div className="absolute left-0 right-0 top-0 bg-neutral-900/90 border-b border-neutral-700 p-3 flex items-center justify-between">
      <div className="flex items-center">
        {isText && (
          <>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Type className="w-4 h-4" />
              <span>Text</span>
            </div>
            <div className="w-px h-6 bg-neutral-700 mx-3"></div>
            {renderTextControls()}
          </>
        )}
        
        {isImage && (
          <>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Image className="w-4 h-4" />
              <span>Image</span>
            </div>
            <div className="w-px h-6 bg-neutral-700 mx-3"></div>
            {renderImageControls()}
          </>
        )}
        
        {isShape && (
          <>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Square className="w-4 h-4" />
              <span>Shape</span>
            </div>
            <div className="w-px h-6 bg-neutral-700 mx-3"></div>
            {renderShapeControls()}
          </>
        )}
      </div>
      
      {commonControls}
    </div>
  );
};
