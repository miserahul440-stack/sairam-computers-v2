import React, { useState } from "react";
import { UserProfile } from "../types";
import { Smartphone, Lock, User, X, Eye, EyeOff, HelpCircle, KeyRound } from "lucide-react";

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserProfile, token: string) => void;
  lang: "mr" | "en" | "hi";
}

const t = {
  mr: {
    loginTitle: "साईराम कॉम्प्युटर लॉगिन",
    loginSub: "आपले खाते उघडा",
    registerTitle: "नवीन खाते बनवा",
    registerSub: "साईराम कॉम्प्युटर मध्ये स्वागत आहे",
    forgotTitle: "पासवर्ड विसरलात?",
    forgotSub: "सुरक्षा प्रश्नाचे उत्तर द्या",
    mobile: "मोबाईल नंबर",
    mobilePh: "१० अंकी मोबाईल नंबर",
    password: "पासवर्ड",
    passwordPh: "किमान ६ अक्षरे",
    newPassword: "नवीन पासवर्ड",
    confirmPassword: "पासवर्ड पुन्हा टाका",
    name: "पूर्ण नाव",
    namePh: "उदा. राहुल मिसे",
    secQuestion: "सुरक्षा प्रश्न निवडा",
    secAnswer: "उत्तर",
    secAnswerPh: "प्रश्नाचे उत्तर टाका",
    loginBtn: "लॉगिन करा",
    registerBtn: "खाते बनवा",
    resetBtn: "पासवर्ड बदला",
    loggingIn: "लॉगिन होत आहे...",
    registering: "खाते बनवत आहे...",
    resetting: "पासवर्ड बदलत आहे...",
    noAccount: "नवीन खाते बनवा",
    haveAccount: "आधीच खाते आहे? लॉगिन करा",
    forgotPassword: "पासवर्ड विसरलात?",
    backToLogin: "← परत लॉगिन वर",
    passMatch: "दोन्ही पासवर्ड सारखे असणे आवश्यक आहे!",
    passShort: "पासवर्ड किमान ६ अक्षरांचा असावा!",
    mobileInvalid: "कृपया १० अंकी मोबाईल नंबर टाका!",
    allFields: "कृपया सर्व माहिती भरा!",
    resetSuccess: "पासवर्ड यशस्वीरित्या बदलला! आता लॉगिन करा.",
    questions: [
      "तुमच्या आईचे नाव काय आहे?",
      "तुमचे गाव / शहर कोणते आहे?",
      "तुमच्या शाळेचे नाव काय आहे?",
      "तुमचा आवडता विषय कोणता आहे?",
      "तुमच्या वडिलांचे नाव काय आहे?",
    ],
  },
  en: {
    loginTitle: "Sairam Computers Login",
    loginSub: "Access your account",
    registerTitle: "Create New Account",
    registerSub: "Welcome to Sairam Computers",
    forgotTitle: "Forgot Password?",
    forgotSub: "Answer your security question",
    mobile: "Mobile Number",
    mobilePh: "10-digit mobile number",
    password: "Password",
    passwordPh: "Minimum 6 characters",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    name: "Full Name",
    namePh: "e.g. Rahul Mise",
    secQuestion: "Select Security Question",
    secAnswer: "Answer",
    secAnswerPh: "Enter your answer",
    loginBtn: "Login",
    registerBtn: "Create Account",
    resetBtn: "Reset Password",
    loggingIn: "Logging in...",
    registering: "Creating account...",
    resetting: "Resetting...",
    noAccount: "Create new account",
    haveAccount: "Already have account? Login",
    forgotPassword: "Forgot password?",
    backToLogin: "← Back to Login",
    passMatch: "Both passwords must match!",
    passShort: "Password must be at least 6 characters!",
    mobileInvalid: "Please enter a valid 10-digit mobile number!",
    allFields: "Please fill all fields!",
    resetSuccess: "Password reset successfully! Please login.",
    questions: [
      "What is your mother's name?",
      "What is your village/city?",
      "What is your school name?",
      "What is your favourite subject?",
      "What is your father's name?",
    ],
  },
  hi: {
    loginTitle: "साईराम कंप्यूटर लॉगिन",
    loginSub: "अपना खाता खोलें",
    registerTitle: "नया खाता बनाएं",
    registerSub: "साईराम कंप्यूटर में आपका स्वागत है",
    forgotTitle: "पासवर्ड भूल गए?",
    forgotSub: "सुरक्षा प्रश्न का उत्तर दें",
    mobile: "मोबाइल नंबर",
    mobilePh: "१०-अंकीय मोबाइल नंबर",
    password: "पासवर्ड",
    passwordPh: "कम से कम ६ अक्षर",
    newPassword: "नया पासवर्ड",
    confirmPassword: "पासवर्ड दोबारा डालें",
    name: "पूरा नाम",
    namePh: "उदा. राहुल मिसे",
    secQuestion: "सुरक्षा प्रश्न चुनें",
    secAnswer: "उत्तर",
    secAnswerPh: "प्रश्न का उत्तर डालें",
    loginBtn: "लॉगिन करें",
    registerBtn: "खाता बनाएं",
    resetBtn: "पासवर्ड बदलें",
    loggingIn: "लॉगिन हो रहा है...",
    registering: "खाता बन रहा है...",
    resetting: "पासवर्ड बदल रहा है...",
    noAccount: "नया खाता बनाएं",
    haveAccount: "खाता है? लॉगिन करें",
    forgotPassword: "पासवर्ड भूल गए?",
    backToLogin: "← वापस लॉगिन पर",
    passMatch: "दोनों पासवर्ड एक जैसे होने चाहिए!",
    passShort: "पासवर्ड कम से कम ६ अक्षरों का होना चाहिए!",
    mobileInvalid: "कृपया १०-अंकीय मोबाइल नंबर डालें!",
    allFields: "कृपया सभी जानकारी भरें!",
    resetSuccess: "पासवर्ड सफलतापूर्वक बदला गया! अब लॉगिन करें।",
    questions: [
      "आपकी माँ का नाम क्या है?",
      "आपका गाँव/शहर कौन सा है?",
      "आपके स्कूल का नाम क्या है?",
      "आपका पसंदीदा विषय क्या है?",
      "आपके पिता का नाम क्या है?",
    ],
  },
};

