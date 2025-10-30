"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSwap } from "@/lib/store";
import TranscriptUploader from "../profile/TranscriptUploader";
import { GlowCard } from "@/components/ui/enhanced-components";
import { BookOpen, Sparkles } from "lucide-react";

export default function OnboardingPage() {
  const me = useSwap(s => s.me);
  const onboarded = useSwap(s => s.onboarded);
  const save = useSwap(s => s.saveOnboarding);
  const mySkills = useSwap(s => s.mySkills);
  const myCourses = useSwap(s => s.myCourses);
  const [skills, setSkills] = useState(mySkills.join(", "));
  const router = useRouter();

  useEffect(() => { if (onboarded) router.replace("/matches"); }, [onboarded, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const skillsArr = skills.split(",").map(s => s.trim()).filter(Boolean);
    const coursesArr = myCourses.map(c => c.courseCode);
    const ok = await save(me?.name, skillsArr, coursesArr);
    if (ok) router.replace("/matches");
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Swap!</h1>
        </div>
        <p className="text-lg text-gray-600">
          Complete this form to activate your account and receive <span className="font-semibold text-blue-600">1 free token</span>!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <GlowCard className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Basic Information
              </h3>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Your name</label>
              <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
                <p className="text-gray-900 font-medium">{me?.name || "Not provided"}</p>
                <p className="text-xs text-gray-500 mt-1">From your sign-up</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Skills (comma-separated)</label>
              <Input placeholder="chess, python, calculus" value={skills} onChange={e => setSkills(e.target.value)} />
              <p className="mt-1 text-xs text-gray-500">We’ll default your level to Advanced (you can edit later).</p>
            </div>
            <div>
              <label className="text-sm font-medium">Courses you can teach</label>
              {myCourses.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-6 text-center">
                  <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 mb-1">No courses added yet</p>
                  <p className="text-xs text-gray-500">Upload your transcript on the right →</p>
                </div>
              ) : (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-semibold text-green-900">
                      {myCourses.length} course{myCourses.length !== 1 ? 's' : ''} ready
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {myCourses.slice(0, 6).map((course, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-700 border border-green-200"
                      >
                        {course.courseCode}
                        <span className="text-green-600 font-semibold">{course.grade}</span>
                      </span>
                    ))}
                    {myCourses.length > 6 && (
                      <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-500 border border-gray-200">
                        +{myCourses.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6"
              disabled={myCourses.length === 0}
            >
              Complete Setup & Get 1 Free Token
            </Button>
            {myCourses.length === 0 && (
              <p className="text-xs text-center text-orange-600 font-medium">
                Please upload your transcript to add at least one course
              </p>
            )}
            </form>
          </GlowCard>
        </div>

        <div className="space-y-6">
          <GlowCard className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Upload Transcript</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Upload your PDF transcript to automatically extract courses with A-/A/A+ grades.
            </p>
            <TranscriptUploader />
          </GlowCard>


        </div>
      </div>
    </div>
  );
}
