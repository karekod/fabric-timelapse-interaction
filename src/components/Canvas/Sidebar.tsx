
import { Canvas as FabricCanvas } from "fabric";

interface SidebarProps {
  canvas: FabricCanvas | null;
}

export const Sidebar = ({ canvas }: SidebarProps) => {
  return (
    <div className="w-64 border-r border-neutral-800 bg-[#0f1116] flex flex-col">
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">Text</span>
        </div>
      </div>
      <div className="flex-1 p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm text-neutral-400 mb-2">Basic text</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg">
                Add a heading
              </button>
              <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg">
                Add a subheading
              </button>
              <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg">
                Add body text
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-sm text-neutral-400 mb-2">Animated</h3>
            <div className="grid grid-cols-3 gap-2">
              <button className="p-4 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex flex-col items-center gap-2">
                <span className="text-2xl">T</span>
                <span className="text-xs">Fade in</span>
              </button>
              <button className="p-4 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex flex-col items-center gap-2">
                <span className="text-2xl">T</span>
                <span className="text-xs">Type</span>
              </button>
              <button className="p-4 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex flex-col items-center gap-2">
                <span className="text-2xl">T</span>
                <span className="text-xs">Slide</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
