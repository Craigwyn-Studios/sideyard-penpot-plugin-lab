const result = document.getElementById("result");
const contract = globalThis.sideyardT28Contract;
const allowedOrigins = ["http://127.0.0.1:9204"];
const parentOrigin = contract.originFromReferrer(document.referrer, allowedOrigins);
let handshake;
let lastProbe;

function show(message) { result.textContent = message; }
function randomHex() {
  if (!globalThis.crypto?.getRandomValues) return null;
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(24));
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}
function send(message) {
  if (!parentOrigin) return show("reject:none:origin_binding_unavailable");
  window.parent.postMessage(message, parentOrigin);
}
function currentProbe(requestId, token) {
  if (!handshake) return null;
  return { type: "sideyard.t28.probe.v1", protocol_version: 1, request_id: requestId, session_id: handshake.sessionId, panel_nonce: handshake.panelNonce, session_token: token ?? handshake.token };
}

document.getElementById("handshake").addEventListener("click", () => {
  const panelNonce = randomHex();
  if (!panelNonce) return show("reject:none:panel_entropy_unavailable");
  handshake = { panelNonce, sessionId: null, token: null, expiresAt: 0 };
  send({ type: "sideyard.t28.handshake.init.v1", protocol_version: 1, request_id: "t28-handshake-001", panel_nonce: panelNonce });
});
document.getElementById("valid").addEventListener("click", () => {
  lastProbe = currentProbe("t28-probe-001");
  if (!lastProbe) return show("reject:none:handshake_required");
  send(lastProbe);
});
document.getElementById("altered").addEventListener("click", () => {
  const probe = currentProbe("t28-altered-001", "0".repeat(48));
  if (!probe) return show("reject:none:handshake_required");
  send(probe);
});
document.getElementById("replay").addEventListener("click", () => {
  if (!lastProbe) return show("reject:none:valid_probe_required");
  send(lastProbe);
});
document.getElementById("unknown").addEventListener("click", () => send({ type: "sideyard.t28.unknown.v1", protocol_version: 1, request_id: "t28-unknown-001" }));
document.getElementById("expired").addEventListener("click", () => {
  const probe = currentProbe("t28-expired-001");
  if (!probe) return show("reject:none:handshake_required");
  send(probe);
});

window.addEventListener("message", (event) => {
  if (!contract.isFromTrustedParent(event, parentOrigin, window.parent)) return;
  const message = event.data;
  if (!message || typeof message !== "object" || typeof message.type !== "string") return;
  if (message.type === "sideyard.t28.handshake.challenge.v1") {
    if (!handshake || message.panel_nonce !== handshake.panelNonce || !contract.isSafeId(message.session_id) || !contract.isSafeId(message.session_token)) return show("reject:none:invalid_challenge");
    handshake = { panelNonce: handshake.panelNonce, sessionId: message.session_id, token: message.session_token, expiresAt: message.expires_at };
    show(`challenge:${message.session_id.slice(0, 8)}:bound:${parentOrigin}`);
  } else if (message.type === "sideyard.t28.probe.ack.v1") {
    show(`ack:${message.request_id}:${message.disposition}`);
  } else if (message.type === "sideyard.t28.bridge.reject.v1") {
    show(`reject:${message.request_id ?? "none"}:${message.reason}`);
  }
});

show(parentOrigin ? `origin_bound:${parentOrigin}` : "reject:none:origin_binding_unavailable");
