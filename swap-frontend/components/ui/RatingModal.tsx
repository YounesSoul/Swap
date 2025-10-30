"use client";

import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Star, X } from "lucide-react";
import { toast } from "sonner";
import { useSwap } from "@/lib/store";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    email: string;
  };
  skillOrCourse: string;
  category: "skill" | "course";
  sessionId?: string; // Optional for backward compatibility
  currentUserId?: string; // Pass the actual user ID when available
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  user,
  skillOrCourse,
  category,
  sessionId,
  currentUserId,
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const me = useSwap((s) => s.me);

  const handleSubmit = async () => {
    if (!me || rating === 0) return;

    console.log('Frontend - me object:', me);
    console.log('Frontend - user object:', user);
    console.log('Frontend - sessionId:', sessionId);

    // Fix for user ID issue - use currentUserId if provided, otherwise fall back to me.id
    let actualUserId = currentUserId || me.id;
    if (actualUserId === 'me' && me.email) {
      // If still 'me', use email as fallback
      actualUserId = me.email;
    }

    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:4000/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raterId: actualUserId,
          ratedId: user.id,
          sessionId: sessionId, // Include sessionId for session-based ratings
          rating,
          review: review || undefined,
          category,
          skillOrCourse,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success("Rating submitted successfully!");
        onClose();
        setRating(0);
        setReview("");
      } else {
        toast.error(result.error || "Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Rate {user.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
              alt={user.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-semibold text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-600">
                {category === "skill" ? "Skill" : "Course"}: {skillOrCourse}
              </div>
            </div>
          </div>
        </div>

        {/* Star Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="text-3xl transition-colors focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {rating === 0 && "Click to rate"}
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </div>
        </div>

        {/* Review */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review (Optional)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder={`Share your experience with ${user.name}...`}
          />
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};