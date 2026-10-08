const result = document.getElementById("result");
const valid = { type: "sideyard.t27.bridge.ping.v1", protocol_version: 1, request_id: "t27-valid-001" };

function send(message) {
  window.parent.postMessage(message, "*");
}

document.getElementById("valid").addEventListener("click", () => send(valid));
document.getElementById("malformed").addEventListener("click", () => send({ type: "sideyard.t27.bridge.ping.v1", protocol_version: 1 }));
document.getElementById("unknown").addEventListener("click", () => send({ type: "sideyard.t27.bridge.unknown.v1", protocol_version: 1, request_id: "t27-unknown-001" }));
document.getElementById("replay").addEventListener("click", () => send(valid));

window.addEventListener("message", (event) => {
  const message = event.data;
  if (!message || typeof message !== "object" || typeof message.type !== "string") return;
  if (message.type === "sideyard.t27.bridge.ack.v1") {
    result.textContent = `ack:${message.request_id}:${message.disposition}`;
  } else if (message.type === "sideyard.t27.bridge.reject.v1") {
    result.textContent = `reject:${message.request_id ?? "none"}:${message.reason}`;
  }
});
