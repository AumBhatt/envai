import React from 'react';

interface LeafIconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const LeafIcon: React.FC<LeafIconProps> = ({ 
  size = 24, 
  color = 'currentColor', 
  className = '',
  style = {} 
}) => {
  return (
    <svg 
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      style={style}
    >
      <g>
        <path 
          d="M17,8C8,10,5.9,16.17,3.82,21.34L5.71,22l1-2.3A4.49,4.49,0,0,0,8,20C19,20,22,3,22,3,21,5,14,5.25,9,6.25S2,11.5,2,13.5a6.22,6.22,0,0,0,1.75,3.75C7,8,17,8,17,8Z"
          fill={color}
        />
        <rect width="24" height="24" fill="none" />
      </g>
    </svg>
  );
};

export default LeafIcon;
