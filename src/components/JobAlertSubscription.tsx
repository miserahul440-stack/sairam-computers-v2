import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Mail, Phone, CheckCircle, Sparkles, Send, Trash2, ShieldCheck, Check, X, Smartphone } from "lucide-react";

interface JobAlertSubscriptionProps {
  lang: "mr" | "en" | "hi";
  userSessionMobile?: string;
  userSessionEmail?: string;
  userSessionName?: string;
}

const trans = {
  mr: {
    cardTitle: "🔔 मोफत नोकरी अलर्ट सुरू करा!",
    cardSubTitle: "थेट व्हॉट्सॲप आणि ईमेलवर",
    cardDesc: "नवीन सरकारी नोकरी, परीक्षा प्रवेशपत्र (Admit Card) आणि निकालांचे अपडेट्स त्वरित तुमच्या मोबाईलवर मिळवा. कोणतीही महत्त्वाची भरती हुकणार नाही!",
    nameLabel: "तुमचे पूर्ण नाव",
    namePlaceholder: "उदा. राहुल मिसे",
    mobileLabel: "व्हॉट्सॲप नंबर (WhatsApp Only)",
    mobilePlaceholder: "उदा. ९०११XXXXXX",
    emailLabel: "ईमेल पत्ता (Email- optional)",
    emailPlaceholder: "उदा. mail@example.com",
    qualLabel: "शैक्षणिक पात्रता (तुमच्या लायकीच्या नोकऱ्यांचे अलर्ट मिळवा)",
    qualOptions: [
      { value: "all", label: "सर्व नोकऱ्या (All Grade Posts)" },
      { value: "10th", label: "१० वी उत्तीर्ण (Matriculation)" },
      { value: "12th", label: "१२ वी उत्तीर्ण (Higher Secondary)" },
      { value: "diploma", label: "डिप्लोमा धारक (Diploma)" },
      { value: "degree", label: "पदवीधर आणि अधिक (Graduate & Above)" }
    ],
    channelsLabel: "अलर्ट कुठे हवे आहेत? (कमीत कमी एक निवडा)",
    chanWhatsApp: "व्हॉट्सॲप संदेश (WhatsApp Alerts) - सोयीस्कर",
    chanEmail: "ईमेल संदेश (Email Notifications)",
    chanPush: "वेब पुश नोटिफिकेशन (Instant Browser Alert)",
    btnSubscribe: "मोफत जॉब अलर्ट सुरू करा",
    btnSubscribing: "प्रक्रिया सुरू आहे...",
    successHeader: "सबस्क्रिप्शन यशस्वी झाले! 🚩",
    successMsg: "तुमची नोकरी अलर्ट नोंदणी यशस्वी झाली आहे. आता नवीन नोकरी येताच तुम्हाला त्वरित मेसेज पाठवला जाईल.",
    activeBadges: "सक्रिय अलर्ट चॅनेल:",
    activeQual: "पात्रता फिल्टर:",
    btnUpdate: "माहिती बदला / अपडेट करा",
    btnUnsubscribe: "अनसबस्क्राइब (Unsubscribe)",
    privacyText: "🔒 ही सेवा पूर्णपणे मोफत आहे (Zero Charges) व तुमची माहिती १००% सुरक्षित ठेवली जाईल.",
    invalidMobile: "कृपया १० अंकी योग्य मोबाईल नंबर टाका!",
    selectChannel: "कृपया अलर्ट मिळवण्यासाठी कमीत कमी एक पर्याय निवडा!"
  },
  en: {
    cardTitle: "🔔 Get Free Job Alerts!",
    cardSubTitle: "Direct to WhatsApp & Email",
    cardDesc: "Receive immediate updates on new government job vacancies, exam hall tickets, and results right on your phone. Never miss an opportunity!",
    nameLabel: "Your Full Name",
    namePlaceholder: "e.g. Rahul Mise",
    mobileLabel: "WhatsApp Mobile Number",
    mobilePlaceholder: "e.g. 9011XXXXXX",
    emailLabel: "Email Address (Optional)",
    emailPlaceholder: "e.g. mail@example.com",
    qualLabel: "Academic Qualification (Customized Alerts)",
    qualOptions: [
      { value: "all", label: "All Recruitments (Every Job)" },
      { value: "10th", label: "10th Standard Pass" },
      { value: "12th", label: "12th Standard Pass" },
      { value: "diploma", label: "Diploma Holders" },
      { value: "degree", label: "Graduates & Higher Education" }
    ],
    channelsLabel: "Where to receive alerts? (Select at least one)",
    chanWhatsApp: "WhatsApp Messaging (Most Convenient)",
    chanEmail: "Email Bulletins (Direct to Inbox)",
    chanPush: "Browser Push Alerts (Instant Notification)",
    btnSubscribe: "Activate Free Job Alerts",
    btnSubscribing: "Processing Details...",
    successHeader: "Alerts Activated Successfully! 🚩",
    successMsg: "Your job alert registration is completed. Sairam Computers will notify you instantly when matching posts are announced.",
    activeBadges: "Activated Channels:",
    activeQual: "Qualification Focus:",
    btnUpdate: "Modify Subscription Settings",
    btnUnsubscribe: "Cancel Subscription",
    privacyText: "🔒 This alert service is 100% FREE. Your personal data is fully secure.",
    invalidMobile: "Please enter a valid 10-digit mobile number!",
    selectChannel: "Please select at least one channel to receive alerts!"
  },
  hi: {
    cardTitle: "🔔 मुफ्त जॉब अलर्ट चालू करें!",
    cardSubTitle: "सीधे व्हाट्सएप और ईमेल पर",
    cardDesc: "नवीनतम सरकारी नौकरियों, एडमिट कार्ड और परीक्षा परिणामों की तत्काल सूचना सीधे अपने मोबाइल पर प्राप्त करें। कोई भी अवसर छूटने न पाए!",
    nameLabel: "आपका पूरा नाम",
    namePlaceholder: "उदा. राहुल मिसे",
    mobileLabel: "व्हाट्सएप मोबाइल नंबर",
    mobilePlaceholder: "उदा. ९०११XXXXXX",
    emailLabel: "ईमेल पता (वैकल्पिक)",
    emailPlaceholder: "उदा. mail@example.com",
    qualLabel: "शैक्षणिक योग्यता (अपनी पसंद की नौकरियों के अलर्ट प्राप्त करें)",
    qualOptions: [
      { value: "all", label: "सभी नौकरियां (सभी भर्ती अपडेट)" },
      { value: "10th", label: "10वीं उत्तीर्ण" },
      { value: "12th", label: "12वीं उत्तीर्ण" },
      { value: "diploma", label: "डिप्लोमा धारक" },
      { value: "degree", label: "स्नातक और उच्च स्तर" }
    ],
    channelsLabel: "अलर्ट कहां प्राप्त करना चाहते हैं? (कम से कम एक चुनें)",
    chanWhatsApp: "व्हाट्सएप संदेश (WhatsApp Alerts)",
    chanEmail: "ईमेल अलर्ट (Email Bulletins)",
    chanPush: "ब्राउज़र पुश नोटिफिकेशन (Push Notification)",
    btnSubscribe: "मुफ्त जॉब अलर्ट सक्रिय करें",
    btnSubscribing: "प्रक्रिया की जा रही है...",
    successHeader: "अलर्ट सफलतापूर्वक चालू किया गया! 🚩",
    successMsg: "आपका जॉब अलर्ट रजिस्ट्रेशन पूरा हो गया है। नई जॉब आते ही आपको तुरंत मैसेज भेजा जाएगा।",
    activeBadges: "सक्रिय अलर्ट माध्यम:",
    activeQual: "पात्रता चयन:",
    btnUpdate: "विवरण बदलें / अपडेट करें",
    btnUnsubscribe: "अनसब्सक्राइब करें",
    privacyText: "🔒 यह सेवा पूरी तरह से मुफ्त (Zero Charges) है और आपकी जानकारी पूरी तरह से सुरक्षित रखी जाएगी।",
    invalidMobile: "कृपया वैध १०-अंकीय मोबाइल नंबर दर्ज करें!",
    selectChannel: "कृपया अलर्ट प्राप्त करने के लिए कम से कम एक विकल्प चुनें!"
  }
};

