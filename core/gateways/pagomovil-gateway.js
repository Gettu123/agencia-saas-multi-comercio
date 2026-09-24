(function (global) {
  function formatBs(value) {
    return "Bs " + Number(value).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  const PagoMovilGateway = {
    id: "pagomovil", country: "VE", currency: "VES", label: "Pago Movil",
    formatMoney(value) { return formatBs(value); },
    generatePayload(opts) {
      const ref = String(Math.floor(10000000 + Math.random() * 89999999));
      return {
        method: "pagomovil", currency: "VES", amount: Number(opts.amount), amount_label: formatBs(opts.amount),
        reference: opts.reference, merchant: opts.merchant || "Barberia El Leon",
        bank: "0134 — Banesco", phone: "0412-0000000", rif: "J-00000000-0", payment_ref: ref,
        instructions: ["Abre tu app bancaria y elige Pago Movil", "Paga al telefono y RIF indicados", "Usa la referencia de 8 digitos", "La cita queda reservada al confirmar el pago"]
      };
    },
    renderPanel(target, payload) {
      target.innerHTML = '<div class="pay-card"><div class="pay-card__head"><span class="pay-badge">Pago Movil \u00b7 Venezuela</span><strong>' + payload.amount_label + '</strong></div><p class="muted">Garantia para reservar <em>' + payload.reference + '</em></p><dl class="kv"><div><dt>Banco</dt><dd>' + payload.bank + '</dd></div><div><dt>Telefono</dt><dd>' + payload.phone + '</dd></div><div><dt>RIF</dt><dd>' + payload.rif + '</dd></div><div><dt>Referencia</dt><dd class="mono">' + payload.payment_ref + '</dd></div></dl><button class="btn btn-primary" type="button" id="copy-pm">Copiar referencia</button><ol class="steps">' + payload.instructions.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ol></div>';
      target.querySelector("#copy-pm").addEventListener("click", async function () {
        await navigator.clipboard.writeText(payload.payment_ref);
        target.querySelector("#copy-pm").textContent = "Referencia copiada";
      });
    }
  };
  global.PaymentGateways = global.PaymentGateways || {};
  global.PaymentGateways.pagomovil = PagoMovilGateway;
})(window);
