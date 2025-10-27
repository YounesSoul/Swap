"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useSwap } from "@/lib/store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, XCircle, AlertCircle, FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type TranscriptResult = {
  ok: boolean;
  message?: string;
  added?: number;
  updated?: number;
  total?: number;
  summary?: {
    totalCourses: number;
    eligible: number;
    nonEligible: number;
    confidenceBreakdown?: { high: number; medium: number; low: number };
  };
  eligibleCourses?: Array<{ code: string; grade: string; title?: string; confidence: "high" | "medium" | "low" }>;
  nonEligibleCourses?: Array<{ code: string; grade: string; title?: string; reason: string }>;
};

export default function TranscriptUploader() {
  const { data: session } = useSession();
  const seed = useSwap(s => s.seed);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [showResume, setShowResume] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [addingCourses, setAddingCourses] = useState(false);
  async function upload() {
    if (!file) return;
    if (!session?.user?.email) {
      toast.error("Please log in first");
      return;
    }
    try {
      setBusy(true);
      const form = new FormData();
      form.append("file", file);
      form.append("email", session.user.email);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transcripts/ingest`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data?.message || "Could not process transcript");
        setResult(data);
        setShowResume(true);
      } else {
        setResult(data);
        setShowResume(true);
        // Auto-select all eligible courses
        if (data.eligibleCourses) {
          setSelectedCourses(new Set(data.eligibleCourses.map((c: any) => c.code)));
        }
        toast.success("Transcript scanned! Select courses to add.");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setBusy(false);
      setFile(null);
    }
  }

  async function addSelectedCoursesToProfile() {
    if (!session?.user?.email || selectedCourses.size === 0) return;
    
    const coursesToAdd = result?.eligibleCourses
      ?.filter(c => selectedCourses.has(c.code))
      .map(c => ({ code: c.code, grade: c.grade })) || [];

    try {
      setAddingCourses(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transcripts/add-selected-courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email, courses: coursesToAdd }),
      });
      
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data?.message || "Failed to add courses");
      } else {
        toast.success(`Added ${data.added} courses, updated ${data.updated}`);
        await seed(session.user.email);
        setShowResume(false);
        setSelectedCourses(new Set());
      }
    } catch {
      toast.error("Failed to add courses");
    } finally {
      setAddingCourses(false);
    }
  }

  const toggleCourse = (code: string) => {
    setSelectedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(code)) {
        newSet.delete(code);
      } else {
        newSet.add(code);
      }
      return newSet;
    });
  };

  const toggleAllCourses = () => {
    if (!result?.eligibleCourses) return;
    if (selectedCourses.size === result.eligibleCourses.length) {
      setSelectedCourses(new Set());
    } else {
      setSelectedCourses(new Set(result.eligibleCourses.map(c => c.code)));
    }
  }

  const getConfidenceColor = (confidence: "high" | "medium" | "low") => {
    switch (confidence) {
      case "high": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-orange-100 text-orange-800";
    }
  };

  return (
    <>
      <div className="rounded-xl border bg-white p-4 shadow-soft">
        <h3 className="mb-2 text-sm font-semibold">Add courses from transcript</h3>
        <p className="mb-3 text-xs text-gray-600">
          Upload a PDF transcript. We'll auto-detect A / A+ courses and add them to your profile.
        </p>
        <div className="flex flex-col items-start gap-2 sm:flex-row">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <Button onClick={upload} disabled={!file || busy}>
            {busy ? "Processing…" : "Upload & scan"}
          </Button>
        </div>
        <p className="mt-2 text-[11px] text-gray-500">
          Tip: make sure it's a text-based PDF.
        </p>
      </div>

      <Dialog open={showResume} onOpenChange={setShowResume}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Transcript Scan Results
            </DialogTitle>
            <DialogDescription>
              Review the courses detected from your transcript
            </DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-lg bg-blue-50 p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {result.summary?.totalCourses || 0}
                  </div>
                  <div className="text-xs text-blue-700 mt-1">Total Courses</div>
                </div>
                <div className="rounded-lg bg-green-50 p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {result.summary?.eligible || 0}
                  </div>
                  <div className="text-xs text-green-700 mt-1">Eligible</div>
                </div>
                <div className="rounded-lg bg-orange-50 p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {result.summary?.nonEligible || 0}
                  </div>
                  <div className="text-xs text-orange-700 mt-1">Not Eligible</div>
                </div>
                <div className="rounded-lg bg-purple-50 p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {result.added || 0} + {result.updated || 0}
                  </div>
                  <div className="text-xs text-purple-700 mt-1">Added/Updated</div>
                </div>
              </div>

              {/* Confidence Breakdown */}
              {result.summary?.confidenceBreakdown && (
                <div className="rounded-lg border bg-gray-50 p-4">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-gray-600" />
                    Confidence Breakdown
                  </h4>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                      High: {result.summary.confidenceBreakdown.high}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                      Medium: {result.summary.confidenceBreakdown.medium}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 rounded-full bg-orange-500"></span>
                      Low: {result.summary.confidenceBreakdown.low}
                    </div>
                  </div>
                </div>
              )}

              {/* Eligible Courses */}
              {result.eligibleCourses && result.eligibleCourses.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold flex items-center gap-2 text-green-700">
                      <CheckCircle2 className="h-5 w-5" />
                      Eligible Courses ({result.eligibleCourses.length})
                    </h4>
                    <Button 
                      variant="outline" 
                      onClick={toggleAllCourses}
                      className="text-sm px-3 py-1"
                    >
                      {selectedCourses.size === result.eligibleCourses.length ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {result.eligibleCourses.map((course, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50/50 p-3 text-sm hover:bg-green-100/50 transition-colors cursor-pointer"
                        onClick={() => toggleCourse(course.code)}
                      >
                        <Checkbox 
                          checked={selectedCourses.has(course.code)}
                          onCheckedChange={() => toggleCourse(course.code)}
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{course.code}</div>
                          {course.title && (
                            <div className="text-xs text-gray-600 mt-0.5">{course.title}</div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                            {course.grade}
                          </span>
                          <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${getConfidenceColor(course.confidence)}`}>
                            {course.confidence}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Non-Eligible Courses */}
              {result.nonEligibleCourses && result.nonEligibleCourses.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold flex items-center gap-2 text-orange-700">
                    <XCircle className="h-5 w-5" />
                    Non-Eligible Courses ({result.nonEligibleCourses.length})
                  </h4>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {result.nonEligibleCourses.map((course, idx) => (
                      <div 
                        key={idx} 
                        className="rounded-lg border border-orange-200 bg-orange-50/50 p-3 text-sm"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{course.code}</div>
                            {course.title && (
                              <div className="text-xs text-gray-600 mt-0.5">{course.title}</div>
                            )}
                          </div>
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                            {course.grade}
                          </span>
                        </div>
                        <div className="text-xs text-orange-700 mt-2 flex items-start gap-1">
                          <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                          <span>{course.reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-600">
                  {selectedCourses.size} course{selectedCourses.size !== 1 ? 's' : ''} selected
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowResume(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={addSelectedCoursesToProfile}
                    disabled={selectedCourses.size === 0 || addingCourses}
                  >
                    {addingCourses ? "Adding..." : `Add ${selectedCourses.size} Course${selectedCourses.size !== 1 ? 's' : ''}`}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
