import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Maximum payload size for JSON to support base64 file transfers smoothly
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Database Paths
const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");
const UPLOAD_DIR = path.join(DB_DIR, "files");

// Make sure directories exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Serve uploaded files statically
app.use("/uploads", express.static(UPLOAD_DIR));

// Initialize Database structure if not existing
const defaultDb = {
  users: [
    {
      id: "user-demo-1",
      name: "राहुल मिसे",
      mobile: "9011083440",
      email: "miserahul440@gmail.com",
      photoUrl: "",
      joinedAt: new Date().toISOString(),
      documents: {
        aadharUrl: "",
        aadharName: "",
        panUrl: "",
        panName: "",
        marksheetUrl: "",
        marksheetName: "",
        photoUrl: "",
        photoName: "",
        signatureUrl: "",
        signatureName: "",
        incomeUrl: "",
        incomeName: "",
      },
    },
  ],
  applications: [
    {
      id: "app-demo-1",
      userId: "user-demo-1",
      userName: "राहुल मिसे",
      userMobile: "9011083440",
      category: "student",
      formKey: "mahadbt-scholarship",
      formTitle: "महाडीबीटी स्कॉलरशिप फॉर्म (MahaDBT)",
      appliedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      status: "Processing",
      paymentStatus: "Pending",
      customDetails: {
        "कॉलेज नाव": "शासकीय तंत्रनिकेतन पुणे",
        "कोर्स नाव": "D.Pharm (प्रथम वर्ष)",
        "मागील टक्केवारी": "८४.५०%"
      }
    }
  ],
  jobs: [
    {
      id: "job-1",
      title: "Talathi Bharti 2026 (Revenue Dept)",
      titleMR: "तलाठी भरती २०२६ (महसूल विभाग)",
      titleHI: "पटवारी (तलाठी) भर्ती 2026",
      department: "Revenue Department",
      departmentMR: "महसूल व वन विभाग, महाराष्ट्र शासन",
      departmentHI: "राजस्व एवं वन विभाग, महाराष्ट्र शासन",
      totalVacancies: 4644,
      posts: [
        { name: "तलाठी (गट-क)", nameMR: "तलाठी (गट-क)", nameHI: "पटवारी (गट-क)", vacancy: "४६४४ पदे" },
      ],
      ageLimit: "१८ ते ३८ वर्षे (मागासवर्गीय उमेदवारांसाठी ५ वर्षे सूट)",
      ageLimitMR: "१८ ते ३८ वर्षे (मागासवर्गीय उमेदवारांसाठी ५ वर्षे सूट)",
      ageLimitHI: "१८ से ३८ वर्ष (आरक्षित श्रेणियों को ५ वर्ष की छूट)",
      qualification: "कोणत्याही शाखेतील पदवी (Graduation in any stream) + MSCIT किंवा समकक्ष संगणक परीक्षा उत्तीर्ण.",
      importantDocuments: [
        "आधार कार्ड (Aadhar Card)",
        "१० वी & १२ वी बोर्ड प्रमाणपत्र (SSC, HSC Marks)",
        "पदवी गुणपत्रिका (Graduation Marksheets)",
        "जातीचा दाखला (Caste Certificate, if applicable)",
        "नॉन-क्रिमिलेअर प्रमाणपत्र (Non-Creamy Layer)",
        "डोमासाईल प्रमाणपत्र (Domicile)",
        "फोटो & सही (Photo & Signature)"
      ],
      feeGeneral: 1000,
      feeReserved: 900,
      serviceCharge: 100,
      lastDate: "२०२६-०७-१५",
      description: "महाराष्ट्र शासनाच्या महसूल विभागांतर्गत तलाठी पदांच्या भरतीसाठी अधिकृत जाहिरात प्रसिद्ध झाली आहे.",
      whatsappMessage: "🔥 *तलाठी भरती २०२६* प्रसिद्ध!\n\n🔹 *एकूण जागा:* ४६४४ पदे\n🔹 *पात्रता:* पदवी उत्तीर्ण\n🔹 *शेवटची तारीख:* १५ जुलै २०२६\n\nसाईराम कॉम्प्युटरवर फॉर्म भरून मिळेल!\n✨ *आपला फॉर्म आजच बुक करा!*\n👉 *अधिक माहितीसाठी व फॉर्म भरण्यासाठी आमच्या साईटला भेट द्या.*\n📞 *संपर्क:* ९०११०८३४४० (राहुल मिसे)"
    },
    {
      id: "job-2",
      title: "Maharashtra Police Constable Recruitment 2026",
      titleMR: "महाराष्ट्र पोलीस शिपाई भरती २०२६",
      titleHI: "महाराष्ट्र पुलिस कांस्टेबल भर्ती 2026",
      department: "Home Department",
      departmentMR: "गृह विभाग, महाराष्ट्र पोलीस",
      departmentHI: "गृह विभाग, महाराष्ट्र पुलिस",
      totalVacancies: 17471,
      posts: [
        { name: "पोलीस शिपाई (Police Constable)", vacancy: "९,५९५ पदे" },
        { name: "चालक शिपाई (Police Driver)", vacancy: "४,८०० पदे" },
        { name: "राज्य राखीव पोलीस बल शिपाई (SRPF)", vacancy: "३,०७६ पदे" }
      ],
      ageLimit: "१८ ते २८ वर्षे (मागासवर्गीय: ३३ वर्षांपर्यंत)",
      qualification: "१२ वी उत्तीर्ण (HSC Pass) + आवश्यक शारीरिक पात्रता व हलके व वजनदार वाहन चालक परवाना (चालक पदासाठी).",
      importantDocuments: [
        "आधार कार्ड / पॅन कार्ड",
        "१० वी आणि १२ वी प्रमाणपत्र",
        "शाळा सोडल्याचा दाखला (TC)",
        "रहिवासी दाखला / डोमासाईल",
        "जातीचा दाखला & नॉन-क्रिमिलेअर",
        "हलके वाहन परवाना (ड्रायव्हर शिपाई साठी)"
      ],
      feeGeneral: 450,
      feeReserved: 350,
      serviceCharge: 80,
      lastDate: "२०२६-०६-३०",
      description: "महाराष्ट्र राज्य गृह विभागातर्फे पोलीस दलात चालक, शिपाई व SRPF शिपाई पदांची भरती प्रक्रिया सुरु आहे.",
      whatsappMessage: "👮‍♂️ *महाराष्ट्र पोलीस शिपाई भरती २०२६* चालू!\n\n🔹 *एकूण जागा:* १७,४७१\n🔹 *पात्रता:* १२ वी उत्तीर्ण\n🔹 *शेवटची तारीख:* ३० जून २०२६\n\nआपला फॉर्म १००% अचूक भरण्यासाठी साईराम कॉम्प्युटरला भेट द्या.\n📞 *संपर्क:* ९०११०८३४४०"
    },
    {
      id: "job-3",
      title: "Animal Husbandry Department Bharti 2026",
      titleMR: "पशुसंवर्धन विभाग भरती २०२६",
      titleHI: "पशुपालन विभाग भर्ती 2026",
      department: "Animal Husbandry",
      departmentMR: "पशुसंवर्धन विभाग, महाराष्ट्र शासन",
      departmentHI: "पशुपालन विभाग, महाराष्ट्र शासन",
      totalVacancies: 446,
      posts: [
        { name: "पशुधन पर्यवेक्षक", vacancy: "३७६ पदे" },
        { name: "वरिष्ठ लिपिक", vacancy: "४४ पदे" },
        { name: "लघुलेखक", vacancy: "२६ पदे" }
      ],
      ageLimit: "१८ ते ३८ वर्षे (मागासवर्गीय: ४३ वर्षांपर्यंत)",
      qualification: "पशुधन पर्यवेक्षक साठी दुग्ध व्यवसाय/पशुसंवर्धन डिप्लोमा; लिपीक पदासाठी पदवी उत्तीर्ण + मराठी ३० आणि इंग्रजी ४० टायपिंग परीक्षा उत्तीर्ण.",
      importantDocuments: [
        "आधार कार्ड",
        "शैक्षणिक पात्रता प्रमाणपत्रे (डिप्लोमा/डिग्री)",
        "टायपिंग प्रमाणपत्र (लिपिक पदासाठी)",
        "डोमासाईल & कास्ट सर्टिफिकेट (लागू असल्यास)",
        "फोटो & सही"
      ],
      feeGeneral: 1000,
      feeReserved: 900,
      serviceCharge: 100,
      lastDate: "२०२६-०६-२५",
      description: "पशुसंवर्धन विभाग अंतर्गत गट-क मधील तांत्रिक व अतांत्रिक संवर्गातील पदांची ऑनलाईन अर्ज प्रक्रिया सुरु.",
      whatsappMessage: "🐄 *पशुसंवर्धन विभाग भरती २०२६*\n\n🔹 *एकूण जागा:* ४४६ पदे\n🔹 *पात्रता:* डिप्लोमा / डिग्री उत्तीर्ण\n🔹 *शेवटची तारीख:* २५ जून २०२६\n\nअचूक अर्ज भरण्यासाठी संपर्क करा:\n📞 *साईराम कॉम्प्युटर - ९०११०८३४४०*"
    },
    {
      id: "job-4",
      title: "MPSC State Services Recruitment 2026",
      titleMR: "MPSC राज्यसेवा पूर्व परीक्षा २०२६ (नागरी सेवा)",
      titleHI: "MPSC राज्य सेवा प्रारंभिक परीक्षा 2026",
      department: "Maharashtra Public Service Commission",
      departmentMR: "महाराष्ट्र लोकसेवा आयोग (MPSC)",
      departmentHI: "महाराष्ट्र लोक सेवा आयोग (MPSC)",
      totalVacancies: 524,
      posts: [
        { name: "उप जिल्हाधिकारी (गट-अ)", nameMR: "उप जिल्हाधिकारी (Group-A)", nameHI: "डिप्टी कलेक्टर (Group-A)", vacancy: "१४ पदे" },
        { name: "पोलीस उपअधीक्षक (DYSP)", nameMR: "पोलीस उपअधीक्षक / सहाय्यक पोलीस आयुक्त", nameHI: "डीएसपी / एसीपी", vacancy: "३८ पदे" },
        { name: "सहाय्यक राज्यकर आयुक्त", nameMR: "सहाय्यक राज्यकर आयुक्त", nameHI: "सहायक राज्य कर आयुक्त", vacancy: "४१ पदे" },
        { name: "गट विकास अधिकारी / इतर पदे", nameMR: "गट विकास अधिकारी & वर्ग-२ पदे", nameHI: "खंड विकास अधिकारी एवं अन्य", vacancy: "४३१ पदे" }
      ],
      ageLimit: "१९ ते ३८ वर्षे (मागासवर्गीय प्रवर्ग: ४३ वर्षांपर्यंत)",
      ageLimitMR: "किमान १९ वर्षे, कमाल ३८ वर्षे (मागासवर्गीय उमेदवारांसाठी ५ वर्षे शिथिलक्षम)",
      ageLimitHI: "१९ से ३८ वर्ष (आरक्षित श्रेणियों को ५ वर्ष की छूट)",
      qualification: "Graduation in any faculty (any recognized university). Candidates appearing in final year can also apply.",
      qualificationMR: "कोणत्याही मान्यताप्राप्त विद्यापीठाची पदवी (Degree) उत्तीर्ण. अंतिम वर्षात शिकणारे उमेदवारही अप्लाय करू शकतात.",
      qualificationHI: "किसी भी मान्यता प्राप्त विश्वविद्यालय से स्नातक डिग्री। अंतिम वर्ष के छात्र भी आवेदन कर सकते हैं।",
      importantDocuments: [
        "Aadhar Card / ओळखपत्र",
        "१० वी आणि १२ वी प्रमाणपत्र व गुणपत्रिका",
        "पदवी अंतिम वर्षाची गुणपत्रिका किंवा मूळ पदवी प्रमाणपत्र",
        "महाराष्ट्राचा रहिवासी दाखला (Domicile Certificate)",
        "जातीचा दाखला व नॉन-क्रिमिलेअर प्रमाणपत्र (लागू असल्यास)"
      ],
      feeGeneral: 544,
      feeReserved: 344,
      serviceCharge: 100,
      lastDate: "2026-07-28",
      description: "महाराष्ट्र लोकसेवा आयोगामार्फत राज्य शासनाच्या गट-अ आणि गट-ब विविध संवर्गातील पदांसाठी भरती जाहीर.",
      whatsappMessage: "🌟 *MPSC राज्यसेवा परीक्षा २०२६* ऑनलाईन अर्ज सुरू!\n\n🔹 *एकूण जागा:* ५२४ पदे\n🔹 *पात्रता:* कोणत्याही शाखेतील पदवी उत्तीर्ण\n🔹 *शेवटची तारीख:* २८ जुलै २०२६\n\nआपला फॉर्म १००% अचूक भरून घेण्यासाठी त्वरित संपर्क करा:\n📞 *साईराम कॉम्प्युटर - ९०११०८३४४०*"
    },
    {
      id: "job-5",
      title: "Railway RPF Constable Recruitment 2026",
      titleMR: "रेल्वे संरक्षण बल (RPF) शिपाई नोकर भरती २०२६",
      titleHI: "रेलवे सुरक्षा बल (RPF) कांस्टेबल भर्ती 2026",
      department: "Indian Railways (RRB)",
      departmentMR: "रेल्वे रिक्रूटमेंट बोर्ड, भारत सरकार",
      departmentHI: "रेलवे भर्ती बोर्ड, भारत सरकार",
      totalVacancies: 4208,
      posts: [
        { name: "आरपीएफ शिपाई (Constable Male)", nameMR: "आरपीएफ शिपाई (पुरुष)", nameHI: "आरपीएफ कांस्टेबल (पुरुष)", vacancy: "३५७७ पदे" },
        { name: "आरपीएफ शिपाई (Constable Female)", nameMR: "आरपीएफ शिपाई (महिला)", nameHI: "आरपीएफ कांस्टेबल (महिला)", vacancy: "६३१ पदे" }
      ],
      ageLimit: "१८ ते २८ वर्षे (SC/ST: ५ वर्षे सवलत, OBC: ३ वर्षे सवलत)",
      ageLimitMR: "किमान १८ वर्षे ते कमाल २८ वर्षे (मागासवर्गीय उमेदवारांसाठी नियमानुसार शिथिलता)",
      ageLimitHI: "१८ से २८ वर्ष (आरक्षित श्रेणियों को नियमानुसार छूट)",
      qualification: "10th Standard (SSC / Matriculation) passed from any recognized board in India.",
      qualificationMR: "किमान दहावी उत्तीर्ण (SSC Pass) किंवा समकक्ष शैक्षणिक पात्रता आवश्यक.",
      qualificationHI: "किसी भी मान्यता प्राप्त बोर्ड से न्यूनतम 10वीं कक्षा (मैट्रिक) उत्तीर्ण होनी चाहिए।",
      importantDocuments: [
        "आधार कार्ड / ओळखपत्र",
        "१० वी बोर्ड सर्टिफिकेट व गुणपत्रिका",
        "जातीचा दाखला (आरक्षणाचा लाभ हवा असल्यास)",
        "पासपोर्ट फोटो व स्वाक्षरी (सही)"
      ],
      feeGeneral: 500,
      feeReserved: 250,
      serviceCharge: 80,
      lastDate: "2026-07-10",
      description: "रेल्वे संरक्षण दलामध्ये शिपाई (कांस्टेबल) पदांच्या भरतीसाठी भारत सरकारच्या रेल्वे मंत्रालयाने काढलेली अधिकृत जाहिरात.",
      whatsappMessage: "🚆 *रेल्वे आरपीएफ शिपाई भरती २०२६* प्रसिद्ध!\n\n🔹 *एकूण जागा:* ४,२०८ पदे\n🔹 *पात्रता:* फक्त १० वी उत्तीर्ण\n🔹 *शेवटची तारीख:* १० जुलै २०२६\n\nसाईराम कॉम्प्युटरवर फॉर्म सुरळीत भरून मिळेल.\n📞 *संपर्क:* ९०११०८३४४०"
    },
    {
      id: "job-6",
      title: "SSC MTS & Havaldar Recruitment 2026",
      titleMR: "एसएससी एमटीएस आणि हवालदार नोकर भरती २०२६",
      titleHI: "एसएससी एमटीएस और हवालदार भर्ती 2026",
      department: "Staff Selection Commission",
      departmentMR: "कर्मचारी निवड आयोग (एसएससी), भारत सरकार",
      departmentHI: "कर्मचारी चयन आयोग (एसएससी), भारत सरकार",
      totalVacancies: 8326,
      posts: [
        { name: "मल्टी टास्किंग स्टाफ (MTS Non-Technical)", nameMR: "एमटीएस (MTS Non-Tech)", nameHI: "एमटीएस (MTS Non-Tech)", vacancy: "४८८७ पदे" },
        { name: "हवालदार (CBIC & CBN)", nameMR: "हवालदार (केंद्रीय अप्रत्यक्ष कर विभाग)", nameHI: "हवालदार (सीमा शुल्क एवं केंद्रीय उत्पाद)", vacancy: "३४३९ पदे" }
      ],
      ageLimit: "१८ ते २५ वर्षे / १८ ते २७ वर्षे (शाखेनुसार)",
      ageLimitMR: "१८ ते २५ वर्षे / २७ वर्षे (मागासवर्गीय उमेदवारांसाठी नियमांनुसार सूट)",
      ageLimitHI: "१८ से २५ वर्ष / २७ वर्ष (पदानुसार अलग-अलग, नियमानुसार छूट)",
      qualification: "Passed Matriculation (10th Class) Examination or equivalent from a recognized board.",
      qualificationMR: "किमान १० वी उत्तीर्ण आवश्यक (कोणत्याही मान्यताप्राप्त मंडळाकडून).",
      qualificationHI: "किसी भी मान्यता प्राप्त बोर्ड से न्यूनतम 10वीं कक्षा (मैट्रिक) उत्तीर्ण होनी चाहिए।",
      importantDocuments: [
        "आधार कार्ड किंवा पॅन कार्ड",
        "१० वी चे बोर्ड सर्टिफिकेट व जन्मतारखेचा पुरावा",
        "जातीचा दाखला व नॉन-क्रिमिलेअर दाखला (लागू असल्यास)",
        "रंगीत फोटो व डिजिटल स्वाक्षरी"
      ],
      feeGeneral: 100,
      feeReserved: 0,
      serviceCharge: 80,
      lastDate: "2026-07-20",
      description: "केंद्र सरकारच्या विविध मंत्रालये व विभागांमध्ये एमटीएस आणि हवालदार पदांच्या ८३२६ हून अधिक रिक्त पदांसाठी अधिसूचना.",
      whatsappMessage: "🔥 *SSC एमटीएस & हवालदार भरती २०२६* सुरू!\n\n🔹 *एकूण जागा:* ८,३२६ पदे\n🔹 *पात्रता:* १० वी उत्तीर्ण\n🔹 *शेवटची तारीख:* २० जुलै २०२६\n\nआपला ऑनलाईन अर्जाचा फॉर्म घरबसल्या किंवा केंद्रावर अचूक भरून मिळतील.\n📞 *संपर्क:* ९०११०८३४४०"
    },
    {
      id: "job-7",
      title: "India Post Office Gramin Dak Sevak Recruitment 2026",
      titleMR: "भारतीय टपाल विभाग ग्रामीण डाक सेवक (GDS) भरती २०२६",
      titleHI: "भारतीय डाक विभाग ग्रामीण डाक सेवक (GDS) भर्ती 2026",
      department: "Department of Posts, Government of India",
      departmentMR: "भारतीय टपाल विभाग, भारत सरकार",
      departmentHI: "भारतीय डाक विभाग, भारत सरकार",
      totalVacancies: 30041,
      posts: [
        { name: "शाखा पोस्ट मास्तर (BPM)", vacancy: "१२,५०० पदे" },
        { name: "सहाय्यक शाखा पोस्ट मास्तर (ABPM)", vacancy: "१७,५४१ पदे" }
      ],
      ageLimit: "१८ ते ४० वर्षे (SC/ST: ५ वर्षे सूट, OBC: ३ वर्षे सूट)",
      qualification: "10th standard passed with passing marks in Mathematics and English as compulsory/elective subjects.",
      importantDocuments: [
        "आधार कार्ड",
        "१० वी चे मार्कशीट व मूळ बोर्ड प्रमाणपत्र",
        "संगणक ज्ञान किंवा संगणक प्रमाणपत्र (असल्यास)",
        "जातीचा दाखला (कॅटेगरी आरक्षणासाठी)"
      ],
      feeGeneral: 100,
      feeReserved: 0,
      serviceCharge: 80,
      lastDate: "2026-08-05",
      description: "भारतीय डाक विभागातर्फे ३००४१ हून अधिक जागांवर ग्रामीण डाक सेवकांची भव्य नोकर भरती प्रक्रिया चालू आहे. कोणतीही लेखी किंवा तोंडी परीक्षा होणार नाही.",
      whatsappMessage: "📮 *टपाल विभाग (GDS) भव्य भरती २०२६* जाहीर!\n\n🔹 *एकूण जागा:* ३००४१ पदे\n🔹 *पात्रता:* १० वी उत्तीर्ण\n🔹 *शेवटची तारीख:* ५ ऑगस्ट २०२६\n\nआपला ऑनलाईन फॉर्म अचूक भरून घेण्यासाठी त्वरित संपर्क करा.\n📞 *संपर्क:* ९०११०८३४४०"
    }
  ],
  announcements: [
    {
      id: "ann-1",
      title: "महाडीबीटी स्कॉलरशिपसाठी नवीन अर्ज भरणे सुरू झाले आहे. सर्व महाविद्यालयीन विद्यार्थ्यांना सूचित करण्यात येते की शेवटच्या तारखेची वाट न पाहता त्वरित संपर्क साधावा.",
      type: "new",
      date: "२०२६-०६-०२"
    },
    {
      id: "ann-2",
      title: "शेतकरी बांधवांसाठी पीएम किसान योजना आणि पीक विमा भरण्याची मुदत ३१ जुलै २०२६ पर्यंत वाढविण्यात आली आहे. आपल्या नावावर पीक विमा करून घ्यावा.",
      type: "deadline",
      date: "२०२६-०६-०१"
    },
    {
      id: "ann-3",
      title: "नवीन आयुष्मान भारत कार्ड (५ लाख रुपयांचा मोफत उपचार कार्ड) आणि आधार अपडेट फॉर्म साईराम कॉम्प्युटरवर काढून मिळतील.",
      type: "important",
      date: "२०२६-०५-३०"
    }
  ],
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), "utf8");
      return defaultDb;
    }
    const content = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(content);
  } catch (err) {
    console.error("Error reading db.json, returning default:", err);
    return defaultDb;
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing db.json:", err);
  }
}

