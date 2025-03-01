
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
  animationType: 'move' | 'scale' | 'rotate';
  properties: Record<string, any>;
}

declare module "fabric" {
  interface Object {
    customId?: string;
  }
}
