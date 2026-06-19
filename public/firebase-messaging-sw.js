// ═══════════════════════════════════════════════════════════════
// साईराम कॉम्प्युटर - Firebase Push Notification Service Worker
// App बंद असतानाही notifications येतात
// ═══════════════════════════════════════════════════════════════

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

// App बंद असताना background message handle करतो
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload);

  const notificationTitle = payload.notification?.title || 'साईराम कॉम्प्युटर';
  const notificationBody = payload.notification?.body || 'नवीन अपडेट!';
  const data = payload.data || {};

  // Notification वर click केल्यावर कुठे जायचं ते ठरवतो
  let clickUrl = '/';
  if (data.type === 'new_job' && data.jobId) clickUrl = '/?tab=job&jobId=' + data.jobId;
  else if (data.type === 'new_announcement') clickUrl = '/?tab=home';
  else if (data.type === 'app_update' && data.appId) clickUrl = '/?tab=history';

  return self.registration.showNotification(notificationTitle, {
    body: notificationBody,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.jobId || data.announcementId || data.appId || 'sairam-notif',
    renotify: true,
    data: { url: clickUrl, ...data },
    actions: [
      { action: 'open', title: '👁️ उघडा' },
      { action: 'close', title: '✕ बंद करा' }
    ]
  });
});

// Notification वर tap → direct redirect
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const clickUrl = event.notification.data?.url || '/';
  const fullUrl = self.location.origin + clickUrl;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // आधीच app उघडं असेल तर त्याला focus करा आणि navigate करा
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({ type: 'NAVIGATE', url: clickUrl });
          return client.focus();
        }
      }
      // App बंद असेल तर नवीन window उघडा
      return clients.openWindow(fullUrl);
    })
  );
});
