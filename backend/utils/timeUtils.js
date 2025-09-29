// utils/timeUtils.js

// Validate opening hours format: "HH:MM-HH:MM" or empty
export const isValidTimeRange = (value) => {
  if (!value) return true; // allow empty/Closed
  const regex = /^([01]\d|2[0-3]):(00|30)-([01]\d|2[0-3]):(00|30)$/;
  return regex.test(value);
};

// Convert "HH:MM" to minutes from midnight
export const toMinutes = (str) => {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
};

// Round a Date to nearest lower 30 minutes
export const roundTo30 = (date) => {
  date.setSeconds(0, 0);
  const minutes = date.getMinutes();
  if (minutes >= 30) date.setMinutes(30, 0, 0);
  else date.setMinutes(0, 0, 0);
  return date;
};

// Weekday names
export const daysOfWeek = [
  "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"
];