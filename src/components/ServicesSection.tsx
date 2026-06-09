import React, { useState } from "react";
import { CreditCard, Award, GraduationCap, Sprout, ShieldAlert, CheckCircle, Smartphone, ChevronDown, ChevronUp, ClipboardList, Info } from "lucide-react";
import { ServiceItem } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ServicesSectionProps {
  category: "student" | "farmer" | "other";
  onApplyService: (service: ServiceItem) => void;
  lang: "mr" | "en" | "hi";
}

const sectionTranslations = {
  mr: {
    warningTitle: "माहिती पत्रक:",
    warningBody: "कृपया नोंद घ्या: आमच्याकडे सध्या आपले सरकार सेवा (उत्पन्नाचा दाखला, जातीचा दाखला, रहिवासी दाखला) चे स्वतः दाखले व वैयक्तिक कागदपत्रे थेट बनवून मिळत नाहीत. येथे फक्त वरील शिष्यवृत्ती, ऍडमिशन, पिक विमा व तत्सम अर्ज अधिकृत वेबसाईटवर अचूक भरून दिले जातील.",
    chargeLabel: "सर्व्हिस चार्ज",
    applyBtn: "ऑनलाईन अर्ज करण्यासाठी अप्लाय करा",
    docsLabel: "📁 सुरक्षित वॉलेट कागदपत्रे जोडली जातील:",
    eligibilityTitle: "🎓 पात्रता निकष व अटी:",
    guidelinesTitle: "📋 महत्वाच्या सूचना व नियम:",
    totalCharge: "एकूण शुल्क (सेवा दर)",
    rupees: "रुपये",
    viewMore: "सविस्तर माहिती पहा",
    viewLess: "माहिती लपवा",
    enterDetails: "अर्ज मधील खालील रकाने पूर्ण केले जातील:",
    studentHeader: "महाविद्यालयीन विद्यार्थी ऑनलाईन फॉर्म",
    studentSub: "स्कॉलरशिप, प्रवेश परीक्षा, व्यावसायिक कोर्सेस व ११वी प्रवेशासाठी सुरक्षित व जलद अर्ज सेवा.",
    farmerHeader: "शेतकरी कल्याणकारी योजना",
    farmerSub: "पीक विमा, पीएम किसान योजना, ठिबक सिंचन व इतर शासकीय योजना अर्ज करण्यासाठी संपर्क करा.",
    otherHeader: "इतर नागरी डिजिटल सेवा (पॅन / आयुष्मान कार्ड)",
    otherSub: "पॅन कार्ड, आयुष्मान सुरक्षा कार्ड यांसारखे महत्त्वाचे सरकारी दाखले तात्काळ सेवा दरात बनवून घ्या."
  },
  en: {
    warningTitle: "Important Note:",
    warningBody: "Please note: We do not issue official government certificates (income, caste, or domicile certificates link) directly. We support error-free online submissions of scholarship, admission, crop insurance, and related services on official portals.",
    chargeLabel: "Service Charge",
    applyBtn: "Apply Online via Sairam",
    docsLabel: "📁 Documents linked from Secure Wallet:",
    eligibilityTitle: "🎓 Eligibility Criteria & Terms:",
    guidelinesTitle: "📋 Important Guidelines & Steps:",
    totalCharge: "Total Service Fee",
    rupees: "INR",
    viewMore: "View Detailed Information & Eligibility",
    viewLess: "Hide Detailed Information",
    enterDetails: "Following application fields will be submitted:",
    studentHeader: "College Students Online Forms",
    studentSub: "Scholarships, entrance exams, vocational courses, and XI admissions with high-accuracy review.",
    farmerHeader: "Farmers welfare Schemes & Subsidies",
    farmerSub: "Crop insurance, PM Kisan KYC & registrations, drip irrigation, and other government systems.",
    otherHeader: "Other Citizen Digital Utilities",
    otherSub: "Pan cards, Ayushman Bharat health insurance, and essential national registry applications."
  },
  hi: {
    warningTitle: "सूचना पत्रक:",
    warningBody: "कृपया ध्यान दें: हमारे पास वर्तमान में सरकारी प्रमाण पत्र (आय, जाति, अधिवास प्रमाण पत्र) सीधे बनाने की सुविधा उपलब्ध नहीं है। हम केवल छात्रवृत्ति, प्रवेश परीक्षा, फसल बीमा आदि के लिए आधिकारिक पोर्टल्स पर सटीक आवेदन भरते हैं।",
    chargeLabel: "सेवा शुल्क",
    applyBtn: "ऑनलाइन आवेदन के लिए अप्लाई करें",
    docsLabel: "📁 सुरक्षित वॉलेट से दस्तावेज़ जोड़े जाएंगे:",
    eligibilityTitle: "🎓 पात्रता मानदंड और शर्तें:",
    guidelinesTitle: "📋 महत्वपूर्ण निर्देश और नियम:",
    totalCharge: "कुल सेवा शुल्क",
    rupees: "रुपये",
    viewMore: "विस्तृत विवरण और पात्रता देखें",
    viewLess: "विवरण छिपाएं",
    enterDetails: "आवेदन में निम्नलिखित विवरण भरे जाएंगे:",
    studentHeader: "कॉलेज छात्रों के लिए ऑनलाइन फॉर्म",
    studentSub: "स्कॉलरशिप, प्रवेश परीक्षा, व्यावसायिक पाठ्यक्रम और 11वीं प्रवेश के लिए सुरक्षित और त्वरित आवेदन सेवा।",
    farmerHeader: "किसान कल्याणकारी योजनाएं",
    farmerSub: "फसल बीमा, पीएम किसान योजना, टपक सिंचाई और अन्य सरकारी योजनाओं के लिए आवेदन करें।",
    otherHeader: "अन्य नागरिक डिजिटल सेवाएं (पैन / आयुष्मान)",
    otherSub: "पैन कार्ड, आयुष्मान स्वास्थ्य कार्ड जैसे महत्वपूर्ण सरकारी दस्तावेज सबसे कम दरों पर बनवाएं।"
  }
};

