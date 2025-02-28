
import React, { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  // Vivid colors
  '#9b87f5', '#D946EF', '#F97316', '#0EA5E9', '#8B5CF6',
  // Neutral colors
  '#FFFFFF', '#8E9196', '#403E43', '#222222', '#000000',
  // Soft colors
  '#E5DEFF', '#FFDEE2', '#FDE1D3', '#D3E4FD', '#F1F0FB'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ 
  color, 
  onChange,
  label = "Color"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Palette className="w-4 h-4 mr-1" />
        <span>{label}</span>
        <div 
          className="w-4 h-4 ml-1 rounded-sm border border-neutral-400" 
          style={{ backgroundColor: color }}
        />
      </Button>

      {isOpen && (
        <div className="absolute z-50 mt-1 p-3 bg-neutral-900 border border-neutral-700 rounded-md shadow-lg w-56">
          <div className="mb-3">
            <div className="grid grid-cols-5 gap-1 mb-3">
              {PRESET_COLORS.map((presetColor, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded-md transition hover:scale-110 ${
                    color === presetColor ? 'ring-2 ring-white' : ''
                  }`}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => {
                    onChange(presetColor);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-neutral-400">Custom:</span>
              <input 
                type="color" 
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="w-8 h-8 bg-transparent border-0 p-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
