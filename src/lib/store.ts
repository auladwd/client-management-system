import { encryptData, decryptData, EncryptedPayload } from "./encryption";

export interface MockClient {
  _id: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  division: string;
  district: string;
  upazila: string;
  appType: string;
  vercelUrl: string;
  customDomain?: string;
  githubRepo?: string;
  status: "active" | "in_progress" | "maintenance" | "suspended";
  notes?: string;
  assignedRepCode?: string;
  createdAt: string;
}

export interface MockVault {
  _id: string;
  clientId: string;
  clientName: string;
  dedicatedEmail: string;
  recoveryEmail?: string;
  recoveryPhone?: string;
  encryptedData: string;
  iv: string;
  authTag: string;
  updatedAt: string;
}

export interface MockPayment {
  _id: string;
  clientId: string;
  clientName: string;
  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: "paid" | "partial" | "unpaid";
  installments: {
    id: string;
    date: string;
    amount: number;
    method: "bKash" | "Nagad" | "Rocket" | "Bank" | "Cash";
    trxId: string;
    note?: string;
  }[];
  dueDate?: string;
  createdAt: string;
}

export interface MockMaintenance {
  _id: string;
  clientId: string;
  clientName: string;
  issueTitle: string;
  description: string;
  severity: "low" | "medium" | "critical";
  status: "pending" | "in_progress" | "resolved";
  solutionNotes?: string;
  screenshotUrl?: string;
  reportedAt: string;
  resolvedAt?: string;
}

export interface MockRepresentative {
  _id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  division: string;
  district: string;
  upazila: string;
  nidNumber: string;
  nidPhotoUrl?: string;
  repCode: string;
  commissionType: "fixed" | "percentage";
  commissionValue: number;
  totalSalesCount: number;
  totalCommissionEarned: number;
  commissionPaid: number;
  commissionDue: number;
  payoutMethod: string;
  status: "active" | "inactive";
}

export interface MockBroadcast {
  _id: string;
  title: string;
  message: string;
  targetAudience: "all" | "division" | "district";
  targetValue?: string;
  channel: "whatsapp" | "telegram" | "in_app";
  sentAt: string;
  recipientsCount: number;
}

// Initial Seeds
const initialClients: MockClient[] = [
  {
    _id: "client-1",
    name: "Al-Noor Model High School",
    ownerName: "মাস্টার রফিকুল ইসলাম",
    phone: "01711223344",
    email: "alnoor.school.bd@gmail.com",
    division: "Dhaka",
    district: "Dhaka",
    upazila: "Savar",
    appType: "School Management",
    vercelUrl: "https://alnoor-school.vercel.app",
    customDomain: "https://alnoorschool.edu.bd",
    githubRepo: "https://github.com/aulad-it/alnoor-school-app",
    status: "active",
    notes: "স্টুডেন্ট রেজাল্ট, ফি কালেকশন ও এসএমএস সিস্টেম চালু আছে।",
    assignedRepCode: "REP-DHK-01",
    createdAt: "2026-03-01T10:00:00.000Z",
  },
  {
    _id: "client-2",
    name: "Metro Fashion BD",
    ownerName: "কামরুল হাসান",
    phone: "01819887766",
    email: "metrofashion.ctg@gmail.com",
    division: "Chattogram",
    district: "Chattogram",
    upazila: "Patiya",
    appType: "E-Commerce",
    vercelUrl: "https://metrofashion-bd.vercel.app",
    customDomain: "https://metrofashionbd.com",
    githubRepo: "https://github.com/aulad-it/metro-fashion-store",
    status: "active",
    notes: "অনলাইন অর্ডার, বিকাশ পেমেন্ট ও ইনভেন্টরি ট্র্যাকিং যুক্ত।",
    assignedRepCode: "REP-CTG-01",
    createdAt: "2026-03-05T12:30:00.000Z",
  },
  {
    _id: "client-3",
    name: "CarePoint Diagnostic Center",
    ownerName: "ডাঃ তানভীর আহমেদ",
    phone: "01912345678",
    email: "carepoint.sylhet@gmail.com",
    division: "Sylhet",
    district: "Sylhet",
    upazila: "Sylhet Sadar",
    appType: "Hospital & Diagnostic",
    vercelUrl: "https://carepoint-diag.vercel.app",
    customDomain: "",
    githubRepo: "https://github.com/aulad-it/carepoint-portal",
    status: "in_progress",
    notes: "ডাক্তার অ্যাপয়েন্টমেন্ট ও প্যাথলজি রিপোর্ট ডেলিভারি মডিউল তৈরি হচ্ছে।",
    assignedRepCode: "REP-SYL-01",
    createdAt: "2026-03-10T14:15:00.000Z",
  },
  {
    _id: "client-4",
    name: "Bismillah Hardware & Sanitary",
    ownerName: "মোঃ জাকির হোসেন",
    phone: "01622334455",
    email: "bismillah.hardware.bogura@gmail.com",
    division: "Rajshahi",
    district: "Bogura",
    upazila: "Bogura Sadar",
    appType: "POS & Inventory",
    vercelUrl: "https://bismillah-hardware-pos.vercel.app",
    customDomain: "",
    githubRepo: "https://github.com/aulad-it/bismillah-pos",
    status: "maintenance",
    notes: "বারকোড স্ক্যানার এবং মেমো প্রিন্টিং সাইজ আপডেট করা প্রয়োজন।",
    assignedRepCode: "REP-RAJ-01",
    createdAt: "2026-03-08T09:00:00.000Z",
  },
];

