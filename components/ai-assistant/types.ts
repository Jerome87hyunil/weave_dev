// AI 비서 관련 타입 정의

export type AIModel = 'gemini-2.5-flash-lite' | 'gemini-2.5-pro';

export type TaskType = 'extract' | 'generate';

export interface ExtractedData {
  // 영수증/문서에서 추출된 데이터
  documentType: 'receipt' | 'tax_invoice' | 'cash_receipt' | 'invoice' | 'handwritten' | 'other';
  date?: string;
  vendor?: string;
  vendorRegistrationNumber?: string; // 사업자등록번호
  amount?: number;
  items?: Array<{
    name: string;
    quantity?: number;
    unitPrice?: number; // 단가
    price?: number;
  }>;
  supplyAmount?: number; // 공급가액
  taxAmount?: number; // 부가세액
  totalAmount?: number; // 총액
  paymentMethod?: string; // 결제수단
  cardNumber?: string; // 카드번호 마지막 4자리
  approvalNumber?: string; // 승인번호
  additionalInfo?: string; // 추가 정보
  rawText?: string;
  confidence?: number;
  error?: string; // 파싱 오류 등
  [key: string]: unknown; // 추가 필드를 위한 인덱스 시그니처
}

export interface DocumentTemplate {
  type: 'contract' | 'proposal' | 'invoice';
  title: string;
  content: string;
  metadata?: {
    createdAt: Date;
    model: 'gemini-2.5-pro';
    projectInfo?: string;
  };
}

export interface AIAssistantRequest {
  taskType: TaskType;
  model?: AIModel;
  file?: File;
  prompt?: string;
  context?: Record<string, unknown>;
}

export interface AIAssistantResponse {
  success: boolean;
  data?: ExtractedData | DocumentTemplate;
  error?: string;
  processingTime?: number;
}

export interface AIAssistantState {
  isProcessing: boolean;
  currentTask: TaskType | null;
  history: Array<{
    id: string;
    timestamp: Date;
    request: AIAssistantRequest;
    response: AIAssistantResponse;
  }>;
  error: string | null;
}