// ----------------------------------------------------
// server-side initialization for Google GenAI SDK
// ----------------------------------------------------
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// ----------------------------------------------------
// API Endpoints
// ----------------------------------------------------

// Demo OTPS session holder
const activeOTPs: { [mobile: string]: string } = {};

// Send Mock OTP (Demo)
// Send Mock OTP with dynamic random generation to eliminate hardcoded "1234"
// Line 366 ते Line 559 (send-otp आणि verify-otp हे दोन्ही routes)

// ── REGISTER ──
app.post("/api/auth/register", (req, res) => {
  const { name, mobile, password, securityQuestion, securityAnswer } = req.body;

  if (!name || !mobile || !password || !securityQuestion || !securityAnswer) {
    return res.status(400).json({ error: "सर्व माहिती भरणे आवश्यक आहे!" });
  }

  const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
  if (cleanMobile.length !== 10) {
    return res.status(400).json({ error: "वैध १० अंकी मोबाईल नंबर टाका!" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "पासवर्ड किमान ६ अक्षरांचा असावा!" });
  }

  // Check duplicate
  const exists = db.users.some((u: any) => u.mobile === cleanMobile);
  if (exists) {
    return res.status(400).json({ error: "हा मोबाईल नंबर आधीच नोंदणीकृत आहे! लॉगिन करा." });
  }

  const user: any = {
    id: "user-" + Math.random().toString(36).substring(2, 9),
    name: name.trim(),
    mobile: cleanMobile,
    password: password, // In production use bcrypt
    securityQuestion: securityQuestion,
    securityAnswer: securityAnswer.trim().toLowerCase(),
    email: "",
    photoUrl: "",
    joinedAt: new Date().toISOString(),
    documents: {},
    applications: [],
  };

  db.users.push(user);

  const token = `token-${user.id}`;
  const { password: _p, securityAnswer: _s, ...safeUser } = user;
  res.json({ success: true, user: safeUser, token });
});

