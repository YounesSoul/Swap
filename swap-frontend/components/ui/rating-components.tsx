import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingComponentProps {
  currentRating?: number;
  onRate?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingComponent: React.FC<RatingComponentProps> = ({
  currentRating = 0,
  onRate,
  readOnly = false,
  size = 'md'
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(currentRating);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  };

  const handleClick = (rating: number) => {
    if (readOnly) return;
    setSelectedRating(rating);
    onRate?.(rating);
  };

  const handleMouseEnter = (rating: number) => {
    if (readOnly) return;
    setHoveredRating(rating);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoveredRating(0);
  };

  const displayRating = hoveredRating || selectedRating;

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          className={`${sizeClasses[size]} transition-colors duration-150 ${
            readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={readOnly}
        >
          <Star
            className={`w-full h-full ${
              star <= displayRating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
      {!readOnly && (
        <span className="ml-2 text-sm text-gray-600">
          {displayRating > 0 ? `${displayRating} star${displayRating > 1 ? 's' : ''}` : 'Rate this user'}
        </span>
      )}
    </div>
  );
};

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    review?: string;
    rater: {
      name: string;
      email: string;
    };
    createdAt: string;
    category: string;
    skillOrCourse: string;
  };
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {review.rater.name?.[0]?.toUpperCase() || review.rater.email[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{review.rater.name || 'Anonymous'}</h4>
            <p className="text-sm text-gray-500">{review.rater.email}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <RatingComponent currentRating={review.rating} readOnly size="sm" />
          <span className="text-xs text-gray-500 mt-1">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="mb-2">
        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          {review.category === 'skill' ? '🎯' : '📚'} {review.skillOrCourse}
        </span>
      </div>
      
      {review.review && (
        <p className="text-gray-700 text-sm leading-relaxed">
          {review.review}
        </p>
      )}
    </div>
  );
};

interface RatingSummaryProps {
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

export const RatingSummary: React.FC<RatingSummaryProps> = ({
  averageRating,
  totalRatings,
  ratingDistribution
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-900 mb-2">
          {averageRating.toFixed(1)}
        </div>
        <RatingComponent currentRating={Math.round(averageRating)} readOnly size="lg" />
        <p className="text-gray-600 mt-2">
          Based on {totalRatings} review{totalRatings !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = ratingDistribution[stars as keyof typeof ratingDistribution];
          const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
          
          return (
            <div key={stars} className="flex items-center space-x-3">
              <span className="text-sm font-medium w-6">{stars}</span>
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};