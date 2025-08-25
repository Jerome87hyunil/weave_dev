import { NextRequest, NextResponse } from 'next/server';
import emailService from '@/lib/email-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: '토큰이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }
    
    // 토큰 검증
    const uploadToken = await emailService.getTokenByValue(token);
    
    if (!uploadToken) {
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다. 링크가 만료되었거나 이미 사용되었을 수 있습니다.' },
        { status: 404 }
      );
    }
    
    // 문서 요청 정보 가져오기
    const documentRequest = await emailService.getDocumentRequest(uploadToken.documentRequestId);
    
    if (!documentRequest) {
      return NextResponse.json(
        { error: '문서 요청을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 수신자 정보 가져오기
    const recipient = await emailService.getRecipient(uploadToken.recipientId);
    
    if (!recipient) {
      return NextResponse.json(
        { error: '수신자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }
    
    // 응답 데이터 구성
    const responseData = {
      id: documentRequest.id,
      projectName: documentRequest.projectName,
      companyName: documentRequest.companyName,
      recipientName: recipient.name,
      dueDate: documentRequest.dueDate,
      message: documentRequest.message,
      documents: documentRequest.documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        description: doc.description,
        required: doc.required,
        status: doc.status,
        uploadedUrl: doc.uploadedUrl,
        rejectionReason: doc.rejectionReason
      }))
    };
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json(
      { error: '토큰 검증 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}