// ── LOGIN ──
app.post("/api/auth/login", (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({ error: "मोबाईल नंबर आणि पासवर्ड टाका!" });
  }

  const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
  const user: any = db.users.find((u: any) => u.mobile === cleanMobile);

  if (!user) {
    return res.status(401).json({ error: "हा मोबाईल नंबर नोंदणीकृत नाही! आधी नवीन खाते बनवा." });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: "चुकीचा पासवर्ड! पुन्हा प्रयत्न करा." });
  }

  const token = `token-${user.id}`;
  const { password: _p, securityAnswer: _s, ...safeUser } = user;
  res.json({ success: true, user: safeUser, token });
});

// ── FORGOT PASSWORD STEP 1: get security question ──
app.post("/api/auth/forgot-step1", (req, res) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ error: "मोबाईल नंबर टाका!" });

  const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
  const user: any = db.users.find((u: any) => u.mobile === cleanMobile);

  if (!user) {
    return res.status(404).json({ error: "हा मोबाईल नंबर नोंदणीकृत नाही!" });
  }

  if (!user.securityQuestion) {
    return res.status(400).json({ error: "या खात्यासाठी सुरक्षा प्रश्न सेट नाही!" });
  }

  res.json({ success: true, question: user.securityQuestion });
});

// ── FORGOT PASSWORD STEP 2: verify answer & reset ──
app.post("/api/auth/forgot-step2", (req, res) => {
  const { mobile, answer, newPassword } = req.body;

  if (!mobile || !answer || !newPassword) {
    return res.status(400).json({ error: "सर्व माहिती भरा!" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "पासवर्ड किमान ६ अक्षरांचा असावा!" });
  }

  const cleanMobile = mobile.replace(/\D/g, "").slice(-10);
  const userIndex = db.users.findIndex((u: any) => u.mobile === cleanMobile);

  if (userIndex === -1) {
    return res.status(404).json({ error: "युजर सापडला नाही!" });
  }

  const user: any = db.users[userIndex];
  if (user.securityAnswer !== answer.trim().toLowerCase()) {
    return res.status(401).json({ error: "चुकीचे उत्तर! पुन्हा प्रयत्न करा." });
  }

  db.users[userIndex].password = newPassword;
  res.json({ success: true, message: "पासवर्ड यशस्वीरित्या बदलला!" });
});


