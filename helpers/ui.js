const audioFiles = {
  start: new Audio("./assets/sounds/start.wav"),
  breakstart: new Audio("./assets/sounds/breakstart.wav"),
  breakend: new Audio("./assets/sounds/breakend.mp3"),
};

export function playAudio(type) {
  if (audioFiles[type]) {
    audioFiles[type].play();
  }
}

export function addMessage(from, message) {
  const $div = document.createElement("div");
  $div.textContent = `<${from}> ${message}`;
  document.querySelector("#messages").appendChild($div);
}

export function showControls() {
  document.querySelector("#timer-controls").classList.remove("hidden");
  document.querySelector("#start-timer").classList.remove("hidden");
  document.querySelector("#timer-type").classList.add("hidden");
  document.querySelector("#countdown").classList.add("hidden");
  document.querySelector("#timer-buttons").classList.add("hidden");
}

export function hideControls() {
  document.querySelector("#timer-controls").classList.add("hidden");
  document.querySelector("#start-timer").classList.add("hidden");
  document.querySelector("#timer-type").classList.remove("hidden");
  document.querySelector("#countdown").classList.remove("hidden");
  document.querySelector("#timer-buttons").classList.remove("hidden");
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function updateCountdown(ms) {
  const el = document.querySelector("#countdown");
  if (el) {
    el.textContent = formatTime(ms);
  }
}

export function handleTimerType(working) {
  const timerTypeEl = document.querySelector("#timer-type");
  const countdownEl = document.querySelector("#countdown");

  timerTypeEl.textContent = working ? "Working..." : "Break...";
  timerTypeEl.classList.remove("green-text", "blue-text");
  countdownEl.classList.remove("green-text", "blue-text");

  const colorClass = working ? "green-text" : "blue-text";
  timerTypeEl.classList.add(colorClass);
  countdownEl.classList.add(colorClass);
}
