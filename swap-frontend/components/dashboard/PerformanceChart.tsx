"use client";

import { TrendingUp } from "lucide-react";

export const PerformanceChart = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-blue-600">Performance Over Time</h3>
        </div>
        
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold">
            Sessions
          </button>
          <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold hover:bg-gray-200">
            Hours
          </button>
        </div>
      </div>
      
      {/* Simple Chart Placeholder */}
      <div className="relative h-64 bg-gradient-to-b from-blue-50 to-transparent rounded-xl p-4">
        <div className="absolute inset-0 flex items-end justify-around px-4 pb-4">
          {/* Simple bar visualization */}
          {[30, 50, 40, 70, 60, 80, 65].map((height, i) => (
            <div key={i} className="flex-1 mx-1">
              <div 
                className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-700 hover:to-blue-500"
                style={{ height: `${height}%` }}
              />
            </div>
          ))}
        </div>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around text-xs text-gray-500 font-medium px-4">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 font-medium">This week average</span>
          <span className="font-bold text-blue-600">8.8 sessions</span>
        </div>
      </div>
    </div>
  );
};