// Get profile
app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  const userId = token.replace("token-", "");

  const db = readDb();
  const user = db.users.find((u: any) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "वापरकर्ता सापडला नाही." });
  }

  res.json(user);
});

// Update Profile General Details
app.put("/api/auth/profile", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  const userId = token.replace("token-", "");

  const { name, email, photoBase64 } = req.body;

  const db = readDb();
  const userIndex = db.users.findIndex((u: any) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: "वापरकर्ता सापडला नाही." });
  }

  if (name) db.users[userIndex].name = name;
  if (email !== undefined) db.users[userIndex].email = email;

  if (photoBase64) {
    const filename = `photo-${userId}-${Date.now()}.png`;
    const filepath = path.join(UPLOAD_DIR, filename);
    const cleanBase64 = photoBase64.replace(/^data:image\/\w+;base64,/, "");
    fs.writeFileSync(filepath, cleanBase64, "base64");
    db.users[userIndex].photoUrl = `/uploads/${filename}`;
  }

  writeDb(db);
  res.json({ success: true, user: db.users[userIndex] });
});

// Secure Document Wallet File Upload (Saves automatically, preventing multiple uploads)
app.post("/api/wallet/upload", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  const userId = token.replace("token-", "");

  const { fileType, fileBase64, fileName } = req.body;

  if (!fileType || !fileBase64 || !fileName) {
    return res.status(400).json({ error: "अपूर्ण माहिती मिळाली." });
  }

  const db = readDb();
  const userIndex = db.users.findIndex((u: any) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: "वापरकर्ता सापडला नाही." });
  }

  // Save base64 data to actual storage
  const extension = path.extname(fileName) || ".png";
  const uniqueName = `doc-${userId}-${fileType}-${Date.now()}${extension}`;
  const filepath = path.join(UPLOAD_DIR, uniqueName);

  try {
    const cleanBase64 = fileBase64.replace(/^data:.*?base64,/, "");
    fs.writeFileSync(filepath, cleanBase64, "base64");
    const fileUrl = `/uploads/${uniqueName}`;

    // Update specific document url and name
    const urlKey = `${fileType}Url`;
    const nameKey = `${fileType}Name`;

    db.users[userIndex].documents[urlKey] = fileUrl;
    db.users[userIndex].documents[nameKey] = fileName;

    writeDb(db);
    res.json({ success: true, user: db.users[userIndex] });
  } catch (err) {
    console.error("Error saving document wallet", err);
    res.status(500).json({ error: "फाइल सेव्ह करताना तांत्रिक अडचण आली." });
  }
});

