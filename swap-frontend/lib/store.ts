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
} from "@/lib/api";
import { setupSessionReminders } from "@/lib/notifications";

import { addSkill as apiAddSkill, removeSkill as apiRemoveSkill,
         addCourse as apiAddCourse, removeCourse as apiRemoveCourse } from "@/lib/api";

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
  status: "scheduled" | "done";
  startAt?: string | null;
  endAt?: string | null;
};

export type LedgerEntry = { id: string; delta: number; reason: string; createdAt?: string };
export type TokenEntry  = { id: string; tokens: number; reason: string; createdAt?: string };

// Search result type
export type TeacherResult = {
  user: { id: string; name?: string | null; email: string; image?: string | null };
  skills?: { name: string; level: string }[];
  course?: { code: string; grade: string };
};

type State = {
  me: Profile | null;

  //onboarding/profile
  onboarded: boolean;
  mySkills: string[];
  myCourses: { courseCode: string; grade: string }[];

  inbox: RequestItem[];
  sent: RequestItem[];
  sessions: SessionItem[];
  ledger: LedgerEntry[];
  tokens: TokenEntry[];
  tokenBalance: number;

  // search
  searchResults: TeacherResult[];

  setMe: (p: Profile) => void;
  seed: (email: string) => Promise<void>;

  sendRequest: (toEmail: string, courseCode: string, minutes: number, note?: string) => Promise<{ ok: boolean; error?: string }>;
  acceptRequest: (id: string) => Promise<void>;
  declineRequest: (id: string) => Promise<void>;
  clearAnsweredRequests: () => Promise<void>;
  clearAllRequests: () => Promise<void>;
  completeSession: (id: string) => Promise<void>;
  scheduleSession: (id: string, startAtISO: string) => Promise<void>;
  saveOnboarding: (name: string | undefined, skills: string[], courses: string[]) => Promise<boolean>;
  searchTeachers: (opts: { skill?: string; course?: string }) => Promise<void>;
   addSkill: (name: string, level?: "BEGINNER"|"INTERMEDIATE"|"ADVANCED"|"EXPERT") => Promise<void>;
  removeSkill: (name: string) => Promise<void>;
  addCourse: (code: string, grade?: string) => Promise<void>;
  removeCourse: (code: string) => Promise<void>;
};

