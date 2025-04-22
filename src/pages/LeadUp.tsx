
import { useNavigate } from "react-router-dom";
import { Globe, ArrowRight } from "lucide-react";
import SpinningGlobe from "../components/SpinningGlobe";

const bgOverlay =
  "linear-gradient(90deg, rgba(24,29,44,0.96) 0%, rgba(24,29,44,0.96) 38%, rgba(24,29,44,0.68) 64%, rgba(0,0,0,0.10) 100%)";

export default function LeadUp() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#1A1F2C] flex flex-col items-stretch overflow-x-hidden">
      {/* Hero Banner */}
      <div
        className="relative flex flex-row w-full h-[320px] md:h-[300px] xl:h-[380px] overflow-hidden"
        style={{ background: bgOverlay, borderBottom: "2px solid #181D2C" }}
      >
        <img
          src="https://lovable.dev/opengraph-image-p98pqg.png"
          alt="Network abstract"
          className="absolute object-cover w-full h-full z-0 opacity-70"
        />
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center text-center w-full px-5 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl xl:text-6xl text-white font-bold tracking-tight drop-shadow-xl mb-3 animate-fade-in">
              Explore Humanity's Linguistic Diversity
            </h1>
            <p className="text-lg text-white/80 max-w-xl mb-6 animate-fade-in">
              Welcome to the <span className="font-semibold text-orange-200">WALS Language Visualization</span> — where you can interactively explore over 2,700 world languages, view their families, features, and global relationships. Your journey starts here!
            </p>
          </div>
        </div>
      </div>
      {/* Globe & Button Section */}
      <section className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#f4f2ff] to-[#fff] py-12 md:py-16 px-2">
        <div className="flex flex-col items-center w-full max-w-xl mb-2 animate-fade-in">
          <SpinningGlobe />
          <button
            onClick={() => navigate("/visualization")}
            className="mt-7 flex items-center justify-center bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-600 hover:from-blue-900 hover:to-violet-900 text-white font-semibold rounded-full px-8 py-3 shadow-xl text-base border-2 border-blue-900 group transition-all duration-200 animate-fade-in"
            aria-label="Explore Interactive Visualization"
          >
            <Globe className="mr-2 group-hover:animate-pulse" />
            Explore Interactive Visualization
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
      <footer className="mt-auto py-6 text-center text-xs text-gray-400 bg-transparent">
        Data powered by WALS and Glottolog. Start exploring on the next page!
      </footer>
    </div>
  );
}
