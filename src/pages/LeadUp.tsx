
import { useNavigate } from "react-router-dom";
import { ArrowRight, Globe } from "lucide-react";

const bgOverlay =
  "linear-gradient(90deg, rgba(24,29,44,0.96) 0%, rgba(24,29,44,0.96) 38%, rgba(24,29,44,0.68) 64%, rgba(0,0,0,0.10) 100%)";

export default function LeadUp() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#1A1F2C] flex flex-col items-stretch">
      {/* Top banner with lines background and headline */}
      <div
        className="relative flex flex-row w-full h-[340px] lg:h-[310px] xl:h-[360px] min-h-[220px] overflow-hidden"
        style={{ background: bgOverlay, borderBottom: "2px solid #181D2C" }}
      >
        <img
          src="https://lovable.dev/opengraph-image-p98pqg.png"
          alt="Network abstract"
          className="absolute object-cover w-full h-full z-0 opacity-70"
          style={{ top: 0, left: 0 }}
        />
        <div className="z-10 flex-1 flex items-center pl-0 lg:pl-12 xl:pl-24">
          {/* Empty for spacing */}
        </div>
        <div className="z-10 flex flex-col items-start justify-center w-full max-w-lg mx-auto px-5 pr-2 text-right">
          <h1 className="text-4xl md:text-5xl xl:text-6xl text-white font-semibold tracking-tight drop-shadow-md mb-4 leading-tight animate-fade-in">
            Watching Our<br />World Unfold
          </h1>
        </div>
      </div>
      {/* Globe + Text block */}
      <div className="flex-1 flex flex-col md:flex-row bg-white">
        {/* Globe Area */}
        <div className="md:w-1/2 flex items-start justify-center bg-white pb-2">
          <div className="w-full max-w-[520px] flex flex-col items-end">
            <img
              src="/lovable-uploads/c91fb4e0-cfe3-4da5-8f68-f9fe862df20b.png"
              alt="Globe Animation"
              className="w-full max-w-[460px] h-auto block rounded-xl shadow-lg bg-[#191A24] mt-[-110px] md:mt-[-100px] border-4 border-[#191A24]"
              style={{
                marginLeft: "auto"
              }}
            />
          </div>
        </div>
        {/* Text Section */}
        <div className="md:w-1/2 flex flex-col items-center justify-center px-4 py-12 md:py-0 md:pl-4 lg:pl-16">
          <div className="max-w-xl text-left">
            <h2 className="text-2xl font-semibold text-[#1A1F2C] mb-4">A Global Database of Society</h2>
            <p className="text-base text-gray-800 mb-5 opacity-80">
              Supported by <span className="text-orange-600 font-medium">Google Jigsaw</span>,
              the GDELT Project monitors the world's broadcast, print, and web news from nearly every corner of
              every country in over 100 languages and identifies the people, locations, organizations, themes,
              sources, emotions, counts, quotes, images and events driving our global society every second of every
              day, creating a free open platform for computing on the entire world.
            </p>
            <button
              onClick={() => navigate("/visualization")}
              className="group bg-gradient-to-tr from-cyan-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 text-white font-semibold rounded-full px-7 py-3 shadow-xl flex items-center transition-all duration-200 animate-fade-in border-2 border-blue-900"
              aria-label="Explore Interactive Visualization"
            >
              <Globe className="mr-2 group-hover:animate-pulse" />
              Explore Interactive Visualization
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="mt-8 text-xs text-gray-400">
              Image and graphics for illustration only. This page is a visual lead up – click above to enter the app.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
