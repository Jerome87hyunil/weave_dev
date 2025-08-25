// 이메일 서비스 구현
import { 
  EmailRecipient, 
  SendEmailOptions, 
  BulkEmailResult,
  UploadToken,
  DocumentRequest,
  RequestedDocument,
  EmailTemplate
} from '@/types/email';
import { v4 as uuidv4 } from 'uuid';

// 임시 저장소 (실제로는 데이터베이스 사용)
const emailStorage = {
  recipients: [] as EmailRecipient[],
  tokens: [] as UploadToken[],
  requests: [] as DocumentRequest[],
  templates: [] as EmailTemplate[],
  logs: [] as { id: string; recipientId: string; timestamp: Date; status: string; message?: string }[]
};

// 기본 이메일 템플릿
const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: '1',
    name: '문서 요청',
    subject: '[{{companyName}}] 문서 제출 요청',
    content: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <h2>안녕하세요, {{recipientName}}님</h2>
        <p>{{companyName}}에서 다음 문서 제출을 요청드립니다.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>프로젝트: {{projectName}}</h3>
          <p>{{message}}</p>
          
          <h4>요청 문서 목록:</h4>
          {{documentList}}
          
          <p style="margin-top: 20px;">
            <strong>제출 기한:</strong> {{dueDate}}
          </p>
        </div>
        
        <div style="margin: 30px 0;">
          <a href="{{uploadUrl}}" 
             style="background: #3b82f6; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            문서 업로드하기
          </a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          이 링크는 {{expiryDate}}까지 유효합니다.<br>
          문의사항이 있으시면 회신해주세요.
        </p>
      </div>
    `,
    variables: ['companyName', 'recipientName', 'projectName', 'message', 'documentList', 'dueDate', 'uploadUrl', 'expiryDate'],
    category: 'document_request',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: '문서 승인 알림',
    subject: '[{{companyName}}] 문서가 승인되었습니다',
    content: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <h2>문서 승인 완료</h2>
        <p>{{recipientName}}님이 제출하신 문서가 승인되었습니다.</p>
        
        <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>문서명:</strong> {{documentName}}</p>
          <p><strong>프로젝트:</strong> {{projectName}}</p>
          <p><strong>승인일시:</strong> {{approvedAt}}</p>
        </div>
        
        <p>감사합니다.</p>
      </div>
    `,
    variables: ['companyName', 'recipientName', 'documentName', 'projectName', 'approvedAt'],
    category: 'notification',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: '문서 반려 알림',
    subject: '[{{companyName}}] 문서 재제출 요청',
    content: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <h2>문서 재제출 필요</h2>
        <p>{{recipientName}}님이 제출하신 문서를 검토한 결과, 재제출이 필요합니다.</p>
        
        <div style="background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>문서명:</strong> {{documentName}}</p>
          <p><strong>반려 사유:</strong></p>
          <p style="margin-left: 20px;">{{rejectionReason}}</p>
        </div>
        
        <div style="margin: 30px 0;">
          <a href="{{uploadUrl}}" 
             style="background: #ef4444; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block;">
            문서 다시 제출하기
          </a>
        </div>
      </div>
    `,
    variables: ['companyName', 'recipientName', 'documentName', 'rejectionReason', 'uploadUrl'],
    category: 'notification',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// 템플릿 초기화
emailStorage.templates = DEFAULT_TEMPLATES;

class EmailService {
  // 수신자 관리
  async addRecipient(recipient: Omit<EmailRecipient, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailRecipient> {
    const newRecipient: EmailRecipient = {
      ...recipient,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    emailStorage.recipients.push(newRecipient);
    return newRecipient;
  }

  async getRecipients(): Promise<EmailRecipient[]> {
    return emailStorage.recipients;
  }

  async getRecipient(id: string): Promise<EmailRecipient | null> {
    console.log('[DEBUG] getRecipient called with id:', id);
    console.log('[DEBUG] Available recipients:', emailStorage.recipients.map(r => ({ id: r.id, name: r.name })));
    const recipient = emailStorage.recipients.find(r => r.id === id);
    console.log('[DEBUG] Found recipient:', recipient);
    return recipient || null;
  }

  async updateRecipient(id: string, data: Partial<EmailRecipient>): Promise<EmailRecipient | null> {
    const index = emailStorage.recipients.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    emailStorage.recipients[index] = {
      ...emailStorage.recipients[index],
      ...data,
      updatedAt: new Date()
    };
    
    return emailStorage.recipients[index];
  }

  async deleteRecipient(id: string): Promise<boolean> {
    const index = emailStorage.recipients.findIndex(r => r.id === id);
    if (index === -1) return false;
    
    emailStorage.recipients.splice(index, 1);
    return true;
  }

  // 문서 요청 생성
  async createDocumentRequest(data: {
    recipientId: string;
    projectName: string;
    companyName: string;
    documents: Array<{
      name: string;
      description?: string;
      required: boolean;
      templateUrl?: string;
    }>;
    message?: string;
    dueDate?: Date;
  }): Promise<DocumentRequest> {
    const request: DocumentRequest = {
      id: uuidv4(),
      recipientId: data.recipientId,
      projectName: data.projectName,
      companyName: data.companyName,
      documents: data.documents.map(doc => ({
        id: uuidv4(),
        ...doc,
        status: 'pending'
      })),
      message: data.message,
      dueDate: data.dueDate,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    emailStorage.requests.push(request);
    return request;
  }

  // 업로드 토큰 생성
  async createUploadToken(recipientId: string, documentRequestId: string): Promise<UploadToken> {
    const token: UploadToken = {
      id: uuidv4(),
      token: Buffer.from(uuidv4()).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 32),
      recipientId,
      documentRequestId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후 만료
      createdAt: new Date()
    };
    
    emailStorage.tokens.push(token);
    return token;
  }

  async getTokenByValue(tokenValue: string): Promise<UploadToken | null> {
    return emailStorage.tokens.find(t => t.token === tokenValue && !t.usedAt && new Date(t.expiresAt) > new Date()) || null;
  }
  
  async getTokenForRequest(documentRequestId: string): Promise<UploadToken | null> {
    return emailStorage.tokens.find(t => t.documentRequestId === documentRequestId && !t.usedAt && new Date(t.expiresAt) > new Date()) || null;
  }

  async markTokenAsUsed(tokenId: string): Promise<void> {
    const token = emailStorage.tokens.find(t => t.id === tokenId);
    if (token) {
      token.usedAt = new Date();
    }
  }

  // 템플릿 관리
  async getTemplates(): Promise<EmailTemplate[]> {
    return emailStorage.templates;
  }

  async getTemplate(id: string): Promise<EmailTemplate | null> {
    return emailStorage.templates.find(t => t.id === id) || null;
  }

  // 템플릿 렌더링
  renderTemplate(template: EmailTemplate, variables: Record<string, string>): string {
    let content = template.content;
    
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, variables[key] || '');
    });
    
    return content;
  }

  // 이메일 발송 (시뮬레이션)
  async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // 실제 구현에서는 여기서 이메일 서비스 API 호출
      // Email will be sent via Resend API in production
      
      // 로그 저장
      const recipientEmail = Array.isArray(options.to) ? options.to[0] : options.to;
      const messageId = `msg-${uuidv4()}`;
      
      const log = {
        id: uuidv4(),
        recipientId: recipientEmail, // recipientId로 변경 (이메일로 대체)
        timestamp: new Date(),
        status: 'sent',
        message: `Email sent: ${options.subject}`
      };
      
      emailStorage.logs.push(log);
      
      return { 
        success: true, 
        messageId: messageId 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '이메일 발송 실패' 
      };
    }
  }

  // 대량 이메일 발송
  async sendBulkEmails(
    recipients: EmailRecipient[],
    subject: string,
    body: string,
    template?: string
  ): Promise<BulkEmailResult[]> {
    const results: BulkEmailResult[] = [];
    
    for (const recipient of recipients) {
      const result = await this.sendEmail({
        to: recipient.email,
        subject,
        body,
        template,
        variables: {
          recipientName: recipient.name,
          organization: recipient.organization
        }
      });
      
      results.push({
        email: recipient.email,
        status: result.success ? 'success' : 'failed',
        messageId: result.messageId,
        error: result.error
      });
      
      // Rate limiting simulation
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }

  // 문서 요청 이메일 발송
  async sendDocumentRequest(
    recipientId: string,
    documentRequestId: string
  ): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const recipient = await this.getRecipient(recipientId);
      const request = emailStorage.requests.find(r => r.id === documentRequestId);
      
      if (!recipient || !request) {
        return { success: false, error: '수신자 또는 요청을 찾을 수 없습니다.' };
      }
      
      // 토큰 생성
      const token = await this.createUploadToken(recipientId, documentRequestId);
      
      // 문서 목록 HTML 생성
      const documentListHtml = request.documents.map(doc => 
        `<li>${doc.name}${doc.required ? ' <strong>(필수)</strong>' : ''}</li>`
      ).join('');
      
      // 템플릿 렌더링
      const template = emailStorage.templates.find(t => t.id === '1')!;
      const emailContent = this.renderTemplate(template, {
        companyName: request.companyName,
        recipientName: recipient.name,
        projectName: request.projectName,
        message: request.message || '',
        documentList: `<ul>${documentListHtml}</ul>`,
        dueDate: request.dueDate ? new Date(request.dueDate).toLocaleDateString('ko-KR') : '별도 안내',
        uploadUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/upload/${token.token}`,
        expiryDate: new Date(token.expiresAt).toLocaleDateString('ko-KR')
      });
      
      // 이메일 발송
      const result = await this.sendEmail({
        to: recipient.email,
        subject: template.subject.replace('{{companyName}}', request.companyName),
        body: emailContent
      });
      
      if (result.success) {
        // 요청 상태 업데이트
        request.status = 'sent';
        request.updatedAt = new Date();
      }
      
      return { 
        success: result.success, 
        token: token.token,
        error: result.error 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '알 수 없는 오류' 
      };
    }
  }

  // 문서 상태 업데이트
  async updateDocumentStatus(
    documentRequestId: string,
    documentId: string,
    status: 'uploaded' | 'approved' | 'rejected',
    dataOrReason?: string
  ): Promise<RequestedDocument> {
    const request = emailStorage.requests.find(r => r.id === documentRequestId);
    if (!request) throw new Error('Request not found');
    
    const document = request.documents.find(d => d.id === documentId);
    if (!document) throw new Error('Document not found');
    
    document.status = status;
    
    if (status === 'uploaded' && dataOrReason) {
      document.uploadedUrl = dataOrReason;
      document.uploadedAt = new Date();
    } else if (status === 'rejected' && dataOrReason) {
      document.rejectionReason = dataOrReason;
    }
    
    request.updatedAt = new Date();
    
    // 모든 필수 문서가 승인되었는지 확인
    const allRequiredApproved = request.documents
      .filter(d => d.required)
      .every(d => d.status === 'approved');
    
    if (allRequiredApproved) {
      request.status = 'completed';
    }
    
    return document;
  }
  
  // 문서 조회
  async getDocument(documentRequestId: string, documentId: string): Promise<RequestedDocument | null> {
    const request = emailStorage.requests.find(r => r.id === documentRequestId);
    if (!request) return null;
    
    return request.documents.find(d => d.id === documentId) || null;
  }

  // 문서 요청 목록 가져오기
  async getDocumentRequests(): Promise<DocumentRequest[]> {
    return emailStorage.requests;
  }

  async getDocumentRequest(id: string): Promise<DocumentRequest | null> {
    return emailStorage.requests.find(r => r.id === id) || null;
  }
}

const emailService = new EmailService();
export default emailService;