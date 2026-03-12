import React from 'react';

interface IconProps {
  className?: string;
}

export const PhFlagIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => {
  return (
    <svg 
      viewBox="0 0 900 600" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="900" height="600" fill="white"/>
      <path d="M0 0H900V300H0V0Z" fill="#0038A8"/>
      <path d="M0 300H900V600H0V300Z" fill="#CE1126"/>
      <path d="M0 0L450 300L0 600V0Z" fill="white"/>
      <circle cx="150" cy="300" r="45" fill="#FCD116"/>
      <path d="M150 240L155 255H170L158 265L162 280L150 270L138 280L142 265L130 255H145L150 240Z" fill="#FCD116"/>
      <path d="M75 150L80 165H95L83 175L87 190L75 180L63 190L67 175L55 165H70L75 150Z" fill="#FCD116"/>
      <path d="M75 450L80 465H95L83 475L87 490L75 480L63 490L67 475L55 465H70L75 450Z" fill="#FCD116"/>
    </svg>
  );
};
