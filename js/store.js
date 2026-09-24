(function (global) {
  function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch (e) { return fallback; } }
  function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  const Store = {
    clientsKey: function (id) { return "agency.clients." + id; },
    bookingsKey: function (id) { return "agency.bookings." + id; },
    normalizePhone: function (phone) { return String(phone || "").replace(/\D/g, ""); },
    listClients: function (tenantId) { return read(this.clientsKey(tenantId), []); },
    listBookings: function (tenantId) { return read(this.bookingsKey(tenantId), []); },
    applyRemote: function (tenantId, data) {
      if (!data) return;
      if (data.clients) write(this.clientsKey(tenantId), data.clients);
      if (data.bookings) write(this.bookingsKey(tenantId), data.bookings);
      global.dispatchEvent(new CustomEvent("agency:data", { detail: { tenantId: tenantId } }));
    },
    sync: function (tenantId) {
      if (!global.CloudSync || !CloudSync.ready) return;
      CloudSync.push(tenantId, { clients: this.listClients(tenantId), bookings: this.listBookings(tenantId) }).catch(function () {});
    },
    saveBookings: function (tenantId, items) { write(this.bookingsKey(tenantId), items); this.sync(tenantId); },
    upsertClient: function (tenantId, data) {
      const id = this.normalizePhone(data.phone);
      if (!id) return null;
      const list = this.listClients(tenantId);
      var row = list.find(function (c) { return c.phone === id; });
      if (!row) { row = { phone: id, name: data.name, points: 0, visits: 0, fijo: false }; list.push(row); }
      else if (data.name) row.name = data.name;
      write(this.clientsKey(tenantId), list);
      this.sync(tenantId);
      return row;
    },
    findClient: function (tenantId, phone) {
      const id = this.normalizePhone(phone);
      return this.listClients(tenantId).find(function (c) { return c.phone === id; }) || null;
    },
    addPoints: function (tenantId, phone, points) {
      const list = this.listClients(tenantId);
      const id = this.normalizePhone(phone);
      const row = list.find(function (c) { return c.phone === id; });
      if (!row) return null;
      row.points = (row.points || 0) + Number(points || 0);
      row.visits = (row.visits || 0) + 1;
      write(this.clientsKey(tenantId), list);
      this.sync(tenantId);
      return row;
    },
    addBooking: function (tenantId, booking) {
      const items = this.listBookings(tenantId);
      items.unshift(booking);
      this.saveBookings(tenantId, items);
      return booking;
    },
    setStatus: function (tenantId, bookingId, status) {
      const items = this.listBookings(tenantId).map(function (b) { return b.id === bookingId ? Object.assign({}, b, { status: status }) : b; });
      this.saveBookings(tenantId, items);
      return items;
    }
  };
  global.Store = Store;
})(window);