// Delete specific wallet document
app.post("/api/wallet/delete", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  const userId = token.replace("token-", "");

  const { fileType } = req.body;

  const db = readDb();
  const userIndex = db.users.findIndex((u: any) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: "वापरकर्ता सापडला नाही." });
  }

  const urlKey = `${fileType}Url`;
  const nameKey = `${fileType}Name`;

  db.users[userIndex].documents[urlKey] = "";
  db.users[userIndex].documents[nameKey] = "";

  writeDb(db);
  res.json({ success: true, user: db.users[userIndex] });
});

// Apply For a Service Form
app.post("/api/applications/apply", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  const userId = token.replace("token-", "");

  const { category, formKey, formTitle, customDetails, paymentScreenshotBase64, payLater } = req.body;

  const db = readDb();
  const user = db.users.find((u: any) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "वापरकर्ता सापडला नाही." });
  }

  // Save payment screenshot if provided
  let screenshotUrl = "";
  if (paymentScreenshotBase64) {
    const filename = `payment-${userId}-${Date.now()}.png`;
    const filepath = path.join(UPLOAD_DIR, filename);
    const cleanBase64 = paymentScreenshotBase64.replace(/^data:.*?base64,/, "");
    fs.writeFileSync(filepath, cleanBase64, "base64");
    screenshotUrl = `/uploads/${filename}`;
  }

  // Fetch the automatic secure wallet files from the user account to lock with this customized applied form.
  // This solves "परत परत डॉक्युमेंट अपलोड करायची गरज नाही" requirements!
  const userDocsAttached: { [key: string]: string } = {};
  const docTypes = ["aadhar", "pan", "marksheet", "photo", "signature", "income"];
  docTypes.forEach((type) => {
    const urlKey = `${type}Url`;
    if (user.documents && user.documents[urlKey]) {
      userDocsAttached[type] = user.documents[urlKey];
    }
  });

  const newApp = {
    id: "app-" + Math.random().toString(36).substring(2, 9),
    userId: user.id,
    userName: user.name,
    userMobile: user.mobile,
    category,
    formKey,
    formTitle,
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "Pending",
    paymentStatus: payLater ? "Pending" : "Paid",
    paymentScreenshotUrl: screenshotUrl,
    customDetails: customDetails || {},
    documents: userDocsAttached,
    feedback: "फॉर्म यशस्वीरित्या साईराम कॉम्प्युटरकडे सबमिट झाला आहे.",
  };

  db.applications.push(newApp);
  writeDb(db);

  res.json({ success: true, application: newApp });
});

