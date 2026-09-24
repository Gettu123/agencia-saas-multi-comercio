(function (global) {
  function formatBRL(value) { return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
  const PixGateway = {
    id: "pix", country: "BR", currency: "BRL", label: "Pix", formatMoney: formatBRL,
    generatePayload: function (opts) {
      const pay = (opts.config && opts.config.payments) || {};
      const key = pay.pix_key || "agencia.saas@pix.example";
      const merchant = pay.merchant_name || (opts.config && opts.config.brand && opts.config.brand.name) || opts.merchant || "COMERCIO";
      const city = pay.city || "SAO PAULO";
      const txid = ("AGN" + Date.now().toString(36)).slice(0, 25).toUpperCase();
      const copy = global.PixEMV ? PixEMV.build({ key: key, merchant: merchant, city: city, amount: opts.amount, txid: txid }) : key;
      return { method: "pix", currency: "BRL", amount: Number(opts.amount), amount_label: formatBRL(opts.amount), reference: opts.reference, merchant: merchant, pix_key: key, txid: txid, copy_paste: copy };
    },
    renderPanel: function (target, payload) {
      target.innerHTML = '<div class="pay-card"><div class="pay-card__head"><span class="pay-badge">Pix \u00b7 Brasil</span><strong>' + payload.amount_label + '</strong></div><p class="muted">' + payload.reference + '</p><p class="mono">' + payload.pix_key + '</p><label>Pix Copia e Cola</label><textarea class="mono" id="pix-copy" readonly>' + payload.copy_paste + '</textarea><button class="btn btn-primary" type="button" id="copy-pix">Copiar código Pix</button></div>';
      target.querySelector("#copy-pix").addEventListener("click", async function () { await navigator.clipboard.writeText(payload.copy_paste); target.querySelector("#copy-pix").textContent = "Código copiado"; });
    }
  };
  global.PaymentGateways = global.PaymentGateways || {};
  global.PaymentGateways.pix = PixGateway;
})(window);
