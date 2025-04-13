
import { useState } from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { ArrowUp, ArrowDown, EyeOff, Eye, Trash2, Edit2 } from "lucide-react";
import { TimelineLayer } from "@/types/animation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LayersPanelProps {
  canvas: Canvas | null;
  timelineLayers: TimelineLayer[];
  setTimelineLayers: React.Dispatch<React.SetStateAction<TimelineLayer[]>>;
}

export const LayersPanel = ({ canvas, timelineLayers, setTimelineLayers }: LayersPanelProps) => {
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [editLayerName, setEditLayerName] = useState("");
  
  const moveLayerUp = (layerId: string) => {
    if (!canvas) return;
    
    setTimelineLayers(prev => {
      const index = prev.findIndex(layer => layer.id === layerId);
      if (index <= 0) return prev;
      
      const newLayers = [...prev];
      const temp = newLayers[index];
      newLayers[index] = newLayers[index - 1];
      newLayers[index - 1] = temp;
      
      // Update canvas object stacking order
      updateCanvasObjectOrder(newLayers);
      
      toast.success("Katman yukarı taşındı");
      return newLayers;
    });
  };

  const moveLayerDown = (layerId: string) => {
    if (!canvas) return;
    
    setTimelineLayers(prev => {
      const index = prev.findIndex(layer => layer.id === layerId);
      if (index === -1 || index === prev.length - 1) return prev;
      
      const newLayers = [...prev];
      const temp = newLayers[index];
      newLayers[index] = newLayers[index + 1];
      newLayers[index + 1] = temp;
      
      // Update canvas object stacking order
      updateCanvasObjectOrder(newLayers);
      
      toast.success("Katman aşağı taşındı");
      return newLayers;
    });
  };
  
  const updateCanvasObjectOrder = (layers: TimelineLayer[]) => {
    if (!canvas) return;
    
    // Reorder objects based on layer order
    const canvasObjects = canvas.getObjects();
    
    // First, find all objects that correspond to our layers
    const orderedObjects: FabricObject[] = [];
    
    layers.forEach(layer => {
      const obj = canvasObjects.find(o => o.customId === layer.elementId);
      if (obj) {
        orderedObjects.push(obj);
      }
    });
    
    // Now rearrange objects in canvas
    if (orderedObjects.length > 0) {
      orderedObjects.forEach((obj, index) => {
        // The higher the index, the higher the object should be in stacking
        canvas.bringObjectToFront(obj);
      });
      
      canvas.renderAll();
    }
  };

  const toggleLayerVisibility = (layerId: string) => {
    if (!canvas) return;
    
    setTimelineLayers(prev => {
      const updatedLayers = prev.map(layer => {
        if (layer.id === layerId) {
          // Toggle the visibility
          const newVisibility = layer.isVisible === false ? true : false;
          
          // Find and update the corresponding canvas object
          const objects = canvas.getObjects();
          const targetObject = objects.find(obj => obj.customId === layer.elementId);
          
          if (targetObject) {
            targetObject.visible = newVisibility;
            canvas.renderAll();
          }
          
          return { ...layer, isVisible: newVisibility };
        }
        return layer;
      });
      
      return updatedLayers;
    });
  };

  const deleteLayer = (layerId: string) => {
    if (!canvas) return;
    
    setTimelineLayers(prev => {
      const layerToDelete = prev.find(layer => layer.id === layerId);
      
      if (layerToDelete) {
        const objects = canvas.getObjects();
        const targetObject = objects.find(obj => obj.customId === layerToDelete.elementId);
        
        if (targetObject) {
          canvas.remove(targetObject);
          canvas.renderAll();
          toast.success("Katman ve öğe silindi");
        }
      }
      
      return prev.filter(layer => layer.id !== layerId);
    });
  };
  
  const startEditingLayer = (layerId: string, currentName: string) => {
    setEditingLayerId(layerId);
    setEditLayerName(currentName);
  };
  
  const saveLayerName = () => {
    if (!editingLayerId || !editLayerName.trim()) {
      setEditingLayerId(null);
      return;
    }
    
    setTimelineLayers(prev => 
      prev.map(layer => 
        layer.id === editingLayerId 
          ? { ...layer, name: editLayerName.trim() } 
          : layer
      )
    );
    
    setEditingLayerId(null);
    toast.success("Katman adı güncellendi");
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
              {editingLayerId === layer.id ? (
                <div className="flex-1 flex gap-1">
                  <Input
                    value={editLayerName}
                    onChange={(e) => setEditLayerName(e.target.value)}
                    className="h-6 text-xs py-0 px-1"
                    autoFocus
                    onBlur={saveLayerName}
                    onKeyDown={(e) => e.key === 'Enter' && saveLayerName()}
                  />
                </div>
              ) : (
                <span 
                  className="text-xs truncate flex-1 pl-1"
                  onClick={() => startEditingLayer(layer.id, layer.name)}
                >
                  {layer.name}
                </span>
              )}
              
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
                  onClick={() => startEditingLayer(layer.id, layer.name)}
                  className="p-1 hover:bg-neutral-700 rounded"
                  title="Katman adını düzenle"
                >
                  <Edit2 className="w-3.5 h-3.5" />
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
            Henüz katman yok. Tuval üzerinde bir öğe oluşturun ve "Zaman Çizelgesi Ekle" düğmesini kullanın.
          </div>
        )}
      </div>
    </div>
  );
};
