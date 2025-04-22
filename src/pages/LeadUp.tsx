
import { useNavigate } from "react-router-dom";
import { Globe, ArrowRight } from "lucide-react";
import SpinningGlobe from "../components/SpinningGlobe";

export default function LeadUp() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#1A1F2C] flex items-center justify-center">
      <div className="relative w-full max-w-2xl h-[400px] flex items-center justify-center">
        {/* Spinning Globe */}
        <SpinningGlobe />
        
        {/* Button Overlay */}
        <button
          onClick={() => navigate("/visualization")}
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-600 hover:from-blue-900 hover:to-violet-900 text-white font-semibold rounded-full px-8 py-3 shadow-xl text-base border-2 border-blue-900 group transition-all duration-200 animate-fade-in flex items-center"
          aria-label="Explore Interactive Visualization"
        >
          <Globe className="mr-2 group-hover:animate-pulse" />
          Explore Interactive Visualization
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
