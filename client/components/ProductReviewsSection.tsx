"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

type ReviewItem = {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  isVerifiedPurchase?: boolean;
  user?: {
    name?: string;
  };
};

type ReviewsPayload = {
  items: ReviewItem[];
  summary?: {
    averageRating?: number;
    numReviews?: number;
  };
};

const normalizeApiBaseUrl = (input?: string) => {
  const value = (input || "").trim().replace(/\/+$/, "");
  if (!value) return "http://localhost:5000/api";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith(":")) return `http://localhost${value}`;
  if (value.startsWith("/")) return `http://localhost:5000${value}`;
  return `http://${value}`;
};

const API_BASE_URL = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL);

function StarRow({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`text-sm ${s <= value ? "text-amber-400" : "text-gray-300"}`}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductReviewsSection({ productId, className = "" }: { productId: string; className?: string }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const ratingLabel = useMemo(() => `${averageRating.toFixed(1)} / 5`, [averageRating]);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(productId)}/reviews`, { cache: "no-store" });
      const payload = await res.json();
      if (!res.ok || !payload?.success) {
        setItems([]);
        setAverageRating(0);
        setNumReviews(0);
        return;
      }
      const data = (payload.data || {}) as ReviewsPayload;
      setItems(Array.isArray(data.items) ? data.items : []);
      setAverageRating(Number(data.summary?.averageRating || 0));
      setNumReviews(Number(data.summary?.numReviews || 0));
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    fetchReviews();
  }, [productId, fetchReviews]);

  const submitReview = async () => {
    setMessage("");
    if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
      setMessage("Please select a star rating.");
      return;
    }
    if (comment.trim().length < 5) {
      setMessage("Please write at least 5 characters in review.");
      return;
    }
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token || !isAuthenticated) {
      setMessage("Please login to submit review.");
      return;
    }

    setSubmitLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(productId)}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: selectedRating,
          comment: comment.trim(),
        }),
      });
      const payload = await res.json();
      if (!res.ok || !payload?.success) {
        setMessage(payload?.error || "Failed to submit review.");
        return;
      }
      setMessage("Review submitted successfully.");
      setComment("");
      await fetchReviews();
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <section className={`rounded-xl border border-[#dbe4e7] bg-white p-4 ${className}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#e6e8ea] pb-3">
        <div>
          <p className="text-lg font-bold text-[#2b3437]">Reviews & Ratings</p>
          <div className="mt-1 flex items-center gap-2">
            <StarRow value={Math.round(averageRating)} />
            <span className="text-sm font-semibold text-[#2b3437]">{ratingLabel}</span>
            <span className="text-xs text-[#586064]">({numReviews} reviews)</span>
          </div>
        </div>
      </div>

      <div className="mb-4 rounded-lg bg-[#f8f9fa] p-3">
        <p className="mb-2 text-sm font-semibold text-[#2b3437]">Rate this product</p>
        <div className="mb-2 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              className={`text-xl ${selectedRating >= s ? "text-amber-400" : "text-gray-300"}`}
              onClick={() => setSelectedRating(s)}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          className="w-full rounded-lg border border-[#dbe4e7] bg-white px-3 py-2 text-sm outline-none focus:border-[#644aad]"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-xs text-[#586064]">Your rating and review will be visible on website and admin panel.</span>
          <button
            type="button"
            className="rounded-lg bg-[#644aad] px-3 py-2 text-xs font-semibold text-white hover:bg-[#583da0] disabled:opacity-60"
            onClick={submitReview}
            disabled={submitLoading}
          >
            {submitLoading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
        {message ? <p className="mt-2 text-xs text-[#4b5aa4]">{message}</p> : null}
      </div>

      {loading ? (
        <p className="text-sm text-[#586064]">Loading reviews...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-[#586064]">No reviews yet. Be the first one to review.</p>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map((review) => (
            <div key={review._id} className="rounded-lg border border-[#e6e8ea] p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[#2b3437]">{review.user?.name || "Customer"}</p>
                <span className="text-xs text-[#586064]">{new Date(review.createdAt).toLocaleDateString("en-IN")}</span>
              </div>
              <div className="mb-1 flex items-center gap-2">
                <StarRow value={review.rating} />
                {review.isVerifiedPurchase ? (
                  <span className="rounded-full bg-[#ece7ff] px-2 py-0.5 text-[10px] font-medium text-[#644aad]">Verified Purchase</span>
                ) : null}
              </div>
              <p className="text-sm text-[#586064] whitespace-pre-line break-words [overflow-wrap:anywhere]">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
