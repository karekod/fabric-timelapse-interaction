
import { useState, useEffect } from "react";
import { PanelProps } from "@/types/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Moon, Sun, Check, X } from "lucide-react";

export const SettingsPanel = ({ canvas }: PanelProps) => {
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isValidKey, setIsValidKey] = useState<boolean | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  
  // Load saved API key and theme from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("gemini_api_key");
    if (savedApiKey) {
      setGeminiApiKey(savedApiKey);
      setIsValidKey(true);
    }
    
    // Check stored theme preference
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);
  
  const validateGeminiApiKey = async () => {
    if (!geminiApiKey.trim()) {
      toast.error("Lütfen bir Gemini API anahtarı girin");
      return;
    }
    
    setIsValidating(true);
    
    try {
      // Simple API key validation - check if it starts with "AI" and has proper length
      const isValidFormat = geminiApiKey.startsWith("AI") && geminiApiKey.length > 20;
      
      // Simulate API validation delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (isValidFormat) {
        setIsValidKey(true);
        localStorage.setItem("gemini_api_key", geminiApiKey);
        toast.success("API anahtarı başarıyla kaydedildi!");
      } else {
        setIsValidKey(false);
        toast.error("Geçersiz API anahtarı formatı");
      }
    } catch (error) {
      console.error("API key validation failed:", error);
      setIsValidKey(false);
      toast.error("API anahtarı doğrulaması başarısız oldu");
    } finally {
      setIsValidating(false);
    }
  };
  
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    
    toast.success(newDarkMode ? "Koyu tema etkinleştirildi" : "Açık tema etkinleştirildi");
  };
  
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-neutral-500 mb-4">TEMA AYARLARI</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4 text-neutral-400" />
            <Label htmlFor="theme-toggle" className="text-sm">
              {isDarkMode ? "Koyu Tema" : "Açık Tema"}
            </Label>
            <Moon className="h-4 w-4 text-neutral-400" />
          </div>
          <Switch
            id="theme-toggle"
            checked={isDarkMode}
            onCheckedChange={toggleTheme}
          />
        </div>
      </div>
      
      <div>
        <div className="text-xs text-neutral-500 mb-4">API AYARLARI</div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-neutral-400">Gemini API Anahtarı</label>
            <div className="relative">
              <Input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className={`w-full h-8 text-sm pr-8 ${
                  isValidKey === true ? "border-green-500" : 
                  isValidKey === false ? "border-red-500" : ""
                }`}
                placeholder="Gemini API anahtarınızı girin"
              />
              {isValidKey !== null && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  {isValidKey ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
          </div>
          <Button 
            variant="default"
            onClick={validateGeminiApiKey}
            className="w-full flex items-center"
            disabled={isValidating}
          >
            <span className="w-4 h-4 mr-2">🔑</span>
            {isValidating ? "Doğrulanıyor..." : "API Anahtarını Doğrula"}
          </Button>
        </div>
      </div>
    </div>
  );
};
