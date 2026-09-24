importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");
fetch("./data/firebase.json").then(function (res) { return res.json(); }).then(function (cfg) {
  if (!cfg.apiKey) return;
  firebase.initializeApp(cfg);
  firebase.messaging();
}).catch(function () {});
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var url = event.notification.data && event.notification.data.url;
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    if (list.length) return list[0].focus();
    if (url) return self.clients.openWindow(url);
  }));
});
