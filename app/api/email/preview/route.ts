import { NextRequest, NextResponse } from 'next/server';
import emailService from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      recipientId, 
      projectName, 
      companyName, 
      documents, 
      message, 
      dueDate 
    } = body;

    // 필수 필드 검증
    if (!recipientId || !projectName || !companyName) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 수신자 정보 가져오기
    const recipient = await emailService.getRecipient(recipientId);
    if (!recipient) {
      return NextResponse.json(
        { error: '수신자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 임시 토큰 (미리보기용)
    const previewToken = 'PREVIEW_TOKEN_EXAMPLE';
    
    // 문서 목록 HTML 생성
    const documentListHtml = documents && documents.length > 0
      ? documents.map((doc: any) => 
          `<li>${doc.name}${doc.required ? ' <strong>(필수)</strong>' : ''}${doc.description ? ` - ${doc.description}` : ''}</li>`
        ).join('')
      : '<li>요청 문서가 없습니다.</li>';

    // 템플릿 가져오기
    const templates = await emailService.getTemplates();
    const template = templates.find(t => t.id === '1');
    
    if (!template) {
      return NextResponse.json(
        { error: '템플릿을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 이메일 내용 렌더링
    const emailContent = emailService.renderTemplate(template, {
      companyName,
      recipientName: recipient.name,
      projectName,
      message: message || '프로젝트 진행을 위해 아래 문서 제출을 부탁드립니다.',
      documentList: `<ul>${documentListHtml}</ul>`,
      dueDate: dueDate ? new Date(dueDate).toLocaleDateString('ko-KR') : '별도 안내',
      uploadUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/upload/${previewToken}`,
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ko-KR')
    });

    // 제목도 변수 치환
    const emailSubject = template.subject.replace('{{companyName}}', companyName);

    return NextResponse.json({
      subject: emailSubject,
      html: emailContent,
      recipient: {
        email: recipient.email,
        name: recipient.name
      }
    });
  } catch (error) {
    console.error('Email preview error:', error);
    return NextResponse.json(
      { error: '이메일 미리보기 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}