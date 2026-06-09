import React, { useState } from "react";
import { UserProfile } from "../types";
import { Smartphone, ShieldCheck, Mail, User, X, ShieldCheck as ShieldIcon } from "lucide-react";

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserProfile, token: string) => void;
  lang: "mr" | "en" | "hi";
}

const loginTranslations = {
  mr: {
    title: "साईराम कॉम्प्युटर डिजिटल लॉगिन",
    subtitle: "आपले खाते बनवून सुरक्षित कागदपत्रे वॉलेट अमलात आणा",
    mobileLabel: "मोबाईल नंबर (Mobile Number)",
    mobilePlaceholder: "उदा. ९०११०८३४४०",
    mobileHint: "नवीन युजर्स आपोआप रजिस्टर केले जातील.",
    sendOtp: "ओटीपी पाठवा (Send OTP)",
    sendingOtp: "ओटीपी पाठवत आहे...",
    invalidMobile: "कृपया वैध १० अंकी मोबाईल नंबर टाका!",
    techError: "ओटीपी पाठवताना तांत्रिक त्रुटी आली.",
    otpSentMsg: "मोबाईलवर डिजिटल सुरक्षित पडताळणी ओटीपी पाठवला आहे.",
    secureVerifyTitle: "🔒 सुरक्षित पडताळणी:",
    secureVerifyDesc: "सुरक्षेसाठी नवीन नियमांनुसार OTP थेट तुमच्या अधिकृत मोबाईल नंबरवर पाठवण्यात आलेला आहे. कृपया खालील रकान्यात प्राप्त झालेला OTP भरून पडताळणी पूर्ण करावी.",
    newRegisterTitle: "स्वतःचे पूर्ण नाव (Full Name)",
    newRegisterPlaceholder: "उदा. राहुल मिसे",
    newRegisterSub: "रजिस्ट्रेशन नसेल तरच हे नाव वापरले जाईल.",
    emailLabel: "ईमेल आयडी (Email ID)",
    emailPlaceholder: "उदा. miserahul440@gmail.com",
    enterOtpLabel: "४-अंकी पडताळणी ओटीपी (Enter 4-Digit OTP)",
    enterOtpPlaceholder: "उदा. १२३४",
    backBtn: "मागे",
    completeLoginBtn: "लॉगिन पूर्ण करा",
    verifyingBtn: "व्हेरिफाय करत आहे...",
    wrongOtp: "चुकीचा ओटीपी टाकला आहे.",
    developerNoteTitle: "💡 डेव्हलपरसाठी सूचना:",
    developerNoteDesc: "प्रत्यक्ष एसएमएस ट्रिगर करण्यासाठी AI Studio Settings मध्ये FAST2SMS_API_KEY किंवा TWILIO क्रेडेंशियल्स जोडा. चाचणीसाठी, आत्ता जनरेट झालेला सुरक्षित ४-अंकी ओटीपी मुख्य AI Studio 'Logs' पॅनेल मध्ये किंवा Node terminal वर प्रिंट झाला आहे, तेथून कॉपी करून तुम्ही चाचणी करू शकता. यामुळे ॲप १००% सुरक्षित राहते व कोणताही अपरिचित युजर घुसखोरी करू शकत नाही.",
    invalidOtpMsg: "कृपया ४ अंकी ओटीपी अचूक टाका."
  },
  en: {
    title: "Sairam Computers Digital Login",
    subtitle: "Create your account to enable secure documents wallet",
    mobileLabel: "Mobile Number",
    mobilePlaceholder: "e.g. 9011083440",
    mobileHint: "New users will be registered automatically.",
    sendOtp: "Send OTP",
    sendingOtp: "Sending OTP...",
    invalidMobile: "Please enter a valid 10-digit mobile number!",
    techError: "Technical error sending OTP.",
    otpSentMsg: "Digital security verification OTP sent to your mobile.",
    secureVerifyTitle: "🔒 Secure Verification:",
    secureVerifyDesc: "For safety, the OTP is sent directly to your official mobile. Please enter the OTP below to complete verification.",
    newRegisterTitle: "Your Full Name",
    newRegisterPlaceholder: "e.g. Rahul Mise",
    newRegisterSub: "Only used for new registrations.",
    emailLabel: "Email ID",
    emailPlaceholder: "e.g. miserahul440@gmail.com",
    enterOtpLabel: "Enter 4-Digit OTP",
    enterOtpPlaceholder: "e.g. 1234",
    backBtn: "Back",
    completeLoginBtn: "Complete Login",
    verifyingBtn: "Verifying...",
    wrongOtp: "Incorrect OTP entered.",
    developerNoteTitle: "💡 Developer Note:",
    developerNoteDesc: "To trigger live SMS, add FAST2SMS_API_KEY or TWILIO credentials in AI Studio Settings. For testing, the generated secure 4-digit OTP is printed in the AI Studio 'Logs' panel or Node terminal.",
    invalidOtpMsg: "Please enter a valid 4-digit OTP."
  },
  hi: {
    title: "साईराम कंप्यूटर डिजिटल लॉगिन",
    subtitle: "सुरक्षित दस्तावेज वॉलेट का उपयोग करने के लिए अपना खाता बनाएं",
    mobileLabel: "मोबाइल नंबर (Mobile Number)",
    mobilePlaceholder: "उदा. ९०११०८३४४०",
    mobileHint: "नए उपयोगकर्ता स्वतः पंजीकृत हो जाएंगे।",
    sendOtp: "ओटीपी भेजें (Send OTP)",
    sendingOtp: "ओटीपी भेजा जा रहा है...",
    invalidMobile: "कृपया १०-अंकीय वैध मोबाइल नंबर दर्ज करें!",
    techError: "ओटीपी भेजते समय तकनीकी त्रुटि आई।",
    otpSentMsg: "मोबाइल पर डिजिटल सुरक्षा सत्यापन ओटीपी भेज दिया गया है।",
    secureVerifyTitle: "🔒 सुरक्षित सत्यापन:",
    secureVerifyDesc: "सुरक्षा के लिए नियमानुसार ओटीपी सीधे आपके मोबाइल नंबर पर भेजा गया है। कृपया नीचे दिए गए बॉक्स में ओटीपी भरकर सत्यापन पूरा करें।",
    newRegisterTitle: "आपका पूरा नाम (Full Name)",
    newRegisterPlaceholder: "उदा. राहुल मिसे",
    newRegisterSub: "रजिस्ट्रेशन न होने पर ही यह नाम उपयोग किया जाएगा।",
    emailLabel: "ईमेल आईडी (Email ID)",
    emailPlaceholder: "उदा. miserahul440@gmail.com",
    enterOtpLabel: "४-अंकीय सत्यापन ओटीपी (Enter 4-Digit OTP)",
    enterOtpPlaceholder: "उदा. १२३४",
    backBtn: "पीछे",
    completeLoginBtn: "लॉगिन पूरा करें",
    verifyingBtn: "सत्यापन किया जा रहा है...",
    wrongOtp: "गलत ओटीपी दर्ज किया गया है।",
    developerNoteTitle: "💡 डेवलपर नोट:",
    developerNoteDesc: "वास्तविक एसएमएस भेजने के लिए AI Studio Settings में FAST2SMS_API_KEY या TWILIO क्रेडेंशियल जोड़ें। परीक्षण के लिए, जनरेट किया गया ४-अंकीय ओटीपी मुख्य AI Studio 'Logs' पैनल या Node टर्मिनल पर प्रिंट किया गया है।",
    invalidOtpMsg: "कृपया ४-अंकीय सही ओटीपी दर्ज करें।"
  }
};

