(function (global) {
  const SEED = "AGENCIA-USD-LICENCA-2026-MV";
  const unlockKey = function (tenantId) { return "agency.unlock." + tenantId; };
  async function sha8(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("").slice(0, 8).toUpperCase();
  }
  function periodOf(date) {
    const d = date || new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
  }
  global.LicenseCode = {
    periodOf: periodOf,
    monthlyCode: function (tenantId, date) { return sha8(tenantId + "|" + periodOf(date) + "|" + SEED); },
    readUnlock: function (tenantId) { try { return JSON.parse(localStorage.getItem(unlockKey(tenantId)) || "null"); } catch (e) { return null; } },
    isUnlocked: function (tenantId, date) { const row = this.readUnlock(tenantId); return !!(row && row.period === periodOf(date)); },
    redeem: async function (tenantId, typed) {
      const expected = await this.monthlyCode(tenantId);
      const ok = String(typed || "").replace(/\s/g, "").toUpperCase() === expected;
      if (!ok) return { ok: false, period: periodOf() };
      localStorage.setItem(unlockKey(tenantId), JSON.stringify({ period: periodOf(), at: new Date().toISOString() }));
      return { ok: true, period: periodOf() };
    }
  };
})(window);
