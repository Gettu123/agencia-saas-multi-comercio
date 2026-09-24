(function (global) {
  const STORAGE_KEY = "agency.lang.v1";
  const SUPPORTED = ["pt", "es", "en"];
  const LABELS = { pt: "Portugues", es: "Espanol", en: "English" };
  const HTML_LANG = { pt: "pt-BR", es: "es", en: "en" };
  const extra = {
    owner_area: { pt: "Area do estabelecimento", es: "Area del establecimiento", en: "Business owner area" },
    client_area: { pt: "Sou cliente", es: "Soy cliente", en: "I am a client" },
    phone: { pt: "Telefone / WhatsApp", es: "Telefono / WhatsApp", en: "Phone / WhatsApp" },
    name: { pt: "Nome", es: "Nombre", en: "Name" },
    detect_loyalty: { pt: "Entrar e ver fidelidade", es: "Entrar y ver fidelidad", en: "Enter and check loyalty" },
    hello_client: { pt: "Ola", es: "Hola", en: "Hello" },
    pending: { pt: "Aguardando aprovacao", es: "Esperando aprobacion", en: "Waiting approval" },
    approved: { pt: "Aprovado", es: "Aprobado", en: "Approved" },
    rejected: { pt: "Recusado", es: "Rechazado", en: "Rejected" },
    approve: { pt: "Aprovar", es: "Aprobar", en: "Approve" },
    reject: { pt: "Recusar", es: "Rechazar", en: "Decline" },
    special: { pt: "Cliente fixo sem adiantamento", es: "Cliente fijo sin adelanto", en: "Regular client no deposit" },
    activation_code: { pt: "Codigo de acesso", es: "Codigo de acceso", en: "Access code" },
    activation_help: { pt: "Se ja regularizou, digite o codigo recebido.", es: "Si ya regularizo, escriba el codigo recibido.", en: "If you already paid, enter the code." },
    activate: { pt: "Ativar", es: "Activar", en: "Activate" },
    bad_code: { pt: "Codigo invalido.", es: "Codigo invalido.", en: "Invalid code." },
    code_ok: { pt: "Acesso liberado.", es: "Acceso liberado.", en: "Access unlocked." },
    month_code: { pt: "Codigo do mes", es: "Codigo del mes", en: "This month code" },
    owner_login: { pt: "Dono do estabelecimento", es: "Duenio del establecimiento", en: "Establishment owner" }
  };
  const dict = {
    pt: { product: "Agendamento com Garantia e Fidelidade", agency_name: "Agencia SaaS", super_admin: "Super Admin", lang_label: "Idioma", showcase_kicker: "Multi-tenant Brasil + Venezuela", showcase_lead: "Marca branca Pix/Pago Movil. Licenca em USD.", open: "Abrir", tenant_br_meta: "Pix e fidelidade", tenant_ve_meta: "Pago Movil", switch_tenant: "Trocar comercio", login_title: "Entrar no painel", login_subtitle: "Credenciais do comercio.", email: "E-mail", password: "Senha", enter: "Entrar", choose_tenant: "Escolher comercio", blocked_title: "Licenca suspensa", blocked_lead: "Regularize a licenca mensal em USD.", blocked_kicker: "USD", regularize: "Regularizar", monthly_fee: "Mensalidade", dashboard: "Agenda", loyalty: "Fidelidade", guarantee: "Garantia", new_booking: "Novo agendamento", client: "Cliente", client_ph: "Nome", service: "Servico", when: "Horario", confirm_pay: "Reservar com garantia", logout: "Sair", upcoming: "Agenda", points: "pontos", empty: "Nenhum agendamento.", success: "Reserva confirmada.", invalid_login: "Credenciais invalidas.", payment_method: "Pagamento local", loyalty_help: "Fidelidade", pay_help: "Pix ou Pago Movil", license: "Licenca", license_help: "Cobranca USD", demo_hint_br: "Demo: admin@aurora.local / 1234", demo_hint_ve: "Demo: admin@leon.local / 1234", admin_kicker: "Controle", admin_title: "Comercios", admin_lead: "Ativar ou suspender.", admin_notice: "Senha: usd2026", admin_pin: "Senha", admin_enter: "Entrar", admin_bad_pin: "Senha invalida", admin_showcase: "Vitrine", admin_open_login: "Abrir login", suspend: "Suspender", reactivate: "Reativar", until: "ate", per_month: "/mes", copy_pix: "Copiar Pix", copied_pix: "Copiado", copy_ref: "Copiar referencia", copied_ref: "Copiado", pix_reserve: "Garantia", pm_reserve: "Garantia" },
    es: { product: "Agendamiento con Garantia y Fidelidad", agency_name: "Agencia SaaS", super_admin: "Super Admin", lang_label: "Idioma", showcase_kicker: "Multi-tenant Brasil + Venezuela", showcase_lead: "Marca blanca Pix/Pago Movil. Licencia en USD.", open: "Abrir", tenant_br_meta: "Pix y fidelidad", tenant_ve_meta: "Pago Movil", switch_tenant: "Cambiar comercio", login_title: "Entrar al panel", login_subtitle: "Credenciales del comercio.", email: "Correo", password: "Contrasena", enter: "Entrar", choose_tenant: "Elegir comercio", blocked_title: "Licencia suspendida", blocked_lead: "Regularice la licencia mensual en USD.", blocked_kicker: "USD", regularize: "Regularizar", monthly_fee: "Mensualidad", dashboard: "Agenda", loyalty: "Fidelidad", guarantee: "Garantia", new_booking: "Nueva cita", client: "Cliente", client_ph: "Nombre", service: "Servicio", when: "Horario", confirm_pay: "Reservar con garantia", logout: "Salir", upcoming: "Agenda", points: "puntos", empty: "Sin citas.", success: "Reserva confirmada.", invalid_login: "Credenciales invalidas.", payment_method: "Pago local", loyalty_help: "Fidelidad", pay_help: "Pix o Pago Movil", license: "Licencia", license_help: "Cobro USD", demo_hint_br: "Demo: admin@aurora.local / 1234", demo_hint_ve: "Demo: admin@leon.local / 1234", admin_kicker: "Control", admin_title: "Comercios", admin_lead: "Activar o suspender.", admin_notice: "Clave: usd2026", admin_pin: "Clave", admin_enter: "Entrar", admin_bad_pin: "Clave invalida", admin_showcase: "Vitrina", admin_open_login: "Abrir login", suspend: "Suspender", reactivate: "Reactivar", until: "hasta", per_month: "/mes", copy_pix: "Copiar Pix", copied_pix: "Copiado", copy_ref: "Copiar referencia", copied_ref: "Copiado", pix_reserve: "Garantia", pm_reserve: "Garantia" },
    en: { product: "Booking with Guarantee and Loyalty", agency_name: "SaaS Agency", super_admin: "Super Admin", lang_label: "Language", showcase_kicker: "Multi-tenant Brazil + Venezuela", showcase_lead: "White-label Pix/Pago Movil. USD license.", open: "Open", tenant_br_meta: "Pix and loyalty", tenant_ve_meta: "Pago Movil", switch_tenant: "Switch business", login_title: "Sign in", login_subtitle: "Business credentials.", email: "Email", password: "Password", enter: "Sign in", choose_tenant: "Choose business", blocked_title: "License suspended", blocked_lead: "Regularize the monthly USD license.", blocked_kicker: "USD", regularize: "Regularize", monthly_fee: "Monthly fee", dashboard: "Schedule", loyalty: "Loyalty", guarantee: "Guarantee", new_booking: "New booking", client: "Client", client_ph: "Name", service: "Service", when: "Time", confirm_pay: "Book with guarantee", logout: "Log out", upcoming: "Schedule", points: "points", empty: "No bookings.", success: "Booking confirmed.", invalid_login: "Invalid credentials.", payment_method: "Local payment", loyalty_help: "Loyalty", pay_help: "Pix or Pago Movil", license: "License", license_help: "USD billing", demo_hint_br: "Demo: admin@aurora.local / 1234", demo_hint_ve: "Demo: admin@leon.local / 1234", admin_kicker: "Control", admin_title: "Businesses", admin_lead: "Activate or suspend.", admin_notice: "Password: usd2026", admin_pin: "Password", admin_enter: "Sign in", admin_bad_pin: "Invalid password", admin_showcase: "Showcase", admin_open_login: "Open login", suspend: "Suspend", reactivate: "Reactivate", until: "until", per_month: "/mo", copy_pix: "Copy Pix", copied_pix: "Copied", copy_ref: "Copy reference", copied_ref: "Copied", pix_reserve: "Guarantee", pm_reserve: "Guarantee" }
  };
  Object.keys(extra).forEach(function (key) {
    ["pt", "es", "en"].forEach(function (lang) { dict[lang][key] = extra[key][lang]; });
  });
  function normalize(code) {
    const raw = String(code || "").toLowerCase();
    if (raw.indexOf("pt") === 0) return "pt";
    if (raw.indexOf("es") === 0) return "es";
    if (raw.indexOf("en") === 0) return "en";
    return "";
  }
  function getLang(fallback) {
    const params = new URLSearchParams(location.search);
    return normalize(params.get("lang")) || normalize(localStorage.getItem(STORAGE_KEY)) || normalize(fallback) || "pt";
  }
  function apply(root) {
    const scope = root || document;
    scope.querySelectorAll("[data-i18n]").forEach(function (node) { node.textContent = t(node.dataset.i18n); });
  }
  function t(key, lang) {
    const code = lang || getLang();
    return (dict[code] && dict[code][key]) || dict.pt[key] || key;
  }
  function setLang(lang) {
    const next = normalize(lang) || "pt";
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = HTML_LANG[next];
    apply();
    document.querySelectorAll("[data-lang-select]").forEach(function (sel) { sel.value = next; });
    global.dispatchEvent(new CustomEvent("agency:lang", { detail: { lang: next } }));
    return next;
  }
  function mount(target) {
    const host = typeof target === "string" ? document.querySelector(target) : target;
    if (!host) return;
    const current = getLang();
    host.innerHTML = '<label class="lang-switch"><span>' + t("lang_label", current) + '</span><select data-lang-select>' + SUPPORTED.map(function (code) { return '<option value="' + code + '"' + (code === current ? ' selected' : '') + '>' + code.toUpperCase() + '</option>'; }).join('') + '</select></label>';
    host.querySelector("select").addEventListener("change", function (ev) { setLang(ev.target.value); });
  }
  global.I18N = { t: t, getLang: getLang, setLang: setLang, apply: apply, mount: mount };
})(window);
