
import { useState } from "react";
import { PanelProps } from "@/types/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const SettingsPanel = ({ canvas }: PanelProps) => {
  const [geminiApiKey, setGeminiApiKey] = useState("");

  const validateGeminiApiKey = () => {
    if (!geminiApiKey.trim()) {
      toast.error("Please enter a Gemini API key");
      return;
    }
    
    toast.success("API key saved successfully!");
    localStorage.setItem("gemini_api_key", geminiApiKey);
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-neutral-500 mb-4">API SETTINGS</div>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-neutral-400">Gemini API Key</label>
          <Input
            type="password"
            value={geminiApiKey}
            onChange={(e) => setGeminiApiKey(e.target.value)}
            className="w-full h-8 text-sm text-black"
            placeholder="Enter your Gemini API key"
          />
        </div>
        <Button 
          variant="default"
          onClick={validateGeminiApiKey}
          className="w-full flex items-center"
        >
          <span className="w-4 h-4 mr-2">🔑</span>
          Validate API Key
        </Button>
      </div>
    </div>
  );
};
