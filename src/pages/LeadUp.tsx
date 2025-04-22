
import { useNavigate } from "react-router-dom";
import { Globe, ArrowRight } from "lucide-react";
import GlobeWithPulsingLights from "../components/GlobeWithPulsingLights";

export default function LeadUp() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#1A1F2C] flex flex-col items-center justify-center">
      <div className="relative w-full max-w-xl h-[400px] flex items-center justify-center">
        <GlobeWithPulsingLights />
        {/* Button Overlay */}
        <button
          onClick={() => navigate("/visualization")}
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-600 hover:from-blue-900 hover:to-violet-900 text-white font-semibold rounded-full px-8 py-3 shadow-xl text-base border-2 border-blue-900 group transition-all duration-200 animate-fade-in flex items-center"
          aria-label="Explore Languages"
        >
          <Globe className="mr-2 group-hover:animate-pulse" />
          Explore languages
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      <div className="mt-8 w-full max-w-xl flex justify-center">
        <div className="bg-black/70 text-white rounded-xl text-center px-5 py-4 shadow-md border border-white/10 backdrop-blur-md">
          Thanks to WALS (The World Atlas of Language Structures) and any other referenced linguistic datasets.
        </div>
      </div>
    </div>
  );
}
