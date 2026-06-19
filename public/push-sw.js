// Sairam Computers - Push Notification Service Worker
// Plain Web Push API — no external libraries imported, so it cannot break
// due to a third-party script failing to load. Works even when the
// website tab / app is fully closed, as long as the device has internet.

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    payload = { notification: { title: "साईराम कॉम्प्युटर", body: event.data ? event.data.text() : "नवीन अपडेट!" } };
  }

  const notification = payload.notification || {};
  const data = payload.data || {};

  const title = notification.title || "साईराम कॉम्प्युटर";
  const options = {
    body: notification.body || "नवीन अपडेट आहे!",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: data.jobId || data.announcementId || data.appId || "sairam-notif",
    renotify: true,
    data: data,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const data = event.notification.data || {};

  let url = "/";
  if (data.type === "new_job" && data.jobId) url = "/?tab=job&jobId=" + data.jobId;
  else if (data.type === "new_announcement") url = "/?tab=home";
  else if (data.type === "app_update" && data.appId) url = "/?tab=history&appId=" + data.appId;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.postMessage({ type: "NAVIGATE", url: url });
          return client.focus();
        }
      }
      return clients.openWindow(self.location.origin + url);
    })
  );
});
