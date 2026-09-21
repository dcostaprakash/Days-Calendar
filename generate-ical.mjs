import fs from "fs";
import { getOccurrenceDate, getMonthIndex } from "./common.mjs";
import daysData from "./days.json" with { type: "json" };

function formatDate(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}${mm}${dd}`;
}

let ics = "";
ics += "BEGIN:VCALENDAR\n";
ics += "VERSION:2.0\n";
ics += "PRODID:-//Commemorative Days//EN\n";

for (let year = 2020; year <= 2030; year++) {
  for (const item of daysData) {
    const monthIndex = getMonthIndex(item.monthName);

    if (monthIndex === -1) continue;

    const day = getOccurrenceDate(
      year,
      monthIndex,
      item.dayName,
      item.occurrence,
    );

    if (!day) continue;

    const dateStr = formatDate(year, monthIndex, day);

    const nextDate = new Date(year, monthIndex, day);
    nextDate.setDate(nextDate.getDate() + 1);

    const endDateStr = formatDate(
      nextDate.getFullYear(),
      nextDate.getMonth(),
      nextDate.getDate(),
    );

    ics += "BEGIN:VEVENT\n";
    ics += `DTSTART;VALUE=DATE:${dateStr}\n`;
    ics += `DTEND;VALUE=DATE:${endDateStr}\n`;
    ics += `SUMMARY:${item.name}\n`;
    ics += "END:VEVENT\n";
  }
}

ics += "END:VCALENDAR\n";

fs.writeFileSync("days.ics", ics);

console.log("days.ics created successfully");
