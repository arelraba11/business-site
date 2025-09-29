// Calculate available times for a given date based on opening hours
export function getAvailableTimes(selectedDate, openingHours) {
  if (!selectedDate) return [];

  const dayName = new Date(selectedDate).toLocaleString("en-US", { weekday: "long" });
  const hours = openingHours[dayName];
  if (!hours || !hours.includes("-")) return [];

  const [open, close] = hours.split("-");
  const times = [];

  let [h, m] = open.split(":").map(Number);
  let [endH, endM] = close.split(":").map(Number);

  while (h < endH || (h === endH && m < endM)) {
    const hour = h.toString().padStart(2, "0");
    const minute = m.toString().padStart(2, "0");
    times.push(`${hour}:${minute}`);
    m += 30;
    if (m === 60) {
      m = 0;
      h++;
    }
  }

  // If today, filter out past times
  const today = new Date();
  const chosen = new Date(selectedDate);
  if (chosen.toDateString() === today.toDateString()) {
    const currentTime = `${today.getHours().toString().padStart(2, "0")}:${today.getMinutes() < 30 ? "00" : "30"}`;
    return times.filter((t) => t >= currentTime);
  }

  return times;
}