
import React from "react";

// Use your provided Google Earth globe image
const GLOBE_SRC = "/lovable-uploads/eef11f14-27f7-447c-8398-6b3231c6b7b9.png";

// Dots: (left, top, color), adjust as needed for representative distribution
const DOTS = [
  { left: "58%", top: "38%", color: "#9b87f5" }, // Light Purple
  { left: "38%", top: "28%", color: "#F97316" }, // Orange
  { left: "69%", top: "54%", color: "#0EA5E9" }, // Blue
  { left: "36%", top: "46%", color: "#8B5CF6" }, // Purple
  { left: "79%", top: "74%", color: "#D946EF" }, // Magenta
  { left: "60%", top: "80%", color: "#F59E0B" }, // Gold
  { left: "28%", top: "60%", color: "#34D6E6" }, // Cyan
  { left: "54%", top: "52%", color: "#ea384c" }, // Red
  { left: "70%", top: "83%", color: "#1EAEDB" }, // Bright blue
];

export default function GlobeWithPulsingLights() {
  return (
    <div className="relative w-full h-[400px] max-w-xl">
      <img
        src={GLOBE_SRC}
        alt="Google Earth Globe"
        className="w-full h-full object-contain rounded-3xl shadow-xl pointer-events-none select-none"
        draggable={false}
        style={{ background: "#090f24" }}
      />
      {DOTS.map((dot, idx) => (
        <span
          key={idx}
          className="absolute animate-dot-pulse pointer-events-none"
          style={{
            left: dot.left,
            top: dot.top,
            transform: "translate(-50%, -50%)",
            width: 26,
            height: 26,
            background: dot.color,
            borderRadius: "9999px",
            filter: "blur(0.3px)",
            boxShadow: `0 0 12px 6px ${dot.color}`,
            zIndex: 5,
          }}
        />
      ))}
      {/* Animation for pulsing lights */}
      <style>{`
        @keyframes pulse-dot {
          0% { opacity: 0.7; transform: translate(-50%, -50%) scale(1);}
          40% { opacity: 1; transform: translate(-50%, -50%) scale(1.4);}
          100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1);}
        }
        .animate-dot-pulse {
          animation: pulse-dot 0.6s infinite;
        }
      `}</style>
    </div>
  );
}