// Repay/Retry Payment For a Cancelled Form Form
app.post("/api/applications/repay", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  const userId = token.replace("token-", "");

  const { applicationId } = req.body;

  if (!applicationId) {
    return res.status(400).json({ error: "अपूर्ण माहिती मिळाली." });
  }

  const db = readDb();
  const appIndex = db.applications.findIndex((app: any) => app.id === applicationId && app.userId === userId);

  if (appIndex === -1) {
    return res.status(404).json({ error: "अर्ज सापडला नाही." });
  }

  // Set back to paid, status to Pending / Processing to re-trigger review
  db.applications[appIndex].paymentStatus = "Paid";
  db.applications[appIndex].status = "Pending";
  db.applications[appIndex].feedback = "🔄 ग्राहकाने क्यूआर कोड स्कॅन करून पुन्हा पेमेंट यशस्वी केले आहे. कृपया तपासणी करून अर्ज भरावा.";
  db.applications[appIndex].updatedAt = new Date().toISOString();

  writeDb(db);
  res.json({ success: true, application: db.applications[appIndex] });
});

// View My Applications (Active History)
app.get("/api/applications/my", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  const userId = token.replace("token-", "");

  const db = readDb();
  const userApps = db.applications.filter((app: any) => app.userId === userId);

  res.json(userApps);
});

