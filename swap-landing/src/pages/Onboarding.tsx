import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Check, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-toastify";
import Select from "react-select";
import { useSupabaseAuth } from "@/providers/SupabaseAuthProvider";
import { useSwap, type SwapState } from "@/lib/store";
import TranscriptUploader from "@/components/onboarding/TranscriptUploader";
import { SKILL_OPTIONS, COURSE_PREFIX_OPTIONS } from "@/data/skills";
import "@/styles/onboarding.scss";

type SkillOption = { value: string; label: string; category?: string };
type CourseOption = { value: string; label: string };

type Interest = { type: "skill" | "course"; name: string };

type SectionKey = "teaching" | "interests" | null;

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useSupabaseAuth();

  const me = useSwap((state: SwapState) => state.me);
  const saveOnboarding = useSwap((state: SwapState) => state.saveOnboarding);
  const mySkills = useSwap((state: SwapState) => state.mySkills);
  const myCourses = useSwap((state: SwapState) => state.myCourses);
  const myInterests = useSwap((state: SwapState) => state.myInterests);
  const onboarded = useSwap((state: SwapState) => state.onboarded);
  const isSeeded = useSwap((state: SwapState) => state.isSeeded);

  const [selectedTeachingSkills, setSelectedTeachingSkills] = useState<SkillOption[]>([]);
  const [selectedLearningSkills, setSelectedLearningSkills] = useState<SkillOption[]>([]);
  const [selectedLearningCourses, setSelectedLearningCourses] = useState<CourseOption[]>([]);
  const [expandedSection, setExpandedSection] = useState<SectionKey>("teaching");
  const [allowNavigation, setAllowNavigation] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/signin?callbackUrl=${encodeURIComponent("/onboarding")}`);
    }
  }, [authLoading, navigate, user]);

  useEffect(() => {
    if (!authLoading && user && isSeeded && onboarded) {
      setAllowNavigation(true);
      navigate("/matches", { replace: true });
    }
  }, [authLoading, user, isSeeded, onboarded, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!allowNavigation) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [allowNavigation]);

  useEffect(() => {
    // Initialize teaching skills from store
    if (mySkills.length > 0 && selectedTeachingSkills.length === 0) {
      const skills = mySkills.map((skill) => ({ value: skill, label: skill }));
      setSelectedTeachingSkills(skills);
    }
  }, [mySkills, selectedTeachingSkills.length]);

  useEffect(() => {
    // Initialize learning interests from store
    if (myInterests.length > 0 && selectedLearningSkills.length === 0 && selectedLearningCourses.length === 0) {
      const skills = myInterests
        .filter((i) => i.type === "skill")
        .map((i) => ({ value: i.name, label: i.name }));
      const courses = myInterests
        .filter((i) => i.type === "course")
        .map((i) => ({ value: i.name, label: i.name }));
      setSelectedLearningSkills(skills);
      setSelectedLearningCourses(courses);
    }
  }, [myInterests, selectedLearningSkills.length, selectedLearningCourses.length]);

  const toggleSection = (section: SectionKey) => {
    setExpandedSection((current) => (current === section ? null : section));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!me?.email) {
      toast.error("Please sign in to complete onboarding.");
      return;
    }

    const skillEntries = selectedTeachingSkills.map((s) => s.value);
    const courseCodes = myCourses.map((course) => course.courseCode);
    
    // Convert selected learning items to Interest format
    const learningInterests: Interest[] = [
      ...selectedLearningSkills.map((s) => ({ type: "skill" as const, name: s.value })),
      ...selectedLearningCourses.map((c) => ({ type: "course" as const, name: c.value })),
    ];

    const ok = await saveOnboarding(me.name, skillEntries, courseCodes, learningInterests);
    if (ok) {
      setAllowNavigation(true);
      toast.success("Onboarding complete! Redirecting you to matches.");
      navigate("/matches", { replace: true });
    }
  };

  const isTeachingComplete = selectedTeachingSkills.length > 0 || myCourses.length > 0;
  const isInterestsComplete = selectedLearningSkills.length > 0 || selectedLearningCourses.length > 0;
  const disableSubmit = selectedTeachingSkills.length === 0 && myCourses.length === 0;

  const submitHelper = disableSubmit ? "Please add at least one skill or course to continue." : "";

  const isLoading = authLoading || (!!user && !isSeeded);

  if (isLoading) {
    return (
      <section className="td-onboarding td-onboarding--loading">
        <div className="td-onboarding__loading">
          <span className="td-onboarding__spinner" aria-hidden="true" />
          <p>Loading onboarding...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="td-onboarding">
      <div className="td-onboarding__container">
        <header className="td-onboarding__header">
          <h1 className="td-onboarding__title">Welcome to Swap</h1>
          <p className="td-onboarding__subtitle">
            A few quick steps so we can match you with the best partners to teach and learn alongside you.
          </p>
        </header>

        <form className="td-onboarding__form" onSubmit={handleSubmit}>
          <article className={`td-onboarding-card${expandedSection === "teaching" ? " is-open" : ""}`}>
            <button
              type="button"
              className="td-onboarding-card__toggle"
              onClick={() => toggleSection("teaching")}
            >
              <div className="td-onboarding-card__leading">
                <span className="td-onboarding-card__icon" aria-hidden="true">
                  <BookOpen />
                </span>
                <div>
                  <h2 className="td-onboarding-card__title">Set up your teaching profile</h2>
                  <p className="td-onboarding-card__description">Add the skills and courses you feel confident teaching.</p>
                </div>
              </div>
              <div className="td-onboarding-card__status">
                {isTeachingComplete ? (
                  <span className="td-onboarding-pill td-onboarding-pill--success">
                    <Check aria-hidden="true" /> Complete
                  </span>
                ) : null}
                <span className="td-onboarding-card__chevron" aria-hidden="true">
                  {expandedSection === "teaching" ? <ChevronUp /> : <ChevronDown />}
                </span>
              </div>
            </button>

            {expandedSection === "teaching" ? (
              <div className="td-onboarding-card__content">
                <div className="td-onboarding-section">
                  <label className="td-onboarding-label" htmlFor="teaching-skills">
                    Skills you can teach
                  </label>
                  <Select
                    id="teaching-skills"
                    isMulti
                    options={SKILL_OPTIONS}
                    value={selectedTeachingSkills}
                    onChange={(selected) => setSelectedTeachingSkills(selected as SkillOption[])}
                    placeholder="Search and select skills..."
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '48px',
                        borderRadius: '12px',
                        border: '1px solid rgba(15, 23, 42, 0.15)',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: 'rgba(37, 99, 235, 0.3)',
                        },
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        borderRadius: '6px',
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: '#1d4ed8',
                        fontWeight: 500,
                      }),
                    }}
                  />
                  <p className="td-onboarding-helper">Search from 100+ skills. Levels default to Advanced. You can fine-tune them later.</p>
                </div>

                <div className="td-onboarding-section">
                  <span className="td-onboarding-label">Courses with strong grades</span>
                  {myCourses.length ? (
                    <div className="td-onboarding-selection">
                      {myCourses.map((course) => (
                        <span key={course.courseCode} className="td-onboarding-selection__item">
                          {course.courseCode}
                          <span className="td-onboarding-selection__grade">{course.grade}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="td-onboarding-empty">
                      <BookOpen aria-hidden="true" />
                      <p>Upload your transcript to automatically detect A and A+ courses.</p>
                      <TranscriptUploader />
                    </div>
                  )}

                  {myCourses.length ? (
                    <div className="td-onboarding-uploader-inline">
                      <TranscriptUploader />
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </article>

          <article className={`td-onboarding-card${expandedSection === "interests" ? " is-open" : ""}`}>
            <button
              type="button"
              className="td-onboarding-card__toggle"
              onClick={() => toggleSection("interests")}
            >
              <div className="td-onboarding-card__leading">
                <span className="td-onboarding-card__icon" aria-hidden="true">
                  <BookOpen />
                </span>
                <div>
                  <h2 className="td-onboarding-card__title">Choose your learning interests</h2>
                  <p className="td-onboarding-card__description">Tell us what you would love to learn to get personal matches.</p>
                </div>
              </div>
              <div className="td-onboarding-card__status">
                {isInterestsComplete ? (
                  <span className="td-onboarding-pill td-onboarding-pill--info">
                    <Check aria-hidden="true" /> {selectedLearningSkills.length + selectedLearningCourses.length} selected
                  </span>
                ) : null}
                <span className="td-onboarding-card__chevron" aria-hidden="true">
                  {expandedSection === "interests" ? <ChevronUp /> : <ChevronDown />}
                </span>
              </div>
            </button>

            {expandedSection === "interests" ? (
              <div className="td-onboarding-card__content">
                <div className="td-onboarding-section">
                  <label className="td-onboarding-label" htmlFor="learning-skills">
                    Skills you want to learn
                  </label>
                  <Select
                    id="learning-skills"
                    isMulti
                    options={SKILL_OPTIONS}
                    value={selectedLearningSkills}
                    onChange={(selected) => setSelectedLearningSkills(selected as SkillOption[])}
                    placeholder="Search and select skills..."
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '48px',
                        borderRadius: '12px',
                        border: '1px solid rgba(15, 23, 42, 0.15)',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: 'rgba(37, 99, 235, 0.3)',
                        },
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: '6px',
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: '#4f46e5',
                        fontWeight: 500,
                      }),
                    }}
                  />
                  <p className="td-onboarding-helper">Select skills you're interested in learning from others</p>
                </div>

                <div className="td-onboarding-section">
                  <label className="td-onboarding-label" htmlFor="learning-courses">
                    Courses you want help with
                  </label>
                  <Select
                    id="learning-courses"
                    isMulti
                    options={COURSE_PREFIX_OPTIONS}
                    value={selectedLearningCourses}
                    onChange={(selected) => setSelectedLearningCourses(selected as CourseOption[])}
                    placeholder="Search and select course prefixes..."
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '48px',
                        borderRadius: '12px',
                        border: '1px solid rgba(15, 23, 42, 0.15)',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: 'rgba(37, 99, 235, 0.3)',
                        },
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '6px',
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: '#059669',
                        fontWeight: 500,
                      }),
                    }}
                  />
                  <p className="td-onboarding-helper">Select course subjects you need help with (e.g., CSC for Computer Science)</p>
                </div>

                {(selectedLearningSkills.length > 0 || selectedLearningCourses.length > 0) ? (
                  <div className="td-onboarding-section">
                    <span className="td-onboarding-label td-onboarding-label--small">
                      Your learning interests ({selectedLearningSkills.length + selectedLearningCourses.length})
                    </span>
                    <div className="td-onboarding-selection">
                      {selectedLearningSkills.map((skill) => (
                        <span key={`skill-${skill.value}`} className="td-onboarding-selection__item">
                          <span className="td-onboarding-selection__type">Skill</span>
                          {skill.label}
                        </span>
                      ))}
                      {selectedLearningCourses.map((course) => (
                        <span key={`course-${course.value}`} className="td-onboarding-selection__item">
                          <span className="td-onboarding-selection__type">Course</span>
                          {course.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </article>

          <div className="td-onboarding-notice" role="note">
            <span className="td-onboarding-notice__dot" aria-hidden="true" />
            <p>We keep your data secure and only use it to improve your Swap experience.</p>
          </div>

          <div className="td-onboarding-submit">
            <button type="submit" className="td-onboarding-submit__button" disabled={disableSubmit}>
              Complete setup and start learning
            </button>
            {submitHelper ? <p className="td-onboarding-submit__helper">{submitHelper}</p> : null}
          </div>
        </form>
      </div>
    </section>
  );
};

export default Onboarding;
