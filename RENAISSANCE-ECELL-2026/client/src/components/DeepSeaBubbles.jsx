import React, { useEffect, useState } from 'react';

export default function DeepSeaBubbles() {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    // Generate 20 random bubbles
    const newBubbles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute bottom-[-20px] rounded-full bg-[#38BDF8] blur-[1px] opacity-20"
          style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animation: `bubbleRise ${b.duration}s linear ${b.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes bubbleRise {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-50vh) translateX(20px) scale(1.2);
            opacity: 0.3;
          }
          100% {
            transform: translateY(-120vh) translateX(-20px) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
