"use strict";
(() => {
  // src/plugin.ts
  var penpotApi = penpot;
  var seenRequestIds = /* @__PURE__ */ new Set();
  if (!penpotApi?.ui?.open || !penpotApi?.ui?.onMessage || !penpotApi?.ui?.sendMessage) {
    throw new Error("sideyard_t27_penpot_plugin_api_unavailable");
  }
  penpotApi.ui.open("Sideyard T27 Typed No-Write Bridge Candidate 002", "?route=typed-no-write", {
    width: 480,
    height: 300
  });
  penpotApi.ui.onMessage((value) => {
    if (!isRecord(value)) {
      reject(void 0, "invalid_message");
      return;
    }
    if (value.type !== "sideyard.t27.bridge.ping.v1") {
      reject(requestId(value), "unknown_type");
      return;
    }
    if (value.protocol_version !== 1 || !isRequestId(value.request_id)) {
      reject(requestId(value), "invalid_message");
      return;
    }
    if (seenRequestIds.has(value.request_id)) {
      reject(value.request_id, "replay_detected");
      return;
    }
    seenRequestIds.add(value.request_id);
    penpotApi.ui.sendMessage({
      type: "sideyard.t27.bridge.ack.v1",
      protocol_version: 1,
      request_id: value.request_id,
      disposition: "accepted_no_write"
    });
  });
  function reject(id, reason) {
    penpotApi.ui.sendMessage({
      type: "sideyard.t27.bridge.reject.v1",
      protocol_version: 1,
      request_id: id ?? null,
      reason
    });
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
})();
