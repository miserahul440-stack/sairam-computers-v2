import React, { useRef, useState } from "react";
import { UserProfile } from "../types";
import { ShieldCheck, Upload, Trash2, Eye, FileText, AlertTriangle, CloudRain, CheckCircle } from "lucide-react";

interface DocumentWalletProps {
  user: UserProfile;
  token: string | null;
  onUpdateUser: (newUser: UserProfile) => void;
}

interface DocConfig {
  type: "aadhar" | "pan" | "marksheet" | "photo" | "signature" | "income";
  label: string;
  description: string;
}

export default function DocumentWallet({ user, token, onUpdateUser }: DocumentWalletProps) {
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);

  const documentConfigs: DocConfig[] = [
    { type: "aadhar", label: "आधार कार्ड (Aadhar Card)", description: "पहिला व दुसरा भाग सामावून स्पष्ट असावा (PDF / JPG)" },
    { type: "pan", label: "पॅन कार्ड (PAN Card)", description: "पॅन कार्ड वरील नाव व जन्मतारीख स्पष्ट दिसायला हवी" },
    { type: "marksheet", label: "१०वी किंवा १२वी गुणपत्रिका", description: "गुणपत्रिका / बोर्ड सर्टिफिकेट जोडणे अनिवार्य आहे" },
    { type: "income", label: "उत्पन्नाचा दाखला (Income Certificate)", description: "तहसीलदार किंवा शासकीय अधिकृत दाखला (नवीन ३ वर्षाचे)" },
    { type: "photo", label: "पासपोर्ट आकाराचा फोटो (Photo)", description: "बॅकग्राऊंड शक्यतो पांढरा असावा, चेहरा स्पष्ट असावा" },
    { type: "signature", label: "स्वतःची सही / स्वाक्षरी (Signature)", description: "पांढऱ्या कागदावर काळ्या किंवा निळ्या पेनने घेतलेला सहीचा फोटो" },
  ];

  // Calculate loaded docs count
  const getWalletStats = () => {
    let uploadedCount = 0;
    documentConfigs.forEach((doc) => {
      const urlKey = `${doc.type}Url` as keyof typeof user.documents;
      if (user.documents[urlKey]) uploadedCount++;
    });
    return {
      uploaded: uploadedCount,
      total: documentConfigs.length,
      percentage: Math.round((uploadedCount / documentConfigs.length) * 100),
    };
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setUploadingType(fileType);

    // Limit file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("फाइल खूप मोठी आहे! कृपया १० एमबी पेक्षा लहान फाइल अपलोड करा.");
      setUploadingType(null);
      return;
    }

    // Convert file to Base64
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;

        const response = await fetch("/api/wallet/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileType,
            fileBase64: base64Data,
            fileName: file.name,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "अपलोड करताना एरर आली.");
        }

        if (data.success && data.user) {
          onUpdateUser(data.user);
          setSuccessMsg("कागदपत्र वॉलेटमध्ये यशस्वीरित्या सुरक्षित सेव्ह झाले आहे! ✅");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "कागदपत्रे अपलोड करताना तांत्रिक अडचण आली.");
      } finally {
        setUploadingType(null);
      }
    };

    reader.onerror = () => {
      setErrorMsg("फाइल वाचताना अडचण आली.");
      setUploadingType(null);
    };

    reader.readAsDataURL(file);
  };

  const handleDelete = async (fileType: string) => {
    if (!confirm("तुम्ही हे कागदपत्र वॉलेटमधून हटवू इच्छिता का?")) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch("/api/wallet/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fileType }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "डिलीट करताना अडचण आली.");
      }

      if (data.success && data.user) {
        onUpdateUser(data.user);
        setSuccessMsg("कागदपत्रे वॉलेटमधून हटविले आहे.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "कागदपत्र हटविताना तांत्रिक अडचण आली.");
    }
  };

  const { uploaded, total, percentage } = getWalletStats();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-300" />
            <h2 className="text-xl md:text-2xl font-black">माझे कागदपत्रे डिजिटल वॉलेट</h2>
          </div>
          <p className="text-xs text-rose-100 font-bold max-w-xl leading-relaxed mt-2">
            तुमचे खालील सर्व कागदपत्रे एकदाच सुरक्षितरीत्या अपलोड करून घ्या. यामुळे जेव्हा तुम्ही कोणत्याही फॉर्मसाठी अप्लाय कराल, तेव्हा पुन्हा पुन्हा कागदपत्रे अपलोड करावे लागणार नाहीत!
          </p>
        </div>

        {/* Dynamic status stats dashboard */}
        <div className="bg-white/10 px-5 py-4 rounded-2xl border border-white/15 w-full md:w-auto text-center">
          <span className="text-[11px] block font-extrabold text-rose-200">एकूण कागदपत्र स्टेटस</span>
          <span className="text-2xl font-black mt-1 font-mono block">
            {uploaded} / {total} जोडली
          </span>
          <div className="w-full bg-rose-950/40 rounded-full h-2 mt-2 w-36 mx-auto overflow-hidden">
            <div className="bg-amber-400 h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
          </div>
          <span className="text-[9px] text-amber-200 font-bold mt-1.5 block">{percentage}% कार्य पूर्ण</span>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Government Regulation Consent Declaration */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
        <input
          type="checkbox"
          id="government-document-consent"
          checked={consentChecked}
          onChange={(e) => setConsentChecked(e.target.checked)}
          className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-rose-400 border-rose-300 accent-rose-600 cursor-pointer shrink-0"
        />
        <label htmlFor="government-document-consent" className="text-xs text-amber-950 font-bold select-none cursor-pointer leading-relaxed">
          <span className="text-rose-700 font-black block mb-0.5">📜 स्व-संमती घोषणापत्र (Self-Declaration Consent):</span> मी याद्वारे स्वेच्छेने संमती देतो की, शासकीय नोकरी/योजनांचे ऑनलाईन फॉर्म अचूकपणे भरण्यासंदर्भात माझे आधार कार्ड, पॅन कार्ड आणि इतर आवश्यक कागदपत्रे मी संपूर्ण स्वेच्छेने व संमतीने या डिजिटल सुरक्षित वॉलेटमध्ये अपलोड करत आहे. माझा दस्तऐवज फक्त माझ्या फॉर्म प्रक्रियेसाठीच वापरला जाईल.
        </label>
      </div>

      {!consentChecked && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-black px-4 py-3 rounded-2xl text-center">
          ⚠️ कागदपत्रे जोडण्यासाठी, पाहण्यासाठी किंवा काढून टाकण्यासाठी कृपया वरील संमती घोषणापत्र टिक करा!
        </div>
      )}

      {/* Docs cards grid list */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${!consentChecked ? "opacity-50 pointer-events-none" : ""}`}>
        {documentConfigs.map((doc) => {
          const urlKey = `${doc.type}Url` as keyof typeof user.documents;
          const nameKey = `${doc.type}Name` as keyof typeof user.documents;

          const fileUrl = user.documents[urlKey];
          const fileName = user.documents[nameKey];

          return (
            <div
              key={doc.type}
              className={`bg-white border rounded-3xl p-5 flex flex-col justify-between transition-all ${
                fileUrl ? "border-emerald-300 shadow-sm" : "border-rose-100 hover:border-rose-300"
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-extrabold text-sm text-gray-900">{doc.label}</h3>
                  {fileUrl ? (
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1 shrink-0">
                       जोडले गेले आहे
                    </span>
                  ) : (
                    <span className="bg-rose-50 text-rose-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-rose-200 inline-flex items-center gap-1 shrink-0 animate-pulse">
                      अपलोड करा
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-gray-400 mt-1">{doc.description}</p>

                {fileUrl ? (
                  <div className="mt-4 bg-gray-50 border border-gray-150 rounded-2xl p-3.5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-150 flex items-center justify-center text-emerald-700 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <span className="text-[11px] text-gray-500 font-medium block">कागदपत्र फाइल:</span>
                      <p className="text-xs font-bold text-gray-800 truncate font-mono mt-0.5">{fileName || `${doc.type}-file.png`}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 bg-rose-50/20 border border-dashed border-rose-200 rounded-2xl p-6 text-center flex flex-col items-center justify-center select-none">
                    <Upload className="w-8 h-8 text-rose-300 animate-bounce" />
                    <span className="text-xs text-gray-400 font-bold mt-2">क्लिक करून डॉक्युमेंट अपलोड करा</span>
                    <span className="text-[9px] text-gray-400 font-medium mt-1">मर्यादा: १० एमबी (PDF, PNG, JPG)</span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                {fileUrl ? (
                  <>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 hover:shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>फाइल पहा</span>
                    </a>
                    <button
                      onClick={() => handleDelete(doc.type)}
                      className="bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs p-2 rounded-xl flex items-center justify-center border border-red-100 hover:shadow-sm cursor-pointer"
                      title="कागदपत्र काढून टाका"
                      id={`delete-doc-${doc.type}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <label className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-2.5 rounded-xl text-center shadow-sm cursor-pointer inline-flex items-center justify-center gap-1.5 transition-all active:scale-95">
                    <Upload className="w-4.5 h-4.5" />
                    <span>{uploadingType === doc.type ? "अपलोड होत आहे..." : "फाइल अपलोड करा"}</span>
                    <input
                      type="file"
                      accept=".pdf, image/*"
                      disabled={uploadingType !== null}
                      onChange={(e) => handleFileChange(e, doc.type)}
                      className="hidden"
                      id={`file-input-${doc.type}`}
                    />
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
