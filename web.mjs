import daysData from "./days.json" with { type: "json" };

import { MONTHS, resolveCommemorativeDays, generateICal } from "./common.mjs";

/* =========================
   STATE (current selection)
========================= */

let selectedMonth = new Date().getMonth();
let selectedYear = new Date().getFullYear();

let yearRangeStart = Math.floor((selectedYear - 1) / 25) * 25 + 1;

/* =========================
   INIT
========================= */

window.onload = () => {
  populateMonths();
  updateYearRangeLabel();
  bindEvents();
  renderCalendar();
};

/* =========================
   MONTH DROPDOWN
========================= */

function populateMonths() {
  const select = document.getElementById("monthSelect");

  Object.keys(MONTHS).forEach((name) => {
    const option = document.createElement("option");
    option.value = MONTHS[name];
    option.textContent = name;

    if (MONTHS[name] === selectedMonth) {
      option.selected = true;
    }

    select.appendChild(option);
  });
}

/* =========================
   EVENT LISTENERS
========================= */

function bindEvents() {
  // Month dropdown change
  document.getElementById("monthSelect").onchange = (e) => {
    selectedMonth = Number(e.target.value);
    renderCalendar();
  };

  // Previous month
  document.getElementById("prevMonth").onclick = () => {
    selectedMonth--;

    if (selectedMonth < 0) {
      selectedMonth = 11;
      selectedYear--;
    }

    renderCalendar();
  };

  // Next month
  document.getElementById("nextMonth").onclick = () => {
    selectedMonth++;

    if (selectedMonth > 11) {
      selectedMonth = 0;
      selectedYear++;
    }

    renderCalendar();
  };

  // Previous 25-year range
  document.getElementById("prevRange").onclick = () => {
    yearRangeStart -= 25;
    updateYearRangeLabel();
  };

  // Next 25-year range
  document.getElementById("nextRange").onclick = () => {
    yearRangeStart += 25;
    updateYearRangeLabel();
  };

  // Toggle year picker
  document.getElementById("yearRangeBtn").onclick = () => {
    toggleYearPicker();
  };

  // Export iCal file
  document.getElementById("exportIcal").onclick = () => {
    const ics = generateICal(daysData, selectedYear);

    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "commemorative-days.ics";
    a.click();

    URL.revokeObjectURL(url);
  };
}

/* =========================
   YEAR RANGE + PICKER
========================= */

function updateYearRangeLabel() {
  document.getElementById("yearRangeBtn").textContent =
    `${yearRangeStart}-${yearRangeStart + 24}`;
}

function toggleYearPicker() {
  const picker = document.getElementById("yearPicker");

  if (picker.style.display === "none") {
    picker.style.display = "grid";
    renderYearPicker();
  } else {
    picker.style.display = "none";
  }
}

function renderYearPicker() {
  const picker = document.getElementById("yearPicker");
  picker.innerHTML = "";

  for (let year = yearRangeStart; year <= yearRangeStart + 24; year++) {
    const btn = document.createElement("button");
    btn.textContent = year;

    btn.onclick = () => {
      selectedYear = year;
      picker.style.display = "none";
      renderCalendar();
    };

    picker.appendChild(btn);
  }
}

/* =========================
   CALENDAR RENDERING
========================= */

function renderCalendar() {
  const grid = document.getElementById("grid");

  // Month title
  const monthName = Object.keys(MONTHS).find(
    (k) => MONTHS[k] === selectedMonth,
  );

  document.getElementById("title").textContent = `${monthName} ${selectedYear}`;

  grid.innerHTML = "";

  // First day of month
  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();

  // Number of days in month
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  // Get all events for selected year/month
  const events = resolveCommemorativeDays(daysData, selectedYear).filter(
    (e) => new Date(e.date).getMonth() === selectedMonth,
  );

  // Faster lookup using map (performance improvement)
  const eventMap = new Map(events.map((e) => [e.dayNumber, e]));

  /* Weekday headers */
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => {
    const el = document.createElement("div");
    el.className = "day-name";
    el.textContent = day;
    grid.appendChild(el);
  });

  /* Empty cells before first day */
  for (let i = 0; i < firstDay; i++) {
    grid.appendChild(document.createElement("div"));
  }

  /* Days of month */
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.className = "day";

    const match = eventMap.get(day);

    if (match) {
      cell.classList.add("commemorative");
      cell.innerHTML = `<strong>${day}</strong><br>${match.name}`;
    } else {
      cell.textContent = day;
    }

    grid.appendChild(cell);
  }
}
