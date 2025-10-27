"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { 
  Plus, 
  X, 
  Award, 
  BookOpen,
  Star,
  Trash2
} from "lucide-react";
import { GlowCard } from "@/components/ui/enhanced-components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SkillTagProps {
  skill: string;
  level: string;
  onRemove: (skill: string) => void;
  delay?: number;
}

const SkillTag: React.FC<SkillTagProps> = ({ skill, level, onRemove, delay = 0 }) => {
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tag = tagRef.current;
    if (!tag) return;

    gsap.fromTo(
      tag,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, delay, ease: "back.out(1.7)" }
    );
  }, [delay]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "EXPERT": return "bg-purple-100 text-purple-800 border-purple-200";
      case "ADVANCED": return "bg-blue-100 text-blue-800 border-blue-200";
      case "INTERMEDIATE": return "bg-green-100 text-green-800 border-green-200";
      case "BEGINNER": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getLevelIcon = (level: string) => {
    const count = level === "EXPERT" ? 4 : level === "ADVANCED" ? 3 : level === "INTERMEDIATE" ? 2 : 1;
    return Array.from({ length: 4 }).map((_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < count ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div
      ref={tagRef}
      className={`
        inline-flex items-center gap-3 px-4 py-2 rounded-xl border-2 shadow-sm transition-all duration-200
        hover:shadow-md hover:scale-105 group
        ${getLevelColor(level)}
      `}
    >
      <div className="flex items-center space-x-2">
        <Award className="w-4 h-4" />
        <span className="font-medium">{skill}</span>
      </div>
      
      <div className="flex items-center space-x-1">
        {getLevelIcon(level)}
      </div>

      <button
        onClick={() => onRemove(skill)}
        className="opacity-60 hover:opacity-100 transition-opacity p-1 hover:bg-black/10 rounded-full"
        aria-label={`Remove ${skill}`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface CourseTagProps {
  course: string;
  grade?: string;
  onRemove: (course: string) => void;
  delay?: number;
}

const CourseTag: React.FC<CourseTagProps> = ({ course, grade = "A", onRemove, delay = 0 }) => {
  const tagRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tag = tagRef.current;
    if (!tag) return;

    gsap.fromTo(
      tag,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, delay, ease: "back.out(1.7)" }
    );
  }, [delay]);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+": return "bg-green-100 text-green-800 border-green-200";
      case "A": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div
      ref={tagRef}
      className={`
        inline-flex items-center gap-3 px-4 py-2 rounded-xl border-2 shadow-sm transition-all duration-200
        hover:shadow-md hover:scale-105 group
        ${getGradeColor(grade)}
      `}
    >
      <div className="flex items-center space-x-2">
        <BookOpen className="w-4 h-4" />
        <span className="font-medium">{course}</span>
      </div>
      
      <div className="px-2 py-1 bg-white rounded-md text-xs font-bold">
        {grade}
      </div>

      <button
        onClick={() => onRemove(course)}
        className="opacity-60 hover:opacity-100 transition-opacity p-1 hover:bg-black/10 rounded-full"
        aria-label={`Remove ${course}`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface SkillsManagerProps {
  skills: string[];
  onAddSkill: (skill: string, level: string) => Promise<void>;
  onRemoveSkill: (skill: string) => Promise<void>;
}

export const SkillsManager: React.FC<SkillsManagerProps> = ({
  skills,
  onAddSkill,
  onRemoveSkill,
}) => {
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT">("INTERMEDIATE");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSkill = async () => {
    const name = skillName.trim();
    if (!name) return;
    
    try {
      await onAddSkill(name, skillLevel);
      setSkillName("");
      setIsAdding(false);
      toast.success("Skill added successfully!");
    } catch (error) {
      toast.error("Failed to add skill");
    }
  };

  const handleRemoveSkill = async (skill: string) => {
    try {
      await onRemoveSkill(skill);
      toast.success(`Removed ${skill}`);
    } catch (error) {
      toast.error("Failed to remove skill");
    }
  };

  return (
    <GlowCard className="p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Award className="w-5 h-5 text-blue-600" />
            <span>Skills you can teach</span>
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
            {skills.length} skill{skills.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-sm text-gray-600">Share your expertise with others</p>
      </div>

      {/* Skills Grid */}
      <div className="mb-6">
        {skills.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No skills added yet. Add your first skill below!</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <SkillTag
                key={skill}
                skill={skill}
                level="INTERMEDIATE" // This could be enhanced to store actual levels
                onRemove={handleRemoveSkill}
                delay={index * 0.1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Skill Form */}
      {isAdding ? (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              placeholder="e.g., Python, Chess, Guitar"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              className="sm:col-span-2"
            />
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddSkill} className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          onClick={() => setIsAdding(true)}
          variant="outline"
          className="w-full border-dashed border-2 hover:border-blue-300 hover:bg-blue-50"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Skill
        </Button>
      )}
    </GlowCard>
  );
};

interface CoursesManagerProps {
  courses: { courseCode: string; grade: string }[];
  onAddCourse: (course: string, grade: string) => Promise<void>;
  onRemoveCourse: (course: string) => Promise<void>;
}

export const CoursesManager: React.FC<CoursesManagerProps> = ({
  courses,
  onAddCourse,
  onRemoveCourse,
}) => {
  const handleRemoveCourse = async (course: string) => {
    try {
      await onRemoveCourse(course);
      toast.success(`Removed ${course}`);
    } catch (error) {
      toast.error("Failed to remove course");
    }
  };

  return (
    <GlowCard className="p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <span>Courses you aced</span>
          </h3>
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium">
            {courses.length} course{courses.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-sm text-gray-600">Academic courses with A/A+ grades</p>
      </div>

      {/* Courses Grid */}
      <div className="mb-6">
        {courses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No courses added yet. Upload a transcript to add courses!</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {courses.map((course, index) => (
              <CourseTag
                key={course.courseCode}
                course={course.courseCode}
                grade={course.grade}
                onRemove={handleRemoveCourse}
                delay={index * 0.1}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info about adding courses */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">How to add courses</h4>
            <p className="text-sm text-blue-700 mt-1">
              Upload your transcript (PDF) using the sidebar to automatically extract and add courses with A/A+ grades.
            </p>
          </div>
        </div>
      </div>
    </GlowCard>
  );
};

export { SkillTag, CourseTag };