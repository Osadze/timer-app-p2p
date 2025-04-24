
import Hyperswarm from "hyperswarm";
import b4a from "b4a";
import { startFocusTimer, handleBreakEnd, togglePause,stopTimer } from './timer.js';
import { addMessage, playAudio } from './ui.js';

export const swarm = new Hyperswarm();

export function setupSwarm() {
  Pear.teardown(() => swarm.destroy());
  Pear.updates(() => Pear.reload());

  swarm.on("connection", (peer) => {
    const name = b4a.toString(peer.remotePublicKey, "hex").slice(0, 6);
    addMessage(name, "joined");

    peer.on("data", (message) => {
      const str = message.toString();
      if (str.startsWith("COMMAND|")) {
        const [, action, focus, rest] = str.split("|");

        if (action === "TIMER_START") {
          startFocusTimer(parseInt(focus), parseInt(rest), false);
        } else if (action === "BREAK_START") {
          addMessage(name, `Focus over. Starting break for ${rest / 60000} min`);
          playAudio("breakstart");
        } else if (action === "BREAK_END") {
          handleBreakEnd(name);
        
        } else if (action === "TIMER_STOP") {
          stopTimer(false); 
        } else if (action === "TIMER_PAUSE") {
          togglePause(false)
          
        }

        return;
      }

      addMessage(name, str);
    });

    peer.on("error", (e) => console.error("Connection error:", e));
  });

  swarm.on("update", () => {
    document.querySelector("#peers-count").textContent = swarm.connections.size + 1;
  });
}

export async function joinSwarm(topicBuffer) {
  document.querySelector("#setup").classList.add("hidden");
  document.querySelector("#loading").classList.remove("hidden");

  const discovery = swarm.join(topicBuffer, { client: true, server: true });
  await discovery.flushed();

  const topic = b4a.toString(topicBuffer, "hex");
  document.querySelector("#chat-room-topic").innerText = topic;
  document.querySelector("#loading").classList.add("hidden");
  document.querySelector("#chat").classList.remove("hidden");
}

export function broadcast(command) {
  for (const peer of swarm.connections) {
    peer.write(command);
  }
}
