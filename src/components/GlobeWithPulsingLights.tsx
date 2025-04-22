
import React from "react";

// We use your reference image as background
const GLOBE_SRC = "/lovable-uploads/ecf1daa8-4337-416c-ba26-33f44076e935.png";

// These positions (percentages) approximate "hotspots" on the globe from your reference image.
// You can tweak/add more dots by adjusting the array.
const DOTS = [
  //             left,   top
  { left: "58%", top: "36%", color: "rgba(245, 34, 45, 0.75)" }, // India
  { left: "38%", top: "28%", color: "rgba(168, 85, 247, 0.65)" }, // Europe/Near East
  { left: "69%", top: "54%", color: "rgba(244, 63, 94, 0.7)" }, // Southern China
  { left: "36%", top: "45%", color: "rgba(245, 34, 45, 0.3)" }, // Africa
  { left: "79%", top: "74%", color: "rgba(139, 92, 246, 0.55)" }, // Indonesia area
  { left: "60%", top: "80%", color: "rgba(168, 85, 247, 0.4)" }, // North Australia
  { left: "28%", top: "60%", color: "rgba(244, 63, 94, 0.35)" }, // Madagascar region
  { left: "54%", top: "52%", color: "rgba(245, 158, 11, 0.4)" }, // Middle East
  { left: "70%", top: "83%", color: "rgba(34, 211, 238, 0.6)" }, // S. Australia
  // Add more dots as desired...
];

export default function GlobeWithPulsingLights() {
  return (
    <div className="relative w-full h-[400px] max-w-xl">
      <img
        src={GLOBE_SRC}
        alt="Spinning Earth Globe"
        className="w-full h-full object-contain rounded-3xl shadow-lg animate-fade-in pointer-events-none select-none"
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
            width: 32,
            height: 32,
            background: dot.color,
            borderRadius: "9999px",
            filter: "blur(0.5px)",
            boxShadow: "0 0 12px 6px " + dot.color,
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
