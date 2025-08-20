# Weave AI 비서 컴포넌트

프리랜서를 위한 AI 기반 문서 처리 도구입니다.

## 주요 기능

### 1. 데이터 추출
- 영수증, 청구서, 계약서 등에서 자동으로 데이터 추출
- Google gemini-2.5-flash-lite 모델 사용
- 지원 형식: 이미지 파일, PDF

### 2. 문서 생성
- 프로젝트 정보를 바탕으로 문서 초안 자동 생성
- Google gemini-2.5-pro 모델 사용
- 생성 가능 문서: 계약서, 제안서, 청구서

## 설치 및 실행

### 1. 환경 변수 설정
`.env.local` 파일에 API 키를 설정하세요:

```bash
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 브라우저에서 확인
```
http://localhost:3000
```

## 컴포넌트 구조

```
/components/ai-assistant/
├── AIAssistant.tsx    # 메인 UI 컴포넌트
└── types.ts           # TypeScript 타입 정의

/app/api/ai-assistant/
└── route.ts           # API 엔드포인트
```

## 사용 방법

### 데이터 추출
1. "데이터 추출" 탭 선택
2. 영수증이나 문서 이미지 업로드
3. "데이터 추출하기" 버튼 클릭
4. 추출된 데이터 확인

### 문서 생성
1. "문서 생성" 탭 선택
2. 문서 유형 선택 (계약서/제안서/청구서)
3. 프로젝트 정보 입력
4. "문서 생성하기" 버튼 클릭
5. 생성된 문서 확인 및 다운로드

## 통합 가이드

이 컴포넌트를 다른 프로젝트에 통합하려면:

1. `/components/ai-assistant/` 폴더를 복사
2. API 라우트 파일 복사 또는 API 로직 통합
3. 필요한 패키지 설치:
   ```bash
   npm install openai @google/generative-ai
   ```
4. 환경 변수 설정
5. 컴포넌트 import 및 사용:
   ```tsx
   import AIAssistant from '@/components/ai-assistant/AIAssistant';
   
   <AIAssistant 
     onDataExtracted={(data) => {/* 처리 로직 */}}
     onDocumentGenerated={(doc) => {/* 처리 로직 */}}
   />
   ```

## 주의사항

- API 키는 절대 소스 코드에 직접 포함하지 마세요
- 프로덕션 환경에서는 API 요청에 대한 인증 및 권한 확인 필요
- 파일 업로드 크기 제한 구현 권장
- Rate limiting 구현 권장

## 향후 개선 사항

- [ ] 파일 크기 제한 및 유효성 검사
- [ ] 로딩 상태 개선
- [ ] 에러 처리 강화
- [ ] 다국어 지원
- [ ] 배치 처리 기능
- [ ] 처리 이력 관리
- [ ] 캐싱 메커니즘