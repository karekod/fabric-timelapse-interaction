
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TypeHeaderProps {
  icon: LucideIcon;
  title: string;
}

export const TypeHeader: React.FC<TypeHeaderProps> = ({ icon: Icon, title }) => {
  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <Icon className="w-4 h-4" />
      <span>{title}</span>
    </div>
  );
};
