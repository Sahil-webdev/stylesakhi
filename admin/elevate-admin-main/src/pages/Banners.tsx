import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getAdminToken } from "@/lib/adminAuth";
import { ImagePlus, Loader2, Save, Sparkles } from "lucide-react";
import { uploadAdminMedia } from "@/lib/mediaUpload";

type GenerationKey = "gen-z" | "millennial" | "gen-x" | "boomer" | "gen-alpha";

type BannerItem = {
  image: string;
  desktopImage?: string;
  mobileImage?: string;
  alt: string;
  link?: string;
  publicId?: string;
  desktopPublicId?: string;
  mobilePublicId?: string;
};

type BannerForm = {
  homeBanner: BannerItem;
  generationBanners: Record<GenerationKey, BannerItem[]>;
};

const generationMeta: Array<{ key: GenerationKey; label: string }> = [
  { key: "gen-z", label: "Gen Z" },
  { key: "millennial", label: "Millennial" },
  { key: "gen-x", label: "Gen X" },
  { key: "boomer", label: "Boomers" },
  { key: "gen-alpha", label: "Gen Alpha" },
];

const defaultCarouselImages = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1265&h=432&fit=crop",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1265&h=432&fit=crop",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1265&h=432&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1265&h=432&fit=crop",
];

const createFallbackForm = (): BannerForm => {
  const generationBanners = generationMeta.reduce<Record<GenerationKey, BannerItem[]>>((acc, generation) => {
    acc[generation.key] = defaultCarouselImages.map((image, index) => ({
      image,
      desktopImage: image,
      mobileImage: image,
      alt: `${generation.label} Collection Banner ${index + 1}`,
      link: "",
      publicId: "",
      desktopPublicId: "",
      mobilePublicId: "",
    }));
    return acc;
  }, {} as Record<GenerationKey, BannerItem[]>);

  return {
    homeBanner: {
      image: "/hero/heroImg.png",
      desktopImage: "/hero/heroImg.png",
      mobileImage: "/hero/heroImg.png",
      alt: "StyleSakhi hero banner",
      link: "",
      publicId: "",
      desktopPublicId: "",
      mobilePublicId: "",
    },
    generationBanners,
  };
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
const generationPreviewKey = (generation: GenerationKey, index: number) => `${generation}:${index}`;

const normalizeBannerItem = (value: unknown, fallback: BannerItem) => {
  const source = (value || {}) as Partial<BannerItem>;
  const fallbackDesktop = fallback.desktopImage || fallback.image;
  const fallbackMobile = fallback.mobileImage || fallbackDesktop;
  const desktopImage =
    typeof source.desktopImage === "string" && source.desktopImage.trim()
      ? source.desktopImage.trim()
      : typeof source.image === "string" && source.image.trim()
        ? source.image.trim()
        : fallbackDesktop;
  const mobileImage =
    typeof source.mobileImage === "string" && source.mobileImage.trim()
      ? source.mobileImage.trim()
      : desktopImage || fallbackMobile;
  const desktopPublicId =
    typeof source.desktopPublicId === "string" && source.desktopPublicId.trim()
      ? source.desktopPublicId.trim()
      : typeof source.publicId === "string"
        ? source.publicId.trim()
        : "";
  const mobilePublicId =
    typeof source.mobilePublicId === "string" && source.mobilePublicId.trim()
      ? source.mobilePublicId.trim()
      : desktopPublicId;

  return {
    image: desktopImage || mobileImage || fallback.image,
    desktopImage,
    mobileImage,
    alt: typeof source.alt === "string" && source.alt.trim() ? source.alt.trim() : fallback.alt,
    link: typeof source.link === "string" ? source.link.trim() : "",
    publicId: desktopPublicId,
    desktopPublicId,
    mobilePublicId,
  };
};

const normalizePayload = (value: unknown): BannerForm => {
  const fallback = createFallbackForm();
  const source = (value || {}) as Partial<BannerForm>;
  const generationSource = (source.generationBanners || {}) as Partial<Record<GenerationKey, BannerItem[]>>;

  const generationBanners = generationMeta.reduce<Record<GenerationKey, BannerItem[]>>((acc, generation) => {
    const sourceItems = generationSource[generation.key];
    if (!Array.isArray(sourceItems) || sourceItems.length === 0) {
      acc[generation.key] = fallback.generationBanners[generation.key];
      return acc;
    }
    acc[generation.key] = sourceItems
      .slice(0, 4)
      .map((item, index) => normalizeBannerItem(item, fallback.generationBanners[generation.key][index]));
    return acc;
  }, {} as Record<GenerationKey, BannerItem[]>);

  return {
    homeBanner: normalizeBannerItem(source.homeBanner, fallback.homeBanner),
    generationBanners,
  };
};

const BannersPage = () => {
  const { hasModuleAccess } = useAuth();
  const canEdit = hasModuleAccess("settings", "can_edit");

  const [form, setForm] = useState<BannerForm>(createFallbackForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [homeDesktopPreview, setHomeDesktopPreview] = useState("");
  const [homeMobilePreview, setHomeMobilePreview] = useState("");
  const [generationDesktopPreview, setGenerationDesktopPreview] = useState<Record<string, string>>({});
  const [generationMobilePreview, setGenerationMobilePreview] = useState<Record<string, string>>({});

  const safeRevokeObjectUrl = (value?: string) => {
    if (!value || !value.startsWith("blob:")) return;
    URL.revokeObjectURL(value);
  };

  useEffect(() => {
    let mounted = true;

    const loadBanners = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${API_BASE_URL}/admin/banners`, {
          headers: {
            Authorization: `Bearer ${getAdminToken()}`,
          },
        });
        const payload = await response.json();
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.error || "Failed to load banners");
        }
        if (mounted) {
          setForm(normalizePayload(payload?.data));
          setHomeDesktopPreview("");
          setHomeMobilePreview("");
          setGenerationDesktopPreview({});
          setGenerationMobilePreview({});
        }
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load banners");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void loadBanners();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      safeRevokeObjectUrl(homeDesktopPreview);
      safeRevokeObjectUrl(homeMobilePreview);
      Object.values(generationDesktopPreview).forEach((value) => safeRevokeObjectUrl(value));
      Object.values(generationMobilePreview).forEach((value) => safeRevokeObjectUrl(value));
    };
  }, [homeDesktopPreview, homeMobilePreview, generationDesktopPreview, generationMobilePreview]);

  const generationCountLabel = useMemo(
    () =>
      generationMeta.map((generation) => ({
        key: generation.key,
        label: `${form.generationBanners[generation.key].length}/4`,
      })),
    [form.generationBanners],
  );

  const updateHomeField = (field: keyof BannerItem, value: string) => {
    setForm((prev) => ({
      ...prev,
      homeBanner: {
        ...prev.homeBanner,
        [field]: value,
      },
    }));
  };

  const updateGenerationField = (generation: GenerationKey, index: number, field: keyof BannerItem, value: string) => {
    setForm((prev) => {
      const current = prev.generationBanners[generation];
      const next = current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item,
      );

      return {
        ...prev,
        generationBanners: {
          ...prev.generationBanners,
          [generation]: next,
        },
      };
    });
  };

  const removeGenerationBanner = (generation: GenerationKey, index: number) => {
    const key = generationPreviewKey(generation, index);
    safeRevokeObjectUrl(generationDesktopPreview[key]);
    safeRevokeObjectUrl(generationMobilePreview[key]);
    setGenerationDesktopPreview((prev) => ({ ...prev, [key]: "" }));
    setGenerationMobilePreview((prev) => ({ ...prev, [key]: "" }));
    updateGenerationField(generation, index, "image", "");
    updateGenerationField(generation, index, "desktopImage", "");
    updateGenerationField(generation, index, "mobileImage", "");
    updateGenerationField(generation, index, "publicId", "");
    updateGenerationField(generation, index, "desktopPublicId", "");
    updateGenerationField(generation, index, "mobilePublicId", "");
  };

  const onHomeUpload = async (variant: "desktop" | "mobile", files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = Array.from(files).find((item) => item.type.startsWith("image/"));
    if (!file) {
      setError("Please choose a valid image file.");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    if (variant === "desktop") {
      safeRevokeObjectUrl(homeDesktopPreview);
      setHomeDesktopPreview(previewUrl);
    } else {
      safeRevokeObjectUrl(homeMobilePreview);
      setHomeMobilePreview(previewUrl);
    }
    try {
      const token = getAdminToken();
      if (!token) {
        setError("Admin session expired. Please login again.");
        return;
      }
      const uploaded = await uploadAdminMedia({
        apiBaseUrl: API_BASE_URL,
        token,
        file,
        kind: "banner-image",
      });
      if (variant === "desktop") {
        updateHomeField("image", uploaded.url);
        updateHomeField("desktopImage", uploaded.url);
        updateHomeField("publicId", uploaded.publicId);
        updateHomeField("desktopPublicId", uploaded.publicId);
      } else {
        updateHomeField("mobileImage", uploaded.url);
        updateHomeField("mobilePublicId", uploaded.publicId);
      }
      if (!form.homeBanner.alt) {
        updateHomeField("alt", "StyleSakhi hero banner");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to process selected image.");
    }
  };

  const onGenerationUpload = async (
    generation: GenerationKey,
    index: number,
    variant: "desktop" | "mobile",
    files: FileList | null,
  ) => {
    if (!files || files.length === 0) return;
    const file = Array.from(files).find((item) => item.type.startsWith("image/"));
    if (!file) {
      setError("Please choose a valid image file.");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    const key = generationPreviewKey(generation, index);
    if (variant === "desktop") {
      safeRevokeObjectUrl(generationDesktopPreview[key]);
      setGenerationDesktopPreview((prev) => ({ ...prev, [key]: previewUrl }));
    } else {
      safeRevokeObjectUrl(generationMobilePreview[key]);
      setGenerationMobilePreview((prev) => ({ ...prev, [key]: previewUrl }));
    }
    try {
      const token = getAdminToken();
      if (!token) {
        setError("Admin session expired. Please login again.");
        return;
      }
      const uploaded = await uploadAdminMedia({
        apiBaseUrl: API_BASE_URL,
        token,
        file,
        kind: "banner-image",
      });
      if (variant === "desktop") {
        updateGenerationField(generation, index, "image", uploaded.url);
        updateGenerationField(generation, index, "desktopImage", uploaded.url);
        updateGenerationField(generation, index, "publicId", uploaded.publicId);
        updateGenerationField(generation, index, "desktopPublicId", uploaded.publicId);
      } else {
        updateGenerationField(generation, index, "mobileImage", uploaded.url);
        updateGenerationField(generation, index, "mobilePublicId", uploaded.publicId);
      }
      if (!form.generationBanners[generation][index]?.alt) {
        updateGenerationField(generation, index, "alt", `${generationMeta.find((item) => item.key === generation)?.label || generation} Collection Banner ${index + 1}`);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to process selected image.");
    }
  };

  const handleSave = async () => {
    setError("");
    setMessage("");

    if (!canEdit) {
      setError("You do not have permission to edit banners.");
      return;
    }

    const homeDesktopImage = (form.homeBanner.desktopImage || form.homeBanner.image || "").trim();
    if (!homeDesktopImage) {
      setError("Home page desktop banner image is required.");
      return;
    }
    for (const generation of generationMeta) {
      const items = form.generationBanners[generation.key];
      if (items.length !== 4) {
        setError(`${generation.label} must have exactly 4 banners.`);
        return;
      }
      if (items.some((item) => !(item.desktopImage || item.image || "").trim())) {
        setError(`${generation.label} has empty desktop banner image. Please upload all 4 banners.`);
        return;
      }
    }

    const payloadToSave: BannerForm = {
      homeBanner: {
        ...form.homeBanner,
        image: homeDesktopImage,
        desktopImage: homeDesktopImage,
        mobileImage: (form.homeBanner.mobileImage || "").trim() || homeDesktopImage,
      },
      generationBanners: generationMeta.reduce<Record<GenerationKey, BannerItem[]>>((acc, generation) => {
        acc[generation.key] = form.generationBanners[generation.key].map((item) => {
          const desktopImage = (item.desktopImage || item.image || "").trim();
          const mobileImage = (item.mobileImage || "").trim() || desktopImage;
          return {
            ...item,
            image: desktopImage,
            desktopImage,
            mobileImage,
          };
        });
        return acc;
      }, {} as Record<GenerationKey, BannerItem[]>),
    };

    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/admin/banners`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAdminToken()}`,
        },
        body: JSON.stringify(payloadToSave),
      });

      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Failed to save banners");
      }

      setForm(normalizePayload(payload?.data));
      setHomeDesktopPreview("");
      setHomeMobilePreview("");
      setGenerationDesktopPreview({});
      setGenerationMobilePreview({});
      setMessage("Banners updated successfully.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save banners");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="rounded-2xl border border-[#dfe4e8] bg-white p-5 shadow-[0_6px_24px_rgba(43,52,55,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6d7478]">Website Media Control</p>
              <h1 className="mt-1 font-headline text-2xl font-bold text-[#2b3437]">Hero & Generation Banners</h1>
              <p className="mt-1 text-sm text-[#586064]">
                Home page banner (1) + generation pages (4 each). Save once and website updates automatically.
              </p>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-[#4d44e3] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(77,68,227,0.24)] transition-colors hover:bg-[#4237d6] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={saving || loading || !canEdit}
              onClick={handleSave}
              type="button"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : "Save Banner Changes"}
            </button>
          </div>
          {message ? <p className="mt-3 text-sm font-medium text-[#0f7b50]">{message}</p> : null}
          {error ? <p className="mt-3 text-sm font-medium text-[#9e3f4e]">{error}</p> : null}
        </div>

        <section className="rounded-2xl border border-[#dfe4e8] bg-white p-5 shadow-[0_6px_24px_rgba(43,52,55,0.06)]">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#4d44e3]" />
            <h2 className="font-headline text-lg font-bold text-[#2b3437]">Home Hero Banner</h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-[#dfe4e8] bg-[#f4f6f8]">
                <div className="border-b border-[#dfe4e8] bg-[#f6f8fb] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#55606d]">
                  Desktop Banner
                </div>
                {form.homeBanner.desktopImage || form.homeBanner.image ? (
                  <img
                    alt={form.homeBanner.alt || "Home desktop banner"}
                    className="h-[220px] w-full object-cover"
                    src={homeDesktopPreview || form.homeBanner.desktopImage || form.homeBanner.image}
                  />
                ) : (
                  <div className="grid h-[220px] place-items-center text-sm font-medium text-[#7c868b]">No desktop image selected</div>
                )}
              </div>
              <div className="overflow-hidden rounded-xl border border-[#dfe4e8] bg-[#f4f6f8]">
                <div className="border-b border-[#dfe4e8] bg-[#f6f8fb] px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#55606d]">
                  Mobile Banner
                </div>
                {form.homeBanner.mobileImage || form.homeBanner.desktopImage || form.homeBanner.image ? (
                  <img
                    alt={form.homeBanner.alt || "Home mobile banner"}
                    className="h-[220px] w-full object-cover"
                    src={homeMobilePreview || form.homeBanner.mobileImage || form.homeBanner.desktopImage || form.homeBanner.image}
                  />
                ) : (
                  <div className="grid h-[220px] place-items-center text-sm font-medium text-[#7c868b]">No mobile image selected</div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm text-[#586064]">
                Alt Text
                <input
                  className="mt-1 w-full rounded-lg bg-[#f1f4f6] px-3 py-2.5 text-sm text-[#2b3437] outline-none ring-[#4d44e3]/25 transition-all focus:ring-2"
                  onChange={(event) => updateHomeField("alt", event.target.value)}
                  value={form.homeBanner.alt}
                />
              </label>
              <label className="block text-sm text-[#586064]">
                Link (optional)
                <input
                  className="mt-1 w-full rounded-lg bg-[#f1f4f6] px-3 py-2.5 text-sm text-[#2b3437] outline-none ring-[#4d44e3]/25 transition-all focus:ring-2"
                  onChange={(event) => updateHomeField("link", event.target.value)}
                  placeholder="/gen-z"
                  value={form.homeBanner.link || ""}
                />
              </label>

              <div className="grid gap-2 sm:grid-cols-2">
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#dbe4e7] px-4 py-2 text-sm font-semibold text-[#4d44e3] transition-colors hover:bg-[#cedadd]">
                  <ImagePlus className="h-4 w-4" />
                  Desktop Upload
                  <input
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      void onHomeUpload("desktop", event.target.files);
                      event.currentTarget.value = "";
                    }}
                    type="file"
                  />
                </label>
                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#dbe4e7] px-4 py-2 text-sm font-semibold text-[#4d44e3] transition-colors hover:bg-[#cedadd]">
                  <ImagePlus className="h-4 w-4" />
                  Mobile Upload
                  <input
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      void onHomeUpload("mobile", event.target.files);
                      event.currentTarget.value = "";
                    }}
                    type="file"
                  />
                </label>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-5">
          {generationMeta.map((generation) => (
            <section key={generation.key} className="rounded-2xl border border-[#dfe4e8] bg-white p-5 shadow-[0_6px_24px_rgba(43,52,55,0.06)]">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-headline text-lg font-bold text-[#2b3437]">{generation.label} Carousel Banners</h3>
                <span className="rounded-full bg-[#eef1f6] px-3 py-1 text-xs font-semibold text-[#55606d]">
                  {generationCountLabel.find((item) => item.key === generation.key)?.label}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {form.generationBanners[generation.key].map((item, index) => (
                  <div key={`${generation.key}-${index}`} className="rounded-xl border border-[#e1e7ea] bg-[#fbfcfd] p-3">
                    <div className="grid gap-2">
                      <div className="overflow-hidden rounded-lg border border-[#dfe4e8] bg-[#eef2f4]">
                        <div className="border-b border-[#dfe4e8] bg-[#f6f8fb] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#55606d]">
                          Desktop
                        </div>
                        {item.desktopImage || item.image || generationDesktopPreview[generationPreviewKey(generation.key, index)] ? (
                          <img
                            alt={item.alt || `${generation.label} desktop banner ${index + 1}`}
                            className="h-28 w-full object-cover"
                            src={generationDesktopPreview[generationPreviewKey(generation.key, index)] || item.desktopImage || item.image}
                          />
                        ) : (
                          <div className="grid h-28 place-items-center text-xs font-medium text-[#7c868b]">Desktop image empty</div>
                        )}
                      </div>
                      <div className="overflow-hidden rounded-lg border border-[#dfe4e8] bg-[#eef2f4]">
                        <div className="border-b border-[#dfe4e8] bg-[#f6f8fb] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#55606d]">
                          Mobile
                        </div>
                        {item.mobileImage || item.desktopImage || item.image || generationMobilePreview[generationPreviewKey(generation.key, index)] ? (
                          <img
                            alt={item.alt || `${generation.label} mobile banner ${index + 1}`}
                            className="h-28 w-full object-cover"
                            src={generationMobilePreview[generationPreviewKey(generation.key, index)] || item.mobileImage || item.desktopImage || item.image}
                          />
                        ) : (
                          <div className="grid h-28 place-items-center text-xs font-medium text-[#7c868b]">Mobile image empty</div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      <label className="block text-xs text-[#586064]">
                        Alt Text
                        <input
                          className="mt-1 w-full rounded-md bg-white px-2.5 py-2 text-sm text-[#2b3437] outline-none ring-[#4d44e3]/20 transition-all focus:ring-2"
                          onChange={(event) => updateGenerationField(generation.key, index, "alt", event.target.value)}
                          value={item.alt}
                        />
                      </label>
                      <label className="block text-xs text-[#586064]">
                        Link (optional)
                        <input
                          className="mt-1 w-full rounded-md bg-white px-2.5 py-2 text-sm text-[#2b3437] outline-none ring-[#4d44e3]/20 transition-all focus:ring-2"
                          onChange={(event) => updateGenerationField(generation.key, index, "link", event.target.value)}
                          placeholder="/sneakers?generation=gen-z"
                          value={item.link || ""}
                        />
                      </label>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <label className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-md bg-[#dbe4e7] px-2.5 py-2 text-xs font-semibold text-[#4d44e3] transition-colors hover:bg-[#cedadd]">
                        <ImagePlus className="h-3.5 w-3.5" />
                        Desktop
                        <input
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            void onGenerationUpload(generation.key, index, "desktop", event.target.files);
                            event.currentTarget.value = "";
                          }}
                          type="file"
                        />
                      </label>
                      <label className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-md bg-[#dbe4e7] px-2.5 py-2 text-xs font-semibold text-[#4d44e3] transition-colors hover:bg-[#cedadd]">
                        <ImagePlus className="h-3.5 w-3.5" />
                        Mobile
                        <input
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            void onGenerationUpload(generation.key, index, "mobile", event.target.files);
                            event.currentTarget.value = "";
                          }}
                          type="file"
                        />
                      </label>
                    </div>
                    <div className="mt-2">
                      <button
                        className="w-full rounded-md border border-[#e1c9cf] bg-[#fff3f5] px-2.5 py-2 text-xs font-semibold text-[#9e3f4e] transition-colors hover:bg-[#ffe8ec]"
                        onClick={() => removeGenerationBanner(generation.key, index)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/20">
          <div className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-[#2b3437] shadow-xl">
            Loading banner configuration...
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
};

export default BannersPage;
