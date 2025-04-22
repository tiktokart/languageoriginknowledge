
import { useNavigate } from "react-router-dom";
import { Globe, ArrowRight } from "lucide-react";

const DOTS = [
  // Spread dots across the page representing different database/global spread
  { left: "29%", top: "22%", color: "#9b87f5", duration: 0.36 },
  { left: "62%", top: "17%", color: "#F97316", duration: 0.44 },
  { left: "76%", top: "31%", color: "#0EA5E9", duration: 0.55 },
  { left: "41%", top: "51%", color: "#8B5CF6", duration: 0.42 },
  { left: "15%", top: "63%", color: "#D946EF", duration: 0.54 },
  { left: "78%", top: "69%", color: "#F59E0B", duration: 0.60 },
  { left: "60%", top: "81%", color: "#34D6E6", duration: 0.49 },
  { left: "33%", top: "79%", color: "#ea384c", duration: 0.39 },
  { left: "70%", top: "85%", color: "#1EAEDB", duration: 0.57 },
];

export default function LeadUp() {
  const navigate = useNavigate();

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(120deg, #1A1F2C 70%, #231e3b 100%)",
        backgroundImage: `
          linear-gradient(rgba(26,31,44,0.97), rgba(26,31,44,0.99)), 
          url('/lovable-uploads/eef11f14-27f7-447c-8398-6b3231c6b7b9.png')
        `,
        backgroundBlendMode: "multiply, lighten",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Pulsing lights spread across the page */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {DOTS.map((dot, idx) => (
          <span
            key={idx}
            className="absolute animate-dot-pulse"
            style={{
              left: dot.left,
              top: dot.top,
              width: 22,
              height: 22,
              background: dot.color,
              borderRadius: "9999px",
              filter: "blur(0.3px)",
              boxShadow: `0 0 12px 6px ${dot.color}`,
              zIndex: 2,
              animationDuration: `${dot.duration}s`
            }}
          />
        ))}
        {/* Local animation definition */}
        <style>
          {`
            @keyframes pulse-dot {
              0% { opacity: 0.7; transform: translate(-50%, -50%) scale(1);}
              40% { opacity: 1; transform: translate(-50%, -50%) scale(1.4);}
              100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1);}
            }
            .animate-dot-pulse {
              animation: pulse-dot 0.5s infinite;
            }
          `}
        </style>
      </div>
      {/* Central content */}
      <div className="relative w-full max-w-xl h-[400px] flex items-center justify-center">
        {/* Button only, no globe */}
        <button
          onClick={() => navigate("/visualization")}
          className="z-20 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-600 hover:from-blue-900 hover:to-violet-900 text-white font-semibold rounded-full px-8 py-3 shadow-xl text-base border-2 border-blue-900 group transition-all duration-200 animate-fade-in flex items-center"
          aria-label="Explore Languages"
        >
          <Globe className="mr-2 group-hover:animate-pulse" />
          Explore languages
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      <div className="mt-8 w-full max-w-xl flex justify-center">
        <div className="bg-black/70 text-white rounded-xl text-center px-5 py-4 shadow-md border border-white/10 backdrop-blur-md">
          Thanks to WALS (The World Atlas of Language Structures), Ethnologue, Glottolog, PHOIBLE, APiCS, and AUTOTYP.
        </div>
      </div>
    </div>
  );
}
