
import { useState, useRef } from "react";
import { Canvas as FabricCanvas, Image as FabricImage } from "fabric";
import { Button } from "@/components/ui/button";
import { PanelProps } from "@/types/sidebar";
import { toast } from "sonner";
import { Upload, Filter } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const ImagePanel = ({ canvas }: PanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<{id: string, src: string}[]>([]);
  const [selectedUploadedImage, setSelectedUploadedImage] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [blur, setBlur] = useState(0);
  const [grayscale, setGrayscale] = useState(false);
  const [sepia, setSepia] = useState(false);
  
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
        
        toast.success("Resim başarıyla yüklendi");
        
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
      toast.success("Resim tuvale eklendi");
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
        toast.error("Resim yüklenemedi");
      });
  };
  
  const applyFilters = () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'image') {
      toast.error("Lütfen önce bir resim seçin");
      return;
    }
    
    const imgObj = activeObject as FabricImage;
    
    // Build filter CSS
    let filterString = '';
    
    if (brightness !== 0) {
      filterString += `brightness(${100 + brightness}%) `;
    }
    
    if (contrast !== 0) {
      filterString += `contrast(${100 + contrast}%) `;
    }
    
    if (saturation !== 0) {
      filterString += `saturate(${100 + saturation}%) `;
    }
    
    if (blur > 0) {
      filterString += `blur(${blur}px) `;
    }
    
    if (grayscale) {
      filterString += 'grayscale(100%) ';
    }
    
    if (sepia) {
      filterString += 'sepia(100%) ';
    }
    
    // Apply CSS filters
    imgObj.filters = [];
    
    if (filterString) {
      // @ts-ignore - fabric typings issue
      imgObj.filters.push(new fabric.Image.filters.BlendColor({
        color: '#000000',
        mode: 'tint',
        alpha: 0, // This is a hack to just apply the CSS filter
      }));
      
      // Set the CSS filter directly
      if (imgObj._element) {
        imgObj._element.style.filter = filterString.trim();
      }
    } else {
      // Reset filters
      if (imgObj._element) {
        imgObj._element.style.filter = '';
      }
    }
    
    imgObj.applyFilters();
    canvas.renderAll();
    toast.success("Filtreler uygulandı");
  };
  
  const resetFilters = () => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setBlur(0);
    setGrayscale(false);
    setSepia(false);
    
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== 'image') return;
    
    const imgObj = activeObject as FabricImage;
    imgObj.filters = [];
    
    if (imgObj._element) {
      imgObj._element.style.filter = '';
    }
    
    imgObj.applyFilters();
    canvas.renderAll();
    toast.success("Filtreler sıfırlandı");
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-neutral-500 mb-4">ÖRNEK RESİMLER</div>
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
      
      <div>
        <Button 
          onClick={() => setShowFilters(!showFilters)} 
          variant="outline" 
          className="w-full mt-4 flex items-center gap-2"
        >
          <Filter size={16} /> Resim Filtreleri {showFilters ? '⬆️' : '⬇️'}
        </Button>
        
        {showFilters && (
          <div className="mt-4 p-3 bg-neutral-800/50 rounded-md space-y-3">
            <div className="text-xs font-medium text-neutral-300 mb-2">
              Filtreler (bir resim seçiliyken aktif olur)
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Parlaklık</span>
                <span>{brightness}%</span>
              </div>
              <Slider
                min={-100}
                max={100}
                step={5}
                value={[brightness]}
                onValueChange={(value) => setBrightness(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Kontrast</span>
                <span>{contrast}%</span>
              </div>
              <Slider
                min={-100}
                max={100}
                step={5}
                value={[contrast]}
                onValueChange={(value) => setContrast(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Doygunluk</span>
                <span>{saturation}%</span>
              </div>
              <Slider
                min={-100}
                max={100}
                step={5}
                value={[saturation]}
                onValueChange={(value) => setSaturation(value[0])}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Bulanıklık</span>
                <span>{blur}px</span>
              </div>
              <Slider
                min={0}
                max={10}
                step={0.5}
                value={[blur]}
                onValueChange={(value) => setBlur(value[0])}
              />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="grayscale" className="text-xs">Siyah-Beyaz</Label>
              <Switch
                id="grayscale"
                checked={grayscale}
                onCheckedChange={setGrayscale}
              />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <Label htmlFor="sepia" className="text-xs">Sepya</Label>
              <Switch
                id="sepia"
                checked={sepia}
                onCheckedChange={setSepia}
              />
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={applyFilters}
              >
                Uygula
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={resetFilters}
              >
                Sıfırla
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