// Helper to encrypt sample vault
function createEncryptedVault(
  id: string,
  clientId: string,
  clientName: string,
  email: string,
  recEmail: string,
  recPhone: string,
  data: Record<string, string>
): MockVault {
  const enc: EncryptedPayload = encryptData(data);
  return {
    _id: id,
    clientId,
    clientName,
    dedicatedEmail: email,
    recoveryEmail: recEmail,
    recoveryPhone: recPhone,
    encryptedData: enc.encryptedData,
    iv: enc.iv,
    authTag: enc.authTag,
    updatedAt: new Date().toISOString(),
  };
}

const initialVaults: MockVault[] = [
  createEncryptedVault(
    "vault-1",
    "client-1",
    "Al-Noor Model High School",
    "alnoor.school.bd@gmail.com",
    "aulad.recovery@gmail.com",
    "01700000000",
    {
      gmailPassword: "AppPassword_alnoor#2026",
      mongodbUri: "mongodb+srv://alnoor_admin:Pass4567@cluster0.alnoor.mongodb.net/school_db?retryWrites=true&w=majority",
      mongodbUser: "alnoor_admin",
      mongodbPassword: "Pass4567_mongoSecure",
      firebaseProjectId: "alnoor-school-live",
      firebaseApiKey: "AIzaSyD-AlNoorWebApiKey2026LiveKey",
      firebaseAuthDomain: "alnoor-school-live.firebaseapp.com",
      cloudinaryCloudName: "alnoor-school-cloud",
      cloudinaryApiKey: "492837194829103",
      cloudinaryApiSecret: "XyZ89_CloudinarySecretAlNoor",
      vercelProjectId: "prj_alnoor2026vercel",
      vercelToken: "vcl_token_live_alnoor_secure",
      notes: "পাসওয়ার্ড পরিবর্তন হলে ব্যাকআপ ইমেইলে রিকভারি কোড যাবে।",
    }
  ),
  createEncryptedVault(
    "vault-2",
    "client-2",
    "Metro Fashion BD",
    "metrofashion.ctg@gmail.com",
    "aulad.recovery@gmail.com",
    "01700000000",
    {
      gmailPassword: "AppPassword_metro#9988",
      mongodbUri: "mongodb+srv://metro_store:Ecom9988@cluster0.metro.mongodb.net/ecommerce_db?retryWrites=true&w=majority",
      mongodbUser: "metro_store",
      mongodbPassword: "Ecom9988_MongoSecret",
      firebaseProjectId: "metrofashion-bd-auth",
      firebaseApiKey: "AIzaSyD-MetroFashionKey9988",
      firebaseAuthDomain: "metrofashion-bd-auth.firebaseapp.com",
      cloudinaryCloudName: "metro-cdn",
      cloudinaryApiKey: "918237461928374",
      cloudinaryApiSecret: "Secret_Metro_Cloud_Prod",
      vercelProjectId: "prj_metrofashion2026",
      vercelToken: "vcl_token_live_metro",
      notes: "ক্লাউডিনারিতে প্রোডাক্ট ছবি সেভ হচ্ছে।",
    }
  ),
];

