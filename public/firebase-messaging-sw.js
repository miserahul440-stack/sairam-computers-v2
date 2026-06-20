// साईराम कॉम्प्युटर - Web Push Service Worker
// App बंद असतानाही notifications येतात

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    payload = { title: "साईराम कॉम्प्युटर", body: event.data ? event.data.text() : "नवीन अपडेट!" };
  }

  const title = payload.title || "साईराम कॉम्प्युटर";
  const options = {
    body: payload.body || "नवीन अपडेट आहे!",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: payload.data?.jobId || payload.data?.announcementId || "sairam-notif",
    renotify: true,
    data: { url: payload.url || "/", ...payload.data },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  const fullUrl = url.startsWith("http") ? url : self.location.origin + url;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          client.postMessage({ type: "NAVIGATE", url });
          return client.focus();
        }
      }
      return clients.openWindow(fullUrl);
    })
  );
});
