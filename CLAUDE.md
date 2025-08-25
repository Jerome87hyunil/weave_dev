# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Weave is an integrated business platform for freelancers and sole proprietors that connects daily business operations (ERP) with tax filing in a single workflow. The platform automates data aggregation from projects, contracts, and invoices, transforming them into tax filing formats for submission through certified tax accountants.

## Core Business Context

The project aims to solve the fragmented workflow problem where freelancers use multiple disconnected tools (Notion for projects, Excel for invoices, messenger/email for expenses) and must manually consolidate this data for tax filing. Weave provides:
- Personal Mini-ERP functionality (CRM, project management, contracts/invoices)
- Tax calculation and format conversion engine
- AI assistant for data extraction and document generation
- Tax accountant integration for authorized filing

## Development Commands

```bash
# Development
npm run dev        # Start development server with Turbopack

# Build and Production
npm run build      # Build for production
npm run start      # Start production server

# Code Quality
npm run lint       # Run Next.js linter
```

## Technology Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 with PostCSS
- **Planned Backend**: Supabase (PostgreSQL BaaS)
- **Planned ORM**: Prisma
- **AI Integration**: 
  - gemini-2.5-flash-lite for data extraction/classification
  - gemini-2.5-pro for document generation
- **Deployment**: Vercel

## Project Architecture

### Current Structure
- `/app` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with Geist font configuration
  - `page.tsx` - Home page
  - `globals.css` - Global styles with Tailwind CSS and dark mode support
- `/docs` - Project documentation including Korean development plan (개발기획서.md)
- `/public` - Static assets

### Key Architectural Principles
1. **Deterministic Rule Engine**: Tax calculations use version-controlled deterministic logic, not AI, to ensure 100% reliability and reproducibility
2. **AI as Assistant Only**: AI models are limited to data structuring and error detection suggestions, preventing hallucination risks in critical calculations
3. **Security First**: Implement Supabase RLS (Row Level Security) for complete user data isolation

### Planned Features (from 개발기획서.md)
1. **Phase 1: Core ERP Features**
   - Client management (CRM)
   - Project management (Kanban board)
   - Contract/Invoice templates
   - Income/Expense dashboard

2. **Phase 2: Tax Integration**
   - Real-time tax calculation (VAT, income tax)
   - National Tax Service format conversion (CSV/XML)
   - Tax accountant partner portal

3. **Phase 3: AI Enhancement**
   - Receipt/document data extraction
   - Contract/proposal draft generation
   - Document archiving with security

## Import Aliases

The project uses `@/*` path alias configured in tsconfig.json to import from the project root.

## Development Guidelines

### TypeScript Configuration
- Strict mode is enabled - ensure all types are properly defined
- Module resolution is set to "bundler" for optimal Next.js compatibility
- Use ES2017 target with ESNext library features

### Component Development
- Use React Server Components by default
- Client components should be marked with "use client" directive
- Leverage Next.js font optimization with the configured Geist fonts

### Styling Approach
- Tailwind CSS v4 with PostCSS for styling
- Dark mode support via CSS variables
- Theme configuration uses inline @theme directive

## Partner Strategy Notes

The project includes a phased partner strategy for tax accountant integration:
- Phase 1: Establish proof of concept with initial partner ("다산세무회계")
- Phase 2: Expand to 10-20 tech-savvy tax accountants
- Phase 3: Build marketplace platform connecting freelancers with verified tax professionals

## Security and Compliance Considerations

- Implement clear responsibility matrix between platform, users, and tax accountants
- Platform handles data conversion and delivery
- Users ensure data accuracy
- Tax accountants maintain legal responsibility for filing
- Never store sensitive financial data without proper encryption
- Implement audit trails for all tax-related operations

## Current Development Approach

### Modular Component Development
The project is being developed as independent, reusable components that can be integrated into the main project later:
- Each feature is built as a standalone component with minimal dependencies
- UI is kept simple and compatible for easy integration
- Components are designed to be framework-agnostic where possible

### AI Assistant Components (현재 구현 완료)
Located in `/components/ai-assistant/`, these modules provide:

#### DataExtractor Component
- **Purpose**: Standalone data extraction from various file types
- **Path**: `/components/ai-assistant/DataExtractor.tsx`
- **Features**:
  - Multimodal file support (images, PDFs, audio, video)
  - Uses Gemini 2.5 Flash Lite for processing
  - Drag-and-drop file upload
  - JSON export and clipboard copy
  - Token usage tracking

#### DocumentGenerator Component
- **Purpose**: Standalone document/quote generation
- **Path**: `/components/ai-assistant/DocumentGenerator.tsx`
- **Features**:
  - Template-based quote generation
  - Client/project data integration
  - Multiple template options (standard, web, mobile, design)
  - Built-in markdown editor
  - HTML preview with A4 optimization
  - PDF export capability
  - Word document download

#### Supporting Components
- **DocumentEditor**: Markdown editor with save functionality
- **QuotePreview**: Professional HTML preview with print/PDF support
- **TokenUsageDisplay**: Real-time token usage and cost monitoring

#### Template System
- `/lib/quote-templates.ts`: Quote template definitions
  - Standard quote template
  - Web development project template
  - Mobile app development template
  - Design project template
- Automatic client/project data substitution
- AI fills in template placeholders intelligently
- Cost-effective document generation using Flash Lite model

#### API Route
- `/api/ai-assistant`: Unified endpoint for both extraction and generation
- Supports multipart/form-data for file uploads
- Supports JSON for document generation requests

### Environment Variables
```bash
# Google Gemini API만 사용 (OpenAI 제거)
GEMINI_API_KEY=your_gemini_api_key
```


# User-Specific Rules

- 답변은 한국어로만 해줘
- 오류 수정할 때마다 오답노트.md 에다가 에러 종류와 해결방법을 간단하게 요약해서 정리해줘

## 버전 체계
### 버전 구조
- **배포 버전**: `V{Major}.{Minor}.{Patch}_{YYMMDD}`
- **개발 버전**: `V{Major}.{Minor}.{Patch}_{YYMMDD}_REV{순차번호}`
### 버전 업데이트 규칙
- **Major (리팩토링급)**: 대규모 구조 변경, 호환성 깨짐, 아키텍처 재설계
- **Minor (기능추가급)**: 새로운 기능 추가, 기존 기능 개선
- **Patch (버그수정급)**: 버그 수정, 마이너 개선
- **REV (개발반복)**: 동일 버전 내 개발 진행 상황
- **배포 후 REV 초기화**: 배포 완료 시 REV 번호를 001부터 다시 시작
### 버전 증가 예시
- 버그 수정: `V1.0.1` → `V1.0.2`
- 기능 추가: `V1.0.2` → `V1.1.0`
- 리팩토링: `V1.1.0` → `V2.0.0`
- 개발 진행: `REV013` → `REV014`
- **배포 후**: `REV016` → `REV001` (초기화)