import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { estimateTokens, calculateCost } from '@/lib/token-tracker';
import { 
  QUOTE_TEMPLATES, 
  applyDataToTemplate,
  getTemplatesByType,
  ClientData,
  ProjectData
} from '@/lib/quote-templates';

// Gemini API 클라이언트 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    
    // 파일 업로드 처리 (데이터 추출)
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json(
          { success: false, error: '파일이 없습니다.' },
          { status: 400 }
        );
      }

      try {
        // Gemini 2.5 Flash Lite를 사용한 멀티모달 데이터 추출
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-2.5-flash-lite'
        });

        // 파일을 base64로 변환
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString('base64');

        // 파일 타입에 따른 처리
        let mimeType = file.type;
        if (!mimeType) {
          // 파일 확장자로 MIME 타입 추론
          const ext = file.name.split('.').pop()?.toLowerCase();
          if (ext === 'pdf') mimeType = 'application/pdf';
          else if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg';
          else if (ext === 'png') mimeType = 'image/png';
          else mimeType = 'image/jpeg'; // 기본값
        }

        const prompt = `당신은 문서에서 정보를 추출하는 전문가입니다. 
          이 문서(영수증, 청구서, 계약서 등)에서 중요한 정보를 정확하게 추출해주세요.
          
          추출한 데이터는 반드시 다음과 같은 JSON 형식으로 반환해주세요:
          {
            "documentType": "receipt|invoice|contract|other",
            "date": "날짜 (YYYY-MM-DD 형식)",
            "vendor": "업체명",
            "items": [
              {
                "name": "항목명",
                "quantity": 수량,
                "price": 가격
              }
            ],
            "taxAmount": 세금액,
            "totalAmount": 총액,
            "additionalInfo": "기타 중요 정보"
          }
          
          문서에서 찾을 수 없는 필드는 null로 표시하세요.
          반드시 유효한 JSON 형식으로만 응답하세요.`;

        const result = await model.generateContent([
          {
            inlineData: {
              mimeType: mimeType,
              data: base64
            }
          },
          prompt
        ]);

        const extractedText = result.response.text();
        
        // 토큰 사용량 추정
        const inputTokens = estimateTokens(prompt) + Math.ceil(base64.length * 0.75); // base64 이미지 토큰 추정
        const outputTokens = estimateTokens(extractedText);
        const cost = calculateCost(inputTokens, outputTokens, 'gemini-2.5-flash-lite');
        
        // JSON 파싱 시도
        let extractedData;
        try {
          // JSON 블록 추출 (```json ... ``` 형식 처리)
          const jsonMatch = extractedText.match(/```json\n?([\s\S]*?)\n?```/) || 
                            extractedText.match(/\{[\s\S]*\}/);
          const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : extractedText;
          extractedData = JSON.parse(jsonString);
        } catch (parseError) {
          console.error('JSON 파싱 오류:', parseError);
          // JSON 파싱 실패 시 기본 구조 반환
          extractedData = {
            documentType: 'other',
            rawText: extractedText,
            error: 'JSON 파싱 실패',
            confidence: 0.5
          };
        }

        return NextResponse.json({
          success: true,
          data: extractedData,
          model: 'gemini-2.5-flash-lite',
          processingTime: Date.now(),
          tokenUsage: {
            inputTokens,
            outputTokens,
            totalTokens: inputTokens + outputTokens,
            cost,
            model: 'gemini-2.5-flash-lite'
          }
        });

      } catch (error: any) {
        console.error('Gemini API 오류:', error);
        return NextResponse.json(
          { 
            success: false, 
            error: error?.message || 'AI 처리 중 오류가 발생했습니다.',
            details: error?.response?.data || error?.toString()
          },
          { status: 500 }
        );
      }

    } else {
      // JSON 요청 처리 (문서 생성)
      const body = await request.json();
      const { taskType, documentType, prompt, templateId, clientData, projectData } = body;

      if (taskType !== 'generate' || !prompt) {
        return NextResponse.json(
          { success: false, error: '잘못된 요청입니다.' },
          { status: 400 }
        );
      }

      try {
        // Gemini 2.5 Flash Lite를 사용한 문서 생성 (템플릿 기반)
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-2.5-flash-lite' 
        });
        
        // 템플릿 선택
        let selectedTemplate = QUOTE_TEMPLATES.find(t => t.id === templateId);
        if (!selectedTemplate) {
          // 기본 템플릿 매핑
          if (documentType === 'contract' || documentType === 'invoice') {
            selectedTemplate = QUOTE_TEMPLATES.find(t => t.id === 'standard');
          } else if (documentType === 'proposal') {
            selectedTemplate = QUOTE_TEMPLATES.find(t => t.id === 'web-dev');
          }
        }
        
        if (!selectedTemplate) {
          selectedTemplate = QUOTE_TEMPLATES[0]; // 표준 템플릿 사용
        }

        // 템플릿에 기본 데이터 적용
        const baseDocument = applyDataToTemplate(
          selectedTemplate.template,
          clientData || {},
          projectData || {},
          {}
        );

        // AI에게 템플릿 완성 요청
        const documentTypeKorean = documentType === 'quote' ? '견적서' : 
                                  documentType === 'contract' ? '계약서' : 
                                  documentType === 'invoice' ? '청구서' : '문서';
        
        const systemPrompt = `당신은 전문적인 ${documentTypeKorean} 작성 전문가입니다. 
          아래 템플릿과 프로젝트 정보를 바탕으로 빈 칸([...])을 채워서 완성된 ${documentTypeKorean}를 작성해주세요.
          
          중요 사항:
          1. 기존 템플릿 구조를 유지하면서 빈 칸만 채워주세요
          2. 프로젝트 정보를 바탕으로 적절한 항목과 금액을 계산해주세요
          3. 한국어로 전문적이고 명확하게 작성해주세요
          4. 금액은 원화(₩)로 표시하고 천 단위 구분 쉼표를 사용하세요
          5. VAT는 10%로 계산해주세요
          
          템플릿:
          ${baseDocument}
          
          프로젝트 정보:
          ${prompt}
          
          클라이언트 정보:
          ${JSON.stringify(clientData || {}, null, 2)}
          
          프로젝트 데이터:
          ${JSON.stringify(projectData || {}, null, 2)}
          
          위 정보를 바탕으로 템플릿의 모든 빈 칸을 채워서 완성된 견적서를 작성해주세요.`;
        
        const result = await model.generateContent(systemPrompt);
        const generatedContent = result.response.text();
        
        // 토큰 사용량 추정
        const inputTokens = estimateTokens(systemPrompt);
        const outputTokens = estimateTokens(generatedContent);
        const cost = calculateCost(inputTokens, outputTokens, 'gemini-2.5-flash-lite');

        const documentTemplate = {
          type: documentType,
          title: selectedTemplate.name,
          content: generatedContent,
          metadata: {
            createdAt: new Date(),
            model: 'gemini-2.5-flash-lite',
            templateId: selectedTemplate.id,
            projectInfo: prompt
          }
        };

        return NextResponse.json({
          success: true,
          data: documentTemplate,
          processingTime: Date.now(),
          tokenUsage: {
            inputTokens,
            outputTokens,
            totalTokens: inputTokens + outputTokens,
            cost,
            model: 'gemini-2.5-flash-lite'
          }
        });

      } catch (error: any) {
        console.error('Gemini API 오류:', error);
        return NextResponse.json(
          { 
            success: false, 
            error: error?.message || '문서 생성 중 오류가 발생했습니다.',
            details: error?.response?.data || error?.toString()
          },
          { status: 500 }
        );
      }
    }

  } catch (error: any) {
    console.error('API 라우트 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || '서버 오류가 발생했습니다.',
        details: error?.toString()
      },
      { status: 500 }
    );
  }
}