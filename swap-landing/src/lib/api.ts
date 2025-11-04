const API_BASE = (import.meta.env.VITE_SWAP_API_URL as string | undefined) ?? "";

const safeJson = async (response: Response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export const getApiBase = () => API_BASE;

export const upsertUser = async (payload: {
  email: string;
  name?: string;
  university?: string;
  timezone?: string;
  image?: string;
}) => {
  console.log("[api] upsertUser - API_BASE:", API_BASE);
  console.log("[api] upsertUser - payload:", payload);
  
  if (!API_BASE) {
    console.error("[api] upsertUser - API_BASE is empty!");
    return { ok: false as const };
  }

  try {
    const url = `${API_BASE}/users/upsert`;
    console.log("[api] upsertUser - calling:", url);
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    
    console.log("[api] upsertUser - response status:", response.status, response.statusText);
    
    const data = await safeJson(response);
    console.log("[api] upsertUser - response data:", data);
    
    return { ok: response.ok, data };
  } catch (error) {
    console.error("[api] upsertUser - error:", error);
    return { ok: false as const };
  }
};

export const createRequest = async (
  fromEmail: string,
  toEmail: string,
  courseCode: string,
  minutes: number,
  note?: string
) => {
  if (!API_BASE) {
    return { ok: false as const };
  }

  try {
    const response = await fetch(`${API_BASE}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromEmail, toEmail, courseCode, minutes, note }),
    });
    return { ok: response.ok, data: await safeJson(response) };
  } catch {
    return { ok: false as const };
  }
};

export const listInbox = async (email: string) => {
  if (!API_BASE) {
    return [] as any[];
  }

  try {
    const response = await fetch(`${API_BASE}/requests?inbox=1&email=${encodeURIComponent(email)}`);
    return (await safeJson(response)) ?? [];
  } catch {
    return [] as any[];
  }
};

export const listSent = async (email: string) => {
  if (!API_BASE) {
    return [] as any[];
  }

  try {
    const response = await fetch(`${API_BASE}/requests?sent=1&email=${encodeURIComponent(email)}`);
    return (await safeJson(response)) ?? [];
  } catch {
    return [] as any[];
  }
};

export const acceptRequest = async (id: string, actingEmail: string) => {
  if (!API_BASE) {
    return { ok: false as const };
  }

  try {
    const response = await fetch(`${API_BASE}/requests/${id}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actingEmail }),
    });
    return { ok: response.ok, data: await safeJson(response) };
  } catch {
    return { ok: false as const };
  }
};

export const declineRequest = async (id: string, actingEmail: string) => {
  if (!API_BASE) {
    return { ok: false as const };
  }

  try {
    const response = await fetch(`${API_BASE}/requests/${id}/decline`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actingEmail }),
    });
    return { ok: response.ok, data: await safeJson(response) };
  } catch {
    return { ok: false as const };
  }
};

export const clearAnsweredRequests = async (actingEmail: string) => {
  if (!API_BASE) {
    return { ok: false as const };
  }

  try {
    const response = await fetch(`${API_BASE}/requests/clear-answered`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actingEmail }),
    });
    return { ok: response.ok, data: await safeJson(response) };
  } catch {
    return { ok: false as const };
  }
};

export const clearAllRequests = async (actingEmail: string) => {
  if (!API_BASE) {
    return { ok: false as const };
  }

  try {
    const response = await fetch(`${API_BASE}/requests/clear-all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actingEmail }),
    });
    return { ok: response.ok, data: await safeJson(response) };
  } catch {
    return { ok: false as const };
  }
};

export const listSessions = async (email: string) => {
  if (!API_BASE) {
    return [] as any[];
  }

  try {
    const response = await fetch(`${API_BASE}/sessions?email=${encodeURIComponent(email)}`);
    return (await safeJson(response)) ?? [];
  } catch {
    return [] as any[];
  }
};

export const getLedger = async (email: string) => {
  if (!API_BASE) {
    return { balance: 0, entries: [] };
  }

  try {
    const response = await fetch(`${API_BASE}/ledger?email=${encodeURIComponent(email)}`);
    return (await safeJson(response)) ?? { balance: 0, entries: [] };
  } catch {
    return { balance: 0, entries: [] };
  }
};

export const getTokens = async (email: string) => {
  if (!API_BASE) {
    return { tokens: 0, entries: [] };
  }

  try {
    const response = await fetch(`${API_BASE}/tokens?email=${encodeURIComponent(email)}`);
    return (await safeJson(response)) ?? { tokens: 0, entries: [] };
  } catch {
    return { tokens: 0, entries: [] };
  }
};

export const ensureThread = async (userEmail: string, otherEmail: string) => {
  const response = await fetch(`${API_BASE}/chat/thread`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userEmail, otherEmail }),
  });
  return response.json();
};

export const listThreads = async (email: string) => {
  const response = await fetch(`${API_BASE}/chat/threads?email=${encodeURIComponent(email)}`);
  return response.json();
};

export const listMessages = async (threadId: string, after?: string) => {
  const url = `${API_BASE}/chat/messages?threadId=${encodeURIComponent(threadId)}${
    after ? `&after=${encodeURIComponent(after)}` : ""
  }`;
  const response = await fetch(url);
  return response.json();
};

export const sendMessage = async (threadId: string, senderEmail: string, text: string) => {
  const response = await fetch(`${API_BASE}/chat/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ threadId, senderEmail, text }),
  });
  return response.json();
};