const initialPayments: MockPayment[] = [
  {
    _id: "pay-1",
    clientId: "client-1",
    clientName: "Al-Noor Model High School",
    invoiceNumber: "INV-2026-001",
    totalAmount: 25000,
    paidAmount: 20000,
    dueAmount: 5000,
    status: "partial",
    installments: [
      {
        id: "inst-1",
        date: "2026-03-01",
        amount: 15000,
        method: "Bank",
        trxId: "IBBL-TRX-9948271",
        note: "এডভান্স বুকিং ফি",
      },
      {
        id: "inst-2",
        date: "2026-03-08",
        amount: 5000,
        method: "bKash",
        trxId: "9K8L2M3N4P",
        note: "ডেপ্লয়মেন্ট পেমেন্ট",
      },
    ],
    dueDate: "2026-03-25",
    createdAt: "2026-03-01T10:00:00.000Z",
  },
  {
    _id: "pay-2",
    clientId: "client-2",
    clientName: "Metro Fashion BD",
    invoiceNumber: "INV-2026-002",
    totalAmount: 18000,
    paidAmount: 18000,
    dueAmount: 0,
    status: "paid",
    installments: [
      {
        id: "inst-3",
        date: "2026-03-05",
        amount: 10000,
        method: "bKash",
        trxId: "BKASH-TRX-551122",
        note: "এডভান্স ৫০%",
      },
      {
        id: "inst-4",
        date: "2026-03-09",
        amount: 8000,
        method: "Nagad",
        trxId: "NAGAD-TRX-883344",
        note: "সম্পূর্ণ পরিশোধ",
      },
    ],
    dueDate: "2026-03-10",
    createdAt: "2026-03-05T12:30:00.000Z",
  },
  {
    _id: "pay-3",
    clientId: "client-3",
    clientName: "CarePoint Diagnostic Center",
    invoiceNumber: "INV-2026-003",
    totalAmount: 30000,
    paidAmount: 12000,
    dueAmount: 18000,
    status: "partial",
    installments: [
      {
        id: "inst-5",
        date: "2026-03-10",
        amount: 12000,
        method: "Bank",
        trxId: "CITY-TRX-771199",
        note: "বুকিং মানি",
      },
    ],
    dueDate: "2026-03-30",
    createdAt: "2026-03-10T14:15:00.000Z",
  },
  {
    _id: "pay-4",
    clientId: "client-4",
    clientName: "Bismillah Hardware & Sanitary",
    invoiceNumber: "INV-2026-004",
    totalAmount: 15000,
    paidAmount: 5000,
    dueAmount: 10000,
    status: "partial",
    installments: [
      {
        id: "inst-6",
        date: "2026-03-08",
        amount: 5000,
        method: "bKash",
        trxId: "BKASH-TRX-112233",
        note: "টোকেন অ্যাডভান্স",
      },
    ],
    dueDate: "2026-03-20",
    createdAt: "2026-03-08T09:00:00.000Z",
  },
];

const initialMaintenance: MockMaintenance[] = [
  {
    _id: "maint-1",
    clientId: "client-1",
    clientName: "Al-Noor Model High School",
    issueTitle: "এসএমএস ওটিপি সেন্ড হচ্ছে না",
    description: "শিক্ষার্থীদের রেজাল্ট পাবলিশের পর অভিভাবকদের মোবাইলে এসএমএস যায়নি।",
    severity: "critical",
    status: "resolved",
    solutionNotes: "এসএমএস গেটওয়ের ব্যালেন্স শেষ হয়ে গিয়েছিল এবং এপিআই কি এক্সপায়ার ছিল। নতুন এপিআই কি রিনিউ করে ভ্যারিয়েবল আপডেট করা হয়েছে।",
    reportedAt: "2026-03-06",
    resolvedAt: "2026-03-06",
  },
  {
    _id: "maint-2",
    clientId: "client-4",
    clientName: "Bismillah Hardware & Sanitary",
    issueTitle: "থার্মাল প্রিন্টারে বাংলা লেখা ভেঙে যাচ্ছে",
    description: "POS মেমো প্রিন্ট দিলে বাংলা ফন্ট ঠিকমতো লোড হচ্ছে না।",
    severity: "medium",
    status: "in_progress",
    solutionNotes: "কাস্টম সিএসএস ফন্ট-ফ্যামিলি এবং ESC/POS ড্রাইভার এনকোডিং utf-8 কনফিগার করা হচ্ছে।",
    reportedAt: "2026-03-11",
  },
];

