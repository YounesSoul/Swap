let timers: number[] = [];

export const setupSessionReminders = (sessions: any[]) => {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  if (!Array.isArray(sessions)) {
    console.warn("setupSessionReminders called with non-array", sessions);
    return;
  }

  timers.forEach((id) => clearTimeout(id));
  timers = [];

  if (Notification.permission === "default") {
    Notification.requestPermission().catch(() => undefined);
  }

  const now = Date.now();
  const horizon = now + 24 * 60 * 60 * 1000;

  sessions
    .filter((session) => session.startAt && session.status !== "done")
    .forEach((session) => {
      const start = new Date(session.startAt).getTime();
      const fireAt = start - 10 * 60 * 1000;

      if (fireAt <= now || fireAt > horizon) {
        return;
      }

      const delay = fireAt - now;
      const id = window.setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification("Session starting soon", {
            body: `${session.courseCode} starts in 10 minutes`,
          });
        }
      }, delay);

      timers.push(id);
    });
};
