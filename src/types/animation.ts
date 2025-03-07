
import { Canvas } from "fabric";

export interface TimelineLayer {
  id: string;
  elementId: string;
  name: string;
  keyframes: Keyframe[];
  isVisible?: boolean;
}

export interface Keyframe {
  id: string;
  startTime: number;
  duration: number;
  animationType: 'move' | 'scale' | 'rotate' | 'fade' | 'color' | 'blur' | 'flip';
  properties: Record<string, any>;
  effects: KeyframeEffect[];
}

export interface KeyframeEffect {
  id: string;
  type: 'move' | 'scale' | 'rotate' | 'fade' | 'color' | 'blur' | 'flip';
  properties: Record<string, any>;
  isEnabled: boolean;
}

declare module "fabric" {
  interface Object {
    customId?: string;
  }
}
