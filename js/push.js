(function (global) {
  function cfgUrl() {
    return location.pathname.indexOf("/templates/") >= 0 || location.pathname.indexOf("/admin/") >= 0 ? "../data/firebase.json" : "data/firebase.json";
  }
  function swUrl() {
    return location.pathname.indexOf("/templates/") >= 0 || location.pathname.indexOf("/admin/") >= 0 ? "../firebase-messaging-sw.js" : "./firebase-messaging-sw.js";
  }
  const PushNote = {
    token: null,
    boot: async function (tenantId, role) {
      if (!("Notification" in window) || !global.firebase || !firebase.messaging) return null;
      const res = await fetch(cfgUrl() + "?t=" + Date.now(), { cache: "no-store" });
      const cfg = await res.json();
      if (!cfg.enabled || !cfg.apiKey) return null;
      if (!firebase.apps.length) firebase.initializeApp(cfg);
      if (Notification.permission === "default") await Notification.requestPermission();
      if (Notification.permission !== "granted") return null;
      try { await navigator.serviceWorker.register(swUrl()); } catch (e) {}
      const messaging = firebase.messaging();
      if (cfg.vapidKey) {
        try { this.token = await messaging.getToken({ vapidKey: cfg.vapidKey }); } catch (e) { this.token = null; }
      }
      if (this.token && global.CloudSync && CloudSync.ready) {
        await CloudSync.db.collection("agencia").doc(tenantId).collection("tokens").doc(this.token.slice(-20)).set({
          token: this.token, role: role || "owner", at: new Date().toISOString()
        });
      }
      messaging.onMessage(function (payload) {
        PushNote.local((payload.notification && payload.notification.title) || "Agenda", (payload.notification && payload.notification.body) || "", payload.data || {});
      });
      return this.token;
    },
    local: function (title, body, data) {
      if (Notification.permission !== "granted") return;
      const n = new Notification(title, { body: body, tag: (data && data.id) || "agenda", data: data || {} });
      n.onclick = function () { window.focus(); n.close(); };
    }
  };
  global.PushNote = PushNote;
})(window);
