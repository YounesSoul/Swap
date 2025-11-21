import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  Clock,
  GraduationCap,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Star,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import DashboardNavigation from "@/components/dashboard/DashboardNavigation";
import { getApiBase, upsertUser } from "@/lib/api";
import { useSwap, type SessionItem, type SwapState } from "@/lib/store";
import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";
import "@/styles/profile.scss";

type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";

type ProfileFormState = {
  name: string;
  university: string;
  timezone: string;
};

type CourseGrade = "A+" | "A" | "A-" | "B+" | "B";

type TimeSlot = {
  id: string;
  type: "course" | "skill";
  courseCode?: string | null;
  skillName?: string | null;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  sessionType?: "ONLINE" | "FACE_TO_FACE";
  isActive?: boolean;
};

const skillLevels: Array<{ value: SkillLevel; label: string }> = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "EXPERT", label: "Expert" },
];

const courseGrades: Array<{ value: CourseGrade; label: string }> = [
  { value: "A+", label: "A+" },
  { value: "A", label: "A" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B", label: "B" },
];

const isCompleted = (status?: string | null) => {
  const value = status?.toLowerCase?.() ?? "";
  return value === "done" || value === "completed";
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useSupabaseAuth();
  const me = useSwap((state: SwapState) => state.me);
  const setMe = useSwap((state: SwapState) => state.setMe);
  const seed = useSwap((state: SwapState) => state.seed);
  const mySkills = useSwap((state: SwapState) => state.mySkills);
  const myCourses = useSwap((state: SwapState) => state.myCourses);
  const tokenBalance = useSwap((state: SwapState) => state.tokenBalance);
  const sessions = useSwap((state: SwapState) => state.sessions);
  const addSkill = useSwap((state: SwapState) => state.addSkill);
  const removeSkill = useSwap((state: SwapState) => state.removeSkill);
  const addCourse = useSwap((state: SwapState) => state.addCourse);
  const removeCourse = useSwap((state: SwapState) => state.removeCourse);
  const isSeeded = useSwap((state: SwapState) => state.isSeeded);

  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    name: me?.name ?? "",
    university: me?.university ?? "",
    timezone: me?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [skillInput, setSkillInput] = useState("");
  const [skillLevel, setSkillLevel] = useState<SkillLevel>("ADVANCED");
  const [skillBusy, setSkillBusy] = useState(false);
  const [skillPendingRemove, setSkillPendingRemove] = useState<string | null>(null);

  const [courseCode, setCourseCode] = useState("");
  const [courseGrade, setCourseGrade] = useState<CourseGrade>("A");
  const [courseBusy, setCourseBusy] = useState(false);
  const [coursePendingRemove, setCoursePendingRemove] = useState<string | null>(null);

  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [transcriptBusy, setTranscriptBusy] = useState(false);

  const [availability, setAvailability] = useState<TimeSlot[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [slotForm, setSlotForm] = useState<{
    type: "course" | "skill";
    courseCode: string;
    skillName: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    sessionType: "ONLINE" | "FACE_TO_FACE";
  }>({
    type: "course",
    courseCode: "",
    skillName: "",
    dayOfWeek: "MONDAY",
    startTime: "",
    endTime: "",
    sessionType: "ONLINE",
  });
  const [slotBusy, setSlotBusy] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/signin?callbackUrl=${encodeURIComponent("/profile")}`);
    }
  }, [authLoading, navigate, user]);

  useEffect(() => {
    setProfileForm({
      name: me?.name ?? "",
      university: me?.university ?? "",
      timezone: me?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }, [me?.name, me?.timezone, me?.university]);

  useEffect(() => {
    if (!me?.email) {
      setAvailability([]);
      return;
    }

    const apiBase = getApiBase();
    if (!apiBase) {
      setAvailability([]);
      return;
    }

    let cancelled = false;
    const load = async () => {
      setAvailabilityLoading(true);
      try {
        const response = await fetch(`${apiBase}/timeslots/my-slots`, {
          headers: { "x-user-email": me.email },
        });
        if (!response.ok) {
          throw new Error("Failed to load time slots");
        }
        const data = (await response.json()) as TimeSlot[];
        if (!cancelled) {
          setAvailability(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch availability", error);
        if (!cancelled) {
          setAvailability([]);
        }
      } finally {
        if (!cancelled) {
          setAvailabilityLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [me?.email]);

  const handleProfileSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!me?.email) {
      toast.error("Sign in to update your profile.");
      return;
    }

    setSavingProfile(true);
    try {
      const response = await upsertUser({
        email: me.email,
        name: profileForm.name || undefined,
        university: profileForm.university || undefined,
        timezone: profileForm.timezone || undefined,
        image: me?.image,
      });

      if (!response.ok) {
        toast.error("Could not update your profile right now.");
        return;
      }

      setMe({
        id: me.id,
        name: profileForm.name || me.name || "",
        email: me.email,
        university: profileForm.university || me.university,
        timezone: profileForm.timezone || me.timezone,
        image: me.image,
      });

      await seed(me.email);
      toast.success("Profile updated");
    } catch (error) {
      console.error("Failed to update profile", error);
      toast.error("Something went wrong while saving.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSkillSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = skillInput.trim();
    if (!value) {
      toast.error("Add a skill name first.");
      return;
    }

    setSkillBusy(true);
    try {
      await addSkill(value, skillLevel);
      setSkillInput("");
      toast.success("Skill added");
    } catch (error) {
      console.error("Failed to add skill", error);
      toast.error("Could not add this skill.");
    } finally {
      setSkillBusy(false);
    }
  };

  const handleSkillRemove = async (name: string) => {
    setSkillPendingRemove(name);
    try {
      await removeSkill(name);
      toast.info(`Removed ${name}`);
    } catch (error) {
      console.error("Failed to remove skill", error);
      toast.error("Could not remove that skill.");
    } finally {
      setSkillPendingRemove(null);
    }
  };

  const handleCourseSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = courseCode.trim().toUpperCase();
    if (!value) {
      toast.error("Enter a course code first.");
      return;
    }

    setCourseBusy(true);
    try {
      await addCourse(value, courseGrade);
      setCourseCode("");
      toast.success("Course added");
    } catch (error) {
      console.error("Failed to add course", error);
      toast.error("Could not add that course.");
    } finally {
      setCourseBusy(false);
    }
  };

  const handleCourseRemove = async (code: string) => {
    setCoursePendingRemove(code);
    try {
      await removeCourse(code);
      toast.info(`Removed ${code}`);
    } catch (error) {
      console.error("Failed to remove course", error);
      toast.error("Could not remove that course.");
    } finally {
      setCoursePendingRemove(null);
    }
  };

  const handleTranscriptUpload = async () => {
    if (!transcriptFile) {
      toast.error("Choose a PDF transcript first.");
      return;
    }
    if (!me?.email) {
      toast.error("Sign in to upload transcripts.");
      return;
    }

    const apiBase = getApiBase();
    if (!apiBase) {
      toast.error("Transcript upload is not available right now.");
      return;
    }

    setTranscriptBusy(true);
    try {
      // Convert file to base64 to bypass Railway proxy restrictions
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(transcriptFile);
      });
      
      const base64Data = await base64Promise;
      
      const response = await fetch(`${apiBase}/transcripts/upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: me.email,
          filename: transcriptFile.name,
          fileData: base64Data,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        toast.error(data?.message ?? "Could not process your transcript.");
        return;
      }

      const total = data?.eligibleCourses?.length ?? 0;
      toast.success(total ? `Added ${total} course${total === 1 ? "" : "s"} from your transcript.` : "Transcript scanned successfully.");
      await seed(me.email);
      setTranscriptFile(null);
    } catch (error) {
      console.error("Transcript upload failed", error);
      toast.error("Upload failed. Try again later.");
    } finally {
      setTranscriptBusy(false);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    const apiBase = getApiBase();
    if (!apiBase || !me?.email) {
      toast.error("Cannot delete time slot right now.");
      return;
    }

    try {
      const response = await fetch(`${apiBase}/timeslots/${slotId}`, {
        method: "DELETE",
        headers: {
          "x-user-email": me.email,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete time slot");
      }

      setAvailability((prev) => prev.filter((slot) => slot.id !== slotId));
      toast.success("Time slot removed");
    } catch (error) {
      console.error("Failed to delete time slot", error);
      toast.error("Could not delete that time slot");
    }
  };

  const handleAddSlot = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const apiBase = getApiBase();
    if (!apiBase || !me?.email) {
      toast.error("Cannot add time slot right now.");
      return;
    }

    setSlotBusy(true);
    try {
      const payload = {
        type: slotForm.type,
        courseCode: slotForm.type === "course" ? slotForm.courseCode : undefined,
        skillName: slotForm.type === "skill" ? slotForm.skillName : undefined,
        dayOfWeek: slotForm.dayOfWeek,
        startTime: slotForm.startTime,
        endTime: slotForm.endTime,
        sessionType: slotForm.sessionType,
      };

      const response = await fetch(`${apiBase}/timeslots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": me.email,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create time slot");
      }

      const newSlot = (await response.json()) as TimeSlot;
      setAvailability((prev) => [...prev, newSlot]);
      setShowAddSlotModal(false);
      setSlotForm({
        type: "course",
        courseCode: "",
        skillName: "",
        dayOfWeek: "MONDAY",
        startTime: "",
        endTime: "",
        sessionType: "ONLINE",
      });
      toast.success("Time slot added");
    } catch (error) {
      console.error("Failed to create time slot", error);
      toast.error("Could not add that time slot");
    } finally {
      setSlotBusy(false);
    }
  };

  const stats = useMemo(() => {
    const totalSessions = sessions?.length ?? 0;
    const completedSessions = sessions?.filter((entry: SessionItem) => isCompleted(entry.status)).length ?? 0;
    const upcomingSessions = sessions?.filter((entry: SessionItem) => !isCompleted(entry.status) && entry.startAt).length ?? 0;
    return {
      skills: mySkills.length,
      courses: myCourses.length,
      tokens: tokenBalance,
      completedSessions,
      totalSessions,
      upcomingSessions,
    };
  }, [myCourses.length, mySkills.length, sessions, tokenBalance]);

  const upcomingSessions = useMemo(() => {
    return (sessions ?? [])
      .filter((session) => !isCompleted(session.status) && session.startAt)
      .sort((a, b) => new Date(a.startAt ?? 0).getTime() - new Date(b.startAt ?? 0).getTime())
      .slice(0, 3);
  }, [sessions]);

  const loadingPage = authLoading || (!!user && !isSeeded);

  const body = loadingPage ? (
    <section className="td-profile td-profile--loading" aria-live="polite">
      <div className="td-profile__loading-card">
        <span className="td-profile__spinner" aria-hidden="true" />
        <p>Getting your profile ready…</p>
      </div>
    </section>
  ) : !me ? (
    <section className="td-profile td-profile--empty">
      <div className="td-profile__empty-card">
        <h1>Sign in to view your profile</h1>
        <p>We could not detect an account. Please sign in and try again.</p>
      </div>
    </section>
  ) : (
    <main className="td-profile" role="main">
      <div className="container">
        <section className="td-profile__hero">
          <div className="td-profile__headline">
            <span className="td-profile__badge">Personal space</span>
            <h1 className="td-profile__title">Shape how the community sees you</h1>
            <p className="td-profile__subtitle">
              Update your details, highlight what you can teach, and keep your transcript in sync so learners can discover you faster.
            </p>
          </div>
          <form className="td-profile__form" onSubmit={handleProfileSubmit}>
            <fieldset disabled={savingProfile}>
              <legend className="td-profile__form-title">Profile details</legend>
              <label className="td-profile__label" htmlFor="profile-name">
                Name
                <input
                  id="profile-name"
                  type="text"
                  value={profileForm.name}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.currentTarget.value }))}
                  placeholder="Your full name"
                />
              </label>
              <label className="td-profile__label" htmlFor="profile-university">
                University
                <input
                  id="profile-university"
                  type="text"
                  value={profileForm.university}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, university: event.currentTarget.value }))}
                  placeholder="University"
                />
              </label>
              <label className="td-profile__label" htmlFor="profile-timezone">
                Timezone
                <input
                  id="profile-timezone"
                  type="text"
                  value={profileForm.timezone}
                  onChange={(event) => setProfileForm((prev) => ({ ...prev, timezone: event.currentTarget.value }))}
                  placeholder="Africa/Casablanca"
                />
              </label>
              <button type="submit" className="td-btn td-btn-lg td-profile__submit" disabled={savingProfile}>
                {savingProfile ? (
                  <>
                    <Loader2 size={16} className="td-profile__spinner" /> Saving…
                  </>
                ) : (
                  <>
                    <Pencil size={16} aria-hidden="true" /> Save changes
                  </>
                )}
              </button>
            </fieldset>
          </form>
        </section>

        <section className="td-profile__stats" aria-label="Profile quick stats">
          <article className="td-profile__stat-card">
            <span className="td-profile__stat-icon td-profile__stat-icon--skills" aria-hidden="true">
              <Award size={20} />
            </span>
            <div>
              <p className="td-profile__stat-label">Skills you can teach</p>
              <p className="td-profile__stat-value">{stats.skills}</p>
            </div>
          </article>
          <article className="td-profile__stat-card">
            <span className="td-profile__stat-icon td-profile__stat-icon--courses" aria-hidden="true">
              <GraduationCap size={20} />
            </span>
            <div>
              <p className="td-profile__stat-label">Courses aced</p>
              <p className="td-profile__stat-value">{stats.courses}</p>
            </div>
          </article>
          <article className="td-profile__stat-card">
            <span className="td-profile__stat-icon td-profile__stat-icon--tokens" aria-hidden="true">
              <Star size={20} />
            </span>
            <div>
              <p className="td-profile__stat-label">Available tokens</p>
              <p className="td-profile__stat-value">{stats.tokens}</p>
            </div>
          </article>
          <article className="td-profile__stat-card">
            <span className="td-profile__stat-icon td-profile__stat-icon--sessions" aria-hidden="true">
              <TrendingUp size={20} />
            </span>
            <div>
              <p className="td-profile__stat-label">Sessions completed</p>
              <p className="td-profile__stat-value">{stats.completedSessions}</p>
            </div>
          </article>
        </section>

        <section className="td-profile__grid">
          <article className="td-profile-card" aria-label="Skills manager">
            <header className="td-profile-card__head">
              <h2>Skills you can teach</h2>
              <span className="td-profile-card__chip">{mySkills.length} skill{mySkills.length === 1 ? "" : "s"}</span>
            </header>
            {mySkills.length === 0 ? (
              <div className="td-profile-card__empty">
                <p>Add your first skill so peers know what to request.</p>
              </div>
            ) : (
              <ul className="td-profile-card__chips">
                {mySkills.map((skill) => (
                  <li key={skill}>
                    <button
                      type="button"
                      className="td-profile-card__chip-button"
                      onClick={() => void handleSkillRemove(skill)}
                      disabled={skillPendingRemove === skill}
                    >
                      <span>{skill}</span>
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <form className="td-profile-card__form" onSubmit={handleSkillSubmit}>
              <div className="td-profile-card__form-row">
                <label htmlFor="skill-name" className="td-profile-card__form-label">
                  Skill name
                  <input
                    id="skill-name"
                    type="text"
                    value={skillInput}
                    onChange={(event) => setSkillInput(event.currentTarget.value)}
                    placeholder="e.g. Data Structures"
                  />
                </label>
                <label htmlFor="skill-level" className="td-profile-card__form-label">
                  Level
                  <select
                    id="skill-level"
                    value={skillLevel}
                    onChange={(event) => setSkillLevel(event.currentTarget.value as SkillLevel)}
                  >
                    {skillLevels.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button type="submit" className="td-btn td-btn-lg" disabled={skillBusy}>
                {skillBusy ? (
                  <>
                    <Loader2 size={16} className="td-profile__spinner" /> Adding…
                  </>
                ) : (
                  <>
                    <Plus size={16} aria-hidden="true" /> Add skill
                  </>
                )}
              </button>
            </form>
          </article>

          <article className="td-profile-card" aria-label="Courses manager">
            <header className="td-profile-card__head">
              <h2>Courses you aced</h2>
              <span className="td-profile-card__chip">{myCourses.length} course{myCourses.length === 1 ? "" : "s"}</span>
            </header>
            {myCourses.length === 0 ? (
              <div className="td-profile-card__empty">
                <p>Upload a transcript or add courses manually to boost your profile.</p>
              </div>
            ) : (
              <ul className="td-profile-card__chips">
                {myCourses.map((course) => (
                  <li key={course.courseCode}>
                    <button
                      type="button"
                      className="td-profile-card__chip-button"
                      onClick={() => void handleCourseRemove(course.courseCode)}
                      disabled={coursePendingRemove === course.courseCode}
                    >
                      <span>{course.courseCode}</span>
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <form className="td-profile-card__form" onSubmit={handleCourseSubmit}>
              <div className="td-profile-card__form-row">
                <label htmlFor="course-code" className="td-profile-card__form-label">
                  Course code
                  <input
                    id="course-code"
                    type="text"
                    value={courseCode}
                    onChange={(event) => setCourseCode(event.currentTarget.value)}
                    placeholder="e.g. CS101"
                  />
                </label>
                <label htmlFor="course-grade" className="td-profile-card__form-label">
                  Grade
                  <select
                    id="course-grade"
                    value={courseGrade}
                    onChange={(event) => setCourseGrade(event.currentTarget.value as CourseGrade)}
                  >
                    {courseGrades.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button type="submit" className="td-btn td-btn-lg" disabled={courseBusy}>
                {courseBusy ? (
                  <>
                    <Loader2 size={16} className="td-profile__spinner" /> Adding…
                  </>
                ) : (
                  <>
                    <Plus size={16} aria-hidden="true" /> Add course
                  </>
                )}
              </button>
            </form>
          </article>

          <article className="td-profile-card" aria-label="Transcript uploader">
            <header className="td-profile-card__head">
              <h2>Import from transcript</h2>
              <span className="td-profile-card__chip td-profile-card__chip--soft">Optional</span>
            </header>
            <p className="td-profile-card__text">
              Upload a PDF transcript and we will automatically pull in A / A+ courses. Review the output before saving to make sure everything looks right.
            </p>
            <div className="td-profile-card__upload">
              <label htmlFor="transcript-upload" className="td-profile-card__upload-label">
                <input
                  id="transcript-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => setTranscriptFile(event.currentTarget.files?.[0] ?? null)}
                />
                <span>{transcriptFile ? transcriptFile.name : "Choose PDF"}</span>
              </label>
              <button
                type="button"
                className="td-btn td-btn-lg"
                onClick={handleTranscriptUpload}
                disabled={transcriptBusy}
              >
                {transcriptBusy ? (
                  <>
                    <Loader2 size={16} className="td-profile__spinner" /> Uploading…
                  </>
                ) : (
                  <>
                    <Plus size={16} aria-hidden="true" /> Upload & scan
                  </>
                )}
              </button>
            </div>
            <p className="td-profile-card__hint">Tip: upload a text-based PDF for the best extraction accuracy.</p>
          </article>

          <article className="td-profile-card" aria-label="Availability preview">
            <header className="td-profile-card__head">
              <h2>Teaching availability</h2>
              <span className="td-profile-card__chip td-profile-card__chip--soft">
                {availabilityLoading ? "Loading" : `${availability.length} slot${availability.length === 1 ? "" : "s"}`}
              </span>
            </header>
            {availabilityLoading ? (
              <div className="td-profile-card__empty">
                <span className="td-profile__spinner" aria-hidden="true" />
                <p>Fetching your open slots…</p>
              </div>
            ) : availability.length === 0 ? (
              <div className="td-profile-card__empty">
                <p>No availability added yet. Add slots from the Sessions page so learners can book you instantly.</p>
              </div>
            ) : (
              <ul className="td-profile-card__list">
                {availability.map((slot) => (
                  <li key={slot.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <p className="td-profile-card__list-title" style={{ margin: 0 }}>{slot.type === "course" ? slot.courseCode : slot.skillName}</p>
                        {slot.sessionType && (
                          <span 
                            className="td-profile-card__chip td-profile-card__chip--soft" 
                            style={{ fontSize: "11px", padding: "2px 8px" }}
                          >
                            {slot.sessionType === "ONLINE" ? "🌐 Online" : "📍 Face-to-face"}
                          </span>
                        )}
                      </div>
                      <p className="td-profile-card__list-subtitle" style={{ margin: "4px 0 0" }}>{slot.dayOfWeek}</p>
                      <div className="td-profile-card__list-meta">
                        <Clock size={14} aria-hidden="true" />
                        <span>
                          {slot.startTime} — {slot.endTime}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="td-profile-card__chip-button"
                      onClick={() => void handleDeleteSlot(slot.id)}
                      aria-label={`Delete ${slot.type === "course" ? slot.courseCode : slot.skillName} time slot`}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              className="td-btn td-btn-outline"
              style={{ marginTop: "1rem", width: "100%" }}
              onClick={() => setShowAddSlotModal(true)}
            >
              <Plus size={16} aria-hidden="true" /> Add time slot
            </button>
          </article>

          <article className="td-profile-card" aria-label="Upcoming sessions">
            <header className="td-profile-card__head">
              <h2>Upcoming sessions</h2>
              <span className="td-profile-card__chip td-profile-card__chip--soft">{upcomingSessions.length}</span>
            </header>
            {upcomingSessions.length === 0 ? (
              <div className="td-profile-card__empty">
                <p>No sessions scheduled. Explore matches to plan your next exchange.</p>
              </div>
            ) : (
              <ul className="td-profile-card__list">
                {upcomingSessions.map((session) => (
                  <li key={session.id}>
                    <div>
                      <p className="td-profile-card__list-title">{session.courseCode}</p>
                      <p className="td-profile-card__list-subtitle">{session.teacher?.email === me.email ? "Teaching" : "Learning"}</p>
                    </div>
                    <div className="td-profile-card__list-meta">
                      <MapPin size={14} aria-hidden="true" />
                      <span>{new Date(session.startAt ?? 0).toLocaleString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>
      </div>

      {/* Add Time Slot Modal */}
      {showAddSlotModal && (
        <div className="td-modal-overlay" onClick={() => setShowAddSlotModal(false)}>
          <div className="td-modal" onClick={(e) => e.stopPropagation()}>
            <header className="td-modal__header">
              <h2>Add teaching time slot</h2>
              <button type="button" onClick={() => setShowAddSlotModal(false)} aria-label="Close">
                ×
              </button>
            </header>
            <form onSubmit={handleAddSlot} className="td-modal__form">
              <label>
                Teaching
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className={slotForm.type === "course" ? "td-btn td-btn-sm" : "td-btn td-btn-outline td-btn-sm"}
                    onClick={() => setSlotForm((prev) => ({ ...prev, type: "course" }))}
                  >
                    Course
                  </button>
                  <button
                    type="button"
                    className={slotForm.type === "skill" ? "td-btn td-btn-sm" : "td-btn td-btn-outline td-btn-sm"}
                    onClick={() => setSlotForm((prev) => ({ ...prev, type: "skill" }))}
                  >
                    Skill
                  </button>
                </div>
              </label>

              {slotForm.type === "course" ? (
                <label>
                  Course code
                  <select
                    value={slotForm.courseCode}
                    onChange={(e) => setSlotForm((prev) => ({ ...prev, courseCode: e.target.value }))}
                    required
                  >
                    <option value="">Select a course</option>
                    {myCourses.map((course) => (
                      <option key={course.courseCode} value={course.courseCode}>
                        {course.courseCode}
                      </option>
                    ))}
                  </select>
                  {myCourses.length === 0 && (
                    <p style={{ fontSize: "12px", color: "rgba(15, 23, 42, 0.6)", margin: "4px 0 0" }}>
                      Add courses to your profile first
                    </p>
                  )}
                </label>
              ) : (
                <label>
                  Skill name
                  <select
                    value={slotForm.skillName}
                    onChange={(e) => setSlotForm((prev) => ({ ...prev, skillName: e.target.value }))}
                    required
                  >
                    <option value="">Select a skill</option>
                    {mySkills.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                  {mySkills.length === 0 && (
                    <p style={{ fontSize: "12px", color: "rgba(15, 23, 42, 0.6)", margin: "4px 0 0" }}>
                      Add skills to your profile first
                    </p>
                  )}
                </label>
              )}

              <label>
                Day of week
                <select
                  value={slotForm.dayOfWeek}
                  onChange={(e) => setSlotForm((prev) => ({ ...prev, dayOfWeek: e.target.value }))}
                >
                  <option value="MONDAY">Monday</option>
                  <option value="TUESDAY">Tuesday</option>
                  <option value="WEDNESDAY">Wednesday</option>
                  <option value="THURSDAY">Thursday</option>
                  <option value="FRIDAY">Friday</option>
                  <option value="SATURDAY">Saturday</option>
                  <option value="SUNDAY">Sunday</option>
                </select>
              </label>

              <label>
                Start time
                <input
                  type="time"
                  value={slotForm.startTime}
                  onChange={(e) => {
                    const startTime = e.target.value;
                    // Calculate end time (1 hour later)
                    let endTime = "";
                    if (startTime) {
                      const [hours, minutes] = startTime.split(":").map(Number);
                      const endHours = (hours + 1) % 24;
                      endTime = `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
                    }
                    setSlotForm((prev) => ({ ...prev, startTime, endTime }));
                  }}
                  required
                />
                <p style={{ fontSize: "12px", color: "rgba(15, 23, 42, 0.6)", margin: "4px 0 0" }}>
                  Session duration: 1 hour
                </p>
              </label>

              <label>
                Session type
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    className={slotForm.sessionType === "ONLINE" ? "td-btn td-btn-sm" : "td-btn td-btn-outline td-btn-sm"}
                    onClick={() => setSlotForm((prev) => ({ ...prev, sessionType: "ONLINE" }))}
                  >
                    🌐 Online (Teams)
                  </button>
                  <button
                    type="button"
                    className={slotForm.sessionType === "FACE_TO_FACE" ? "td-btn td-btn-sm" : "td-btn td-btn-outline td-btn-sm"}
                    onClick={() => setSlotForm((prev) => ({ ...prev, sessionType: "FACE_TO_FACE" }))}
                  >
                    📍 Face-to-face
                  </button>
                </div>
              </label>

              <div className="td-modal__actions">
                <button
                  type="button"
                  className="td-btn td-btn-outline"
                  onClick={() => setShowAddSlotModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="td-btn td-btn-lg" 
                  disabled={slotBusy || (slotForm.type === "course" ? myCourses.length === 0 : mySkills.length === 0)}
                >
                  {slotBusy ? (
                    <>
                      <Loader2 size={16} className="td-profile__spinner" /> Adding…
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Add slot
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );

  return (
    <>
      <DashboardNavigation />
      {body}
    </>
  );
};

export default Profile;
