"use client";

import React from "react";
import { GlowCard, ChromaGrid } from "@/components/ui/enhanced-components";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Calendar, 
  Star, 
  GraduationCap, 
  Award,
  Clock,
  User
} from "lucide-react";

interface SearchResultCardProps {
  result: any;
  isMe: boolean;
  onMessage: () => void;
  onBook: () => void;
  isBooking: boolean;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  result,
  isMe,
  onMessage,
  onBook,
  isBooking
}) => {
  const label = (result.course?.code || (result.skills?.[0]?.name ?? "SKILL")).toString();
  
  // Choose glow color based on type
  const glowColor = result.skills ? "147, 51, 234" : "59, 130, 246"; // Purple for skills, Blue for courses

  return (
    <GlowCard glowColor={glowColor} className="p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {result.user.name || "Anonymous Teacher"}
              </h3>
              <p className="text-sm text-gray-600">{result.user.email}</p>
            </div>
          </div>
          
          {/* Rating/Badge */}
          <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-full">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-yellow-700">4.8</span>
          </div>
        </div>

        {/* Skills/Course Info */}
        <div className="space-y-3">
          {result.skills && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Skills</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.skills.map((skill: any, index: number) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      skill.level === 'EXPERT' ? 'bg-purple-100 text-purple-700' :
                      skill.level === 'ADVANCED' ? 'bg-blue-100 text-blue-700' :
                      skill.level === 'INTERMEDIATE' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {skill.name} ({skill.level.toLowerCase()})
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.course && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Course Excellence</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="font-bold text-blue-900 text-lg">
                  {result.course.code}
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${
                  result.course.grade === 'A+' ? 'bg-green-100 text-green-800' :
                  result.course.grade === 'A' ? 'bg-green-100 text-green-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  Grade: {result.course.grade}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          <Button
            variant="outline"
            disabled={isMe}
            onClick={onMessage}
            className="flex-1 flex items-center justify-center space-x-2 hover:bg-purple-50 hover:border-purple-300"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{isMe ? "That's you!" : "Message"}</span>
          </Button>

          <Button
            disabled={isMe || isBooking}
            onClick={onBook}
            className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isBooking ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Booking...</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>Book Session</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </GlowCard>
  );
};

interface EmptyStateProps {
  mode: "skill" | "course";
  onSearch: (query: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ mode, onSearch }) => {
  const suggestions = mode === "skill" 
    ? ["Chess", "Python", "Guitar", "Mathematics", "Photography"]
    : ["MATH305", "CS101", "PHYS201", "CHEM120", "HIST105"];

  return (
    <div className="text-center py-12 space-y-6">
      <div className="space-y-3">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
          <GraduationCap className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          No results yet
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          {mode === "skill" 
            ? "Search for a skill to find teachers who can help you learn"
            : "Search for a course code to find students who aced it"
          }
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-500">Try searching for:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSearch(suggestion)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 hover:scale-105"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

interface SearchResultsGridProps {
  results: any[];
  me: any;
  onMessage: (email: string) => void;
  onBook: (email: string, label: string) => void;
  bookingEmail: string | null;
  mode: "skill" | "course";
  searchQuery: string;
  onSearch: (query: string) => void;
}

export const SearchResultsGrid: React.FC<SearchResultsGridProps> = ({
  results,
  me,
  onMessage,
  onBook,
  bookingEmail,
  mode,
  searchQuery,
  onSearch
}) => {
  if (results.length === 0) {
    return <EmptyState mode={mode} onSearch={onSearch} />;
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Found {results.length} {mode === "skill" ? "teacher" : "student"}{results.length !== 1 ? "s" : ""}
        </h2>
        <div className="text-sm text-gray-500">
          Searching for: <span className="font-medium text-purple-600">"{searchQuery}"</span>
        </div>
      </div>

      {/* Results Grid */}
      <ChromaGrid gridCols={2} className="auto-rows-fr">
        {results.map((result: any) => {
          const isMe = result.user.email?.toLowerCase() === me?.email?.toLowerCase();
          const label = (result.course?.code || (result.skills?.[0]?.name ?? "SKILL")).toString();

          return (
            <SearchResultCard
              key={result.user.email}
              result={result}
              isMe={isMe}
              onMessage={() => onMessage(result.user.email)}
              onBook={() => onBook(result.user.email, label)}
              isBooking={bookingEmail === result.user.email}
            />
          );
        })}
      </ChromaGrid>
    </div>
  );
};