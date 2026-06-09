import React, { useState, useEffect } from "react";
import { Phone, MessageSquare, ShieldCheck, LogOut, User, Globe } from "lucide-react";
import { UserProfile } from "../types";
import RealisticSaffronFlag from "./RealisticSaffronFlag";

interface HeaderProps {
  user: UserProfile | null;
  onLogout: () => void;
  onOpenLogin: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  onAdminLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: "mr" | "en" | "hi";
  onChangeLang: (lang: "mr" | "en" | "hi") => void;
  adminRevealed: boolean;
  onFlagClick: () => void;
}

const headerTranslations = {
  mr: {
    slogan: "✨ तुमचा विश्वास, आमची प्रामाणिक सेवा!",
    loginBtn: "ग्राहक लॉगिन / नवीन नोंदणी",
    adminModeActive: "ॲडमीन मोड सक्रिय",
    logoutBtn: "बाहेर पडा",
    adminPanelBtn: "🔒 ॲडमीन पॅनेल",
    tabHome: "🏠 मुख्य पान / होम",
    tabJob: "👮 सरकारी नोकरी भरती",
    tabStudent: "🎓 विद्यार्थी फॉर्म",
    tabFarmer: "🚜 शेतकरी योजना",
    tabOther: "💳 इतर सेवा",
    tabWallet: "📁 डॉक्युमेंट वॉलेट",
    tabHistory: "📜 माझे अर्ज",
    tabAdmin: "⚙️ ॲडमीन व्यवस्थापन",
    logoTitle: "साईराम कॉम्प्युटर",
  },
  en: {
    slogan: "✨ Your trust, our honest service!",
    loginBtn: "Customer Login / Register",
    adminModeActive: "Admin Mode Active",
    logoutBtn: "Sign Out",
    adminPanelBtn: "🔒 Admin Panel",
    tabHome: "🏠 Home Page",
    tabJob: "👮 Govt Recruitments",
    tabStudent: "🎓 Student Forms",
    tabFarmer: "🚜 Farmer Schemes",
    tabOther: "💳 Other Services",
    tabWallet: "📁 Document Wallet",
    tabHistory: "📜 My Applications",
    tabAdmin: "⚙️ Admin Dashboard",
    logoTitle: "Sairam Computers",
  },
  hi: {
    slogan: "✨ आपका विश्वास, हमारी ईमानदार सेवा!",
    loginBtn: "ग्राहक लॉगिन / नया पंजीकरण",
    adminModeActive: "एडमिन मोड सक्रिय",
    logoutBtn: "लॉगआउट",
    adminPanelBtn: "🔒 एडमिन पैनल",
    tabHome: "🏠 मुख्य पृष्ठ",
    tabJob: "👮 सरकारी भर्तियां",
    tabStudent: "🎓 छात्रों के फॉर्म",
    tabFarmer: "🚜 किसान योजनाएं",
    tabOther: "💳 अन्य सेवाएं",
    tabWallet: "📁 दस्तावेज़ वॉलेट",
    tabHistory: "📜 मेरे आवेदन",
    tabAdmin: "⚙️ Admin Dashboard",
    logoTitle: "साईराम कॉम्प्युटर",
  }
};