export const useSwap = create<State>((set, get) => ({
  me: null,

  // defaults
  onboarded: true,
  mySkills: [],
  myCourses: [],

  inbox: [],
  sent: [],
  sessions: [],
  ledger: [],
  tokens: [],
  tokenBalance: 0,
  searchResults: [],

  setMe: (p) => set({ me: p }),

  // Seed all client state for a user
  seed: async (email: string) => {
    const [profile, inbox, sent, ledger, sessions, tokens] = await Promise.all([
      getProfile(email),
      listInbox(email),
      listSent(email),
      getLedger(email),
      listSessions(email),
      getTokens(email),
    ]);

    const sSessions = sessions || [];
    set({
      // profile bits
      onboarded: !!profile?.isOnboarded,
      mySkills: (profile?.userSkills || []).map((us: any) => us.skill?.name).filter(Boolean),
      myCourses: (profile?.userCourses || []).map((c: any) => ({ courseCode: c.courseCode, grade: c.grade })),

      // existing data
      inbox: inbox || [],
      sent: sent || [],
      ledger: ledger?.entries || [],
      sessions: sSessions,
      tokens: tokens?.entries || [],
      tokenBalance: tokens?.tokens || 0,
    });

    // schedule local reminders for upcoming sessions
    setupSessionReminders(sSessions);
  },

  // Send a request (requires >=1 token)
  sendRequest: async (toEmail, courseCode, minutes, note) => {
  const me = get().me;
  if (!me) return { ok: false, error: "Not signed in" };

  const balance = get().tokenBalance ?? 0;
  if (balance < 1) {
    return { ok: false, error: "You need at least 1 token to send a request." };
  }

  if (toEmail.toLowerCase() === me.email.toLowerCase()) {
    return { ok: false, error: "You can't send a request to yourself" };
  }

  const res = await createRequest(me.email, toEmail, courseCode, minutes, note);
  if (res.ok && res.data) {
    set((s) => ({ sent: [res.data, ...s.sent] }));
    return { ok: true };
  } else {
    const msg =
      res?.data?.message ||
      res?.data?.error ||
      "Could not send request.";
    return { ok: false, error: msg };
  }
},

  // Accept request (deducts learner token server-side)
  acceptRequest: async (id) => {
    const me = get().me;
    if (!me) return;

    const res = await apiAccept(id, me.email);
    if (!res.ok) {
      alert(res?.data?.message || "Could not accept. The requester may have insufficient tokens.");
      return;
    }

    set((s) => ({ inbox: s.inbox.map((r) => (r.id === id ? { ...r, status: "ACCEPTED" } : r)) }));

    const [ledger, sessions, tokens] = await Promise.all([
      getLedger(me.email),
      listSessions(me.email),
      getTokens(me.email),
    ]);

    const sSessions = sessions || [];
    set({
      ledger: ledger?.entries || [],
      sessions: sSessions,
      tokens: tokens?.entries || [],
      tokenBalance: tokens?.tokens || 0,
    });
    setupSessionReminders(sSessions);
  },

  declineRequest: async (id) => {
    const me = get().me;
    if (!me) return;
    const res = await apiDecline(id, me.email);
    if (res.ok) set((s) => ({ inbox: s.inbox.map((r) => (r.id === id ? { ...r, status: "DECLINED" } : r)) }));
  },

  clearAnsweredRequests: async () => {
    const me = get().me;
    if (!me) return;
    const res = await apiClearAnswered(me.email);
    if (res.ok) {
      // Remove all accepted/declined requests from both inbox and sent
      set((s) => ({
        inbox: s.inbox.filter((r) => r.status !== "ACCEPTED" && r.status !== "DECLINED"),
        sent: s.sent.filter((r) => r.status !== "ACCEPTED" && r.status !== "DECLINED"),
      }));
    }
  },

  clearAllRequests: async () => {
    const me = get().me;
    if (!me) return;
    const res = await apiClearAll(me.email);
    if (res.ok) {
      // Clear all requests
      set({ inbox: [], sent: [] });
    }
  },

  completeSession: async (id) => {
    const me = get().me;
    if (!me) return;
    const res = await apiComplete(id, me.email);
    if (res.ok) {
      // remove locally
      set((s) => ({ sessions: s.sessions.filter((x) => x.id !== id) }));
      setupSessionReminders(get().sessions);

      // refresh tokens (teacher may have earned)
      const tokens = await getTokens(me.email);
      set({ tokens: tokens?.entries || [], tokenBalance: tokens?.tokens || 0 });

      // refresh requests so accepted ones linked to done sessions disappear
      const [inbox, sent] = await Promise.all([listInbox(me.email), listSent(me.email)]);
      set({ inbox: inbox || [], sent: sent || [] });
    }
  },

  scheduleSession: async (id, startAtISO) => {
    const me = get().me;
    if (!me) return;

    const res = await apiSchedule(id, me.email, startAtISO);
    if (!res.ok) {
      alert(res?.data?.message || "Could not schedule session.");
      return;
    }

    const sessions = await listSessions(me.email);
    const sSessions = sessions || [];
    set({ sessions: sSessions });
    setupSessionReminders(sSessions);
  },

  //save onboarding (skills + A-grade courses)
  saveOnboarding: async (name, skills, courses) => {
    const me = get().me;
    if (!me) return false;
    const res = await apiSaveOnboarding(me.email, name, skills, courses);
    if (res.ok) {
      await get().seed(me.email);
      return true;
    }
    alert(res?.data?.message || "Could not save onboarding.");
    return false;
  },

  //search for teachers by skill or course
  searchTeachers: async (opts) => {
    const results = await apiSearchTeachers(opts);
    
    // Fetch ratings for each teacher
    const resultsWithRatings = await Promise.all(
      (results || []).map(async (teacher: any) => {
        const ratingStats = await getUserRatingStats(teacher.user.id);
        return {
          ...teacher,
          ratingData: ratingStats?.data || { averageRating: 0, totalRatings: 0 }
        };
      })
    );
    
    set({ searchResults: resultsWithRatings });
  },
    addSkill: async (name, level = "ADVANCED") => {
    const me = get().me; if (!me) return;
    const profile = await apiAddSkill(me.email, name, level);
    if (profile) set({ mySkills: (profile.userSkills || []).map((us: any) => us.skill?.name).filter(Boolean),
                       onboarded: !!profile.isOnboarded });
  },
  removeSkill: async (name) => {
    const me = get().me; if (!me) return;
    const profile = await apiRemoveSkill(me.email, name);
    if (profile) set({ mySkills: (profile.userSkills || []).map((us: any) => us.skill?.name).filter(Boolean) });
  },
  addCourse: async (code, grade = "A") => {
    const me = get().me; if (!me) return;
    const profile = await apiAddCourse(me.email, code.toUpperCase(), grade);
    if (profile) set({ myCourses: (profile.userCourses || []).map((c: any) => ({ courseCode: c.courseCode, grade: c.grade })) });
  },
  removeCourse: async (code) => {
    const me = get().me; if (!me) return;
    const profile = await apiRemoveCourse(me.email, code.toUpperCase());
    if (profile) set({ myCourses: (profile.userCourses || []).map((c: any) => ({ courseCode: c.courseCode, grade: c.grade })) });
  }
}));