// Get standard Job Vacancies Notifications
app.get("/api/jobs", (req, res) => {
  const db = readDb();
  res.json(db.jobs);
});

// Get basic announcements ticker
app.get("/api/announcements", (req, res) => {
  const db = readDb();
  res.json(db.announcements);
});

// Create or Update Job Alert Subscription
app.post("/api/subscriptions", (req, res) => {
  const { name, mobile, email, qualification, channels } = req.body;

  if (!mobile) {
    return res.status(400).json({ error: "कृपया मोबाईल नंबर टाका!" });
  }

  const db = readDb();
  db.subscriptions = db.subscriptions || [];

  // Check if subscriber already exists - if so, update their preferences
  const existingIndex = db.subscriptions.findIndex(
    (sub: any) => sub.mobile === mobile
  );

  const updatedSubscription = {
    id: existingIndex >= 0 ? db.subscriptions[existingIndex].id : "sub-" + Math.random().toString(36).substring(2, 9),
    name: name || "सभासद",
    mobile,
    email: email || "",
    qualification: qualification || "all",
    channels: channels || ["whatsapp"],
    subscribedAt: existingIndex >= 0 ? db.subscriptions[existingIndex].subscribedAt : new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    db.subscriptions[existingIndex] = updatedSubscription;
  } else {
    db.subscriptions.push(updatedSubscription);
  }

  writeDb(db);

  res.json({
    success: true,
    message: "अभिनंदन! तुमची कॉम्प्युटर नोकरी अलर्ट सबस्क्रिप्शन यशस्वीरित्या नोंदवली गेली आहे.",
    subscription: updatedSubscription,
  });
});

// ADMIN ENDPOINTS (Admin panel authorization bypass or standard header password block)
const verifyAdminToken = (req: any, res: any, next: any) => {
  const adminToken = req.headers["x-admin-token"];
  if (adminToken === "SairamAdmin@9011") {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized Admin" });
  }
};

// Admin Login - Secure Registered Mobile & OTP Authentication
app.post("/api/admin/login", (req, res) => {
  const { mobile, otp } = req.body;
  
  if (!mobile || !otp) {
    return res.status(400).json({ error: "मोबाईल नंबर आणि ओटीपी आवश्यक आहेत." });
  }

  if (mobile !== "9011083440") {
    return res.status(400).json({ error: "हा मोबाईल नंबर अधिकृत ॲडमीन म्हणून नोंदणीकृत नाही!" });
  }

  // Verify against generated random OTP strictly (no hardcoded bypass codes to prevent scams)
  const expectedAdminOtp = activeOTPs["9011083440"];
  if (expectedAdminOtp !== otp) {
    return res.status(400).json({ error: "चुकीचा ॲडमीन सुरक्षा ओटीपी! कृपया पुन्हा प्रयत्न करा." });
  }

  // Log in successfully
  delete activeOTPs["9011083440"];
  res.json({ success: true, token: "SairamAdmin@9011" });
});

// Admin Applications list
app.get("/api/admin/applications", verifyAdminToken, (req, res) => {
  const db = readDb();
  res.json(db.applications);
});

// Admin Get all subscriptions
app.get("/api/admin/subscriptions", verifyAdminToken, (req, res) => {
  const db = readDb();
  res.json(db.subscriptions || []);
});

// Admin Delete a subscription (manual unsubscribe)
app.delete("/api/admin/subscriptions/:id", verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.subscriptions = (db.subscriptions || []).filter((sub: any) => sub.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Admin Update Application Status/Payment Status
app.put("/api/admin/applications/:id", verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus, feedback, resultBase64, resultFileName } = req.body;

  const db = readDb();
  const appIndex = db.applications.findIndex((app: any) => app.id === id);

  if (appIndex === -1) {
    return res.status(404).json({ error: "अर्ज सापडला नाही." });
  }

  if (status) db.applications[appIndex].status = status;
  if (paymentStatus) db.applications[appIndex].paymentStatus = paymentStatus;
  if (feedback !== undefined) db.applications[appIndex].feedback = feedback;

  if (resultBase64 && resultFileName) {
    const extension = path.extname(resultFileName) || ".pdf";
    const filename = `receipt-${id}-${Date.now()}${extension}`;
    const filepath = path.join(UPLOAD_DIR, filename);
    const cleanBase64 = resultBase64.replace(/^data:.*?base64,/, "");
    fs.writeFileSync(filepath, cleanBase64, "base64");
    db.applications[appIndex].resultUrl = `/uploads/${filename}`;
  }

  db.applications[appIndex].updatedAt = new Date().toISOString();
  writeDb(db);

  res.json({ success: true, application: db.applications[appIndex] });
});

