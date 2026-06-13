// Firebase Push Notification Service Worker
// File: public/firebase-messaging-sw.js

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

// Background notification handler
messaging.onBackgroundMessage((payload) => {
  const { title, body, icon, data } = payload.notification || {};
  const notifData = payload.data || data || {};

  self.registration.showNotification(title || '🚨 साईराम कॉम्प्युटर', {
    body: body || 'नवीन अपडेट आहे!',
    icon: icon || '/icon-192.png',
    badge: '/icon-192.png',
    tag: notifData.jobId || 'sairam-notif',
    renotify: true,
    data: notifData,
    actions: [
      { action: 'open', title: '👁️ पाहा' },
      { action: 'close', title: '✕ बंद करा' }
    ]
  });
});

// Notification click → open app at correct page
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const data = event.notification.data || {};
  
  let url = '/';
  if (data.jobId) url = `/?tab=jobs&id=${data.jobId}`;
  else if (data.schemeId) url = `/?tab=schemes&id=${data.schemeId}`;
  else if (data.serviceId) url = `/?tab=services&id=${data.serviceId}`;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.postMessage({ type: 'NAVIGATE', url });
          return client.focus();
        }
      }
      return clients.openWindow(self.location.origin + url);
    })
  );
});
