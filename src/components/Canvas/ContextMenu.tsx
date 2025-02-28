
import React from 'react';
import { Object as FabricObject, IText, Image as FabricImage, Canvas } from 'fabric';
import { Type, Image, Square } from 'lucide-react';
import { TextControls } from './controls/TextControls';
import { ImageControls } from './controls/ImageControls';
import { ShapeControls } from './controls/ShapeControls';
import { CommonControls } from './controls/CommonControls';

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
            <TextControls textObject={selectedObject as IText} canvas={canvas} />
          </>
        )}
        
        {isImage && (
          <>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Image className="w-4 h-4" />
              <span>Image</span>
            </div>
            <div className="w-px h-6 bg-neutral-700 mx-3"></div>
            <ImageControls selectedObject={selectedObject} canvas={canvas} />
          </>
        )}
        
        {isShape && (
          <>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Square className="w-4 h-4" />
              <span>Shape</span>
            </div>
            <div className="w-px h-6 bg-neutral-700 mx-3"></div>
            <ShapeControls selectedObject={selectedObject} canvas={canvas} />
          </>
        )}
      </div>
      
      <CommonControls selectedObject={selectedObject} canvas={canvas} />
    </div>
  );
};
