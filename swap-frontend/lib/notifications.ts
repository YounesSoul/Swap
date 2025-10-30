let timers: number[] = [];

export function setupSessionReminders(sessions: any[]) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  
  // Ensure sessions is an array
  if (!Array.isArray(sessions)) {
    console.warn('setupSessionReminders called with non-array:', sessions);
    return;
  }

  // clear existing timers
  timers.forEach(id => clearTimeout(id));
  timers = [];

  // ask once
  if (Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {});
  }

  const now = Date.now();
  // schedule only within next 24h to avoid huge timeouts
  const horizon = now + 24 * 60 * 60 * 1000;

  sessions
    .filter(s => s.startAt && s.status !== 'done')
    .forEach(s => {
      const start = new Date(s.startAt).getTime();
      const fireAt = start - 10 * 60 * 1000; // 10 min before
      if (fireAt <= now || fireAt > horizon) return;

      const delay = fireAt - now;
      const id = window.setTimeout(() => {
        if (Notification.permission === 'granted') {
          new Notification('Session starting soon', {
            body: `${s.courseCode} starts in 10 minutes`,
          });
        }
      }, delay);
      timers.push(id);
    });
}
