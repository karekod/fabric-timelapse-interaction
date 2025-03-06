
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
      className={`w-10 h-10 flex items-center justify-center rounded-lg ${
        active ? "bg-neutral-800" : "hover:bg-neutral-800/50"
      }`}
    >
      <Icon className="w-5 h-5" />
      {children}
    </button>
  );
};
