"use client";

import React from "react";
import { Star, Clock, User, BookOpen, Award } from "lucide-react";
import { GlowCard } from "@/components/ui/enhanced-components";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "skill" | "course";
  rating: number;
  reviewCount?: number;
  instructor: string;
  level: string;
  duration: string;
  tags: string[];
  image: string;
  [key: string]: any; // For additional properties
}

interface SearchResultsProps {
  results: SearchResult[];
  loading: boolean;
  hasSearched: boolean;
  onResultClick?: (result: SearchResult) => void;
  customActions?: (result: SearchResult) => React.ReactNode;
}

const SearchResultCard: React.FC<{
  result: SearchResult;
  onClick?: () => void;
  customActions?: React.ReactNode;
}> = ({ result, onClick, customActions }) => {
  return (
    <GlowCard className="group cursor-pointer transition-all duration-300 hover:scale-[1.02]">
      <div onClick={onClick} className="p-6">
        {/* Header */}
        <div className="flex items-start space-x-4 mb-4">
          <img
            src={result.image}
            alt={result.instructor}
            className="w-12 h-12 rounded-full bg-gray-200"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {result.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex items-center">
                {result.rating > 0 ? (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(result.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {result.rating.toFixed(1)}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Not rated yet</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end text-yellow-500 font-semibold">
              {result.rating > 0 ? (
                <>
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1">{result.rating.toFixed(1)}</span>
                </>
              ) : (
                <span className="text-gray-400 text-sm">No rating</span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {(result.reviewCount || 0) > 0 ? `${result.reviewCount} reviews` : 'No reviews yet'}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {result.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{result.instructor}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{result.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            {result.type === "skill" ? (
              <Award className="w-4 h-4" />
            ) : (
              <BookOpen className="w-4 h-4" />
            )}
            <span>{result.level}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {result.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs rounded-full ${
                result.type === "skill"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {tag}
            </span>
          ))}
          {result.tags.length > 3 && (
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
              +{result.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Custom Actions */}
        {customActions && (
          <div onClick={(e) => e.stopPropagation()}>
            {customActions}
          </div>
        )}
      </div>
    </GlowCard>
  );
};

const EmptyState: React.FC<{ hasSearched: boolean; type: "skill" | "course" }> = ({
  hasSearched,
  type,
}) => {
  if (!hasSearched) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Ready to Find Your Perfect {type === "skill" ? "Teacher" : "Mentor"}?
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          {type === "skill" 
            ? "Search for skills you want to learn and connect with expert teachers"
            : "Find students who excelled in your courses and get the help you need"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">😔</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Try adjusting your search terms or exploring different {type}s
      </p>
    </div>
  );
};

const SearchResultsGrid: React.FC<SearchResultsProps> = ({
  results,
  loading,
  hasSearched,
  onResultClick,
  customActions,
}) => {
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-gray-600">Searching for the perfect matches...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return <EmptyState hasSearched={hasSearched} type="skill" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Search Results ({results.length})
        </h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map((result) => (
          <SearchResultCard
            key={result.id}
            result={result}
            onClick={() => onResultClick?.(result)}
            customActions={customActions?.(result)}
          />
        ))}
      </div>
    </div>
  );
};

// Named exports
export { SearchResultCard, EmptyState, SearchResultsGrid };

// Default export
export default SearchResultsGrid;