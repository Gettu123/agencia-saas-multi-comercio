(function (global) {
  const dict = {
    pt: {
      product: "Agendamento com Garantia e Fidelidade",
      login_title: "Entrar no painel",
      login_subtitle: "Use as credenciais do comercio.",
      email: "E-mail", password: "Senha", enter: "Entrar",
      blocked_title: "Licenca suspensa",
      blocked_lead: "O acesso deste comercio esta bloqueado ate a regularizacao da licenca mensal em USD.",
      dashboard: "Agenda", loyalty: "Fidelidade", guarantee: "Garantia",
      new_booking: "Novo agendamento", client: "Cliente", service: "Servico", when: "Horario",
      confirm_pay: "Reservar com garantia", logout: "Sair", upcoming: "Proximos horarios",
      points: "pontos", empty: "Nenhum agendamento ainda.", payment_method: "Pagamento local"
    },
    es: {
      product: "Agendamiento con Garantia y Fidelidad",
      login_title: "Entrar al panel",
      login_subtitle: "Usa las credenciales del comercio.",
      email: "Correo", password: "Contrasena", enter: "Entrar",
      blocked_title: "Licencia suspendida",
      blocked_lead: "El acceso de este comercio esta bloqueado hasta regularizar la licencia mensual en USD.",
      dashboard: "Agenda", loyalty: "Fidelidad", guarantee: "Garantia",
      new_booking: "Nueva cita", client: "Cliente", service: "Servicio", when: "Horario",
      confirm_pay: "Reservar con garantia", logout: "Salir", upcoming: "Proximas citas",
      points: "puntos", empty: "Aun no hay citas.", payment_method: "Pago local"
    }
  };
  global.I18N = { t: function (lang, key) { return (dict[lang] || dict.pt)[key] || key; }, dict: dict };
})(window);
