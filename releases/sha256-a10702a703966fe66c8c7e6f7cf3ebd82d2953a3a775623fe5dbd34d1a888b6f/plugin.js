"use strict";
(() => {
  // src/plugin.ts
  var penpotApi = penpot;
  if (!penpotApi?.ui?.open) {
    throw new Error("sideyard_t25_penpot_plugin_api_unavailable");
  }
  penpotApi.ui.open("Sideyard T25 Static No-Write Lifecycle Candidate 005", "", {
    width: 420,
    height: 220
  });
})();
