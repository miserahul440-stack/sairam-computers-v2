import React, { useState, useEffect } from "react";
import { UserProfile, JobPost, ServiceItem } from "../types";
import { X, ShieldAlert, CheckCircle, Smartphone, User, Image, ArrowRight, DollarSign } from "lucide-react";

interface ApplyModalProps {
  user: UserProfile;
  token: string | null;
  service: ServiceItem | null;
  job: JobPost | null;
  onClose: () => void;
  onApplySuccess: () => void;
  lang: "mr" | "en" | "hi";
}

const applyTranslations = {
  mr: {
    ownerSubtitle: "साईराम कॉम्प्युटर डिजिटल अर्ज प्रक्रिया • मालक: राहुल मिसे",
    unsupportedDocsWord: "अपूर्ण कागदपत्रे! कृपया आधी तुमच्या 'डॉक्युमेंट वॉलेट' टॅबमध्ये जाऊन लागणारे सर्व कागदपत्रे अपलोड करा. (कमी असलेले कागदपत्र:",
    docWalletCheckHeader: "📁 सुरक्षित डॉक्युमेंट वॉलेट तपासणी:",
    docAvailableWallet: "✅ वॉलेटमध्ये उपलब्ध आहे",
    docMissingWallet: "❌ अजून अपलोड नाही! आधी वॉलेटमध्ये अपलोड करा",
    backToUploadWarn: "⚠️ कृपया अर्ज सबमिट करण्यापूर्वी डॅशबोर्डवरील 'डॉक्युमेंट वॉलेट' टॅबमध्ये जाऊन संबंधित कागदपत्रे अपलोड करा. यामुळे तुम्हाला वारंवार एकाच फॉर्मसाठी फाईल्स अपलोड कराव्या लागणार नाहीत.",
    primaryInfoLabel: "📝 अर्जासाठी आवश्यक माहिती भरा:",
    jobInfoTitle: "📋 शासकीय योजना/नोकरी भरती अर्ज तपशील:",
    jobInfoDesc: "हा अर्ज निवडल्यामुळे वर्षे तुमचे आधार कार्ड, गुणपत्रिका, फोटो व स्वाक्षरी हे तुमच्या डिजिटल डॉक्युमेंट वॉलेटमधून परस्पर समाविष्ट केले जातील. राहुल मिसे सर अधिकृत शासकीय सर्व्हरवर अत्यंत विश्वसनीय पद्धतीने तुमचा अर्ज सादर करतील.",
    feePaymentHeader: "💳 फी व सुरक्षित पेमेंट पर्याय:",
    amountPayable: "देय किंमत (सर्व्हिस चार्ज मिळून)",
    feeSplitUp: "शासकीय फी: ₹{govFee} + साईराम सर्व्हिस चार्ज: ₹{itemCharge}",
    scanToPay: "स्कॅन करून ९०११०८३४४० वर पाठवावे.",
    payLaterLabel: "सध्या पेमेंट न करता फॉर्म भरल्यानंतर देईन (Pay Later)",
    qrChosenMsg: "✅ क्युआर पेमेंट निवडले आहे: वरील क्युआर बारकोड स्कॅन करून पेमेंट पूर्ण करा. तुम्ही जसे “साईराम कॉम्प्युटरकडे सेंड करा” वर क्लिक कराल, तसे तुमच्या बँक पेमेंट्सची नोंद आपोआप राहुल सर यांच्याकडे नोंदवली जाईल. कोणतीही पावती/स्क्रीनशॉट अपलोड करायची गरज नाही!",
    payLaterMsg: "💡 लक्षात ठेवा: तुमच्या पाशी नंतर पैसे भरायची सवलत आहे, परंतु राहुल सर फॉर्म पूर्ण भरल्यानंतर तुमचे अंतिम निकाल / रिसीट तेव्हाच जारी करतील जेव्हा तुमचे प्रलंबित पेमेंट प्राप्त होईल.",
    declarationLabel: "मी स्वयंघोषणा करतो की, शासकीय योजना/नोकरी भरती अर्ज अचूकपणे भरण्यासंदर्भात मी स्वतःहून व माझ्या संपूर्ण संमतीने माझे कायदेशीर कागदपत्रे (उदा. आधार कार्ड, पॅन कार्ड, गुणपत्रिका, सही इ.) साईराम कॉम्प्युटरकडे डिजिटल स्वरूपात सादर करत आहे.",
    cancelBtn: "रद्द करा",
    submitBtn: "साईराम कॉम्प्युटरकडे सेंड करा",
    submittingBtn: "माहिती सबमिट होत आहे...",
    invalidFormError: "फॉर्म भरताना अडचण आली.",
    successMsg: "तुमचा फॉर्म यशस्वीरीत्या नोंदविला गेला आहे! राहुल सर लवकरच भरण्याची प्रक्रिया सुरु करतील. ✅",
    errorOccured: "तात्पुरती अडचण आली. कृपया थोड्या वेळाने प्रयत्न करा.",
    docAadhar: "आधार कार्ड (Aadhar Card)",
    docPan: "पॅन कार्ड (PAN Card)",
    docMarksheet: "गुणपत्रिका (Mark List)",
    docPhoto: "पासपोर्ट फोटो (Photo)",
    docSignature: "स्वाक्षरी (Signature)",
    docIncome: "उत्पन्नाचा दाखला",
  },
  en: {
    ownerSubtitle: "Sairam Computers Digital Application • Owner: Rahul Mise",
    unsupportedDocsWord: "Missing Documents! Please go to 'Document Wallet' tab and upload all necessary documents. (Missing items:",
    docWalletCheckHeader: "📁 Secure Document Wallet Verification:",
    docAvailableWallet: "✅ Available in Secure Wallet",
    docMissingWallet: "❌ Not uploaded! Upload to wallet first",
    backToUploadWarn: "⚠️ Please go to the 'Document Wallet' tab on the dashboard to upload these documents first. This key benefit prevents double upload issues.",
    primaryInfoLabel: "📝 Fill Primary Application Details:",
    jobInfoTitle: "📋 Government Job Application Details:",
    jobInfoDesc: "Selecting this application automatically retrieves Aadhaar, Marksheet, Photo, and Signature from your secure wallet. Mr. Rahul Mise will process your form reliably on official servers.",
    feePaymentHeader: "💳 Fees & Secure Payment Option:",
    amountPayable: "Deed Amount (Service Charge included)",
    feeSplitUp: "Govt Fee: ₹{govFee} + Sairam Service Fee: ₹{itemCharge}",
    scanToPay: "Scan to pay to 9011083440.",
    payLaterLabel: "Do not submit payment now, I will pay after the form is filled (Pay Later).",
    qrChosenMsg: "✅ QR Payment Selected: Scan the barcode above to pay. Once you click 'Send to Sairam Computers', your bank payment log will sync instantly with Rahul Sir. No screenshot upload needed!",
    payLaterMsg: "💡 Keep in Mind: You can pay later, but Rahul Sir will only share final receipt documents once your pending payment is received.",
    declarationLabel: "I hereby self-certify that for the purpose of government schemes/job applications, I am voluntarily submitting my legal documents (Aadhaar, PAN, Marksheet, Signature, etc.) in digital format to Sairam Computers.",
    cancelBtn: "Cancel",
    submitBtn: "Send to Sairam Computers",
    submittingBtn: "Submitting details...",
    invalidFormError: "Something went wrong while submitting the form.",
    successMsg: "Your form registration was recorded successfully! Rahul Sir will start filling it soon. ✅",
    errorOccured: "An unexpected error occurred. Please try again after some time.",
    docAadhar: "Aadhaar Card",
    docPan: "PAN Card",
    docMarksheet: "Marksheet / Certificate",
    docPhoto: "Passport Photo",
    docSignature: "Signature",
    docIncome: "Income Certificate",
  },
  hi: {
    ownerSubtitle: "साईराम कंप्यूटर डिजिटल आवेदन • संचालक: राहुल मिसे",
    unsupportedDocsWord: "अपूर्ण दस्तावेज! कृपया पहले 'दस्तावेज वॉलेट' टैब में जाकर आवश्यक दस्तावेज अपलोड करें। (अपूर्ण दस्तावेज:",
    docWalletCheckHeader: "📁 सुरक्षित दस्तावेज वॉलेट जांच:",
    docAvailableWallet: "✅ सुरक्षित वॉलेट में उपलब्ध",
    docMissingWallet: "❌ अपलोड नहीं है! पहले वॉलेट में अपलोड करें",
    backToUploadWarn: "⚠️ कृपया आवेदन करने से पहले डैशबोर्ड पर 'दस्तावेज वॉलेट' टैब में जाकर उपरोक्त दस्तावेज अपलोड करें। इससे बार-बार अपलोड करने की आवश्यकता नहीं होगी।",
    primaryInfoLabel: "📝 आवेदन की प्राथमिक जानकारी भरें:",
    jobInfoTitle: "📋 सरकारी नौकरी भर्ती आवेदन जानकारी:",
    jobInfoDesc: "यह आवेदन चुनने पर आपके सुरक्षित वॉलेट से आधार, अंकतालिका, फोटो और हस्ताक्षर स्वचालित रूप से ले लिए जाएंगे। राहुल मिसे सर सरकारी सर्वर पर आपका आधिकारिक फॉर्म सफलतापूर्वक भरेंगे।",
    feePaymentHeader: "💳 फीस और सुरक्षित भुगतान विकल्प:",
    amountPayable: "देय राशि (सेवा शुल्क शामिल)",
    feeSplitUp: "सरकारी शुल्क: ₹{govFee} + साईराम सेवा शुल्क: ₹{itemCharge}",
    scanToPay: "९०११०८३४४० पर भुगतान करना है।",
    payLaterLabel: "अभी भुगतान न करें, फॉर्म भरने के बाद भुगतान करेंगे। (Pay Later)",
    qrChosenMsg: "✅ क्यूआर भुगतान चुना गया है: ऊपर दिए गए क्यूआर बारकोड को स्कैन करके भुगतान पूरा करें। जैसे ही आप 'साईराम कंप्यूटर को भेजें' पर क्लिक करेंगे, आपका भुगतान विवरण राहुल सर के पास दर्ज हो जाएगा। स्क्रीनशॉट अपलोड करने की आवश्यकता नहीं है!",
    payLaterMsg: "💡 ध्यान रखें: पेमेंट बाद में करने की सुविधा उपलब्ध है, लेकिन राहुल सर फॉर्म पूरा होने के बाद आपकी अंतिम रसीद तभी जारी करेंगे जब लंबित भुगतान प्राप्त हो जाएगा।",
    declarationLabel: "मैं स्व-घोषणा करता हूं कि सरकारी योजनाओं/नौकरी भर्ती आवेदनों को सही ढंग से भरने के उद्देश्य से, मैं स्वेच्छा से अपने कानूनी दस्तावेज (जैसे आधार कार्ड, पॅन कार्ड, अंकतालिका, हस्ताक्षर आदि) डिजिटल रूप में साईराम कंप्यूटर को सौंप रहा हूं।",
    cancelBtn: "रद्द करें",
    submitBtn: "साईराम कंप्यूटर को भेजें",
    submittingBtn: "जानकारी भेजी जा रही है...",
    invalidFormError: "फॉर्म भरते समय कोई त्रुटि आई।",
    successMsg: "आपका फॉर्म सफलतापूर्वक पंजीकृत हो गया है! राहुल सर जल्द ही इसे भरने की प्रक्रिया शुरू करेंगे। ✅",
    errorOccured: "अस्थायी त्रुटि आई। कृपया कुछ समय बाद पुनः प्रयास करें।",
    docAadhar: "आधार कार्ड (Aadhar Card)",
    docPan: "पॅन कार्ड (PAN Card)",
    docMarksheet: "अंकतालिका (Marksheet)",
    docPhoto: "पासपोर्ट फोटो (Photo)",
    docSignature: "हस्ताक्षर (Signature)",
    docIncome: "आय प्रमाण पत्र",
  }
};

