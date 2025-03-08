import { useState, useEffect } from "react";
import { PanelProps } from "@/types/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Move,
  Maximize2,
  RotateCw,
  EyeOff as FadeIcon,
  Palette,
  ArrowDown as BlurIcon,
  RotateCcw,
  Plus,
  Trash2
} from "lucide-react";
import { KeyframeEffect, TimelineLayer } from "@/types/animation";
import { Toggle } from "@/components/ui/toggle";
import { TimelineLayer as TimelineLayerType } from "@/types/animation";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const AnimationsPanel = ({ canvas, selectedObject, timelineLayers, setTimelineLayers }: PanelProps & {
  selectedObject: any;
  timelineLayers: TimelineLayerType[];
  setTimelineLayers: React.Dispatch<React.SetStateAction<TimelineLayerType[]>>;
}) => {
  const [startTime, setStartTime] = useState("0");
  const [duration, setDuration] = useState("20");
  const [selectedAnimation, setSelectedAnimation] = useState<'move' | 'scale' | 'rotate' | 'fade' | 'color' | 'blur' | 'flip'>('move');
  const [selectedKeyframeId, setSelectedKeyframeId] = useState<string | null>(null);
  const [effectsInKeyframe, setEffectsInKeyframe] = useState<KeyframeEffect[]>([]);

  // Find the selected keyframe when selectedKeyframeId changes
  useEffect(() => {
    if (!selectedKeyframeId || !timelineLayers) return;
    
    for (const layer of timelineLayers) {
      const keyframe = layer.keyframes.find(k => k.id === selectedKeyframeId);
      if (keyframe) {
        // Initialize the effects array if it doesn't exist
        if (!keyframe.effects) {
          keyframe.effects = [];
        }
        setEffectsInKeyframe(keyframe.effects);
        setStartTime(keyframe.startTime.toString());
        setDuration(keyframe.duration.toString());
        break;
      }
    }
  }, [selectedKeyframeId, timelineLayers]);

  const updateKeyframeEffects = (newEffects: KeyframeEffect[]) => {
    if (!selectedKeyframeId) return;

    setTimelineLayers(prevLayers => 
      prevLayers.map(layer => ({
        ...layer,
        keyframes: layer.keyframes.map(keyframe => 
          keyframe.id === selectedKeyframeId 
            ? { ...keyframe, effects: newEffects }
            : keyframe
        )
      }))
    );
    
    setEffectsInKeyframe(newEffects);
  };

  const addEffectToKeyframe = () => {
    if (!selectedKeyframeId) return;
    
    const newEffect: KeyframeEffect = {
      id: crypto.randomUUID(),
      type: selectedAnimation,
      properties: {},
      isEnabled: true
    };
    
    const updatedEffects = [...effectsInKeyframe, newEffect];
    updateKeyframeEffects(updatedEffects);
  };

  const removeEffect = (effectId: string) => {
    const updatedEffects = effectsInKeyframe.filter(effect => effect.id !== effectId);
    updateKeyframeEffects(updatedEffects);
  };

  const toggleEffectEnabled = (effectId: string) => {
    const updatedEffects = effectsInKeyframe.map(effect => 
      effect.id === effectId 
        ? { ...effect, isEnabled: !effect.isEnabled }
        : effect
    );
    updateKeyframeEffects(updatedEffects);
  };

  const changeEffectType = (effectId: string, newType: KeyframeEffect['type']) => {
    const updatedEffects = effectsInKeyframe.map(effect => 
      effect.id === effectId 
        ? { ...effect, type: newType }
        : effect
    );
    updateKeyframeEffects(updatedEffects);
  };

  const getAnimationTypeIcon = (type: KeyframeEffect['type']) => {
    switch (type) {
      case 'move': return <Move className="w-4 h-4" />;
      case 'scale': return <Maximize2 className="w-4 h-4" />;
      case 'rotate': return <RotateCw className="w-4 h-4" />;
      case 'fade': return <FadeIcon className="w-4 h-4" />;
      case 'color': return <Palette className="w-4 h-4" />;
      case 'blur': return <BlurIcon className="w-4 h-4" />;
      case 'flip': return <RotateCcw className="w-4 h-4" />;
      default: return <Move className="w-4 h-4" />;
    }
  };

  const updateKeyframeTime = () => {
    if (!selectedKeyframeId) return;
    
    setTimelineLayers(prevLayers => 
      prevLayers.map(layer => ({
        ...layer,
        keyframes: layer.keyframes.map(keyframe => 
          keyframe.id === selectedKeyframeId 
            ? { 
                ...keyframe, 
                startTime: parseFloat(startTime), 
                duration: parseFloat(duration)
              }
            : keyframe
        )
      }))
    );
  };

  return (
    <div className="space-y-4">
      {selectedKeyframeId ? (
        <>
          <div className="space-y-4">
            <div className="text-xs text-neutral-500">ANIMATION TIME</div>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-neutral-400">Start Time (s)</label>
                <Input
                  type="number"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  onBlur={updateKeyframeTime}
                  className="w-full h-8 text-sm text-black"
                  placeholder="Start"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-400">Duration (s)</label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  onBlur={updateKeyframeTime}
                  className="w-full h-8 text-sm text-black"
                  placeholder="Duration"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-neutral-500">ANIMATION EFFECTS</div>
              <Button size="sm" variant="outline" onClick={addEffectToKeyframe} className="h-7 text-xs flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Effect
              </Button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {effectsInKeyframe.length > 0 ? (
                effectsInKeyframe.map(effect => (
                  <div key={effect.id} className="bg-neutral-800/60 p-2 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-neutral-700 p-1 rounded">
                          {getAnimationTypeIcon(effect.type)}
                        </div>
                        <span className="text-xs font-medium">{effect.type.charAt(0).toUpperCase() + effect.type.slice(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`enable-${effect.id}`}
                            checked={effect.isEnabled}
                            onCheckedChange={() => toggleEffectEnabled(effect.id)}
                          />
                          <Label htmlFor={`enable-${effect.id}`} className="text-xs">Active</Label>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          onClick={() => removeEffect(effect.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Effect type selector */}
                    <div className="grid grid-cols-4 gap-1">
                      <Toggle
                        size="sm"
                        variant="outline"
                        pressed={effect.type === 'move'}
                        onPressedChange={() => changeEffectType(effect.id, 'move')}
                        className="h-7 text-xs flex justify-center"
                      >
                        <Move className="w-3 h-3 mr-1" /> Move
                      </Toggle>
                      <Toggle
                        size="sm"
                        variant="outline"
                        pressed={effect.type === 'scale'}
                        onPressedChange={() => changeEffectType(effect.id, 'scale')}
                        className="h-7 text-xs flex justify-center"
                      >
                        <Maximize2 className="w-3 h-3 mr-1" /> Scale
                      </Toggle>
                      <Toggle
                        size="sm"
                        variant="outline"
                        pressed={effect.type === 'rotate'}
                        onPressedChange={() => changeEffectType(effect.id, 'rotate')}
                        className="h-7 text-xs flex justify-center"
                      >
                        <RotateCw className="w-3 h-3 mr-1" /> Rotate
                      </Toggle>
                      <Toggle
                        size="sm"
                        variant="outline"
                        pressed={effect.type === 'fade'}
                        onPressedChange={() => changeEffectType(effect.id, 'fade')}
                        className="h-7 text-xs flex justify-center"
                      >
                        <FadeIcon className="w-3 h-3 mr-1" /> Fade
                      </Toggle>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-neutral-500 text-xs py-4 px-2 bg-neutral-800/20 rounded-md">
                  No effects added yet. Click "Add Effect" to get started.
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-neutral-500 text-xs py-8 px-4 bg-neutral-800/20 rounded-md">
          Select a keyframe from the timeline to view and edit its animation effects.
        </div>
      )}
      
      <div className="space-y-4">
        <div className="text-xs text-neutral-500">PRESETS</div>
        <div className="space-y-2">
          <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg">
            Fade In
          </button>
          <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg">
            Bounce
          </button>
          <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg">
            Slide In
          </button>
        </div>
      </div>
    </div>
  );
};
