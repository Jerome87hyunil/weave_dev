import { NextRequest, NextResponse } from 'next/server';
import emailService from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, body: emailBody, template, variables } = body;

    if (!to || !subject) {
      return NextResponse.json(
        { error: '수신자와 제목은 필수입니다.' },
        { status: 400 }
      );
    }

    const result = await emailService.sendEmail({
      to,
      subject,
      body: emailBody,
      template,
      variables
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId
      });
    } else {
      return NextResponse.json(
        { error: result.error || '이메일 발송 실패' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}