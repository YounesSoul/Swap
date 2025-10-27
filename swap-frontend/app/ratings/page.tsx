"use client";

import { useState, useEffect } from "react";
import { Star, User, Calendar } from "lucide-react";
import { useSwap } from "@/lib/store";
import { useSearchParams } from "next/navigation";

interface Rating {
  id: string;
  rating: number;
  review?: string;
  category: string;
  skillOrCourse: string;
  createdAt: string;
  rater: {
    id: string;
    name: string;
    email: string;
  };
}

interface RatingStats {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export default function RatingsPage() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "skill" | "course">("all");
  const me = useSwap((s) => s.me);
  const searchParams = useSearchParams();
  
  // Get userId from URL params, fallback to current user
  const userId = searchParams.get('userId') || me?.id;
  
  // If user ID is still 'me', we need to show a message or redirect
  const isValidUserId = userId && userId !== 'me';

  useEffect(() => {
    if (!isValidUserId) return;
    
    fetchRatings();
    fetchStats();
  }, [userId, filter, isValidUserId]);

  const fetchRatings = async () => {
    if (!userId) return;
    
    try {
      const url = filter === "all" 
        ? `http://localhost:4000/ratings/user/${userId}`
        : `http://localhost:4000/ratings/user/${userId}?category=${filter}`;
        
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setRatings(result.data);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const fetchStats = async () => {
    if (!userId) return;
    
    try {
      const url = filter === "all" 
        ? `http://localhost:4000/ratings/user/${userId}/stats`
        : `http://localhost:4000/ratings/user/${userId}/stats?category=${filter}`;
        
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your ratings...</p>
        </div>
      </div>
    );
  }

  if (!isValidUserId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Not Loaded</h2>
          <p className="text-gray-600 mb-4">Your user profile is not properly loaded. Please try:</p>
          <ul className="text-left text-gray-600 space-y-2">
            <li>• Refreshing the page</li>
            <li>• Signing out and back in</li>
            <li>• Or use the "View Teacher Ratings" button from Sessions page</li>
          </ul>
          <div className="mt-4 text-sm text-gray-500">
            Current user ID: {userId || 'Not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Ratings</h1>
          <p className="text-gray-600">See what others think about your teaching</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            {[
              { key: "all", label: "All Ratings" },
              { key: "skill", label: "Skills" },
              { key: "course", label: "Courses" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  filter === tab.key
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:text-blue-500"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Card */}
        {stats && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Rating Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Average Rating */}
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(stats.averageRating))}
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>

              {/* Total Ratings */}
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {stats.totalRatings}
                </div>
                <div className="text-sm text-gray-600">Total Ratings</div>
              </div>

              {/* Rating Distribution */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-3">Distribution</div>
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center space-x-2 mb-1">
                    <span className="text-xs w-3">{star}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{
                          width: `${
                            stats.totalRatings > 0
                              ? (stats.ratingDistribution[star as keyof typeof stats.ratingDistribution] / stats.totalRatings) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-xs w-6 text-gray-600">
                      {stats.ratingDistribution[star as keyof typeof stats.ratingDistribution]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ratings List */}
        <div className="space-y-4">
          {ratings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No ratings yet</h3>
              <p className="text-gray-500">
                Start helping others learn to receive your first rating!
              </p>
            </div>
          ) : (
            ratings.map((rating) => (
              <div key={rating.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${rating.rater.email}`}
                      alt={rating.rater.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">
                        {rating.rater.name || "Anonymous"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {rating.category === "skill" ? "Skill" : "Course"}: {rating.skillOrCourse}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {renderStars(rating.rating)}
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {rating.review && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 italic">"{rating.review}"</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}