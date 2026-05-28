import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Star, Search } from "lucide-react";
import { getAdminAuthHeaders } from "@/lib/adminAuth";
import { useSearchParams } from "react-router-dom";

type ReviewRow = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerifiedPurchase?: boolean;
  user?: { name?: string; email?: string };
  product?: { name?: string; category?: string; generation?: string };
};

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://stylesakhi.com/api").replace(/\/+$/, "");

const initials = (value?: string) => {
  const name = (value || "User").trim();
  const parts = name.split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "").join("") || "U";
};

const ReviewsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({ averageRating: 0, totalReviews: 0, fiveStarReviews: 0 });

  const handleSearchInput = (value: string) => {
    setSearch(value);
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

  const fetchReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("limit", "200");
      if (search.trim()) params.set("search", search.trim());
      if (ratingFilter !== "all") params.set("rating", ratingFilter);

      const res = await fetch(`${API_BASE_URL}/admin/reviews?${params.toString()}`, {
        headers: getAdminAuthHeaders(),
      });
      const payload = await res.json();
      if (!res.ok || !payload?.success) throw new Error(payload?.error || "Failed to fetch reviews");

      setReviews(Array.isArray(payload?.data?.items) ? payload.data.items : []);
      setSummary({
        averageRating: Number(payload?.data?.summary?.averageRating || 0),
        totalReviews: Number(payload?.data?.summary?.totalReviews || 0),
        fiveStarReviews: Number(payload?.data?.summary?.fiveStarReviews || 0),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reviews");
      setReviews([]);
      setSummary({ averageRating: 0, totalReviews: 0, fiveStarReviews: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratingFilter]);

  useEffect(() => {
    const timer = setTimeout(() => fetchReviews(), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearch((prev) => (prev === q ? prev : q));
  }, [searchParams]);

  const fiveStarPercent = useMemo(() => {
    if (!summary.totalReviews) return 0;
    return Math.round((summary.fiveStarReviews / summary.totalReviews) * 100);
  }, [summary.fiveStarReviews, summary.totalReviews]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
        <p className="mt-1 text-sm text-muted-foreground">Customer feedback and ratings (Live Data)</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full rounded-xl border border-transparent bg-muted/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder="Search by customer, product or comment"
            value={search}
          />
        </div>
        <select
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50 sm:w-44"
          onChange={(e) => setRatingFilter(e.target.value)}
          value={ratingFilter}
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Star</option>
          <option value="4">4 Star</option>
          <option value="3">3 Star</option>
          <option value="2">2 Star</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Average Rating", value: summary.averageRating.toFixed(1), sub: "out of 5.0" },
          { label: "Total Reviews", value: summary.totalReviews.toLocaleString("en-IN"), sub: "live user reviews" },
          { label: "5-Star Reviews", value: `${fiveStarPercent}%`, sub: "of total reviews" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 text-center"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: i * 0.1 }}
          >
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-0.5 text-xs text-primary">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</div>
      ) : null}

      <div className="space-y-3">
        {loading ? (
          <div className="glass-card p-5 text-sm text-muted-foreground">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="glass-card p-5 text-sm text-muted-foreground">No reviews found.</div>
        ) : (
          reviews.map((review, i) => (
            <motion.div
              key={review._id}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5"
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2 + i * 0.03 }}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <span className="text-xs font-semibold text-primary">{initials(review.user?.name)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{review.user?.name || "Customer"}</p>
                      <p className="text-xs text-muted-foreground">{review.product?.name || "Product"}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleString("en-IN")}</p>
                  </div>

                  <div className="my-2 flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`h-3.5 w-3.5 ${j < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                    {review.isVerifiedPurchase ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">Verified Purchase</span>
                    ) : null}
                  </div>

                  <p className="text-sm text-muted-foreground whitespace-pre-line break-words [overflow-wrap:anywhere]">{review.comment}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReviewsPage;
