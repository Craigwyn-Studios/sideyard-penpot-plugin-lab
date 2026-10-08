(function (root) {
  function originFromReferrer(referrer, allowedOrigins) {
    try {
      const origin = new URL(referrer).origin;
      return allowedOrigins.includes(origin) ? origin : null;
    } catch {
      return null;
    }
  }

  function isFromTrustedParent(event, origin, parent) {
    return Boolean(origin) && event.origin === origin && event.source === parent;
  }

  function isSafeId(value) {
    return typeof value === "string" && /^[a-f0-9]{32,64}$/.test(value);
  }

  root.sideyardT28Contract = Object.freeze({ originFromReferrer, isFromTrustedParent, isSafeId });
})(globalThis);
