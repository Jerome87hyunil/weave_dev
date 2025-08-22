import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.BUSINESS_API_KEY || 'IHXWXpobNTGEHV+mbvW6D3k9ETjK37Klv4RCEnvXSrDdanoVv3CfskmUXDFUEJlzXA8swiJCB5LRNBl2r6aXCg==';
const API_URL = 'https://api.odcloud.kr/api/nts-businessman/v1/status';

export async function POST(request: NextRequest) {
  try {
    const { businessNumber } = await request.json();

    if (!businessNumber) {
      return NextResponse.json(
        { error: '사업자등록번호가 필요합니다.' },
        { status: 400 }
      );
    }

    const cleanedBNo = businessNumber.replace(/-/g, '');
    
    if (cleanedBNo.length !== 10) {
      return NextResponse.json(
        { error: '올바른 사업자등록번호 형식이 아닙니다. (10자리)' },
        { status: 400 }
      );
    }

    const requestBody = {
      b_no: [cleanedBNo]
    };

    const response = await fetch(`${API_URL}?serviceKey=${encodeURIComponent(API_KEY)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error('API 응답 오류:', response.status, response.statusText);
      
      const errorText = await response.text();
      console.error('오류 상세:', errorText);
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'API 인증 오류입니다. API 키를 확인해주세요.' },
          { status: 401 }
        );
      }
      
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.' },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: '국세청 API 조회에 실패했습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (data.status_code !== 'OK') {
      return NextResponse.json(
        { error: data.error_msg || '조회에 실패했습니다.' },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API 라우트 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}