export default function Header({
  user,
  onLogout,
  onOpenLogin,
  onOpenAdmin,
  isAdminLoggedIn,
  onAdminLogout,
  activeTab,
  setActiveTab,
  lang,
  onChangeLang,
  adminRevealed,
  onFlagClick,
}: HeaderProps) {
  const t = headerTranslations[lang] || headerTranslations.mr;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`bg-white border-b border-rose-100 shadow-sm sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-md py-1.5 md:py-2" : "py-3 md:py-4"}`}>
      <div className="px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4">
          
          {/* Sairam Calligraphy Branding & Language Selection Bar */}
          <div className="text-center sm:text-left flex flex-col md:flex-row items-center gap-2 md:gap-4">
            {/* flag click is handled here */}
            <div className="text-center sm:text-left flex flex-col cursor-pointer select-none" onClick={() => setActiveTab("home")}>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span 
                  className={`hover:scale-110 active:rotate-12 transition-transform cursor-pointer inline-flex items-center justify-center ${isScrolled ? "scale-90" : ""}`} 
                  onClick={(e) => {
                    e.stopPropagation();
                    onFlagClick();
                  }}
                  title="Click 5 times to toggle admin option"
                >
                  <RealisticSaffronFlag size={isScrolled ? 34 : 45} />
                </span>

                <h1 className={`font-black uppercase tracking-normal calligraphy-logo whitespace-nowrap shrink-0 transition-all duration-300 ${
                  isScrolled 
                    ? "text-xl sm:text-2xl md:text-3xl" 
                    : "text-2xl min-[380px]:text-[32px] sm:text-[40px] md:text-4xl lg:text-[46px]"
                }`} id="main-title">
                  {t.logoTitle}
                </h1>
              </div>
              <p className={`text-[10px] sm:text-xs text-rose-800 font-bold tracking-wide transition-all ${
                isScrolled ? "max-h-0 opacity-0 overflow-hidden mt-0" : "max-h-12 opacity-100 mt-0.5 pl-1"
              }`}>
                {t.slogan}
              </p>
            </div>
          </div>

          {/* Controls Block (Language Switcher, User/Admin login) */}
          <div className="flex items-center flex-wrap justify-center gap-3">
            
            {/* Embedded Premium Language Toggle Switch */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 shadow-inner gap-1">
              <Globe className="w-3.5 h-3.5 text-gray-400 mx-1 shrink-0" />
              <button
                onClick={() => onChangeLang("mr")}
                className={`px-2.5 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                  lang === "mr" ? "bg-rose-600 text-white shadow-sm" : "text-gray-500 hover:text-rose-600"
                }`}
              >
                मराठी
              </button>
              <button
                onClick={() => onChangeLang("hi")}
                className={`px-2.5 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                  lang === "hi" ? "bg-rose-600 text-white shadow-sm" : "text-gray-500 hover:text-rose-600"
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => onChangeLang("en")}
                className={`px-2.5 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                  lang === "en" ? "bg-rose-600 text-white shadow-sm" : "text-gray-500 hover:text-rose-600"
                }`}
              >
                EN
              </button>
            </div>

            {/* Standard User / Admin Login block */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg text-rose-700">
                <ShieldCheck className="w-5 h-5 text-rose-600 animate-pulse" />
                <span className="text-xs md:text-sm font-bold">{t.adminModeActive}</span>
                <button
                  onClick={onAdminLogout}
                  className="ml-2 hover:bg-rose-200 p-1 rounded text-rose-900 transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer"
                  id="admin-logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.logoutBtn}</span>
                </button>
              </div>
            ) : user ? (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl">
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-amber-300 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 line-clamp-1 max-w-[120px]">{user.name}</span>
                  <span className="text-[10px] text-gray-500 font-mono">{user.mobile}</span>
                </div>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="ml-2 p-1 text-gray-400 hover:text-red-500 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                  id="user-logout-btn"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs md:text-sm font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer animate-fade-in"
                id="login-btn"
              >
                <User className="w-4.5 h-4.5" />
                <span>{t.loginBtn}</span>
              </button>
            )}

            {/* Quick Admin Access button - ONLY visible if admin is revealed or logged in */}
            {!isAdminLoggedIn && adminRevealed && (
              <button
                onClick={onOpenAdmin}
                className="border border-red-300 text-rose-600 bg-red-50 hover:bg-rose-600 hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                id="admin-access-btn"
              >
                {t.adminPanelBtn}
              </button>
            )}
          </div>
        </div>

        {/* Localized Navigation Tabs */}
        <nav className="flex items-center justify-start overflow-x-auto gap-2 mt-5 py-1 border-t border-rose-50 pt-4 scrollbar-none">
          <button
            onClick={() => setActiveTab("home")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "home"
                ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                : "bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-600 border border-gray-200"
            }`}
            id="tab-home"
          >
            {t.tabHome}
          </button>

          <button
            onClick={() => setActiveTab("job")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "job"
                ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                : "bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-600 border border-gray-200"
            }`}
            id="tab-job"
          >
            {t.tabJob}
          </button>
          
          <button
            onClick={() => setActiveTab("farmer")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "farmer"
                ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                : "bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-600 border border-gray-200"
            }`}
            id="tab-farmer"
          >
            {t.tabFarmer}
          </button>

          <button
            onClick={() => setActiveTab("student")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "student"
                ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                : "bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-600 border border-gray-200"
            }`}
            id="tab-student"
          >
            {t.tabStudent}
          </button>

          <button
            onClick={() => setActiveTab("other")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "other"
                ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                : "bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-600 border border-gray-200"
            }`}
            id="tab-other"
          >
            {t.tabOther}
          </button>
          
          {user && (
            <>
              <button
                onClick={() => setActiveTab("wallet")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "wallet"
                    ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                    : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                }`}
                id="tab-wallet"
              >
                {t.tabWallet}
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === "history"
                    ? "bg-rose-600 text-white shadow-md shadow-rose-200"
                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                }`}
                id="tab-history"
              >
                {t.tabHistory}
              </button>
            </>
          )}
          
          {isAdminLoggedIn && (
            <button
              onClick={() => setActiveTab("admin")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap border border-rose-300 cursor-pointer ${
                activeTab === "admin" ? "bg-rose-700 text-white" : "bg-rose-50 text-rose-700 hover:bg-rose-100"
              }`}
              id="tab-admin"
            >
              {t.tabAdmin}
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
