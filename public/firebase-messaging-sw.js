// साईराम कॉम्प्युटर — Firebase Messaging Service Worker
// App पूर्णपणे बंद असतानाही notification येते

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB8DbOxDqawAt5pmIT7tW2ras76UBDdifo",
  authDomain: "sairamcomputerapp.firebaseapp.com",
  projectId: "sairamcomputerapp",
  storageBucket: "sairamcomputerapp.firebasestorage.app",
  messagingSenderId: "197160044288",
  appId: "1:197160044288:web:91389a83c0850481df95e5"
});

const messaging = firebase.messaging();

// App बंद असताना background notification
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'साईराम कॉम्प्युटर';
  const body = payload.notification?.body || 'नवीन अपडेट!';
  const data = payload.data || {};

  const clickUrl = data.jobId
    ? `/?tab=job&jobId=${data.jobId}`
    : data.announcementId
    ? `/?tab=home`
    : '/';

  return self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.jobId || data.announcementId || 'sairam',
    renotify: true,
    data: { url: clickUrl },
  });
});

// Notification tap → redirect
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = self.location.origin + (event.notification.data?.url || '/');
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ('focus' in client) {
          client.postMessage({ type: 'NAVIGATE', url: event.notification.data?.url || '/' });
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
