import React from "react";
import { FormApplication } from "../types";
import { Clock, CheckCircle, XCircle, Settings, FileText, ExternalLink, HelpCircle} from "lucide-react";

interface ApplicationHistoryProps {
  applications: FormApplication[];
  onRefreshApplications?: () => void;
  token?: string | null;
}

export default function ApplicationHistory({ applications, onRefreshApplications, token }: ApplicationHistoryProps) {
  const getStatusBadge = (status: FormApplication["status"]) => {
    switch (status) {
      case "Pending":
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] md:text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
            <Clock className="w-3.5 h-3.5 fill-amber-100" />
            <span>पेंडिंग (साईरामकडे प्राप्त झाला)</span>
          </span>
        );
      case "Processing":
        return (
          <span className="bg-sky-50 text-sky-800 border border-sky-200 text-[10px] md:text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5 animate-spin" />
            <span>प्रक्रिया सुरु आहे (Processing)</span>
          </span>
        );
      case "Completed":
        return (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] md:text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 animate-bounce">
            <CheckCircle className="w-3.5 h-3.5 fill-emerald-100" />
            <span>यशस्वीरित्या पूर्ण झाला ✅</span>
          </span>
        );
      case "Cancelled":
        return (
          <span className="bg-red-50 text-red-800 border border-red-200 text-[10px] md:text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 fill-red-100" />
            <span>रद्द करण्यात आला</span>
          </span>
        );
    }
  };

  const notifyOnWhatsApp = (app: FormApplication) => {
    const text = encodeURIComponent(
      `नमस्कार राहुल सर, माझ्या या फॉर्मबद्दल मार्गदर्शन हवे आहे:\n\n` +
        `📝 *अर्ज प्रकार:* ${app.formTitle}\n` +
        `🆔 *अर्ज आयडी:* ${app.id}\n` +
        `⚙️ *सद्यस्थिती:* ${app.status}\n` +
        `💳 *पेमेंट:* ${app.paymentStatus === "Paid" ? "यशस्वी" : "बाकी आहे"}\n\n` +
        `मोबाईल ९०११०८३४४० वरून हे तपासण्यात आले आहे.`
    );
    window.open(`https://wa.me/919011083440?text=${text}`, "_blank");
  };

  const handleRepay = async (appId: string) => {
    try {
      const response = await fetch("/api/applications/repay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ applicationId: appId })
      });
      if (response.ok) {
        alert("तुमच्या पेमेंटची नोंदणी यशस्वीरित्या पुन्हा सादर करण्यात आली आहे! ✅");
        if (onRefreshApplications) {
          onRefreshApplications();
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || "पेमेंट प्रक्रिया पुन्हा सबमिट करताना एरर आली.");
      }
    } catch (e) {
      alert("सर्व्हरशी जोडणी करण्यात अडचण आली.");
    }
  };

  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white border border-rose-100 rounded-3xl p-12 text-center text-gray-500 flex flex-col items-center justify-center min-h-[350px]">
        <FileText className="w-12 h-12 text-gray-300 mb-3 animate-pulse" />
        <h3 className="font-extrabold text-sm text-gray-800">तुम्ही अद्याप कोणत्याही फॉर्मसाठी अप्लाय केलेले नाही.</h3>
        <p className="text-xs text-gray-400 mt-2 max-w-sm leading-relaxed">
          कृपया वरील "विद्यार्थ्यांचे फॉर्म", "शेतकरी योजना" किंवा "इतर सेवा" या टॅबवर जाऊन तुम्हाला हवा असणारा अर्ज निवडा आणि "ऑनलाईन अप्लाय करा" या बटणावर क्लिक करा.
        </p>
      </div>
    );
  }

  // Sort applications by descending submission date
  const sortedApps = [...applications].sort(
    (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-rose-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-950 flex items-center gap-2">
            <span>📜</span>
            माझा अर्ज इतिहास (Submitted Applications)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            खालील तक्त्यात तुम्ही अप्लाय केलेल्या सर्व अर्जांचे सद्यस्थिती (लाइव्ह स्टेटस) आणि पेमेंट स्टेटस पाहू शकता.
          </p>
        </div>
        <span className="bg-emerald-50 text-emerald-800 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full border border-emerald-200">
          एकूण अर्ज: {applications.length}
        </span>
      </div>

      <div className="space-y-6">
        {sortedApps.map((app) => (
          <div
            key={app.id}
            className={`bg-white border rounded-3xl p-5 md:p-6 transition-all ${
              app.status === "Completed"
                ? "border-emerald-200 shadow-sm shadow-emerald-50"
                : app.status === "Cancelled"
                ? "border-red-150"
                : "border-gray-200"
            }`}
          >
            {/* Header: Title and Status */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-gray-105">
              <div>
                <span className="font-mono text-[10px] text-gray-400 block font-bold">अर्ज आयडी: {app.id}</span>
                <h3 className="font-extrabold text-md md:text-base text-gray-900 mt-0.5 leading-snug">
                  {app.formTitle}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {getStatusBadge(app.status)}
                <span
                  className={`text-[10px] md:text-xs font-black px-2.5 py-1 rounded-full ${
                    app.paymentStatus === "Paid"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200 animate-pulse"
                  }`}
                >
                  {app.paymentStatus === "Paid" ? "💳 पेमेंट यशस्वी ✅" : "⚠️ पेमेंट पेंडिंग"}
                </span>
              </div>
            </div>

            {/* Custom Inputs Review */}
            <div className="my-5 grid grid-cols-1 md:grid-cols-3 gap-4 bg-stone-50/70 p-4 rounded-2xl border border-stone-100">
              {Object.keys(app.customDetails).length > 0 ? (
                Object.entries(app.customDetails).map(([key, val]) => (
                  <div key={key}>
                    <span className="text-[10px] text-stone-400 font-bold block">{key}</span>
                    <p className="text-xs font-bold text-gray-800 mt-0.5">{val}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-xs text-gray-400 italic">
                  या अर्जासाठी कोणतेही अतिरिक्त पॅरामीटर्स आवश्यक नव्हते. सुरक्षित डॉक्युमेंट वॉलेट कागदपत्रे वापरण्यात आलेले आहेत.
                </div>
              )}
            </div>

            {/* Attachment references verified */}
            <div className="mb-4">
              <span className="text-[10px] text-gray-400 block font-black mb-1.5">📎 जोडलेले वॉलेट डॉक्युमेंट्स:</span>
              <div className="flex flex-wrap gap-1.5">
                {Object.keys(app.documents).length > 0 ? (
                  Object.keys(app.documents).map((docType) => (
                    <span
                      key={docType}
                      className="bg-emerald-50 border border-emerald-150 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-lg"
                    >
                      ✔ {docType === "aadhar"
                        ? "आधार कार्ड"
                        : docType === "marksheet"
                        ? "गुणपत्रिका"
                        : docType === "income"
                        ? "उत्पन्न दाखला"
                        : docType === "photo"
                        ? "फोटो"
                        : docType === "signature"
                        ? "स्वतःची सही"
                        : "पॅन कार्ड"}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 font-medium italic">
                    या अर्जासाठी कोणतेही कागदपत्रे जोडलेली नाहीत.
                  </span>
                )}
              </div>
            </div>

            {/* Payment Cancelled Notification & QR Code Retry Block */}
            {app.status === "Cancelled" && (
              <div className="bg-rose-50 border border-red-200 rounded-3xl p-5 my-4">
                <div className="flex gap-2.5 items-start">
                  <span className="text-2xl">❌</span>
                  <div>
                    <h4 className="font-extrabold text-sm text-red-700">तुमचे पेमेंट राहुल सरांकडून रद्द / नाकारले (Cancelled) गेले आहे!</h4>
                    <p className="text-xs text-stone-600 font-bold mt-1 leading-relaxed">
                      तुमचे आधीचे पेमेंट यशस्वी रित्या प्राप्त झाले नाही किंवा रद्द झाले आहे. कृपया खालील क्युआर कोड मोबाईलने स्कॅन करून पुन्हा पेमेंट करा जेणेकरून तुमचा फॉर्म साईराम कॉम्प्युटर्सकडून भरता येईल.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-red-150 flex flex-col md:flex-row items-center gap-4 justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                        `upi://pay?pa=9011083440@okaxis&pn=Rahul%20Mise&tn=Sairam%20Computers%20Repay%20${app.formTitle.substring(0, 10)}`
                      )}`}
                      alt="UPI QR Code"
                      className="w-24 h-24 border rounded-xl bg-white p-1 shadow-sm shrink-0"
                    />
                    <div>
                      <span className="bg-red-100 text-red-800 text-[10px] font-black px-2 py-0.5 rounded">UPI ID: 9011083440@okaxis</span>
                      <p className="text-[11px] text-gray-500 font-extrabold mt-1">
                        👉 वरील क्युआर आपल्या गुगल पे, फोन पे किंवा पेटीएम ॲप ने स्कॅन करून रक्कम पाठवा. पेमेंट झाल्यावर उजवीकडील बटणावर क्लिक करा जेणेकरून आम्हाला आपोआप कळेल!
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRepay(app.id)}
                    className="w-full md:w-auto bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-5 py-3 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0 text-center"
                  >
                    👍 मी पुन्हा पैसे भरले आहेत! (Confirm Repay)
                  </button>
                </div>
              </div>
            )}

            {/* Admin Response/Feedback Log */}
            {app.feedback && (
              <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 my-4 flex items-start gap-2.5">
                <span className="text-rose-600 font-black text-xs shrink-0 bg-white shadow-sm p-1.5 rounded-lg">💬</span>
                <div className="text-xs">
                  <span className="font-extrabold text-rose-800 block">साईराम सेवा केंद्र अभिप्राय / प्रगती अहवाल:</span>
                  <p className="text-gray-700 font-semibold leading-relaxed mt-1">{app.feedback}</p>
                </div>
              </div>
            )}

            {/* Footer buttons: Access receipt or Chat */}
            <div className="border-t border-gray-105 pt-4 mt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-[11px] text-gray-400 font-sans">
                अर्ज तारीख: {new Date(app.appliedAt).toLocaleDateString("mr-IN")} • वेळ: {new Date(app.appliedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => notifyOnWhatsApp(app)}
                  className="w-full sm:w-auto text-center border border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  id={`chat-app-btn-${app.id}`}
                >
                  <HelpCircle className="w-4.5 h-4.5" />
                  <span>अर्जा संदर्भात चौकशी</span>
                </button>

                {app.status === "Completed" && app.resultUrl ? (
                  <a
                    href={app.resultUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:shadow active:scale-95 transition-all"
                  >
                    <FileText className="w-4.5 h-4.5" />
                    <span>पावती / भरलेला अर्ज डाऊनलोड करा</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  app.status === "Completed" && (
                    <span className="text-xs text-emerald-700 font-extrabold bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                      ✅ अर्ज प्रक्रिया यशस्वीरीत्या पूर्ण झाली. (पावती व्हॉट्सॲपवर पाठवली जाईल)
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
