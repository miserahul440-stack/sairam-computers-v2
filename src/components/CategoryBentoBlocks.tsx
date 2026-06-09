import React from "react";
import { Briefcase, GraduationCap, Tractor, CreditCard, Sparkles, AlertCircle } from "lucide-react";

interface CategoryBentoBlocksProps {
  onSelectCategory: (category: "job" | "student" | "farmer" | "other") => void;
  lang: "mr" | "en" | "hi";
}

const bentoTranslations = {
  mr: {
    title: "⚡ आमच्या DIGITAL शासकीय सेवा (निवडा):",
    desc: "तुम्हाला ज्या कॅटेगरीचा ऑनलाईन फॉर्म भरायचा आहे, त्या ब्लॉकवर क्लिक करा आणि सेकंदात माहिती पहा!",
    cardJobsTitle: "👮 सरकारी नोकरी भरती अर्ज",
    cardJobsSub: "नवीन नोकर भरती, रेल्वे, पोलीस भरती व इतर",
    cardJobsBadge: "जाहिराती सक्रिय ⚡",
    
    cardStudentTitle: "🎓 कॉलेज प्रवेश व शिष्यवृत्ती",
    cardStudentSub: "MahaDBT शिष्यवृत्ती, परीक्षा फॉर्म व प्रवेश अर्ज",
    cardStudentBadge: "नियमित सुरु 🎓",

    cardFarmerTitle: "🚜 शेतकरी कल्याण योजना",
    cardFarmerSub: "पीएम किसान, पिक विमा, अन्नपूर्णा व ट्रॅक्टर योजना",
    cardFarmerBadge: "अनुदान सुरु 🌾",

    cardOtherTitle: "💳 इतर शासकीय सेवा (पॅन / आयडी)",
    cardOtherSub: "नवीन पॅन कार्ड दुरुस्ती, आयुष्मान भारत हेल्थ कार्ड",
    cardOtherBadge: "२ दिवसात तयार 💳",

    viewJobs: "भर्ती जाहिराती पहा",
    viewStudent: "विद्यार्थी योजना पहा",
    viewFarmer: "शेतकरी योजना पहा",
    viewOther: "इतर शासकीय सेवा पहा",
  },
  en: {
    title: "⚡ Our Digital Government Services (Choose):",
    desc: "Click on any block below to view instant service details & apply online in seconds!",
    cardJobsTitle: "👮 Govt Jobs Recruitment",
    cardJobsSub: "Police, Railway, Army & Public Sector Openings",
    cardJobsBadge: "Active Jobs ⚡",
    
    cardStudentTitle: "🎓 Student Admission & MahaDBT",
    cardStudentSub: "Scholarships, Exam Forms, Admission Processes",
    cardStudentBadge: "Live Portals 🎓",

    cardFarmerTitle: "🚜 Farmers Welfare Schemes",
    cardFarmerSub: "PM Kisan, Crop Insurances, Subsidy programs",
    cardFarmerBadge: "Subsidies Open 🌾",

    cardOtherTitle: "💳 Other Govt Cards (PAN / Health)",
    cardOtherSub: "Instant PAN card, Ayushman Bharat Card & updates",
    cardOtherBadge: "Fast Process 💳",

    viewJobs: "View Recruitments",
    viewStudent: "View Student Schemes",
    viewFarmer: "View Farmer Schemes",
    viewOther: "View Other Services",
  },
  hi: {
    title: "⚡ हमारी डिजिटल सरकारी सेवाएं (चुनें):",
    desc: "जिस श्रेणी का फॉर्म भरना चाहते हैं, उस ब्लॉक पर क्लिक करके पूरी जानकारी तुरंत देखें!",
    cardJobsTitle: "👮 सरकारी नौकरी भर्ती",
    cardJobsSub: "रेलवे, पुलिस, रक्षा विभाग और लोक सेवा भर्ती",
    cardJobsBadge: "नई भर्तियां ⚡",
    
    cardStudentTitle: "🎓 छात्र प्रवेश और छात्रवृत्ति",
    cardStudentSub: "MahaDBT स्कॉलरशिप, परीक्षा फॉर्म और कॉलेज प्रवेश",
    cardStudentBadge: "पोर्टल सक्रिय 🎓",

    cardFarmerTitle: "🚜 किसान कल्याण योजनाएं",
    cardFarmerSub: "पीएम किसान, फसल बीमा, कृषि उपकरण अनुदान योजनाएं",
    cardFarmerBadge: "पंजीकरण चालू 🌾",

    cardOtherTitle: "💳 अन्य सरकारी कार्ड (पैन / आयुष्मान)",
    cardOtherSub: "नया पैन कार्ड, आयुष्मान भारत हेल्थ कार्ड इत्यादि",
    cardOtherBadge: "तुरंत बनाएं 💳",

    viewJobs: "भर्ती विज्ञापन देखें",
    viewStudent: "छात्र योजनाएं देखें",
    viewFarmer: "किसान योजनाएं देखें",
    viewOther: "अन्य सरकारी सेवाएं देखें",
  }
};

