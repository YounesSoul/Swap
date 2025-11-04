import { create } from "zustand";
import {
  createRequest,
  acceptRequest as apiAccept,
  declineRequest as apiDecline,
  clearAnsweredRequests as apiClearAnswered,
  clearAllRequests as apiClearAll,
  getLedger,
  listSessions,
  listInbox,
  listSent,
  getTokens,
  completeSession as apiComplete,
  scheduleSession as apiSchedule,
  getProfile,
  saveOnboarding as apiSaveOnboarding,
  searchTeachers as apiSearchTeachers,
  getUserRatingStats,
  addSkill as apiAddSkill,
  removeSkill as apiRemoveSkill,
  addCourse as apiAddCourse,
  removeCourse as apiRemoveCourse,
} from "@/lib/api";
import { setupSessionReminders } from "@/lib/notifications";

export type Profile = {
  id: string;
  name: string;
  email: string;
  university?: string;
  timezone?: string;
  image?: string;
};

export type RequestItem = {
  id: string;
  fromUserId?: string;
  toUserId?: string;
  courseCode: string;
  minutes: number;
  note?: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELLED" | "EXPIRED";
  createdAt?: string;
};

export type SessionItem = {
  id: string;
  teacherId: string;
  learnerId: string;
  courseCode: string;
  minutes: number;
  status: "scheduled" | "done" | "completed";
  startAt?: string | null;
  endAt?: string | null;
  teacher?: { email?: string; name?: string | null };
  learner?: { email?: string; name?: string | null };
};

export type LedgerEntry = { id: string; delta: number; reason: string; createdAt?: string };
export type TokenEntry = { id: string; tokens: number; reason: string; createdAt?: string };

export type TeacherResult = {
  user: { id: string; name?: string | null; email: string; image?: string | null };
  skills?: { name: string; level: string }[];
  course?: { code: string; grade: string };
  ratingData?: { averageRating: number; totalRatings: number };
};

