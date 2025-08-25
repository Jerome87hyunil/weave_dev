import { NextRequest, NextResponse } from 'next/server';
import emailService from '@/lib/email-service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string; documentId: string }> }
) {
  try {
    const { requestId, documentId } = await params;
    const body = await request.json();
    const { status, rejectionReason } = body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: '유효하지 않은 상태입니다.' },
        { status: 400 }
      );
    }

    if (status === 'rejected' && !rejectionReason) {
      return NextResponse.json(
        { error: '거절 사유를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 문서 상태 업데이트
    const updatedDocument = await emailService.updateDocumentStatus(
      requestId,
      documentId,
      status,
      rejectionReason
    );

    return NextResponse.json({
      success: true,
      document: updatedDocument
    });
  } catch (error) {
    console.error('Update document status error:', error);
    return NextResponse.json(
      { error: '문서 상태 업데이트에 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ requestId: string; documentId: string }> }
) {
  try {
    const { requestId, documentId } = await params;
    const document = await emailService.getDocument(
      requestId,
      documentId
    );

    if (!document) {
      return NextResponse.json(
        { error: '문서를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Get document error:', error);
    return NextResponse.json(
      { error: '문서 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}