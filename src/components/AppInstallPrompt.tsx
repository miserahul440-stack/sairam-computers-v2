import React, { useState, useEffect } from "react";
import { Download, X, Smartphone, ArrowRight, Share, PlusSquare, Sparkles, Check, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AppInstallPromptProps {
  lang: "mr" | "en" | "hi";
}

const installTranslations = {
  mr: {
    floatingTitle: "📲 साईराम अधिकृत ॲप डाऊनलोड करा",
    floatingDesc: "तुमच्या मोबाईल स्क्रीनवर जोडा, रोज नवीन भरती फॉर्म्स आणि अपडेट्स मिळवा!",
    installBtn: "ॲप इन्स्टॉल करा",
    laterBtn: "नंतर करा",
    modalHeader: "साईराम कॉम्प्युटर ॲप इन्स्टॉल मार्गदर्शिका",
    modalSub: "आता Sairam Computers ॲप म्हणून तुमच्या मोबाईलवर वापरा. लिंक लक्षात ठेवण्याची किंवा टाईप करण्याची गरज नाही!",
    androidTitle: "🤖 अँड्रॉइड (Android / Chrome) साठी सोपे मार्ग:",
    androidStep1: "खालील 'थेट इन्स्टॉल' बटणावर क्लिक करा.",
    androidStep2: "स्क्रीनवर 'Install' किंवा 'Add to Home Screen' चा पॉपअप दिसेल, त्यावर क्लिक करा.",
    androidStep3: "ॲप तुमच्या मोबाईलच्या मुख्य मेनूमध्ये (Home) दिसेल आणि २४ तास कार्यरत राहील!",
    iosTitle: "🍎 आयफोन (Apple iPhone / Safari) साठी:",
    iosStep1: "तुमच्या सफारी (Safari) ब्राउझरच्या खालील बाजूस असलेल्या 'Share' (शेअर) 📤 बटणावर क्लिक करा.",
    iosStep2: "पर्यायांमधून खाली स्क्रोल करा आणि 'Add to Home Screen' (होम स्क्रीनवर जोडा) ➕ पर्यायावर क्लिक करा.",
    iosStep3: "वरच्या उजव्या कोपऱ्यात असलेल्या 'Add' (जोडा) बटणावर क्लिक करा. ॲप तयार होईल!",
    directInstallBtn: "⚡ थेट मोबाईल ॲप इन्स्टॉल करा",
    notPrompted: "टीप: जर थेट बटण काम करत नसेल, तर ब्राउझरच्या वरच्या उजव्या बाजूला असलेल्या ३ ठिपक्यांवर (Menu) क्लिक करून 'Install App' निवडा.",
    closeBtn: "बंद करा",
    successAlert: "साईराम कॉम्प्युटर आता तुमच्या स्क्रीनवर सुरक्षितरीत्या जोडला गेला आहे!",
  },
  en: {
    floatingTitle: "📲 Download Sairam Official App",
    floatingDesc: "Add Sairam Computers to your mobile screen for instant, 1-click access!",
    installBtn: "Install App",
    laterBtn: "Later",
    modalHeader: "Sairam Computers App Installation Guide",
    modalSub: "Install Sairam Computers as a lightweight app on your phone. No more bookmarking or long URLs!",
    androidTitle: "🤖 For Android Devices (Chrome):",
    androidStep1: "Click the 'Install Now' button below.",
    androidStep2: "When the prompt appears, tap 'Install' or 'Add to Home Screen'.",
    androidStep3: "Sairam icon will appear in your launcher menu instantly!",
    iosTitle: "🍎 For iPhone/iPad (Safari Browser):",
    iosStep1: "Tap the 'Share' button 📤 at the bottom bar of your Safari browser.",
    iosStep2: "Scroll down the menu list and select 'Add to Home Screen' ➕ option.",
    iosStep3: "Tap 'Add' in the top right corner. The Sairam app icon is installed!",
    directInstallBtn: "⚡ Direct Install on Mobile",
    notPrompted: "Note: If the install button is inactive, tap the browser's 3-dot menu icon in the top right and select 'Install app'.",
    closeBtn: "Close Guide",
    successAlert: "Sairam Computers has been added to your app drawer successfully!",
  },
  hi: {
    floatingTitle: "📲 साईराम आधिकारिक ऐप डाउनलोड करें",
    floatingDesc: "अपने मोबाइल स्क्रीन पर जोड़ें, रोज़ नए भर्ती फॉर्म और अपडेट तुरंत पाएं!",
    installBtn: "ऐप इंस्टॉल करें",
    laterBtn: "बाद में",
    modalHeader: "साईराम कंप्यूटर ऐप इंस्टॉलेशन गाइड",
    modalSub: "साईराम कंप्यूटर को ऐप की तरह अपने मोबाइल पर चलाएं। लंबे लिंक याद रखने की कोई ज़रूरत नहीं!",
    androidTitle: "🤖 एंड्रॉइड (Android / Chrome) के लिए प्रक्रिया:",
    androidStep1: "नीचे दिए गए 'डायरेक्ट इंस्टॉल' बटन पर क्लिक करें।",
    androidStep2: "दिखाई देने वाले विकल्प में 'Install' या 'Add to Home Screen' पर टैप करें।",
    androidStep3: "ऐप आपके मोबाइल के मुख्य स्क्रीन पर आइकन के रूप में जुड़ जाएगा!",
    iosTitle: "🍎 आईफोन (Apple iPhone / Safari) के लिए:",
    iosStep1: "अपने सफारी (Safari) ब्राउज़र के नीचे स्थित 'Share' (शेयर) 📤 बटन पर क्लिक करें।",
    iosStep2: "मेनू में नीचे स्क्रॉल करें और 'Add to Home Screen' (होम स्क्रीन पर जोड़ें) ➕ चुनें।",
    iosStep3: "दाहिनी ओर सबसे ऊपर 'Add' पर क्लिक करें। ऐप सफलतापूर्वक इंस्टॉल हो जाएगा!",
    directInstallBtn: "⚡ डायरेक्ट ऐप इंस्टॉल करें",
    notPrompted: "नोट: यदि डायरेक्ट बटन सक्रिय नहीं है, तो ब्राउज़र के ऊपरी दाहिने कोने में ३ डॉट्स (Menu) पर क्लिक करें और 'Install App' चुनें।",
    closeBtn: "बंद करें",
    successAlert: "साईराम कंप्यूटर अब आपके मोबाइल स्क्रीन पर उपलब्ध है!",
  }
};

export default function AppInstallPrompt({ lang }: AppInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showFloatingBanner, setShowFloatingBanner] = useState(false);
  const [showModalGuide, setShowModalGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const t = installTranslations[lang] || installTranslations.mr;

  useEffect(() => {
    // Detect iOS
    const iosCheck = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iosCheck);

    // If already in standalone/PWA installed mode, don't show prompt
    const isPWA = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone;
    if (isPWA) {
      return;
    }

    // Intercept standard PWA prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      setShowFloatingBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show banner after 3 seconds anyway if not dismissed, so iOS or non-prompted users can see guide
    const dismissed = localStorage.getItem("sairam_pwa_dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => {
        setShowFloatingBanner(true);
      }, 4000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Install trigger outcome: ${outcome}`);
      setDeferredPrompt(null);
      setIsInstallable(false);
      setShowFloatingBanner(false);
    } else {
      // No native prompt, open detailed walkthrough guide
      setShowModalGuide(true);
    }
  };

  const handleDismissBanner = () => {
    setShowFloatingBanner(false);
    // Suppress showing for 3 days to avoid user annoyance
    localStorage.setItem("sairam_pwa_dismissed", "true");
  };

  return (
    <>
      {/* 1. Animated Floating Callout Banner */}
      <AnimatePresence>
        {showFloatingBanner && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed bottom-5 left-4 right-4 md:left-auto md:right-5 md:max-w-md bg-white border-2 border-rose-500 rounded-3xl shadow-2xl p-4 z-50 overflow-hidden"
            id="pwa-floating-install-banner"
          >
            {/* Saffron flag overlay line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-amber-500"></div>
            
            <div className="flex gap-4 items-start pr-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg animate-bounce">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
                  <Sparkles className="w-2.5 h-2.5 text-rose-600 fill-rose-600" />
                  Sairam Official App
                </span>
                <h4 className="font-extrabold text-sm text-gray-900 leading-tight">
                  {t.floatingTitle}
                </h4>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  {t.floatingDesc}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-4 pt-1 border-t border-gray-100">
              <button
                onClick={handleDismissBanner}
                className="px-3 py-1.5 text-[11px] font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl cursor-pointer"
              >
                {t.laterBtn}
              </button>
              
              <button
                onClick={handleInstallClick}
                className="bg-rose-600 hover:bg-rose-700 hover:shadow-lg active:scale-95 text-white font-black text-xs px-4.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{t.installBtn}</span>
              </button>
            </div>

            <button
              onClick={handleDismissBanner}
              className="absolute top-3 right-3 text-gray-300 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Full Instructions Installation Walkthrough Modal */}
      <AnimatePresence>
        {showModalGuide && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-rose-100 relative"
              id="pwa-instructions-modal"
            >
              <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-6 text-white rounded-t-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 translate-x-12 -translate-y-4 opacity-10">
                  <Smartphone className="w-64 h-64 text-white" />
                </div>
                
                <h3 className="text-xl md:text-2xl font-black flex items-center gap-2">
                  <span>📲</span>
                  {t.modalHeader}
                </h3>
                <p className="text-xs text-rose-100 font-bold mt-1.5 max-w-lg leading-relaxed">
                  {t.modalSub}
                </p>

                <button
                  onClick={() => setShowModalGuide(false)}
                  className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Switchable platforms */}
                {isIOS ? (
                  /* iOS iPhone Specific guidelines */
                  <div className="space-y-4 bg-orange-50/50 border border-amber-100 p-5 rounded-2xl">
                    <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5 border-b border-amber-200 pb-2">
                      <span className="text-lg">🍎</span>
                      {t.iosTitle}
                    </h4>
                    <div className="space-y-3.5 text-xs text-gray-700">
                      <div className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold font-mono text-[11px] shrink-0">1</span>
                        <p className="font-semibold leading-relaxed">
                          {t.iosStep1}{" "}
                          <span className="inline-flex bg-white border border-gray-200 rounded px-1.5 py-0.5 font-bold text-gray-800">
                            <Share className="w-3 h-3 inline-block mr-1 text-blue-500" /> Share
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold font-mono text-[11px] shrink-0">2</span>
                        <p className="font-semibold leading-relaxed">
                          {t.iosStep2}{" "}
                          <span className="inline-flex bg-white border border-gray-200 rounded px-1.5 py-0.5 font-bold text-gray-800">
                            <PlusSquare className="w-3.5 h-3.5 inline-block mr-1" /> Add to Home Screen
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold font-mono text-[11px] shrink-0">3</span>
                        <p className="font-semibold leading-relaxed">
                          {t.iosStep3}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Android (Chrome) guidelines */
                  <div className="space-y-4 bg-emerald-50/30 border border-emerald-100 p-5 rounded-2xl">
                    <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5 border-b border-emerald-200 pb-2">
                      <span className="text-lg">🤖</span>
                      {t.androidTitle}
                    </h4>
                    <div className="space-y-3.5 text-xs text-gray-700">
                      <div className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold font-mono text-[11px] shrink-0">1</span>
                        <p className="font-semibold leading-relaxed">{t.androidStep1}</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold font-mono text-[11px] shrink-0">2</span>
                        <p className="font-semibold leading-relaxed">{t.androidStep2}</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold font-mono text-[11px] shrink-0">3</span>
                        <p className="font-semibold leading-relaxed">{t.androidStep3}</p>
                      </div>

                      {/* Direct Installation Action buttons inside the modal */}
                      {isInstallable && (
                        <div className="pt-3">
                          <button
                            onClick={() => {
                              handleInstallClick();
                              setShowModalGuide(false);
                            }}
                            className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-black py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            <span>{t.directInstallBtn}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Common Helper Note */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold text-gray-500 leading-relaxed space-y-2">
                  <p className="flex items-start gap-1.5 text-gray-600">
                    <ArrowRight className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{t.notPrompted}</span>
                  </p>
                  <p className="flex items-start gap-1.5 text-emerald-700 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{t.successAlert}</span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-100 p-4 rounded-b-3xl flex justify-end">
                <button
                  onClick={() => setShowModalGuide(false)}
                  className="bg-gray-950 hover:bg-gray-900 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  {t.closeBtn}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
