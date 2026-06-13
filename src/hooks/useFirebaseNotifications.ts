// src/hooks/useFirebaseNotifications.ts
import { useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB8DbOxDqawAt5pmIT7tW2ras76UBDdifo",
  authDomain: "sairamcomputerapp.firebaseapp.com",
  projectId: "sairamcomputerapp",
  storageBucket: "sairamcomputerapp.firebasestorage.app",
  messagingSenderId: "197160044288",
  appId: "1:197160044288:web:91389a83c0850481df95e5",
};

const VAPID_KEY = "BFaAeH3Bg2rTXhwC2yiTLx6z49fbdMxlphRsWD3-wwFzAwrVnt-YOJ6D8_zaTl86r48erL1xTjQilNf1dlnAU";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export function useFirebaseNotifications(
  onNewJob?: (data: any) => void,
  onAppUpdate?: (data: any) => void
) {
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (!("serviceWorker" in navigator)) return;

    const setupFCM = async () => {
      try {
        // Register service worker
        const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

        // Ask permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const messaging = getMessaging(app);

        // Get FCM token
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: reg,
        });

        if (token) {
          // Save token to server
          await fetch("/api/fcm/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          }).catch(() => {});
        }

        // Foreground message handler
        onMessage(messaging, (payload) => {
          const data = payload.data || {};
          const title = payload.notification?.title || "साईराम कॉम्प्युटर";
          const body = payload.notification?.body || "नवीन अपडेट!";

          // Show browser notification even when app is open
          if (Notification.permission === "granted") {
            new Notification(title, {
              body,
              icon: "/icon-192.png",
              tag: data.jobId || "sairam",
            });
          }

          // Callback for UI update
          if (data.type === "new_job" && onNewJob) onNewJob(data);
          if (data.type === "app_update" && onAppUpdate) onAppUpdate(data);
        });

      } catch (err) {
        console.log("FCM setup error:", err);
      }
    };

    setupFCM();
  }, []);
}
