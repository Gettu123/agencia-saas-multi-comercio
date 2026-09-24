(function () {
  const params = new URLSearchParams(location.search);
  const session = window.AuthEngine.getSession();
  const tenantId = params.get("tenant") || (session && session.tenant_id) || "tenant_001_br";
  const els = {
    brand: document.querySelector("[data-brand]"),
    tagline: document.querySelector("[data-tagline]"),
    localeBadge: document.querySelector("[data-locale]"),
    moneyBadge: document.querySelector("[data-money]"),
    gatewayBadge: document.querySelector("[data-gateway]"),
    service: document.querySelector("#service"),
    client: document.querySelector("#client"),
    when: document.querySelector("#when"),
    form: document.querySelector("#booking-form"),
    list: document.querySelector("#bookings"),
    pay: document.querySelector("#pay-panel"),
    loyalty: document.querySelector("#loyalty-points"),
    logout: document.querySelector("#logout")
  };
  let config;
  const storeKey = "agency.bookings." + tenantId;
  function t(key) { return I18N.t(key); }
  function money(value) {
    const gw = PaymentGateways[config.gateway];
    return gw ? gw.formatMoney(value) : String(value);
  }
  function loadBookings() { try { return JSON.parse(localStorage.getItem(storeKey) || "[]"); } catch { return []; } }
  function saveBookings(items) { localStorage.setItem(storeKey, JSON.stringify(items)); }
  function renderBookings() {
    const items = loadBookings();
    if (!items.length) { els.list.innerHTML = '<p class="muted">' + t("empty") + '</p>'; return; }
    els.list.innerHTML = items.map(function (b) {
      return '<article class="booking"><div><strong>' + b.client + '</strong><p>' + b.service + ' \u00b7 ' + b.when + '</p></div><span>' + money(b.guarantee) + ' ' + t("guarantee").toLowerCase() + '</span></article>';
    }).join("");
  }
  function fillServices() {
    els.service.innerHTML = config.services.map(function (s) {
      return '<option value="' + s.id + '">' + s.name + ' \u00b7 ' + money(s.price) + ' (' + t("guarantee") + ' ' + money(s.guarantee) + ')</option>';
    }).join("");
  }
  function paint() {
    I18N.apply();
    els.loyalty.textContent = (session.points || 120) + ' ' + t("points");
    fillServices();
    renderBookings();
  }
  async function boot() {
    const validation = await AuthEngine.validateTenant(tenantId);
    if (!validation.active) { location.replace("./login.html?tenant=" + encodeURIComponent(tenantId) + "&blocked=1"); return; }
    if (!session || session.tenant_id !== tenantId) { location.replace("./login.html?tenant=" + encodeURIComponent(tenantId)); return; }
    config = await TenantLoader.load(tenantId);
    I18N.mount("#lang-mount");
    if (!localStorage.getItem("agency.lang.v1")) I18N.setLang(config.language || "pt");
    els.brand.textContent = config.brand.name;
    els.tagline.textContent = config.brand.tagline;
    els.localeBadge.textContent = config.locale;
    els.moneyBadge.textContent = config.currency.symbol + " \u00b7 " + config.currency.code;
    els.gatewayBadge.textContent = config.gateway === "pix" ? "Pix" : "Pago Movil";
    const start = new Date(); start.setMinutes(0,0,0); start.setHours(start.getHours()+2);
    els.when.value = start.toISOString().slice(0,16);
    paint();
  }
  els.form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    const service = config.services.find(function (s) { return s.id === els.service.value; });
    const booking = { id: crypto.randomUUID(), client: els.client.value.trim(), service: service.name, when: els.when.value.replace("T", " "), guarantee: service.guarantee, created_at: new Date().toISOString() };
    const items = loadBookings(); items.unshift(booking); saveBookings(items); renderBookings();
    PaymentGateways[config.gateway].renderPanel(els.pay, PaymentGateways[config.gateway].generatePayload({ amount: service.guarantee, reference: booking.service + " \u00b7 " + booking.client, merchant: config.brand.name }));
    els.client.value = "";
  });
  els.logout.addEventListener("click", function () { AuthEngine.clearSession(); location.replace("./login.html?tenant=" + encodeURIComponent(tenantId)); });
  window.addEventListener("agency:lang", paint);
  boot().catch(function (err) { document.body.innerHTML = '<main class="shell"><p>' + err.message + '</p></main>'; });
})();
