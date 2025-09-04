"use client";

import { useEffect, useState } from "react";
import { useSwap } from "@/lib/store";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProfilePage() {
  const me = useSwap((s) => s.me);
  const seed = useSwap((s) => s.seed);

  const mySkills = useSwap((s) => s.mySkills);
  const myCourses = useSwap((s) => s.myCourses);

  const addSkill = useSwap((s) => s.addSkill);
  const removeSkill = useSwap((s) => s.removeSkill);
  const addCourse = useSwap((s) => s.addCourse);
  const removeCourse = useSwap((s) => s.removeCourse);

  // basics (display for now)
  const [name, setName] = useState(me?.name || "");
  const [university, setUniversity] = useState(me?.university || "AUI");
  const [timezone, setTimezone] = useState(
    me?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  // add forms
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] =
    useState<"BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT">("INTERMEDIATE");
  const [courseCode, setCourseCode] = useState("");

  useEffect(() => {
    if (me?.email) seed(me.email);
  }, [me?.email, seed]);

  async function handleAddSkill() {
    const name = skillName.trim();
    if (!name) return;
    await addSkill(name, skillLevel);
    setSkillName("");
    toast.success("Skill added");
  }

  async function handleAddCourse() {
    const code = courseCode.trim().toUpperCase();
    if (!code) return;
    await addCourse(code, "A");
    setCourseCode("");
    toast.success("Course added");
  }

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Profile</h2>

      {/* BASICS */}
      <Card>
        <CardHeader>
          <CardTitle>Basics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Full name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input value={me?.email || ""} disabled />
          </div>
          <div>
            <label className="text-sm font-medium">Timezone</label>
            <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">University</label>
            <Input value={university} onChange={(e) => setUniversity(e.target.value)} />
          </div>

          <div className="col-span-full">
            <Button variant="outline" disabled>
              Save (coming soon)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TEACHING (merged Skills + Courses) */}
      <Card>
        <CardHeader className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Teaching</CardTitle>
            <p className="mt-1 text-sm text-gray-600">
              What you can teach to others on Swap.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
              {mySkills.length} skill{mySkills.length === 1 ? "" : "s"}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              {myCourses.length} course{myCourses.length === 1 ? "" : "s"}
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-8 lg:grid-cols-2">
            {/* SKILLS PANEL */}
            <section>
              <h3 className="mb-3 text-sm font-semibold text-gray-700">Skills you can teach</h3>

              <div className="mb-4 flex flex-wrap gap-2">
                {mySkills.length === 0 && (
                  <div className="text-sm text-gray-500">No skills yet.</div>
                )}
                {mySkills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-900 shadow-sm"
                  >
                    {s}
                    <button
                      className="rounded-full bg-indigo-100 px-2 text-xs text-indigo-700 hover:bg-indigo-200"
                      onClick={async () => {
                        await removeSkill(s);
                        toast.success(`Removed ${s}`);
                      }}
                      aria-label={`Remove ${s}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  placeholder="e.g., chess"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                />
                <select
                  className="rounded-md border px-3 py-2"
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value as any)}
                >
                  <option>BEGINNER</option>
                  <option>INTERMEDIATE</option>
                  <option>ADVANCED</option>
                  <option>EXPERT</option>
                </select>
                <Button onClick={handleAddSkill}>Add skill</Button>
              </div>
            </section>

            {/* COURSES PANEL */}
            <section className="lg:border-l lg:pl-8">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">
                Courses you aced (A/A+)
              </h3>

              <div className="mb-4 flex flex-wrap gap-2">
                {myCourses.length === 0 && (
                  <div className="text-sm text-gray-500">No courses yet.</div>
                )}
                {myCourses.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-900 shadow-sm"
                  >
                    {c}
                    <button
                      className="rounded-full bg-emerald-100 px-2 text-xs text-emerald-700 hover:bg-emerald-200"
                      onClick={async () => {
                        await removeCourse(c);
                        toast.success(`Removed ${c}`);
                      }}
                      aria-label={`Remove ${c}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  placeholder="e.g., MATH305"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                />
                <Button onClick={handleAddCourse}>Add course</Button>
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
