// Generate all half-hour time slots between open and close
function generateTimeSlots(open, close) {
  const times = [];
  let [h, m] = open.split(":").map(Number);
  const [endH, endM] = close.split(":").map(Number);

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
  return times;
}

// Filter out past times if selected date is today
function filterPastTimes(times, selectedDate) {
  const today = new Date();
  const chosen = new Date(selectedDate);

  if (chosen.toDateString() !== today.toDateString()) return times;

  const currentTime = `${today
    .getHours()
    .toString()
    .padStart(2, "0")}:${today.getMinutes() < 30 ? "00" : "30"}`;

  return times.filter((t) => t >= currentTime);
}

// Calculate available times for a given date based on opening hours
export function getAvailableTimes(selectedDate, openingHours) {
  if (!selectedDate) return [];

  const dayName = new Date(selectedDate).toLocaleString("en-US", { weekday: "long" });
  const dayHours = openingHours[dayName];
  if (!dayHours || !dayHours.includes("-")) return [];

  const [open, close] = dayHours.split("-");
  const times = generateTimeSlots(open, close);
  return filterPastTimes(times, selectedDate);
}

// Generate all possible time options for a full day (00:00, 00:30, ... 23:30)
export function generateAllTimeOptions() {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m of [0, 30]) {
      const hour = h.toString().padStart(2, "0");
      const minute = m.toString().padStart(2, "0");
      times.push(`${hour}:${minute}`);
    }
  }
  return times;
}