const initialRepresentatives: MockRepresentative[] = [
  {
    _id: "rep-1",
    name: "হাসান মাহমুদ",
    phone: "01722334455",
    whatsapp: "8801722334455",
    email: "hasan.rep.dhaka@gmail.com",
    division: "Dhaka",
    district: "Dhaka",
    upazila: "Savar",
    nidNumber: "19942691234567890",
    repCode: "REP-DHK-01",
    commissionType: "fixed",
    commissionValue: 2000,
    totalSalesCount: 1,
    totalCommissionEarned: 2000,
    commissionPaid: 2000,
    commissionDue: 0,
    payoutMethod: "bKash: 01722334455",
    status: "active",
  },
  {
    _id: "rep-2",
    name: "আব্দুর রহিম",
    phone: "01833445566",
    whatsapp: "8801833445566",
    email: "rahim.ctg.rep@gmail.com",
    division: "Chattogram",
    district: "Chattogram",
    upazila: "Patiya",
    nidNumber: "19951591234567891",
    repCode: "REP-CTG-01",
    commissionType: "fixed",
    commissionValue: 1500,
    totalSalesCount: 1,
    totalCommissionEarned: 1500,
    commissionPaid: 1500,
    commissionDue: 0,
    payoutMethod: "Nagad: 01833445566",
    status: "active",
  },
  {
    _id: "rep-3",
    name: "ফয়সাল আহমেদ",
    phone: "01944556677",
    whatsapp: "8801944556677",
    email: "faysal.sylhet@gmail.com",
    division: "Sylhet",
    district: "Sylhet",
    upazila: "Sylhet Sadar",
    nidNumber: "19929191234567892",
    repCode: "REP-SYL-01",
    commissionType: "fixed",
    commissionValue: 2000,
    totalSalesCount: 1,
    totalCommissionEarned: 2000,
    commissionPaid: 1000,
    commissionDue: 1000,
    payoutMethod: "bKash: 01944556677",
    status: "active",
  },
  {
    _id: "rep-4",
    name: "তারেক জিয়াউর রহমান",
    phone: "01655667788",
    whatsapp: "8801655667788",
    email: "tarek.bogura@gmail.com",
    division: "Rajshahi",
    district: "Bogura",
    upazila: "Bogura Sadar",
    nidNumber: "19961091234567893",
    repCode: "REP-RAJ-01",
    commissionType: "fixed",
    commissionValue: 1500,
    totalSalesCount: 1,
    totalCommissionEarned: 1500,
    commissionPaid: 0,
    commissionDue: 1500,
    payoutMethod: "Bank: IBBL Bogura Branch A/C: 20501234567",
    status: "active",
  },
];

const initialBroadcasts: MockBroadcast[] = [
  {
    _id: "bc-1",
    title: "ঈদের বিশেষ সেলস কমিশন অফার ও নির্দেশনাবলী",
    message: "সম্মানিত সকল জেলা ও উপজেলা প্রতিনিধি, আসন্ন ঈদুল ফিতর উপলক্ষে প্রতিটি স্কুল বা ই-কমার্স সাইট বিক্রয়ে অতিরিক্ত ১০০০ টাকা বোনাস প্রদান করা হবে। বিস্তারিত মিটিং আগামী শুক্রবার রাত ৯টায়। - আওলাদ হোসেন, স্বত্বাধিকারী, Aulad IT Solution",
    targetAudience: "all",
    channel: "whatsapp",
    sentAt: "2026-03-10 20:00",
    recipientsCount: 4,
  },
];

// In-Memory Global Store for Hot Reloads
interface StoreData {
  clients: MockClient[];
  vaults: MockVault[];
  payments: MockPayment[];
  maintenance: MockMaintenance[];
  representatives: MockRepresentative[];
  broadcasts: MockBroadcast[];
}

declare global {
  // eslint-disable-next-line no-var
  var globalAuladStore: StoreData | undefined;
}

if (!global.globalAuladStore) {
  global.globalAuladStore = {
    clients: initialClients,
    vaults: initialVaults,
    payments: initialPayments,
    maintenance: initialMaintenance,
    representatives: initialRepresentatives,
    broadcasts: initialBroadcasts,
  };
}

export const store = global.globalAuladStore;
export {
  initialClients,
  initialVaults,
  initialPayments,
  initialMaintenance,
  initialRepresentatives,
  initialBroadcasts,
};
