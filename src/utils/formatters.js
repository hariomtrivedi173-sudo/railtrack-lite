// "00d01:35:00" -> "1h 35m"  (API duration string)
export function formatDuration(durationStr) {
  if (!durationStr) return "N/A";
  const parts = durationStr.split("d");
  const timePart = parts[1] || parts[0];
  const [hours, minutes] = timePart.split(":");

  const h = parseInt(hours, 10);
  const m = parseInt(minutes, 10);

  if (h === 0) return `${m} min`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

// "00d01:35:00" -> 95  (total minutes, days included)
export function durationToMinutes(durationStr) {
  if (!durationStr) return 0;
  const [dayPart, timePart] = durationStr.includes("d")
    ? durationStr.split("d")
    : ["0", durationStr];
  const [h = 0, m = 0] = timePart.split(":").map((n) => parseInt(n, 10) || 0);
  return (parseInt(dayPart, 10) || 0) * 1440 + h * 60 + m;
}

// 171 -> "2h 51m", 45 -> "45m", 120 -> "2h"
export function formatMinutes(totalMinutes) {
  const mins = Math.max(0, Math.round(totalMinutes || 0));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}