export type HealthCheckStatus = 'completed' | 'pending' | 'overdue' | 'upcoming';

export interface HealthCheckRecord {
  id: string;
  stageName: string; // e.g. "入境後3日內診斷體檢", "入境滿6個月定期體檢", "入境滿18個月定期體檢", "入境滿30個月定期體檢"
  monthInterval: number; // 0, 6, 18, 30
  dueDate: string; // YYYY-MM-DD
  completedDate?: string;
  status: HealthCheckStatus;
  hospitalName?: string;
  reportFileUrl?: string;
  requiredItems: string[]; // e.g., ["胸部X光攝影", "腸內寄生蟲糞便檢查", "身體檢查", "傷寒檢查"]
  note?: string;
}

export type WorkflowStageStatus = 'completed' | 'in_progress' | 'pending' | 'action_required';

export interface WorkflowStep {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  status: WorkflowStageStatus;
  officialDocumentNo?: string; // e.g., "勞職字第 113088921 號"
  updatedAt?: string;
  estimatedCompletionDate?: string;
  responsibleParty: string; // e.g., "勞動部", "海外仲介公司", "雇主自辦", "移民署"
  requiredAction?: string; // e.g., "請簽署委任服務契約"
  linkedDocumentId?: string; // Links to E-signature document
  documentsList?: string[];
}

export type DocumentType = 'employment_contract' | 'service_agreement' | 'salary_authorization' | 'health_consent' | 'arc_application';

export type DocumentStatus = 'signed' | 'pending_signature' | 'draft' | 'expired';

export interface DocumentContract {
  id: string;
  title: string;
  type: DocumentType;
  categoryName: string;
  description: string;
  status: DocumentStatus;
  createdAt: string;
  signedAt?: string;
  signatureImage?: string; // base64 canvas signature
  signDeadline: string;
  fileSize: string;
  summaryBulletPoints: string[];
}

export type NotificationCategory = 'health_check' | 'contract_signing' | 'workflow_progress' | 'payment_reminder' | 'system';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string; // e.g. tab name or document modal trigger
  actionLabel?: string;
  caregiverId: string;
  priority: 'high' | 'normal' | 'low';
}

export interface ForeignCaregiver {
  id: string;
  name: string;
  englishName: string;
  nationality: '印尼 (Indonesia)' | '越南 (Vietnam)' | '菲律賓 (Philippines)' | '泰國 (Thailand)';
  nationalityCode: 'ID' | 'VN' | 'PH' | 'TH';
  languageCode: 'id' | 'vi' | 'tl' | 'th';
  avatarUrl: string;
  gender: '女' | '男';
  passportNumber: string;
  arcNumber: string; // 居留證號
  arcExpiryDate: string;
  arrivalDate: string; // 入境日期
  contractStartDate: string;
  contractEndDate: string;
  employerName: string;
  patientName: string; // 被照顧者姓名
  patientAge: number;
  agencyName: string;
  agencyContact: string;
  healthChecks: HealthCheckRecord[];
  workflowSteps: WorkflowStep[];
  documents: DocumentContract[];
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  translatedText?: {
    indonesian?: string;
    vietnamese?: string;
    tagalog?: string;
  };
  cardPresets?: {
    title: string;
    chineseText: string;
    targetLanguageText: string;
    languageName: string;
  };
}
