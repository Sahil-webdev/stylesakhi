import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AddFlowProgress from "@/components/products/AddFlowProgress";

const generationLabelMap: Record<string, string> = {
  "gen-z": "Gen Z",
  millennial: "Millennial",
  "gen-alpha": "Gen Alpha",
  "gen-x": "Gen X",
  boomer: "Boomer",
};

const categories = [
  {
    id: "clothing",
    title: "Clothing",
    description: "Shirts, pants, outerwear",
    icon: "checkroom",
  },
  {
    id: "accessories",
    title: "Accessories",
    description: "Bags, jewelry, hats",
    icon: "watch",
  },
  {
    id: "sneakers",
    title: "Sneakers",
    description: "Athletic, casual, hype",
    icon: "steps",
  },
] as const;

const AddProductCategoryPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const generationKey = searchParams.get("generation") || "gen-z";
  const generationLabel = useMemo(() => generationLabelMap[generationKey] || "Gen Z", [generationKey]);

  return (
    <div className="bg-[#f8f9fa] text-[#2b3437] font-body min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 antialiased">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap");
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

        .glass-panel {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .ambient-shadow {
          box-shadow: 0 10px 40px -10px rgba(43, 52, 55, 0.06);
        }
      `}</style>

      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
        <header className="flex flex-col items-center text-center gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f1f4f6] text-[#586064] font-label text-sm font-medium">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            Selected Generation: {generationLabel}
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2b3437]">What type of product is it?</h1>
            <p className="font-body text-[#586064] text-base max-w-lg mx-auto">
              Select the primary category to categorize your new addition accurately.
            </p>
          </div>
        </header>

        <div className="w-full max-w-md mx-auto">
          <AddFlowProgress from={33.33} stepLabel="Step 2 of 3" stepTitle="Select Category" to={66.66} />
        </div>

        <main className="w-full bg-[#f1f4f6] rounded-xl p-5 sm:p-7 ambient-shadow">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  className={`group relative flex flex-col items-center justify-center p-6 rounded-xl text-center gap-3 outline-none transition-all duration-300 ${
                    isSelected
                      ? "bg-white shadow-[0_20px_40px_-10px_rgba(43,52,55,0.12)] -translate-y-1"
                      : "bg-[#eaeff1] hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(43,52,55,0.12)] hover:bg-white"
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                  type="button"
                >
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#4d44e3] group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {category.icon}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-headline font-bold text-lg text-[#2b3437]">{category.title}</h3>
                    <p className="font-body text-sm text-[#586064]">{category.description}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute inset-0 border-2 border-[#4d44e3] rounded-xl pointer-events-none"></div>
                  )}
                </button>
              );
            })}
          </div>
        </main>

        <footer className="flex justify-between items-center w-full max-w-3xl pt-3">
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-label font-semibold text-[#4d44e3] hover:bg-[#f1f4f6] transition-colors"
            onClick={() => navigate(`/products/add?generation=${encodeURIComponent(generationKey)}`)}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Back
          </button>

          <button
            className={`inline-flex items-center gap-2 px-7 py-2.5 rounded-md font-label font-semibold transition-opacity ambient-shadow ${
              selectedCategory
                ? "bg-gradient-to-r from-[#4d44e3] to-[#4034d7] text-[#faf6ff] hover:opacity-90"
                : "bg-[#e2e9ec] text-[#737c7f] cursor-not-allowed"
            }`}
            disabled={!selectedCategory}
            onClick={() =>
              navigate(
                `/products/add/details?generation=${encodeURIComponent(generationKey)}&category=${encodeURIComponent(
                  selectedCategory,
                )}`,
              )
            }
            type="button"
          >
            Next
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AddProductCategoryPage;
