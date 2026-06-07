type ProductLinkInput = {
  id?: string | number | null;
  href?: string | null;
};

type ProductCategory = "clothing" | "accessories" | "sneakers";

const isInvalidHref = (href: string) => {
  const normalized = href.trim().toLowerCase();
  if (!normalized) return true;
  if (normalized === "/") return true;
  if (normalized === "/product/demo") return true;
  if (normalized.startsWith("/product/demo?")) return true;
  return false;
};

export function resolveProductHref(input: ProductLinkInput) {
  const rawHref = String(input.href || "").trim();
  const fallbackId = String(input.id || "").trim();

  if (rawHref) {
    try {
      if (rawHref.startsWith("http://") || rawHref.startsWith("https://")) {
        const parsed = new URL(rawHref);
        const path = `${parsed.pathname}${parsed.search}${parsed.hash}`;
        if (!isInvalidHref(path)) return path;
      } else if (!isInvalidHref(rawHref)) {
        return rawHref;
      }
    } catch {
      // ignore invalid url
    }
  }

  if (!fallbackId) return "/";
  return `/product/${encodeURIComponent(fallbackId)}`;
}

export function buildCategoryDetailHref(category: ProductCategory, productIdOrSlug: string) {
  const encoded = encodeURIComponent(productIdOrSlug);
  if (category === "clothing") {
    return `/clothing/the-atelier-trench?product=${encoded}`;
  }
  if (category === "accessories") {
    return `/accessories/croissant-leather-bag?product=${encoded}`;
  }
  return `/sneakers/nova-form-strider?product=${encoded}`;
}
