"use strict";
(() => {
  // src/plugin.ts
  var penpotApi = penpot;
  if (!penpotApi?.ui?.open) {
    throw new Error("sideyard_t25_penpot_plugin_api_unavailable");
  }
  penpotApi.ui.open(
    "Sideyard T25 Static No-Write External Panel Candidate 006",
    "https://craigwyn-studios.github.io/sideyard-penpot-plugin-lab/panels/sha256-afb1fb445ce78f56ce3658dbdf8d9b4a5a6d303f86ee3db3f3a8cc2a2bef564d/index.html",
    {
      width: 420,
      height: 220
    }
  );
})();
