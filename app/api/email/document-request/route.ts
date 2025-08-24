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
      dueDate,
      sendEmail: shouldSendEmail = true
    } = body;

    // 필수 필드 검증
    if (!recipientId || !projectName || !companyName || !documents || documents.length === 0) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 문서 요청 생성
    const documentRequest = await emailService.createDocumentRequest({
      recipientId,
      projectName,
      companyName,
      documents,
      message,
      dueDate: dueDate ? new Date(dueDate) : undefined
    });

    // 이메일 발송
    let emailResult: { success: boolean; token?: string; error?: string } = { success: false };
    if (shouldSendEmail) {
      emailResult = await emailService.sendDocumentRequest(recipientId, documentRequest.id);
    }

    return NextResponse.json({
      success: true,
      documentRequest,
      emailSent: emailResult.success,
      uploadToken: emailResult.token
    }, { status: 201 });
  } catch (error) {
    console.error('Create document request error:', error);
    return NextResponse.json(
      { error: '문서 요청 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const requests = await emailService.getDocumentRequests();
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Get document requests error:', error);
    return NextResponse.json(
      { error: '문서 요청 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}