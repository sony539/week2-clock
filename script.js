// ---------- Grab the elements we need from the page ----------
const clockEl = document.getElementById("clock");
const dateEl = document.getElementById("clock-date");
const formatBtn = document.getElementById("format-btn");

const daysEl = document.getElementById("cd-days");
const hoursEl = document.getElementById("cd-hours");
const minutesEl = document.getElementById("cd-minutes");
const secondsEl = document.getElementById("cd-seconds");
const countdownEl = document.getElementById("countdown");
const doneEl = document.getElementById("count-done");
const labelEl = document.getElementById("count-label");
const dateInput = document.getElementById("target-date");
const resetBtn = document.getElementById("reset-btn");

// ---------- Helpers ----------
// Adds a leading zero: 5 becomes "05"
function pad(number) {
  return String(number).padStart(2, "0");
}

// ---------- Digital clock ----------
let use24Hour = true;

function updateClock() {
  const now = new Date(); // current date and time

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  let suffix = "";

  if (!use24Hour) {
    suffix = hours >= 12 ? " PM" : " AM";
    hours = hours % 12 || 12; // 0 becomes 12
  }

  clockEl.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}${suffix}`;

  dateEl.textContent = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

formatBtn.addEventListener("click", () => {
  use24Hour = !use24Hour;
  formatBtn.textContent = use24Hour ? "Switch to 12-hour" : "Switch to 24-hour";
  updateClock();
});

// ---------- Countdown timer ----------
// By default we count down to the next 1 January, 00:00
function nextNewYear() {
  return new Date(new Date().getFullYear() + 1, 0, 1, 0, 0, 0);
}

let targetDate = nextNewYear();

function updateCountdown() {
  const difference = targetDate - new Date(); // milliseconds left

  if (difference <= 0) {
    countdownEl.hidden = true;
    doneEl.hidden = false;
    return;
  }

  countdownEl.hidden = false;
  doneEl.hidden = true;

  const totalSeconds = Math.floor(difference / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  daysEl.textContent = days;
  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);
}

function describeTarget(date) {
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// When the user picks their own date
dateInput.addEventListener("change", () => {
  if (!dateInput.value) return;
  targetDate = new Date(dateInput.value);
  labelEl.textContent = `Time left until ${describeTarget(targetDate)}`;
  updateCountdown();
});

// Go back to New Year
resetBtn.addEventListener("click", () => {
  targetDate = nextNewYear();
  dateInput.value = "";
  labelEl.textContent = "Time left until New Year";
  updateCountdown();
});

// ---------- Start everything ----------
function tick() {
  updateClock();
  updateCountdown();
}

tick(); // run once immediately so the page is not empty
setInterval(tick, 1000); // then repeat every 1000 ms (1 second)
