import React, { useState, useEffect } from "react";
import { FormApplication, JobPost, Announcement } from "../types";
import { ShieldCheck, Layers, Clipboard, User, Download, PlusCircle, CheckCircle, RefreshCw, Smartphone, TrendingUp, Cpu, Copy, FileText, Check, MessageSquare } from "lucide-react";

interface AdminPanelProps {
  adminToken: string;
  applications: FormApplication[];
  jobs: JobPost[];
  announcements: Announcement[];
  onRefreshAll: () => void;
}

export default function AdminPanel({ adminToken, applications, jobs, announcements, onRefreshAll }: AdminPanelProps) {
  const [selectedApp, setSelectedApp] = useState<FormApplication | null>(null);
  
  // Update state forms
  const [statusVal, setStatusVal] = useState("");
  const [paymentStatusVal, setPaymentStatusVal] = useState("");
  const [feedbackVal, setFeedbackVal] = useState("");
  const [receiptBase64, setReceiptBase64] = useState<string | null>(null);
  const [receiptName, setReceiptName] = useState("");

  // AI OCR Extractor states
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // New Job post states
  const [showAddJob, setShowAddJob] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDept, setJobDept] = useState("");
  const [jobVacancies, setJobVacancies] = useState("");
  const [jobQual, setJobQual] = useState("");
  const [jobStartDate, setJobStartDate] = useState("");
  const [jobLastDate, setJobLastDate] = useState("");
  const [jobServiceCharge, setJobServiceCharge] = useState("");
  const [jobFeeGeneral, setJobFeeGeneral] = useState("");
  const [jobFeeReserved, setJobFeeReserved] = useState("");
  const [jobAgeLimit, setJobAgeLimit] = useState("");
  const [jobPostsList, setJobPostsList] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobDocs, setJobDocs] = useState("आधार कार्ड\n१० वी गुणपत्रिका\n१२ वी गुणपत्रिका\nफोटो & सही");

  // New announcement states
  const [newAnnText, setNewAnnText] = useState("");
  const [newAnnType, setNewAnnType] = useState<"new" | "deadline" | "important">("new");

  const [toastMsg, setToastMsg] = useState("");

  // Subscribers states
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [selectedJobForBroadcast, setSelectedJobForBroadcast] = useState<string>("");
  const [broadcastResults, setBroadcastResults] = useState<{ sentCount: number; matchedList: any[] } | null>(null);

  // Initialize update fields when selected application shifts
  useEffect(() => {
    if (selectedApp) {
      setStatusVal(selectedApp.status);
      setPaymentStatusVal(selectedApp.paymentStatus);
      setFeedbackVal(selectedApp.feedback || "");
      setReceiptBase64(null);
      setReceiptName("");
      setOcrResult(null);
    }
  }, [selectedApp]);

  // Fetch Subscribers list for admin review
  useEffect(() => {
    fetchSubscribers();
  }, [applications]);

  const fetchSubscribers = async () => {
    setSubscribersLoading(true);
    try {
      const response = await fetch("/api/admin/subscriptions", {
        headers: {
          "x-admin-token": adminToken,
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data);
      }
    } catch (e) {
      console.error("Error fetching admin subscribers", e);
    } finally {
      setSubscribersLoading(false);
    }
  };

  const handleDeleteSubscriber = async (id: string, name: string) => {
    if (!confirm(`नक्की "${name}" चे जॉब अलर्ट सबस्क्रिप्शन रद्द करायचे का?`)) return;
    try {
      const response = await fetch(`/api/admin/subscriptions/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-token": adminToken,
        }
      });
      if (response.ok) {
        setToastMsg("सबस्क्रायबर यशस्वीरित्या काढण्यात आला!");
        setTimeout(() => setToastMsg(""), 3000);
        fetchSubscribers();
      }
    } catch (err) {
      alert("रद्द करताना एरर आली.");
    }
  };

  const triggerAutoNotification = () => {
    if (!selectedJobForBroadcast) {
      alert("कृपया अधिसूचना पाठवण्यासाठी एखादी चालू नोकरी निवडा!");
      return;
    }
    const currentJob = jobs.find((j) => j.id === selectedJobForBroadcast);
    if (!currentJob) return;

    // Filter subscribers that matches job qualification (or all)
    const matched = subscribers.filter((sub) => {
      if (sub.qualification === "all") return true;
      const jobQualText = (currentJob.qualification || "").toLowerCase();
      const jobTitleText = (currentJob.title || "").toLowerCase() + " " + (currentJob.titleMR || "").toLowerCase();
      
      if (sub.qualification === "10th" && (jobQualText.includes("10") || jobQualText.includes("tenth") || jobQualText.includes("एसएससी") || jobQualText.includes("ssc") || jobQualText.includes("दहावी"))) return true;
      if (sub.qualification === "12th" && (jobQualText.includes("12") || jobQualText.includes("twelfth") || jobQualText.includes("एचएससी") || jobQualText.includes("hsc") || jobQualText.includes("बारावी") || jobQualText.includes("constable") || jobQualText.includes("पोलीस"))) return true;
      if (sub.qualification === "diploma" && (jobQualText.includes("diploma") || jobQualText.includes("डिप्लोमा"))) return true;
      if (sub.qualification === "degree" && (jobQualText.includes("degree") || jobQualText.includes("graduation") || jobQualText.includes("पदवी") || jobQualText.includes("graduate") || jobQualText.includes("mpsc") || jobQualText.includes("b.sc") || jobQualText.includes("b.a") || jobQualText.includes("b.com") || jobQualText.includes("b.tech"))) return true;
      return false;
    });

    setBroadcastResults({
      sentCount: matched.length,
      matchedList: matched
    });

    setToastMsg(`🎯 मॅचिंग झालेल्या ${matched.length} सबस्क्रायबर्सना स्वयंचलित (Automatically) मेसेज ट्रिगर केले!`);
    setTimeout(() => {
      setToastMsg("");
    }, 4500);
  };

  // Copy helper
  const handleCopyToClipboard = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  // Triggers Gemini AI OCR extraction! (Awesome automation feature)
  const handleOcrAnalyze = async (fileUrl: string) => {
    setOcrLoading(true);
    setOcrResult(null);
    try {
      const response = await fetch("/api/admin/ocr-analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify({ fileUrl }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "OCR विश्लेषणात अडचण आली.");
      }

      if (data.success && data.extraction) {
        setOcrResult(data.extraction);
        setToastMsg("AI विश्लेषण यशस्वी! उजव्या बाजूस कॉपी-पेस्ट टूल उघडले आहे.");
        setTimeout(() => setToastMsg(""), 3000);
      }
    } catch (err: any) {
      alert(err.message || "तात्पुरती अडचण आली.");
    } finally {
      setOcrLoading(false);
    }
  };

  // Submit Application changes (updates user side status immediately)
  const handleUpdateAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      const response = await fetch(`/api/admin/applications/${selectedApp.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify({
          status: statusVal,
          paymentStatus: paymentStatusVal,
          feedback: feedbackVal,
          resultBase64: receiptBase64,
          resultFileName: receiptName,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "अपडेट अयशस्वी.");
      }

      setToastMsg("अर्ज सद्यस्थिती यशस्वीरित्या बदलली आहे!");
      setTimeout(() => setToastMsg(""), 3000);
      onRefreshAll();
      
      // Update selected app item reference
      setSelectedApp(data.application);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setReceiptBase64(reader.result as string);
      setReceiptName(file.name);
    };
    reader.readAsDataURL(file);
  };

  // Add customized government job post Form
  const handleAddJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedPosts = jobPostsList.split("\n").map((line) => {
        const parts = line.split(":");
        return {
          name: parts[0] || "पद",
          vacancy: parts[1] || "० पदे",
        };
      });

      const response = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify({
          titleMR: jobTitle,
          title: jobTitle,
          departmentMR: jobDept,
          department: jobDept,
          totalVacancies: jobVacancies,
          qualification: jobQual,
          qualificationMR: jobQual,
          startDate: jobStartDate || undefined,
          lastDate: jobLastDate,
          serviceCharge: jobServiceCharge,
          feeGeneral: jobFeeGeneral,
          feeReserved: jobFeeReserved,
          ageLimit: jobAgeLimit,
          ageLimitMR: jobAgeLimit,
          posts: parsedPosts,
          mandatedDocs: jobDocs.split("\n").map(d => d.trim()).filter(Boolean),
          importantDocuments: jobDocs.split("\n").map(d => d.trim()).filter(Boolean),
          description: jobDesc,
          descriptionMR: jobDesc,
        }),
      });

      if (!response.ok) throw new Error("नवीन भरती जोडता आली नाही.");

      setToastMsg("नवीन नोकरी जाहिरात यशस्वीरित्या प्रकाशित झाली! 🎯");
      setTimeout(() => setToastMsg(""), 3000);
      
      // Reset inputs
      setJobTitle("");
      setJobDept("");
      setJobVacancies("");
      setJobQual("");
      setJobLastDate("");
      setJobServiceCharge("");
      setJobFeeGeneral("");
      setJobFeeReserved("");
      setJobAgeLimit("");
      setJobPostsList("");
      setJobDesc("");
      setJobStartDate("");
      setJobDocs("आधार कार्ड\n१० वी गुणपत्रिका\n१२ वी गुणपत्रिका\nफोटो & सही");
      setShowAddJob(false);

      onRefreshAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Create Announcement
  const handleAddAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnText) return;

    try {
      const response = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify({
          title: newAnnText,
          type: newAnnType,
        }),
      });

      if (!response.ok) throw new Error("घोषणा प्रसिद्ध करता आली नाही.");

      setNewAnnText("");
      setToastMsg("घोषणा यशश्वीरीत्या लावण्यात आली आहे! ✨");
      setTimeout(() => setToastMsg(""), 3000);
      onRefreshAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Delete Announcement
  const handleDeleteAnn = async (id: string) => {
    if (!confirm("घोषणा हटवायची आहे का?")) return;
    try {
      await fetch(`/api/admin/announcements/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": adminToken },
      });
      onRefreshAll();
    } catch (err: any) {
      alert("हटवताना एरर आली.");
    }
  };

  // Delete Job Post
  const handleDeleteJob = async (id: string) => {
    if (!confirm("नोकरी जाहिरात डिलीट करायची का?")) return;
    try {
      await fetch(`/api/admin/jobs/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": adminToken },
      });
      onRefreshAll();
    } catch (err: any) {
      alert("डिलीट करताना एरर आली.");
    }
  };

  // Send WhatsApp updates template directly with 1-click! (Simplifies communication)
  const sendWhatsAppUpdate = (app: FormApplication) => {
    let text = "";
    if (statusVal === "Completed") {
      text = `*साईराम कॉम्प्युटर सेवा अपडेट:* 🌟\n\nप्रिय ग्राहक, *${app.userName}*,\nतुमचा *${app.formTitle}* ऑनलाईन अर्ज यशस्वीरित्या भरला आहे. \n\n✅ *स्टेटस:* यशस्वीरित्या पूर्ण (Completed)\n✅ *पेमेंट:* यशस्वीरित्या प्राप्त\n\nआपल्या या फॉर्मची रिसीट आमच्या वेबसाईटवरील इतिहासामध्ये उपलब्ध करण्यात आली आहे. कृपया लॉगिन करून डाऊनलोड करून घ्या.\n\n📞 संपर्क: ९०११०८३४४० (राहुल मिसे)`;
    } else {
      text = `*साईराम कॉम्प्युटर सेवा अपडेट:* ⚙️\n\nप्रिय ग्राहक, *${app.userName}*,\nतुमच्या *${app.formTitle}* अर्जाची प्रक्रिया सुरू झाली आहे.\n\n⚙️ *स्टेटस:* प्रोसेसिंग चालू (In-Progress)\n📝 *रीमार्क:* ${feedbackVal || "कागदपत्रे तपासणे सुरू आहे."}\n\nपुढील अपडेट लवकरच कळविण्यात येईल.\n📞 संपर्क: ९०११०८३४४०`;
    }
    window.open(`https://wa.me/91${app.userMobile}?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Stats Counters
  const completedApps = applications.filter((a) => a.status === "Completed");
  const pendingApps = applications.filter((a) => a.status === "Pending");
  const processingApps = applications.filter((a) => a.status === "Processing");

  // Sum Sairam Service Charges
  const totalSairamRevenue = applications
    .filter((a) => a.status === "Completed")
    .reduce((sum, app) => {
      // Find matching charge. If not directly defined, assume default avg service charge 100
      return sum + 100;
    }, 0);

  return (
    <div className="space-y-6">
      {/* Visual Header */}
      <div className="bg-gradient-to-r from-stone-900 to-rose-950 text-white rounded-3xl p-6 shadow-md flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-500 animate-pulse" />
            <h2 className="text-xl md:text-2xl font-black">साईराम कॉम्प्युटर - ॲडमीन मुख्य नियंत्रण पॅनेल</h2>
          </div>
          <p className="text-xs text-stone-300 font-bold tracking-wide mt-2">
             सर्व ग्राहकांचे ऑनलाईन अर्ज प्राप्त करणे, AI स्कॅनिंग वापरून १-क्लिक फॉर्म भरणे आणि रिअल-टाईम पावती जारी करणे.
          </p>
        </div>
        <button
          onClick={onRefreshAll}
          className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
        >
          <RefreshCw className="w-4 h-4 fill-none" />
          <span>रिफ्रेश करा</span>
        </button>
      </div>

      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-black px-5 py-3.5 rounded-2xl shadow-2xl border border-rose-300 flex items-center gap-2 shrink-0 z-50">
          <Cpu className="w-5 h-5 text-amber-400 animate-spin" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Analytics Dashboard counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase">पेंडिंग अर्ज (Pending)</span>
            <span className="text-xl md:text-2xl font-black text-amber-600 font-sans block mt-1">
              {pendingApps.length} अर्जे
            </span>
          </div>
          <span className="text-xl bg-amber-50 text-amber-600 p-2.5 rounded-xl border border-amber-100">⏳</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase font-mono">प्रोसेसिंग चालू</span>
            <span className="text-xl md:text-2xl font-black text-sky-600 font-mono block mt-1">
              {processingApps.length} अर्जे
            </span>
          </div>
          <span className="text-xl bg-sky-50 text-sky-600 p-2.5 rounded-xl border border-sky-100">⚙️</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase">पूर्ण झालेले अर्ज</span>
            <span className="text-xl md:text-2xl font-black text-emerald-600 font-sans block mt-1">
              {completedApps.length} यशस्वी
            </span>
          </div>
          <span className="text-xl bg-emerald-50 text-emerald-600 p-2.5 rounded-xl border border-emerald-100">✅</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-black block uppercase tracking-wider text-rose-500">उमदा सर्विस उत्पन्न 📈</span>
            <span className="text-xl md:text-2xl font-mono font-black text-rose-700 block mt-1">
              ₹ {totalSairamRevenue}/-
            </span>
          </div>
          <span className="text-xl bg-rose-50 text-rose-600 p-2.5 rounded-xl border border-rose-100">💰</span>
        </div>
      </div>

      {/* Grid: Application management & configuration sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
        {/* Applications table listings (Left col) */}
        <div className="lg:col-span-12 xl:col-span-7 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
            <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-1.5">
              <span>📋</span>
              नवीन आलेले ऑनलाईन ग्राहक अर्ज ({applications.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-150 text-gray-500 font-bold">
                <tr>
                  <th className="p-3 text-left">ग्राहक नाव / अर्ज</th>
                  <th className="p-3 text-center">कॅटेगरी</th>
                  <th className="p-3 text-center">स्टेटस</th>
                  <th className="p-3 text-center">पेमेंट</th>
                  <th className="p-3 text-right">ऍक्शन</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.length > 0 ? (
                  [...applications]
                    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
                    .map((app) => (
                      <tr
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                          selectedApp?.id === app.id ? "bg-slate-50/100 border-l-2 border-rose-500" : ""
                        }`}
                      >
                        <td className="p-3">
                          <span className="font-mono text-[9px] text-gray-400 font-bold">आयडी: {app.id}</span>
                          <p className="font-bold text-gray-900 mt-0.5 max-w-[180px] truncate">{app.userName}</p>
                          <p className="text-[10px] text-gray-400 font-mono font-bold mt-0.5 leading-none">{app.formTitle}</p>
                        </td>
                        <td className="p-3 text-center">
                          <span className="bg-gray-100 text-gray-700 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                            {app.category === "student" ? "विद्यार्थी" : app.category === "farmer" ? "शेतकरी" : app.category === "job" ? "जॉब" : "इतर"}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                              app.status === "Pending"
                                ? "bg-amber-100 text-amber-800"
                                : app.status === "Processing"
                                ? "bg-sky-100 text-sky-850"
                                : app.status === "Completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                              app.paymentStatus === "Paid"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : app.status === "Cancelled"
                                ? "bg-rose-100 text-rose-800 border border-rose-200 animate-pulse font-extrabold"
                                : "bg-red-50 text-red-700 border border-red-150"
                            }`}
                          >
                            {app.paymentStatus === "Paid" ? "Paid" : app.status === "Cancelled" ? "Cancelled ❌" : "Pending"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <span className="font-bold text-rose-600 hover:underline">
                            पहा &rarr;
                          </span>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400 italic font-bold">
                       अद्याप एकही ग्राहकाचा फॉर्म सबमिट झालेला नाही.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Application edit console (Right col) */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          {selectedApp ? (
            <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-6">
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <div>
                  <span className="bg-rose-50 text-rose-700 text-[10px] font-extrabold px-2 py-0.5 rounded">अर्ज प्रक्रिया नियंत्रण</span>
                  <h4 className="font-black text-gray-950 text-base mt-2">{selectedApp.userName} चा अर्ज</h4>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-xs text-gray-400 hover:text-gray-600 bg-gray-50 border border-gray-200 px-2 py-1 rounded"
                >
                  बंद करा
                </button>
              </div>

              {/* Secure wallet attachments with AI OCR Scan triggers! */}
              <div className="space-y-3 bg-stone-50 border border-stone-200 p-4 rounded-2xl">
                <span className="text-xs font-black text-stone-700 block">📁 जोडलेले सेक्युअर डॉक्युमेंट वॉलेट:</span>
                <div className="space-y-2">
                  {Object.keys(selectedApp.documents).length > 0 ? (
                    Object.entries(selectedApp.documents).map(([type, url]) => (
                      <div key={type} className="flex items-center justify-between bg-white border border-gray-200 p-2.5 rounded-xl text-xs">
                        <div>
                          <span className="font-bold text-gray-800 block capitalize">{type === "aadhar" ? "आधार कार्ड" : type === "marksheet" ? "१०/१२ वी गुणपत्रिका" : type === "income" ? "उत्पन्न दाखला" : type === "photo" ? "फोटो" : type === "signature" ? "स्वाक्षरी" : type}</span>
                          <a href={url as string} target="_blank" rel="noreferrer" className="text-[10px] text-slate-500 underline font-mono flex items-center gap-1 mt-0.5">
                            <Download className="w-3.5 h-3.5" />
                            <span>मूळ फाइल पाहा</span>
                          </a>
                        </div>

                        {/* OCR automation trigger button */}
                        <button
                          onClick={() => handleOcrAnalyze(url as string)}
                          disabled={ocrLoading}
                          className="bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white font-black text-[10px] px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer transition-all disabled:opacity-40"
                        >
                          <Cpu className="w-3.5 h-3.5" />
                          <span>{ocrLoading ? "AI एक्सट्रॅक्ट होत आहे..." : "🤖 AI OCR स्कॅन"}</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">या अर्जा संदर्भात कोणतेही कागदपत्रे जोडलेले नाही.</span>
                  )}
                </div>
              </div>

              {/* AI Auto-filler Copier Sidebar widget (Saves 80% admin time!) */}
              {ocrResult && (
                <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-3.5 animated-fade-in relative overflow-hidden">
                  <div className="bg-amber-600 text-white p-2.5 rounded-xl flex items-center justify-between text-xs font-black">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-4.5 h-4.5 text-amber-200 fill-amber-200 animate-spin" />
                      <span>🤖 AI स्मार्ट फॉर्म ऑटो-फील कॉपीर</span>
                    </span>
                    <span className="bg-amber-800 text-[9px] px-2 py-0.5 rounded uppercase">Gemini Scanner Active</span>
                  </div>

                  <p className="text-[10px] text-amber-800 font-bold leading-relaxed">
                     खालील कोणतीही माहिती १-क्लिक कॉपी करून तुम्ही महाडीबीटी/सरकारी वेबसाईटवर त्वरित अर्ज भरू शकता (वेळेची ८०% बचत होतील):
                  </p>

                  <div className="grid grid-cols-1 gap-2.5 max-h-60 overflow-y-auto pr-1">
                    {/* Document category detected */}
                    <div className="bg-white border p-2 rounded-xl flex justify-between items-center text-xs">
                      <div className="overflow-hidden">
                        <span className="text-[9px] text-gray-400 font-bold block">कागदपत्र प्रकार</span>
                        <strong className="text-rose-700 truncate block font-bold leading-none mt-0.5">{ocrResult.documentType || "आधार कार्ड"}</strong>
                      </div>
                    </div>

                    {/* Name EN */}
                    {ocrResult.nameEN && (
                      <div className="bg-white border p-2 rounded-xl flex justify-between items-center text-xs">
                        <div className="overflow-hidden">
                          <span className="text-[9px] text-gray-400 font-bold block">नाव (English)</span>
                          <strong className="text-gray-800 truncate block font-serif mt-0.5">{ocrResult.nameEN}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(ocrResult.nameEN, "nameEN")}
                          className="p-1.5 hover:bg-slate-100 rounded text-sky-600"
                        >
                          {copiedKey === "nameEN" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {/* Name MR */}
                    {ocrResult.nameMR && (
                      <div className="bg-white border p-2 rounded-xl flex justify-between items-center text-xs">
                        <div className="overflow-hidden bg-slate-50 border border-slate-100 px-2 py-1 rounded">
                          <span className="text-[9px] text-rose-500 font-black block">नाव (मराठीत)</span>
                          <strong className="text-rose-950 truncate block mt-0.5">{ocrResult.nameMR}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(ocrResult.nameMR, "nameMR")}
                          className="p-1.5 hover:bg-slate-100 rounded text-sky-600"
                        >
                          {copiedKey === "nameMR" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {/* DOB */}
                    {ocrResult.dob && (
                      <div className="bg-white border p-2 rounded-xl flex justify-between items-center text-xs">
                        <div className="overflow-hidden">
                          <span className="text-[9px] text-gray-400 font-bold block">जन्मतारीख (DOB)</span>
                          <strong className="text-gray-800 font-mono mt-0.5 block">{ocrResult.dob}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(ocrResult.dob, "dob")}
                          className="p-1.5 hover:bg-slate-100 rounded text-sky-600"
                        >
                          {copiedKey === "dob" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {/* Document Unique code */}
                    {ocrResult.documentNumber && (
                      <div className="bg-white border p-2 rounded-xl flex justify-between items-center text-xs">
                        <div className="overflow-hidden">
                          <span className="text-[9px] text-gray-400 font-bold block">आधार / पॅन / सर्टिफिकेट क्र.</span>
                          <strong className="text-gray-800 font-mono mt-0.5 block">{ocrResult.documentNumber}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(ocrResult.documentNumber, "docNum")}
                          className="p-1.5 hover:bg-slate-100 rounded text-sky-600"
                        >
                          {copiedKey === "docNum" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {/* Father name */}
                    {ocrResult.fatherOrSpouse_Name && (
                      <div className="bg-white border p-2 rounded-xl flex justify-between items-center text-xs">
                        <div className="overflow-hidden">
                          <span className="text-[9px] text-gray-400 font-bold block">वडिलांचे / पतीचे नाव</span>
                          <strong className="text-gray-800 mt-0.5 block">{ocrResult.fatherOrSpouse_Name}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(ocrResult.fatherOrSpouse_Name, "father")}
                          className="p-1.5 hover:bg-slate-100 rounded text-sky-600"
                        >
                          {copiedKey === "father" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {/* Marks or percentage detected */}
                    {ocrResult.marksOrGrade && (
                      <div className="bg-white border p-2 rounded-xl flex justify-between items-center text-xs">
                        <div className="overflow-hidden">
                          <span className="text-[9px] text-gray-400 font-bold block">मिळालेली टक्केवारी / मार्क्स</span>
                          <strong className="text-gray-800 font-mono mt-0.5 block">{ocrResult.marksOrGrade}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(ocrResult.marksOrGrade, "marks")}
                          className="p-1.5 hover:bg-slate-100 rounded text-sky-600"
                        >
                          {copiedKey === "marks" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}

                    {/* Full Address details */}
                    {ocrResult.address && (
                      <div className="bg-white border p-2 rounded-xl flex justify-between items-center text-xs">
                        <div className="overflow-hidden">
                          <span className="text-[9px] text-gray-400 font-bold block">पत्ता (Permanent Address)</span>
                          <p className="text-gray-700 font-semibold line-clamp-2 mt-0.5 leading-snug">{ocrResult.address}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyToClipboard(ocrResult.address, "address")}
                          className="p-1.5 hover:bg-slate-100 rounded text-sky-600"
                        >
                          {copiedKey === "address" ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Concise extracted Marathi summary flash */}
                  {ocrResult.extractedSummary && (
                    <div className="bg-white p-3 border rounded-xl">
                      <span className="text-[9px] text-stone-500 font-black block mb-1">📝 फाईल संक्षिप्त माहिती (मराठीत):</span>
                      <p className="text-[10px] text-gray-700 leading-relaxed font-semibold">{ocrResult.extractedSummary}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Status & payment update forms */}
              <form onSubmit={handleUpdateAppSubmit} className="space-y-4 pt-4 border-t border-gray-100">
                <span className="text-xs font-black text-gray-700 block">⚙️ अर्ज प्रक्रिया & पेमेंट संपादन:</span>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-650 block mb-1">अर्ज प्रगती (Progress Status)</label>
                    <select
                      value={statusVal}
                      onChange={(e) => setStatusVal(e.target.value)}
                      className="w-full text-xs font-bold p-2.5 border border-gray-200 rounded-xl outline-none"
                    >
                      <option value="Pending">Pending (ॲडमीन कडे प्राप्त)</option>
                      <option value="Processing">Processing (प्रक्रिया सुरु आहे)</option>
                      <option value="Completed">Completed (अर्ज यशस्वी पूर्ण)</option>
                      <option value="Cancelled">Cancelled (रद्द करण्यात आला)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-650 block mb-1">पेमेंट स्थिती (Payment)</label>
                    <select
                      value={paymentStatusVal}
                      onChange={(e) => setPaymentStatusVal(e.target.value)}
                      className="w-full text-xs font-bold p-2.5 border border-gray-200 rounded-xl outline-none"
                    >
                      <option value="Pending">Pending (मुदत/बाकी आहे)</option>
                      <option value="Paid">Paid (यशस्वी प्राप्त झाले)</option>
                      <option value="Cancelled">Cancelled (पेमेंट रद्द किंवा नाकारले)</option>
                    </select>
                  </div>
                </div>

                {/* Upload final Filled Acknowledgement file receipt PDF/Image */}
                <div>
                  <label className="text-xs font-extrabold text-gray-700 block mb-1">
                    भरलेल्या अर्जाची पावती अपलोड करा (Final Receipt PDF/Image):
                  </label>
                  <label className="w-full h-12 bg-rose-50/10 hover:bg-rose-50/20 border border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer text-xs font-bold text-gray-650 gap-1 px-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{receiptBase64 ? `पावती जोडली: ${receiptName.substring(0, 15)}` : "पावती ब्राउझ करा (PDF/PNG)"}</span>
                    <input
                      type="file"
                      accept=".pdf, image/*"
                      onChange={handleReceiptFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Customized feedback logs */}
                <div>
                  <label className="text-xs font-bold text-gray-650 block mb-1">ग्राहक रिमार्क / प्रगती मेसेज</label>
                  <textarea
                    value={feedbackVal}
                    onChange={(e) => setFeedbackVal(e.target.value)}
                    placeholder="उदा. फोटो ब्लर आहे परत अपलोड करा / अर्ज भरला आहे पावती ६ वाजता मिळेल."
                    rows={2.5}
                    className="w-full text-xs font-semibold p-3 border border-gray-200 rounded-xl outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Update submit & send auto wa notifications and emails instantly! */}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="w-2/3 bg-rose-650 hover:bg-rose-700 text-white font-black text-xs py-2.5 rounded-xl cursor-pointer shadow-sm transition-all text-center flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4 fill-white text-rose-300" />
                    <span>अद्यतनित करा (Update App)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => sendWhatsAppUpdate(selectedApp)}
                    className="w-1/3 bg-green-600 hover:bg-green-700 text-white font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 text-center"
                    title="व्हॉट्सॲपवर पाठवा"
                  >
                    <MessageSquare className="w-4 h-4 fill-white text-green-300" />
                    <span>ग्रुप WA अपडेट</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-10 text-center text-gray-500 flex flex-col items-center justify-center h-full min-h-[400px]">
              <Cpu className="w-12 h-12 text-slate-300 mb-3 animate-pulse" />
              <p className="font-bold text-sm text-gray-800">अर्ज प्रक्रिया संपादन पॅनेल सापडले</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
                डाव्या बाजूला दिलेल्या ग्राहकांच्या यादीवर क्लिक करा. ग्राहकाने वॉलेटमध्ये भरलेले सर्व कागदपत्रे उघडतील व तुम्ही *AI OCR विश्लेषण* करून वेळेत फॉर्म ऑटो-कॉपी करू शकाल.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Admin section: Create Custom Recruitment Updates and news flash bulletins */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 pb-16">
        {/* News Bulletins publishing */}
        <div className="bg-white border rounded-3xl p-5 shadow-sm">
          <h3 className="font-black text-base border-b border-gray-100 pb-3 mb-4 text-gray-900 flex items-center gap-1">
             ⚙️ नवीन घोषणा प्रकाशित करा (News Ticker)
          </h3>
          <form onSubmit={handleAddAnn} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">घोषणा शीर्षक मजकूर (मराठीत):</label>
              <textarea
                value={newAnnText}
                onChange={(e) => setNewAnnText(e.target.value)}
                placeholder="उदा. महाडीबीटी अर्ज भरण्यास मुदतवाढ झाली असून विद्यार्थ्यांना त्वरित संपर्क साधण्याचे आव्हान करण्यात आले आहे..."
                rows={3}
                className="w-full text-xs font-bold p-3 border border-gray-200 rounded-xl outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">प्रकार (Type):</label>
                <select
                  value={newAnnType}
                  onChange={(e) => setNewAnnType(e.target.value as any)}
                  className="w-full text-xs font-bold p-3 border border-gray-200 rounded-xl outline-none bg-white"
                >
                  <option value="new">🆕 न्यू जाहिरात</option>
                  <option value="deadline">⏱️ शेवटची तारीख</option>
                  <option value="important">⭐ महत्त्वाचे</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-3 rounded-xl cursor-pointer text-center"
                >
                  घोषणा लावा
                </button>
              </div>
            </div>
          </form>

          {/* Existing announcements lists to clear/delete */}
          <div className="mt-6 border-t border-gray-100 pt-5">
            <span className="text-xs font-black text-gray-600 block mb-3">चालू घोषणा यादी (डिलीट करण्यासाठी क्लिक करा):</span>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {announcements.map((ann) => (
                <div key={ann.id} className="flex items-center justify-between bg-slate-50 border p-2.5 rounded-xl text-xs">
                  <div className="overflow-hidden mr-2">
                    <span className="text-[9px] text-gray-400 font-bold block">{ann.type} • {ann.date}</span>
                    <p className="font-bold text-gray-800 line-clamp-1 mt-0.5">{ann.title}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAnn(ann.id)}
                    className="text-red-600 hover:bg-rose-100 p-1 rounded font-bold underline shrink-0 cursor-pointer"
                  >
                    काढा
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Create recruitment updates */}
        <div className="bg-white border rounded-3xl p-5 shadow-sm">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
            <h3 className="font-black text-base text-gray-900 flex items-center gap-1.5">
               ✨ नवीन नोकरी जाहिरात प्रकाशित करा (Mega recruitment)
            </h3>
            <button
              onClick={() => setShowAddJob(!showAddJob)}
              className="bg-rose-50 text-rose-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-rose-200 cursor-pointer"
            >
              {showAddJob ? "बंद करा" : "जाहिरात फॉर्म उघडा"}
            </button>
          </div>

          {showAddJob ? (
            <form onSubmit={handleAddJobSubmit} className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-2">

              {/* Block 1: Basic Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-black text-blue-800 text-xs flex items-center gap-1.5">📋 मूलभूत माहिती</h4>
                <div>
                  <label className="text-[10px] font-black text-gray-600 block mb-1">🏷️ जाहिरात शीर्षक *</label>
                  <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="उदा. तलाठी भरती २०२६ (महसूल विभाग)"
                    className="w-full text-xs font-bold p-2.5 border border-blue-200 rounded-xl outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-600 block mb-1">🏢 विभागाचे नाव *</label>
                  <input type="text" value={jobDept} onChange={(e) => setJobDept(e.target.value)}
                    placeholder="उदा. महसूल व वन विभाग, महाराष्ट्र शासन"
                    className="w-full text-xs font-bold p-2.5 border border-blue-200 rounded-xl outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-600 block mb-1">📝 भरती माहिती (थोडक्यात)</label>
                  <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)}
                    placeholder="उदा. महसूल व वन विभाग अंतर्गत ४६४४ पदांची अधिकृत जाहिरात..."
                    rows={2} className="w-full text-xs font-bold p-2.5 border border-blue-200 rounded-xl outline-none focus:border-blue-500 resize-none" />
                </div>
              </div>

              {/* Block 2: Dates & Vacancies */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-black text-emerald-800 text-xs flex items-center gap-1.5">📅 तारखा आणि जागा</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-gray-600 block mb-1">✅ अर्ज सुरुवात तारीख</label>
                    <input type="date" value={jobStartDate} onChange={(e) => setJobStartDate(e.target.value)}
                      className="w-full text-xs font-mono font-bold p-2.5 border border-emerald-200 rounded-xl outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-600 block mb-1">⏰ शेवटची तारीख *</label>
                    <input type="date" value={jobLastDate} onChange={(e) => setJobLastDate(e.target.value)}
                      className="w-full text-xs font-mono font-bold p-2.5 border border-emerald-200 rounded-xl outline-none focus:border-emerald-500" required />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-600 block mb-1">👥 एकूण जागा संख्या *</label>
                  <input type="number" value={jobVacancies} onChange={(e) => setJobVacancies(e.target.value)}
                    placeholder="उदा. 4644"
                    className="w-full text-xs font-bold p-2.5 border border-emerald-200 rounded-xl outline-none focus:border-emerald-500" required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-600 block mb-1">📋 पदे आणि जागा (प्रत्येक ओळीत: पदनाव:जागासंख्या) *</label>
                  <textarea value={jobPostsList} onChange={(e) => setJobPostsList(e.target.value)}
                    placeholder={"तलाठी (गट-क):4644
तलाठी (महिला राखीव):500"}
                    rows={3} className="w-full text-xs font-bold p-2.5 border border-emerald-200 rounded-xl outline-none focus:border-emerald-500 resize-none" required />
                  <p className="text-[9px] text-gray-400 mt-1">फॉरमॅट: पदनाव:जागासंख्या — प्रत्येक पद नवीन ओळीत</p>
                </div>
              </div>

              {/* Block 3: Eligibility */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-black text-amber-800 text-xs flex items-center gap-1.5">🎓 पात्रता</h4>
                <div>
                  <label className="text-[10px] font-black text-gray-600 block mb-1">📚 शैक्षणिक पात्रता *</label>
                  <input type="text" value={jobQual} onChange={(e) => setJobQual(e.target.value)}
                    placeholder="उदा. कोणत्याही शाखेतील पदवी + MSCIT"
                    className="w-full text-xs font-bold p-2.5 border border-amber-200 rounded-xl outline-none focus:border-amber-500" required />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-600 block mb-1">🎂 वयाची अट *</label>
                  <input type="text" value={jobAgeLimit} onChange={(e) => setJobAgeLimit(e.target.value)}
                    placeholder="उदा. १८ ते ३८ वर्षे (मागासवर्गीय उमेदवारांसाठी ५ वर्षे सूट)"
                    className="w-full text-xs font-bold p-2.5 border border-amber-200 rounded-xl outline-none focus:border-amber-500" required />
                </div>
              </div>

              {/* Block 4: Fees */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-black text-rose-800 text-xs flex items-center gap-1.5">💰 फी माहिती</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-black text-gray-600 block mb-1">खुला प्रवर्ग फी (₹) *</label>
                    <input type="number" value={jobFeeGeneral} onChange={(e) => setJobFeeGeneral(e.target.value)}
                      placeholder="1000"
                      className="w-full text-xs font-mono font-bold p-2.5 border border-rose-200 rounded-xl outline-none focus:border-rose-500" required />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-600 block mb-1">राखीव प्रवर्ग फी (₹) *</label>
                    <input type="number" value={jobFeeReserved} onChange={(e) => setJobFeeReserved(e.target.value)}
                      placeholder="900"
                      className="w-full text-xs font-mono font-bold p-2.5 border border-rose-200 rounded-xl outline-none focus:border-rose-500" required />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-600 block mb-1">साईराम सर्व्हिस फी (₹) *</label>
                    <input type="number" value={jobServiceCharge} onChange={(e) => setJobServiceCharge(e.target.value)}
                      placeholder="100"
                      className="w-full text-xs font-mono font-bold p-2.5 border border-rose-200 rounded-xl outline-none focus:border-rose-500" required />
                  </div>
                </div>
              </div>

              {/* Block 5: Documents */}
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 space-y-3">
                <h4 className="font-black text-purple-800 text-xs flex items-center gap-1.5">📎 आवश्यक कागदपत्रे</h4>
                <textarea value={jobDocs} onChange={(e) => setJobDocs(e.target.value)}
                  rows={5} className="w-full text-xs font-bold p-2.5 border border-purple-200 rounded-xl outline-none focus:border-purple-500 resize-none" />
                <p className="text-[9px] text-gray-400">प्रत्येक कागदपत्र नवीन ओळीत लिहा</p>
              </div>

              <button type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3.5 rounded-2xl cursor-pointer text-sm shadow-md transition-all active:scale-95">
                🚀 जाहिरात प्रकाशित करा
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-black text-gray-600 block mb-3">सध्या उघडलेल्या नोकरी जाहिराती (डिलीट करा):</span>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {jobs.map((j) => (
                  <div key={j.id} className="flex items-center justify-between bg-slate-50 border p-3 rounded-xl text-xs">
                    <div className="overflow-hidden">
                      <span className="text-[9px] text-gray-400 font-bold block">{j.departmentMR} • {j.lastDate}</span>
                      <p className="font-extrabold text-gray-800 line-clamp-1 mt-0.5">{j.titleMR}</p>
                      <p className="text-[10px] text-gray-500 font-semibold mt-0.5">एकूण: {j.totalVacancies} पडे | माझी फी: ₹{j.serviceCharge}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteJob(j.id)}
                      className="text-red-600 hover:bg-rose-100 p-2 rounded font-bold underline shrink-0 cursor-pointer"
                    >
                      डिलीट
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Job Subscribers Management & Simulation Ticker Panel */}
      <div className="bg-white border rounded-3xl p-5 shadow-sm mt-8" id="admin-subscribers-management-section">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-5 gap-3">
          <div>
            <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-2">
              <span className="text-xl">🔔</span>
              ग्राहकांची जॉब अलर्ट सबस्क्रिप्शन यादी (Job Alert Subscribers)
            </h3>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              नवीन सुरू झालेल्या सरकारी नोकऱ्यांचे अलर्ट थेट व्हॉट्सॲप आणि ईमेलवर स्वयंचलित पाठवण्यासाठी ग्राहक जोडणी.
            </p>
          </div>
          <span className="bg-rose-50 text-rose-700 text-xs font-black px-3 py-1.5 rounded-xl border border-rose-200 shrink-0">
             एकूण सभासद: {subscribers.length}
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Subscribers Table List */}
          <div className="xl:col-span-7 space-y-4">
            <span className="text-xs font-black text-slate-800 block">👥 सक्रिय सबस्क्रायबर्स यादी:</span>
            {subscribersLoading ? (
              <p className="text-xs text-gray-500 font-bold">तपासत आहे...</p>
            ) : subscribers.length === 0 ? (
              <div className="bg-gray-50 border p-8 rounded-2xl text-center text-xs text-gray-500 font-bold">
                 अजून कोणत्याही ग्राहकाने जॉब सबस्क्रिप्शन सुरू केलेले नाही.
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-150 rounded-2xl">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-150 text-gray-500 font-bold">
                    <tr>
                      <th className="p-3 text-left">नाव / मोबाईल नंबर</th>
                      <th className="p-3 text-center">पात्रता फिल्टर</th>
                      <th className="p-3 text-center">अलर्ट माध्यम</th>
                      <th className="p-3 text-right">ऍक्शन</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {subscribers.map((sub: any) => (
                      <tr key={sub.id} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <p className="font-bold text-gray-950">{sub.name}</p>
                          <p className="font-mono text-[10px] text-gray-500 font-bold mt-0.5">{sub.mobile}</p>
                          {sub.email && (
                            <p className="text-[10px] text-gray-400 font-mono mt-0.5">{sub.email}</p>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-black px-2 py-0.5 rounded">
                            {sub.qualification === "all" ? "सर्व नोकऱ्या" : sub.qualification.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex justify-center gap-1">
                            {sub.channels?.map((chan: string) => (
                              <span key={chan} className="bg-green-50 text-green-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-green-150 uppercase animate-pulse">
                                {chan === "whatsapp" ? "WA" : chan}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteSubscriber(sub.id, sub.name)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 text-[10px] font-bold px-2 py-1 rounded-md border border-red-150 transition-all cursor-pointer"
                          >
                            काढा
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Broadcast Alerts Simulation System */}
          <div className="xl:col-span-5 bg-gradient-to-br from-rose-50/30 to-amber-50/20 border border-dashed border-rose-250 rounded-3xl p-5 space-y-4">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <span>🚀</span>
              रिअल-टाइम जॉब अलर्ट सुलभ सिम्युलेटर
            </h4>
            <p className="text-xs text-gray-500 font-semibold leading-relaxed">
               निवडलेल्या नोकरी जाहिरातीनुसार शैक्षणिक पात्रता जुळणाऱ्या सर्व सबस्क्राईब केलेल्या ग्राहकांना त्वरित मेसेज पाठवा!
            </p>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-650 block">१. नोकरी निवडा (Select Job Posting):</label>
                <select
                  value={selectedJobForBroadcast}
                  onChange={(e) => {
                    setSelectedJobForBroadcast(e.target.value);
                    setBroadcastResults(null);
                  }}
                  className="w-full text-xs font-bold p-3 border border-gray-200 rounded-xl bg-white outline-none"
                >
                  <option value="">-- चालू नोकरी जाहिरात निवडा --</option>
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.titleMR} ({j.totalVacancies} पदे)
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={triggerAutoNotification}
                className="w-full bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs py-3.5 rounded-xl cursor-pointer shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                मॅचिंग सबस्क्रायबर्सना ऑटो-अलर्ट पाठवा
              </button>

              {/* Broadcast Match Outcome Logs */}
              {broadcastResults && (
                <div className="bg-white border rounded-2xl p-4 space-y-3 shadow-inner">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-emerald-850">
                      यशस्वी ट्रिगर: {broadcastResults.sentCount} ग्राहक मॅच झाले!
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                      DELIVERED
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                     खालील ग्राहकांच्या चॅनेल्सवर (व्हॉट्सॲप / ईमेल) नोकरी अलर्ट पाठवण्याची नक्कल सिम्युलेट केली गेली आहे:
                  </p>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {broadcastResults.matchedList.length === 0 ? (
                      <p className="text-[10px] text-gray-400 font-bold">या जॉबच्या पात्रतेशी जुळणारे सबस्क्रायबर सापडले नाहीत.</p>
                    ) : (
                      broadcastResults.matchedList.map((matchedSub: any) => (
                        <div key={matchedSub.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-gray-100 text-[10px]">
                          <div>
                            <span className="font-bold text-gray-800">{matchedSub.name} </span>
                            <span className="text-gray-400">({matchedSub.qualification})</span>
                          </div>
                          <span className="text-emerald-700 font-bold flex items-center gap-1 text-[9px]">
                            <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            मेसेज पाठवला
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
