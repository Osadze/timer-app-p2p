import {
  addMessage,
  playAudio,
  showControls,
  hideControls,
  updateCountdown,
  handleTimerType,
} from "./ui.js";
import { broadcast } from "./network.js";

let timer = null;
let countdownInterval = null;
let isBreak = false;

let paused = false;
let remainingTime = 0;
let pauseCallback = null;

function startCountdown(durationMs, onEnd) {
  clearInterval(countdownInterval);
  remainingTime = durationMs;
  pauseCallback = onEnd;

  updateCountdown(remainingTime);

  countdownInterval = setInterval(() => {
    if (!paused) {
      remainingTime -= 1000;
      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        updateCountdown(0);
        onEnd();
      } else {
        updateCountdown(remainingTime);
      }
    }
  }, 1000);
}

export function startFocusTimer(focusMs, breakMs, shouldBroadcast = true) {
  hideControls();
  clearTimeout(timer);
  clearInterval(countdownInterval);
  isBreak = false;
  handleTimerType(true);
  addMessage("System", `Timer started for ${focusMs / 60000} min`);
  playAudio("start");

  if (shouldBroadcast) broadcast(`COMMAND|TIMER_START|${focusMs}|${breakMs}`);

  startCountdown(focusMs, () => {
    addMessage(
      "System",
      `Focus over. Starting break for ${breakMs / 60000} min`
    );
    playAudio("breakstart");
    startBreakTimer(breakMs, shouldBroadcast);
  });
}

export function startBreakTimer(breakMs, shouldBroadcast = true) {
  isBreak = true;
  handleTimerType(false);
  startCountdown(breakMs, () => {
    if (shouldBroadcast) broadcast("COMMAND|BREAK_END|0|0");
    handleTimerType(true);
    handleBreakEnd("System");
  });
}

export function handleBreakEnd(from) {
  clearInterval(countdownInterval);
  addMessage(from, "Break ended");
  playAudio("breakend");
  showControls();
}

export function stopTimer(shouldBroadcast = true) {
  clearTimeout(timer);
  clearInterval(countdownInterval);
  paused = false;
  remainingTime = 0;
  pauseCallback = null;
  showControls();
  addMessage("System", "Timer stopped");
  playAudio("breakend");
  if (shouldBroadcast) broadcast("COMMAND|TIMER_STOP");
}

export function togglePause(shouldBroadcast = true) {
  if (remainingTime <= 0 || !pauseCallback) return;

  paused = !paused;
  document.querySelector("#pause-timer").textContent = paused
    ? "Resume"
    : "Pause";
  playAudio("start");
  addMessage("System", paused ? "Timer paused" : "Timer continued");
  if (shouldBroadcast) broadcast(`COMMAND|TIMER_PAUSE|${paused}`);
}
