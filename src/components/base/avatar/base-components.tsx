import React from 'react';
import { Plus } from 'lucide-react';
import { cn } from "@/lib/utils";

interface AvatarAddButtonProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizeValues = {
  xs: '24px',
  sm: '32px',
  md: '40px',
  lg: '48px',
  xl: '56px',
  '2xl': '64px',
};

export const AvatarAddButton: React.FC<AvatarAddButtonProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeValue = sizeValues[size];

  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center bg-white text-gray-400 hover:border-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
        className
      )}
      style={{ 
        width: sizeValue, 
        height: sizeValue, 
        flexShrink: 0, 
        padding: 0, 
        borderRadius: '50%',
        border: '2px dashed #d1d5db'
      }}
    >
      <Plus size={size === 'xs' ? 12 : size === 'sm' ? 16 : 20} />
    </button>
  );
};
