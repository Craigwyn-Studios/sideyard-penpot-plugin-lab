const result = document.getElementById("result");
const contract = globalThis.sideyardT28Contract;
const parentOrigin = contract.originFromReferrer(document.referrer, ["http://127.0.0.1:9204"]);
const envelope = {"schema_version":"sideyard.penpot.t29-authority-envelope.v1","envelope_id":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","panel_origin":"http://127.0.0.1:9204","panel_nonce":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","issued_at_epoch_ms":1791496945220,"expires_at_epoch_ms":1791497545220,"issuer":{"key_id":"sideyard.t29.fixture.ed25519","algorithm":"Ed25519","keyset_digest":"d9b6df1b0c7f94e70bc52c0487e1cf7a98afb7cd4fae9f9871780cd3cf7e69f5","signature":"rFT1w957ag_TrxicST3hkrNnAGRcurUGDuD2rIi264c0y6Y2zNNj-jrtLvZqy81az8qS9aNAdzTYtDHdG5UtDg"}};
let lastRequest;
function show(value) { result.textContent = value; }
function send(request) { if (!parentOrigin) return show("reject:none:origin_binding_unavailable"); window.parent.postMessage(request, parentOrigin); }
function request(id, payload) { return { type: "sideyard.t29.authority-envelope.present.v1", protocol_version: 1, request_id: id, envelope: payload }; }
document.getElementById("valid").addEventListener("click", () => { lastRequest = request("t29-valid-001", envelope); send(lastRequest); });
document.getElementById("altered").addEventListener("click", () => { const altered = structuredClone(envelope); altered.panel_origin = "http://127.0.0.1:9203"; send(request("t29-altered-001", altered)); });
document.getElementById("signature").addEventListener("click", () => { const altered = structuredClone(envelope); altered.issuer.signature = `${altered.issuer.signature[0] === "A" ? "B" : "A"}${altered.issuer.signature.slice(1)}`; send(request("t29-signature-001", altered)); });
document.getElementById("replay").addEventListener("click", () => { if (!lastRequest) return show("reject:none:valid_envelope_required"); send(lastRequest); });
document.getElementById("unknown").addEventListener("click", () => send({ type: "sideyard.t29.unknown.v1", protocol_version: 1, request_id: "t29-unknown-001" }));
window.addEventListener("message", (event) => { if (!contract.isFromTrustedParent(event, parentOrigin, window.parent)) return; const message = event.data; if (!message || typeof message !== "object") return; if (message.type === "sideyard.t29.authority-envelope.ack.v1") show(`ack:${message.request_id}:${message.disposition}`); else if (message.type === "sideyard.t29.authority-envelope.reject.v1") show(`reject:${message.request_id ?? "none"}:${message.reason}`); });
show(parentOrigin ? `origin_bound:${parentOrigin}` : "reject:none:origin_binding_unavailable");
