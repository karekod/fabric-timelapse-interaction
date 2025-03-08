
import { useEffect, RefObject } from "react";
import { Canvas as FabricCanvas } from "fabric";
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

    // Initialize with an empty canvas - no welcome text

    setTimelineLayers([]); // Start with empty timeline layers

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

    // When new objects are added to canvas, make sure they have a customId but don't create timeline layers automatically
    fabricCanvas.on("object:added", (e) => {
      const addedObj = e.target as ExtendedFabricObject;
      if (!addedObj) return;
      
      if (!addedObj.customId) {
        addedObj.customId = crypto.randomUUID();
      }
      
      // We no longer automatically create timeline layers for new objects
      // The user will use the "Add Timeline" button to create a timeline layer
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
