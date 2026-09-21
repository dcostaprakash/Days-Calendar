import { formatMonthYear, getOccurrenceDate } from "./common.mjs";

let currentDate = new Date();
let commemorativeDays = [];

fetch("./days.json")
  .then((response) => response.json())
  .then((data) => {
    commemorativeDays = data;
    updateUI();
  });

function updateUI() {
  document.getElementById("month-year").textContent =
    formatMonthYear(currentDate);

  updateYearSelect();

  document.getElementById("month-select").value = currentDate.getMonth();

  document.getElementById("year-select").value = currentDate.getFullYear();

  renderCalendar();
}

function changeMonth(amount) {
  currentDate.setMonth(currentDate.getMonth() + amount);
  updateUI();
}

function populateSelectors() {
  const monthSelect = document.getElementById("month-select");
  const yearSelect = document.getElementById("year-select");

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

  months.forEach((month, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = month;
    monthSelect.appendChild(option);
  });

  for (let year = 1900; year <= 2100; year++) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
}

function jumpToDate() {
  const month = Number(document.getElementById("month-select").value);

  const year = Number(document.getElementById("year-select").value);

  currentDate = new Date(year, month, 1);

  updateUI();
}

function updateYearSelect() {
  const year = currentDate.getFullYear();
  const yearSelect = document.getElementById("year-select");

  if (
    (year < 1900 || year > 2100) &&
    !yearSelect.querySelector(`option[value="${year}"]`)
  ) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
}

function renderCalendar() {
  const calendar = document.getElementById("calendar");

  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDay = new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const monthEvents = getMonthEvents(year, month, monthName);

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    calendar.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const events = monthEvents.filter((e) => e.date === day);
    const cell = createCalendarCell(day, events);

    calendar.appendChild(cell);
  }
}

function getMonthEvents(year, month, monthName) {
  const monthEvents = [];
  for (const item of commemorativeDays) {
    if (item.monthName !== monthName) continue;

    const eventDate = getOccurrenceDate(
      year,
      month,
      item.dayName,
      item.occurrence,
    );
    monthEvents.push({
      date: eventDate,
      name: item.name,
    });
  }
  return monthEvents;
}

function createCalendarCell(day, events) {
  const cell = document.createElement("div");

  cell.classList.add("day");

  if (events.length > 0) {
    cell.innerHTML = `
			<div>${day}</div>
			${events.map((e) => `<div>${e.name}</div>`).join("")}
			`;
  } else {
    cell.textContent = day;
  }
  return cell;
}

window.onload = () => {
  document.getElementById("prev-btn").onclick = () => changeMonth(-1);
  document.getElementById("next-btn").onclick = () => changeMonth(1);
  populateSelectors();

  document
    .getElementById("month-select")
    .addEventListener("change", jumpToDate);

  document.getElementById("year-select").addEventListener("change", jumpToDate);

  updateUI();
};
