import React, { useState, useRef, useEffect } from 'react';
import type { MouseEvent } from 'react';
import './Window.css';

interface WindowProps {
  window: {
    id: number;
    title: string;
    zIndex: number;
  };
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  activeWindow: boolean;
}

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

const Window: React.FC<WindowProps> = ({ window, children, onClose, onMinimize, onFocus, activeWindow }) => {
  const [position, setPosition] = useState<Position>({
    x: 100 + (window.id * 30) % 200,
    y: 50 + (window.id * 30) % 150
  });
  const [size] = useState<Size>({ width: 600, height: 400 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>): void => {
    const target = e.target as HTMLElement;
    if (target.closest('.window-controls') || target.closest('.window-btn')) {
      return;
    }
    onFocus();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  return (
    <div
      ref={windowRef}
      className={`window ${activeWindow ? 'active' : 'inactive'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: window.zIndex
      }}
    >
      <div className="window-header" onMouseDown={handleMouseDown}>
        <div className="window-title">
          <span>💻</span>
          {window.title}
        </div>
        <div className="window-controls">
          <div 
            className="window-btn minimize" 
            onClick={onMinimize}
            title="Minimize"
          ></div>
          <div 
            className="window-btn close" 
            onClick={onClose}
            title="Close"
          ></div>
        </div>
      </div>
      <div className="window-content">
        {children}
      </div>
    </div>
  );
};

export default Window;
