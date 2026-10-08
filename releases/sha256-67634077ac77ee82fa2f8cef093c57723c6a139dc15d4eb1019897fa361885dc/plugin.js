"use strict";
(() => {
  // src/plugin.ts
  var penpotApi = penpot;
  var SESSION_TTL_MS = 1500;
  var session;
  if (!penpotApi?.ui?.open || !penpotApi?.ui?.onMessage || !penpotApi?.ui?.sendMessage) {
    throw new Error("sideyard_t28_penpot_plugin_api_unavailable");
  }
  penpotApi.ui.open("Sideyard T28 Authenticated No-Write Bridge Candidate 001", "?route=origin-bound-session", {
    width: 520,
    height: 420
  });
  penpotApi.ui.onMessage((value) => {
    if (!isRecord(value)) return reject(void 0, "invalid_message");
    if (value.type === "sideyard.t28.handshake.init.v1") {
      return initialize(value);
    }
    if (value.type !== "sideyard.t28.probe.v1") {
      return reject(requestId(value), "unknown_type");
    }
    if (value.protocol_version !== 1 || !isRequestId(value.request_id) || !isSafeId(value.session_id) || !isSafeId(value.panel_nonce) || !isSafeId(value.session_token)) {
      return reject(requestId(value), "invalid_message");
    }
    if (!session || value.session_id !== session.id || value.panel_nonce !== session.panelNonce) {
      return reject(value.request_id, "invalid_session");
    }
    if (Date.now() > session.expiresAt) {
      return reject(value.request_id, "expired_session");
    }
    if (!safeEqual(value.session_token, session.token)) {
      return reject(value.request_id, "invalid_capability");
    }
    if (session.seenRequestIds.has(value.request_id)) {
      return reject(value.request_id, "replay_detected");
    }
    session.seenRequestIds.add(value.request_id);
    penpotApi.ui.sendMessage({
      type: "sideyard.t28.probe.ack.v1",
      protocol_version: 1,
      request_id: value.request_id,
      session_id: session.id,
      disposition: "accepted_no_write"
    });
  });
  function initialize(value) {
    if (value.protocol_version !== 1 || !isRequestId(value.request_id) || !isSafeId(value.panel_nonce)) {
      return reject(requestId(value), "invalid_message");
    }
    const id = secureId();
    const token = secureId();
    if (!id || !token) return reject(value.request_id, "runtime_entropy_unavailable");
    session = { id, token, panelNonce: value.panel_nonce, expiresAt: Date.now() + SESSION_TTL_MS, seenRequestIds: /* @__PURE__ */ new Set() };
    penpotApi.ui.sendMessage({
      type: "sideyard.t28.handshake.challenge.v1",
      protocol_version: 1,
      request_id: value.request_id,
      session_id: id,
      panel_nonce: value.panel_nonce,
      session_token: token,
      expires_at: session.expiresAt
    });
  }
  function secureId() {
    const cryptoApi = globalThis.crypto;
    if (!cryptoApi?.getRandomValues) return void 0;
    const bytes = cryptoApi.getRandomValues(new Uint8Array(24));
    return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
  }
  function safeEqual(left, right) {
    let difference = left.length ^ right.length;
    const width = Math.max(left.length, right.length);
    for (let index = 0; index < width; index += 1) difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
    return difference === 0;
  }
  function reject(id, reason) {
    penpotApi.ui.sendMessage({ type: "sideyard.t28.bridge.reject.v1", protocol_version: 1, request_id: id ?? null, reason });
  }
  function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }
  function requestId(value) {
    return isRequestId(value.request_id) ? value.request_id : void 0;
  }
  function isRequestId(value) {
    return typeof value === "string" && /^[A-Za-z0-9_-]{1,64}$/.test(value);
  }
  function isSafeId(value) {
    return typeof value === "string" && /^[a-f0-9]{32,64}$/.test(value);
  }
})();
