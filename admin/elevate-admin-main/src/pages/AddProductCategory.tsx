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
  const [isRedirecting, setIsRedirecting] = useState(false);

  const generationKey = searchParams.get("generation") || "gen-z";
  const generationLabel = useMemo(() => generationLabelMap[generationKey] || "Gen Z", [generationKey]);

  const handleCategorySelect = (value: string) => {
    if (isRedirecting) return;
    setSelectedCategory(value);
    setIsRedirecting(true);
    window.setTimeout(() => {
      navigate(
        `/products/add/details?generation=${encodeURIComponent(generationKey)}&category=${encodeURIComponent(value)}`,
      );
    }, 140);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f9fa] p-4 font-body text-[#2b3437] antialiased sm:p-6">
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

        .ambient-shadow {
          box-shadow: 0 10px 40px -10px rgba(43, 52, 55, 0.06);
        }
      `}</style>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 sm:gap-6">
        <header className="flex flex-col items-center gap-4 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-[#f1f4f6] px-3 py-1.5 font-label text-xs font-medium text-[#586064] sm:text-sm">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            Selected Generation: {generationLabel}
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-headline text-2xl font-extrabold tracking-tight text-[#2b3437] sm:text-3xl">What type of product is it?</h1>
            <p className="mx-auto max-w-lg text-sm text-[#586064] sm:text-base">
              Select the primary category to categorize your new addition accurately.
            </p>
          </div>
        </header>

        <div className="mx-auto w-full max-w-md">
          <AddFlowProgress from={33.33} stepLabel="Step 2 of 3" stepTitle="Select Category" to={66.66} />
        </div>

        <main className="ambient-shadow w-full rounded-xl bg-[#f1f4f6] p-4 sm:p-6 md:p-7">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  className={`group relative flex flex-col items-center justify-center gap-3 rounded-xl p-5 text-center outline-none transition-all duration-300 sm:p-6 ${
                    isSelected
                      ? "bg-white -translate-y-1 shadow-[0_20px_40px_-10px_rgba(43,52,55,0.12)]"
                      : "bg-[#eaeff1] hover:-translate-y-1 hover:bg-white hover:shadow-[0_20px_40px_-10px_rgba(43,52,55,0.12)]"
                  }`}
                  onClick={() => handleCategorySelect(category.id)}
                  type="button"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#4d44e3] shadow-sm transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {category.icon}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-headline text-base font-bold text-[#2b3437] sm:text-lg">{category.title}</h3>
                    <p className="font-body text-xs text-[#586064] sm:text-sm">{category.description}</p>
                  </div>
                  {isSelected ? <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-[#4d44e3]"></div> : null}
                </button>
              );
            })}
          </div>
        </main>

        <footer className="flex w-full max-w-3xl flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between sm:pt-3">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 font-label font-semibold text-[#4d44e3] transition-colors hover:bg-[#f1f4f6] sm:justify-start"
            onClick={() => navigate(-1)}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Back
          </button>

          <div className="flex items-center justify-center gap-2 rounded-xl bg-[#f1f4f6] px-4 py-2 text-center text-xs font-medium text-[#586064] sm:justify-end sm:text-sm">
            <span className="material-symbols-outlined text-[18px] text-[#4d44e3]">touch_app</span>
            Select a category to continue automatically
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AddProductCategoryPage;
