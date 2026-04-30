import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddFlowProgress from "@/components/products/AddFlowProgress";

const generationOptions = [
  {
    value: "millennial",
    title: "Millennial",
    description: "Digital pioneers & experience seekers. Focuses on authenticity and curated lifestyles.",
    icon: "smartphone",
    span: "md:col-span-3",
    cardPadding: "p-6",
    iconSize: "text-2xl",
    titleSize: "text-xl",
    descSize: "text-sm",
  },
  {
    value: "gen-z",
    title: "Gen Z",
    description: "Trendy, bold & native digital. Driven by rapid trends, visual expression, and social commerce.",
    icon: "bolt",
    span: "md:col-span-3",
    cardPadding: "p-6",
    iconSize: "text-2xl",
    titleSize: "text-xl",
    descSize: "text-sm",
  },
  {
    value: "gen-alpha",
    title: "Gen Alpha",
    description: "The newest wave. Highly connected, visually driven tech natives.",
    icon: "smart_toy",
    span: "md:col-span-2",
    cardPadding: "p-5",
    iconSize: "text-xl",
    titleSize: "text-base",
    descSize: "text-xs",
  },
  {
    value: "gen-x",
    title: "Gen X",
    description: "Pragmatic brand advocates. Values quality, utility, and direct messaging.",
    icon: "work_outline",
    span: "md:col-span-2",
    cardPadding: "p-5",
    iconSize: "text-xl",
    titleSize: "text-base",
    descSize: "text-xs",
  },
  {
    value: "boomer",
    title: "Boomer",
    description: "Traditional consumers. Loyal to established brands and premium service.",
    icon: "workspace_premium",
    span: "md:col-span-2",
    cardPadding: "p-5",
    iconSize: "text-xl",
    titleSize: "text-base",
    descSize: "text-xs",
  },
] as const;

const AddProductGenerationPage = () => {
  const navigate = useNavigate();
  const [selectedGeneration, setSelectedGeneration] = useState<string>("");

  return (
    <div className="bg-[#f8f9fa] font-body text-[#2b3437] min-h-screen flex flex-col antialiased selection:bg-[#e2dfff] selection:text-[#3f33d6]">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");

        .font-headline {
          font-family: "Plus Jakarta Sans", sans-serif;
        }

        .font-body, .font-label {
          font-family: "Inter", sans-serif;
        }

        .material-symbols-outlined {
          font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
        }
      `}</style>

      <header className="w-full px-8 py-6 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#4d44e3] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            widgets
          </span>
          <span className="font-headline font-bold text-[#2b3437] tracking-tight">The Architect</span>
        </div>
        <button
          aria-label="Close flow"
          className="flex items-center justify-center p-2 rounded-full text-[#586064] hover:bg-[#eaeff1] transition-colors"
          onClick={() => navigate("/products")}
          type="button"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <main className="flex-grow flex items-center justify-center p-5 md:p-8 w-full">
        <div className="max-w-3xl w-full">
          <div className="mb-10">
            <AddFlowProgress from={0} stepLabel="Step 1 of 3" stepTitle="Select Generation" to={33.33} />
          </div>

          <div className="mb-8 text-center md:text-left">
            <h1 className="font-headline text-3xl md:text-4xl font-extrabold text-[#2b3437] tracking-tight mb-3">Who is this product for?</h1>
            <p className="text-[#586064] text-base max-w-xl">
              Define the primary demographic target to ensure accurate curation and analytics tracking across the ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-10">
            {generationOptions.map((option) => {
              const isChecked = selectedGeneration === option.value;
              return (
                <label
                  key={option.value}
                  className={`group relative ${option.span} flex flex-col items-start ${option.cardPadding} rounded-xl cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-[0_24px_40px_-15px_rgba(43,52,55,0.06)] hover:-translate-y-1 ${
                    isChecked ? "bg-white shadow-[0_20px_35px_-15px_rgba(77,68,227,0.25)]" : "bg-[#f1f4f6]"
                  }`}
                >
                  <input
                    checked={isChecked}
                    className="sr-only"
                    name="generation"
                    onChange={() => setSelectedGeneration(option.value)}
                    type="radio"
                    value={option.value}
                  />
                  <div className="relative z-10 p-3 rounded-lg bg-[#eaeff1] text-[#4d44e3] mb-4 md:mb-6 transition-colors group-hover:bg-[#e2dfff] group-hover:text-[#3f33d6]">
                    <span className={`material-symbols-outlined ${option.iconSize}`}>{option.icon}</span>
                  </div>
                  <h3 className={`relative z-10 font-headline font-bold ${option.titleSize} text-[#2b3437] mb-1 md:mb-2 tracking-tight`}>{option.title}</h3>
                  <p className={`relative z-10 font-body text-[#586064] ${option.descSize} leading-relaxed`}>{option.description}</p>
                  <div
                    className={`absolute inset-0 z-0 rounded-xl pointer-events-none transition-all duration-200 ${
                      isChecked ? "ring-2 ring-[#4d44e3]" : ""
                    }`}
                  ></div>
                </label>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-6 mt-6">
            <button
              className="flex items-center gap-2 text-[#586064] hover:text-[#4d44e3] transition-colors font-medium px-3 py-2 rounded-md hover:bg-[#f1f4f6]"
              onClick={() => navigate(-1)}
              type="button"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
              Back
            </button>

            <button
              className={`flex items-center gap-2 px-7 py-2.5 rounded-md font-headline font-bold tracking-wide transition-all ${
                selectedGeneration
                  ? "bg-[#4d44e3] text-[#faf6ff] hover:bg-[#4034d7]"
                  : "bg-[#e2e9ec] text-[#737c7f] cursor-not-allowed"
              }`}
              disabled={!selectedGeneration}
              onClick={() => navigate(`/products/add/category?generation=${encodeURIComponent(selectedGeneration)}`)}
              type="button"
            >
              Next
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProductGenerationPage;
