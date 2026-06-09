export interface UserDocuments {
  aadharUrl?: string;
  aadharName?: string;
  panUrl?: string;
  panName?: string;
  marksheetUrl?: string;
  marksheetName?: string;
  photoUrl?: string;
  photoName?: string;
  signatureUrl?: string;
  signatureName?: string;
  incomeUrl?: string;
  incomeName?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  email: string;
  photoUrl?: string;
  joinedAt: string;
  documents: UserDocuments;
}

export interface JobPost {
  id: string;
  title: string; // English
  titleMR: string; // Marathi
  titleHI?: string; // Hindi
  department: string;
  departmentMR: string;
  departmentHI?: string;
  totalVacancies: number;
  posts: { name: string; nameMR?: string; nameHI?: string; vacancy: string }[];
  ageLimit: string;
  ageLimitMR?: string;
  ageLimitHI?: string;
  qualification: string;
  qualificationMR?: string;
  qualificationHI?: string;
  importantDocuments: string[];
  importantDocumentsMR?: string[];
  importantDocumentsHI?: string[];
  feeGeneral: number;
  feeReserved: number;
  serviceCharge: number;
  lastDate: string;
  startDate?: string;
  applyUrl?: string;
  description: string;
  descriptionMR?: string;
  descriptionHI?: string;
  whatsappMessage?: string;
}

export interface Announcement {
  id: string;
  title: string;
  titleMR?: string;
  titleHI?: string;
  type: "new" | "deadline" | "important";
  date: string;
}

export interface FormApplication {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  category: "student" | "farmer" | "other" | "job";
  formKey: string;
  formTitle: string;
  appliedAt: string;
  updatedAt: string;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  paymentStatus: "Pending" | "Paid";
  paymentScreenshotUrl?: string;
  customDetails: { [key: string]: string };
  feedback?: string;
  resultUrl?: string; // Filled form or receipt file
  documents: { [key: string]: string }; // Map docType -> URL
}

export interface ServiceItem {
  key: string;
  title: string;
  titleMR: string;
  titleHI: string;
  description: string;
  descriptionMR: string;
  descriptionHI: string;
  serviceCharge: number;
  mandatedDocs: string[];
  fields: { name: string; label: string; labelMR?: string; labelHI?: string; placeholder: string; placeholderMR?: string; placeholderHI?: string; type: string }[];
  eligibilityEN: string;
  eligibilityMR: string;
  eligibilityHI: string;
  guidelinesEN: string[];
  guidelinesMR: string[];
  guidelinesHI: string[];
}

export interface JobSubscription {
  id: string;
  name: string;
  mobile: string;
  email: string;
  qualification: string; // e.g., "all" | "10th" | "12th" | "diploma" | "degree"
  channels: ("whatsapp" | "email" | "sms" | "push")[];
  subscribedAt: string;
}

