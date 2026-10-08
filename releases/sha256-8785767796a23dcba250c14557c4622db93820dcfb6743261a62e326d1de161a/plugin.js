"use strict";
(() => {
  // src/plugin.ts
  var penpotApi = penpot;
  if (!penpotApi?.ui?.open) {
    throw new Error("sideyard_t25_penpot_plugin_api_unavailable");
  }
  penpotApi.ui.open("Sideyard T26 Manifest-Relative Static Panel Candidate 001", "?route=manifest-relative", {
    width: 420,
    height: 220
  });
})();
