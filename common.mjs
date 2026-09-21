export function formatMonthYear(date) {
  return date.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
}
export function getOccurrenceDate(year, month, dayName, occurrence) {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const targetDay = weekdays.indexOf(dayName);
  const matches = [];

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    if (new Date(year, month, d).getDay() === targetDay) {
      matches.push(d);
    }
  }

  if (occurrence === "first") return matches[0];
  if (occurrence === "second") return matches[1];
  if (occurrence === "third") return matches[2];
  if (occurrence === "fourth") return matches[3];
  if (occurrence === "last") return matches[matches.length - 1];

  return null;
}

export function getMonthIndex(name) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months.indexOf(name);
}
