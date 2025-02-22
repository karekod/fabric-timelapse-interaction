
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
            <div className="text-xs text-neutral-500 mb-4">ADD TEXT</div>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2">
                <span className="text-sm font-semibold">H1</span>
                <span>Heading</span>
              </button>
              <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2">
                <span className="text-sm font-semibold">H2</span>
                <span>Subheading</span>
              </button>
              <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2">
                <span className="text-sm font-semibold">T</span>
                <span>Body Text</span>
              </button>
            </div>
          </div>
          <div>
            <div className="text-xs text-neutral-500 mb-4">STYLES</div>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2">
                <span className="text-sm">Aa</span>
                <span>Typography</span>
              </button>
              <button className="w-full text-left px-4 py-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg flex items-center gap-2">
                <span className="text-sm">⟷</span>
                <span>Alignment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