type StoreSet<T> = (partial: T | Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void;
type StoreGet<T> = () => T;

type State = {
  me: Profile | null;
  onboarded: boolean;
  mySkills: string[];
  myCourses: { courseCode: string; grade: string }[];
  myInterests: Array<{ type: "skill" | "course"; name: string }>;
  inbox: RequestItem[];
  sent: RequestItem[];
  sessions: SessionItem[];
  ledger: LedgerEntry[];
  tokens: TokenEntry[];
  tokenBalance: number;
  searchResults: TeacherResult[];
  isSeeded: boolean;

  setMe: (profile: Profile) => void;
  seed: (email: string) => Promise<void>;
  sendRequest: (
    toEmail: string,
    courseCode: string,
    minutes: number,
    note?: string
  ) => Promise<{ ok: boolean; error?: string }>;
  acceptRequest: (id: string) => Promise<void>;
  declineRequest: (id: string) => Promise<void>;
  clearAnsweredRequests: () => Promise<void>;
  clearAllRequests: () => Promise<void>;
  completeSession: (id: string) => Promise<void>;
  scheduleSession: (id: string, startAtISO: string) => Promise<void>;
  saveOnboarding: (
    name: string | undefined,
    skills: string[],
    courses: string[],
    interests?: Array<{ type: "skill" | "course"; name: string }>
  ) => Promise<boolean>;
  searchTeachers: (options: { skill?: string; course?: string }) => Promise<void>;
  addSkill: (
    name: string,
    level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT"
  ) => Promise<void>;
  removeSkill: (name: string) => Promise<void>;
  addCourse: (code: string, grade?: string) => Promise<void>;
  removeCourse: (code: string) => Promise<void>;
};

const swapStore = (set: StoreSet<State>, get: StoreGet<State>): State => ({
  me: null,
  onboarded: true,
  mySkills: [],
  myCourses: [],
  myInterests: [],
  inbox: [],
  sent: [],
  sessions: [],
  ledger: [],
  tokens: [],
  tokenBalance: 0,
  searchResults: [],
  isSeeded: false,

  setMe: (profile: Profile) => set({ me: profile }),

  seed: async (email: string) => {
    if (!email) {
      return;
    }

    set({ isSeeded: false });

    try {
      if (import.meta.env.DEV) {
        console.log("[swap-store] seeding", email);
      }
      const [profile, inbox, sent, ledger, sessions, tokens] = await Promise.all([
        getProfile(email),
        listInbox(email),
        listSent(email),
        getLedger(email),
        listSessions(email),
        getTokens(email),
      ]);

      const sessionList = sessions ?? [];

      set({
        onboarded: !!profile?.isOnboarded,
        mySkills: (profile?.userSkills ?? []).map((entry: any) => entry?.skill?.name).filter(Boolean),
        myCourses: (profile?.userCourses ?? []).map((course: any) => ({
          courseCode: course.courseCode,
          grade: course.grade,
        })),
        myInterests: (profile?.userInterests ?? []).map((interest: any) => ({
          type: interest.type,
          name: interest.name,
        })),
        inbox: inbox ?? [],
        sent: sent ?? [],
        ledger: ledger?.entries ?? [],
        sessions: sessionList,
        tokens: tokens?.entries ?? [],
        tokenBalance: tokens?.tokens ?? 0,
        isSeeded: true,
      });
      if (import.meta.env.DEV) {
        console.log("[swap-store] seeded", {
          inbox: (inbox ?? []).length,
          sent: (sent ?? []).length,
          sessions: sessionList.length,
          tokens: tokens?.tokens ?? 0,
        });
      }

      setupSessionReminders(sessionList);
    } catch (error) {
      console.error("Failed to seed Swap store", error);
      set({ isSeeded: true });
    }
  },

  sendRequest: async (toEmail: string, courseCode: string, minutes: number, note?: string) => {
    const me = get().me;
    if (!me) {
      return { ok: false, error: "Not signed in" };
    }

    const balance = get().tokenBalance ?? 0;
    if (balance < 1) {
      return { ok: false, error: "You need at least 1 token to send a request." };
    }

    if (toEmail.toLowerCase() === me.email.toLowerCase()) {
      return { ok: false, error: "You can't send a request to yourself" };
    }

    const result = await createRequest(me.email, toEmail, courseCode, minutes, note);
    if (result.ok && result.data) {
      set((state: State) => ({ sent: [result.data, ...state.sent] }));
      return { ok: true };
    }

    const message =
      result?.data?.message ?? result?.data?.error ?? "Could not send request.";
    return { ok: false, error: message };
  },

  acceptRequest: async (id: string) => {
    const me = get().me;
    if (!me) {
      return;
    }

    const result = await apiAccept(id, me.email);
    if (!result.ok) {
      window.alert(result?.data?.message ?? "Could not accept. The requester may have insufficient tokens.");
      return;
    }

    set((state: State) => ({
      inbox: state.inbox.map((request) =>
        request.id === id ? { ...request, status: "ACCEPTED" } : request
      ),
    }));

    const [ledger, sessions, tokens] = await Promise.all([
      getLedger(me.email),
      listSessions(me.email),
      getTokens(me.email),
    ]);

    const sessionList = sessions ?? [];

    set({
      ledger: ledger?.entries ?? [],
      sessions: sessionList,
      tokens: tokens?.entries ?? [],
      tokenBalance: tokens?.tokens ?? 0,
    });

    setupSessionReminders(sessionList);
  },

  declineRequest: async (id: string) => {
    const me = get().me;
    if (!me) {
      return;
    }

    const result = await apiDecline(id, me.email);
    if (result.ok) {
      set((state: State) => ({
        inbox: state.inbox.map((request) =>
          request.id === id ? { ...request, status: "DECLINED" } : request
        ),
      }));
    }
  },

  clearAnsweredRequests: async () => {
    const me = get().me;
    if (!me) {
      return;
    }

    const result = await apiClearAnswered(me.email);
    if (result.ok) {
      set((state: State) => ({
        inbox: state.inbox.filter(
          (request) => request.status !== "ACCEPTED" && request.status !== "DECLINED"
        ),
        sent: state.sent.filter(
          (request) => request.status !== "ACCEPTED" && request.status !== "DECLINED"
        ),
      }));
    }
  },

  clearAllRequests: async () => {
    const me = get().me;
    if (!me) {
      return;
    }

    const result = await apiClearAll(me.email);
    if (result.ok) {
      set({ inbox: [], sent: [] });
    }
  },

  completeSession: async (id: string) => {
    const me = get().me;
    if (!me) {
      return;
    }

    const result = await apiComplete(id, me.email);
    if (result.ok) {
      set((state: State) => ({
        sessions: state.sessions.filter((session) => session.id !== id),
      }));
      setupSessionReminders(get().sessions);

      const tokens = await getTokens(me.email);
      set({ tokens: tokens?.entries ?? [], tokenBalance: tokens?.tokens ?? 0 });

      const [inbox, sent] = await Promise.all([listInbox(me.email), listSent(me.email)]);
      set({ inbox: inbox ?? [], sent: sent ?? [] });
    }
  },

  scheduleSession: async (id: string, startAtISO: string) => {
    const me = get().me;
    if (!me) {
      return;
    }

    const result = await apiSchedule(id, me.email, startAtISO);
    if (!result.ok) {
      window.alert(result?.data?.message ?? "Could not schedule session.");
      return;
    }

    const sessions = await listSessions(me.email);
    const sessionList = sessions ?? [];
    set({ sessions: sessionList });
    setupSessionReminders(sessionList);
  },

  saveOnboarding: async (
    name: string | undefined,
    skills: string[],
    courses: string[],
    interests?: Array<{ type: "skill" | "course"; name: string }>
  ) => {
    const me = get().me;
    if (!me) {
      return false;
    }

    const result = await apiSaveOnboarding(me.email, name, skills, courses, interests);
    if (result.ok) {
      await get().seed(me.email);
      return true;
    }

    window.alert(result?.data?.message ?? "Could not save onboarding.");
    return false;
  },

  searchTeachers: async (options: { skill?: string; course?: string }) => {
    const results = await apiSearchTeachers(options);

    const hydrated = await Promise.all(
      (results ?? []).map(async (teacher: any) => {
        const ratingStats = await getUserRatingStats(teacher.user.id);
        return {
          ...teacher,
          ratingData: ratingStats?.data ?? { averageRating: 0, totalRatings: 0 },
        };
      })
    );

    set({ searchResults: hydrated });
  },

  addSkill: async (name: string, level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT" = "ADVANCED") => {
    const me = get().me;
    if (!me) {
      return;
    }

    const profile = await apiAddSkill(me.email, name, level);
    if (profile) {
      set({
        mySkills: (profile.userSkills ?? []).map((entry: any) => entry?.skill?.name).filter(Boolean),
        onboarded: !!profile.isOnboarded,
      });
    }
  },

  removeSkill: async (name: string) => {
    const me = get().me;
    if (!me) {
      return;
    }

    const profile = await apiRemoveSkill(me.email, name);
    if (profile) {
      set({
        mySkills: (profile.userSkills ?? []).map((entry: any) => entry?.skill?.name).filter(Boolean),
      });
    }
  },

  addCourse: async (code: string, grade = "A") => {
    const me = get().me;
    if (!me) {
      return;
    }

    const profile = await apiAddCourse(me.email, code.toUpperCase(), grade);
    if (profile) {
      set({
        myCourses: (profile.userCourses ?? []).map((entry: any) => ({
          courseCode: entry.courseCode,
          grade: entry.grade,
        })),
      });
    }
  },

  removeCourse: async (code: string) => {
    const me = get().me;
    if (!me) {
      return;
    }

    const profile = await apiRemoveCourse(me.email, code.toUpperCase());
    if (profile) {
      set({
        myCourses: (profile.userCourses ?? []).map((entry: any) => ({
          courseCode: entry.courseCode,
          grade: entry.grade,
        })),
      });
    }
  },
});

export const useSwap = create<State>(swapStore);
export type SwapState = State;

if (typeof window !== "undefined" && import.meta.env && (import.meta.env as any).DEV) {
  (window as any).__swap = useSwap;
}