type Screen = "login" | "register" | "forgot";

export default function LoginModal({ onClose, onLoginSuccess, lang }: LoginModalProps) {
  const l = t[lang] || t.mr;
  const [screen, setScreen] = useState<Screen>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  // Login fields
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [regName, setRegName] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regQuestion, setRegQuestion] = useState(l.questions[0]);
  const [regAnswer, setRegAnswer] = useState("");

  // Forgot fields
  const [forgotMobile, setForgotMobile] = useState("");
  const [forgotQuestion, setForgotQuestion] = useState("");
  const [forgotAnswer, setForgotAnswer] = useState("");
  const [forgotNewPass, setForgotNewPass] = useState("");
  const [forgotConfirm, setForgotConfirm] = useState("");
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotUserQuestion, setForgotUserQuestion] = useState("");

  const reset = () => {
    setError("");
    setSuccess("");
  };

  // ── LOGIN ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    if (!mobile || mobile.length < 10) return setError(l.mobileInvalid);
    if (!password) return setError(l.allFields);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── REGISTER ──
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    if (!regName || !regMobile || !regPassword || !regConfirm || !regAnswer)
      return setError(l.allFields);
    if (regMobile.length < 10) return setError(l.mobileInvalid);
    if (regPassword.length < 6) return setError(l.passShort);
    if (regPassword !== regConfirm) return setError(l.passMatch);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName,
          mobile: regMobile,
          password: regPassword,
          securityQuestion: regQuestion,
          securityAnswer: regAnswer.trim().toLowerCase(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── FORGOT STEP 1: check mobile & get question ──
  const handleForgotStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    if (!forgotMobile || forgotMobile.length < 10) return setError(l.mobileInvalid);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-step1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: forgotMobile }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "User not found");
      setForgotUserQuestion(data.question);
      setForgotStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── FORGOT STEP 2: verify answer & reset password ──
  const handleForgotStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    if (!forgotAnswer) return setError(l.allFields);
    if (!forgotNewPass || forgotNewPass.length < 6) return setError(l.passShort);
    if (forgotNewPass !== forgotConfirm) return setError(l.passMatch);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-step2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mobile: forgotMobile,
          answer: forgotAnswer.trim().toLowerCase(),
          newPassword: forgotNewPass,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");
      setSuccess(l.resetSuccess);
      setTimeout(() => { setScreen("login"); setForgotStep(1); reset(); }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-10 pr-4 py-3 border border-gray-200 hover:border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-200 rounded-xl text-sm font-bold outline-none transition-all";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-rose-100 shadow-2xl p-6 relative flex flex-col max-h-[92vh] overflow-y-auto">

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pb-4 border-b border-gray-100 mb-4">
          <span className="text-3xl">🚩</span>
          <h3 className="font-extrabold text-xl text-gray-900 mt-2">
            {screen === "login" ? l.loginTitle : screen === "register" ? l.registerTitle : l.forgotTitle}
          </h3>
          <p className="text-xs text-rose-700 font-bold mt-1">
            {screen === "login" ? l.loginSub : screen === "register" ? l.registerSub : l.forgotSub}
          </p>
        </div>

        {/* Error / Success */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-2.5 rounded-xl mb-3 text-center">{error}</div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-2.5 rounded-xl mb-3 text-center">{success}</div>
        )}

        {/* ── LOGIN SCREEN ── */}
        {screen === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-black text-gray-700 block mb-1">{l.mobile}</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input type="tel" maxLength={10} value={mobile}
                  onChange={e => setMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder={l.mobilePh} className={inputClass} required />
              </div>
            </div>
            <div>
              <label className="text-xs font-black text-gray-700 block mb-1">{l.password}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input type={showPass ? "text" : "password"} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={l.passwordPh} className={inputClass + " pr-10"} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-sm py-3 rounded-xl shadow-md cursor-pointer transition-all active:scale-95">
              {loading ? l.loggingIn : l.loginBtn}
            </button>
            <div className="flex justify-between pt-1">
              <button type="button" onClick={() => { setScreen("register"); reset(); }}
                className="text-xs text-rose-600 font-bold hover:underline cursor-pointer">{l.noAccount}</button>
              <button type="button" onClick={() => { setScreen("forgot"); reset(); setForgotStep(1); }}
                className="text-xs text-gray-500 font-bold hover:underline cursor-pointer">{l.forgotPassword}</button>
            </div>
          </form>
        )}

        {/* ── REGISTER SCREEN ── */}
        {screen === "register" && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="text-xs font-black text-gray-700 block mb-1">{l.name}</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input type="text" value={regName} onChange={e => setRegName(e.target.value)}
                  placeholder={l.namePh} className={inputClass} required />
              </div>
            </div>
            <div>
              <label className="text-xs font-black text-gray-700 block mb-1">{l.mobile}</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input type="tel" maxLength={10} value={regMobile}
                  onChange={e => setRegMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder={l.mobilePh} className={inputClass} required />
              </div>
            </div>
            <div>
              <label className="text-xs font-black text-gray-700 block mb-1">{l.password}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input type={showPass ? "text" : "password"} value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder={l.passwordPh} className={inputClass + " pr-10"} required />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-black text-gray-700 block mb-1">{l.confirmPassword}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input type={showPass2 ? "text" : "password"} value={regConfirm}
                  onChange={e => setRegConfirm(e.target.value)}
                  placeholder={l.passwordPh} className={inputClass + " pr-10"} required />
                <button type="button" onClick={() => setShowPass2(!showPass2)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                  {showPass2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-black text-gray-700 block mb-1">{l.secQuestion}</label>
              <div className="relative">
                <HelpCircle className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <select value={regQuestion} onChange={e => setRegQuestion(e.target.value)}
                  className={inputClass + " appearance-none bg-white"}>
                  {l.questions.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-black text-gray-700 block mb-1">{l.secAnswer}</label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input type="text" value={regAnswer} onChange={e => setRegAnswer(e.target.value)}
                  placeholder={l.secAnswerPh} className={inputClass} required />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">⚠️ हे उत्तर लक्षात ठेवा — पासवर्ड विसरल्यास लागेल</p>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-sm py-3 rounded-xl shadow-md cursor-pointer transition-all active:scale-95">
              {loading ? l.registering : l.registerBtn}
            </button>
            <button type="button" onClick={() => { setScreen("login"); reset(); }}
              className="w-full text-xs text-gray-500 font-bold hover:underline cursor-pointer text-center pt-1">
              {l.haveAccount}
            </button>
          </form>
        )}

        {/* ── FORGOT PASSWORD SCREEN ── */}
        {screen === "forgot" && (
          <>
            {forgotStep === 1 && (
              <form onSubmit={handleForgotStep1} className="space-y-4">
                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">{l.mobile}</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input type="tel" maxLength={10} value={forgotMobile}
                      onChange={e => setForgotMobile(e.target.value.replace(/\D/g, ""))}
                      placeholder={l.mobilePh} className={inputClass} required />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-sm py-3 rounded-xl shadow-md cursor-pointer transition-all active:scale-95">
                  {loading ? "..." : "पुढे →"}
                </button>
                <button type="button" onClick={() => { setScreen("login"); reset(); setForgotStep(1); }}
                  className="w-full text-xs text-gray-500 font-bold hover:underline cursor-pointer text-center">
                  {l.backToLogin}
                </button>
              </form>
            )}

            {forgotStep === 2 && (
              <form onSubmit={handleForgotStep2} className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-bold">
                  🔐 {forgotUserQuestion}
                </div>
                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">{l.secAnswer}</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input type="text" value={forgotAnswer} onChange={e => setForgotAnswer(e.target.value)}
                      placeholder={l.secAnswerPh} className={inputClass} required />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">{l.newPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input type={showPass ? "text" : "password"} value={forgotNewPass}
                      onChange={e => setForgotNewPass(e.target.value)}
                      placeholder={l.passwordPh} className={inputClass + " pr-10"} required />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-3.5 text-gray-400">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-700 block mb-1">{l.confirmPassword}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input type={showPass2 ? "text" : "password"} value={forgotConfirm}
                      onChange={e => setForgotConfirm(e.target.value)}
                      placeholder={l.passwordPh} className={inputClass + " pr-10"} required />
                    <button type="button" onClick={() => setShowPass2(!showPass2)}
                      className="absolute right-3 top-3.5 text-gray-400">
                      {showPass2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-sm py-3 rounded-xl shadow-md cursor-pointer transition-all active:scale-95">
                  {loading ? l.resetting : l.resetBtn}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
