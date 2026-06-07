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
    cardPadding: "sm:p-6",
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
    cardPadding: "sm:p-6",
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
    cardPadding: "sm:p-5",
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
    cardPadding: "sm:p-5",
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
    cardPadding: "sm:p-5",
    iconSize: "text-xl",
    titleSize: "text-base",
    descSize: "text-xs",
  },
] as const;

const AddProductGenerationPage = () => {
  const navigate = useNavigate();
  const [selectedGeneration, setSelectedGeneration] = useState<string>("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGenerationSelect = (value: string) => {
    if (isRedirecting) return;
    setSelectedGeneration(value);
    setIsRedirecting(true);
    window.setTimeout(() => {
      navigate(`/products/add/category?generation=${encodeURIComponent(value)}`);
    }, 140);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-body text-[#2b3437] antialiased selection:bg-[#e2dfff] selection:text-[#3f33d6]">
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

      <header className="sticky top-0 z-10 flex w-full items-center justify-between bg-white/60 px-4 py-4 backdrop-blur-sm sm:px-6 sm:py-5 md:px-8 md:py-6">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl text-[#4d44e3]" style={{ fontVariationSettings: "'FILL' 1" }}>
            widgets
          </span>
          <span className="font-headline text-sm font-bold tracking-tight text-[#2b3437] sm:text-base">The Architect</span>
        </div>
        <button
          aria-label="Close flow"
          className="flex items-center justify-center rounded-full p-2 text-[#586064] transition-colors hover:bg-[#eaeff1]"
          onClick={() => navigate("/products")}
          type="button"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <main className="flex w-full justify-center px-4 py-5 sm:px-5 md:min-h-[calc(100vh-88px)] md:items-center md:px-8 md:py-8">
        <div className="w-full max-w-3xl">
          <div className="mb-6 sm:mb-8 md:mb-10">
            <AddFlowProgress from={0} stepLabel="Step 1 of 3" stepTitle="Select Generation" to={33.33} />
          </div>

          <div className="mb-6 text-center md:mb-8 md:text-left">
            <h1 className="mb-3 font-headline text-2xl font-extrabold tracking-tight text-[#2b3437] sm:text-3xl md:text-4xl">Who is this product for?</h1>
            <p className="max-w-xl text-sm text-[#586064] sm:text-base">
              Define the primary demographic target to ensure accurate curation and analytics tracking across the ecosystem.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 md:mb-10 md:grid-cols-6">
            {generationOptions.map((option) => {
              const isChecked = selectedGeneration === option.value;
              return (
                <label
                  key={option.value}
                  className={`group relative ${option.span} flex cursor-pointer flex-col items-start rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_40px_-15px_rgba(43,52,55,0.06)] ${option.cardPadding} ${
                    isChecked ? "bg-white shadow-[0_20px_35px_-15px_rgba(77,68,227,0.25)]" : "bg-[#f1f4f6]"
                  }`}
                >
                  <input
                    checked={isChecked}
                    className="sr-only"
                    name="generation"
                    onChange={() => handleGenerationSelect(option.value)}
                    type="radio"
                    value={option.value}
                  />
                  <div className="relative z-10 mb-3 rounded-lg bg-[#eaeff1] p-3 text-[#4d44e3] transition-colors group-hover:bg-[#e2dfff] group-hover:text-[#3f33d6] md:mb-6">
                    <span className={`material-symbols-outlined ${option.iconSize}`}>{option.icon}</span>
                  </div>
                  <h3 className={`relative z-10 mb-1 font-headline font-bold tracking-tight text-[#2b3437] md:mb-2 ${option.titleSize}`}>{option.title}</h3>
                  <p className={`relative z-10 font-body leading-relaxed text-[#586064] ${option.descSize}`}>{option.description}</p>
                  <div
                    className={`pointer-events-none absolute inset-0 z-0 rounded-xl transition-all duration-200 ${
                      isChecked ? "ring-2 ring-[#4d44e3]" : ""
                    }`}
                  ></div>
                </label>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-[#e7ecef] pt-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
            <button
              className="flex items-center justify-center gap-2 rounded-md px-3 py-2 font-medium text-[#586064] transition-colors hover:bg-[#f1f4f6] hover:text-[#4d44e3] sm:justify-start"
              onClick={() => navigate(-1)}
              type="button"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
              Back
            </button>

            <div className="flex items-center justify-center gap-2 rounded-xl bg-[#f1f4f6] px-4 py-2 text-center text-xs font-medium text-[#586064] sm:justify-end sm:text-sm">
              <span className="material-symbols-outlined text-[18px] text-[#4d44e3]">touch_app</span>
              Select a generation to continue automatically
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProductGenerationPage;
