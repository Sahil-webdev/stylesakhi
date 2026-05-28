export type ProductCategory = "clothing" | "accessories" | "sneakers";
export type ProductGeneration = "gen-z" | "millennial" | "gen-x" | "boomer" | "gen-alpha";

export type ProductRecord = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  subCategory?: string;
  generation: ProductGeneration;
  price: number;
  stock: number;
  images: string[];
  video?: string;
  brand?: string;
  sizes: string[];
  colors: string[];
  productDetails: Record<string, string>;
  averageRating?: number;
  numReviews?: number;
  featured?: boolean;
  isHighestSelling?: boolean;
  highestSellingMarkedAt?: string | null;
  isActive?: boolean;
};

const normalizeApiBaseUrl = (input?: string) => {
  const value = (input || "").trim().replace(/\/+$/, "");
  if (!value) return "https://stylesakhi.com/api";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith(":")) return `http://localhost${value}`;
  if (value.startsWith("/")) return `https://stylesakhi.com${value}`;
  return `http://${value}`;
};

const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);
const API_BASE_URL_CANDIDATES = process.env.NEXT_PUBLIC_API_URL
  ? [API_BASE_URL]
  : ["https://stylesakhi.com/api"];

async function fetchFromApi<T>(path: string): Promise<T> {
  let lastError: Error | null = null;

  for (const baseUrl of API_BASE_URL_CANDIDATES) {
    try {
      const response = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
      if (!response.ok) {
        lastError = new Error(`Failed request (${response.status})`);
        continue;
      }
      return (await response.json()) as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Network error");
    }
  }

  throw lastError || new Error("Failed to reach products API");
}

export async function fetchProducts(params?: Record<string, string>) {
  const query = new URLSearchParams(params || {}).toString();
  const payload = await fetchFromApi<{ data?: { items?: ProductRecord[] } }>(
    `/products${query ? `?${query}` : ""}`
  );
  return (payload?.data?.items || []) as ProductRecord[];
}

export async function fetchProductBySlug(slug: string) {
  const payload = await fetchFromApi<{ data?: ProductRecord }>(`/products/${slug}`);
  return payload?.data as ProductRecord;
}

export async function fetchHighestSellingProducts(generation: ProductGeneration, limit = 4) {
  const query = new URLSearchParams({
    generation,
    limit: String(limit),
  }).toString();
  const payload = await fetchFromApi<{ data?: { items?: ProductRecord[] } }>(
    `/products/highest-selling?${query}`
  );
  return (payload?.data?.items || []) as ProductRecord[];
}

