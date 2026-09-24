(function (global) {
  const ACTIVE_STATUSES = new Set(["activo", "ativo", "active", "主动"]);
  const SUSPENDED_STATUSES = new Set(["suspendido", "suspenso", "suspended", "inactivo", "inativo", "inactive", "暂停"]);
  const STORAGE_KEY = "agency.licenses.overlay.v1";
  const SESSION_KEY = "agency.session.v1";
  function normalizeStatus(status) {
    return String(status || "").trim().toLowerCase();
  }
  function isActiveStatus(status) {
    return ACTIVE_STATUSES.has(normalizeStatus(status));
  }
  function isSuspendedStatus(status) {
    if (isActiveStatus(status)) return false;
    const n = normalizeStatus(status);
    return !n || SUSPENDED_STATUSES.has(n);
  }
  function readOverlay() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
  }
  function writeOverlay(overlay) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overlay));
  }
  async function loadLicensesFile() {
    const url = new URL("../data/licenses.json", document.currentScript && document.currentScript.src || location.href);
    const candidates = [url.href, "../data/licenses.json", "./data/licenses.json", "data/licenses.json"];
    let lastError;
    for (const candidate of candidates) {
      try {
        const res = await fetch(candidate, { cache: "no-store" });
        if (res.ok) return await res.json();
      } catch (err) { lastError = err; }
    }
    throw lastError || new Error("Nao foi possivel carregar data/licenses.json");
  }
  function mergeLicenses(fileData) {
    const overlay = readOverlay();
    const tenants = (fileData.tenants || []).map(function (t) {
      const patch = overlay[t.tenant_id];
      return patch ? Object.assign({}, t, patch) : Object.assign({}, t);
    });
    return Object.assign({}, fileData, { tenants: tenants, overlay_applied: Object.keys(overlay).length > 0 });
  }
  const AuthEngine = {
    ACTIVE_STATUSES: Array.from(ACTIVE_STATUSES),
    _cache: null,
    async load() {
      const fileData = await loadLicensesFile();
      this._cache = mergeLicenses(fileData);
      return this._cache;
    },
    async getLicenses() {
      if (!this._cache) await this.load();
      return this._cache;
    },
    async getTenantLicense(tenantId) {
      const data = await this.getLicenses();
      return data.tenants.find(function (t) { return t.tenant_id === tenantId; }) || null;
    },
    async validateTenant(tenantId) {
      const license = await this.getTenantLicense(tenantId);
      if (!license) return { ok: false, reason: "not_found", tenant_id: tenantId, status: "Inexistente", active: false };
      const active = isActiveStatus(license.status);
      return { ok: active, reason: active ? "active" : "suspended", tenant_id: tenantId, status: license.status, active: active, license: license };
    },
    async setTenantStatus(tenantId, status) {
      const overlay = readOverlay();
      overlay[tenantId] = Object.assign({}, overlay[tenantId] || {}, { status: status, updated_at: new Date().toISOString(), updated_by: "super-admin" });
      writeOverlay(overlay);
      this._cache = null;
      return this.validateTenant(tenantId);
    },
    getAgency() { return this._cache && this._cache.agency || null; },
    isActiveStatus: isActiveStatus,
    isSuspendedStatus: isSuspendedStatus,
    normalizeStatus: normalizeStatus,
    setSession(session) { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); },
    getSession() { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; } },
    clearSession() { localStorage.removeItem(SESSION_KEY); }
  };
  global.AuthEngine = AuthEngine;
})(window);
