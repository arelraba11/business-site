
// Validate opening hours format: "HH:MM-HH:MM" or empty
export function isValidTimeRange(value) {
  if (!value) return true; // allow empty/Closed
  const regex = /^([01]\d|2[0-3]):(00|30)-([01]\d|2[0-3]):(00|30)$/;
  return regex.test(value);
}

// Convert "HH:MM" to minutes from midnight
export function toMinutes(str) {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
}