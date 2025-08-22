// 이메일 시스템 타입 정의

export interface EmailRecipient {
  id?: string;
  email: string;
  name: string;
  organization?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DocumentRequest {
  id: string;
  recipientId: string;
  projectName: string;
  companyName: string;
  documents: RequestedDocument[];
  message?: string;
  dueDate?: Date;
  status: 'pending' | 'sent' | 'completed' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

export interface RequestedDocument {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  templateUrl?: string;
  status: 'pending' | 'uploaded' | 'approved' | 'rejected';
  uploadedUrl?: string;
  uploadedAt?: Date;
  rejectionReason?: string;
}

export interface UploadToken {
  id: string;
  token: string;
  recipientId: string;
  documentRequestId: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: 'document_request' | 'notification' | 'reminder' | 'custom';
  createdAt: Date;
  updatedAt: Date;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  body?: string;
  template?: string;
  variables?: Record<string, any>;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

export interface BulkEmailResult {
  email: string;
  status: 'success' | 'failed';
  messageId?: string;
  error?: string;
}

export interface EmailLog {
  id: string;
  recipientEmail: string;
  subject: string;
  status: 'pending' | 'sent' | 'failed' | 'bounced';
  messageId?: string;
  errorMessage?: string;
  sentAt?: Date;
  openedAt?: Date;
  metadata?: Record<string, any>;
}