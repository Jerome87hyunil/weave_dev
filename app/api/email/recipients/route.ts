import { NextRequest, NextResponse } from 'next/server';
import emailService from '@/lib/email-service';

export async function GET() {
  try {
    const recipients = await emailService.getRecipients();
    return NextResponse.json(recipients);
  } catch (error) {
    console.error('Get recipients error:', error);
    return NextResponse.json(
      { error: '수신자 목록을 가져오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, organization, phone } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: '이메일과 이름은 필수입니다.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    const recipient = await emailService.addRecipient({
      email,
      name,
      organization,
      phone
    });

    return NextResponse.json(recipient, { status: 201 });
  } catch (error) {
    console.error('Add recipient error:', error);
    return NextResponse.json(
      { error: '수신자 추가에 실패했습니다.' },
      { status: 500 }
    );
  }
}