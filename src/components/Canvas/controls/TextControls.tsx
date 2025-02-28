
import React from 'react';
import { IText, Canvas } from 'fabric';
import { Type, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { ColorPicker } from './ColorPicker';

interface TextControlsProps {
  textObject: IText;
  canvas: Canvas;
}

export const TextControls: React.FC<TextControlsProps> = ({ textObject, canvas }) => {
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
      
      <ColorPicker 
        color={textObject.get('fill') as string || '#ffffff'}
        onChange={(color) => {
          textObject.set('fill', color);
          canvas.renderAll();
        }}
        label="Text Color"
      />
    </div>
  );
};
