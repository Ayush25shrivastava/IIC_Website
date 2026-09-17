import React from 'react';

export default function NauticalCartographyBg() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="cartographyGrid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#d4af37" strokeWidth="0.5" />
            <path d="M 50 0 L 50 100 M 0 50 L 100 50" fill="none" stroke="#d4af37" strokeWidth="0.2" strokeDasharray="4 4" />
          </pattern>
          <pattern id="compassRose" width="400" height="400" patternUnits="userSpaceOnUse">
            <circle cx="200" cy="200" r="150" fill="none" stroke="#d4af37" strokeWidth="0.5" />
            <circle cx="200" cy="200" r="140" fill="none" stroke="#d4af37" strokeWidth="0.2" />
            <line x1="200" y1="20" x2="200" y2="380" stroke="#d4af37" strokeWidth="0.5" />
            <line x1="20" y1="200" x2="380" y2="200" stroke="#d4af37" strokeWidth="0.5" />
            <line x1="72" y1="72" x2="328" y2="328" stroke="#d4af37" strokeWidth="0.2" />
            <line x1="72" y1="328" x2="328" y2="72" stroke="#d4af37" strokeWidth="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cartographyGrid)" />
        <rect width="100%" height="100%" fill="url(#compassRose)" />
      </svg>
    </div>
  );
}
