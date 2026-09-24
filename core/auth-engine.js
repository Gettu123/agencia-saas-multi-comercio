(function (global) {
  const ACTIVE_STATUSES = new Set(["activo", "ativo", "active", "\u4e3b\u52a8"]);
  const STORAGE_KEY = "agency.licenses.overlay.v1";
  const SESSION_KEY = "agency.session.v1";
  function normalizeStatus(status) { return String(status || "").trim().toLowerCase(); }
  function isActiveStatus(status) { return ACTIVE_STATUSES.has(normalizeStatus(status)); }
  function readOverlay() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch (e) { return {}; } }
  function writeOverlay(overlay) { localStorage.setItem(STORAGE_KEY, JSON.stringify(overlay)); }
  async function loadLicensesFile() {
    const candidates = ["../data/licenses.json", "./data/licenses.json", "data/licenses.json"];
    for (const candidate of candidates) {
      try { const res = await fetch(candidate, { cache: "no-store" }); if (res.ok) return await res.json(); } catch (e) {}
    }
    throw new Error("Nao foi possivel carregar data/licenses.json");
  }
  function mergeLicenses(fileData) {
    const overlay = readOverlay();
    const tenants = (fileData.tenants || []).map(function (t) { return overlay[t.tenant_id] ? Object.assign({}, t, overlay[t.tenant_id]) : Object.assign({}, t); });
    return Object.assign({}, fileData, { tenants: tenants });
  }
  const AuthEngine = {
    _cache: null,
    load: async function () { this._cache = mergeLicenses(await loadLicensesFile()); return this._cache; },
    getLicenses: async function () { if (!this._cache) await this.load(); return this._cache; },
    getTenantLicense: async function (tenantId) { const data = await this.getLicenses(); return data.tenants.find(function (t) { return t.tenant_id === tenantId; }) || null; },
    validateTenant: async function (tenantId) {
      const license = await this.getTenantLicense(tenantId);
      if (!license) return { ok: false, reason: "not_found", tenant_id: tenantId, status: "Inexistente", active: false };
      const fileActive = isActiveStatus(license.status);
      const codeActive = !!(global.LicenseCode && LicenseCode.isUnlocked(tenantId));
      const active = fileActive || codeActive;
      return { ok: active, reason: fileActive ? "active" : codeActive ? "code" : "suspended", tenant_id: tenantId, status: license.status, active: active, unlocked_by_code: codeActive && !fileActive, license: license };
    },
    setTenantStatus: async function (tenantId, status) {
      const overlay = readOverlay();
      overlay[tenantId] = Object.assign({}, overlay[tenantId] || {}, { status: status, updated_at: new Date().toISOString() });
      writeOverlay(overlay);
      this._cache = null;
      return this.validateTenant(tenantId);
    },
    isActiveStatus: isActiveStatus,
    setSession: function (session) { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); },
    getSession: function () { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch (e) { return null; } },
    clearSession: function () { localStorage.removeItem(SESSION_KEY); }
  };
  global.AuthEngine = AuthEngine;
})(window);
