import React from 'react';
import './DesktopIcon.css';

interface DesktopIconProps {
  name: string;
  icon: string;
  onClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ name, icon, onClick }) => {
  return (
    <div className="desktop-icon" onClick={onClick}>
      <span className="icon">{icon}</span>
      <span className="name">{name}</span>
    </div>
  );
};

export default DesktopIcon;
