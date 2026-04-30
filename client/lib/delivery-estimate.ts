export const DEFAULT_DELIVERY_DAYS = 7;

export function getDateAfterDays(baseDate: Date = new Date(), days: number = DEFAULT_DELIVERY_DAYS) {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + days);
  return date;
}

export function formatDeliveryDate(date: Date, locale = "en-IN") {
  return date.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDeliveryFromNow(days: number = DEFAULT_DELIVERY_DAYS, locale = "en-IN") {
  return formatDeliveryDate(getDateAfterDays(new Date(), days), locale);
}

export function resolveExpectedDeliveryDate(expectedDeliveryDate?: string, createdAt?: string, fallbackDays = DEFAULT_DELIVERY_DAYS) {
  if (expectedDeliveryDate) {
    const parsed = new Date(expectedDeliveryDate);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  if (createdAt) {
    const parsedCreated = new Date(createdAt);
    if (!Number.isNaN(parsedCreated.getTime())) return getDateAfterDays(parsedCreated, fallbackDays);
  }

  return getDateAfterDays(new Date(), fallbackDays);
}
