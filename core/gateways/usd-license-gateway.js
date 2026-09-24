(function (global) {
  function period() { const d = new Date(); return d.getFullYear() + String(d.getMonth() + 1).padStart(2, "0"); }
  function ref(tenantId) { return ("LIC-" + tenantId.replace(/[^a-z0-9]/gi, "").slice(-8) + "-" + period()).toUpperCase(); }
  const UsdLicenseGateway = {
    id: "usd_license",
    currency: "USD",
    build: function (agency, tenant) {
      const fee = Number((tenant && tenant.monthly_fee_usd) || agency.monthly_fee_usd || 29);
      const r = agency.regularization || {};
      const paypalHandle = String(r.paypal || "").replace(/^https?:\/\/(www\.)?paypal\.me\//i, "");
      const reference = ref(tenant.tenant_id);
      return {
        amount: fee,
        amount_label: "US$ " + fee.toFixed(2),
        reference: reference,
        methods: [
          { id: "paypal", label: "PayPal", account: r.paypal, href: "https://www.paypal.com/paypalme/" + encodeURIComponent(paypalHandle) + "/" + fee + "USD", hint: "Pagar " + fee + " USD · " + reference },
          { id: "binance", label: "Binance Pay", account: r.binance_pay, href: "https://pay.binance.com/", hint: "Pay ID " + r.binance_pay + " · " + reference },
          { id: "retorna", label: "Retorna", account: r.retorna, href: "https://www.retorna.app/", hint: "ID " + r.retorna + " · " + reference }
        ]
      };
    },
    render: function (target, checkout) {
      target.innerHTML = checkout.methods.map(function (m) {
        return '<article class="pay-card"><div class="pay-card__head"><span class="pay-badge">' + m.label + ' · USD</span><strong>' + checkout.amount_label + '</strong></div><p class="muted">' + m.hint + '</p><p class="mono">' + m.account + '</p><div class="nav-actions"><a class="btn btn-primary" target="_blank" rel="noopener" href="' + m.href + '">' + m.label + '</a><button class="btn btn-ghost" type="button" data-copy="' + m.account + '">Copiar</button></div></article>';
      }).join("");
      target.querySelectorAll("[data-copy]").forEach(function (btn) {
        btn.addEventListener("click", function () { navigator.clipboard.writeText(btn.dataset.copy); btn.textContent = "OK"; });
      });
    }
  };
  global.PaymentGateways = global.PaymentGateways || {};
  global.PaymentGateways.usd_license = UsdLicenseGateway;
})(window);