export default function ServicesSection({ category, onApplyService, lang }: ServicesSectionProps) {
  const [expandedSrvKey, setExpandedSrvKey] = useState<string | null>(null);

  const t = sectionTranslations[lang] || sectionTranslations.mr;

  const toggleExpand = (key: string) => {
    setExpandedSrvKey(expandedSrvKey === key ? null : key);
  };

  const studentServices: ServiceItem[] = [
    {
      key: "mahadbt-scholarship",
      title: "MahaDBT Scholarship form (महाडीबीटी)",
      titleMR: "महाडीबीटी स्कॉलरशिप फॉर्म (MahaDBT)",
      titleHI: "महाडीबीटी छात्रवृत्ति फॉर्म (MahaDBT)",
      description: "Submit online scholarship applications for SC, ST, OBC, VJNT, SBC, and EBC students.",
      descriptionMR: "महाविद्यालयातील सर्व मागासवर्गीय व आर्थिकदृष्ट्या दुर्बल घटकातील विद्यार्थ्यांसाठी शासकीय शिष्यवृत्तीचा अर्ज भरणे.",
      descriptionHI: "कॉलेज के सभी पिछड़े और आर्थिक रूप से कमजोर वर्ग के छात्रों के लिए सरकारी छात्रवृत्ति का आवेदन भरना।",
      serviceCharge: 100,
      mandatedDocs: ["aadhar", "marksheet", "income", "photo", "signature"],
      fields: [
        { name: "collegeName", label: "College Name", labelMR: "कॉलेजचे नाव", labelHI: "कॉलेज का नाम", placeholder: "e.g. Government Polytechnic", placeholderMR: "उदा. शासकीय तंत्रनिकेतन पुणे", placeholderHI: "उदा. शासकीय कॉलेज पुणे", type: "text" },
        { name: "courseName", label: "Course & Year", labelMR: "कोर्स व वर्ष", labelHI: "पाठ्यक्रम और वर्ष", placeholder: "e.g. D.Pharm / B.Sc", placeholderMR: "उदा. D.Pharm / B.Sc / B.Tech", placeholderHI: "उदा. डी फार्म / बीएससी", type: "text" },
        { name: "previousPercentage", label: "Previous Marks %", labelMR: "मागील टक्केवारी", labelHI: "पिछली प्रतिशत", placeholder: "e.g. 82.40%", placeholderMR: "उदा. ७८.५०%", placeholderHI: "उदा. ८२.४०%", type: "text" },
        { name: "annualIncome", label: "Annual Income (Rs)", labelMR: "वार्षिक उत्पन्न", labelHI: "वार्षिक आय", placeholder: "e.g. 1,50,000", placeholderMR: "उदा. १,२०,००० रुपये", placeholderHI: "उदा. १,२०,००० रुपये", type: "text" },
      ],
      eligibilityEN: "Belong to SC/ST/OBC/VJNT/SBC/EBC category. Enrolled in recognized courses. College admission should be within official quota limits.",
      eligibilityMR: "विद्यार्थी SC, ST, OBC, VJNT, SBC किंवा EBC वर्गातील असावा. शिक्षण शासकीय मान्यताप्राप्त संस्थेत चालू असावे व उत्पन्न मर्यादेत असावे.",
      eligibilityHI: "छात्र SC, ST, OBC, VJNT, SBC या EBC वर्ग से होना चाहिए। मान्यता प्राप्त संस्थान में पढ़ाई और निर्धारित आय सीमा का पालन आवश्यक है।",
      guidelinesEN: [
        "Ensure your Aadhaar is linked to your bank account and active for NPCI mapping.",
        "Keep the Income Certificate from Tahsildar ready for upload (less than 8 Lakhs).",
        "Upload last year's pass marksheet and college admission receipt carefully."
      ],
      guidelinesMR: [
        "तुमचा आधार कार्ड बँक खात्याशी आणि मोबाईलशी नक्की लिंक असावा, तसेच NPCI मॅपिंग चालू असावे.",
        "तहसीलदार यांनी दिलेला ८ लाख रुपयांच्या आतील वार्षिक उत्पन्नाचा चालू वर्षाचा दाखला आवश्यक आहे.",
        "मागील वर्षाची मार्कशीट व चालू कॉलेज भरलेले फी रिसीट स्कॅन करून जोडावे."
      ],
      guidelinesHI: [
        "आपका आधार कार्ड बैंक खाते और मोबाइल से लिंक होना चाहिए, साथ ही NPCI मैपिंग भी सक्रिय होनी चाहिए।",
        "तहसीलदार द्वारा जारी किया गया चालू वर्ष का वार्षिक आय प्रमाण पत्र (8 लाख से कम) आवश्यक है।",
        "पिछले वर्ष की मार्कशीट और इस वर्ष के कॉलेज शुल्क की रसीद स्कैन करके जमा करें।"
      ]
    },
    {
      key: "nsp-scholarship",
      title: "National Scholarship Portal (NSP)",
      titleMR: "NSP नॅशनल स्कॉलरशिप फॉर्म (Central)",
      titleHI: "एनएसपी नेशनल स्कॉलरशिप फॉर्म (Central)",
      description: "Central government scholarship for minority communities and meritorious students.",
      descriptionMR: "अल्पसंख्याक (Minority) व इतर प्रवर्ग विद्यार्थ्यांच्या राष्ट्रीय स्तरावरील केंद्र सरकारच्या शिष्यवृत्तीसाठी अर्ज करणे.",
      descriptionHI: "अल्पसंख्यक (Alpashankhyak) और अन्य Meritorious छात्रों के लिए केंद्र सरकार की छात्रवृत्ति के लिए आवेदन।",
      serviceCharge: 100,
      mandatedDocs: ["aadhar", "marksheet", "income", "photo", "signature"],
      fields: [
        { name: "collegeName", label: "Institute / School Name", labelMR: "शाळा / कॉलेजचे नाव", labelHI: "स्कूल / कॉलेज का नाम", placeholder: "School or college", placeholderMR: "शाळेचे / कॉलेजचे नाव टाका", placeholderHI: "स्कूल या कॉलेज का नाम लिखें", type: "text" },
        { name: "courseName", label: "Current Class / Standard", labelMR: "सध्याची इयत्ता / वर्ग", labelHI: "वर्तमान कक्षा / वर्ष", placeholder: "e.g. 12th Science", placeholderMR: "उदा. १२ वी विज्ञान / प्रथम वर्ष बीए", placeholderHI: "उदा. १२वीं विज्ञान / प्रथम वर्ष", type: "text" },
        { name: "previousPercentage", label: "Last Year Marks %", labelMR: "मागील वर्षाचे गुण (%)", labelHI: "पिछला प्रतिशत (%)", placeholder: "e.g. 75%", placeholderMR: "उदा. ८५.००%", placeholderHI: "उदा. ८५.००%", type: "text" },
      ],
      eligibilityEN: "Minority community students (Muslims, Sikhs, Christians, Buddhists, Jains, Parsis) with family income under 2 Lakhs. Score above 50% in previous exams.",
      eligibilityMR: "अल्पसंख्याक समाजातील (मुस्लिम, शीख, ख्रिश्चन, बौद्ध, जैन, पारशी) विद्यार्थी. मागील परीक्षेत किमान ५०% गुण आणि उत्पन्नाची मर्यादा २ लाख.",
      eligibilityHI: "अल्पसंख्यक समुदाय (मुस्लिम, सिख, ईसाई, बौद्ध, जैन, पारसी) के छात्र। पिछली परीक्षा में कम से कम 50% अंक और आय सीमा 2 लाख रुपये।",
      guidelinesEN: [
        "Only one application per year is allowed nationwide. Multi-applications will reject.",
        "Upload authentic Minority Self-Declaration certificate.",
        "Keep Bonafide certificate handy signed by Head of Institute."
      ],
      guidelinesMR: [
        "एका वर्षात देशभरातून फक्त एकाच शिष्यवृत्तीसाठी अर्ज करता येईल. एकापेक्षा जास्त अर्ज बाद होतील.",
        "अल्पसंख्याक स्वघोषणापत्र (Minority Declaration) व्यवस्थित भरून अपलोड करा.",
        "कॉलेजचे चालू वर्षाचे बोनाफाईड सर्टिफिकेट (संस्था प्रमुखांची सही व शिक्का) आवश्यक आहे."
      ],
      guidelinesHI: [
        "एक वर्ष में देश भर से केवल एक छात्रवृत्ति के लिए ही आवेदन स्वीकार्य होगा, अधिक आवेदन खारिज कर दिए जाएंगे।",
        "अल्पसंख्यक स्व-घोषणा पत्र को सही तरीके से भरकर अपलोड करें।",
        "कॉलेज का चालू वर्ष का बोनाफाइड सर्टिफिकेट (सक्षम अधिकारी के हस्ताक्षर के साथ) होना आवश्यक है।"
      ]
    },
    {
      key: "eleventh-admission",
      title: "11th Admission Process (FYJC)",
      titleMR: "अकरावी (11th FYJC) ऑनलाईन ऍडमिशन फॉर्म",
      titleHI: "11वीं (11th FYJC) ऑनलाइन एडमिशन फॉर्म",
      description: "Online registration & college choice options for students passing 10th standard.",
      descriptionMR: "१० वी नंतर अकरावीच्या नामांकित कॉलेजमधील प्रवेश प्रक्रिया ऑनलाईन नोंदणी व कॉलेज पसंतीक्रम भरणे.",
      descriptionHI: "10वीं के बाद 11वीं कक्षा के नामांकित कॉलेज में प्रवेश के लिए ऑनलाइन पंजीकरण और कॉलेज प्राथमिकता चुनना।",
      serviceCharge: 80,
      mandatedDocs: ["aadhar", "marksheet", "photo", "signature"],
      fields: [
        { name: "tenthSchool", label: "10th School Name", labelMR: "१०वी शाळेचे नाव", labelHI: "10वीं स्कूल का नाम", placeholder: "High school", placeholderMR: "उदा. न्यू इंग्लिश स्कूल", placeholderHI: "उदा. न्यू इंग्लिश स्कूल", type: "text" },
        { name: "tenthMarks", label: "10th Total Marks / %", labelMR: "१०वी चे गुण / टक्केवारी", labelHI: "10वीं के कुल अंक / प्रतिशत", placeholder: "e.g. 450/500", placeholderMR: "उदा. ४६०/५०० (९२.००%)", placeholderHI: "उदा. ४६०/५०० (९२.००%)", type: "text" },
        { name: "preferredColleges", label: "Top 3 Preferred Colleges", labelMR: "पसंतीचे कॉलेज चे नाव (३ नावे)", labelHI: "3 पसंदीदा कॉलेज के नाम", placeholder: "e.g. 1. Fergusson 2. Modern", placeholderMR: "उदा. १) फर्ग्युसन कॉलेज पुणे, २) मॉडर्न कॉलेज", placeholderHI: "उदा. कॉलेज १, कॉलेज २, कॉलेज ३", type: "textarea" },
      ],
      eligibilityEN: "Passed SSC (10th) from Maharashtra board or equivalent.",
      eligibilityMR: "१० वी उत्तीर्ण (SSC Board किंवा इतर शिक्षण मंडळ) विद्यार्थी प्रवेशासाठी पात्र आहेत.",
      eligibilityHI: "10वीं कक्षा (एसएससी बोर्ड या अन्य) उत्तीर्ण करने वाले छात्र प्रवेश के लिए पात्र हैं।",
      guidelinesEN: [
        "Fill out Part-1 (Registration) immediately after 10th results are declared.",
        "Keep the Option Form (Part-2) ready with the best colleges based on your marks.",
        "Ensure caste benefit reservation selections match certificates identically."
      ],
      guidelinesMR: [
        "Part-1 (नोंदणी अर्ज) १० वीचा निकाल लागल्यानंतर त्वरित भरून घेणे आवश्यक आहे.",
        "Option Form (Part-2) मध्ये स्वतःच्या टक्केवारीनुसार योग्य कॉलेजेस निवडावे जेणेकरून प्रवेश निश्चित होईल.",
        "कास्ट बेनिफिट हवे असल्यास कास्ट सर्टिफिकेटची अचूक नोंद अर्जात करावी."
      ],
      guidelinesHI: [
        "Part-1 (पंजीकरण) 10वीं का परिणाम घोषित होने के तुरंत बाद भरा जाना चाहिए।",
        "Option Form (Part-2) में अपनी प्रतिशत के अनुसार सही कॉलेजों का चुनाव करें ताकि नाम लिस्ट में आ सके।",
        "आरक्षण का लाभ उठाने के लिए जाति प्रमाण पत्र की सही जानकारी आवेदन में भरें।"
      ]
    },
    {
      key: "iti-admission",
      title: "ITI Online Admission Process",
      titleMR: "ITI ऑनलाईन ऍडमिशन अर्ज",
      titleHI: "आईटीआई ऑनलाइन एडमिशन फॉर्म",
      description: "Online profile and options form submission for government & private ITI colleges.",
      descriptionMR: "विविध शासकीय व खाजगी आयटीआय (ITI) कोर्सेसच्या प्रवेशासाठी ऑनलाईन प्रोफाईल तयार करणे व ऑप्शन फॉर्म भरणे.",
      descriptionHI: "विभिन्न सरकारी और निजी आईटीआई (ITI) पाठ्यक्रमों में प्रवेश के लिए ऑनलाइन प्रोफाइल और विकल्प फॉर्म जमा करना।",
      serviceCharge: 80,
      mandatedDocs: ["aadhar", "marksheet", "photo", "signature"],
      fields: [
        { name: "itiTrade", label: "Preferred Trades", labelMR: "पसंतीचे ट्रेड्स आणि शाखा", labelHI: "पसंदीदा ट्रेड्स शाखा", placeholder: "e.g. Electrician, Fitter", placeholderMR: "उदा. इलेक्ट्रिशियन, फिटर, कॉम्प्युटर ऑपरेटर", placeholderHI: "उदा. इलेक्ट्रिशियन, फिटर", type: "text" },
        { name: "tenthPercentage", label: "10th Percentage Marks %", labelMR: "१०वीचे गुण / टक्केवारी", labelHI: "10वीं के अंक / प्रतिशत", placeholder: "e.g. 80%", placeholderMR: "उदा. ८२.४०%", placeholderHI: "उदा. ८२.४०%", type: "text" },
        { name: "district", label: "Preferred Districts", labelMR: "प्रवेश जिल्हा", labelHI: "प्रवेश जिला", placeholder: "e.g. Pune / Mumbai", placeholderMR: "उदा. पुणे / मुंबई", placeholderHI: "उदा. पुणे / मुंबई", type: "text" },
      ],
      eligibilityEN: "Minimum age 14 years. Passed 10th standard or 8th standard depending on the trade.",
      eligibilityMR: "वयोमर्यादा किमान १४ वर्षे पूर्ण असावी. १० वी किंवा ८ वी उत्तीर्ण संवर्ग ट्रेडनुसार पात्र.",
      eligibilityHI: "आयु सीमा कम से कम 14 वर्ष पूरी होनी चाहिए। पाठ्यक्रम के आधार पर 10वीं या 8वीं उत्तीर्ण होना आवश्यक है।",
      guidelinesEN: [
        "Double-check ITI trade preferences before locking options.",
        "Keep domicile, Aadhaar, and marksheets ready for document verification centers (FC)."
      ],
      guidelinesMR: [
        "ITI व्यवसायाचे पर्याय कुलूपबंद (लॉक) करण्यापूर्वी व्यवस्थित निवडून खात्री करा.",
        "कागदपत्रांच्या तपासणीसाठी रहिवासी स्वयंघोषणापत्र, आधार कार्ड आणि मार्कशीट्स जवळ ठेवावेत."
      ],
      guidelinesHI: [
        "विकल्पों को लॉक करने से पहले अपने पसंदीदा ट्रेड की अच्छी तरह से जांच और पुष्टि कर लें।",
        "सत्यापन प्रक्रिया के लिए मूल निवास, आधार कार्ड और मार्कशीट तैयार रखें।"
      ]
    },
    {
      key: "dpharm-admission",
      title: "D. Pharm Cap-Round admission Form",
      titleMR: "D. Pharm / फार्मसी पदविका ऍडमिशन फॉर्म",
      titleHI: "डी फार्मसी ऑनलाइन एडमिशन फॉर्म",
      description: "Admission forms for pharmacy diploma programs through competitive CAP rounds.",
      descriptionMR: "बारावी सायन्सनंतर औषधनिर्माण शास्त्र पदविकेच्या शासकीय व प्रायव्हेट कॉलेज कॅप राऊंड (CAP Round) प्रवेशासाठी अर्ज करणे.",
      descriptionHI: "12वीं साइंस के बाद फार्मेसी डिप्लोमा के सरकारी एवं निजी कॉलेज कैप राउंड (CAP Round) प्रवेश के लिए आवेदन।",
      serviceCharge: 120,
      mandatedDocs: ["aadhar", "marksheet", "photo", "signature"],
      fields: [
        { name: "pcmbCategory", label: "12th Group (PCM/PCB marks)", labelMR: "१२ वी ग्रुप (PCB / PCM गुण)", labelHI: "12वीं ग्रुप (PCB / PCM अंक)", placeholder: "e.g. PCB: 240/300", placeholderMR: "उदा. PCB: २४०/३००", placeholderHI: "उदा. PCB: २४०/३००", type: "text" },
        { name: "hscSchool", label: "12th College Name", labelMR: "१२ वी कॉलेजचे नाव", labelHI: "12वीं कॉलेज का नाम", placeholder: "e.g. Science Jr College", placeholderMR: "१२ वी कॉलेजचे नाव लिहा", placeholderHI: "12वीं कॉलेज का नाम लिखें", type: "text" },
        { name: "district", label: "CAP Region/District", labelMR: "पसंतीचा कॅप जिल्हा", labelHI: "पसंदीदा कैप जिला", placeholder: "e.g. Pune", placeholderMR: "उदा. पुणे / मुंबई", placeholderHI: "उदा. पुणे / मुंबई", type: "text" },
      ],
      eligibilityEN: "Passed 12th Science with Physics, Chemistry, and Biology (or Mathematics) in regular mode.",
      eligibilityMR: "१२ वी सायन्स उत्तीर्ण असावा; भौतिकशास्त्र, रसायनशास्त्र आणि जीवशास्त्र किंवा गणित विषय असणे बंधनकारक.",
      eligibilityHI: "12वीं विज्ञान वर्ग से उत्तीर्ण होना चाहिए; भौतिकी, रसायन विज्ञान और जीव विज्ञान/गणित होना आवश्यक है।",
      guidelinesEN: [
        "Obtain a certified Non-Creamy Layer document if claiming reserves.",
        "Upload HSC and SSC marksheets carefully with registration form."
      ],
      guidelinesMR: [
        "आरक्षण प्रवर्गातून लाभ हवा असल्यास चालू वर्षाचा नॉन-क्रिमिलेअर दाखला जोडावा.",
        "१० वी व १२ वी सायन्सचे गुण आणि बोर्ड निवडीची काळजीपूर्वक नोंद करावी."
      ],
      guidelinesHI: [
        "यदि आप आरक्षित वर्ग से हैं तो चालू वर्ष का नॉन-क्रीमी लेयर प्रमाणपत्र आवश्यक रूप से उपलब्ध कराएं।",
        "10वीं और 12वीं के अंक तथा बोर्ड चयन की सही प्रविष्टि फॉर्म में सुनिश्चित करें।"
      ]
    },
    {
      key: "cet-cell-form",
      title: "MHT-CET & other Entrance Forms",
      titleMR: "CET Cell ऑनलाईन सर्व फॉर्म्स (MHT-CET / MBA etc)",
      titleHI: "सीईटी ऑनलाइन फॉर्म (MHT-CET / MBA)",
      description: "State level entrance exam applications for Engineering, Pharmacy, and MBA courses.",
      descriptionMR: "महाराष्ट्र सामायिक परीक्षा (CET) द्वारे अभियांत्रिकी, औषधनिर्माण व कृषी अभ्यासक्रम प्रवेश परीक्षा अर्ज भरणे.",
      descriptionHI: "इंजीनियरिंग, फार्मेसी, कृषि, एमबीए और अन्य व्यावसायिक पाठ्यक्रमों के लिए सीईटी प्रवेश परीक्षा आवेदन भरना।",
      serviceCharge: 100,
      mandatedDocs: ["aadhar", "marksheet", "photo", "signature"],
      fields: [
        { name: "cetName", label: "CET Exam Name", labelMR: "सीईटी परीक्षेचे नाव", labelHI: "सीईटी परीक्षा का नाम", placeholder: "e.g. MHT-CET (PCM)", placeholderMR: "उदा. MHT-CET (PCM/PCB) / MBA-CET / B.Ed-CET", placeholderHI: "उदा. MHT-CET / MBA-CET", type: "text" },
        { name: "hscYear", label: "HSC Passing Year / Status", labelMR: "१२वी उत्तीर्ण वर्ष / सद्यस्थिती", labelHI: "12वीं परीक्षा उत्तीर्ण वर्ष", placeholder: "e.g. 2026 Appearing", placeholderMR: "उदा. २०२६ / अपीअरिंग", placeholderHI: "उदा. २०२६ / अपीयरिंग", type: "text" },
        { name: "casteCategory", label: "Caste / Category", labelMR: "जातीचा प्रवर्ग (Caste)", labelHI: "श्रेणी (जाति)", placeholder: "e.g. OBC / OPEN", placeholderMR: "उदा. OPEN / OBC / SC / ST / EWS", placeholderHI: "उदा. SC / ST / OBC / EWS", type: "text" },
      ],
      eligibilityEN: "Appearing or passed HSC (12th Science) for MHT-CET, or Graduate for professional postgrad exams.",
      eligibilityMR: "१२ वी सायन्स चालू असणारे (Appearing) किंवा उत्तीर्ण झालेले विद्यार्थी MHT-CET साठी पात्र.",
      eligibilityHI: "12वीं विज्ञान की परीक्षा देने वाले या उत्तीर्ण छात्र एमएचटी-सीईटी के लिए पात्र हैं।",
      guidelinesEN: [
        "Ensure group selection (such as PCM, PCB, or both) is filled as per career path.",
        "Signature & Passport photo must matches the official size."
      ],
      guidelinesMR: [
        "करिअर निवडीनुसार अचूक ग्रुप (PCM किंवा PCB किंवा दोन्ही) काळजीपूर्वक निवडावा.",
        "दिलेला ईमेल आयडी आणि मोबाईल नंबर परीक्षा पूर्ण होईपर्यंत चालू ठेवावा."
      ],
      guidelinesHI: [
        "अपने करियर के अनुसार सही ग्रुप (PCM या PCB या दोनों) को ध्यान से चुनें।",
        "फॉर्म में दिया गया ईमेल और मोबाइल नंबर परीक्षा संपन्न होने तक सक्रिय रखें।"
      ]
    },
  ];

  const farmerServices: ServiceItem[] = [
    {
      key: "pm-kisan-yojana",
      title: "PM Kisan Registration & KYC",
      titleMR: "पीएम किसान योजनाव्यतिरिक्त केवायसी / नवीन नोंदणी",
      titleHI: "पीएम किसान पंजीकरण और ई-केवाईसी",
      description: "Get Rs.6000 support annually by doing official eKYC or registering new farmers.",
      descriptionMR: "पंतप्रधान किसान सन्मान निधीचे वार्षिक ६०००/- रुपये हते खात्यात येण्यासाठी केवायसी करणे किंवा नवीन शेतकऱ्याच्या नावावर अर्ज करणे.",
      descriptionHI: "प्रधानमंत्री किसान सम्मान निधि के तहत सालाना 6000/- रुपये सीधे पाने के लिए ई-केवाईसी करना या नया आवेदन।",
      serviceCharge: 50,
      mandatedDocs: ["aadhar"],
      fields: [
        { name: "farmerAadhar", label: "Farmer Aadhaar No", labelMR: "शेतकऱ्याचा आधार नंबर", labelHI: "किसान का आधार नंबर", placeholder: "12-digit Aadhaar", placeholderMR: "उदा. १२ अंकी आधार नंबर", placeholderHI: "उदा. १२ अंकी आधार नंबर", type: "text" },
        { name: "mobileLinked", label: "Aadhaar Linked Mobile No", labelMR: "आधार लिंक असलेला मोबाईल", labelHI: "आधार लिंक मोबाइल नंबर", placeholder: "Aadhaar linked phone", placeholderMR: "उदा. ९०११xxxxxx", placeholderHI: "उदा. ९०११xxxxxx", type: "text" },
        { name: "satbaraDetails", label: "Land Khata & Survey No", labelMR: "७/१२ खाते आणि गट क्रमांक", labelHI: "7/12 खाता और गट नंबर", placeholder: "Khata and Gut No", placeholderMR: "खाते क्रमांक आणि गट नंबर लिहा", placeholderHI: "खाता नंबर और गट नंबर लिखें", type: "text" },
      ],
      eligibilityEN: "Small and marginal farmers holding cultivable agricultural land in their name.",
      eligibilityMR: "अल्पभूधारक शेतकरी ज्यांच्या नावावर स्वतःची लागवडीयोग्य शेतजमीन सातबारा उताऱ्यावर नोंदणीकृत आहे.",
      eligibilityHI: "छोटे और मध्यम किसान जिनके नाम कृषि योग्य भूमि सरकारी रिकॉर्ड (7/12) में दर्ज है।",
      guidelinesEN: [
        "Farmer's name on Aadhaar card should match land records (Satbara) exactly.",
        "Mobile must be active to receive OTP from the PM-Kisan portal.",
        "Bank account must be seeded with Aadhaar and Aadhaar Payment Bridge System (APBS) active."
      ],
      guidelinesMR: [
        "शेतकऱ्याचे आधारवरील नाव आणि जमिनीच्या सातबारा वरील नावामध्ये साधर्म्य असायला हवे.",
        "प्रधानमंत्री किसान पोर्टलवरून ओटीपी प्राप्त करण्यासाठी दिलेला शेतकरी मोबाईल चालू असावा.",
        "बँक खाते आधार कार्डाशी तसेच NPCI पेमेंट गेटवे प्रणालीशी जोडलेले असावे."
      ],
      guidelinesHI: [
        "किसान का आधार कार्ड पर नाम और जमीन के 7/12 रिकॉर्ड का नाम मेल खाना चाहिए।",
        "पोर्टल से ओटीपी प्राप्त करने के लिए आधार से जुड़ा मोबाइल पास होना आवश्यक है।",
        "बैंक खाता आधार और एनपीसीआई पेमेंट मैपिंग के साथ सक्रिय होना चाहिए।"
      ]
    },
    {
      key: "kcc-yojana",
      title: "Kisan Credit Card (KCC Loan)",
      titleMR: "किसान क्रेडिट कार्ड ऑनलाईन अर्ज (KCC)",
      titleHI: "किसान क्रेडिट कार्ड ऑनलाइन आवेदन",
      description: "Low-interest (4%) crop loans for farmers in national banks using digital KCC.",
      descriptionMR: "शेतकऱ्यांसाठी ४% व्याजाने शेती पीक कर्ज घेण्यासाठी राष्ट्रीयकृत बँकांमध्ये किसान क्रेडिट कार्ड मंजूर करून देणे.",
      descriptionHI: "किसानों को केवल 4% ब्याज पर अल्पकालिक कृषि ऋण दिलाने के लिए किसान क्रेडिट कार्ड के लिए ऑनलाइन आवेदन।",
      serviceCharge: 80,
      mandatedDocs: ["aadhar", "pan", "income"],
      fields: [
        { name: "bankName", label: "Preferred Bank for Loan", labelMR: "ज्या बँकेत पीक कर्ज हवे त्याचे नाव", labelHI: "पसंदीदा बैंक का नाम", placeholder: "e.g. SBI, Bank of Maharashtra", placeholderMR: "उदा. स्टेट बँक ऑफ इंडिया / बँक ऑफ महाराष्ट्र", placeholderHI: "उदा. स्टेट बैंक ऑफ इंडिया", type: "text" },
        { name: "landSize", label: "Total Land Size (Acres)", labelMR: "जमिनीचे क्षेत्रफळ (एकर)", labelHI: "कुल भूमि का आकार (एकड़)", placeholder: "e.g. 2.5 Acres", placeholderMR: "उदा. २.५ एकर (जिरायत / बागायत)", placeholderHI: "उदा. २.५ एकड़", type: "text" },
      ],
      eligibilityEN: "Individual or joint cultivator farmers, tenant farmers, and sharecroppers.",
      eligibilityMR: "स्वतः शेती करणारे मालक शेतकरी किंवा भाडेतत्त्वावर शेती करणारे/भागीदार शेतकरी.",
      eligibilityHI: "खेती करने वाले भूमि मालिक या पट्टे पर खेती करने वाले किसान आवेदन के पात्र हैं।",
      guidelinesEN: [
        "Fill current loan liability limits if already borrowing from other cooperative banks.",
        "Submit clear 7/12 and 8A extracts issued in last 3 months."
      ],
      guidelinesMR: [
        "इतर कोणत्याही सोसायटी किंवा बँकेत शेतीवर थकीत कर्ज नसणे आवश्यक आहे.",
        "गेल्या ३ महिन्यांतील डिजिटल स्वाक्षरी असलेला ७/१२ आणि ८-अ उतारा जोडणे गरजेचे आहे."
      ],
      guidelinesHI: [
        "किसी अन्य सहकारी समिति या बैंक में कृषि पर कोई पुराना डिफ़ॉल्ट ऋण नहीं होना चाहिए।",
        "पिछले 3 महीनों के भीतर जारी किया गया डिजिटल हस्ताक्षरित 7/12 और 8A उतारा आवश्यक है।"
      ]
    },
    {
      key: "pik-vima",
      title: "Pradhan Mantri Crop Insurance (PMFBY)",
      titleMR: "पिक विमा ऑनलाईन नोंदणी (PMFBY / १ रुपया पिक विमा)",
      titleHI: "पीएम फसल बीमा ऑनलाइन (PMFBY - ₹1 में बीमा)",
      description: "Secure crop insurance at just Rs. 1 for crop loss due to state natural disasters.",
      descriptionMR: "नैसर्गिक आपत्तीमुळे पिकांचे नुकसान झाल्यास नुकसान भरपाई मिळण्यासाठी १ रुपयात किसान पिक विमा अर्ज सादर करणे.",
      descriptionHI: "प्राकृतिक आपदा से फसल नुकसान होने पर भरपाई पाने के लिए केवल १ रुपये के टोकन पर प्रधानमंत्री फसल बीमा ऑनलाइन रजिस्ट्रेशन।",
      serviceCharge: 50,
      mandatedDocs: ["aadhar"],
      fields: [
        { name: "cropName", label: "Main Crop Name", labelMR: "विमा काढायच्या मुख्य पिकाचे नाव", labelHI: "मुख्य फसल का नाम", placeholder: "e.g. Soybean, Cotton", placeholderMR: "उदा. सोयाबीन, कापूस, बाजरी, तूर, कांदा", placeholderHI: "उदा. सोयाबीन, कपास, बाजरा, प्याज", type: "text" },
        { name: "khataNo", label: "8A Account Number", labelMR: "८-अ खाते क्रमांक (Account No)", labelHI: "8A खाता नंबर", placeholder: "Account Number", placeholderMR: "उदा. खाते नंबर टाका", placeholderHI: "उदा. खाते नंबर लिखें", type: "text" },
        { name: "gutNo", label: "Land Survey / Gut No", labelMR: "७/१२ गट नंबर", labelHI: "7/12 गट नंबर", placeholder: "Survey Number", placeholderMR: "उदा. सर्व्हे नंबर टाका", placeholderHI: "उदा. गट नंबर लिखें", type: "text" },
      ],
      eligibilityEN: "Cultivating any notified crops in the official block during current Kharif or Rabi season.",
      eligibilityMR: "चालू हंगामात अधिसूचित पिकांची पेरणी करणारे सर्व शेतकरी (खरिप अथवा रब्बी हंगामानुसार).",
      eligibilityHI: "चालू खरीफ या रबी सीजन में अधिसूचित फसलों की बुवाई करने वाले सभी किसान भाई पात्र हैं।",
      guidelinesEN: [
        "Submit a signed self-declaration of sowing (पेरणी स्वयंघोषणापत्र) verified by local gram sevak/krishi sahayak.",
        "Submit correct bank details so compensation amount is paid instantly."
      ],
      guidelinesMR: [
        "पिकाच्या पेरणीचे स्वयंघोषणापत्र शेतकरी स्वाक्षरीसह किंवा ग्रामसेवक/कृषी सहाय्यकांच्या दाखल्यासह देणे गरजेचे आहे.",
        "भरलेला बँक खाते नंबर अचूक असावा जेणेकरून विम्याची मंजूर झालेली रक्कम त्वरित प्राप्त होईल."
      ],
      guidelinesHI: [
        "मुख्य फसल के बुवाई का स्व-घोषणा पत्र (पेरणी प्रमाणपत्र) सही हस्ताक्षरित जोड़ना अनिवार्य है।",
        "कृपया बैंक विवरण की दोबारा जांच कर लें ताकि बीमा राशि जमा होने में रुकावट न हो।"
      ]
    },
    {
      key: "farmer-mahadbt",
      title: "MahaDBT Farmer Welfare Subsidies",
      titleMR: "महाडीबीटी शेतकरी योजना (ट्रॅक्टर / ठिबक ठिबक संच / विहीर)",
      titleHI: "महाडीबीटी किसान योजना (ट्रैक्टर, टपक सिंचाई, कुआं)",
      description: "Subsidies for tractors, irrigation, farm machinery, and wells up to 80% cost.",
      descriptionMR: "नवीन विहीर मंजूर करणे, ८०% अनुदानावर ट्रॅक्टर, ठिबक सिंचन पाईपलाईन, फवारणी यंत्र यासाठी एकाच प्रोफाईलवर अर्ज भरणे.",
      descriptionHI: "नया कुआं, 80% सरकारी सब्सिडी पर ट्रैक्टर, टपक (ड्रिप) सिंचाई, पाइपलाइन, स्प्रे पंप प्राप्त करने के लिए आधार लिंक प्रोफाइल बनाना।",
      serviceCharge: 80,
      mandatedDocs: ["aadhar"],
      fields: [
        { name: "subsidySchemeName", label: "Demanded Scheme / Equipment", labelMR: "हवी असणारी योजना / अवजार", labelHI: "चाहिए वह योजना / कृषि यंत्र", placeholder: "e.g. Tractor / Well / Drip", placeholderMR: "उदा. ठिबक सिंचन / नवीन विहीर / ट्रॅक्टर", placeholderHI: "उदा. ड्रिप सिंचाई / नया कुआं / ट्रैक्टर", type: "text" },
        { name: "villageName", label: "Farmer Village & Taluka", labelMR: "शेतकऱ्याचे गाव आणि तालुका", labelHI: "किसान का गांव और तालुका", placeholder: "Village Name", placeholderMR: "उदा. तुमचे गाव, तालुका", placeholderHI: "उदा. आपका गांव, तालुका", type: "text" },
      ],
      eligibilityEN: "Must own agriculture land. Must have active electricity connection (for water pump subsidies). No previous subsidy benefit in 7 years.",
      eligibilityMR: "शेतकऱ्याकडे शेतजमीन असणे गरजेचे आहे. सिंचन योजनांसाठी विहीर किंवा नदी/तलाव स्त्रोत असणे आवश्यक.",
      eligibilityHI: "किसान के पास कृषि योग्य भूमि होनी चाहिए। सिंचाई के साधनों के लिए पानी का स्रोत या कुआं होना आवश्यक है।",
      guidelinesEN: [
        "Make only one unified registration profile on MahaDBT portal.",
        "Lucky draws occur automatically monthly; selected farmers must upload purchase bills within 30 days."
      ],
      guidelinesMR: [
        "महाडीबीटी शेतकरी पोर्टलवर एकच युनिफाइड प्रोफाईल तयार केली जाईल, वेगवेगळ्या योजनेसाठी पुन्हा अर्जाची गरज लागत नाही.",
        "शासनाकडून दरमहा संगणकीय सोडत (Lucky Draw) जाहीर होते. निवड झाल्यास खरेदी बिल ३० दिवसांत दाखल करावे लागेल."
      ],
      guidelinesHI: [
        "महाडीबीटी किसान पोर्टल पर केवल एक एकीकृत प्रोफाइल बनाई जाएगी, ताकि सभी योजनाओं में सीधे भाग ले सकें।",
        "महीने के अंत में कंप्यूटर लॉटरी होती है; चयन होने पर कृषि यंत्र का बिल 30 दिनों में जमा करना होगा।"
      ]
    }
  ];

  const otherServices: ServiceItem[] = [
    {
      key: "new-pan-card",
      title: "New PAN Card Registration",
      titleMR: "नवीन पॅन कार्ड काढणे किंवा दुरुस्ती (PAN Card)",
      titleHI: "नया पैन कार्ड पंजीकरण या सुधार",
      description: "Instant online e-PAN card generation and PVC card delivery at home within 15 days.",
      descriptionMR: "मोबाईल नंबर आधार कार्डाशी लिंक असल्यास १० मिनिटांत ई-पॅन कार्ड आणि १५ दिवसांत घरपोच प्लास्टिक पॅन कार्ड बनवून मिळेल.",
      descriptionHI: "आधार से मोबाइल नंबर लिंक होने पर 10 मिनट में डिजिटल पैन और 15 दिनों में डाक से प्लास्टिक पैन कार्ड घर पहुंचेगा।",
      serviceCharge: 150,
      mandatedDocs: ["aadhar", "photo", "signature"],
      fields: [
        { name: "full_name", label: "Full Name on PAN", labelMR: "पॅन कार्डवरील पूर्ण नाव (English)", labelHI: "पैन कार्ड पर पूरा नाम (अंग्रेजी)", placeholder: "Full name in English CAPITAL letters", placeholderMR: "पॅन कार्डवर हवे असलेले नाव लिहा", placeholderHI: "पैन कार्ड पर वांछित नाम लिखें", type: "text" },
        { name: "father_name", label: "Father's Full Name", labelMR: "वडिलांचे नाव", labelHI: "पिता का पूरा नाम", placeholder: "Father's name in English", placeholderMR: "उदा. वडिलांचे पूर्ण नाव", placeholderHI: "उदा. पिता का नाम लिखें", type: "text" },
      ],
      eligibilityEN: "Indian citizens of any age group.",
      eligibilityMR: "सर्व भारतीय नागरिक. कोणतीही वयोमर्यादा नाही (लहान बालकांचे देखील मायनर पॅन कार्ड काढता येते).",
      eligibilityHI: "सभी भारतीय नागरिक आवेदन कर सकते हैं। इसके लिए कोई न्यूनतम आयु सीमा नहीं है।",
      guidelinesEN: [
        "Ensure your Aadhaar is updated and the spelling of your name/birthdate matches exactly.",
        "Your Aadhaar must be linked to an active mobile phone to verify sign-off via e-Signature OTP."
      ],
      guidelinesMR: [
        "तुमच्या आधार कार्डावरील नावाची स्पेलिंग आणि जन्मतारीख योग्य असल्याची खात्री करा.",
        "ई-स्वाक्षरी (e-Sign) प्रमाणित करण्यासाठी आधार लिंक असलेला मोबाईल नंबर चालू असावा ज्यावर शेवटी ओटीपी येईल."
      ],
      guidelinesHI: [
        "आपके आधार कार्ड पर नाम की स्पेलिंग और जन्मतिथि पूरी तरह सही होनी चाहिए।",
        "डिजिटल साइन (e-Sign) के लिए आधार से जुड़ा मोबाइल चालू होना चाहिए जिसपर ओटीपी भेजा जाएगा।"
      ]
    },
    {
      key: "ayushman-card",
      title: "Ayushman Bharat Golden Card",
      titleMR: "आयुष्मान भारत गोल्डन कार्ड काढणे (₹५ लाख आरोग्य विमा)",
      titleHI: "आयुष्मान भारत गोल्डन कार्ड (₹5 लाख मुफ्त इलाज)",
      description: "Receive free healthcare hospitalization cover up to Rs. 5 Lakhs per family.",
      descriptionMR: "केंद्र शासनाचा आयुष्मान भारत योजने अंतर्गत ५,००,०००/- रुपयांचा मोफत शस्त्रक्रिया आणि उपचाराचा सुरक्षा कार्ड मिळविणे.",
      descriptionHI: "केंद्र सरकार की इस योजना के तहत सरकारी और निजी अस्पतालों में ₹5 लाख तक का सालाना मुफ्त इलाज कार्ड प्राप्त करें।",
      serviceCharge: 50,
      mandatedDocs: ["aadhar"],
      fields: [
        { name: "rationCardNo", label: "12-digit Ration Card No", labelMR: "शिधापत्रिका नंबर (Ration Card No)", labelHI: "राशन कार्ड नंबर", placeholder: "Ration Card number", placeholderMR: "उदा. रेशन कार्ड नंबर लिहा", placeholderHI: "उदा. राशन कार्ड नंबर लिखें", type: "text" },
      ],
      eligibilityEN: "Families listed in SECC-2011 social census database or orange/yellow Ration Card holders under National Food Security Act (NFSA).",
      eligibilityMR: "SECC-2011 सामाजिक आर्थिक जनगणनेत कुटुंब नोंदणी किंवा अन्न सुरक्षा कायदा अंतर्गत पिवळे / केशरी रेशन कार्डधारक कुटुंब.",
      eligibilityHI: "SECC-2011 सामाजिक-आर्थिक सर्वे सूची में शामिल परिवार या खाद्य सुरक्षा योजना के पीले/केसरी राशन कार्ड धारक।",
      guidelinesEN: [
        "Keep your original Aadhaar card and active connected mobile nearby for fingerprint/OTP authentication.",
        "This is an official paperless card which is instant downloaded after verification."
      ],
      guidelinesMR: [
        "फिंगरप्रिंट किंवा आयरीस किंवा मोबाईल ओटीपी द्वारे पडताळणी करण्यासाठी प्रत्येकाचे मूळ आधार कार्ड हजर असावे.",
        "हा पूर्णपणे डिजिटल सोनेरी प्रकृती सरकारी पास आहे जो पडताळणी झाल्यावर त्वरित मोबाईलवर डाऊनलोड होईल."
      ],
      guidelinesHI: [
        "सत्यापन के लिए आधार कार्ड और आधार से लिंक मोबाइल नंबर या परिवार के सदस्यों की उपस्थिति जरूरी है।",
        "यह एक पूर्णतः डिजिटल स्वास्थ्य बीमा योजना कार्ड है जो सत्यापन के तुरंत बाद डाउनलोड किया जा सकता है।"
      ]
    }
  ];

  const services =
    category === "student"
      ? studentServices
      : category === "farmer"
      ? farmerServices
      : otherServices;

  const currentIcon =
    category === "student" ? (
      <GraduationCap className="w-5 h-5 text-rose-600" />
    ) : category === "farmer" ? (
      <Sprout className="w-5 h-5 text-emerald-600" />
    ) : (
      <CreditCard className="w-5 h-5 text-amber-600" />
    );

  return (
    <div className="space-y-6">
      {/* Dynamic Title */}
      <div className="border-b border-rose-100 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            {currentIcon}
            {category === "student" && t.studentHeader}
            {category === "farmer" && t.farmerHeader}
            {category === "other" && t.otherHeader}
          </h2>
          <p className="text-xs text-gray-500 mt-1 font-semibold leading-relaxed">
            {category === "student" && t.studentSub}
            {category === "farmer" && t.farmerSub}
            {category === "other" && t.otherSub}
          </p>
        </div>
      </div>

      {/* Warning regarding Aaple Sarkar certificates (no income, caste, domiciles as requested!) */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-extrabold text-amber-800">{t.warningTitle}</span>
          <p className="text-amber-700 font-bold mt-1 leading-relaxed">
            {t.warningBody}
          </p>
        </div>
      </div>

      {/* Services Grid with Expandable Accordion Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map((srv) => {
          const isExpanded = expandedSrvKey === srv.key;
          const currentTitle = lang === "mr" ? srv.titleMR : lang === "hi" && srv.titleHI ? srv.titleHI : srv.title;
          const currentDesc = lang === "mr" ? srv.descriptionMR : lang === "hi" && srv.descriptionHI ? srv.descriptionHI : srv.description;
          const currentEligibility = lang === "mr" ? srv.eligibilityMR : lang === "hi" ? srv.eligibilityHI : srv.eligibilityEN;
          const currentGuidelines = lang === "mr" ? srv.guidelinesMR : lang === "hi" ? srv.guidelinesHI : srv.guidelinesEN;

          return (
            <div
              key={srv.key}
              onClick={() => toggleExpand(srv.key)}
              className={`rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col ${
                isExpanded ? "justify-start" : "justify-between"
              } ${
                isExpanded
                  ? "bg-rose-50/10 border-rose-400 shadow-md ring-1 ring-rose-200"
                  : "bg-white border-gray-200 hover:border-rose-300 hover:shadow-sm"
              }`}
              id={`service-row-${srv.key}`}
            >
              {/* Basic card summary view */}
              <div className={`p-5 flex flex-col justify-between ${isExpanded ? "h-auto" : "h-full"} space-y-4`}>
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-black text-base md:text-md text-gray-950 leading-snug">
                      {currentTitle}
                    </h3>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-lg border border-emerald-100 shrink-0">
                      ₹{srv.serviceCharge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed mt-2.5">
                    {currentDesc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-[10px] text-rose-700 font-extrabold flex items-center gap-1">
                    <Info className="w-3.5 h-3.5" />
                    {isExpanded ? t.viewLess : t.viewMore}
                  </span>
                  <div className="bg-rose-100/40 p-1.5 rounded-lg text-rose-700 border border-rose-200/50">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Collapsible Details Content */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    onClick={(e) => e.stopPropagation()} // stop toggle on child clicks
                    className="overflow-hidden border-t border-rose-100 bg-gray-50/50"
                  >
                    <div className="p-5 space-y-5 text-xs">
                      {/* Criteria Panel */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                        <h4 className="font-extrabold text-gray-900 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-rose-500" />
                          {t.eligibilityTitle}
                        </h4>
                        <p className="text-gray-700 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          {currentEligibility}
                        </p>
                      </div>

                      {/* Required Documents Wallet attachment */}
                      <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-200">
                        <span className="font-extrabold text-rose-800 block">
                          {t.docsLabel}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {srv.mandatedDocs.map((doc, idx) => (
                            <span
                              key={idx}
                              className="bg-rose-50/50 text-[10px] text-rose-750 font-bold px-2.5 py-1 rounded-lg border border-rose-100 capitalize"
                            >
                              {doc === "aadhar"
                                ? (lang === "mr" ? "आधार कार्ड" : lang === "hi" ? "आधार कार्ड" : "Aadhaar Card")
                                : doc === "marksheet"
                                ? (lang === "mr" ? "१०वी/१२वी बोर्ड प्रमाणपत्र" : lang === "hi" ? "10वीं/12वीं मार्कशीट" : "SSC/HSC Marksheet")
                                : doc === "income"
                                ? (lang === "mr" ? "उत्पन्न चालू दाखला" : lang === "hi" ? "आय प्रमाण पत्र" : "Income Certificate")
                                : doc === "photo"
                                ? (lang === "mr" ? "पासपोर्ट फोटो" : lang === "hi" ? "पासपोर्ट फोटो" : "Passport Photo")
                                : doc === "signature"
                                ? (lang === "mr" ? "डिजिटल स्वाक्षरी" : lang === "hi" ? "हस्ताक्षर" : "Signature")
                                : (lang === "mr" ? "पॅन कार्ड" : lang === "hi" ? "पैन कार्ड" : "PAN Card")}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Guidelines Steps list */}
                      <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-200">
                        <h4 className="font-extrabold text-gray-900 flex items-center gap-1">
                          <ClipboardList className="w-4 h-4 text-emerald-600" />
                          {t.guidelinesTitle}
                        </h4>
                        <div className="space-y-1.5 pl-1 text-gray-700">
                          {currentGuidelines.map((guideline, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 font-medium leading-relaxed">
                              <span className="text-emerald-500 font-extrabold">✓</span>
                              <span>{guideline}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Target Fields preview list */}
                      <div className="space-y-2 bg-white p-4 rounded-2xl border border-gray-200">
                        <span className="font-extrabold text-gray-750 block">💡 {t.enterDetails}</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {srv.fields.map((f, idx) => {
                            const fieldLabel = lang === "mr" && f.labelMR ? f.labelMR : lang === "hi" && f.labelHI ? f.labelHI : f.label;
                            return (
                              <div key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex justify-between items-center text-slate-700">
                                <span className="font-semibold">{fieldLabel}</span>
                                <span className="text-[10px] font-bold text-slate-400 capitalize bg-slate-100 px-1.5 py-0.5 rounded">{f.type}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Apply trigger bar */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-gray-200">
                        <div className="text-gray-500 font-bold text-center sm:text-left">
                          <span>{t.totalCharge}: </span>
                          <span className="text-emerald-700 text-base font-black">₹{srv.serviceCharge} {t.rupees} /-</span>
                        </div>
                        <button
                          onClick={() => onApplyService(srv)}
                          className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-black text-xs px-6 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
                          id={`apply-sub-btn-${srv.key}`}
                        >
                          <Smartphone className="w-4 h-4 text-white" />
                          <span>{t.applyBtn}</span>
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
