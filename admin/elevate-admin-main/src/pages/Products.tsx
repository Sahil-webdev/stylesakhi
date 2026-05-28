import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getAdminToken } from "@/lib/adminAuth";
import { deleteAdminMedia, uploadAdminMedia } from "@/lib/mediaUpload";

type AdminProduct = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  generation: string;
  subCategory?: string;
  price: number;
  stock: number;
  discountPrice?: number | null;
  images: string[];
  video?: string;
  brand?: string;
  sizes?: string[];
  colors?: string[];
  productDetails?: Record<string, string>;
  featured?: boolean;
  isActive?: boolean;
  isHighestSelling?: boolean;
  highestSellingMarkedAt?: string | null;
  createdAt?: string;
};

type ProductEditForm = {
  name: string;
  description: string;
  category: "clothing" | "accessories" | "sneakers";
  generation: "gen-z" | "millennial" | "gen-x" | "boomer" | "gen-alpha";
  subCategory: string;
  price: string;
  stock: string;
  brand: string;
  featured: boolean;
  isActive: boolean;
  isHighestSelling: boolean;
};

type EditableImage = {
  id: string;
  fileName: string;
  previewUrl: string;
  mediaUrl: string;
  publicId?: string;
};

type EditableVideo = {
  fileName: string;
  previewUrl: string;
  mediaUrl: string;
  publicId?: string;
};

const normalizeApiBaseUrl = (input?: string) => {
  const value = (input || "").trim().replace(/\/+$/, "");
  if (!value) return "https://stylesakhi.com/api";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith(":")) return `http://localhost${value}`;
  if (value.startsWith("/")) return `https://stylesakhi.com${value}`;
  return `http://${value}`;
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

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

const formatCategory = (value: string) =>
  value
    .split("-")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");

const formatGeneration = (value: string) =>
  value
    .split("-")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");

