export const MONTHS = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

export const WEEKDAYS = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

/**
 * Finds the Nth weekday of a month
 * e.g. 2nd Tuesday, last Friday, etc.
 */
export function getOccurrenceDate(year, monthIndex, weekdayIndex, occurrence) {
  const matches = [];
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, monthIndex, day);
    if (date.getDay() === weekdayIndex) {
      matches.push(day);
    }
  }

  switch (occurrence) {
    case "first":
      return matches[0];

    case "second":
      return matches[1];

    case "third":
      return matches[2];

    case "fourth":
      return matches[3];

    case "last":
      return matches[matches.length - 1];

    default:
      return null;
  }
}

/**
 * Converts your days.json rules into actual events for a given year
 */
export function resolveCommemorativeDays(daysData, year) {
  return daysData.map((event) => {
    const monthIndex = MONTHS[event.monthName];
    const weekdayIndex = WEEKDAYS[event.dayName];

    const dayNumber = getOccurrenceDate(
      year,
      monthIndex,
      weekdayIndex,
      event.occurrence,
    );

    return {
      ...event,
      date: new Date(year, monthIndex, dayNumber),
      dayNumber,
    };
  });
}

/**
 * Generates a simple iCal (.ics) file string
 * (Google Calendar compatible)
 */
export function generateICal(daysData, year) {
  let ics = `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
`;

  for (const event of daysData) {
    const monthIndex = MONTHS[event.monthName];
    const weekdayIndex = WEEKDAYS[event.dayName];

    const day = getOccurrenceDate(
      year,
      monthIndex,
      weekdayIndex,
      event.occurrence,
    );

    if (!day) continue;

    const date = new Date(year, monthIndex, day);

    // Format: YYYYMMDD
    const formattedDate = date.toISOString().split("T")[0].replace(/-/g, "");

    ics += `
BEGIN:VEVENT
SUMMARY:${event.name}
DTSTART;VALUE=DATE:${formattedDate}
DESCRIPTION:${event.name}
END:VEVENT
`;
  }

  ics += `END:VCALENDAR`;

  return ics;
}