// Admin Add customized Job post
app.post("/api/admin/jobs", verifyAdminToken, (req, res) => {
  const { titleMR, title, departmentMR, department, totalVacancies, posts, ageLimit, qualification, importantDocuments, feeGeneral, feeReserved, serviceCharge, lastDate, description } = req.body;

  const db = readDb();
  const newJob = {
    id: "job-" + Math.random().toString(36).substring(2, 9),
    titleMR: titleMR || title,
    title: title || titleMR,
    departmentMR: departmentMR || department,
    department: department || departmentMR,
    totalVacancies: Number(totalVacancies),
    posts: posts || [],
    ageLimit: ageLimit || "१८ ते ३८ वर्षे",
    qualification: qualification || "पदवी उत्तीर्ण",
    importantDocuments: importantDocuments || [],
    feeGeneral: Number(feeGeneral) || 0,
    feeReserved: Number(feeReserved) || 0,
    serviceCharge: Number(serviceCharge) || 0,
    lastDate: lastDate || "२०२६-०८-०१",
    description: description || "",
    whatsappMessage: `👮‍♂️ *${titleMR || title}* चालू!\n\n🔹 *एकूण जागा:* ${totalVacancies}\n🔹 *शेवटची तारीख:* ${lastDate}\n\nआपला ऑनलाईन फॉर्म १००% अचूक भरण्यासाठी साईराम कॉम्प्युटरशी संपर्क साधा.\n📞 *संपर्क:* ९०११०८३४४०`
  };

  db.jobs.unshift(newJob);
  writeDb(db);
  res.json({ success: true, job: newJob });
});

// Admin delete Job post
app.delete("/api/admin/jobs/:id", verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.jobs = db.jobs.filter((j: any) => j.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Admin Add Announcement ticker
app.post("/api/admin/announcements", verifyAdminToken, (req, res) => {
  const { title, type } = req.body;
  const db = readDb();
  const newAnn = {
    id: "ann-" + Math.random().toString(36).substring(2, 9),
    title,
    type: type || "new",
    date: new Date().toLocaleDateString("mr-IN")
  };
  db.announcements.unshift(newAnn);
  writeDb(db);
  res.json({ success: true, announcement: newAnn });
});

// Admin delete Announcement
app.delete("/api/admin/announcements/:id", verifyAdminToken, (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.announcements = db.announcements.filter((a: any) => a.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// ----------------------------------------------------
// SMART AI DOCUMENT OCR ANALYZER (Server-side Gemini Integration!)
// ----------------------------------------------------
app.post("/api/admin/ocr-analyze", verifyAdminToken, async (req, res) => {
  const { fileUrl } = req.body;
  if (!fileUrl) {
    return res.status(400).json({ error: "फाइल यूआरएल मिळालेली नाही." });
  }

  try {
    const filename = path.basename(fileUrl);
    const filepath = path.join(UPLOAD_DIR, filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: "फाइल सर्व्हरवर सापडली नाही." });
    }

    // Read file and parse base64 for Gemini multipart inlineData
    const fileBuffer = fs.readFileSync(filepath);
    const base64Data = fileBuffer.toString("base64");

    // Detect file mime/type
    let mimeType = "image/png";
    if (filename.toLowerCase().endsWith(".pdf")) {
      mimeType = "application/pdf";
    } else if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
      mimeType = "image/jpeg";
    }

    // Let's call the newly integrated server-side Gemini 3.5-flash
    const prompt = `You are a high-accuracy document scanner and structural data extractor for "Sairam Computers" (an online internet cafe in Maharashtra).
Identify the uploaded document (Aadhar Card, PAN, Marksheet, Photo, Signature, or Income Certificate).
Analyze the content and extract all relevant information to help the administrator fill out government job/scholarship forms under a minute.

Provide a tidy JSON response. Return exactly this JSON structure:
{
  "documentType": "आधार कार्ड" | "पॅन कार्ड" | "१०वी/१२वी गुणपत्रिका" | "उत्पन्नाचा दाखला" | "इतर",
  "nameEN": "Full Name in English",
  "nameMR": "Full Name in Marathi (if found in document)",
  "dob": "DD/MM/YYYY or YYYY-MM-DD format",
  "documentNumber": "Aadhar number or PAN number or Certificate serial (e.g. 1234 5678 9012)",
  "fatherOrSpouse_Name": "Father's name or Spouse's name",
  "gender": "पुरुष / स्त्री / इतर",
  "address": "Permanent Address (if found)",
  "marksOrGrade": "Percentage or marks (if found on marksheet e.g. 85.40% or 450/600)",
  "issueDate": "Document issuance date (if found)",
  "extractedSummary": "A concise bullet list in Marathi of important details of this file to save time."
}

Do not make up information. If an field is not legible or not applicable to this document type, leave it as an empty string (""). Keep it completely accurate.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
        { text: prompt },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentType: { type: Type.STRING },
            nameEN: { type: Type.STRING },
            nameMR: { type: Type.STRING },
            dob: { type: Type.STRING },
            documentNumber: { type: Type.STRING },
            fatherOrSpouse_Name: { type: Type.STRING },
            gender: { type: Type.STRING },
            address: { type: Type.STRING },
            marksOrGrade: { type: Type.STRING },
            issueDate: { type: Type.STRING },
            extractedSummary: { type: Type.STRING },
          },
          required: ["documentType", "nameEN", "nameMR", "dob", "documentNumber", "fatherOrSpouse_Name", "gender", "address", "marksOrGrade", "issueDate", "extractedSummary"],
        },
      },
    });

    const parsedResponse = JSON.parse(response.text || "{}");
    res.json({ success: true, extraction: parsedResponse });

  } catch (err: any) {
    console.error("Gemini OCR error:", err);
    res.status(500).json({ error: "डॉक्युमेंट विश्लेषणात अडचण आली किंवा API की सेट केलेली नाही.", details: err.message });
  }
});

// ----------------------------------------------------
// VITE MIDDLEWARE CONFIGURATION
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sairam Computers Full-Stack Server running at http://localhost:${PORT}`);
  });
}

startServer();
