import crypto from "hypercore-crypto";
import b4a from "b4a";
import { setupSwarm, joinSwarm } from "./helpers/network.js";
import { startFocusTimer, stopTimer, togglePause } from "./helpers/timer.js";

setupSwarm();

document.querySelector("#create-chat-room").addEventListener("click", () => {
  const topicBuffer = crypto.randomBytes(32);
  joinSwarm(topicBuffer);
});

document.querySelector("#join-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const topicStr = document.querySelector("#join-chat-room-topic").value;
  const topicBuffer = b4a.from(topicStr, "hex");
  joinSwarm(topicBuffer);
});

document.querySelector("#start-timer").addEventListener("click", () => {
  const focusMinutes = parseInt(
    document.querySelector("#focus-time").value,
    10
  );
  const breakMinutes = parseInt(
    document.querySelector("#break-time").value,
    10
  );
  const focusMs = focusMinutes * 60 * 10;
  const breakMs = breakMinutes * 60 * 10;
  startFocusTimer(focusMs, breakMs);
});

document
  .querySelector("#stop-timer")
  .addEventListener("click", () => stopTimer(true));
document
  .querySelector("#pause-timer")
  .addEventListener("click", () => togglePause(true));
