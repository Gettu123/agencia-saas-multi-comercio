(function (global) {
  function formatBRL(value) {
    return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  const PixGateway = {
    id: "pix", country: "BR", currency: "BRL", label: "Pix",
    formatMoney(value) { return formatBRL(value); },
    generatePayload(opts) {
      const amount = opts.amount, reference = opts.reference, merchant = opts.merchant;
      const txid = "AGN" + Date.now().toString(36).toUpperCase();
      return {
        method: "pix", currency: "BRL", amount: Number(amount), amount_label: formatBRL(amount),
        reference: reference, merchant: merchant || "Studio Aurora Beleza",
        pix_key: "agencia.saas@pix.example", txid: txid,
        copy_paste: "00020126580014BR.GOV.BCB.PIX0136agencia.saas@pix.example52040000530398654" + Number(amount).toFixed(2) + "5802BR5925AGENCIA SAAS MULTI TENANT6009SAO PAULO62070503***6304DEMO",
        instructions: ["Abra o aplicativo do seu banco", "Escolha Pix Copia e Cola", "Cole o codigo e confirme o valor da garantia", "O horario fica reservado apos a confirmacao"]
      };
    },
    renderPanel(target, payload) {
      target.innerHTML = '<div class="pay-card"><div class="pay-card__head"><span class="pay-badge">Pix \u00b7 Brasil</span><strong>' + payload.amount_label + '</strong></div><p class="muted">Garantia para reservar <em>' + payload.reference + '</em></p><div class="pix-qr" aria-hidden="true"><span>QR DEMO</span></div><label class="field-label">Pix Copia e Cola</label><textarea class="mono" id="pix-copy" readonly>' + payload.copy_paste + '</textarea><button class="btn btn-primary" type="button" id="copy-pix">Copiar codigo Pix</button><ol class="steps">' + payload.instructions.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ol></div>';
      target.querySelector("#copy-pix").addEventListener("click", async function () {
        await navigator.clipboard.writeText(payload.copy_paste);
        target.querySelector("#copy-pix").textContent = "Codigo copiado";
      });
    }
  };
  global.PaymentGateways = global.PaymentGateways || {};
  global.PaymentGateways.pix = PixGateway;
})(window);
