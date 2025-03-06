
import { useState, useRef } from "react";
import { Canvas as FabricCanvas, Image as FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { PanelProps } from "@/types/sidebar";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export const UploadsPanel = ({ canvas }: PanelProps) => {
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

  return (
    <div className="space-y-4">
      <div className="text-xs text-neutral-500 mb-4">UPLOAD IMAGE</div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        ref={fileInputRef}
      />
      <Button 
        variant="secondary" 
        onClick={() => fileInputRef.current?.click()}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        Select Image
      </Button>
      
      <div className="text-xs text-neutral-500 mt-6 mb-2">UPLOADED IMAGES</div>
      <div className={`${uploadedImages.length === 0 ? 'flex items-center justify-center' : 'grid grid-cols-2 gap-2'} h-40 bg-neutral-800/30 rounded-lg overflow-auto p-2`}>
        {uploadedImages.length === 0 ? (
          <span className="text-neutral-500 text-xs">Your uploaded images will appear here</span>
        ) : (
          uploadedImages.map(img => (
            <div 
              key={img.id}
              onClick={() => addUploadedImageToCanvas(img.src)}
              className={`cursor-pointer border-2 rounded p-1 flex items-center justify-center h-full
                ${selectedUploadedImage === img.id ? 'border-blue-500' : 'border-transparent hover:border-neutral-500'}`}
            >
              <img 
                src={img.src} 
                alt="Uploaded image" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
