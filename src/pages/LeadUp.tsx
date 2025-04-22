
import { useNavigate } from "react-router-dom";
import { ArrowRight, Globe, Layers, BookOpen } from "lucide-react";

const bgOverlay =
  "linear-gradient(90deg, rgba(24,29,44,0.96) 0%, rgba(24,29,44,0.96) 38%, rgba(24,29,44,0.68) 64%, rgba(0,0,0,0.10) 100%)";

// Feature highlights for the lead-up page
const features = [
  {
    icon: Globe,
    title: "Global Language Map",
    description:
      "Visualize thousands of world languages and their locations on an interactive globe. See the geographic spread and diversity of human communication.",
  },
  {
    icon: Layers,
    title: "Family & Structure Insights",
    description:
      "Explore family trees, structural features, and relationships between languages using rich charts and data from WALS and Glottolog.",
  },
  {
    icon: BookOpen,
    title: "Filter & Compare",
    description:
      "Customize your view by macroarea, feature, or family. Compare language structure, filter by geography, and dive deep into linguistic data.",
  },
];

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
              Discover the World of Languages
            </h1>
            <p className="text-lg text-white/80 max-w-xl mb-6 animate-fade-in">
              Welcome to the <span className="font-semibold text-orange-200">WALS Language Visualization</span> — your interactive atlas to the world's linguistic structures, families, and geography. Dive into human diversity, one language at a time!
            </p>
            <button
              onClick={() => navigate("/visualization")}
              className="group bg-gradient-to-r from-cyan-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 text-white font-semibold rounded-full px-8 py-3 shadow-xl flex items-center transition-all duration-200 animate-fade-in border-2 border-blue-900 text-base"
              aria-label="Explore Interactive Visualization"
            >
              <Globe className="mr-2 group-hover:animate-pulse" />
              Explore Interactive Visualization
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#f4f2ff] to-[#fff] py-16 md:py-24">
        <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row gap-10 md:gap-5">
          {features.map((feature) => (
            <div
              className="flex-1 bg-white rounded-xl shadow-md border border-[#eaeaf5] flex flex-col items-center p-7 mx-2 min-w-[220px] transition-transform hover:scale-105 group"
              key={feature.title}
            >
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-100 to-blue-200 text-blue-900 flex items-center justify-center rounded-full shadow-lg mb-3">
                <feature.icon size={32} className="opacity-80" />
              </div>
              <h3 className="font-semibold text-lg text-[#1A1F2C] mb-2 group-hover:text-blue-700 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-sm text-center opacity-80">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="mt-auto py-6 text-center text-xs text-gray-400 bg-transparent">
        Data powered by WALS and Glottolog. Start exploring on the next page!
      </footer>
    </div>
  );
}
