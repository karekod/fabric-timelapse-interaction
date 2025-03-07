import { useState } from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
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
      
      // Update canvas object order if possible
      if (canvas) {
        const objects = canvas.getObjects();
        // Find the objects that correspond to these layers
        const currentObject = objects.find(obj => obj.customId === newLayers[index].elementId);
        const targetObject = objects.find(obj => obj.customId === newLayers[index - 1].elementId);
        
        // If both objects exist, update their positions in the canvas
        if (currentObject && targetObject) {
          // Get the target object's index
          const targetIndex = canvas.getObjects().indexOf(targetObject);
          
          // Remove the current object and insert it at the target index
          canvas.remove(currentObject);
          // Using canvas.add() and moving the object to the correct position
          canvas.add(currentObject);
          // Now move the object to the correct position in the objects array
          const objects = canvas.getObjects();
          const currentIndex = objects.indexOf(currentObject);
          if (currentIndex !== -1) {
            objects.splice(currentIndex, 1);
            objects.splice(targetIndex, 0, currentObject);
          }
          canvas.renderAll();
        }
      }
      
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
      
      // Update canvas object order if possible
      if (canvas) {
        const objects = canvas.getObjects();
        // Find the objects that correspond to these layers
        const currentObject = objects.find(obj => obj.customId === newLayers[index].elementId);
        const targetObject = objects.find(obj => obj.customId === newLayers[index + 1].elementId);
        
        // If both objects exist, update their positions in the canvas
        if (currentObject && targetObject) {
          // Get the target object's index and add 1 to place it below the target
          const targetIndex = canvas.getObjects().indexOf(targetObject) + 1;
          
          // Remove the current object and insert it at the calculated index
          canvas.remove(currentObject);
          // Using canvas.add() and moving the object to the correct position
          canvas.add(currentObject);
          // Now move the object to the correct position in the objects array
          const objects = canvas.getObjects();
          const currentIndex = objects.indexOf(currentObject);
          if (currentIndex !== -1 && targetIndex <= objects.length) {
            objects.splice(currentIndex, 1);
            objects.splice(targetIndex - 1, 0, currentObject);
          }
          canvas.renderAll();
        }
      }
      
      return newLayers;
    });
  };

  const toggleLayerVisibility = (layerId: string) => {
    setTimelineLayers(prev => prev.map(layer => {
      if (layer.id === layerId) {
        const isVisible = layer.isVisible === false ? true : false;
        
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
    <div className="space-y-2">
      <div className="text-xs font-semibold text-neutral-300 mb-2 border-b border-neutral-700 pb-1">KATMANLAR</div>
      <div className="space-y-1.5">
        {timelineLayers && timelineLayers.length > 0 ? (
          timelineLayers.map((layer) => (
            <div 
              key={layer.id}
              className="flex items-center justify-between bg-neutral-800/60 hover:bg-neutral-800 p-1.5 rounded-md group transition-colors"
            >
              <span className="text-xs truncate flex-1 pl-1">{layer.name}</span>
              <div className="flex gap-0.5">
                <button
                  onClick={() => toggleLayerVisibility(layer.id)}
                  className="p-1 hover:bg-neutral-700 rounded"
                  title={layer.isVisible === false ? "Katmanı göster" : "Katmanı gizle"}
                >
                  {layer.isVisible === false ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => moveLayerUp(layer.id)}
                  className="p-1 hover:bg-neutral-700 rounded"
                  title="Yukarı taşı"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveLayerDown(layer.id)}
                  className="p-1 hover:bg-neutral-700 rounded"
                  title="Aşağı taşı"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteLayer(layer.id)}
                  className="p-1 hover:bg-neutral-700 rounded text-red-400"
                  title="Katmanı sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-neutral-500 text-xs py-4 px-2 bg-neutral-800/20 rounded-md">
            Henüz katman yok. Tuval üzerinde bir öğe oluşturun ve seçin.
          </div>
        )}
      </div>
    </div>
  );
};
