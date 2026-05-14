import React from 'react';
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  placeholder?: React.ReactNode;
}

const sizeValues = {
  xs: '24px',
  sm: '32px',
  md: '40px',
  lg: '48px',
  xl: '56px',
  '2xl': '64px',
};

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = '', 
  size = 'md', 
  className,
  placeholder 
}) => {
  const sizeValue = sizeValues[size];

  return (
    <div 
      className={cn(
        "relative inline-flex items-center justify-center bg-gray-100",
        className
      )}
      style={{ 
        width: sizeValue, 
        height: sizeValue, 
        flexShrink: 0, 
        borderRadius: '50%',
        overflow: 'hidden',
        borderWidth: className?.includes('avatarOverlap') ? '2px' : '0',
        boxSizing: 'border-box'
      }}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="h-full w-full object-cover"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            borderRadius: '50%',
            display: 'block',
            overflow: 'hidden'
          }}
        />
      ) : (
        placeholder || (
          <span className="font-medium text-gray-600" style={{ fontSize: `calc(${sizeValue} / 2.5)` }}>
            {alt.charAt(0).toUpperCase()}
          </span>
        )
      )}
    </div>
  );
};