export default function ApplyModal({ user, token, service, job, onClose, onApplySuccess, lang }: ApplyModalProps) {
  const [customFields, setCustomFields] = useState<{ [key: string]: string }>({});
  const [payLater, setPayLater] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inlineUploads, setInlineUploads] = useState<Record<string, string>>({});

  const handleInlineDocUpload = async (docType: string, file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setInlineUploads(prev => ({ ...prev, [docType]: base64 }));
      try {
        await fetch("/api/wallet/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token || ""}` },
          body: JSON.stringify({ fileType: docType, fileBase64: base64, fileName: file.name }),
        });
      } catch(e) {}
    };
    reader.readAsDataURL(file);
  };
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [formConsent, setFormConsent] = useState(false);

  const t = applyTranslations[lang] || applyTranslations.mr;

  const isJob = !!job;
  const itemTitle = isJob 
    ? (lang === "mr" ? job.titleMR : lang === "hi" && job.titleHI ? job.titleHI : job.title)
    : (lang === "mr" && service?.titleMR ? service.titleMR : lang === "hi" && service?.titleHI ? service.titleHI : service?.title || "");

  const itemCharge = isJob ? job.serviceCharge : service?.serviceCharge || 0;
  const govFee = isJob ? job.feeGeneral : 0;
  const totalAmount = govFee + itemCharge;

  // Map job document names to wallet keys
  const DOC_NAME_TO_KEY: Record<string, string> = {
    "aadhar card": "aadhar", "aadhaar card": "aadhar", "आधार कार्ड": "aadhar",
    "pan card": "pan", "पॅन कार्ड": "pan",
    "10th marksheet": "marksheet10", "10th certificate": "marksheet10", "ssc": "marksheet10",
    "12th marksheet": "marksheet12", "12th certificate": "marksheet12", "hsc": "marksheet12",
    "graduation": "graduation", "degree": "graduation", "पदवी": "graduation",
    "photo": "photo", "passport photo": "photo", "फोटो": "photo",
    "signature": "signature", "स्वाक्षरी": "signature", "photo & signature": "photo",
    "caste certificate": "caste", "जातीचा दाखला": "caste",
    "domicile certificate": "domicile", "अधिवास": "domicile",
    "income certificate": "income", "उत्पन्न": "income",
    "birth certificate": "birth", "जन्म दाखला": "birth",
    "disability certificate": "disability",
    "ncc certificate": "ncc", "ncc": "ncc",
    "experience certificate": "experience",
    "non-creamy layer certificate": "caste",
  };

  const getWalletKey = (docName: string): string => {
    const lower = docName.toLowerCase().trim();
    return DOC_NAME_TO_KEY[lower] || lower.split(" ")[0];
  };

  const rawMandated = isJob
    ? (job.mandatedDocs?.length ? job.mandatedDocs : job.importantDocuments?.length ? job.importantDocuments : ["aadhar", "marksheet10", "photo", "signature"])
    : (service?.mandatedDocs || []);

  const mandatedDocs = rawMandated.map((d: string) =>
    d.includes("Url") ? d.replace("Url", "") : getWalletKey(d)
  );

  const missingDocs: string[] = [];
  const safeDocuments = user.documents || {};

  mandatedDocs.forEach((docType: string) => {
    const urlKey = `${docType}Url`;
    if (!safeDocuments[urlKey]) {
      missingDocs.push(docType);
    }
  });

  const getDocLabel = (type: string) => {
    switch (type) {
      case "aadhar":
        return t.docAadhar;
      case "pan":
        return t.docPan;
      case "marksheet":
        return t.docMarksheet;
      case "photo":
        return t.docPhoto;
      case "signature":
        return t.docSignature;
      case "income":
        return t.docIncome;
      default:
        return type;
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setCustomFields((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const stillMissing = missingDocs.filter(d => !inlineUploads[d]);
    if (stillMissing.length > 0) {
      setErrorMsg(
        `${t.unsupportedDocsWord} ${stillMissing
          .map((d) => getDocLabel(d))
          .join(", ")})`
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/applications/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: isJob ? "job" : (service?.key ? "student" : "farmer"),
          formKey: isJob ? job.id : service?.key,
          formTitle: itemTitle,
          customDetails: customFields,
          paymentScreenshotBase64: null,
          payLater,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t.invalidFormError);
      }

      if (data.success) {
        setSuccessMsg(t.successMsg);
        setTimeout(() => {
          onApplySuccess();
          onClose();
        }, 3000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || t.errorOccured);
    } finally {
      setLoading(false);
    }
  };

  const upiUrl = `upi://pay?pa=miserahul440-1@okaxis&pn=Rahul%20Mise&am=${totalAmount}&tn=Sairam%20Computes%20-$${itemTitle.substring(0,10)}`;
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-rose-100 shadow-2xl p-6 relative overflow-hidden animated-fade-in my-8 max-h-[90vh] overflow-y-auto w-full">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          id="close-apply-modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-gray-100 pb-4">
          <span className="text-xl">🎓</span>
          <h3 className="font-extrabold text-base md:text-lg text-gray-950 mt-1 line-clamp-1">{itemTitle}</h3>
          <p className="text-[11px] text-gray-500 font-bold">
             {t.ownerSubtitle} ({user.mobile})
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-xl my-4 text-center leading-relaxed">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-4 rounded-xl my-4 text-center leading-relaxed">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-6">
          {/* Missing Document warning module */}
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
            <span className="text-xs font-black text-rose-800 block mb-2">{t.docWalletCheckHeader}</span>
            <div className="space-y-2">
              {mandatedDocs.map((docType) => {
                const isUploaded = !missingDocs.includes(docType);
                return (
                  <div key={docType} className="flex items-center justify-between text-xs font-bold">
                    <span className="text-gray-600 font-semibold">{getDocLabel(docType)}</span>
                    {isUploaded || inlineUploads[docType] ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">✅ उपलब्ध</span>
                    ) : (
                      <label className="cursor-pointer">
                        <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[10px] font-bold">📤 आत्ता Upload करा</span>
                        <input type="file" accept="image/*,application/pdf" className="hidden"
                          onChange={(e) => { if(e.target.files?.[0]) handleInlineDocUpload(docType, e.target.files[0]); }} />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
            {missingDocs.filter(d => !inlineUploads[d]).length > 0 && (
              <span className="text-[10px] text-amber-600 font-bold mt-3 block">
                ⚠️ वरील कागदपत्रे "📤 आत्ता Upload करा" वर click करून upload करा — Wallet मध्ये पण save होतील!
              </span>
            )}
          </div>

          {/* Dynamic parameter Fields */}
          {!isJob && service && service.fields.length > 0 && (
            <div className="space-y-4">
              <span className="text-xs font-black text-gray-700 block mb-1">{t.primaryInfoLabel}</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.fields.map((f, idx) => {
                  const labelToUse = lang === "mr" && (f as any).labelMR ? (f as any).labelMR : lang === "hi" && (f as any).labelHI ? (f as any).labelHI : f.label;
                  const placeholderToUse = lang === "mr" && (f as any).placeholderMR ? (f as any).placeholderMR : lang === "hi" && (f as any).placeholderHI ? (f as any).placeholderHI : f.placeholder;
                  
                  return (
                    <div key={idx} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                      <label className="text-xs font-bold text-gray-700 block mb-1">{labelToUse}</label>
                      {f.type === "textarea" ? (
                        <textarea
                          value={customFields[f.name] || ""}
                          onChange={(e) => handleInputChange(f.name, e.target.value)}
                          placeholder={placeholderToUse}
                          rows={3}
                          className="w-full text-xs font-bold p-3 border border-gray-200 hover:border-rose-450 focus:border-rose-600 rounded-xl outline-none transition-all resize-none"
                          required
                        />
                      ) : (
                        <input
                          type={f.type}
                          value={customFields[f.name] || ""}
                          onChange={(e) => handleInputChange(f.name, e.target.value)}
                          placeholder={placeholderToUse}
                          className="w-full text-xs font-bold p-3 border border-gray-200 hover:border-rose-450 focus:border-rose-600 rounded-xl outline-none transition-all"
                          required
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dynamic specialized info if applying for Government Vacancy */}
          {isJob && (
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
              <span className="text-xs font-black text-amber-800">{t.jobInfoTitle}</span>
              <p className="text-[11px] text-amber-700 mt-1 leading-relaxed font-semibold">
                {t.jobInfoDesc}
              </p>
            </div>
          )}

          {/* Sairam payment options and UPI integration */}
          <div className="border-t border-gray-100 pt-5">
            <span className="text-xs font-black text-gray-750 block mb-3">{t.feePaymentHeader}</span>
            
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col md:flex-row gap-5 items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block">{t.amountPayable}</span>
                <span className="text-2xl font-black text-rose-700 font-mono mt-1 block">₹{totalAmount}/-</span>
                <span className="text-[10px] text-gray-500 font-semibold block mt-1.5 leading-relaxed">
                  {t.feeSplitUp.replace("{govFee}", String(govFee)).replace("{itemCharge}", String(itemCharge))}
                </span>
              </div>

              {/* Functional UPI QR code */}
              <div className="text-center shrink-0">
                <img
                  src={qrImageSrc}
                  alt="Sairam Computers Pay Scanner"
                  className="w-32 h-32 border border-rose-100 p-1.5 rounded-xl bg-white shadow-inner mx-auto"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[9px] text-gray-400 font-bold block mt-1.5 font-mono">
                  UPI ID: miserahul440-1@okaxis
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-black px-2 py-0.5 rounded-full mt-1 inline-block">
                  {t.scanToPay}
                </span>
              </div>
            </div>

            {/* Payment Choice inputs */}
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="payLater"
                  checked={payLater}
                  onChange={(e) => {
                    setPayLater(e.target.checked);
                  }}
                  className="w-4.5 h-4.5 text-rose-600 border-gray-300 rounded focus:ring-rose-500 cursor-pointer"
                />
                <label htmlFor="payLater" className="text-xs font-black text-gray-750 cursor-pointer select-none">
                  {t.payLaterLabel}
                </label>
              </div>

              {!payLater ? (
                <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-2xl text-[11px] text-emerald-800 font-extrabold leading-relaxed">
                  {t.qrChosenMsg}
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-250 p-3.5 rounded-2xl text-[11px] text-amber-800 font-bold leading-relaxed">
                  {t.payLaterMsg}
                </div>
              )}
            </div>
          </div>

          {/* Self-Declaration Document Consent Checkbox */}
          <div className="flex items-start gap-2.5 bg-amber-50/60 border border-amber-200 p-3.5 rounded-2xl">
            <input
              type="checkbox"
              id="form-submit-declaration"
              checked={formConsent}
              onChange={(e) => setFormConsent(e.target.checked)}
              className="w-4.5 h-4.5 text-rose-650 border-gray-300 rounded focus:ring-rose-500 cursor-pointer mt-0.5 shrink-0 accent-rose-600"
              required
            />
            <label htmlFor="form-submit-declaration" className="text-[11px] text-amber-950 font-bold cursor-pointer select-none leading-relaxed">
              {t.declarationLabel}
            </label>
          </div>

          {/* Form Actions */}
          <div className="border-t border-gray-100 pt-5 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-bold active:scale-95 transition-all cursor-pointer"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              disabled={loading || missingDocs.filter(d => !inlineUploads[d]).length > 0 || !formConsent}
              className={`px-5 py-2.5 rounded-xl text-white font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer ${
                (missingDocs.filter(d => !inlineUploads[d]).length > 0 || !formConsent) ? "bg-rose-400 opacity-60 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700"
              }`}
              id="submit-app-btn"
            >
              <span>{loading ? t.submittingBtn : t.submitBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
