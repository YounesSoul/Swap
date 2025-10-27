
export const API_BASE=process.env.NEXT_PUBLIC_API_URL||"";
async function safeJson(res:Response){const t=await res.text();try{return JSON.parse(t);}catch{return null;}}
export async function upsertUser(payload:{email:string;name?:string;university?:string;timezone?:string;image?:string}){
 if(!API_BASE) return {ok:false}; try{const res=await fetch(`${API_BASE}/users/upsert`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); return {ok:res.ok,data:await safeJson(res)};}catch{return {ok:false};}
}
export async function createRequest(fromEmail:string,toEmail:string,courseCode:string,minutes:number,note?:string){
 if(!API_BASE) return {ok:false}; try{const res=await fetch(`${API_BASE}/requests`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fromEmail,toEmail,courseCode,minutes,note})}); return {ok:res.ok,data:await safeJson(res)};}catch{return {ok:false};}
}
export async function listInbox(email:string){ if(!API_BASE) return []; try{const r=await fetch(`${API_BASE}/requests?inbox=1&email=${encodeURIComponent(email)}`); return await safeJson(r) || []; }catch{return [];} }
export async function listSent(email:string){ if(!API_BASE) return []; try{const r=await fetch(`${API_BASE}/requests?sent=1&email=${encodeURIComponent(email)}`); return await safeJson(r) || []; }catch{return [];} }
export async function acceptRequest(id:string,actingEmail:string){ if(!API_BASE) return {ok:false}; try{const r=await fetch(`${API_BASE}/requests/${id}/accept`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({actingEmail})}); return {ok:r.ok,data:await safeJson(r)};}catch{return {ok:false};} }
export async function declineRequest(id:string,actingEmail:string){ if(!API_BASE) return {ok:false}; try{const r=await fetch(`${API_BASE}/requests/${id}/decline`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({actingEmail})}); return {ok:r.ok,data:await safeJson(r)};}catch{return {ok:false};} }
export async function clearAnsweredRequests(actingEmail: string) {
  if (!API_BASE) return { ok: false };
  try {
    const r = await fetch(`${API_BASE}/requests/clear-answered`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actingEmail })
    });
    const data = await safeJson(r);
    return { ok: r.ok, data };
  } catch {
    return { ok: false };
  }
}

export async function clearAllRequests(actingEmail: string) {
  if (!API_BASE) return { ok: false };
  try {
    const r = await fetch(`${API_BASE}/requests/clear-all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actingEmail })
    });
    const data = await safeJson(r);
    return { ok: r.ok, data };
  } catch {
    return { ok: false };
  }
}
export async function listSessions(email:string){ if(!API_BASE) return []; try{const r=await fetch(`${API_BASE}/sessions?email=${encodeURIComponent(email)}`); return await safeJson(r) || []; }catch{return [];} }
export async function getLedger(email:string){ if(!API_BASE) return {balance:0,entries:[]}; try{const r=await fetch(`${API_BASE}/ledger?email=${encodeURIComponent(email)}`); return await safeJson(r) || {balance:0,entries:[]}; }catch{return {balance:0,entries:[]};} }
export async function getTokens(email:string){ if(!API_BASE) return {tokens:0,entries:[]}; try{const r=await fetch(`${API_BASE}/tokens?email=${encodeURIComponent(email)}`); return await safeJson(r) || {tokens:0,entries:[]}; }catch{return {tokens:0,entries:[]};} }

// CHAT
export async function ensureThread(userEmail: string, otherEmail: string){
  const r = await fetch(`${API_BASE}/chat/thread`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ userEmail, otherEmail })
  });
  return await r.json();
}

export async function listThreads(email: string){
  const r = await fetch(`${API_BASE}/chat/threads?email=${encodeURIComponent(email)}`);
  return await r.json();
}

export async function listMessages(threadId: string, after?: string){
  const u = `${API_BASE}/chat/messages?threadId=${encodeURIComponent(threadId)}${after?`&after=${encodeURIComponent(after)}`:''}`;
  const r = await fetch(u);
  return await r.json();
}

export async function sendMessage(threadId: string, senderEmail: string, text: string){
  const r = await fetch(`${API_BASE}/chat/messages`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ threadId, senderEmail, text })
  });
  return await r.json();
}

export async function completeSession(id: string, actingEmail: string) {
  if (!API_BASE) return { ok: false };
  try {
    const r = await fetch(`${API_BASE}/sessions/${id}/done`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actingEmail }),
    });
    const data = await r.json().catch(() => null);
    return { ok: r.ok, data };
  } catch {
    return { ok: false };
  }
}

export async function scheduleSession(id: string, actingEmail: string, startAt: string) {
  const r = await fetch(`${API_BASE}/sessions/${id}/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actingEmail, startAt })
  });
  const data = await r.json().catch(() => null);
  return { ok: r.ok, data };
}

export async function getProfile(email: string) {
  const r = await fetch(`${API_BASE}/users/profile?email=${encodeURIComponent(email)}`);
  return r.ok ? r.json() : null;
}

export async function saveOnboarding(email: string, name: string | undefined, skills: string[], courses: string[]) {
  const payload = {
    email,
    name,
    skills: skills.map(n => ({ name: n })),
    courses: courses.map(code => ({ code, grade: "A" })),
  };
  const r = await fetch(`${API_BASE}/users/onboarding`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  });
  const data = await r.json().catch(() => null);
  return { ok: r.ok, data };
}

export async function searchTeachers(opts: { skill?: string; course?: string }) {
  const qs = new URLSearchParams();
  if (opts.skill) qs.set('skill', opts.skill);
  if (opts.course) qs.set('course', opts.course);
  const r = await fetch(`${API_BASE}/search/teachers?${qs.toString()}`);
  return r.ok ? r.json() : [];
}

export async function suggestSkills(q: string) {
  const r = await fetch(`${API_BASE}/search/skills?q=${encodeURIComponent(q)}`);
  return r.ok ? r.json() : [];
}

export async function addSkill(email: string, name: string, level = "ADVANCED") {
  const r = await fetch(`${API_BASE}/users/skills/add`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, level })
  });
  return r.ok ? r.json() : null;
}
export async function removeSkill(email: string, name: string) {
  const r = await fetch(`${API_BASE}/users/skills/remove`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name })
  });
  return r.ok ? r.json() : null;
}
export async function addCourse(email: string, code: string, grade = "A") {
  const r = await fetch(`${API_BASE}/users/courses/add`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, grade })
  });
  return r.ok ? r.json() : null;
}
export async function removeCourse(email: string, code: string) {
  const r = await fetch(`${API_BASE}/users/courses/remove`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code })
  });
  return r.ok ? r.json() : null;
}

// Rating API functions
export async function getUserRatingStats(userId: string, category?: 'skill' | 'course') {
  if (!API_BASE) return null;
  try {
    const url = `${API_BASE}/ratings/user/${encodeURIComponent(userId)}/stats${category ? `?category=${category}` : ''}`;
    const r = await fetch(url);
    return r.ok ? r.json() : null;
  } catch {
    return null;
  }
}

export async function createRating(ratingData: {
  raterId: string;
  ratedId: string;
  sessionId?: string;
  rating: number;
  review?: string;
  category: 'skill' | 'course';
  skillOrCourse: string;
}) {
  if (!API_BASE) return { ok: false };
  try {
    const r = await fetch(`${API_BASE}/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ratingData),
    });
    const data = await r.json().catch(() => null);
    return { ok: r.ok, data };
  } catch {
    return { ok: false };
  }
}