# Weave Components

Weave 프로젝트의 재사용 가능한 컴포넌트 모음입니다.

## 📚 문서

상세한 컴포넌트 가이드는 다음 문서를 참조하세요:
👉 [**컴포넌트 가이드**](/docs/컴포넌트가이드.md)

## 🗂️ 구조

```
components/
├── ai-assistant/        # AI 기반 기능 (데이터 추출, 문서 생성)
├── business-info/       # 사업자 정보 조회
├── email/              # 이메일 시스템 (문서 요청 관리)
├── document-upload/    # 문서 업로드 시스템
├── tabs/               # 탭 모듈 (통합 UI)
└── WeaveAssistant.tsx  # 메인 통합 컴포넌트
```

## 🚀 빠른 시작

### 전체 기능 사용
```tsx
import { WeaveAssistant } from '@/components';

<WeaveAssistant />
```

### 개별 컴포넌트 사용
```tsx
import { DataExtractor } from '@/components/ai-assistant';
import { DocumentRequestSystem } from '@/components/email';
import { FileUploadDropzone } from '@/components/document-upload';

// 각 컴포넌트를 독립적으로 사용
<DataExtractor onDataExtracted={handleData} />
<DocumentRequestSystem />
<FileUploadDropzone onUpload={handleUpload} />
```

## 📦 주요 컴포넌트

- **AI Assistant**: 데이터 추출, 문서 생성, 편집기
- **Email System**: 수신자 관리, 문서 요청, 업로드 관리  
- **Document Upload**: 드래그앤드롭 업로드, 토큰 기반 접근
- **Business Info**: 사업자등록번호 조회

## 📄 라이선스

MIT License - 자유롭게 사용 및 수정 가능합니다.