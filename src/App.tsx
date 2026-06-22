import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import NewsTicker from "./components/NewsTicker";
import JobSection from "./components/JobSection";
import ServicesSection from "./components/ServicesSection";
import DocumentWallet from "./components/DocumentWallet";
import ApplicationHistory from "./components/ApplicationHistory";
import AdminPanel from "./components/AdminPanel";
import LoginModal from "./components/LoginModal";
import ApplyModal from "./components/ApplyModal";
import AppInstallPrompt from "./components/AppInstallPrompt";
import CategoryBentoBlocks from "./components/CategoryBentoBlocks";
import { UserProfile, JobPost, Announcement, FormApplication } from "./types";
import { Phone, Mail, HelpCircle, ShieldAlert, Cpu, Sparkles, CheckCircle, Smartphone, User, ShieldCheck } from "lucide-react";
// OneSignal handles push notifications

const appTranslations = {
  mr: {
    heroTitle: "सर्व शासकीय ऑनलाईन अर्ज आणि भरती फॉर्म अचूक भरून मिळतील!",
    heroBadge: "🚩 अधिकृत ऑनलाईन सेवा केंद्र",
    heroDesc: "स्कॉलरशिप, ऍडमिशन, पीएम किसान, पिक विमा, नवीन पॅन कार्ड, तसेच सर्व नोकर भरतीचे अर्ज अत्यंत खात्रीशीररित्या कमीत कमी सेवा दरात साईराम कॉम्प्युटरवर भरले जातील.",
    secureWallet: "परत परत अपलोडची गरज नाही (सेक्युअर वॉलेट)",
    qrPayment: "ऑनलाईन QR द्वारे पेमेंट मुभा",
    ownerLabel: "मालक स्वतः",
    ownerSub: "Sairam Computers Operations Owner",
    contactEmail: "ईमेल आयडी",
    contactPhone: "मोबाईल",
    contactPhoneTitle: "कॉल करा",
    contactWaTitle: "व्हॉट्सॲप",
    footerTitle: "🚩 साईराम कॉम्प्युटर",
    footerRights: "© २०२६ Sairam Computers. सर्वाधिकार सुरक्षित.",
    footerDev: "डिझाईन व ऑटोमेशन: राहुल मिसे (९०११०८३४४० / miserahul440@gmail.com)",
    adminLoginLink: "⚙️ ॲडमीन लॉगिन",
    adminPromptHeader: "साईराम ॲडमीन सुरक्षा लॉगिन",
    adminPromptDesc: "हा विभाग फक्त राहुल मिसे सरांसाठी आहे. इतर ग्राहकांनी या पर्यायाचा वापर करू नये.",
    passwordLabel: "ॲडमीन ४-अंकी पासवर्ड:",
    passwordPlaceholder: "उदा. ९०११",
    passwordHint: "💡 चाचणी पासवर्ड (Owner Mobile First Prefix): ९०११",
    unlockAdminBtn: "पॅनेल उघडा (Unlock Admin)",
    ownerName: "राहुल मिसे",
    ownerPhone: "९०११०८३४४०",
    syncSystemTitle: "⚡ रिअल-टाईम क्लाउड सिंक्रोनाइज (Auto-Sync Technology)",
    syncSystemDesc: "राहुल सरांनी नवीन नोकरी किंवा योजना जोडल्यास ती तुमच्या ॲपमध्ये आपोआप एका सेकंदात विना-अपडेट किंवा विना-इन्स्टॉलेशन रिअल-टाईम दिसते! ॲप वारंवार अपडेट करायची गरज ग्राहकांना अजिबात उरणार नाही.",
    serverConnected: "● सर्व्हर कनेक्टेड: ऑटो-अपडेट्स सुरू आहेत",
    bentoHeader: "⚡ शासकीय योजना व सेवा कॅटेगरी",
    bentoSub: "तुम्हाला ज्या कॅटेगरीचा फॉर्म भरायचा आहे, त्या मुख्य ब्लॉकवर क्लिक करा आणि सेकंदात अचूक माहिती पाहून त्वरित अर्ज करा!"
  },
  en: {
    heroTitle: "All Government Online Applications & Recruitment Forms Filled Accurately!",
    heroBadge: "🚩 Official Online Service Center",
    heroDesc: "Scholarships, college admissions, PM Kisan, crop insurance, new PAN cards, and all government/private job recruitment forms are completed reliably at the lowest service rates by Sairam Computers.",
    secureWallet: "No repetitive uploads needed (Secure Wallet)",
    qrPayment: "Easy UPI / QR Code Digital Payments",
    ownerLabel: "Service Provider (Owner)",
    ownerSub: "Sairam Computers Owner & Operator",
    contactEmail: "Email Address",
    contactPhone: "Mobile Number",
    contactPhoneTitle: "Call Now",
    contactWaTitle: "WhatsApp",
    footerTitle: "🚩 Sairam Computers",
    footerRights: "© 2026 Sairam Computers. All rights reserved.",
    footerDev: "Design & Automation: Rahul Mise (+91 9011083440 / miserahul440@gmail.com)",
    adminLoginLink: "⚙️ Admin Login",
    adminPromptHeader: "Sairam Security Admin Login",
    adminPromptDesc: "This control panel is exclusive to Rahul Mise. Customers must not attempt login.",
    passwordLabel: "Admin 4-digit Password:",
    passwordPlaceholder: "e.g. 9011",
    passwordHint: "💡 Default Pass (Owner Mobile Prefix): 9011",
    unlockAdminBtn: "Unlock Admin Control Panel",
    ownerName: "Rahul Mise",
    ownerPhone: "9011083440",
    syncSystemTitle: "⚡ Real-Time Cloud Synchronization (Auto-Sync Technology)",
    syncSystemDesc: "Any updates or new schemes posted by Sairam Computers appear instantly on your device without registering or performing any application updates.",
    serverConnected: "● Server Connected: Auto-Updates Active",
    bentoHeader: "⚡ Government Schemes & Services Categories",
    bentoSub: "Click on any category block below to instantly review criteria, fees, and submit your form."
  },
  hi: {
    heroTitle: "सभी सरकारी ऑनलाइन आवेदन और भर्ती फॉर्म पूरी सटीकता के साथ भरे जाएंगे!",
    heroBadge: "🚩 आधिकारिक ऑनलाइन सेवा केंद्र",
    heroDesc: "सभी सरकारी ऑनलाइन आवेदन और भर्ती फॉर्म पूरी सटीकता के साथ भरे जाएंगे!",
    secureWallet: "बार-बार अपलोड की आवश्यकता नहीं (सुरक्षित वॉलेट)",
    qrPayment: "ऑनलाइन क्यूआर / यूपीआई डिजिटल भुगतान",
    ownerLabel: "स्वयं संचालक",
    ownerSub: "Sairam Computers के मालिक और संचालक",
    contactEmail: "ईमेल पता",
    contactPhone: "मोबाइल नंबर",
    contactPhoneTitle: "कॉल करें",
    contactWaTitle: "व्हाट्सएप",
    footerTitle: "🚩 साईराम कॉम्प्युटर",
    footerRights: "© २०२६ Sairam Computers. सर्वाधिकार सुरक्षित।",
    footerDev: "डिजाइन और स्वचालन: राहुल मिसे (९०११०८३४४० / miserahul440@gmail.com)",
    adminLoginLink: "⚙️ एडमिन लॉगिन",
    adminPromptHeader: "साईराम एडमिन सुरक्षा लॉगिन",
    adminPromptDesc: "यह अनुभाग केवल राहुल मिसे सर के लिए है। अन्य ग्राहकों को इसका उपयोग नहीं करना चाहिए।",
    passwordLabel: "एडमिन ४-अंकीय पासवर्ड:",
    passwordPlaceholder: "उदा. ९०११",
    passwordHint: "💡 परीक्षण पासवर्ड (सैमसंग मोबाइल प्रीफिक्स): ९०११",
    unlockAdminBtn: "नियंत्रण खोलें (Unlock Admin)",
    ownerName: "राहुल मिसे",
    ownerPhone: "९०११०८३४४०",
    syncSystemTitle: "⚡ रियल-टाइम क्लाउड सिंक्रोनाइजेशन (Auto-Sync Technology)",
    syncSystemDesc: "राहुल सर द्वारा कोई नया अपडेट या योजना जोड़े जाने पर वह बिना किसी ऐप अपडेट के तुरंत आपके मोबाइल पर दिखाई देती है।",
    serverConnected: "● सर्वर कनेक्टेड: ऑटो-अपडेट्स सक्रिय हैं",
    bentoHeader: "⚡ सरकारी योजनाएं और सेवाएं श्रेणियां",
    bentoSub: "आप जिस श्रेणी का फॉर्म भरना चाहते हैं, उस पर क्लिक करके तुरंत पूरी जानकारी देखें और सीधे आवेदन करें!"
  }
};

