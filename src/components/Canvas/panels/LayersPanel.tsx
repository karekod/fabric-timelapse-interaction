
import { useState } from 'react';
import { Canvas } from 'fabric';
import { ArrowUp, ArrowDown, EyeOff, Eye, Trash2 } from "lucide-react";
import { TimelineLayer } from "@/types/animation";

interface LayersPanelProps {
  canvas: Canvas | null;
  timelineLayers: TimelineLayer[];
  setTimelineLayers: React.Dispatch<React.SetStateAction<TimelineLayer[]>>;
}

export const LayersPanel = ({ canvas, timelineLayers, setTimelineLayers }: LayersPanelProps) => {
  const moveLayerUp = (layerId: string) => {
    setTimelineLayers(prev => {
      const index = prev.findIndex(layer => layer.id === layerId);
      if (index <= 0) return prev;
      
      const newLayers = [...prev];
      const temp = newLayers[index];
      newLayers[index] = newLayers[index - 1];
      newLayers[index - 1] = temp;
      
      return newLayers;
    });
  };

  const moveLayerDown = (layerId: string) => {
    setTimelineLayers(prev => {
      const index = prev.findIndex(layer => layer.id === layerId);
      if (index === -1 || index === prev.length - 1) return prev;
      
      const newLayers = [...prev];
      const temp = newLayers[index];
      newLayers[index] = newLayers[index + 1];
      newLayers[index + 1] = temp;
      
      return newLayers;
    });
  };

  const toggleLayerVisibility = (layerId: string) => {
    setTimelineLayers(prev => prev.map(layer => {
      if (layer.id === layerId) {
        const isVisible = !layer.isVisible;
        
        if (canvas) {
          const objects = canvas.getObjects();
          const targetObject = objects.find(obj => obj.customId === layer.elementId);
          if (targetObject) {
            targetObject.visible = isVisible;
            canvas.renderAll();
          }
        }
        
        return { ...layer, isVisible };
      }
      return layer;
    }));
  };

  const deleteLayer = (layerId: string) => {
    setTimelineLayers(prev => {
      const layerToDelete = prev.find(layer => layer.id === layerId);
      if (layerToDelete && canvas) {
        const objects = canvas.getObjects();
        const targetObject = objects.find(obj => obj.customId === layerToDelete.elementId);
        if (targetObject) {
          canvas.remove(targetObject);
          canvas.renderAll();
        }
      }
      return prev.filter(layer => layer.id !== layerId);
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-neutral-500 mb-4">LAYERS</div>
      <div className="space-y-2">
        {timelineLayers.map((layer) => (
          <div 
            key={layer.id}
            className="flex items-center justify-between bg-neutral-800/50 p-2 rounded-lg group"
          >
            <span className="text-sm truncate flex-1">{layer.name}</span>
            <div className="flex gap-1">
              <button
                onClick={() => toggleLayerVisibility(layer.id)}
                className="p-1 hover:bg-neutral-700 rounded"
              >
                {layer.isVisible === false ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => moveLayerUp(layer.id)}
                className="p-1 hover:bg-neutral-700 rounded"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => moveLayerDown(layer.id)}
                className="p-1 hover:bg-neutral-700 rounded"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteLayer(layer.id)}
                className="p-1 hover:bg-neutral-700 rounded text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {timelineLayers.length === 0 && (
          <div className="text-center text-neutral-500 text-sm py-4">
            No layers available
          </div>
        )}
      </div>
    </div>
  );
};
