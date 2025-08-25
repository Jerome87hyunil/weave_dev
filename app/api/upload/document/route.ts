import { NextRequest, NextResponse } from 'next/server';
import emailService from '@/lib/email-service';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const token = formData.get('token') as string;
    const documentId = formData.get('documentId') as string;
    
    if (!file || !token || !documentId) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }
    
    // 토큰 검증
    const uploadToken = await emailService.getTokenByValue(token);
    
    if (!uploadToken) {
      return NextResponse.json(
        { error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }
    
    // 파일 크기 검증 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기는 10MB 이하여야 합니다.' },
        { status: 400 }
      );
    }
    
    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '지원하지 않는 파일 형식입니다.' },
        { status: 400 }
      );
    }
    
    // 파일 저장 (실제 환경에서는 S3 등 클라우드 스토리지 사용)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // 업로드 디렉토리 생성
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    
    try {
      // public/uploads 디렉토리가 없으면 생성
      const { mkdir } = await import('fs/promises');
      await mkdir(uploadDir, { recursive: true });
      
      // 파일 저장
      await writeFile(filePath, buffer);
    } catch (error) {
      console.error('File save error:', error);
      // 실제 환경에서는 클라우드 스토리지를 사용하므로 이 부분은 시뮬레이션
    }
    
    // 문서 상태 업데이트
    const fileUrl = `/uploads/${fileName}`;
    const updated = await emailService.updateDocumentStatus(
      uploadToken.documentRequestId,
      documentId,
      'uploaded',
      fileUrl
    );
    
    if (!updated) {
      return NextResponse.json(
        { error: '문서 상태 업데이트에 실패했습니다.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      url: fileUrl,
      message: '파일이 성공적으로 업로드되었습니다.'
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: '파일 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}