export default function LoginModal({ onClose, onLoginSuccess, lang }: LoginModalProps) {
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  const t = loginTranslations[lang] || loginTranslations.mr;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");

    if (!mobile || mobile.length < 10) {
      setErrorMsg(t.invalidMobile);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t.techError);
      }

      setOtpSent(true);
      setIsNewUser(!!data.isNewUser);
      setInfoMsg(data.message || t.otpSentMsg);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!otp || otp.length < 4) {
      setErrorMsg(t.invalidOtpMsg);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile,
          otp,
          name: isNewUser ? name : undefined,
          email: isNewUser ? email : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t.wrongOtp);
      }

      if (data.success && data.user && data.token) {
        onLoginSuccess(data.user, data.token);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-rose-100 shadow-2xl p-6 relative flex flex-col max-h-[92vh] overflow-y-auto animated-fade-in scrollbar-thin">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          id="close-login-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center pb-5 border-b border-gray-100">
          <span className="text-3xl">🚩</span>
          <h3 className="font-extrabold text-xl text-gray-900 mt-2">{t.title}</h3>
          <p className="text-xs text-rose-700 font-bold mt-1">{t.subtitle}</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-2.5 rounded-xl my-4 text-center">
            {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-2.5 rounded-xl my-4 text-center">
            {infoMsg}
          </div>
        )}

        {/* Phase A: Mobile Check & Send OTP */}
        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="mt-5 space-y-4">
            <div>
              <label className="text-xs font-black text-gray-700 block mb-1">{t.mobileLabel}</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3.5 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="tel"
                  maxLength={10}
                  pattern="[0-9]*"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder={t.mobilePlaceholder}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 hover:border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-200 rounded-xl text-sm font-bold font-mono outline-none transition-all"
                  required
                />
              </div>
              <span className="text-[10px] text-gray-400 font-medium block mt-1">{t.mobileHint}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-3 rounded-xl shadow-md cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-2"
              id="send-otp-btn"
            >
              <span>{loading ? t.sendingOtp : t.sendOtp}</span>
            </button>
          </form>
        ) : (
          /* Phase B: Enter OTP and profile elements if first time register */
          <form onSubmit={handleVerifyOtp} className="mt-5 space-y-4">
            <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 text-[11px] text-emerald-900 font-bold mb-3 leading-relaxed">
              🔒 <strong>{t.secureVerifyTitle}</strong> {t.secureVerifyDesc}
              <span className="block mt-1.5 pt-1.5 border-t border-emerald-200 text-[10px] text-emerald-700 font-bold leading-normal">
                💡 <strong>{t.developerNoteTitle}</strong> {t.developerNoteDesc}
              </span>
            </div>

            {/* If new registration parameters required */}
            <div className="space-y-4">
              {isNewUser && (
                <>
                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">{t.newRegisterTitle}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 w-4.5 h-4.5 text-gray-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.newRegisterPlaceholder}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 hover:border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-200 rounded-xl text-sm font-bold outline-none transition-all"
                      />
                    </div>
                    <span className="text-[9px] text-gray-400 font-bold block mt-1">{t.newRegisterSub}</span>
                  </div>

                  <div>
                    <label className="text-xs font-black text-gray-700 block mb-1">{t.emailLabel}</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-4.5 h-4.5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.emailPlaceholder}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 hover:border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-200 rounded-xl text-xs font-mono outline-none transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-black text-gray-700 block mb-1">{t.enterOtpLabel}</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3.5 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="text"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder={t.enterOtpPlaceholder}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 hover:border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-200 rounded-xl text-sm font-black font-mono tracking-widest outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-1/3 border border-gray-300 text-gray-600 font-bold text-xs py-3 rounded-xl hover:bg-gray-50 cursor-pointer active:scale-95"
              >
                {t.backBtn}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-3 rounded-xl shadow-md cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                id="verify-otp-btn"
              >
                <span>{loading ? t.verifyingBtn : t.completeLoginBtn}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
