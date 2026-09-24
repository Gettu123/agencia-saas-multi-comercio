(function (global) {
  const KNOWN = {
    tenant_001_br: "../tenants/tenant_001_br/config.json",
    tenant_002_ve: "../tenants/tenant_002_ve/config.json"
  };
  const TenantLoader = {
    applyTheme(config) {
      const root = document.documentElement;
      const b = config.brand || {};
      root.style.setProperty("--accent", b.accent || "#0F766E");
      root.style.setProperty("--accent-dark", b.accent_dark || "#115E59");
      root.style.setProperty("--accent-soft", b.accent_soft || "#CCFBF1");
      document.title = ((b.name || "Agencia SaaS") + " \u00b7 " + (b.tagline || "")).trim();
    },
    async load(tenantId) {
      const path = KNOWN[tenantId];
      if (!path) throw new Error("tenant_id desconhecido: " + tenantId);
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error("Falha ao carregar " + path);
      const config = await res.json();
      this.applyTheme(config);
      return config;
    }
  };
  global.TenantLoader = TenantLoader;
})(window);
