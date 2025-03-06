
import { useState } from "react";
import { Canvas as FabricCanvas, Image as FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { PanelProps } from "@/types/sidebar";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { useRef } from "react";

export const ImagePanel = ({ canvas }: PanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<{id: string, src: string}[]>([]);
  const [selectedUploadedImage, setSelectedUploadedImage] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const imgElement = document.createElement('img');
      imgElement.src = event.target?.result as string;
      
      imgElement.onload = () => {
        const imageId = crypto.randomUUID();
        setUploadedImages(prev => [...prev, {
          id: imageId,
          src: event.target?.result as string
        }]);
        
        toast.success("Image uploaded successfully");
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
    };
    
    reader.readAsDataURL(file);
  };

  const addUploadedImageToCanvas = (imageSrc: string) => {
    if (!canvas) return;
    
    const imgElement = document.createElement('img');
    imgElement.src = imageSrc;
    
    imgElement.onload = () => {
      const fabricImage = new FabricImage(imgElement);
      
      if (fabricImage.width && fabricImage.width > 300) {
        const scale = 300 / fabricImage.width;
        fabricImage.scale(scale);
      }
      
      fabricImage.set({
        left: 100,
        top: 100,
      });
      
      fabricImage.customId = crypto.randomUUID();
      canvas.add(fabricImage);
      canvas.setActiveObject(fabricImage);
      canvas.renderAll();
      toast.success("Image added to canvas");
    };
  };

  const addExampleImage = (url: string) => {
    if (!canvas) return;
    
    FabricImage.fromURL(url)
      .then((img) => {
        if (img.width && img.width > 300) {
          const scale = 300 / img.width;
          img.scale(scale);
        }
        
        img.set({
          left: 100,
          top: 100,
        });
        
        img.customId = crypto.randomUUID();
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      })
      .catch(err => {
        console.error("Error loading image:", err);
        toast.error("Failed to load image");
      });
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-neutral-500 mb-4">EXAMPLE IMAGES</div>
      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => addExampleImage("https://picsum.photos/id/237/200/300")}
          className="bg-neutral-800/50 hover:bg-neutral-800 rounded-lg p-1 h-24 flex items-center justify-center overflow-hidden"
        >
          <img 
            src="https://picsum.photos/id/237/200/300" 
            alt="Example dog" 
            className="max-h-full max-w-full object-contain"
          />
        </button>
        <button 
          onClick={() => addExampleImage("https://picsum.photos/id/1005/200/300")}
          className="bg-neutral-800/50 hover:bg-neutral-800 rounded-lg p-1 h-24 flex items-center justify-center overflow-hidden"
        >
          <img 
            src="https://picsum.photos/id/1005/200/300" 
            alt="Example person" 
            className="max-h-full max-w-full object-contain"
          />
        </button>
        <button 
          onClick={() => addExampleImage("https://picsum.photos/id/1074/200/300")}
          className="bg-neutral-800/50 hover:bg-neutral-800 rounded-lg p-1 h-24 flex items-center justify-center overflow-hidden"
        >
          <img 
            src="https://picsum.photos/id/1074/200/300" 
            alt="Example landscape" 
            className="max-h-full max-w-full object-contain"
          />
        </button>
        <button 
          onClick={() => addExampleImage("https://picsum.photos/id/96/200/300")}
          className="bg-neutral-800/50 hover:bg-neutral-800 rounded-lg p-1 h-24 flex items-center justify-center overflow-hidden"
        >
          <img 
            src="https://picsum.photos/id/96/200/300" 
            alt="Example object" 
            className="max-h-full max-w-full object-contain"
          />
        </button>
      </div>
    </div>
  );
};