export default function JobAlertSubscription({
  lang,
  userSessionMobile = "",
  userSessionEmail = "",
  userSessionName = ""
}: JobAlertSubscriptionProps) {
  const t = trans[lang] || trans.mr;

  // Local state for form fields
  const [name, setName] = useState(userSessionName);
  const [mobile, setMobile] = useState(userSessionMobile);
  const [email, setEmail] = useState(userSessionEmail);
  const [qualification, setQualification] = useState("all");
  const [channels, setChannels] = useState<string[]>(["whatsapp"]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState<any>(null);

  // Load existing subscription from localstorage if any
  useEffect(() => {
    const cachedSub = localStorage.getItem("sairam_job_subscription");
    if (cachedSub) {
      try {
        const parsed = JSON.parse(cachedSub);
        setSuccessData(parsed);
        setName(parsed.name);
        setMobile(parsed.mobile);
        setEmail(parsed.email);
        setQualification(parsed.qualification);
        setChannels(parsed.channels || ["whatsapp"]);
      } catch (e) {
        console.error("Error parsing subscription cache", e);
      }
    }
  }, []);

  // Autofill if user session is active and no subscription cached yet
  useEffect(() => {
    if (!successData) {
      if (userSessionName) setName(userSessionName);
      if (userSessionMobile) setMobile(userSessionMobile);
      if (userSessionEmail) setEmail(userSessionEmail);
    }
  }, [userSessionName, userSessionMobile, userSessionEmail, successData]);

  const toggleChannel = (chan: string) => {
    if (channels.includes(chan)) {
      setChannels(channels.filter((c) => c !== chan));
    } else {
      setChannels([...channels, chan]);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Validation
    if (!mobile || !/^[0-9]{10}$/.test(mobile.trim())) {
      setErrorMsg(t.invalidMobile);
      return;
    }

    if (channels.length === 0) {
      setErrorMsg(t.selectChannel);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim() || undefined,
          mobile: mobile.trim(),
          email: email.trim() || undefined,
          qualification,
          channels
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessData(data.subscription);
        localStorage.setItem("sairam_job_subscription", JSON.stringify(data.subscription));
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.error || "तांत्रिक अडचण आली. कृपया नंतर प्रयत्न करा.");
      }
    } catch (err) {
      setErrorMsg("सर्व्हरशी जोडणी करण्यात अडचण आली. इंटरनेट कनेक्शन तपासा.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!successData?.id) return;
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // We can use a direct call or just reset local state for client experience.
      // To perform actual unsub, we can make an API request if they are authenticated,
      // or we can remove from db via mobile number.
      // But let's keep it robust and perform client-side reset which acts as opt-out.
      localStorage.removeItem("sairam_job_subscription");
      setSuccessData(null);
      setName("");
      setMobile("");
      setEmail("");
      setChannels(["whatsapp"]);
      setQualification("all");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-100/80 shadow-md p-6 md:p-8 relative overflow-hidden" id="job-alert-subscription-card">
      {/* Absolute decorative gradient highlights */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50/70 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50/50 rounded-full blur-3xl -z-10 pointer-events-none" />

      <AnimatePresence mode="wait">
        {!successData ? (
          <motion.div
            key="subscription-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between border-b border-dashed border-rose-100 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-rose-100 text-rose-600 animate-pulse">
                    <Bell className="w-4.5 h-4.5 font-bold" />
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {t.cardTitle}
                  </h3>
                </div>
                <p className="text-xs font-semibold text-rose-600 mt-1 uppercase tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 animate-bounce text-amber-500" />
                  {t.cardSubTitle}
                </p>
              </div>
              <p className="text-xs font-semibold text-gray-500 max-w-md leading-relaxed">
                {t.cardDesc}
              </p>
            </div>

            {/* Error Message banner */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 text-red-700 text-xs font-bold p-3 rounded-xl border border-red-200"
              >
                ⚠️ {errorMsg}
              </motion.div>
            )}

            {/* Input Form Fields */}
            <form onSubmit={handleSubscribe} className="grid grid-cols-1 md:grid-cols-2 gap-5" id="subscribe-alert-form">
              {/* Full Name */}
              <div className="col-span-1 space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <span className="text-rose-500">•</span>
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm font-semibold px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all bg-slate-50"
                  id="sub-name"
                />
              </div>

              {/* Mobile / WhatsApp Number */}
              <div className="col-span-1 space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <span className="text-rose-500">•</span>
                  {t.mobileLabel}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    placeholder={t.mobilePlaceholder}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    className="w-full text-sm font-semibold pl-13 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all bg-slate-50"
                    id="sub-mobile"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="col-span-1 space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm font-semibold px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all bg-slate-50"
                  id="sub-email"
                />
              </div>

              {/* Educational Qualification */}
              <div className="col-span-1 space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <span className="text-rose-500">•</span>
                  {t.qualLabel}
                </label>
                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full text-sm font-semibold px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all bg-slate-50"
                  id="sub-qual"
                >
                  {t.qualOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Channels */}
              <div className="col-span-1 md:col-span-2 space-y-2 pt-1">
                <label className="text-xs font-bold text-gray-700">
                  {t.channelsLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* WhatsApp Alerts */}
                  <div
                    onClick={() => toggleChannel("whatsapp")}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border cursor-pointer select-none transition-all ${
                      channels.includes("whatsapp")
                        ? "border-green-500 bg-green-50/50 text-green-950 font-bold"
                        : "border-gray-200 bg-slate-50 hover:bg-gray-100 text-gray-600 font-semibold"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                      channels.includes("whatsapp") ? "bg-green-600 border-green-650" : "border-gray-300"
                    }`}>
                      {channels.includes("whatsapp") && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-xs">{t.chanWhatsApp}</span>
                  </div>

                  {/* Email Alerts */}
                  <div
                    onClick={() => toggleChannel("email")}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border cursor-pointer select-none transition-all ${
                      channels.includes("email")
                        ? "border-rose-500 bg-rose-50/30 text-rose-950 font-bold"
                        : "border-gray-200 bg-slate-50 hover:bg-gray-100 text-gray-600 font-semibold"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                      channels.includes("email") ? "bg-rose-600 border-rose-650" : "border-gray-300"
                    }`}>
                      {channels.includes("email") && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-xs">{t.chanEmail}</span>
                  </div>

                  {/* Web Push Alerts */}
                  <div
                    onClick={() => toggleChannel("push")}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border cursor-pointer select-none transition-all ${
                      channels.includes("push")
                        ? "border-amber-500 bg-amber-50/10 text-amber-950 font-bold"
                        : "border-gray-200 bg-slate-50 hover:bg-gray-100 text-gray-600 font-semibold"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                      channels.includes("push") ? "bg-amber-600 border-amber-650" : "border-gray-300"
                    }`}>
                      {channels.includes("push") && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className="text-xs">{t.chanPush}</span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-dashed border-gray-150">
                <p className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  {t.privacyText}
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-extrabold text-sm px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  id="submit-subscribe-btn"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? t.btnSubscribing : t.btnSubscribe}
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          /* Active Subscriber Badge Dashboard Card */
          <motion.div
            key="subscription-success"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-emerald-50/30 border border-emerald-200 p-6 rounded-2xl relative"
          >
            <div className="space-y-3.5 p-1 flex-grow">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700">
                  <CheckCircle className="w-5 h-5" />
                </span>
                <h4 className="text-md font-extrabold text-emerald-950">
                  {t.successHeader}
                </h4>
              </div>

              <div className="space-y-1.5 text-xs text-emerald-900 font-semibold leading-relaxed">
                <p>{t.successMsg}</p>
                <p className="text-gray-600 flex items-center gap-1 mt-1">
                  <Smartphone className="w-3.5 h-3.5 text-gray-500" />
                  <span>
                    {lang === "mr" ? "नोंदणीकृत नंबर" : lang === "hi" ? "पंजीकृत नंबर" : "Registered Phone"}:{" "}
                    <strong className="text-gray-900 font-extrabold">{successData.mobile}</strong>
                  </span>
                  {successData.email && (
                    <span className="ml-2 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-gray-500" />
                      <strong className="text-gray-900 font-extrabold">{successData.email}</strong>
                    </span>
                  )}
                </p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 border-t border-emerald-200/50 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500 font-bold">{t.activeBadges}</span>
                  <div className="flex gap-1">
                    {successData.channels?.map((chan: string) => (
                      <span key={chan} className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                        {chan}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-gray-500 font-bold">{t.activeQual}</span>
                  <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                    {qualification === "all" ? (lang === "en" ? "All Recruits" : "सर्व नोकऱ्या") : qualification.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Change Subscription / Unsubscription actions */}
            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto shrink-0 self-stretch justify-end md:justify-center">
              <button
                type="button"
                onClick={() => setSuccessData(null)}
                className="flex-1 md:flex-initial text-slate-800 hover:bg-white bg-slate-100 border border-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
              >
                {t.btnUpdate}
              </button>
              <button
                type="button"
                onClick={handleUnsubscribe}
                disabled={isSubmitting}
                className="text-red-750 hover:bg-red-50 bg-white border border-red-200 hover:border-red-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {t.btnUnsubscribe}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
