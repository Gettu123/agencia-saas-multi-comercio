(function (global) {
  const CloudSync = {
    ready: false, db: null, unsub: {},
    configUrl: function () {
      return location.pathname.indexOf("/templates/") >= 0 || location.pathname.indexOf("/admin/") >= 0 ? "../data/firebase.json" : "data/firebase.json";
    },
    init: async function () {
      try {
        const res = await fetch(this.configUrl() + "?t=" + Date.now(), { cache: "no-store" });
        if (!res.ok) return false;
        const cfg = await res.json();
        if (!cfg.enabled || !cfg.apiKey || !cfg.projectId || !global.firebase) return false;
        if (!firebase.apps.length) firebase.initializeApp(cfg);
        this.db = firebase.firestore();
        this.ready = true;
        return true;
      } catch (e) { this.ready = false; return false; }
    },
    ref: function (tenantId) { return this.db.collection("agencia").doc(tenantId); },
    pull: async function (tenantId) {
      if (!this.ready) return null;
      const snap = await this.ref(tenantId).get();
      return snap.exists ? snap.data() : null;
    },
    push: async function (tenantId, payload) {
      if (!this.ready) return;
      await this.ref(tenantId).set({ clients: payload.clients || [], bookings: payload.bookings || [], updated_at: new Date().toISOString() }, { merge: true });
    },
    alert: async function (tenantId, note) {
      if (!this.ready) return;
      const row = Object.assign({ id: note.id || String(Date.now()), title: note.title || "Novo agendamento", body: note.body || "", at: new Date().toISOString() }, note);
      await this.ref(tenantId).collection("alerts").doc(row.id).set(row);
    },
    listenAlerts: function (tenantId, onNote) {
      if (!this.ready) return function () {};
      return this.ref(tenantId).collection("alerts").orderBy("at", "desc").limit(1).onSnapshot(function (snap) {
        snap.docChanges().forEach(function (change) { if (change.type === "added") onNote(change.doc.data()); });
      });
    },
    subscribe: function (tenantId, onData) {
      if (!this.ready) return function () {};
      if (this.unsub[tenantId]) this.unsub[tenantId]();
      this.unsub[tenantId] = this.ref(tenantId).onSnapshot(function (snap) { if (snap.exists) onData(snap.data()); });
      return this.unsub[tenantId];
    }
  };
  global.CloudSync = CloudSync;
})(window);