export const completeSession = async (id: string, actingEmail: string) => {
  if (!API_BASE) {
    return { ok: false as const };
  }

  try {
    const response = await fetch(`${API_BASE}/sessions/${id}/done`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actingEmail }),
    });
    const data = await response.json().catch(() => null);
    return { ok: response.ok, data };
  } catch {
    return { ok: false as const };
  }
};

export const scheduleSession = async (id: string, actingEmail: string, startAt: string) => {
  const response = await fetch(`${API_BASE}/sessions/${id}/schedule`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ actingEmail, startAt }),
  });
  const data = await response.json().catch(() => null);
  return { ok: response.ok, data };
};

export const getProfile = async (email: string) => {
  try {
    const response = await fetch(`${API_BASE}/users/profile?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      return null;
    }
    return response.json().catch(() => null);
  } catch (error) {
    console.error("getProfile error", error);
    return null;
  }
};

export const saveOnboarding = async (
  email: string,
  name: string | undefined,
  skills: string[],
  courses: string[],
  interests?: Array<{ type: "skill" | "course"; name: string }>
) => {
  const payload = {
    email,
    name,
    skills: skills.map((skillName) => ({ name: skillName })),
    courses: courses.map((code) => ({ code, grade: "A" })),
    interests: interests ?? [],
  };

  const response = await fetch(`${API_BASE}/users/onboarding`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => null);
  return { ok: response.ok, data };
};

export const searchTeachers = async (options: { skill?: string; course?: string }) => {
  const params = new URLSearchParams();
  if (options.skill) {
    params.set("skill", options.skill);
  }
  if (options.course) {
    params.set("course", options.course);
  }
  const response = await fetch(`${API_BASE}/search/teachers?${params.toString()}`);
  return response.ok ? response.json() : [];
};

export const suggestSkills = async (query: string) => {
  const response = await fetch(`${API_BASE}/search/skills?q=${encodeURIComponent(query)}`);
  return response.ok ? response.json() : [];
};

export const addSkill = async (email: string, name: string, level = "ADVANCED") => {
  const response = await fetch(`${API_BASE}/users/skills/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, level }),
  });
  return response.ok ? response.json() : null;
};

export const removeSkill = async (email: string, name: string) => {
  const response = await fetch(`${API_BASE}/users/skills/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name }),
  });
  return response.ok ? response.json() : null;
};

export const addCourse = async (email: string, code: string, grade = "A") => {
  const response = await fetch(`${API_BASE}/users/courses/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, grade }),
  });
  return response.ok ? response.json() : null;
};

export const removeCourse = async (email: string, code: string) => {
  const response = await fetch(`${API_BASE}/users/courses/remove`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  return response.ok ? response.json() : null;
};

export const getUserRatingStats = async (userId: string, category?: "skill" | "course") => {
  if (!API_BASE) {
    return null;
  }

  try {
    const suffix = category ? `?category=${category}` : "";
    const response = await fetch(`${API_BASE}/ratings/user/${encodeURIComponent(userId)}/stats${suffix}`);
    return response.ok ? response.json() : null;
  } catch {
    return null;
  }
};

export const getUserRatings = async (userId: string, category?: "skill" | "course") => {
  if (!API_BASE) {
    return { success: false as const };
  }

  try {
    const suffix = category ? `?category=${category}` : "";
    const response = await fetch(`${API_BASE}/ratings/user/${encodeURIComponent(userId)}${suffix}`);
    const data = await safeJson(response);
    return data ?? { success: false as const };
  } catch {
    return { success: false as const };
  }
};

export const createRating = async (ratingData: {
  raterId: string;
  ratedId: string;
  sessionId?: string;
  rating: number;
  review?: string;
  category: "skill" | "course";
  skillOrCourse: string;
}) => {
  if (!API_BASE) {
    return { ok: false as const };
  }

  try {
    const response = await fetch(`${API_BASE}/ratings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ratingData),
    });
    const data = await response.json().catch(() => null);
    return { ok: response.ok, data };
  } catch {
    return { ok: false as const };
  }
};
