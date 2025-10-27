"use client";

import React, { useState } from "react";
import { AnimatedSearchBar } from "@/components/ui/enhanced-components";
import { MagicCard } from "@/components/ui/magic-bento";
import { 
  Search, 
  Users, 
  BookOpen, 
  Sparkles,
  TrendingUp,
  Star,
  Award
} from "lucide-react";

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  mode: "skill" | "course";
  onModeChange: (mode: "skill" | "course") => void;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSearch,
  mode,
  onModeChange
}) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative">
        <div className="relative h-48 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 text-center text-white space-y-3 px-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Sparkles className="w-6 h-6" />
              <h1 className="text-3xl font-bold">Find Your Perfect Learning Partner</h1>
            </div>
            <p className="text-lg opacity-90 max-w-2xl">
              Connect with expert teachers for skills or find students who aced your courses
            </p>
          </div>
          {/* Floating icons - smaller and fewer */}
          <div className="absolute top-6 left-6 opacity-15">
            <Users className="w-12 h-12" />
          </div>
          <div className="absolute bottom-6 right-6 opacity-15">
            <BookOpen className="w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Search Section */}
      <MagicCard className="p-8" enableStars={true} enableSpotlight={true} enableMagnetism={false}>
        <div className="space-y-6">
          {/* Mode Toggle */}
          <div className="flex justify-center">
            <div className="flex bg-gray-100 rounded-full p-1">
              <button
                onClick={() => onModeChange("skill")}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  mode === "skill"
                    ? "bg-white shadow-md text-purple-600"
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="font-medium">Find Skills</span>
              </button>
              <button
                onClick={() => onModeChange("course")}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  mode === "course"
                    ? "bg-white shadow-md text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">Find Courses</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <AnimatedSearchBar
              value={searchQuery}
              onChange={onSearchChange}
              onSubmit={onSearch}
              placeholder={
                mode === "skill" 
                  ? "Search for skills like chess, python, guitar..." 
                  : "Search for course codes like MATH305, CS101..."
              }
              className="w-full"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-purple-600">500+</div>
              <div className="text-sm text-gray-600">Skilled Teachers</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">1,200+</div>
              <div className="text-sm text-gray-600">Sessions Completed</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-emerald-600">4.9★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </MagicCard>
    </div>
  );
};