export default function App() {
  const [lang, setLang] = useState<"mr" | "en" | "hi" >(() => {
    return (localStorage.getItem("sairam_lang") as "mr" | "en" | "hi") || "mr";
  });

  const [flagClicks, setFlagClicks] = useState(0);
  const [adminRevealed, setAdminRevealed] = useState(() => {
    return localStorage.getItem("sairam_admin_revealed") === "true" || window.location.search.includes("admin=true");
  });

  // Session holders
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminOtpSent, setAdminOtpSent] = useState(false);

  // DB datasets
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [applications, setApplications] = useState<FormApplication[]>([]); // For currently logged user
  const [adminApplications, setAdminApplications] = useState<FormApplication[]>([]); // For admin only

  // UI state
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState<"job" | "student" | "farmer" | "other" | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedServiceToApply, setSelectedServiceToApply] = useState<any>(null);
  const [selectedJobToApply, setSelectedJobToApply] = useState<JobPost | null>(null);

  // Real-time notification popup
  const [realtimePopup, setRealtimePopup] = useState<{title: string; body: string; type: string; jobId?: string; announcementId?: string} | null>(null);

  // Automatically reset selected category and scroll smoothly to top when tab changes
  useEffect(() => {
    setSelectedCategory(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  const t = appTranslations[lang] || appTranslations.mr;

  const handleFlagClick = () => {
    const nextClicks = flagClicks + 1;
    setFlagClicks(nextClicks);
    if (nextClicks >= 5) {
      const targetState = !adminRevealed;
      setAdminRevealed(targetState);
      localStorage.setItem("sairam_admin_revealed", targetState ? "true" : "false");
      setFlagClicks(0);
      alert(
        targetState 
          ? "🔒 ॲडमीन लॉगिन पर्याय आता उघडला आहे! / Admin login switcher is now revealed!" 
          : "🔒 ॲडमीन लॉगिन पर्याय आता लपविला आहे! / Admin login switcher is now hidden!"
      );
    }
  };

  const handleChangeLang = (newLang: "mr" | "en" | "hi") => {
    setLang(newLang);
    localStorage.setItem("sairam_lang", newLang);
  };

  // Load initial states from localStore
  useEffect(() => {
    const savedUser = localStorage.getItem("sairam_user");
    const savedToken = localStorage.getItem("sairam_token");
    const savedAdmin = sessionStorage.getItem("sairam_admin_active");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    if (savedAdmin === "true") {
      setIsAdminLoggedIn(true);
    }

    // ── NAVIGATE from Push Notification tap ──
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NAVIGATE') {
        const url = event.data.url || '/';
        const params = new URLSearchParams(url.split('?')[1] || '');
        const tab = params.get('tab');
        const jobId = params.get('jobId');
        if (tab) setActiveTab(tab);
        if (jobId) {
          // Find and open the job
          fetchJobs().then?.(() => {});
        }
      }
    };
    navigator.serviceWorker?.addEventListener('message', handleSWMessage);

        fetchJobs();
    fetchAnnouncements();

    // ── OneSignal Push Notifications ──
    (async () => {
      try {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
          script.defer = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("OneSignal script failed to load"));
          document.head.appendChild(script);
        });

        const w = window as any;
        w.OneSignalDeferred = w.OneSignalDeferred || [];
        w.OneSignalDeferred.push(async (OneSignal: any) => {
          await OneSignal.init({
            appId: "341b005d-9ed0-41c7-99b1-fd97b553ac95",
            notifyButton: { enable: false },
            allowLocalhostAsSecureOrigin: true,
            serviceWorkerParam: { scope: "/" },
          });
          console.log("[OneSignal] Ready ✅");
        });
      } catch (err: any) {
        console.log("[OneSignal] Setup skipped:", err?.message);
      }
    })();

    // ── REAL-TIME SSE CONNECTION ──
    const connectSSE = () => {
      const es = new EventSource("/api/events");

      es.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);

          if (msg.type === "new_job") {
            fetchJobs(); // Refresh jobs list instantly
            fetchAnnouncements();
            // Show popup
            setRealtimePopup({
              type: "job",
              title: "🚨 नवीन भरती जाहीर!",
              body: `${msg.data.title} — ${msg.data.vacancies} जागा`,
              jobId: msg.data.id
            });
            // Browser notification
            if (Notification.permission === "granted") {
              const n = new Notification("🚨 नवीन भरती जाहीर!", {
                body: `${msg.data.title} — ${msg.data.vacancies} जागा`,
                icon: "/icon-192.png",
                tag: msg.data.id || "job-notif",
              });
              n.onclick = () => {
                window.focus();
                setActiveTab("job");
                n.close();
              };
            }
            setTimeout(() => setRealtimePopup(null), 6000);
          }

          if (msg.type === "app_status") {
            fetchMyApplications();
            setRealtimePopup({
              type: "status",
              title: "✅ अर्जाची स्थिती अपडेट झाली!",
              body: `${msg.data.title || "अर्ज"} — ${msg.data.status}`
            });
            if (Notification.permission === "granted") {
              new Notification("✅ अर्जाची स्थिती बदलली!", {
                body: `${msg.data.title || "अर्ज"} — ${msg.data.status}`,
                icon: "/icon-192.png"
              });
            }
            setTimeout(() => setRealtimePopup(null), 6000);
          }

          if (msg.type === "new_announcement") {
            fetchAnnouncements();
            setRealtimePopup({
              type: "announcement",
              title: "📢 नवीन घोषणा!",
              body: msg.data.title
            });
            if (Notification.permission === "granted") {
              new Notification("📢 नवीन घोषणा!", {
                body: msg.data.title,
                icon: "/icon-192.png"
              });
            }
            setTimeout(() => setRealtimePopup(null), 6000);
          }
        } catch(err) {}
      };

      es.onerror = () => {
        es.close();
        setTimeout(connectSSE, 5000); // Reconnect after 5s
      };

      return es;
    };

    // Request browser notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const es = connectSSE();
    return () => es.close();
  }, []);

  // Fetch applications if user session is active
  useEffect(() => {
    if (token) {
      fetchMyApplications();
    } else {
      setApplications([]);
    }
  }, [token]);

  // Fetch all applications if admin logged in
  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchAdminApplications();
    }
  }, [isAdminLoggedIn]);

  // API Call: Fetch standard jobs database
  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs");
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (err) {
      console.error("Error fetching jobs database", err);
    }
  };

  // API Call: Fetch news bulletins announcements
  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/announcements");
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (err) {
      console.error("Error fetching announcements ticker", err);
    }
  };

  // API Call: Get My Applied Forms
  const fetchMyApplications = async () => {
    try {
      const response = await fetch("/api/applications/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (err) {
      console.error("Error fetching user applications", err);
    }
  };

  // API Call: Read all client applications (Admin panel only)
  const fetchAdminApplications = async () => {
    try {
      const response = await fetch("/api/admin/applications", {
        headers: {
          "x-admin-token": "SairamAdmin@9011",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAdminApplications(data);
      }
    } catch (err) {
      console.error("Error fetching admin dashboard logs", err);
    }
  };

  // Authentication callbacks
  const handleLoginSuccess = (loggedInUser: UserProfile, loginToken: string) => {
    setUser(loggedInUser);
    setToken(loginToken);
    localStorage.setItem("sairam_user", JSON.stringify(loggedInUser));
    localStorage.setItem("sairam_token", loginToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("sairam_user");
    localStorage.removeItem("sairam_token");
    setActiveTab("home");
  };

  // Admin login with username + password (no OTP)
  const handleAdminVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "rahul_admin", password: adminPassword }),
      });
      if (response.ok) {
        setIsAdminLoggedIn(true);
        sessionStorage.setItem("sairam_admin_active", "true");
        setActiveTab("admin");
        setAdminPassword("");
      } else {
        const data = await response.json();
        setAdminError(data.error || "चुकीचा पासवर्ड!");
      }
    } catch (err) {
      setAdminError("सर्व्हरशी जोडणी करण्यात अडचण आली.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem("sairam_admin_active");
    setAdminOtpSent(false);
    if (activeTab === "admin") setActiveTab("home");
  };

  // Trigger Apply modality
  const handleApplyServiceTrigger = (service: any) => {
    if (!user) {
      setSelectedServiceToApply(service);
      setSelectedJobToApply(null);
      setShowLoginModal(true);
    } else {
      setSelectedServiceToApply(service);
      setSelectedJobToApply(null);
      setShowApplyModal(true);
    }
  };

  const handleApplyJobTrigger = (job: JobPost) => {
    if (!user) {
      setSelectedJobToApply(job);
      setSelectedServiceToApply(null);
      setShowLoginModal(true);
    } else {
      setSelectedJobToApply(job);
      setSelectedServiceToApply(null);
      setShowApplyModal(true);
    }
  };

  // Update user model cache from wallet changes nested
  const handleUpdateUser = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem("sairam_user", JSON.stringify(newUser));
  };

  // Open login on fly
  const handlePostLoginModalSequence = () => {
    if (selectedServiceToApply) {
      setShowApplyModal(true);
    } else if (selectedJobToApply) {
      setShowApplyModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">

      {/* ── REAL-TIME NOTIFICATION POPUP ── */}
      {realtimePopup && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] w-[92vw] max-w-sm animate-bounce-in">
          <div
            className={`rounded-2xl shadow-2xl p-4 border-2 flex items-start gap-3 cursor-pointer active:scale-95 transition-transform ${realtimePopup.type === "job" ? "bg-rose-600 border-rose-400 text-white" : realtimePopup.type === "announcement" ? "bg-amber-600 border-amber-400 text-white" : "bg-emerald-600 border-emerald-400 text-white"}`}
            onClick={() => {
              if (realtimePopup.type === "job") {
                setActiveTab("job");
                // Scroll to job section after tab switch
                setTimeout(() => {
                  const el = realtimePopup.jobId 
                    ? document.getElementById(`job-${realtimePopup.jobId}`)
                    : document.getElementById("jobs-section");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 300);
              } else if (realtimePopup.type === "announcement") {
                setActiveTab("home");
                setTimeout(() => {
                  document.getElementById("latest-updates-block")?.scrollIntoView({ behavior: "smooth" });
                }, 300);
              } else if (realtimePopup.type === "status") {
                setActiveTab("history");
              }
              setRealtimePopup(null);
            }}
          >
            <span className="text-2xl">{realtimePopup.type === "job" ? "🚨" : realtimePopup.type === "announcement" ? "📢" : "✅"}</span>
            <div className="flex-1">
              <p className="font-black text-sm">{realtimePopup.title}</p>
              <p className="text-xs font-bold opacity-90 mt-0.5">{realtimePopup.body}</p>
              <p className="text-[10px] opacity-75 mt-1 font-bold">👆 टॅप करा → थेट उघडेल</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setRealtimePopup(null); }}
              className="text-white/70 hover:text-white font-black text-lg leading-none cursor-pointer"
            >×</button>
          </div>
        </div>
      )}

      {/* 1. Header Layout */}
      <Header
        user={user}
        onLogout={handleLogout}
        onOpenLogin={() => setShowLoginModal(true)}
        onOpenAdmin={() => setActiveTab("admin")}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogout={handleAdminLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        onChangeLang={handleChangeLang}
        adminRevealed={adminRevealed}
        onFlagClick={handleFlagClick}
      />

      {/* 2. Scrolling announcements ticker */}
      <NewsTicker announcements={announcements} lang={lang} />

      {/* 3. Main Dashboard block */}
      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow w-full">

        {activeTab === "home" && (
          <div className="space-y-8 animate-fade-in animate-duration-300">
            {/* 1.6 Latest Updates Section */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6" id="latest-updates-block">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-rose-50 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
                    <span className="text-xs font-black text-rose-600 tracking-wider uppercase font-mono">
                      {lang === "mr" ? "थेट अपडेट्स" : lang === "hi" ? "लाइव अपडेट" : "Live Announcements"}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight mt-1">
                    {lang === "mr" ? "नवीन जॉब आणि डिजिटल योजना अपडेट्स" : lang === "hi" ? "नई नौकरियां और डिजिटल योजना अपडेट" : "Latest Government Jobs & Schemes"}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">
                    {lang === "mr" ? "सध्या सुरू असलेले सर्वात महत्त्वाचे अर्ज व नोकरभरती फॉर्म्स खालीलप्रमाणे आहेत. त्वरित माहिती पहा व अर्ज करा!" : lang === "hi" ? "वर्तमान में सक्रिय सबसे महत्वपूर्ण ऑनलाइन आवेदन और भर्ती फॉर्म नीचे दिए गए हैं।" : "Explore the newly launched government recruitment drives and digital forms."}
                  </p>
                </div>
              </div>

              {/* Grid of latest jobs & services */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Column A: Latest active jobs */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2">
                    <span className="text-lg">💼</span>
                    <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider font-mono">
                      {lang === "mr" ? "ताज्या नोकरभरती जाहिराती" : lang === "hi" ? "नई सरकारी नौकरियां" : "Latest Active Recruitments"}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {jobs.length > 0 ? (
                      jobs.slice(0, 3).map((job) => {
                        const displayedTitle = lang === "mr" && job.titleMR ? job.titleMR : lang === "hi" && job.titleHI ? job.titleHI : job.title;
                        const displayedDept = lang === "mr" && job.departmentMR ? job.departmentMR : lang === "hi" && job.departmentHI ? job.departmentHI : job.department;
                        const displayedQual = lang === "mr" && job.qualificationMR ? job.qualificationMR : lang === "hi" && job.qualificationHI ? job.qualificationHI : job.qualification;
                        const displayedAge = lang === "mr" && job.ageLimitMR ? job.ageLimitMR : lang === "hi" && job.ageLimitHI ? job.ageLimitHI : job.ageLimit;
                        const displayedDocs: string[] = (lang === "mr" && job.mandatedDocs ? job.mandatedDocs : job.mandatedDocs || job.importantDocuments) || [];
                        const displayedPosts = job.posts || [];
                        return (
                          <div
                            key={job.id}
                            className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-4 transition-all duration-305 hover:shadow-md flex flex-col gap-2.5"
                          >
                            <div>
                              <div className="flex justify-between items-start gap-2">
                                <span className="bg-amber-100 text-amber-800 font-extrabold text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-amber-200">
                                  {job.totalVacancies} {lang === "mr" ? "जागा" : lang === "hi" ? "पद" : "Posts"}
                                </span>
                                <span className="text-[10px] text-gray-400 font-bold font-mono">
                                  {lang === "mr" ? "शेवटची तारीख:" : lang === "hi" ? "अंतिम तिथि:" : "Last Date:"} {job.lastDate}
                                </span>
                              </div>
                              <h5 className="font-extrabold text-xs md:text-sm text-slate-800 mt-2">
                                {displayedTitle}
                              </h5>
                              <p className="text-[10px] text-gray-400 font-bold mt-1">
                                {displayedDept}
                              </p>
                            </div>

                            {/* Full details right here on the front page */}
                            <div className="grid grid-cols-1 gap-1.5 text-[10px] font-semibold text-slate-600 border-t border-slate-100 pt-2.5">
                              {displayedQual && (
                                <div className="flex items-start gap-1.5">
                                  <span>🎓</span>
                                  <span>{displayedQual}</span>
                                </div>
                              )}
                              {displayedAge && (
                                <div className="flex items-start gap-1.5">
                                  <span>🎂</span>
                                  <span>{displayedAge}</span>
                                </div>
                              )}
                              {job.startDate && (
                                <div className="flex items-start gap-1.5">
                                  <span>📅</span>
                                  <span>{lang === "mr" ? "अर्ज सुरुवात:" : "Start:"} {job.startDate}</span>
                                </div>
                              )}
                              {displayedPosts.length > 0 && (
                                <div className="flex items-start gap-1.5">
                                  <span>📋</span>
                                  <span>{displayedPosts.map((p: any) => `${p.nameMR || p.name}: ${p.vacancy}`).join(" | ")}</span>
                                </div>
                              )}
                              {displayedDocs.length > 0 && (
                                <div className="flex items-start gap-1.5">
                                  <span>📎</span>
                                  <span>{displayedDocs.join(", ")}</span>
                                </div>
                              )}
                              <div className="flex items-start gap-1.5">
                                <span>💰</span>
                                <span>
                                  {lang === "mr" ? "खुला" : "Open"}: ₹{job.feeGeneral} | {lang === "mr" ? "मागास" : "Reserved"}: ₹{job.feeReserved} | {lang === "mr" ? "सेवा शुल्क" : "Service Fee"}: ₹{job.serviceCharge}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-end border-t border-slate-100 pt-2.5">
                              <button
                                onClick={() => {
                                  setActiveTab("job");
                                  handleApplyJobTrigger(job);
                                }}
                                className="bg-slate-900 hover:bg-rose-600 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                🚀 {lang === "mr" ? "अर्ज करा" : lang === "hi" ? "आवेदन करें" : "Apply Now"}
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-gray-400 italic">No job postings found.</p>
                    )}
                  </div>
                </div>

                {/* Column B: Latest Digital Schemes */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2">
                    <span className="text-lg">🌟</span>
                    <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider font-mono">
                      {lang === "mr" ? "नवीन डिजिटल योजना आणि दाखले" : lang === "hi" ? "नई डिजिटल योजना और प्रमाण पत्र" : "New Digital Citizen Schemes / Certificates"}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        key: "mahadbt-scholarship",
                        category: "student",
                        title: "MahaDBT Scholarship form (महाडीबीटी)",
                        titleMR: "महाडीबीटी स्कॉलरशिप फॉर्म (MahaDBT)",
                        titleHI: "महाडीबीटी छात्रवृत्ति फॉर्म (MahaDBT)",
                        desc: "Submit online scholarship applications for SC, ST, OBC, VJNT, SBC, and EBC students.",
                        descMR: "महाविद्यालयातील सर्व मागासवर्गीय व आर्थिकदृष्ट्या दुर्बल घटकातील विद्यार्थ्यांसाठी शासकीय शिष्यवृत्तीचा अर्ज भरणे.",
                        descHI: "कॉलेज के सभी पिछड़े और आर्थिक रूप से कमजोर वर्ग के छात्रों के लिए सरकारी छात्रवृत्ति का आवेदन भरना।",
                        badge: lang === "mr" ? "नवीन" : lang === "hi" ? "नया" : "NEW",
                        fee: 100,
                        docs: ["aadhar", "marksheet", "income", "photo", "signature"]
                      },
                      {
                        key: "pik-vima",
                        category: "farmer",
                        title: "Pradhan Mantri Crop Insurance (PMFBY)",
                        titleMR: "पिक विमा ऑनलाईन नोंदणी (१ रुपया पिक विमा)",
                        titleHI: "पीएम फसल बीमा ऑनलाइन (₹1 में बीमा)",
                        desc: "Secure crop insurance at just Rs. 1 for crop loss due to state natural disasters.",
                        descMR: "नैसर्गिक आपत्तीमुळे पिकांचे नुकसान झाल्यास नुकसान भरपाई मिळण्यासाठी १ रुपयात किसान पिक विमा अर्ज सादर करणे.",
                        descHI: "प्राकृतिक आपदा से फसल नुकसान होने पर भरपाई पाने के लिए केवल १ रुपये के टोकन पर प्रधानमंत्री फसल बीमा ऑनलाइन रजिस्ट्रेशन।",
                        badge: lang === "mr" ? "अपडेट" : lang === "hi" ? "अपडेट" : "UPDATED",
                        fee: 50,
                        docs: ["aadhar"]
                      }
                    ].map((srv) => {
                      const titleStr = lang === "mr" ? srv.titleMR : lang === "hi" ? srv.titleHI : srv.title;
                      const descStr = lang === "mr" ? srv.descMR : lang === "hi" ? srv.descHI : srv.desc;
                      return (
                        <div 
                          key={srv.key}
                          className="bg-white border border-slate-200 hover:border-rose-400 rounded-2xl p-4 transition-all duration-305 hover:shadow-md flex flex-col justify-between h-[155px]"
                        >
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <span className="bg-rose-100 text-rose-800 font-extrabold text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-rose-200">
                                {srv.badge}
                              </span>
                              <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded capitalize font-mono border border-slate-200">
                                {srv.category}
                              </span>
                            </div>
                            <h5 className="font-extrabold text-xs md:text-sm text-slate-800 mt-2 line-clamp-1">
                              {titleStr}
                            </h5>
                            <p className="text-[10px] text-gray-500 font-medium line-clamp-2 mt-1">
                              {descStr}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-2">
                            <span className="text-[10px] font-bold text-slate-400">
                              💸 {lang === "mr" ? "सर्व्हिस शुल्क:" : lang === "hi" ? "सेवा शुल्क:" : "Service Fee:"} ₹{srv.fee}
                            </span>
                            <button
                              onClick={() => {
                                handleApplyServiceTrigger({
                                  key: srv.key,
                                  title: srv.title,
                                  titleMR: srv.titleMR,
                                  titleHI: srv.titleHI,
                                  description: srv.desc,
                                  descriptionMR: srv.descMR,
                                  descriptionHI: srv.descHI,
                                  serviceCharge: srv.fee,
                                  mandatedDocs: srv.docs,
                                  fields: []
                                });
                              }}
                              className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              🚀 {lang === "mr" ? "अर्ज करा" : lang === "hi" ? "आवेदन करें" : "Apply Now"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* 1.5 Beautiful Services Bento Menu Block */}
            <div className="bg-white border border-rose-50 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="mb-4">
                <h3 className="text-lg font-black text-slate-800">{t.bentoHeader}</h3>
                <p className="text-xs text-rose-850 text-gray-500 font-bold mt-1">
                  {t.bentoSub}
                </p>
              </div>
              <CategoryBentoBlocks 
                onSelectCategory={(cat) => {
                  setActiveTab(cat);
                }} 
                lang={lang} 
              />
            </div>


          </div>
        )}

        {/* Tab dedicated Government Job Recruitments */}
        {activeTab === "job" && (
          <div className="animate-fade-in space-y-4">
            <JobSection jobs={jobs} onApplyJob={handleApplyJobTrigger} lang={lang} />
          </div>
        )}

        {/* Tab student college forms */}
        {activeTab === "student" && (
          <div className="animate-fade-in space-y-4">
            <ServicesSection category="student" onApplyService={handleApplyServiceTrigger} lang={lang} />
          </div>
        )}

        {/* Tab farmer welfare schemes */}
        {activeTab === "farmer" && (
          <div className="animate-fade-in space-y-4">
            <ServicesSection category="farmer" onApplyService={handleApplyServiceTrigger} lang={lang} />
          </div>
        )}

        {/* Tab other card services */}
        {activeTab === "other" && (
          <div className="animate-fade-in space-y-4">
            <ServicesSection category="other" onApplyService={handleApplyServiceTrigger} lang={lang} />
          </div>
        )}

        {/* Tab secure documents wallet */}
        {activeTab === "wallet" && user && (
          <DocumentWallet user={user} token={token} onUpdateUser={handleUpdateUser} />
        )}

        {/* Tab applied forms tracker / history */}
        {activeTab === "history" && user && (
          <ApplicationHistory applications={applications} onRefreshApplications={fetchMyApplications} token={token} />
        )}

        {/* Tab admin panel */}
        {activeTab === "admin" && (
          <div className="space-y-6">
            {!isAdminLoggedIn ? (
              /* Secured login interface for Rahul Mise */
              <div className="max-w-md mx-auto bg-white rounded-3xl border border-rose-100 shadow-xl p-6 mt-12 text-center">
                <span className="text-4xl block">🔒</span>
                <h3 className="font-extrabold text-lg text-gray-900 mt-2">साईराम ॲडमीन सुरक्षा लॉगिन</h3>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto font-medium">
                  फक्त अधिकृत ॲडमीन (राहुल मिसे) साठी
                </p>

                {adminError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-2.5 rounded-xl my-4 text-center">
                    {adminError}
                  </div>
                )}

                <form onSubmit={handleAdminVerify} className="mt-5 space-y-4 text-left">
                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">पासवर्ड</label>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Admin पासवर्ड टाका"
                      className="w-full px-4 py-3 border border-gray-200 focus:border-rose-600 rounded-xl text-sm font-bold outline-none transition-all"
                      required
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-sm py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    🔓 ॲडमीन पॅनेल उघडा
                  </button>
                </form>
              </div>
            ) : (
              /* Unlocked admin metrics console */
              <AdminPanel
                adminToken="SairamAdmin@9011"
                applications={adminApplications}
                jobs={jobs}
                announcements={announcements}
                onRefreshAll={() => {
                  fetchAdminApplications();
                  fetchJobs();
                  fetchAnnouncements();
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* 3.1 Beautiful Operator Badge & Contact Info moved to the bottom of the content container */}
      {["home", "student", "farmer", "other"].includes(activeTab) && (
        <div className="max-w-7xl mx-auto px-4 pb-8 w-full">
          <div className="bg-white border border-rose-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 border border-rose-100 shrink-0">
                <User className="w-8 h-8 text-rose-500" />
              </div>
              <div>
                <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                  {t.ownerLabel}
                </span>
                <h4 className="font-extrabold text-base text-gray-900 mt-1">{t.ownerName}</h4>
                <p className="text-[10px] text-gray-500 font-bold mt-0.5">{t.ownerSub}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto text-xs font-bold text-gray-700">
              <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl flex flex-col justify-center">
                <span className="text-[9px] text-gray-400 font-black tracking-wider uppercase block">{t.contactPhone}</span>
                <a href="tel:+919011083440" className="text-gray-900 font-bold font-mono hover:text-rose-600 mt-0.5">{t.ownerPhone}</a>
              </div>
              <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl flex flex-col justify-center">
                <span className="text-[9px] text-gray-400 font-black tracking-wider uppercase block">{t.contactEmail}</span>
                <a href="mailto:miserahul440@gmail.com" className="text-gray-900 font-bold font-mono hover:text-rose-600 mt-0.5">miserahul440@gmail.com</a>
              </div>

              <div className="flex items-center gap-2 justify-center pt-2 sm:pt-0">
                <a 
                  href="tel:+919011083440" 
                  className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-sm hover:shadow transition-all flex items-center gap-1.5"
                >
                  📞 {t.contactPhoneTitle}
                </a>
                <a 
                  href="https://wa.me/919011083440?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%B0%E0%A4%BE%E0%A4%B9%E0%A5%81%E0%A4%B2%20%E0%A4%B8%E0%A4%B0" 
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-sm hover:shadow transition-all flex items-center gap-1.5"
                >
                  💬 {t.contactWaTitle}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Footers Layout */}
      <footer className="bg-white border-t border-rose-100 py-8 px-4 mt-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 font-medium">
          <div className="text-center md:text-left space-y-1">
            <p className="font-extrabold text-sm text-gray-800">
              {t.footerTitle}
            </p>
            <p className="text-gray-400 font-semibold">
              {t.footerRights}
            </p>
            <p className="text-[10px] text-gray-400 font-bold italic leading-relaxed">
              {t.footerDev}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-gray-600">
            <a href="tel:+919011083440" className="hover:text-rose-600">📞 {t.contactPhoneTitle}</a>
            <span>|</span>
            <a
              href="https://wa.me/919011083440?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%B0%E0%A4%BE%E0%A4%B9%E0%A5%81%E0%A4%B2%20%E0%A4%B8%E0%A4%B0"
              target="_blank"
              rel="noreferrer"
              className="hover:text-green-600"
            >
              💬 {t.contactWaTitle}
            </a>
            
            {/* Admin log in triggers ONLY visible if revealed */}
            {adminRevealed && (
              <>
                <span>|</span>
                <button onClick={() => setActiveTab("admin")} className="hover:text-rose-600 cursor-pointer text-xs font-bold">
                  {t.adminLoginLink}
                </button>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* 5. Authentication popup Overlay */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={(loggedInUser, loginToken) => {
            handleLoginSuccess(loggedInUser, loginToken);
            handlePostLoginModalSequence();
          }}
          lang={lang}
        />
      )}

      {/* 6. Form interactive submit Overlay */}
      {showApplyModal && user && (
        <ApplyModal
          user={user}
          token={token}
          service={selectedServiceToApply}
          job={selectedJobToApply}
          onClose={() => {
            setShowApplyModal(false);
            setSelectedServiceToApply(null);
            setSelectedJobToApply(null);
          }}
          onApplySuccess={() => {
            fetchMyApplications();
            setActiveTab("history");
          }}
          lang={lang}
        />
      )}

      {/* 7. Installer prompt guide for Mobile screens */}
      <AppInstallPrompt lang={lang} />
    </div>
  );
}
