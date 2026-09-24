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
    phone: document.querySelector("#phone"),
    special: document.querySelector("#special"),
    when: document.querySelector("#when"),
    form: document.querySelector("#booking-form"),
    list: document.querySelector("#bookings"),
    pending: document.querySelector("#pending"),
    pay: document.querySelector("#pay-panel"),
    loyalty: document.querySelector("#loyalty-points"),
    logout: document.querySelector("#logout")
  };
  let config;
  function t(key) { return I18N.t(key); }
  function money(value) { const gw = PaymentGateways[config.gateway]; return gw ? gw.formatMoney(value) : String(value); }
  function renderBookings() {
    const items = Store.listBookings(tenantId);
    const pending = items.filter(function (b) { return b.status === "pending"; });
    const approved = items.filter(function (b) { return b.status === "approved"; });
    els.pending.innerHTML = pending.length ? pending.map(function (b) {
      return '<article class="booking"><div><strong>' + b.client + '</strong><p>' + b.service + ' \u00b7 ' + b.when + '</p></div><div class="nav-actions"><button class="btn btn-ok" data-approve="' + b.id + '">' + t("approve") + '</button><button class="btn btn-danger" data-reject="' + b.id + '">' + t("reject") + '</button></div></article>';
    }).join("") : '<p class="muted">' + t("empty") + '</p>';
    els.list.innerHTML = approved.length ? approved.map(function (b) {
      return '<article class="booking"><div><strong>' + b.client + '</strong><p>' + b.service + ' \u00b7 ' + b.when + '</p></div><span>' + (b.special ? t("special") : money(b.guarantee || 0)) + '</span></article>';
    }).join("") : '<p class="muted">' + t("empty") + '</p>';
    els.pending.querySelectorAll("[data-approve]").forEach(function (btn) {
      btn.addEventListener("click", function () { Store.setStatus(tenantId, btn.dataset.approve, "approved"); renderBookings(); });
    });
    els.pending.querySelectorAll("[data-reject]").forEach(function (btn) {
      btn.addEventListener("click", function () { Store.setStatus(tenantId, btn.dataset.reject, "rejected"); renderBookings(); });
    });
  }
  function paint() {
    I18N.apply();
    els.loyalty.textContent = Store.listClients(tenantId).length + " " + t("loyalty").toLowerCase();
    els.service.innerHTML = config.services.map(function (s) {
      return '<option value="' + s.id + '">' + s.name + ' \u00b7 ' + money(s.price) + '</option>';
    }).join("");
    renderBookings();
  }
  async function boot() {
    const validation = await AuthEngine.validateTenant(tenantId);
    if (!validation.active) { location.replace("./login.html?tenant=" + encodeURIComponent(tenantId) + "&blocked=1"); return; }
    if (!session || session.tenant_id !== tenantId) { location.replace("./login.html?tenant=" + encodeURIComponent(tenantId)); return; }
    if (window.CloudSync) {
      await CloudSync.init();
      const remote = await CloudSync.pull(tenantId);
      if (remote) Store.applyRemote(tenantId, remote);
      CloudSync.subscribe(tenantId, function (data) { Store.applyRemote(tenantId, data); });
    }
    window.addEventListener("agency:data", function () { if (config) paint(); });
    config = await TenantLoader.load(tenantId);
    I18N.mount("#lang-mount");
    if (!localStorage.getItem("agency.lang.v1")) I18N.setLang(config.language || "pt");
    els.brand.textContent = config.brand.name;
    els.tagline.textContent = config.brand.tagline;
    els.localeBadge.textContent = config.locale;
    els.moneyBadge.textContent = config.currency.symbol + " \u00b7 " + config.currency.code;
    els.gatewayBadge.textContent = config.gateway === "pix" ? "Pix" : "Pago Movil";
    const start = new Date(); start.setMinutes(0,0,0); start.setHours(start.getHours() + 2);
    els.when.value = start.toISOString().slice(0, 16);
    paint();
  }
  els.form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    const service = config.services.find(function (s) { return s.id === els.service.value; });
    const special = !!(els.special && els.special.checked);
    const client = Store.upsertClient(tenantId, { name: els.client.value.trim(), phone: els.phone.value });
    Store.addBooking(tenantId, { id: crypto.randomUUID(), client: client.name, phone: client.phone, service: service.name, when: els.when.value.replace("T", " "), guarantee: special ? 0 : service.guarantee, prepaid: !special, special: special, status: "approved", created_at: new Date().toISOString() });
    renderBookings();
    if (!special) PaymentHub.renderLocal(els.pay, config, { amount: service.guarantee, reference: service.name + " \u00b7 " + client.name });
    else els.pay.innerHTML = '<p class="muted">' + t("special") + '</p>';
    els.client.value = ""; els.phone.value = ""; if (els.special) els.special.checked = false;
  });
  els.logout.addEventListener("click", function () { AuthEngine.clearSession(); location.replace("./login.html?tenant=" + encodeURIComponent(tenantId)); });
  window.addEventListener("agency:lang", paint);
  boot().catch(function (err) { document.body.innerHTML = '<main class="shell"><p>' + err.message + '</p></main>'; });
})();
