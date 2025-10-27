"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSwap } from "@/lib/store";

export default function OnboardingPage() {
  const me = useSwap(s => s.me);
  const onboarded = useSwap(s => s.onboarded);
  const save = useSwap(s => s.saveOnboarding);
  const mySkills = useSwap(s => s.mySkills);
  const myCourses = useSwap(s => s.myCourses);
  const [name, setName] = useState(me?.name || "");
  const [skills, setSkills] = useState(mySkills.join(", "));
  const [courses, setCourses] = useState(myCourses.join(", "));
  const router = useRouter();

  useEffect(() => { if (onboarded) router.replace("/matches"); }, [onboarded, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const skillsArr = skills.split(",").map(s => s.trim()).filter(Boolean);
    const coursesArr = courses.split(",").map(s => s.trim().toUpperCase()).filter(Boolean);
    const ok = await save(name || undefined, skillsArr, coursesArr);
    if (ok) router.replace("/matches");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader><CardTitle>Tell us what you can teach</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Your name</label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Skills (comma-separated)</label>
              <Input placeholder="chess, python, calculus" value={skills} onChange={e => setSkills(e.target.value)} />
              <p className="mt-1 text-xs text-gray-500">We’ll default your level to Advanced (you can edit later).</p>
            </div>
            <div>
              <label className="text-sm font-medium">Courses you aced (A, A+)</label>
              <Input placeholder="MATH305, CS101" value={courses} onChange={e => setCourses(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button type="submit">Save & Continue</Button>
              <Button type="button" variant="outline" onClick={() => router.replace("/dashboard")}>Skip</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
