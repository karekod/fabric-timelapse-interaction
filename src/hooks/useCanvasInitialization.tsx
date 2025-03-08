
import { useEffect, RefObject } from "react";
import { Canvas as FabricCanvas, IText } from "fabric";
import { TimelineLayer } from "@/types/animation";
import { ExtendedFabricObject } from "./useCanvasState";
import { toast } from "sonner";

interface UseCanvasInitializationProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  setCanvas: (canvas: FabricCanvas) => void;
  setSelectedObject: (object: ExtendedFabricObject | null) => void;
  setTimelineLayers: React.Dispatch<React.SetStateAction<TimelineLayer[]>>;
  timelineLayers: TimelineLayer[];
}

export function useCanvasInitialization({
  canvasRef,
  setCanvas,
  setSelectedObject,
  setTimelineLayers,
  timelineLayers
}: UseCanvasInitializationProps) {
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth * 0.7,
      height: window.innerHeight * 0.6,
      backgroundColor: "#0f1116",
    });

    // Add welcome text
    const welcomeText = new IText("Canvas Animation'a Hoş Geldiniz", {
      left: fabricCanvas.width! / 2,
      top: fabricCanvas.height! / 2,
      originX: 'center',
      originY: 'center',
      fill: "#ffffff",
      fontSize: 24,
      fontWeight: "bold"
    });
    welcomeText.customId = crypto.randomUUID();
    fabricCanvas.add(welcomeText);

    // Create an initial layer for the welcome text
    const initialLayer: TimelineLayer = {
      id: crypto.randomUUID(),
      elementId: welcomeText.customId!,
      name: 'Karşılama Metni',
      isVisible: true,
      keyframes: [{
        id: crypto.randomUUID(),
        startTime: 0,
        duration: 20,
        animationType: 'move',
        properties: {},
        effects: [], // Add the required effects array
      }],
    };
    setTimelineLayers([initialLayer]);

    fabricCanvas.on("selection:created", (e) => {
      const selectedObj = fabricCanvas.getActiveObject() as ExtendedFabricObject;
      if (!selectedObj.customId) {
        selectedObj.customId = crypto.randomUUID();
      }
      setSelectedObject(selectedObj);
    });

    fabricCanvas.on("selection:updated", (e) => {
      const selectedObj = fabricCanvas.getActiveObject() as ExtendedFabricObject;
      if (!selectedObj.customId) {
        selectedObj.customId = crypto.randomUUID();
      }
      setSelectedObject(selectedObj);
    });

    fabricCanvas.on("selection:cleared", () => {
      setSelectedObject(null);
    });

    // When new objects are added to canvas, automatically create a layer for them
    fabricCanvas.on("object:added", (e) => {
      const addedObj = e.target as ExtendedFabricObject;
      if (!addedObj || addedObj === welcomeText) return;
      
      if (!addedObj.customId) {
        addedObj.customId = crypto.randomUUID();
      }
      
      // Check if there's already a layer for this object
      const existingLayer = timelineLayers.find(layer => layer.elementId === addedObj.customId);
      if (!existingLayer) {
        const newLayer: TimelineLayer = {
          id: crypto.randomUUID(),
          elementId: addedObj.customId,
          name: addedObj.type === 'i-text' ? 'Metin' : addedObj.type || 'Nesne',
          isVisible: true,
          keyframes: [{
            id: crypto.randomUUID(),
            startTime: 0,
            duration: 20,
            animationType: 'move',
            properties: {},
            effects: [], // Add the required effects array
          }],
        };
        setTimelineLayers(prev => [...prev, newLayer]);
      }
    });

    setCanvas(fabricCanvas);

    const handleResize = () => {
      fabricCanvas.setWidth(window.innerWidth * 0.7);
      fabricCanvas.setHeight(window.innerHeight * 0.6);
      fabricCanvas.renderAll();
    };

    window.addEventListener("resize", handleResize);

    // Listen for timeline layer updates from Sidebar
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'UPDATE_TIMELINE_LAYERS' && event.data.layers) {
        setTimelineLayers(prevLayers => [...prevLayers, ...event.data.layers]);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      fabricCanvas.dispose();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Apply visibility changes when timelineLayers change
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const fabricCanvas = canvas as unknown as FabricCanvas;
    if (!fabricCanvas || !fabricCanvas.getObjects) return;
    
    const objects = fabricCanvas.getObjects();
    
    timelineLayers.forEach(layer => {
      if (layer.isVisible === false) {
        const targetObject = objects.find((obj: any) => obj.customId === layer.elementId);
        if (targetObject) {
          targetObject.visible = false;
        }
      }
    });
    
    if (fabricCanvas.renderAll) {
      fabricCanvas.renderAll();
    }
  }, [timelineLayers, canvasRef]);
}
