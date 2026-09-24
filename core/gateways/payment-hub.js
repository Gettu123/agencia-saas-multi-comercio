(function (global) {
  const PaymentHub = {
    local: function (config) { return global.PaymentGateways[config.gateway] || global.PaymentGateways.pix; },
    chargeLocal: function (config, opts) {
      const gw = this.local(config);
      return gw.generatePayload({ amount: opts.amount, reference: opts.reference, merchant: config.brand && config.brand.name, config: config });
    },
    renderLocal: function (target, config, opts) {
      const gw = this.local(config);
      gw.renderPanel(target, this.chargeLocal(config, opts));
    },
    renderLicense: function (target, agency, tenant) {
      global.PaymentGateways.usd_license.render(target, global.PaymentGateways.usd_license.build(agency, tenant));
    }
  };
  global.PaymentHub = PaymentHub;
})(window);
