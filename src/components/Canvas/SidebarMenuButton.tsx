
import { LucideIcon } from "lucide-react";

interface SidebarMenuButtonProps {
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export const SidebarMenuButton = ({ icon: Icon, active, onClick, children }: SidebarMenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 flex flex-col items-center justify-center gap-1 rounded-lg ${
        active ? "bg-neutral-800" : "hover:bg-neutral-800/50"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-[9px] font-medium">{children}</span>
    </button>
  );
};