export default function CategoryBentoBlocks({ onSelectCategory, lang }: CategoryBentoBlocksProps) {
  const t = bentoTranslations[lang] || bentoTranslations.mr;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm md:text-base font-black text-slate-900 flex items-center gap-1.5 tracking-tight">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
          <span>{t.title}</span>
        </h3>
        <p className="text-[11px] text-gray-500 font-bold max-w-xl">
          {t.desc}
        </p>
      </div>

      {/* Main Bento Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Block 1: Jobs */}
        <div
          onClick={() => onSelectCategory("job")}
          className="group overflow-hidden rounded-3xl p-5 border cursor-pointer transition-all duration-350 relative flex flex-col justify-between hover:scale-[1.03] shadow-sm bg-white border-slate-150 hover:border-rose-450 hover:shadow-lg active:scale-95 duration-200"
          id="bento-jobs"
        >
          {/* Subtle geometric background pattern for premium touch */}
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
            <Briefcase className="w-32 h-32 text-rose-800" />
          </div>

          <div>
            <div className="flex justify-between items-start gap-1 pb-2">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 transition-transform group-hover:scale-110">
                <Briefcase className="w-5 h-5 font-black" />
              </div>
              <span className="bg-rose-700 text-white font-black text-[9px] px-2 py-0.5 rounded-full select-none tracking-wider uppercase">
                {t.cardJobsBadge}
              </span>
            </div>
            <h4 className="font-extrabold text-sm text-gray-900 group-hover:text-rose-700 transition-colors mt-2">
              {t.cardJobsTitle}
            </h4>
            <p className="text-[10px] text-gray-400 font-bold leading-normal mt-1 min-h-[30px]">
              {t.cardJobsSub}
            </p>
          </div>
          
          <div className="mt-3 text-[10px] font-black text-rose-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            <span>{t.viewJobs}</span>
            <span>→</span>
          </div>
        </div>

        {/* Block 2: Students */}
        <div
          onClick={() => onSelectCategory("student")}
          className="group overflow-hidden rounded-3xl p-5 border cursor-pointer transition-all duration-350 relative flex flex-col justify-between hover:scale-[1.03] shadow-sm bg-white border-slate-150 hover:border-rose-450 hover:shadow-lg active:scale-95 duration-200"
          id="bento-students"
        >
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
            <GraduationCap className="w-32 h-32 text-rose-800" />
          </div>

          <div>
            <div className="flex justify-between items-start gap-1 pb-2">
              <div className="w-10 h-10 rounded-2xl bg-sky-105 bg-sky-100 flex items-center justify-center text-sky-600 transition-transform group-hover:scale-110">
                <GraduationCap className="w-5 h-5 font-black" />
              </div>
              <span className="bg-sky-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full select-none tracking-wider uppercase">
                {t.cardStudentBadge}
              </span>
            </div>
            <h4 className="font-extrabold text-sm text-gray-900 group-hover:text-rose-700 transition-colors mt-2">
              {t.cardStudentTitle}
            </h4>
            <p className="text-[10px] text-gray-400 font-bold leading-normal mt-1 min-h-[30px]">
              {t.cardStudentSub}
            </p>
          </div>
          
          <div className="mt-3 text-[10px] font-black text-rose-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            <span>{t.viewStudent}</span>
            <span>→</span>
          </div>
        </div>

        {/* Block 3: Farmer welfare */}
        <div
          onClick={() => onSelectCategory("farmer")}
          className="group overflow-hidden rounded-3xl p-5 border cursor-pointer transition-all duration-350 relative flex flex-col justify-between hover:scale-[1.03] shadow-sm bg-white border-slate-150 hover:border-rose-450 hover:shadow-lg active:scale-95 duration-200"
          id="bento-farmers"
        >
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
            <Tractor className="w-32 h-32 text-rose-800" />
          </div>

          <div>
            <div className="flex justify-between items-start gap-1 pb-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
                <Tractor className="w-5 h-5 font-black" />
              </div>
              <span className="bg-emerald-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full select-none tracking-wider uppercase">
                {t.cardFarmerBadge}
              </span>
            </div>
            <h4 className="font-extrabold text-sm text-gray-900 group-hover:text-rose-700 transition-colors mt-2">
              {t.cardFarmerTitle}
            </h4>
            <p className="text-[10px] text-gray-400 font-bold leading-normal mt-1 min-h-[30px]">
              {t.cardFarmerSub}
            </p>
          </div>
          
          <div className="mt-3 text-[10px] font-black text-rose-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            <span>{t.viewFarmer}</span>
            <span>→</span>
          </div>
        </div>

        {/* Block 4: Other Card Services */}
        <div
          onClick={() => onSelectCategory("other")}
          className="group overflow-hidden rounded-3xl p-5 border cursor-pointer transition-all duration-350 relative flex flex-col justify-between hover:scale-[1.03] shadow-sm bg-white border-slate-150 hover:border-rose-455 hover:shadow-lg active:scale-95 duration-200"
          id="bento-other"
        >
          <div className="absolute right-0 bottom-0 translate-x-3 translate-y-3 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
            <CreditCard className="w-32 h-32 text-rose-800" />
          </div>

          <div>
            <div className="flex justify-between items-start gap-1 pb-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 transition-transform group-hover:scale-110">
                <CreditCard className="w-5 h-5 font-black" />
              </div>
              <span className="bg-amber-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full select-none tracking-wider uppercase">
                {t.cardOtherBadge}
              </span>
            </div>
            <h4 className="font-extrabold text-sm text-gray-900 group-hover:text-rose-700 transition-colors mt-2">
              {t.cardOtherTitle}
            </h4>
            <p className="text-[10px] text-gray-400 font-bold leading-normal mt-1 min-h-[30px]">
              {t.cardOtherSub}
            </p>
          </div>
          
          <div className="mt-3 text-[10px] font-black text-rose-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            <span>{t.viewOther}</span>
            <span>→</span>
          </div>
        </div>

      </div>
    </div>
  );
}
