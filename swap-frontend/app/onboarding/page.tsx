"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSwap } from "@/lib/store";
import TranscriptUploader from "../profile/TranscriptUploader";
import { BookOpen, ChevronDown, ChevronUp, X, Check } from "lucide-react";

const SUGGESTED_SKILLS = [
  "Python", "JavaScript", "Chess", "Mathematics", "Guitar", 
  "Photography", "Cooking", "Spanish", "French", "Drawing",
  "Web Development", "Data Science", "Machine Learning"
];

const SUGGESTED_COURSES = [
  "COM", "MTH", "PHY", "CHM", "BIO", 
  "ENG", "PSY", "ECO", "CSC", "HIS"
];

export default function OnboardingPage() {
  const me = useSwap(s => s.me);
  const save = useSwap(s => s.saveOnboarding);
  const mySkills = useSwap(s => s.mySkills);
  const myCourses = useSwap(s => s.myCourses);
  const [skills, setSkills] = useState(mySkills.join(", "));
  const [interests, setInterests] = useState<Array<{type: 'skill' | 'course', name: string}>>([]);
  const [interestInput, setInterestInput] = useState("");
  const [interestType, setInterestType] = useState<'skill' | 'course'>('skill');
  const [expandedSection, setExpandedSection] = useState<string | null>("teaching");
  const [allowNavigation, setAllowNavigation] = useState(false);
  const router = useRouter();

  // Prevent any automatic navigation away from this page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!allowNavigation) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [allowNavigation]);

  const addInterest = (name: string, type: 'skill' | 'course' = interestType) => {
    if (name && !interests.find(i => i.name.toLowerCase() === name.toLowerCase() && i.type === type)) {
      setInterests([...interests, { type, name }]);
      setInterestInput("");
    }
  };

  const removeInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    const skillsArr = skills.split(",").map(s => s.trim()).filter(Boolean);
    const coursesArr = myCourses.map(c => c.courseCode);
    
    const ok = await save(me?.name, skillsArr, coursesArr, interests);
    if (ok) {
      setAllowNavigation(true);
      router.replace("/matches");
    }
  }

  const isTeachingComplete = mySkills.length > 0 || myCourses.length > 0;
  const isInterestsComplete = interests.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome to Swap!</h1>
          <p className="text-lg text-gray-600">
            To get the best experience, we recommend<br />completing these onboarding steps.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Section 1: Teaching */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("teaching")}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-semibold text-gray-900">Set up your teaching profile</h3>
                  <p className="text-sm text-gray-500">Add skills and courses you can teach</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isTeachingComplete && (
                  <div className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                    <Check className="w-4 h-4" />
                    Complete
                  </div>
                )}
                {expandedSection === "teaching" ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {expandedSection === "teaching" && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="pt-6 space-y-6">
                  {/* Skills Section */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Skills you can teach
                    </label>
                    <Input 
                      placeholder="Python, Chess, Mathematics (comma-separated)" 
                      value={skills} 
                      onChange={e => setSkills(e.target.value)}
                      className="w-full"
                    />
                    <p className="mt-1.5 text-xs text-gray-500">
                      We'll set your level to Advanced by default (you can change this later).
                    </p>
                  </div>

                  {/* Courses Section */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Courses with A/A+ grades
                    </label>
                    
                    {myCourses.length > 0 ? (
                      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <div className="flex flex-wrap gap-2">
                          {myCourses.map((course, idx) => (
                            <span 
                              key={idx}
                              className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-200"
                            >
                              {course.courseCode}
                              <span className="text-blue-600">{course.grade}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-center">
                        <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-4">
                          Upload your transcript to automatically add courses
                        </p>
                        <TranscriptUploader />
                      </div>
                    )}
                  </div>

                  {myCourses.length > 0 && (
                    <div className="pt-2">
                      <TranscriptUploader />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Learning Interests */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("interests")}
              className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-base font-semibold text-gray-900">Choose your learning interests</h3>
                  <p className="text-sm text-gray-500">Get personalized teacher suggestions</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isInterestsComplete && (
                  <div className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                    <Check className="w-4 h-4" />
                    {interests.length} selected
                  </div>
                )}
                {expandedSection === "interests" ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            {expandedSection === "interests" && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="pt-6 space-y-4">
                  {/* Quick Add Skills */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">
                      Skills
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_SKILLS.map(skill => {
                        const isSelected = interests.some(i => i.name === skill && i.type === 'skill');
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => addInterest(skill, 'skill')}
                            disabled={isSelected}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                            {skill}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Add Courses */}
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">
                      Courses
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_COURSES.map(course => {
                        const isSelected = interests.some(i => i.name === course && i.type === 'course');
                        return (
                          <button
                            key={course}
                            type="button"
                            onClick={() => addInterest(course, 'course')}
                            disabled={isSelected}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                            {course}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Interest Input */}
                  <div className="pt-2">
                    <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">
                      Add custom interest
                    </label>
                    <div className="flex gap-2">
                      <select 
                        value={interestType}
                        onChange={(e) => setInterestType(e.target.value as 'skill' | 'course')}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                      >
                        <option value="skill">Skill</option>
                        <option value="course">Course</option>
                      </select>
                      <Input 
                        placeholder="Type here..." 
                        value={interestInput}
                        onChange={e => setInterestInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addInterest(interestInput))}
                        className="flex-1"
                      />
                      <Button 
                        type="button"
                        onClick={() => addInterest(interestInput)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {/* Selected Interests */}
                  {interests.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        Your selections ({interests.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 text-white px-3 py-1.5 text-sm font-medium"
                          >
                            {interest.name}
                            <button
                              type="button"
                              onClick={() => removeInterest(idx)}
                              className="ml-0.5 hover:bg-blue-700 rounded p-0.5"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Data Privacy Notice */}
          <div className="flex items-start gap-2 text-xs text-gray-500 px-2">
            <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center mt-0.5 flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            </div>
            <p>
              All your data is protected and used only for the purpose of enabling Swap.{" "}
              <a href="#" className="text-blue-600 hover:underline">Learn more</a>
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-black hover:bg-gray-800 text-white font-medium py-6 text-base rounded-xl"
              disabled={myCourses.length === 0 && skills.trim().length === 0}
            >
              Complete Setup & Start Learning
            </Button>
            {myCourses.length === 0 && skills.trim().length === 0 && (
              <p className="text-xs text-center text-gray-500 mt-2">
                Please add at least one skill or course to continue
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
