import React, { useState, useEffect } from "react";
import { Announcement } from "../types";
import { Megaphone, Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NewsTickerProps {
  announcements: Announcement[];
  lang: "mr" | "en" | "hi";
}

const tickerTranslations = {
  mr: {
    header: "नवीन घडामोडी:",
    prevBtn: "मागील बातमी",
    nextBtn: "पुढील बातमी",
    typeNew: "जाहिरात",
    typeDeadline: "शेवटची तारीख",
    typeInfo: "महत्वाचे"
  },
  en: {
    header: "Latest Updates:",
    prevBtn: "Previous News",
    nextBtn: "Next News",
    typeNew: "Recruitment",
    typeDeadline: "Deadline",
    typeInfo: "Important"
  },
  hi: {
    header: "नवीन अपडेट्स:",
    prevBtn: "पिछली खबर",
    nextBtn: "अगली खबर",
    typeNew: "विज्ञापन",
    typeDeadline: "अंतिम तारीख",
    typeInfo: "महत्वपूर्ण"
  }
};

export default function NewsTicker({ announcements, lang }: NewsTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const t = tickerTranslations[lang] || tickerTranslations.mr;

  useEffect(() => {
    if (!announcements || announcements.length <= 1) return;
    
    // Auto cycle every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [announcements]);

  if (!announcements || announcements.length === 0) return null;

  const currentAnn = announcements[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <div className="bg-amber-50 border-y border-amber-200 py-2.5 px-4 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {/* Badge label block */}
        <div className="flex items-center gap-1.5 bg-amber-600 text-white text-xs font-black uppercase px-3 py-1.5 rounded-lg shrink-0 animate-pulse font-sans">
          <Megaphone className="w-4 h-4 fill-white" />
          <span>{t.header}</span>
        </div>

        {/* Carousel indicator showing pagination */}
        <div className="text-[10px] text-amber-800 font-extrabold bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded border border-amber-200 shrink-0 hidden sm:inline-block">
          {currentIndex + 1} / {announcements.length}
        </div>
      </div>

      {/* Actual Single Message Slider Core */}
      <div className="flex-1 overflow-hidden min-w-0 w-full relative flex items-center justify-between gap-2">
        <button
          onClick={handlePrev}
          className="p-1 rounded-full hover:bg-amber-100 text-amber-700 hover:text-amber-900 transition-colors cursor-pointer shrink-0"
          title={t.prevBtn}
          id="news-prev-btn"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 overflow-hidden min-w-0 py-1 text-center sm:text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2 text-xs md:text-sm text-gray-800 font-bold leading-normal truncate"
            >
              <div className="flex items-center justify-center sm:justify-start gap-1.5 shrink-0">
                <Bell className="w-4 h-4 text-rose-500 animate-bounce shrink-0" />
                <span
                  className={`px-2 py-0.5 text-[10px] rounded-full font-black uppercase inline-block ${
                    currentAnn.type === "new"
                      ? "bg-red-100 text-red-700 border border-red-200"
                      : currentAnn.type === "deadline"
                      ? "bg-amber-100 text-amber-700 border border-amber-200"
                      : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {currentAnn.type === "new"
                    ? t.typeNew
                    : currentAnn.type === "deadline"
                    ? t.typeDeadline
                    : t.typeInfo}
                </span>
              </div>
              <span className="text-gray-900 break-words line-clamp-1 flex-1 text-xs md:text-sm tracking-wide">
                {lang === "mr" && currentAnn.titleMR ? currentAnn.titleMR : lang === "hi" && currentAnn.titleHI ? currentAnn.titleHI : currentAnn.title}
              </span>
              <span className="text-gray-400 font-mono text-[10px] md:text-xs shrink-0 bg-white/60 px-1.5 py-0.5 rounded border border-gray-100 inline-block self-center">
                ({currentAnn.date})
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={handleNext}
          className="p-1 rounded-full hover:bg-amber-100 text-amber-700 hover:text-amber-900 transition-colors cursor-pointer shrink-0"
          title={t.nextBtn}
          id="news-next-btn"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
