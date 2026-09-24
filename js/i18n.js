(function (global) {
  const STORAGE_KEY = "agency.lang.v1";
  const SUPPORTED = ["pt", "es", "en"];
  const LABELS = { pt: "Portugu\u00eas", es: "Espa\u00f1ol", en: "English" };
  const HTML_LANG = { pt: "pt-BR", es: "es", en: "en" };
  const dict = {
    pt: { product: "Agendamento com Garantia e Fidelidade", agency_name: "Agencia SaaS \u00b7 White-Label", super_admin: "Super Admin", lang_label: "Idioma", showcase_kicker: "Multi-tenant \u00b7 Brasil + Venezuela", showcase_lead: "Marca branca para comercios no Brasil (Pix / R$) e na Venezuela (Pago Movil / Bs). Licencas cobradas do exterior em USD via Binance Pay, PayPal ou Retorna.", open: "Abrir", tenant_br_meta: "Pix \u00b7 garantia em reais \u00b7 fidelidade", tenant_ve_meta: "Pago Movil \u00b7 garantia em bolivares", switch_tenant: "Trocar comercio", login_title: "Entrar no painel", login_subtitle: "Use as credenciais do comercio.", email: "E-mail", password: "Senha", enter: "Entrar", choose_tenant: "Escolher comercio", blocked_title: "Licenca suspensa", blocked_lead: "O acesso deste comercio esta bloqueado ate a regularizacao da licenca mensal em USD.", blocked_kicker: "USD \u00b7 Licenca internacional", regularize: "Regularizar agora", monthly_fee: "Mensalidade", dashboard: "Agenda", loyalty: "Fidelidade", guarantee: "Garantia", new_booking: "Novo agendamento", client: "Cliente", client_ph: "Nome do cliente", service: "Servico", when: "Horario", confirm_pay: "Reservar com garantia", logout: "Sair", upcoming: "Proximos horarios", points: "pontos", empty: "Nenhum agendamento ainda.", success: "Reserva confirmada. Garantia gerada.", invalid_login: "Credenciais invalidas.", payment_method: "Pagamento local", loyalty_help: "Programa white-label por comercio", pay_help: "Pix no Brasil \u00b7 Pago Movil na Venezuela", license: "Licenca", license_help: "Cobranca da agencia no exterior", demo_hint_br: "Demo: admin@aurora.local / 1234", demo_hint_ve: "Demo: admin@leon.local / 1234", admin_kicker: "Controle internacional", admin_title: "Comercios associados", admin_lead: "Um clique troca o status entre Activo / \u4e3b\u52a8 e Suspenso. O login do comercio mostra a tela de regularizacao em USD.", admin_notice: "Demo Pages: o status fica neste navegador (localStorage). Em producao use API + banco. Senha: usd2026", admin_pin: "Senha do super admin", admin_enter: "Entrar", admin_bad_pin: "Senha invalida", admin_showcase: "Ver vitrine", admin_open_login: "Abrir login", suspend: "Suspender", reactivate: "Reativar", until: "ate", per_month: "/mes", copy_pix: "Copiar codigo Pix", copied_pix: "Codigo copiado", copy_ref: "Copiar referencia", copied_ref: "Referencia copiada", pix_reserve: "Garantia para reservar", pm_reserve: "Garantia para reservar" },
    es: { product: "Agendamiento con Garantia y Fidelidad", agency_name: "Agencia SaaS \u00b7 White-Label", super_admin: "Super Admin", lang_label: "Idioma", showcase_kicker: "Multi-tenant \u00b7 Brasil + Venezuela", showcase_lead: "Marca blanca para comercios en Brasil (Pix / R$) y Venezuela (Pago Movil / Bs). Licencias cobradas desde el exterior en USD via Binance Pay, PayPal o Retorna.", open: "Abrir", tenant_br_meta: "Pix \u00b7 garantia en reales \u00b7 fidelidad", tenant_ve_meta: "Pago Movil \u00b7 garantia en bolivares", switch_tenant: "Cambiar comercio", login_title: "Entrar al panel", login_subtitle: "Usa las credenciales del comercio.", email: "Correo", password: "Contrasena", enter: "Entrar", choose_tenant: "Elegir comercio", blocked_title: "Licencia suspendida", blocked_lead: "El acceso de este comercio esta bloqueado hasta regularizar la licencia mensual en USD.", blocked_kicker: "USD \u00b7 Licencia internacional", regularize: "Regularizar ahora", monthly_fee: "Mensualidad", dashboard: "Agenda", loyalty: "Fidelidad", guarantee: "Garantia", new_booking: "Nueva cita", client: "Cliente", client_ph: "Nombre del cliente", service: "Servicio", when: "Horario", confirm_pay: "Reservar con garantia", logout: "Salir", upcoming: "Proximas citas", points: "puntos", empty: "Aun no hay citas.", success: "Reserva confirmada. Garantia generada.", invalid_login: "Credenciales invalidas.", payment_method: "Pago local", loyalty_help: "Programa white-label por comercio", pay_help: "Pix en Brasil \u00b7 Pago Movil en Venezuela", license: "Licencia", license_help: "Cobro de la agencia en el exterior", demo_hint_br: "Demo: admin@aurora.local / 1234", demo_hint_ve: "Demo: admin@leon.local / 1234", admin_kicker: "Control internacional", admin_title: "Comercios asociados", admin_lead: "Un clic cambia el estado entre Activo / \u4e3b\u52a8 y Suspendido. El login del comercio muestra la regularizacion en USD.", admin_notice: "Demo Pages: el estado queda en este navegador (localStorage). En produccion use API + base de datos. Contrasena: usd2026", admin_pin: "Contrasena del super admin", admin_enter: "Entrar", admin_bad_pin: "Contrasena invalida", admin_showcase: "Ver vitrina", admin_open_login: "Abrir login", suspend: "Suspender", reactivate: "Reactivar", until: "hasta", per_month: "/mes", copy_pix: "Copiar codigo Pix", copied_pix: "Codigo copiado", copy_ref: "Copiar referencia", copied_ref: "Referencia copiada", pix_reserve: "Garantia para reservar", pm_reserve: "Garantia para reservar" },
    en: { product: "Booking with Guarantee and Loyalty", agency_name: "SaaS Agency \u00b7 White-Label", super_admin: "Super Admin", lang_label: "Language", showcase_kicker: "Multi-tenant \u00b7 Brazil + Venezuela", showcase_lead: "White-label for shops in Brazil (Pix / R$) and Venezuela (Pago Movil / Bs). Agency licenses billed from abroad in USD via Binance Pay, PayPal or Retorna.", open: "Open", tenant_br_meta: "Pix \u00b7 guarantee in BRL \u00b7 loyalty", tenant_ve_meta: "Pago Movil \u00b7 guarantee in bolivares", switch_tenant: "Switch business", login_title: "Sign in", login_subtitle: "Use the business credentials.", email: "Email", password: "Password", enter: "Sign in", choose_tenant: "Choose business", blocked_title: "License suspended", blocked_lead: "This business is locked until the monthly USD license is regularized.", blocked_kicker: "USD \u00b7 International license", regularize: "Regularize now", monthly_fee: "Monthly fee", dashboard: "Schedule", loyalty: "Loyalty", guarantee: "Guarantee", new_booking: "New booking", client: "Client", client_ph: "Client name", service: "Service", when: "Time", confirm_pay: "Book with guarantee", logout: "Log out", upcoming: "Upcoming bookings", points: "points", empty: "No bookings yet.", success: "Booking confirmed. Guarantee created.", invalid_login: "Invalid credentials.", payment_method: "Local payment", loyalty_help: "White-label loyalty per business", pay_help: "Pix in Brazil \u00b7 Pago Movil in Venezuela", license: "License", license_help: "Agency billing from abroad", demo_hint_br: "Demo: admin@aurora.local / 1234", demo_hint_ve: "Demo: admin@leon.local / 1234", admin_kicker: "International control", admin_title: "Associated businesses", admin_lead: "One click toggles Activo / \u4e3b\u52a8 and Suspended. The shop login then shows the USD regularization screen.", admin_notice: "Pages demo: status is saved in this browser (localStorage). Production should use an API + database. Password: usd2026", admin_pin: "Super admin password", admin_enter: "Sign in", admin_bad_pin: "Invalid password", admin_showcase: "View showcase", admin_open_login: "Open login", suspend: "Suspend", reactivate: "Reactivate", until: "until", per_month: "/mo", copy_pix: "Copy Pix code", copied_pix: "Code copied", copy_ref: "Copy reference", copied_ref: "Reference copied", pix_reserve: "Guarantee to reserve", pm_reserve: "Guarantee to reserve" }
  };
  function normalize(code) {
    const raw = String(code || "").toLowerCase();
    if (raw.startsWith("pt")) return "pt";
    if (raw.startsWith("es")) return "es";
    if (raw.startsWith("en")) return "en";
    return "";
  }
  function stored() { return normalize(localStorage.getItem(STORAGE_KEY)); }
  function detectBrowser() {
    const list = [navigator.language].concat(navigator.languages || []);
    for (const item of list) { const n = normalize(item); if (n) return n; }
    return "pt";
  }
  function getLang(fallback) {
    const params = new URLSearchParams(location.search);
    return normalize(params.get("lang")) || stored() || normalize(fallback) || detectBrowser();
  }
  function setLang(lang) {
    const next = normalize(lang) || "pt";
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = HTML_LANG[next];
    document.documentElement.dataset.lang = next;
    apply();
    syncSelects(next);
    global.dispatchEvent(new CustomEvent("agency:lang", { detail: { lang: next } }));
    return next;
  }
  function t(key, lang) {
    const code = lang || getLang();
    return (dict[code] && dict[code][key]) || dict.pt[key] || key;
  }
  function apply(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach(function (node) { node.textContent = t(node.dataset.i18n); });
    scope.querySelectorAll("[data-i18n-placeholder]").forEach(function (node) { node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder)); });
    scope.querySelectorAll("[data-i18n-aria]").forEach(function (node) { node.setAttribute("aria-label", t(node.dataset.i18nAria)); });
  }
  function syncSelects(lang) {
    document.querySelectorAll("[data-lang-select]").forEach(function (sel) { sel.value = lang; });
  }
  function mount(target) {
    const host = typeof target === "string" ? document.querySelector(target) : target;
    if (!host) return;
    const current = getLang();
    host.innerHTML = '<label class="lang-switch"><span data-i18n="lang_label">' + t("lang_label", current) + '</span><select data-lang-select data-i18n-aria="lang_label" aria-label="' + t("lang_label", current) + '">' + SUPPORTED.map(function (code) { return '<option value="' + code + '"' + (code === current ? ' selected' : '') + '>' + code.toUpperCase() + ' \u00b7 ' + LABELS[code] + '</option>'; }).join('') + '</select></label>';
    host.querySelector("select").addEventListener("change", function (ev) { setLang(ev.target.value); });
  }
  global.I18N = { SUPPORTED: SUPPORTED, LABELS: LABELS, dict: dict, t: t, getLang: getLang, setLang: setLang, apply: apply, mount: mount, normalize: normalize };
})(window);
