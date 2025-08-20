// AI 비서 관련 타입 정의

export type AIModel = 'gemini-2.5-flash-lite' | 'gemini-2.5-pro';

export type TaskType = 'extract' | 'generate';

export interface ExtractedData {
  // 영수증/문서에서 추출된 데이터
  documentType: 'receipt' | 'invoice' | 'contract' | 'other';
  date?: string;
  vendor?: string;
  amount?: number;
  items?: Array<{
    name: string;
    quantity?: number;
    price?: number;
  }>;
  taxAmount?: number;
  totalAmount?: number;
  rawText?: string;
  confidence?: number;
  [key: string]: any; // 추가 필드를 위한 인덱스 시그니처
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
  context?: Record<string, any>;
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