const ProductsPage = () => {
  const { hasModuleAccess } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [targetFilter, setTargetFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingProductIds, setTogglingProductIds] = useState<Record<string, boolean>>({});
  const [savingProductId, setSavingProductId] = useState("");
  const [deletingProductId, setDeletingProductId] = useState("");
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [editError, setEditError] = useState("");
  const [editImages, setEditImages] = useState<EditableImage[]>([]);
  const [editVideo, setEditVideo] = useState<EditableVideo | null>(null);
  const [selectedAccessoryCategory, setSelectedAccessoryCategory] = useState<string>("bags");
  const [accessoryDetails, setAccessoryDetails] = useState<Record<string, string>>({});
  const [selectedSneakerSizes, setSelectedSneakerSizes] = useState<string[]>([]);
  const [selectedSneakerColors, setSelectedSneakerColors] = useState<string[]>([]);
  const [sneakerDetails, setSneakerDetails] = useState<Record<string, string>>({});
  const [clothingFabricType, setClothingFabricType] = useState("");
  const [clothingPattern, setClothingPattern] = useState("");
  const [clothingStyle, setClothingStyle] = useState("");
  const [pendingDeleteProduct, setPendingDeleteProduct] = useState<AdminProduct | null>(null);
  const editFileInputRef = useRef<HTMLInputElement | null>(null);
  const editVideoInputRef = useRef<HTMLInputElement | null>(null);
  const [editForm, setEditForm] = useState<ProductEditForm>({
    name: "",
    description: "",
    category: "clothing",
    generation: "gen-z",
    subCategory: "",
    price: "",
    stock: "",
    brand: "",
    featured: false,
    isActive: true,
    isHighestSelling: false,
  });

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        const normalized = value.trim();
        if (normalized) next.set("q", value);
        else next.delete("q");
        return next;
      },
      { replace: true },
    );
  };

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchQuery((prev) => (prev === q ? prev : q));
  }, [searchParams]);

  useEffect(() => {
    let mounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${API_BASE_URL}/products?isActive=true&limit=200`);
        const payload = await response.json();

        if (!response.ok || !payload?.success) {
          throw new Error(payload?.error || "Failed to load products");
        }

        const items = (payload.data?.items || []) as AdminProduct[];
        if (mounted) {
          setProducts(items);
        }
      } catch (fetchError) {
        if (mounted) {
          if (fetchError instanceof TypeError) {
            setError("Backend API unreachable. Check VITE_API_URL or backend deployment.");
          } else {
            setError(fetchError instanceof Error ? fetchError.message : "Failed to load products");
          }
          setProducts([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filtered = products.filter((product) => {
      if (product.isActive === false) return false;
      const categoryLabel = formatCategory(product.category).toLowerCase();
      const generationLabel = formatGeneration(product.generation).toLowerCase();
      const subCategoryLabel = (product.subCategory || "").toLowerCase();

      const matchesSearch =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        categoryLabel.includes(normalizedQuery) ||
        generationLabel.includes(normalizedQuery) ||
        subCategoryLabel.includes(normalizedQuery);

      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
      const matchesTarget = targetFilter === "all" || product.generation === targetFilter;

      return matchesSearch && matchesCategory && matchesTarget;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price_high") return b.price - a.price;
      if (sortBy === "price_low") return a.price - b.price;
      if (sortBy === "popular") return b.stock - a.stock;
      if (sortBy === "oldest") return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [products, searchQuery, categoryFilter, targetFilter, sortBy]);

  const canCreateProduct = hasModuleAccess("products", "can_create");
  const canEditProduct = hasModuleAccess("products", "can_edit");
  const canDeleteProduct = hasModuleAccess("products", "can_delete");
  const activeAccessoryFields = useMemo(
    () => accessoryFieldMap[selectedAccessoryCategory] || [],
    [selectedAccessoryCategory],
  );

  const normalizeDetails = (value: Record<string, string>) =>
    Object.entries(value).reduce<Record<string, string>>((acc, [key, detail]) => {
      const normalized = detail.trim();
      if (normalized) acc[key] = normalized;
      return acc;
    }, {});

  const replaceEditImages = (nextImages: EditableImage[]) => {
    setEditImages(nextImages);
  };

  const addEditImages = async (fileList: FileList | null) => {
    if (!fileList) return;

    const validFiles = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    if (validFiles.length === 0) return;

    const remainingSlots = Math.max(0, 4 - editImages.length);
    if (remainingSlots === 0) return;

    const chosenFiles = validFiles.slice(0, remainingSlots);
    const token = getAdminToken();
    if (!token) {
      setEditError("Admin session expired. Please login again.");
      return;
    }

    try {
      const nextFiles = await Promise.all(
        chosenFiles.map(async (file) => {
          const uploaded = await uploadAdminMedia({
            apiBaseUrl: API_BASE_URL,
            token,
            file,
            kind: "product-image",
          });

          return {
            id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
            fileName: file.name,
            previewUrl: uploaded.url,
            mediaUrl: uploaded.url,
            publicId: uploaded.publicId,
          } satisfies EditableImage;
        }),
      );

      setEditImages((prev) => [...prev, ...nextFiles]);
    } catch (error) {
      setEditError(error instanceof Error ? error.message : "Failed to upload image.");
    }
  };

  const removeEditImage = (id: string) => {
    const target = editImages.find((image) => image.id === id);
    if (target?.publicId) {
      void deleteAdminMedia({
        apiBaseUrl: API_BASE_URL,
        token: getAdminToken(),
        publicId: target.publicId,
      });
    }
    setEditImages((prev) => prev.filter((image) => image.id !== id));
  };

  const replaceEditVideo = (nextVideo: EditableVideo | null) => {
    setEditVideo(nextVideo);
  };

  const addEditVideo = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = Array.from(fileList).find((item) => item.type.startsWith("video/"));
    if (!file) {
      setEditError("Please choose a valid video file.");
      return;
    }

    try {
      const token = getAdminToken();
      if (!token) {
        setEditError("Admin session expired. Please login again.");
        return;
      }

      const uploaded = await uploadAdminMedia({
        apiBaseUrl: API_BASE_URL,
        token,
        file,
        kind: "product-video",
      });

      if (editVideo?.publicId) {
        void deleteAdminMedia({
          apiBaseUrl: API_BASE_URL,
          token,
          publicId: editVideo.publicId,
        });
      }
      setEditVideo({
        fileName: file.name,
        previewUrl: uploaded.url,
        mediaUrl: uploaded.url,
        publicId: uploaded.publicId,
      });
    } catch (error) {
      setEditError(error instanceof Error ? error.message : "Failed to process selected video.");
    }
  };

  const removeEditVideo = () => {
    if (editVideo?.publicId) {
      void deleteAdminMedia({
        apiBaseUrl: API_BASE_URL,
        token: getAdminToken(),
        publicId: editVideo.publicId,
      });
    }
    setEditVideo(null);
  };

  const handleEditCategoryChange = (category: ProductEditForm["category"]) => {
    setEditForm((prev) => ({
      ...prev,
      category,
      subCategory: category === "accessories" ? selectedAccessoryCategory : category === "sneakers" ? "" : prev.subCategory,
    }));

    if (category === "sneakers" && selectedSneakerColors.length === 0) {
      setSelectedSneakerColors([sneakerColorOptions[0].value]);
    }
  };

  useEffect(() => {
    if (editForm.category !== "accessories") return;
    setEditForm((prev) => {
      if (prev.subCategory === selectedAccessoryCategory) return prev;
      return { ...prev, subCategory: selectedAccessoryCategory };
    });
  }, [editForm.category, selectedAccessoryCategory]);

  const openEditModal = (product: AdminProduct) => {
    const category = (product.category as ProductEditForm["category"]) || "clothing";
    const generation = (product.generation as ProductEditForm["generation"]) || "gen-z";
    const normalizedDetails = product.productDetails || {};
    const accessoryCategoryFromProduct =
      category === "accessories" && product.subCategory
        ? accessorySubcategories.some((item) => item.value === product.subCategory)
          ? product.subCategory
          : "bags"
        : "bags";

    setEditError("");
    setEditingProduct(product);
    setSelectedAccessoryCategory(accessoryCategoryFromProduct);
    setAccessoryDetails(category === "accessories" ? normalizedDetails : {});
    setSelectedSneakerSizes(Array.isArray(product.sizes) ? product.sizes : []);
    setSelectedSneakerColors(Array.isArray(product.colors) ? product.colors : []);
    setSneakerDetails(category === "sneakers" ? normalizedDetails : {});
    setClothingFabricType(normalizedDetails.fabricType || "");
    setClothingPattern(normalizedDetails.pattern || "");
    setClothingStyle(normalizedDetails.style || "");
    replaceEditVideo(
      product.video
        ? {
            fileName: "product-video",
            previewUrl: product.video,
            mediaUrl: product.video,
          }
        : null,
    );
    replaceEditImages(
      (product.images || []).slice(0, 4).map((imageUrl, index) => ({
        id: `${product._id}-existing-${index}`,
        fileName: `image-${index + 1}`,
        previewUrl: imageUrl,
        mediaUrl: imageUrl,
      })),
    );
    setEditForm({
      name: product.name || "",
      description: product.description || "",
      category,
      generation,
      subCategory: category === "accessories" ? accessoryCategoryFromProduct : product.subCategory || "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      brand: product.brand || "",
      featured: Boolean(product.featured),
      isActive: product.isActive !== false,
      isHighestSelling: Boolean(product.isHighestSelling),
    });
  };

  const resetEditModalState = () => {
    replaceEditVideo(null);
    replaceEditImages([]);
    setAccessoryDetails({});
    setSneakerDetails({});
    setSelectedSneakerSizes([]);
    setSelectedSneakerColors([]);
    setClothingFabricType("");
    setClothingPattern("");
    setClothingStyle("");
    setEditError("");
    setEditingProduct(null);
  };

  const closeEditModal = () => {
    if (savingProductId) return;
    resetEditModalState();
  };

  const handleSaveEdit = async () => {
    if (!editingProduct || !canEditProduct) return;

    const images = editImages.map((image) => image.mediaUrl).slice(0, 4);
    if (images.length === 0) {
      setEditError("Please upload at least 1 product image.");
      return;
    }

    const parsedPrice = Number(editForm.price);
    const parsedStock = Number(editForm.stock);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setEditError("Please enter a valid price.");
      return;
    }
    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      setEditError("Please enter valid stock.");
      return;
    }

    const productDetails =
      editForm.category === "accessories"
        ? normalizeDetails(accessoryDetails)
        : editForm.category === "sneakers"
          ? normalizeDetails(sneakerDetails)
          : normalizeDetails({
              fabricType: clothingFabricType,
              pattern: clothingPattern,
              style: clothingStyle,
            });

    const subCategory =
      editForm.category === "accessories" ? selectedAccessoryCategory : editForm.subCategory.trim();

    try {
      setEditError("");
      setSavingProductId(editingProduct._id);

      const response = await fetch(`${API_BASE_URL}/products/${editingProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: JSON.stringify({
          name: editForm.name.trim(),
          description: editForm.description.trim(),
          category: editForm.category,
          generation: editForm.generation,
          subCategory,
          price: parsedPrice,
          stock: parsedStock,
          brand: editForm.brand.trim(),
          images,
          video: editVideo?.mediaUrl || "",
          sizes: editForm.category === "sneakers" ? selectedSneakerSizes : [],
          colors: editForm.category === "sneakers" ? selectedSneakerColors : [],
          productDetails,
          featured: editForm.featured,
          isActive: editForm.isActive,
          isHighestSelling: editForm.isHighestSelling,
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to update product");
      }

      const updated = payload.data as AdminProduct;
      setProducts((prev) => {
        if (updated.isActive === false) {
          return prev.filter((item) => item._id !== updated._id);
        }
        return prev.map((item) => (item._id === updated._id ? { ...item, ...updated } : item));
      });
      resetEditModalState();
    } catch (saveError) {
      setEditError(saveError instanceof Error ? saveError.message : "Failed to update product");
    } finally {
      setSavingProductId("");
    }
  };

  useEffect(() => {
    if (!editingProduct) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !savingProductId) {
        resetEditModalState();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [editingProduct, savingProductId]);

  const handleDeleteProduct = (product: AdminProduct) => {
    if (!canDeleteProduct || deletingProductId) return;
    setPendingDeleteProduct(product);
  };

  const confirmDeleteProduct = async () => {
    if (!canDeleteProduct || deletingProductId || !pendingDeleteProduct) return;
    try {
      setError("");
      setDeletingProductId(pendingDeleteProduct._id);
      const response = await fetch(`${API_BASE_URL}/products/${pendingDeleteProduct._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to delete product");
      }
      setProducts((prev) => prev.filter((item) => item._id !== pendingDeleteProduct._id));
      setPendingDeleteProduct(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete product");
    } finally {
      setDeletingProductId("");
    }
  };

  const handleToggleHighestSelling = async (product: AdminProduct) => {
    if (!canEditProduct || togglingProductIds[product._id]) return;

    try {
      setError("");
      setTogglingProductIds((prev) => ({ ...prev, [product._id]: true }));

      const response = await fetch(`${API_BASE_URL}/products/${product._id}/highest-selling`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: JSON.stringify({
          isHighestSelling: !Boolean(product.isHighestSelling),
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to update highest-selling status");
      }

      const updated = payload.data as AdminProduct;
      setProducts((prev) => prev.map((item) => (item._id === updated._id ? { ...item, ...updated } : item)));
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "Failed to update highest-selling status");
    } finally {
      setTogglingProductIds((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  return (
    <DashboardLayout>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap");

        .products-page { font-family: "Inter", sans-serif; }
        .products-page .font-headline { font-family: "Plus Jakarta Sans", sans-serif; }
        .material-symbols-outlined { font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24; line-height: 1; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      <div className="products-page w-full bg-[#f8f9fa] text-[#2b3437] p-6 md:p-8 lg:p-10 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-[#2b3437] tracking-tight mb-1">Products</h2>
            <p className="text-[#586064] text-sm md:text-base">
              Manage your inventory and product catalog. Showing {visibleProducts.length} product{visibleProducts.length === 1 ? "" : "s"}.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#2b3437] rounded-xl hover:bg-[#f1f4f6] transition-colors font-medium text-sm shadow-[0_4px_24px_rgba(43,52,55,0.04)]" type="button">
              <span className="material-symbols-outlined text-lg">download</span>
              Export
            </button>
            {canCreateProduct ? (
              <Link className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4d44e3] to-[#4034d7] text-[#faf6ff] rounded-xl hover:shadow-[0_8px_32px_rgba(77,68,227,0.2)] transition-all font-medium text-sm" to="/products/add">
                <span className="material-symbols-outlined text-lg">add</span>
                Add Product
              </Link>
            ) : null}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-[0_4px_24px_rgba(43,52,55,0.04)] mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full md:w-auto flex-1 flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:max-w-xs">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#586064] text-lg">search</span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-[#f1f4f6] border-none rounded-xl text-sm text-[#2b3437] placeholder:text-[#586064] focus:bg-white focus:ring-2 focus:ring-[#4d44e3]/20 transition-all outline-none"
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Search products..."
                type="text"
                value={searchQuery}
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <select
                  className="appearance-none pl-4 pr-10 py-2 bg-[#f1f4f6] border-none rounded-xl text-sm font-medium text-[#2b3437] focus:ring-2 focus:ring-[#4d44e3]/20 outline-none cursor-pointer"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  value={categoryFilter}
                >
                  <option value="all">Category: All</option>
                  <option value="clothing">Clothing</option>
                  <option value="accessories">Accessories</option>
                  <option value="sneakers">Sneakers</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#586064] pointer-events-none">expand_more</span>
              </div>

              <div className="relative">
                <select
                  className="appearance-none pl-4 pr-10 py-2 bg-[#f1f4f6] border-none rounded-xl text-sm font-medium text-[#2b3437] focus:ring-2 focus:ring-[#4d44e3]/20 outline-none cursor-pointer"
                  onChange={(e) => setTargetFilter(e.target.value)}
                  value={targetFilter}
                >
                  <option value="all">Target: All Gens</option>
                  <option value="gen-z">Gen Z</option>
                  <option value="millennial">Millennial</option>
                  <option value="gen-x">Gen X</option>
                  <option value="boomer">Boomer</option>
                  <option value="gen-alpha">Gen Alpha</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#586064] pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto flex items-center justify-end gap-3">
            <span className="text-sm text-[#586064] font-medium">Sort by:</span>
            <div className="relative">
              <select
                className="appearance-none pl-4 pr-10 py-2 bg-white shadow-[0_2px_12px_rgba(43,52,55,0.04)] border-none rounded-xl text-sm font-medium text-[#2b3437] focus:ring-2 focus:ring-[#4d44e3]/20 outline-none cursor-pointer"
                onChange={(e) => setSortBy(e.target.value)}
                value={sortBy}
              >
                <option value="newest">Newest Added</option>
                <option value="price_high">Price: High to Low</option>
                <option value="price_low">Price: Low to High</option>
                <option value="popular">Most Popular</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#586064] pointer-events-none">swap_vert</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-10 text-center text-[#586064] shadow-[0_4px_24px_rgba(43,52,55,0.04)]">Loading products...</div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-10 text-center text-[#9e3f4e] shadow-[0_4px_24px_rgba(43,52,55,0.04)]">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleProducts.map((product) => (
                <div key={product._id} className="group bg-white rounded-2xl overflow-hidden hover:shadow-[0_16px_40px_rgba(43,52,55,0.08)] transition-all duration-300 flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f4f6]">
                    <img alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={product.images[0] || "https://placehold.co/640x480?text=No+Image"} />

                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur text-[10px] font-bold text-[#2b3437] uppercase tracking-wider">{formatCategory(product.category)}</span>
                      <span className="px-2.5 py-1 rounded-md bg-[#d2d9f8]/90 backdrop-blur text-[10px] font-bold text-[#444c65] uppercase tracking-wider">{formatGeneration(product.generation)}</span>
                      {product.isHighestSelling ? (
                        <span className="px-2.5 py-1 rounded-md bg-[#fef3c7] text-[10px] font-bold text-[#854d0e] uppercase tracking-wider">Highest selling</span>
                      ) : null}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="font-headline font-semibold text-lg text-[#2b3437] leading-tight group-hover:text-[#4d44e3] transition-colors">{product.name}</h3>
                      <span className="font-headline font-bold text-[#4d44e3]">${product.price.toFixed(2)}</span>
                    </div>

                    <p className="text-sm text-[#586064] line-clamp-2 mb-4">{product.description}</p>

                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${product.stock <= 0 ? "text-[#9e3f4e]" : "text-[#586064]"}`}>
                        <span className={`w-2 h-2 rounded-full ${product.stock <= 0 ? "bg-[#9e3f4e]" : product.stock < 20 ? "bg-[#f59e0b]" : "bg-[#10b981]"}`}></span>
                        {product.stock <= 0 ? "Out of stock" : `${product.stock} in stock`}
                      </div>

                      {canEditProduct || canDeleteProduct ? (
                        <div className="flex items-center gap-1.5">
                          {canEditProduct ? (
                            <button
                              className={`h-8 w-8 rounded-lg grid place-items-center transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                                product.isHighestSelling
                                  ? "bg-[#fef3c7] text-[#854d0e] hover:bg-[#fde68a]"
                                  : "bg-[#eef2ff] text-[#4d44e3] hover:bg-[#e0e7ff]"
                              }`}
                              disabled={Boolean(togglingProductIds[product._id])}
                              onClick={() => handleToggleHighestSelling(product)}
                              title={product.isHighestSelling ? "Remove Highest Selling" : "Set Highest Selling"}
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                {togglingProductIds[product._id] ? "hourglass_top" : product.isHighestSelling ? "star" : "star_outline"}
                              </span>
                            </button>
                          ) : null}
                          {canEditProduct ? (
                            <button
                              className="h-8 w-8 rounded-lg grid place-items-center text-[#4d44e3] bg-[#f3f4f6] hover:bg-[#e5e7eb] transition-colors"
                              onClick={() => openEditModal(product)}
                              title="Edit Product"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                            </button>
                          ) : null}
                          {canDeleteProduct ? (
                            <button
                              className="h-8 w-8 rounded-lg grid place-items-center text-[#9e3f4e] bg-[#fff1f3] hover:bg-[#ffe4e8] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                              disabled={deletingProductId === product._id}
                              onClick={() => handleDeleteProduct(product)}
                              title="Delete Product"
                              type="button"
                            >
                              <span className="material-symbols-outlined text-[18px]">{deletingProductId === product._id ? "hourglass_top" : "delete"}</span>
                            </button>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-[#586064] text-xs font-medium">View only</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {visibleProducts.length === 0 && (
              <div className="mt-8 rounded-2xl bg-white p-8 text-center text-[#586064] shadow-[0_4px_24px_rgba(43,52,55,0.04)]">
                No products found for current search/filter combination.
              </div>
            )}
          </>
        )}
      </div>

      {editingProduct ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/35 p-4 sm:p-6" onClick={closeEditModal}>
          <div className="mx-auto flex min-h-full w-full items-start justify-center sm:items-center">
            <div
              className="flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100vh-3rem)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-[#e6eaed] p-5 sm:p-6">
                <div>
                  <h3 className="font-headline text-2xl font-bold text-[#2b3437]">Edit Product</h3>
                  <p className="text-sm text-[#586064]">Update details for {editingProduct.name}</p>
                </div>
                <button className="rounded-md p-1 text-[#586064] hover:bg-[#f1f4f6]" onClick={closeEditModal} type="button">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="overflow-y-auto p-5 sm:p-6">
                {editError ? <div className="mb-4 rounded-lg bg-[#fff1f3] px-3 py-2 text-sm text-[#9e3f4e]">{editError}</div> : null}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="space-y-6 lg:col-span-2">
                    <section className="rounded-xl bg-white p-5 shadow-[0_4px_20px_rgba(43,52,55,0.06)]">
                      <h4 className="mb-4 font-headline text-lg font-bold text-[#2b3437]">Basic Information</h4>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <label className="text-sm text-[#586064] md:col-span-2">
                          Product Name
                          <input
                            className="mt-1 w-full rounded-lg bg-[#f1f4f6] px-3 py-2.5 text-sm text-[#2b3437] outline-none focus:ring-2 focus:ring-[#4d44e3]/20"
                            onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                            value={editForm.name}
                          />
                        </label>
                        <label className="text-sm text-[#586064]">
                          Category
                          <select
                            className="mt-1 w-full rounded-lg bg-[#f1f4f6] px-3 py-2.5 text-sm text-[#2b3437] outline-none focus:ring-2 focus:ring-[#4d44e3]/20"
                            onChange={(e) => handleEditCategoryChange(e.target.value as ProductEditForm["category"])}
                            value={editForm.category}
                          >
                            <option value="clothing">Clothing</option>
                            <option value="accessories">Accessories</option>
                            <option value="sneakers">Sneakers</option>
                          </select>
                        </label>
                        <label className="text-sm text-[#586064]">
                          Generation
                          <select
                            className="mt-1 w-full rounded-lg bg-[#f1f4f6] px-3 py-2.5 text-sm text-[#2b3437] outline-none focus:ring-2 focus:ring-[#4d44e3]/20"
                            onChange={(e) => setEditForm((prev) => ({ ...prev, generation: e.target.value as ProductEditForm["generation"] }))}
                            value={editForm.generation}
                          >
                            <option value="gen-z">Gen Z</option>
                            <option value="millennial">Millennial</option>
                            <option value="gen-x">Gen X</option>
                            <option value="boomer">Boomer</option>
                            <option value="gen-alpha">Gen Alpha</option>
                          </select>
                        </label>
                        {editForm.category === "accessories" ? (
                          <label className="text-sm text-[#586064]">
                            Sub Category
                            <select
                              className="mt-1 w-full rounded-lg bg-[#f1f4f6] px-3 py-2.5 text-sm text-[#2b3437] outline-none focus:ring-2 focus:ring-[#4d44e3]/20"
                              onChange={(e) => setSelectedAccessoryCategory(e.target.value)}
                              value={selectedAccessoryCategory}
                            >
                              {accessorySubcategories.map((subcategory) => (
                                <option key={subcategory.value} value={subcategory.value}>
                                  {subcategory.label}
                                </option>
                              ))}
                            </select>
                          </label>
                        ) : (
                          <label className="text-sm text-[#586064]">
                            Sub Category
                            <input
                              className="mt-1 w-full rounded-lg bg-[#f1f4f6] px-3 py-2.5 text-sm text-[#2b3437] outline-none focus:ring-2 focus:ring-[#4d44e3]/20"
                              onChange={(e) => setEditForm((prev) => ({ ...prev, subCategory: e.target.value }))}
                              value={editForm.subCategory}
                            />
                          </label>
                        )}
                        <label className="text-sm text-[#586064]">
                          Brand
                          <input
                            className="mt-1 w-full rounded-lg bg-[#f1f4f6] px-3 py-2.5 text-sm text-[#2b3437] outline-none focus:ring-2 focus:ring-[#4d44e3]/20"
                            onChange={(e) => setEditForm((prev) => ({ ...prev, brand: e.target.value }))}
                            value={editForm.brand}
                          />
                        </label>
                        <label className="text-sm text-[#586064]">
                          Price
                          <input
                            className="mt-1 w-full rounded-lg bg-[#f1f4f6] px-3 py-2.5 text-sm text-[#2b3437] outline-none focus:ring-2 focus:ring-[#4d44e3]/20"
                            onChange={(e) => setEditForm((prev) => ({ ...prev, price: e.target.value }))}
                            type="number"
                            value={editForm.price}
                          />
                        </label>
                        <label className="text-sm text-[#586064] md:col-span-2">
                          Description
                          <textarea
                            className="mt-1 h-24 w-full rounded-lg bg-[#f1f4f6] px-3 py-2.5 text-sm text-[#2b3437] outline-none focus:ring-2 focus:ring-[#4d44e3]/20"
                            onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                            value={editForm.description}
                          />
                        </label>
                        <label className="text-sm text-[#586064]">
                          Stock
                          <input
                            className="mt-1 w-full rounded-lg bg-[#f1f4f6] px-3 py-2.5 text-sm text-[#2b3437] outline-none focus:ring-2 focus:ring-[#4d44e3]/20"
                            onChange={(e) => setEditForm((prev) => ({ ...prev, stock: e.target.value }))}
                            type="number"
                            value={editForm.stock}
                          />
                        </label>
                      </div>
                    </section>

                    <section className="rounded-xl bg-white p-5 shadow-[0_4px_20px_rgba(43,52,55,0.06)]">
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="font-headline text-lg font-bold text-[#2b3437]">Media</h4>
                        <span className="text-xs font-medium text-[#586064]">{editImages.length}/4 images {editVideo ? "| 1 video" : "| 0 video"}</span>
                      </div>
                      <div
                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#abb3b7]/40 bg-[#f1f4f6]/50 p-6 text-center transition-colors hover:bg-[#f1f4f6]"
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          event.preventDefault();
                          void addEditImages(event.dataTransfer.files);
                        }}
                      >
                        <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-white">
                          <span className="material-symbols-outlined text-2xl text-[#4d44e3]">cloud_upload</span>
                        </div>
                        <p className="text-sm font-medium text-[#2b3437]">Drag & drop images here</p>
                        <p className="mt-1 text-xs text-[#586064]">JPG, PNG, WEBP supported. Max 4 images.</p>
                        <button
                          className="mt-4 rounded-md bg-[#dbe4e7] px-4 py-2 text-sm font-medium text-[#4d44e3] hover:bg-[#cfdbdf] disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={editImages.length >= 4}
                          onClick={() => editFileInputRef.current?.click()}
                          type="button"
                        >
                          Browse Files
                        </button>
                        <input
                          accept="image/*"
                          className="hidden"
                          multiple
                          onChange={(event) => {
                            void addEditImages(event.target.files);
                            event.currentTarget.value = "";
                          }}
                          ref={editFileInputRef}
                          type="file"
                        />
                      </div>

                      {editImages.length > 0 ? (
                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {editImages.map((image) => (
                            <div key={image.id} className="relative aspect-square overflow-hidden rounded-lg bg-[#f1f4f6]">
                              <img alt={image.fileName} className="h-full w-full object-cover" src={image.previewUrl} />
                              <button
                                className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/55 text-white hover:bg-black/70"
                                onClick={() => removeEditImage(image.id)}
                                title="Remove image"
                                type="button"
                              >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-5 rounded-xl border border-[#dbe4e7] bg-[#fcfcfd] p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h5 className="font-headline text-base font-bold text-[#2b3437]">Product Video (optional)</h5>
                          <button
                            className="rounded-md bg-[#dbe4e7] px-3 py-1.5 text-xs font-semibold text-[#4d44e3] transition-colors hover:bg-[#cfdbdf]"
                            onClick={() => editVideoInputRef.current?.click()}
                            type="button"
                          >
                            {editVideo ? "Replace Video" : "Upload Video"}
                          </button>
                        </div>
                        <p className="text-xs text-[#586064]">Upload MP4/WEBM video. It will also show on website.</p>
                        <input
                          accept="video/*"
                          className="hidden"
                          onChange={(event) => {
                            void addEditVideo(event.target.files);
                            event.currentTarget.value = "";
                          }}
                          ref={editVideoInputRef}
                          type="file"
                        />

                        {editVideo ? (
                          <div className="relative mt-3 overflow-hidden rounded-lg bg-[#f1f4f6]">
                            <video className="h-48 w-full object-cover" controls preload="metadata" src={editVideo.previewUrl} />
                            <button
                              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/55 text-white hover:bg-black/70"
                              onClick={removeEditVideo}
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

                  <div className="space-y-6">
                    {editForm.category === "accessories" ? (
                      <section className="rounded-xl bg-white p-5 shadow-[0_4px_20px_rgba(43,52,55,0.06)]">
                        <h4 className="mb-4 font-headline text-lg font-bold text-[#2b3437]">Accessory Details</h4>
                        <div className="space-y-3">
                          {activeAccessoryFields.map((field) => (
                            <div key={field.key}>
                              <label className="block text-sm font-semibold text-[#2b3437]">{field.label}</label>
                              <input
                                className="mt-1 w-full rounded-lg border border-[#e2e9ec] bg-white px-3 py-2 text-sm text-[#2b3437] outline-none transition-colors focus:border-[#4d44e3]/40 focus:ring-2 focus:ring-[#4d44e3]/15"
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
                      </section>
                    ) : null}

                    {editForm.category === "sneakers" ? (
                      <section className="rounded-xl bg-white p-5 shadow-[0_4px_20px_rgba(43,52,55,0.06)]">
                        <h4 className="mb-4 font-headline text-lg font-bold text-[#2b3437]">Sneaker Details</h4>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-[#586064]">Available sizes</label>
                          <div className="grid grid-cols-5 gap-2">
                            {sneakerSizes.map((size) => {
                              const isActive = selectedSneakerSizes.includes(size);
                              return (
                                <button
                                  key={size}
                                  className={`h-9 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                      ? "border border-[#4d44e3]/25 bg-[#4d44e3]/10 text-[#4d44e3]"
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

                        <div className="mt-4">
                          <label className="mb-2 block text-sm font-medium text-[#586064]">Color options</label>
                          <div className="flex flex-wrap items-center gap-3">
                            {sneakerColorOptions.map((color) => {
                              const isActive = selectedSneakerColors.includes(color.value);
                              return (
                                <button
                                  key={color.value}
                                  aria-label={color.label}
                                  className={`h-9 w-9 rounded-full transition-all ${isActive ? "ring-2 ring-[#4d44e3] ring-offset-2" : "ring-1 ring-[#dbe4e7]"}`}
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

                        <div className="mt-4 space-y-3">
                          {sneakerFields.map((field) => (
                            <div key={field.key}>
                              <label className="block text-sm font-semibold text-[#2b3437]">{field.label}</label>
                              <input
                                className="mt-1 w-full rounded-lg border border-[#e2e9ec] bg-white px-3 py-2 text-sm text-[#2b3437] outline-none transition-colors focus:border-[#4d44e3]/40 focus:ring-2 focus:ring-[#4d44e3]/15"
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
                      </section>
                    ) : null}

                    {editForm.category === "clothing" ? (
                      <section className="rounded-xl bg-white p-5 shadow-[0_4px_20px_rgba(43,52,55,0.06)]">
                        <h4 className="mb-4 font-headline text-lg font-bold text-[#2b3437]">Clothing Specifics</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-[#586064]">Fabric Type</label>
                            <input
                              className="mt-1 w-full rounded-lg bg-[#f1f4f6] px-3 py-2.5 text-sm text-[#2b3437] outline-none focus:ring-2 focus:ring-[#4d44e3]/20"
                              onChange={(event) => setClothingFabricType(event.target.value)}
                              placeholder="e.g. 100% Heavyweight Cotton"
                              type="text"
                              value={clothingFabricType}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#586064]">Pattern / Print</label>
                            <input
                              className="mt-1 w-full rounded-lg bg-[#f1f4f6] px-3 py-2.5 text-sm text-[#2b3437] outline-none focus:ring-2 focus:ring-[#4d44e3]/20"
                              onChange={(event) => setClothingPattern(event.target.value)}
                              placeholder="e.g. Solid / Graphic"
                              type="text"
                              value={clothingPattern}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#586064]">Style</label>
                            <input
                              className="mt-1 w-full rounded-lg bg-[#f1f4f6] px-3 py-2.5 text-sm text-[#2b3437] outline-none focus:ring-2 focus:ring-[#4d44e3]/20"
                              onChange={(event) => setClothingStyle(event.target.value)}
                              placeholder="e.g. Contemporary Minimal"
                              type="text"
                              value={clothingStyle}
                            />
                          </div>
                        </div>
                      </section>
                    ) : null}

                    <section className="rounded-xl bg-white p-5 shadow-[0_4px_20px_rgba(43,52,55,0.06)]">
                      <h4 className="mb-4 font-headline text-lg font-bold text-[#2b3437]">Merchandising</h4>
                      <div className="space-y-3 text-sm text-[#2b3437]">
                        <label className="inline-flex items-center gap-2">
                          <input
                            checked={editForm.featured}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, featured: e.target.checked }))}
                            type="checkbox"
                          />
                          Featured
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            checked={editForm.isActive}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                            type="checkbox"
                          />
                          Active
                        </label>
                        <label className="inline-flex items-center gap-2">
                          <input
                            checked={editForm.isHighestSelling}
                            onChange={(e) => setEditForm((prev) => ({ ...prev, isHighestSelling: e.target.checked }))}
                            type="checkbox"
                          />
                          Highest Selling
                        </label>
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#e6eaed] p-4 sm:p-5">
                <button className="rounded-lg px-4 py-2 text-sm font-medium text-[#586064] hover:bg-[#f1f4f6]" onClick={closeEditModal} type="button">
                  Cancel
                </button>
                <button
                  className="rounded-lg bg-[#4d44e3] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                  disabled={savingProductId === editingProduct._id}
                  onClick={handleSaveEdit}
                  type="button"
                >
                  {savingProductId === editingProduct._id ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {pendingDeleteProduct ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <h4 className="font-headline text-lg font-bold text-[#2b3437]">Delete Product</h4>
            <p className="mt-2 text-sm text-[#586064]">
              Are you sure you want to delete <span className="font-semibold text-[#2b3437]">{pendingDeleteProduct.name}</span>?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                className="rounded-lg px-4 py-2 text-sm font-medium text-[#586064] hover:bg-[#f1f4f6] disabled:opacity-60"
                disabled={Boolean(deletingProductId)}
                onClick={() => setPendingDeleteProduct(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-[#9e3f4e] px-4 py-2 text-sm font-medium text-white hover:bg-[#8b3745] disabled:opacity-60"
                disabled={deletingProductId === pendingDeleteProduct._id}
                onClick={confirmDeleteProduct}
                type="button"
              >
                {deletingProductId === pendingDeleteProduct._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default ProductsPage;
