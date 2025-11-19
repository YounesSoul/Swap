import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { AlertCircle, CheckCircle2, FileText, X, XCircle } from "lucide-react";
import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";
import { useSwap } from "@/lib/store";
import { getApiBase } from "@/lib/api";

export type TranscriptCourse = {
  code: string;
  grade: string;
  title?: string;
  confidence: "high" | "medium" | "low";
};

export type TranscriptResult = {
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
  eligibleCourses?: TranscriptCourse[];
  nonEligibleCourses?: Array<{ code: string; grade: string; title?: string; reason: string }>;
};

const confidenceClassMap: Record<TranscriptCourse["confidence"], string> = {
  high: "td-onboarding-course__confidence td-onboarding-course__confidence--high",
  medium: "td-onboarding-course__confidence td-onboarding-course__confidence--medium",
  low: "td-onboarding-course__confidence td-onboarding-course__confidence--low",
};

const TranscriptUploader = () => {
  const { user } = useSupabaseAuth();
  const seed = useSwap((state) => state.seed);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<TranscriptResult | null>(null);
  const [showResume, setShowResume] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [addingCourses, setAddingCourses] = useState(false);

  const apiBase = getApiBase();

  const resetInput = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const upload = async () => {
    if (!file) {
      toast.error("Select a PDF transcript first.");
      return;
    }

    if (!user?.email) {
      toast.error("Please sign in before uploading.");
      return;
    }

    if (!apiBase) {
      toast.error("The API is not configured yet.");
      return;
    }

    try {
      setBusy(true);
      const form = new FormData();
      form.append("file", file);
      form.append("email", user.email);

      const response = await fetch(`${apiBase}/transcripts/ingest`, {
        method: "POST",
        body: form,
      });

      let data: TranscriptResult | null = null;
      try {
        data = await response.json();
      } catch (error) {
        console.error("Could not parse transcript response", error);
      }

      if (!response.ok || !data || !data.ok) {
        toast.error(data?.message ?? "Could not process transcript");
        setResult(data);
        setShowResume(true);
      } else {
        setResult(data);
        setShowResume(true);
        if (data.eligibleCourses?.length) {
          setSelectedCourses(new Set(data.eligibleCourses.map((course) => course.code)));
        } else {
          setSelectedCourses(new Set());
        }
        toast.success("Transcript scanned! Review the matches below.");
      }
    } catch (error) {
      console.error("Transcript upload failed", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setBusy(false);
      resetInput();
    }
  };

  const addSelectedCoursesToProfile = async () => {
    if (!user?.email) {
      toast.error("Please sign in before saving courses.");
      return;
    }

    if (!apiBase) {
      toast.error("The API is not configured yet.");
      return;
    }

    if (!result?.eligibleCourses?.length || selectedCourses.size === 0) {
      toast.error("Select at least one course to add.");
      return;
    }

    const courses = result.eligibleCourses
      .filter((course) => selectedCourses.has(course.code))
      .map((course) => ({ code: course.code, grade: course.grade }));

    if (!courses.length) {
      toast.error("Select at least one course to add.");
      return;
    }

    try {
      setAddingCourses(true);
      const response = await fetch(`${apiBase}/transcripts/add-selected-courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, courses }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        toast.error(data?.message ?? "Failed to add courses");
        return;
      }

      toast.success(`Added ${data.added ?? courses.length} course${courses.length > 1 ? "s" : ""}.`);
      await seed(user.email);
      setShowResume(false);
      setSelectedCourses(new Set());
    } catch (error) {
      console.error("Failed to add courses", error);
      toast.error("Failed to add courses");
    } finally {
      setAddingCourses(false);
    }
  };

  const toggleCourse = (code: string) => {
    setSelectedCourses((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const toggleAllCourses = () => {
    if (!result?.eligibleCourses?.length) {
      return;
    }

    setSelectedCourses((prev) => {
      if (prev.size === result.eligibleCourses!.length) {
        return new Set();
      }
      return new Set(result.eligibleCourses!.map((course) => course.code));
    });
  };

  const closeModal = () => {
    setShowResume(false);
  };

  return (
    <>
      <div className="td-onboarding-uploader">
        <div className="td-onboarding-uploader__headline">
          <p>Add courses from a PDF transcript</p>
        </div>
        <div className="td-onboarding-uploader__actions">
          <input
            ref={fileInputRef}
            className="td-onboarding-file-input"
            type="file"
            accept="application/pdf"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            className="td-onboarding-uploader__upload"
            onClick={upload}
            disabled={busy || !file}
          >
            {busy ? "Processing..." : "Upload & scan"}
          </button>
        </div>
        <p className="td-onboarding-uploader__tip">Use a text-based PDF for the best results.</p>
      </div>

      {showResume ? (
        <div className="td-onboarding-modal" role="dialog" aria-modal="true">
          <div className="td-onboarding-modal__backdrop" onClick={closeModal} />
          <div className="td-onboarding-modal__dialog">
            <header className="td-onboarding-modal__header">
              <div className="td-onboarding-modal__title">
                <FileText aria-hidden="true" />
                <span>Transcript scan results</span>
              </div>
              <button type="button" className="td-onboarding-modal__close" onClick={closeModal} aria-label="Close">
                <X aria-hidden="true" />
              </button>
            </header>
            <p className="td-onboarding-modal__description">
              Review the detected courses and decide which ones to add to your profile.
            </p>

            {result ? (
              <div className="td-onboarding-modal__body">
                <section className="td-onboarding-summary">
                  <div className="td-onboarding-summary__item td-onboarding-summary__item--blue">
                    <span className="td-onboarding-summary__value">{result.summary?.totalCourses ?? 0}</span>
                    <span className="td-onboarding-summary__label">Total courses</span>
                  </div>
                  <div className="td-onboarding-summary__item td-onboarding-summary__item--green">
                    <span className="td-onboarding-summary__value">{result.summary?.eligible ?? 0}</span>
                    <span className="td-onboarding-summary__label">Eligible</span>
                  </div>
                  <div className="td-onboarding-summary__item td-onboarding-summary__item--amber">
                    <span className="td-onboarding-summary__value">{result.summary?.nonEligible ?? 0}</span>
                    <span className="td-onboarding-summary__label">Not eligible</span>
                  </div>
                  <div className="td-onboarding-summary__item td-onboarding-summary__item--purple">
                    <span className="td-onboarding-summary__value">
                      {(result.added ?? 0) + (result.updated ?? 0)}
                    </span>
                    <span className="td-onboarding-summary__label">Added / updated</span>
                  </div>
                </section>

                {result.summary?.confidenceBreakdown ? (
                  <section className="td-onboarding-confidence" aria-label="Confidence breakdown">
                    <h4>
                      <AlertCircle aria-hidden="true" /> Confidence breakdown
                    </h4>
                    <ul>
                      <li>
                        <span className="td-onboarding-confidence__dot td-onboarding-confidence__dot--high" />
                        High: {result.summary.confidenceBreakdown.high}
                      </li>
                      <li>
                        <span className="td-onboarding-confidence__dot td-onboarding-confidence__dot--medium" />
                        Medium: {result.summary.confidenceBreakdown.medium}
                      </li>
                      <li>
                        <span className="td-onboarding-confidence__dot td-onboarding-confidence__dot--low" />
                        Low: {result.summary.confidenceBreakdown.low}
                      </li>
                    </ul>
                  </section>
                ) : null}

                {result.eligibleCourses?.length ? (
                  <section className="td-onboarding-course-list">
                    <header className="td-onboarding-course-list__header">
                      <h4>
                        <CheckCircle2 aria-hidden="true" /> Eligible courses ({result.eligibleCourses.length})
                      </h4>
                      <button
                        type="button"
                        className="td-onboarding-toggle-all"
                        onClick={toggleAllCourses}
                      >
                        {selectedCourses.size === result.eligibleCourses.length ? "Deselect all" : "Select all"}
                      </button>
                    </header>
                    <div className="td-onboarding-course-list__content">
                      {result.eligibleCourses.map((course, index) => {
                        const inputId = `eligible-course-${index}`;
                        const isSelected = selectedCourses.has(course.code);
                        return (
                          <label key={course.code + index} htmlFor={inputId} className={`td-onboarding-course${isSelected ? " is-selected" : ""}`}>
                            <input
                              id={inputId}
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleCourse(course.code)}
                              tabIndex={-1}
                              aria-hidden="true"
                            />
                            <div className="td-onboarding-course__info">
                              <span className="td-onboarding-course__code">{course.code}</span>
                              {course.title ? (
                                <span className="td-onboarding-course__title">{course.title}</span>
                              ) : null}
                            </div>
                            <div className="td-onboarding-course__meta">
                              <span className="td-onboarding-course__grade">{course.grade}</span>
                              <span className={confidenceClassMap[course.confidence]}>{course.confidence}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </section>
                ) : null}

                {result.nonEligibleCourses?.length ? (
                  <section className="td-onboarding-course-list td-onboarding-course-list--warning">
                    <header className="td-onboarding-course-list__header">
                      <h4>
                        <XCircle aria-hidden="true" /> Not eligible ({result.nonEligibleCourses.length})
                      </h4>
                    </header>
                    <div className="td-onboarding-course-list__content">
                      {result.nonEligibleCourses.map((course, index) => (
                        <div key={course.code + index} className="td-onboarding-course td-onboarding-course--warning">
                          <div className="td-onboarding-course__info">
                            <span className="td-onboarding-course__code">{course.code}</span>
                            {course.title ? (
                              <span className="td-onboarding-course__title">{course.title}</span>
                            ) : null}
                          </div>
                          <div className="td-onboarding-course__meta">
                            <span className="td-onboarding-course__grade">{course.grade}</span>
                          </div>
                          <p className="td-onboarding-course__reason">
                            <AlertCircle aria-hidden="true" /> {course.reason}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>
            ) : (
              <div className="td-onboarding-modal__empty">No results available.</div>
            )}

            <footer className="td-onboarding-modal__footer">
              <div className="td-onboarding-modal__selection">
                <span>{selectedCourses.size} course{selectedCourses.size === 1 ? "" : "s"} selected</span>
              </div>
              <div className="td-onboarding-modal__actions">
                <button type="button" className="td-onboarding-modal__secondary" onClick={closeModal}>
                  Close
                </button>
                <button
                  type="button"
                  className="td-onboarding-modal__primary"
                  onClick={addSelectedCoursesToProfile}
                  disabled={selectedCourses.size === 0 || addingCourses}
                >
                  {addingCourses ? "Adding..." : `Add ${selectedCourses.size} course${selectedCourses.size === 1 ? "" : "s"}`}
                </button>
              </div>
            </footer>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default TranscriptUploader;
