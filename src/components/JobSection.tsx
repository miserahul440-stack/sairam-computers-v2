import React, { useState } from "react";
import { JobPost } from "../types";
import { Briefcase, Calendar, Users, Sparkles, Share2, ClipboardList, ChevronDown, ChevronUp, Clock, Info, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface JobSectionProps {
  jobs: JobPost[];
  onApplyJob: (job: JobPost) => void;
  lang: "mr" | "en" | "hi";
}

const jobTranslations = {
  mr: {
    sectionHeading: "नवीन सरकारी नोकरी भरती (निवडक जॉब अपडेट्स)",
    sectionSub: "शासकीय नोकरीचे अर्ज अचूक माहितीसह कमीत कमी वेळेत आणि स्वस्त दरात भरून घ्या.",
    totalLiveCount: "एकूण उपलब्ध भरती",
    startDateLabel: "घोषणा / सुरु दिनांक",
    lastDateLabel: "अर्ज शेवटची तारीख",
    serviceChargeLabel: "आमचे सेवा शुल्क",
    shareLabel: "शेअर करा",
    totalPositions: "👥 एकूण जागा संख्या",
    deadlineLabel: "⏱️ अर्ज करण्याची मुदत",
    untilLabel: "पर्यंत",
    qualificationLabel: "🎓 शैक्षणिक पात्रता व निकष",
    ageLimitLabel: "🎂 वयाची अट श्रेणी व सवलत",
    myChargeLabel: "💳 आमचे ऑनलाईन सेवा शुल्क (Sairam Service Fee)",
    onlyLabel: "फक्त",
    tableSubtitle: "📋 उपलब्ध पदे व जागा तक्ता:",
    tableColPost: "पद आणि संवर्ग",
    tableColVacancy: "जागा संख्या",
    requiredDocsLabel: "लागणारे आवश्यक कागदपत्रे (डॉक्युमेंट्स वॉलेटमध्ये असावेत):",
    grossFeeLabel: "एकूण अंदाजित फी (शासकीय चलन + सर्व्हिस चार्ज)",
    generalLabel: "खुला प्रवर्ग (General)",
    reservedLabel: "मागासवर्गीय (Reserved)",
    applySubmitBtn: "साईराम कॉम्प्युटरवरून अर्ज करा",
    officialGovtFeeLabel: "🏦 मूळ सरकारी चलन फी (Official Govt Form Fee)",
    totalChargesLabel: "⚖️ एकूण देय अंदाजित रक्कम (Total Gross Amount)",
    postsWord: "पदे",
    feeDisclaimer: "* ही रक्कम थेट शासकीय तिजोरीत/पोर्टलवर चालनाद्वारे ऑनलाइन भरली जाते.",
    openCategoryLabel: "खुला प्रवर्ग (Open):",
    reservedCategoryLabel: "मागासवर्गीय (Reserved):",
    processingFeeLabel: "🎯 आमचे सेवा मूल्य (Sairam Processing Charge)",
    processingFeeDesc: "यात कागदपत्रे तपासणी, पेमेंट करणे, अंतिम कन्फर्मेशन आणि प्रिंटेड पावतीचा समावेश आहे.",
    openTotalLabel: "एकूण खुला (Open Total):",
    reservedTotalLabel: "एकूण मागास (Reserved Total):",
    feeInfoMainHeader: "फी आणि ऑनलाईन पेमेंट माहिती (Form Fees & Our Charges breakdown):",
    startMinLabel: "किमान सुरुवात",
  },
  en: {
    sectionHeading: "Latest Government Recruitment Updates",
    sectionSub: "Error-free official application forms submitted swiftly at minimal service rates.",
    totalLiveCount: "Total Live Recruits",
    startDateLabel: "Posted / Start Date",
    lastDateLabel: "Last Date to Apply",
    serviceChargeLabel: "Sairam Service Fee",
    shareLabel: "Share",
    totalPositions: "👥 Total General Vacancies",
    deadlineLabel: "⏱️ Final Deadline Date",
    untilLabel: "Until",
    qualificationLabel: "🎓 Academic Qualifications & Eligibility",
    ageLimitLabel: "🎂 Age Limitations & Category Relaxations",
    myChargeLabel: "💳 Our Online Processing Fee (Sairam Charge)",
    onlyLabel: "Just",
    tableSubtitle: "📋 Designation Categories & Seat Distribution:",
    tableColPost: "Designation / Cadre",
    tableColVacancy: "Vacancies",
    requiredDocsLabel: "Mandated Certificates & Checklist (keep in wallet):",
    grossFeeLabel: "Gross Estimates (Govt Portal Draft + Processing fee)",
    generalLabel: "Unreserved (General)",
    reservedLabel: "Reserved (SC/ST/OBC)",
    applySubmitBtn: "Submit Application via Sairam",
    officialGovtFeeLabel: "🏦 Official Government Form Fee",
    totalChargesLabel: "⚖️ Total Payable Estimate",
    postsWord: "Posts",
    feeDisclaimer: "* This amount is paid online directly to the government treasury/portal via challan.",
    openCategoryLabel: "Unreserved (General):",
    reservedCategoryLabel: "Reserved Category (SC/ST/OBC):",
    processingFeeLabel: "🎯 Our Processing Fee (Sairam Charge)",
    processingFeeDesc: "Includes document verification, secure payment processing, final confirmation, and printed receipt.",
    openTotalLabel: "Total for Unreserved (Open):",
    reservedTotalLabel: "Total for Reserved:",
    feeInfoMainHeader: "Fees & Online Payment Details (Form Fees & Sairam Charges breakdown):",
    startMinLabel: "Min Start",
  },
  hi: {
    sectionHeading: "नवीन सरकारी नौकरी भर्ती (चुनिंदा जॉब अपडेट्स)",
    sectionSub: "सरकारी नौकरी के आवेदन पूरी सटीकता, तीव्र गति और न्यूनतम दरों पर भरवाएं।",
    totalLiveCount: "कुल संचालित भर्तियां",
    startDateLabel: "घोषणा / प्रारंभ तिथि",
    lastDateLabel: "अंतिम तिथि",
    serviceChargeLabel: "हमारा सेवा शुल्क",
    shareLabel: "शेयर करें",
    totalPositions: "👥 कुल उपलब्ध पद",
    deadlineLabel: "⏱️ आवेदन की अंतिम समय सीमा",
    untilLabel: "तक",
    qualificationLabel: "🎓 शैक्षणिक योग्यता और मापदंड",
    ageLimitLabel: "🎂 आयु सीमा और आरक्षित छूट",
    myChargeLabel: "💳 हमारा ऑनलाइन आवेदन शुल्क (सेवा शुल्क)",
    onlyLabel: "सिर्फ",
    tableSubtitle: "📋 उपलब्ध पद विवरण एवं रिक्ति तालिका:",
    tableColPost: "पद और संवर्ग",
    tableColVacancy: "पद संख्या",
    requiredDocsLabel: "आवश्यक आवश्यक दस्तावेज सूची (वॉलेट में अपलोड करें):",
    grossFeeLabel: "कुल अनुमानित शुल्क (सरकारी चालान + सेवा शुल्क)",
    generalLabel: "सामान्य वर्ग (General)",
    reservedLabel: "आरक्षित वर्ग (Reserved)",
    applySubmitBtn: "साईराम कंप्यूटर के माध्यम से अभी भरें",
    officialGovtFeeLabel: "🏦 मूल सरकारी चालान शुल्क",
    totalChargesLabel: "⚖️ कुल देय अनुमानित राशि",
    postsWord: "पद",
    feeDisclaimer: "* यह राशि सीधे चालान के माध्यम से सरकारी खजाने/पोर्टल पर ऑनलाइन भरी जाती है।",
    openCategoryLabel: "अनारक्षित वर्ग (Open):",
    reservedCategoryLabel: "आरक्षित वर्ग (Reserved):",
    processingFeeLabel: "🎯 हमारा सेवा शुल्क (Sairam Processing Charge)",
    processingFeeDesc: "इसमें दस्तावेज़ सत्यापन, भुगतान प्रसंस्करण, अंतिम पुष्टि और मुद्रित रसीद शामिल है।",
    openTotalLabel: "कुल सामान्य (Open Total):",
    reservedTotalLabel: "कुल आरक्षित (Reserved Total):",
    feeInfoMainHeader: "फीस और ऑनलाइन भुगतान विवरण (Form Fees & Sairam Charges breakdown):",
    startMinLabel: "न्यूनतम शुरुआत",
  }
};

// Helper function to format any date string elegantly to DD/MM/YYYY format
export function formatDateToDDMMYYYY(dateStr: string): string {
  if (!dateStr) return "";
  
  // Clean Marathi/Devanagari numerals if input contains Marathi numbers
  const marToEngMap: { [key: string]: string } = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };
  let engDateStr = dateStr.replace(/[०-९]/g, (match) => marToEngMap[match] || match);
  
  // If it's already in DD/MM/YYYY format
  const ddmmyyyyPattern = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/;
  const matchDdmmyyyy = engDateStr.match(ddmmyyyyPattern);
  if (matchDdmmyyyy) {
    const day = matchDdmmyyyy[1].padStart(2, '0');
    const month = matchDdmmyyyy[2].padStart(2, '0');
    const year = matchDdmmyyyy[3];
    return `${day}/${month}/${year}`;
  }

  // If it's in YYYY-MM-DD format
  const yyyymmddPattern = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/;
  const matchYyyymmdd = engDateStr.match(yyyymmddPattern);
  if (matchYyyymmdd) {
    const year = matchYyyymmdd[1];
    const month = matchYyyymmdd[2].padStart(2, '0');
    const day = matchYyyymmdd[3].padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  // Try standard Date parsing
  try {
    const parsedDate = new Date(engDateStr);
    if (!isNaN(parsedDate.getTime())) {
      const d = String(parsedDate.getDate()).padStart(2, '0');
      const m = String(parsedDate.getMonth() + 1).padStart(2, '0');
      const y = parsedDate.getFullYear();
      return `${d}/${m}/${y}`;
    }
  } catch(e) {}

  return engDateStr.replace(/-/g, "/");
}

// Calculate static or fallback start range
export function getJobDates(job: JobPost) {
  const formattedLast = formatDateToDDMMYYYY(job.lastDate);
  
  if (job.startDate) {
    return {
      start: formatDateToDDMMYYYY(job.startDate),
      last: formattedLast
    };
  }

  // Calculate 20 days prior for fallback
  try {
    const regex = /(\d{2})\/(\d{2})\/(\d{4})/;
    const lastParts = formattedLast.match(regex);
    if (lastParts) {
      const d = parseInt(lastParts[1]);
      const m = parseInt(lastParts[2]) - 1;
      const y = parseInt(lastParts[3]);
      const lastDateObj = new Date(y, m, d);
      const startDateObj = new Date(lastDateObj.getTime() - 22 * 24 * 3600 * 1000);
      const startDay = String(startDateObj.getDate()).padStart(2, '0');
      const startMonth = String(startDateObj.getMonth() + 1).padStart(2, '0');
      const startYear = startDateObj.getFullYear();
      return {
        start: `${startDay}/${startMonth}/${startYear}`,
        last: formattedLast
      };
    }
  } catch(e) {}

  return {
    start: "18/05/2026",
    last: formattedLast
  };
}

export default function JobSection({ jobs, onApplyJob, lang }: JobSectionProps) {
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const t = jobTranslations[lang] || jobTranslations.mr;

  const toggleJob = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const handleShare = (e: React.MouseEvent, job: JobPost) => {
    e.stopPropagation();
    
    const title = lang === "mr" ? job.titleMR : lang === "hi" && job.titleHI ? job.titleHI : job.title;
    const dept = lang === "mr" ? job.departmentMR : lang === "hi" && job.departmentHI ? job.departmentHI : job.department;
    const qual = lang === "mr" ? (job.qualificationMR || job.qualification) : lang === "hi" ? (job.qualificationHI || job.qualification) : job.qualification;

    const dates = getJobDates(job);

    const ageLimit = lang === "mr" ? (job.ageLimitMR || job.ageLimit) : lang === "hi" ? (job.ageLimitHI || job.ageLimit) : job.ageLimit;
    const feeInfo = `खुला: ₹${job.feeGeneral} | मागास: ₹${job.feeReserved} | सर्व्हिस चार्ज: ₹${job.serviceCharge}`;
    const postsInfo = job.posts?.map(p => `${p.nameMR || p.name}: ${p.vacancy}`).join(", ") || "";

    const text = encodeURIComponent(
      `🚨 *नवीन भरती जाहीर!* 🚨\n\n` +
      `🎯 *${title}*\n\n` +
      `🏢 *विभाग:* ${dept}\n` +
      `👥 *एकूण जागा:* ${job.totalVacancies} पदे\n` +
      (postsInfo ? `📋 *पदे:* ${postsInfo}\n` : "") +
      `🎓 *पात्रता:* ${qual}\n` +
      `🎂 *वयाची अट:* ${ageLimit}\n\n` +
      `📅 *सुरुवात:* ${dates.start}\n` +
      `⏰ *शेवटची तारीख:* ${dates.last}\n\n` +
      `💰 *फॉर्म फी:* ${feeInfo}\n\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `✅ *अर्ज साईराम कॉम्प्युटरमार्फत भरा!*\n` +
      `📞 *राहुल मिसे: 9011083440*\n` +
      `🌐 ${window.location.origin}\n` +
      `━━━━━━━━━━━━━━━━━━\n` +
      `⚡ _हे मेसेज तुमच्या मित्र-मैत्रिणींना पाठवा — कुणाची नोकरी लागेल!_`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="space-y-6" id="job-section-container">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-rose-100 pb-3">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-950 flex items-center gap-2 font-sans">
            <span className="text-rose-600">🎯</span>
            {t.sectionHeading}
          </h2>
          <p className="text-xs text-gray-500 mt-1 font-semibold leading-relaxed">
            {t.sectionSub}
          </p>
        </div>
        <span className="bg-rose-50 text-rose-700 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full border border-rose-200 shrink-0 animate-pulse">
          🔥 {t.totalLiveCount}: {jobs.length}
        </span>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => {
          const isExpanded = expandedJobId === job.id;

          const currentTitle = lang === "mr" ? job.titleMR : lang === "hi" && job.titleHI ? job.titleHI : job.title;
          const currentDept = lang === "mr" ? job.departmentMR : lang === "hi" && job.departmentHI ? job.departmentHI : job.department;
          const currentQual = lang === "mr" ? (job.qualificationMR || job.qualification) : lang === "hi" ? (job.qualificationHI || job.qualification) : job.qualification;
          const currentAge = lang === "mr" ? (job.ageLimitMR || job.ageLimit) : lang === "hi" ? (job.ageLimitHI || job.ageLimit) : job.ageLimit;
          const currentDocs = lang === "mr" ? (job.importantDocumentsMR || job.importantDocuments) : lang === "hi" ? (job.importantDocumentsHI || job.importantDocuments) : job.importantDocuments;

          const dates = getJobDates(job);

          return (
            <div
              key={job.id}
              onClick={() => toggleJob(job.id)}
              className={`rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                isExpanded
                  ? "bg-rose-50/20 border-rose-400 shadow-md ring-1 ring-rose-200"
                  : "bg-white border-gray-200 hover:border-rose-300 hover:bg-gray-55 hover:shadow-sm"
              }`}
              id={`job-row-${job.id}`}
            >
              {/* Header/Summary View */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 flex-grow">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                      ✨ {currentDept}
                    </span>
                    <span className="bg-slate-100 text-slate-700 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gray-500" />
                      {job.totalVacancies} {t.postsWord}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-gray-900 text-md md:text-lg leading-snug">
                    {currentTitle}
                  </h3>

                  {/* Clean Formatted Alert Dates and Fee Summary */}
                  <div className="flex flex-col gap-1.5 text-[11px] sm:text-xs font-bold mt-1">
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-100">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>अर्ज सुरुवात: <strong className="font-mono text-gray-950">{dates.start}</strong></span>
                      </span>
                      <span className="flex items-center gap-1 bg-rose-50 text-rose-800 px-2.5 py-1 rounded-md border border-rose-100">
                        <Calendar className="w-3.5 h-3.5 text-rose-600" />
                        <span>शेवटची तारीख: <strong className="font-mono text-rose-950 font-black">{dates.last}</strong></span>
                      </span>
                    </div>
                    <span className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2.5 py-1 rounded-md border border-amber-100 w-fit">
                      <span>{t.serviceChargeLabel}: <strong className="font-mono text-amber-950 font-black">₹{job.serviceCharge}</strong></span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:self-center shrink-0">
                  <button
                    onClick={(e) => handleShare(e, job)}
                    className="p-2.5 text-green-700 hover:text-white bg-green-50 hover:bg-green-600 rounded-xl border border-green-200 transition-all cursor-pointer flex items-center gap-1.5"
                    title={t.shareLabel}
                    id={`share-btn-${job.id}`}
                  >
                    <Share2 className="w-4.5 h-4.5" />
                    <span className="text-xs font-bold hidden sm:inline">{t.shareLabel}</span>
                  </button>

                  <div className="bg-rose-100/50 p-2 rounded-xl text-rose-700 border border-rose-200/50">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-rose-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-rose-600" />
                    )}
                  </div>
                </div>
              </div>

              {/* Inline Collapsible Element using motion */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    onClick={(e) => e.stopPropagation()} // stop parent toggle
                    className="overflow-hidden border-t border-rose-100 bg-white"
                  >
                    <div className="p-5 md:p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-100 text-xs">
                        <div>
                          <h4 className="text-[10px] uppercase font-black tracking-wider text-stone-500">
                            {t.totalPositions}
                          </h4>
                          <p className="text-sm font-extrabold text-stone-900 mt-0.5">
                            {job.totalVacancies} {t.postsWord}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-[10px] uppercase font-black tracking-wider text-rose-500">
                            {t.deadlineLabel}
                          </h4>
                          <p className="text-xs font-extrabold text-rose-700 mt-0.5">
                            {dates.last} {t.untilLabel} ({t.startMinLabel}: {dates.start})
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <h4 className="text-[10px] uppercase font-black tracking-wider text-stone-500">
                            {t.qualificationLabel}
                          </h4>
                          <p className="text-xs font-bold text-gray-700 leading-relaxed mt-1">
                            {currentQual}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <h4 className="text-[10px] uppercase font-black tracking-wider text-stone-500">
                            {t.ageLimitLabel}
                          </h4>
                          <p className="text-xs font-bold text-gray-700 mt-1">
                            {currentAge}
                          </p>
                        </div>
                      </div>

                      {/* EXPLICIT, SECURE PAYMENT INFORMATION - HIGH CLARITY BILL SLAT */}
                      <div className="border border-amber-200 bg-amber-50/20 rounded-2xl p-4 md:p-5 space-y-4">
                        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm border-b border-amber-200/50 pb-2">
                          <Info className="w-4 h-4 text-amber-700 shrink-0" />
                          <span>{t.feeInfoMainHeader}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Govt Cost */}
                          <div className="space-y-2">
                            <span className="text-[10px] text-amber-800 font-black uppercase tracking-wider block">
                              {t.officialGovtFeeLabel}
                            </span>
                            <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 text-xs space-y-1.5 font-bold">
                              <div className="flex justify-between items-center text-gray-800">
                                <span>{t.openCategoryLabel}</span>
                                <span className="font-mono text-gray-950">₹{job.feeGeneral}</span>
                              </div>
                              <div className="flex justify-between items-center text-gray-800 border-t border-gray-150 pt-1.5">
                                <span>{t.reservedCategoryLabel}</span>
                                <span className="font-mono text-gray-950">₹{job.feeReserved}</span>
                              </div>
                            </div>
                            <span className="text-[9px] text-gray-500 font-medium block">
                              {t.feeDisclaimer}
                            </span>
                          </div>

                          {/* Sairam Charge */}
                          <div className="space-y-2">
                            <span className="text-[10px] text-amber-800 font-black uppercase tracking-wider block">
                              {t.processingFeeLabel}
                            </span>
                            <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-200/60 text-xs space-y-1">
                              <p className="font-black text-indigo-900 text-base">₹{job.serviceCharge} /-</p>
                              <p className="text-[9px] text-indigo-750 text-indigo-900 font-medium leading-normal pt-1">
                                {t.processingFeeDesc}
                              </p>
                            </div>
                          </div>

                          {/* Total Gross Sum */}
                          <div className="space-y-2">
                            <span className="text-[10px] text-amber-800 font-black uppercase tracking-wider block">
                              {t.totalChargesLabel}
                            </span>
                            <div className="bg-amber-100/50 p-3 rounded-xl border border-amber-300 text-xs space-y-1.5 font-bold">
                              <div className="flex justify-between items-center text-gray-900">
                                <span>{t.openTotalLabel}</span>
                                <span className="font-mono text-emerald-800 text-sm font-black">₹{job.feeGeneral + job.serviceCharge}</span>
                              </div>
                              <div className="flex justify-between items-center text-gray-900 border-t border-amber-300 pt-1.5">
                                <span>{t.reservedTotalLabel}</span>
                                <span className="font-mono text-emerald-800 text-sm font-black">₹{job.feeReserved + job.serviceCharge}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sub-Post Category breakdown */}
                      <div>
                        <span className="text-xs font-black text-gray-750 block mb-2">{t.tableSubtitle}</span>
                        <div className="border border-gray-150 rounded-xl overflow-hidden text-xs">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-150 text-gray-600 font-bold">
                              <tr>
                                <th className="p-2.5 text-left bg-gray-50">{t.tableColPost}</th>
                                <th className="p-2.5 text-right w-24 bg-gray-50">{t.tableColVacancy}</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {job.posts.map((p, idx) => {
                                const postName = lang === "mr" && p.nameMR ? p.nameMR : lang === "hi" && p.nameHI ? p.nameHI : p.name;
                                return (
                                  <tr key={idx} className="hover:bg-gray-50/50">
                                    <td className="p-2.5 font-bold text-gray-700">{postName}</td>
                                    <td className="p-2.5 text-right font-semibold text-gray-850">{p.vacancy}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Important Documents needed */}
                      <div>
                        <span className="text-xs font-black text-rose-700 block mb-2 flex items-center gap-1">
                          <ClipboardList className="w-4 h-4" />
                          {t.requiredDocsLabel}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-1">
                          {currentDocs.map((doc, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-700 font-medium">
                              <span className="text-rose-500 font-black">✔</span>
                              <span>{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-5 flex items-center justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onApplyJob(job);
                          }}
                          className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 hover:shadow-md text-white font-black text-sm px-7 py-3 rounded-2xl flex items-center justify-center gap-2 group transition-all transform active:scale-95 cursor-pointer"
                          id={`apply-job-btn-${job.id}`}
                        >
                          <Sparkles className="w-4 h-4 fill-white text-rose-300 group-hover:animate-bounce" />
                          <span>{t.applySubmitBtn}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
