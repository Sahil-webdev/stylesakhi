import { useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AddFlowProgress from "@/components/products/AddFlowProgress";
import { getAdminToken } from "@/lib/adminAuth";

const generationLabelMap: Record<string, string> = {
  "gen-z": "Gen Z",
  millennial: "Millennial",
  "gen-alpha": "Gen Alpha",
  "gen-x": "Gen X",
  boomer: "Boomer",
};

const categoryLabelMap: Record<string, string> = {
  clothing: "Clothing",
  accessories: "Accessories",
  sneakers: "Sneakers",
};

const accessorySubcategories = [
  { value: "bags", label: "Bag" },
  { value: "rings", label: "Ring" },
  { value: "watches", label: "Watch" },
  { value: "sunglasses", label: "Sunglasses" },
  { value: "belts", label: "Belt" },
] as const;

const accessoryFieldMap: Record<string, Array<{ key: string; label: string; placeholder: string }>> = {
  bags: [
    { key: "closureType", label: "Closure type", placeholder: "e.g. Zipper" },
    { key: "outerMaterial", label: "Outer material", placeholder: "e.g. Faux Leather" },
    { key: "style", label: "Style", placeholder: "e.g. Contemporary" },
    { key: "occasionType", label: "Occasion type", placeholder: "e.g. Anniversary" },
    { key: "numberOfPockets", label: "Number of pockets", placeholder: "e.g. 2" },
    { key: "lining", label: "Lining", placeholder: "e.g. Polyester" },
    { key: "countryOfOrigin", label: "Country of Origin", placeholder: "e.g. India" },
  ],
  rings: [
    { key: "metalType", label: "Metal type", placeholder: "e.g. Sterling Silver" },
    { key: "ringStyle", label: "Ring style", placeholder: "e.g. Signet" },
    { key: "stoneType", label: "Stone type", placeholder: "e.g. Cubic Zirconia" },
    { key: "ringSize", label: "Ring size", placeholder: "e.g. 7" },
    { key: "finish", label: "Finish", placeholder: "e.g. Polished" },
    { key: "occasionType", label: "Occasion type", placeholder: "e.g. Casual / Party" },
    { key: "countryOfOrigin", label: "Country of Origin", placeholder: "e.g. Thailand" },
  ],
  watches: [
    { key: "movementType", label: "Movement type", placeholder: "e.g. Quartz" },
    { key: "dialShape", label: "Dial shape", placeholder: "e.g. Round" },
    { key: "strapMaterial", label: "Strap material", placeholder: "e.g. Stainless Steel" },
    { key: "waterResistance", label: "Water resistance", placeholder: "e.g. 5 ATM" },
    { key: "displayType", label: "Display type", placeholder: "e.g. Analog" },
    { key: "caseMaterial", label: "Case material", placeholder: "e.g. Alloy" },
    { key: "warranty", label: "Warranty", placeholder: "e.g. 12 months" },
  ],
  sunglasses: [
    { key: "frameMaterial", label: "Frame material", placeholder: "e.g. Acetate" },
    { key: "lensType", label: "Lens type", placeholder: "e.g. Polarized" },
    { key: "uvProtection", label: "UV protection", placeholder: "e.g. UV400" },
    { key: "frameShape", label: "Frame shape", placeholder: "e.g. Wayfarer" },
    { key: "style", label: "Style", placeholder: "e.g. Retro" },
    { key: "fitType", label: "Fit type", placeholder: "e.g. Medium" },
    { key: "countryOfOrigin", label: "Country of Origin", placeholder: "e.g. Italy" },
  ],
  belts: [
    { key: "beltMaterial", label: "Belt material", placeholder: "e.g. Genuine Leather" },
    { key: "buckleType", label: "Buckle type", placeholder: "e.g. Pin Buckle" },
    { key: "beltWidth", label: "Belt width", placeholder: "e.g. 35 mm" },
    { key: "closureType", label: "Closure type", placeholder: "e.g. Adjustable holes" },
    { key: "reversible", label: "Reversible", placeholder: "e.g. Yes / No" },
    { key: "style", label: "Style", placeholder: "e.g. Formal" },
    { key: "countryOfOrigin", label: "Country of Origin", placeholder: "e.g. India" },
  ],
};

const sneakerSizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44"] as const;

const sneakerColorOptions = [
  { value: "#e5e9ec", label: "Cloud Grey" },
  { value: "#2b3437", label: "Jet Black" },
  { value: "#b095ff", label: "Lavender" },
  { value: "#8fb9aa", label: "Mint Sage" },
] as const;

const sneakerFields = [
  { key: "materialType", label: "Material type", placeholder: "e.g. Faux Leather" },
  { key: "closureType", label: "Closure type", placeholder: "e.g. Lace-Up" },
  { key: "heelType", label: "Heel type", placeholder: "e.g. Flat" },
  { key: "waterResistanceLevel", label: "Water resistance level", placeholder: "e.g. Not Water Resistant" },
  { key: "style", label: "Style", placeholder: "e.g. Sneaker" },
  { key: "outerMaterial", label: "Outer material", placeholder: "e.g. Faux Leather" },
  { key: "countryOfOrigin", label: "Country of Origin", placeholder: "e.g. India" },
] as const;

const normalizeApiBaseUrl = (input?: string) => {
  const value = (input || "").trim().replace(/\/+$/, "");
  if (!value) return "http://localhost:5000/api";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith(":")) return `http://localhost${value}`;
  if (value.startsWith("/")) return `http://localhost:5000${value}`;
  return `http://${value}`;
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

const AddProductDetailsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const generationKey = searchParams.get("generation") || "gen-z";
  const categoryKey = searchParams.get("category") || "clothing";
  const [selectedAccessoryCategory, setSelectedAccessoryCategory] = useState<string>("bags");
  const [accessoryDetails, setAccessoryDetails] = useState<Record<string, string>>({});
  const [selectedSneakerSizes, setSelectedSneakerSizes] = useState<string[]>(["40"]);
  const [selectedSneakerColors, setSelectedSneakerColors] = useState<string[]>([sneakerColorOptions[0].value]);
  const [sneakerDetails, setSneakerDetails] = useState<Record<string, string>>({});
  const [uploadedImages, setUploadedImages] = useState<Array<{ id: string; fileName: string; previewUrl: string; dataUrl: string }>>([]);
  const [uploadedVideo, setUploadedVideo] = useState<{ fileName: string; previewUrl: string; dataUrl: string } | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");
  const [clothingFabricType, setClothingFabricType] = useState("");
  const [clothingPattern, setClothingPattern] = useState("");
  const [clothingStyle, setClothingStyle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [isHighestSelling, setIsHighestSelling] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const generationLabel = useMemo(() => generationLabelMap[generationKey] || "Gen Z", [generationKey]);
  const categoryLabel = useMemo(() => categoryLabelMap[categoryKey] || "Clothing", [categoryKey]);
  const activeAccessoryFields = useMemo(
    () => accessoryFieldMap[selectedAccessoryCategory] || [],
    [selectedAccessoryCategory],
  );

  const addImages = async (fileList: FileList | null) => {
    if (!fileList) return;

    const validFiles = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    if (validFiles.length === 0) return;

    const remainingSlots = Math.max(0, 4 - uploadedImages.length);
    if (remainingSlots === 0) return;

    const toDataUrl = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Failed to read image file"));
        reader.readAsDataURL(file);
      });

    const chosenFiles = validFiles.slice(0, remainingSlots);
    const nextFiles = await Promise.all(
      chosenFiles.map(async (file) => ({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
        fileName: file.name,
        previewUrl: URL.createObjectURL(file),
        dataUrl: await toDataUrl(file),
      })),
    );

    setUploadedImages((prev) => [...prev, ...nextFiles]);
  };

  const removeImage = (id: string) => {
    setUploadedImages((prev) => {
      const target = prev.find((image) => image.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((image) => image.id !== id);
    });
  };

  const addVideo = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = Array.from(fileList).find((item) => item.type.startsWith("video/"));
    if (!file) {
      setFormError("Please choose a valid video file.");
      return;
    }

    const toDataUrl = (targetFile: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Failed to read video file"));
        reader.readAsDataURL(targetFile);
      });

    try {
      const dataUrl = await toDataUrl(file);
      setUploadedVideo((prev) => {
        if (prev) URL.revokeObjectURL(prev.previewUrl);
        return {
          fileName: file.name,
          previewUrl: URL.createObjectURL(file),
          dataUrl,
        };
      });
    } catch {
      setFormError("Failed to process selected video.");
    }
  };

  const removeVideo = () => {
    setUploadedVideo((prev) => {
      if (prev) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
  };

  const handleCreateProduct = async () => {
    setFormMessage("");
    setFormError("");

    if (!name.trim()) {
      setFormError("Product name is required.");
      return;
    }
    if (!description.trim()) {
      setFormError("Description is required.");
      return;
    }
    if (!price || Number(price) < 0) {
      setFormError("Please enter a valid price.");
      return;
    }
    if (!stock || Number(stock) < 0) {
      setFormError("Please enter valid stock.");
      return;
    }
    if (uploadedImages.length === 0) {
      setFormError("Please upload at least 1 product image.");
      return;
    }

    const productDetails =
      categoryKey === "accessories"
        ? accessoryDetails
        : categoryKey === "sneakers"
          ? sneakerDetails
          : {
              fabricType: clothingFabricType,
              pattern: clothingPattern,
              style: clothingStyle,
            };

    const payload = {
      name: name.trim(),
      description: description.trim(),
      category: categoryKey,
      generation: generationKey,
      subCategory: categoryKey === "accessories" ? selectedAccessoryCategory : "",
      price: Number(price),
      stock: Number(stock),
      brand: brand.trim(),
      sizes: categoryKey === "sneakers" ? selectedSneakerSizes : [],
      colors: categoryKey === "sneakers" ? selectedSneakerColors : [],
      images: uploadedImages.map((item) => item.dataUrl),
      video: uploadedVideo?.dataUrl || "",
      productDetails,
      isActive: true,
      featured: false,
      isHighestSelling,
    };

    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Failed to create product");
      }
      setFormMessage("Product added successfully.");
      setTimeout(() => navigate("/products"), 900);
    } catch (error) {
      if (error instanceof TypeError) {
        setFormError("Backend API unreachable. Please start backend on http://localhost:5000 and retry.");
      } else {
        setFormError(error instanceof Error ? error.message : "Failed to create product");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f9fa] text-[#2b3437] min-h-screen flex antialiased">
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
      `}</style>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8f9fa] font-body">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                className="text-[#586064] hover:text-[#4d44e3] transition-colors flex items-center gap-2 font-medium"
                onClick={() => navigate(`/products/add/category?generation=${encodeURIComponent(generationKey)}`)}
                type="button"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Back
              </button>
            </div>
            <div className="text-right hidden sm:block">
              <p className="font-label text-xs uppercase tracking-widest text-[#586064]">
                {generationLabel} | {categoryLabel}
              </p>
            </div>
          </div>

          <div className="mt-2">
            <AddFlowProgress from={66.66} stepLabel="Step 3 of 3" stepTitle="Product Details" to={100} />
          </div>

          <div className="mt-2">
            <h1 className="text-2xl md:text-3xl font-headline font-bold text-[#2b3437] tracking-tight">
              Adding {generationLabel} {categoryLabel}
            </h1>
            <p className="text-[#586064] mt-1 text-sm">Finalize product details, media, and variations before publishing.</p>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-16 pt-5">
          <div className="max-w-5xl mx-auto">
            <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 flex flex-col gap-6">
                <section className="bg-white rounded-xl p-6 shadow-[0_4px_40px_rgba(43,52,55,0.06)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#f1f4f6]/20 pointer-events-none"></div>
                  <div className="relative z-10">
                    <h3 className="text-lg md:text-xl font-headline font-bold mb-5 text-[#2b3437]">Basic Information</h3>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-[#586064] mb-2">Product Name</label>
                        <input
                          className="w-full bg-[#f1f4f6] border-0 rounded-lg px-4 py-3 text-[#2b3437] focus:bg-white focus:ring-1 focus:ring-[#abb3b7]/20 transition-colors placeholder:text-[#abb3b7]"
                          onChange={(event) => setName(event.target.value)}
                          placeholder="e.g. Oversized Vintage Wash Hoodie"
                          type="text"
                          value={name}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#586064] mb-2">Description</label>
                        <textarea
                          className="w-full bg-[#f1f4f6] border-0 rounded-lg px-4 py-3 text-[#2b3437] focus:bg-white focus:ring-1 focus:ring-[#abb3b7]/20 transition-colors placeholder:text-[#abb3b7] resize-none"
                          onChange={(event) => setDescription(event.target.value)}
                          placeholder="Describe the fit, feel, and details..."
                          rows={4}
                          value={description}
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#586064] mb-2">Price (USD)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-[#586064] font-medium">$</span>
                            <input
                              className="w-full bg-[#f1f4f6] border-0 rounded-lg pl-8 pr-4 py-3 text-[#2b3437] focus:bg-white focus:ring-1 focus:ring-[#abb3b7]/20 transition-colors placeholder:text-[#abb3b7]"
                              onChange={(event) => setPrice(event.target.value)}
                              placeholder="0.00"
                              type="number"
                              value={price}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#586064] mb-2">Initial Stock</label>
                          <input
                            className="w-full bg-[#f1f4f6] border-0 rounded-lg px-4 py-3 text-[#2b3437] focus:bg-white focus:ring-1 focus:ring-[#abb3b7]/20 transition-colors placeholder:text-[#abb3b7]"
                            onChange={(event) => setStock(event.target.value)}
                            placeholder="0"
                            type="number"
                            value={stock}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-xl p-6 shadow-[0_4px_40px_rgba(43,52,55,0.06)]">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg md:text-xl font-headline font-bold text-[#2b3437]">Media</h3>
                    <span className="text-sm text-[#586064]">{uploadedImages.length}/4 images {uploadedVideo ? "| 1 video" : "| 0 video"}</span>
                  </div>
                  <div
                    className="border-2 border-dashed border-[#abb3b7]/40 rounded-xl bg-[#f1f4f6]/50 p-8 md:p-10 flex flex-col items-center justify-center text-center hover:bg-[#f1f4f6] transition-colors cursor-pointer group"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      addImages(event.dataTransfer.files);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4 group-hover:shadow-md transition-shadow">
                      <span className="material-symbols-outlined text-[#4d44e3] text-3xl">cloud_upload</span>
                    </div>
                    <h4 className="font-headline font-semibold text-[#2b3437] mb-2">Drag and drop images here</h4>
                    <p className="text-sm text-[#586064] max-w-sm">
                      Support JPG, PNG, WEBP. High resolution recommended (1080x1080px min). Max 4 images.
                    </p>
                    <button
                      className="mt-5 px-5 py-2 bg-[#dbe4e7] text-[#4d44e3] font-medium rounded-md hover:bg-[#dbe4e7]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={uploadedImages.length >= 4}
                      onClick={() => fileInputRef.current?.click()}
                      type="button"
                    >
                      Browse Files
                    </button>
                    <input
                      accept="image/*"
                      className="hidden"
                      multiple
                      onChange={(event) => {
                        addImages(event.target.files);
                        event.currentTarget.value = "";
                      }}
                      ref={fileInputRef}
                      type="file"
                    />
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {uploadedImages.map((image) => (
                        <div key={image.id} className="relative rounded-lg overflow-hidden bg-[#f1f4f6] aspect-square">
                          <img alt={image.fileName} className="w-full h-full object-cover" src={image.previewUrl} />
                          <button
                            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/55 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                            onClick={() => removeImage(image.id)}
                            title="Remove image"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 rounded-xl border border-[#dbe4e7] bg-[#fcfcfd] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-headline text-base font-bold text-[#2b3437]">Product Video (optional)</h4>
                      <button
                        className="rounded-md bg-[#dbe4e7] px-3 py-1.5 text-xs font-semibold text-[#4d44e3] transition-colors hover:bg-[#cfdbdf]"
                        onClick={() => videoInputRef.current?.click()}
                        type="button"
                      >
                        {uploadedVideo ? "Replace Video" : "Upload Video"}
                      </button>
                    </div>
                    <p className="text-xs text-[#586064]">Upload MP4/WEBM video to show on website product cards and detail page.</p>
                    <input
                      accept="video/*"
                      className="hidden"
                      onChange={(event) => {
                        void addVideo(event.target.files);
                        event.currentTarget.value = "";
                      }}
                      ref={videoInputRef}
                      type="file"
                    />

                    {uploadedVideo ? (
                      <div className="relative mt-3 overflow-hidden rounded-lg bg-[#f1f4f6]">
                        <video className="h-48 w-full object-cover" controls preload="metadata" src={uploadedVideo.previewUrl} />
                        <button
                          className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/55 text-white hover:bg-black/70"
                          onClick={removeVideo}
                          title="Remove video"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 rounded-lg border border-dashed border-[#dbe4e7] bg-white p-3 text-xs text-[#586064]">
                        No video selected.
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <div className="flex flex-col gap-6">
                {categoryKey === "accessories" ? (
                  <section className="bg-white rounded-xl p-6 shadow-[0_4px_40px_rgba(43,52,55,0.06)]">
                    <h3 className="text-lg md:text-xl font-headline font-bold mb-5 text-[#2b3437]">Product Details</h3>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-[#586064] mb-2">Category</label>
                        <input
                          className="w-full bg-[#eaeff1] border-0 rounded-lg px-4 py-2.5 text-[#2b3437] font-medium"
                          readOnly
                          type="text"
                          value="Accessories"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#586064] mb-2">Sub category</label>
                        <div className="relative">
                          <select
                            className="appearance-none w-full bg-[#f1f4f6] border-0 rounded-lg px-4 py-2.5 text-[#2b3437] focus:bg-white focus:ring-1 focus:ring-[#abb3b7]/30 outline-none transition-colors"
                            onChange={(event) => setSelectedAccessoryCategory(event.target.value)}
                            value={selectedAccessoryCategory}
                          >
                            {accessorySubcategories.map((subcategory) => (
                              <option key={subcategory.value} value={subcategory.value}>
                                {subcategory.label}
                              </option>
                            ))}
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#586064] pointer-events-none">
                            expand_more
                          </span>
                        </div>
                      </div>

                      <div className="rounded-xl border border-[#dbe4e7] bg-[#fcfcfd] p-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#e6e8ea]">
                          <h4 className="font-headline font-bold text-[#2b3437] text-base">Top highlights</h4>
                          <span className="material-symbols-outlined text-[#586064]">expand_less</span>
                        </div>

                        <div className="pt-4 space-y-3">
                          {activeAccessoryFields.map((field) => (
                            <div key={field.key} className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 items-center">
                              <label className="text-sm font-semibold text-[#2b3437]">{field.label}</label>
                              <input
                                className="w-full bg-white border border-[#e2e9ec] rounded-lg px-3 py-2 text-sm text-[#2b3437] focus:ring-2 focus:ring-[#4d44e3]/15 focus:border-[#4d44e3]/40 outline-none transition-colors"
                                onChange={(event) =>
                                  setAccessoryDetails((prev) => ({
                                    ...prev,
                                    [field.key]: event.target.value,
                                  }))
                                }
                                placeholder={field.placeholder}
                                type="text"
                                value={accessoryDetails[field.key] || ""}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                ) : categoryKey === "sneakers" ? (
                  <section className="bg-white rounded-xl p-6 shadow-[0_4px_40px_rgba(43,52,55,0.06)]">
                    <h3 className="text-lg md:text-xl font-headline font-bold mb-5 text-[#2b3437]">Sneaker Details</h3>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-[#586064] mb-2">Brand</label>
                        <input
                          className="w-full bg-[#f1f4f6] border-0 rounded-lg px-4 py-2.5 text-[#2b3437] focus:bg-white focus:ring-1 focus:ring-[#abb3b7]/30 transition-colors placeholder:text-[#abb3b7]"
                          onChange={(event) => setBrand(event.target.value)}
                          placeholder="e.g. Nova Form"
                          type="text"
                          value={brand}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#586064] mb-2">Available sizes</label>
                        <div className="grid grid-cols-5 gap-2">
                          {sneakerSizes.map((size) => {
                            const isActive = selectedSneakerSizes.includes(size);
                            return (
                              <button
                                key={size}
                                className={`h-9 rounded-lg text-sm font-medium transition-colors ${
                                  isActive
                                    ? "bg-[#4d44e3]/10 text-[#4d44e3] border border-[#4d44e3]/25"
                                    : "bg-[#f1f4f6] text-[#2b3437] hover:bg-[#e2e9ec]"
                                }`}
                                onClick={() =>
                                  setSelectedSneakerSizes((prev) =>
                                    prev.includes(size) ? prev.filter((item) => item !== size) : [...prev, size],
                                  )
                                }
                                type="button"
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#586064] mb-2">Color options</label>
                        <div className="flex items-center gap-3 flex-wrap">
                          {sneakerColorOptions.map((color) => {
                            const isActive = selectedSneakerColors.includes(color.value);
                            return (
                              <button
                                key={color.value}
                                aria-label={color.label}
                                className={`w-9 h-9 rounded-full transition-all ${isActive ? "ring-2 ring-[#4d44e3] ring-offset-2" : "ring-1 ring-[#dbe4e7]"}`}
                                onClick={() =>
                                  setSelectedSneakerColors((prev) =>
                                    prev.includes(color.value)
                                      ? prev.filter((item) => item !== color.value)
                                      : [...prev, color.value],
                                  )
                                }
                                style={{ backgroundColor: color.value }}
                                title={color.label}
                                type="button"
                              />
                            );
                          })}
                        </div>
                      </div>

                      <div className="rounded-xl border border-[#dbe4e7] bg-[#fcfcfd] p-4">
                        <div className="flex items-center justify-between pb-3 border-b border-[#e6e8ea]">
                          <h4 className="font-headline font-bold text-[#2b3437] text-base">Top highlights</h4>
                          <span className="material-symbols-outlined text-[#586064]">expand_less</span>
                        </div>

                        <div className="pt-4 space-y-3">
                          {sneakerFields.map((field) => (
                            <div key={field.key} className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 items-center">
                              <label className="text-sm font-semibold text-[#2b3437]">{field.label}</label>
                              <input
                                className="w-full bg-white border border-[#e2e9ec] rounded-lg px-3 py-2 text-sm text-[#2b3437] focus:ring-2 focus:ring-[#4d44e3]/15 focus:border-[#4d44e3]/40 outline-none transition-colors"
                                onChange={(event) =>
                                  setSneakerDetails((prev) => ({
                                    ...prev,
                                    [field.key]: event.target.value,
                                  }))
                                }
                                placeholder={field.placeholder}
                                type="text"
                                value={sneakerDetails[field.key] || ""}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                ) : (
                  <section className="bg-white rounded-xl p-6 shadow-[0_4px_40px_rgba(43,52,55,0.06)]">
                    <h3 className="text-lg md:text-xl font-headline font-bold mb-5 text-[#2b3437]">Clothing Specifics</h3>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-[#586064] mb-2">Fabric Type</label>
                        <input
                          className="w-full bg-[#f1f4f6] border-0 rounded-lg px-4 py-3 text-[#2b3437] focus:bg-white focus:ring-1 focus:ring-[#abb3b7]/20 transition-colors placeholder:text-[#abb3b7]"
                          onChange={(event) => setClothingFabricType(event.target.value)}
                          placeholder="e.g. 100% Heavyweight Cotton"
                          type="text"
                          value={clothingFabricType}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#586064] mb-2">Pattern / Print</label>
                        <input
                          className="w-full bg-[#f1f4f6] border-0 rounded-lg px-4 py-3 text-[#2b3437] focus:bg-white focus:ring-1 focus:ring-[#abb3b7]/20 transition-colors placeholder:text-[#abb3b7]"
                          onChange={(event) => setClothingPattern(event.target.value)}
                          placeholder="e.g. Solid / Graphic"
                          type="text"
                          value={clothingPattern}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#586064] mb-2">Style</label>
                        <input
                          className="w-full bg-[#f1f4f6] border-0 rounded-lg px-4 py-3 text-[#2b3437] focus:bg-white focus:ring-1 focus:ring-[#abb3b7]/20 transition-colors placeholder:text-[#abb3b7]"
                          onChange={(event) => setClothingStyle(event.target.value)}
                          placeholder="e.g. Contemporary Minimal"
                          type="text"
                          value={clothingStyle}
                        />
                      </div>
                    </div>
                  </section>
                )}

                <section className="bg-white rounded-xl p-6 shadow-[0_4px_40px_rgba(43,52,55,0.06)]">
                  <h3 className="text-lg font-headline font-bold text-[#2b3437] mb-4">Merchandising</h3>
                  <button
                    className={`w-full flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                      isHighestSelling
                        ? "border-[#facc15]/40 bg-[#fffbeb] text-[#854d0e]"
                        : "border-[#dbe4e7] bg-[#f8fafb] text-[#586064] hover:bg-[#f1f4f6]"
                    }`}
                    onClick={() => setIsHighestSelling((prev) => !prev)}
                    type="button"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">
                        {isHighestSelling ? "star" : "star_outline"}
                      </span>
                      Mark as Highest Selling
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      {isHighestSelling ? "Enabled" : "Disabled"}
                    </span>
                  </button>
                  <p className="mt-2 text-xs text-[#586064]">
                    Enabled products will appear in the generation page highest-selling section.
                  </p>
                </section>

                <div className="bg-white rounded-xl p-5 shadow-[0_4px_40px_rgba(43,52,55,0.06)] flex flex-col gap-3 mt-auto">
                  <button
                    className="w-full py-3 rounded-lg bg-gradient-to-br from-[#4d44e3] to-[#4034d7] text-[#faf6ff] font-headline font-bold text-base shadow-[0_8px_24px_rgba(77,68,227,0.2)] hover:shadow-[0_12px_32px_rgba(77,68,227,0.3)] transition-all transform hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={submitting}
                    onClick={handleCreateProduct}
                    type="button"
                  >
                    {submitting ? "Adding..." : "Add Product"}
                  </button>
                  <button className="w-full py-2.5 rounded-lg bg-transparent text-[#4d44e3] font-medium hover:bg-[#4d44e3]/5 transition-colors" type="button">
                    Save as Draft
                  </button>
                  {formMessage ? <p className="text-xs text-[#0f7b50] font-medium">{formMessage}</p> : null}
                  {formError ? <p className="text-xs text-[#9e3f4e] font-medium">{formError}</p> : null}
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddProductDetailsPage;
