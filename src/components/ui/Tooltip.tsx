import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative inline-block" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div className="absolute z-20 -top-2 left-1/2 -translate-x-1/2 -translate-y-full px-3 py-2 rounded-xl text-xs bg-gray-900 text-white shadow-lg border border-white/10 whitespace-nowrap">
          {content}
          <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45 border-r border-b border-white/10"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
