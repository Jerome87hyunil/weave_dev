// 견적서 템플릿 시스템

// 상세 계약서 템플릿 import
import { FREELANCE_CONTRACT_DETAILED } from './freelance-contract-template';
import { NDA_CONTRACT_DETAILED } from './nda-contract-template';
import { WEB_CONTRACT_DETAILED } from './web-contract-template';
import { SERVICE_CONTRACT_DETAILED } from './service-contract-template';
import { PERFORMANCE_CONTRACT_DETAILED } from './performance-contract-template';
import { LECTURE_CONTRACT_DETAILED } from './lecture-contract-template';
import { CONSULTING_CONTRACT_DETAILED } from './consulting-contract-template';
import { EDUCATION_CONTRACT_DETAILED } from './education-contract-template';
import { INFLUENCER_CONTRACT_DETAILED } from './influencer-contract-template';
import { MAINTENANCE_CONTRACT_DETAILED } from './maintenance-contract-template';
import { LICENSING_CONTRACT_DETAILED } from './licensing-contract-template';
import { ADVERTISING_CONTRACT_DETAILED } from './advertising-contract-template';
import { VIDEO_PRODUCTION_CONTRACT_DETAILED } from './video-production-contract-template';
import { DESIGN_CONTRACT_DETAILED } from './design-contract-template';
import { PHOTOGRAPHY_CONTRACT_DETAILED } from './photography-contract-template';
import { PUBLISHING_CONTRACT_DETAILED } from './publishing-contract-template';
import { TRANSLATION_CONTRACT_DETAILED } from './translation-contract-template';
import { SOFTWARE_CONTRACT_DETAILED, SOFTWARE_CONTRACT_SIMPLE } from './software-contract-template';

export interface ClientData {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  businessNumber?: string; // 사업자등록번호
}

export interface ProjectData {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  totalAmount?: number;
  paymentTerms?: string;
  deliverables?: string[];
  requirements?: string[];
}

export type DocumentType = 'quote' | 'contract' | 'invoice';

export interface QuoteTemplate {
  id: string;
  name: string;
  documentType: DocumentType;
  category: 'standard' | 'web' | 'mobile' | 'design' | 'marketing' | 'video' | 'consulting' | 'software' | 'freelance' | 'nda' | 'service' | 'performance' | 'education' | 'maintenance' | 'licensing' | 'creative';
  description: string;
  template: string;
  variables: string[]; // 템플릿에서 치환될 변수 목록
}

// 표준 견적서 템플릿
export const STANDARD_QUOTE_TEMPLATE: QuoteTemplate = {
  id: 'standard-quote',
  name: '표준 견적서',
  documentType: 'quote',
  category: 'standard',
  description: '일반적인 프리랜서 프로젝트용 표준 견적서',
  variables: ['CLIENT_NAME', 'CLIENT_COMPANY', 'PROJECT_TITLE', 'START_DATE', 'END_DATE', 'TOTAL_AMOUNT', 'PAYMENT_TERMS'],
  template: `
# 견적서

## 수신
- **고객명**: {{CLIENT_NAME}}
- **회사명**: {{CLIENT_COMPANY}}
- **연락처**: {{CLIENT_PHONE}}
- **이메일**: {{CLIENT_EMAIL}}
- **주소**: {{CLIENT_ADDRESS}}

## 공급자 정보
- **공급자명**: {{SUPPLIER_NAME}}
- **사업자등록번호**: {{SUPPLIER_BUSINESS_NUMBER}}
- **연락처**: {{SUPPLIER_PHONE}}
- **이메일**: {{SUPPLIER_EMAIL}}
- **주소**: {{SUPPLIER_ADDRESS}}

## 프로젝트 개요
- **프로젝트명**: {{PROJECT_TITLE}}
- **프로젝트 설명**: {{PROJECT_DESCRIPTION}}
- **작업 기간**: {{START_DATE}} ~ {{END_DATE}} ({{DURATION}})

## 견적 내역

| 항목 | 상세 내용 | 수량 | 단가 | 금액 |
|------|----------|------|------|------|
| {{ITEM_1}} | {{ITEM_1_DESC}} | {{ITEM_1_QTY}} | {{ITEM_1_PRICE}} | {{ITEM_1_TOTAL}} |
| {{ITEM_2}} | {{ITEM_2_DESC}} | {{ITEM_2_QTY}} | {{ITEM_2_PRICE}} | {{ITEM_2_TOTAL}} |
| {{ITEM_3}} | {{ITEM_3_DESC}} | {{ITEM_3_QTY}} | {{ITEM_3_PRICE}} | {{ITEM_3_TOTAL}} |

### 합계
- **공급가액**: {{SUPPLY_AMOUNT}}
- **부가세(10%)**: {{VAT_AMOUNT}}
- **총 금액**: {{TOTAL_AMOUNT}}

## 결제 조건
{{PAYMENT_TERMS}}

## 납품 사항
{{DELIVERABLES}}

## 유의 사항
1. 본 견적서의 유효기간은 발행일로부터 30일입니다.
2. 작업 범위 변경 시 추가 비용이 발생할 수 있습니다.
3. 부가세는 별도입니다.

---
**발행일**: {{ISSUE_DATE}}
**유효기간**: 발행일로부터 30일
`
};

// 웹 개발 견적서 템플릿
export const WEB_DEVELOPMENT_TEMPLATE: QuoteTemplate = {
  id: 'web-dev',
  name: '웹 개발 견적서',
  documentType: 'quote',
  category: 'web',
  description: '웹사이트 및 웹 애플리케이션 개발 프로젝트용',
  variables: ['CLIENT_NAME', 'PROJECT_TITLE', 'PAGES_COUNT', 'FEATURES', 'RESPONSIVE', 'CMS', 'HOSTING'],
  template: `
# 웹 개발 프로젝트 견적서

## 고객 정보
- **고객명**: {{CLIENT_NAME}}
- **회사명**: {{CLIENT_COMPANY}}
- **프로젝트명**: {{PROJECT_TITLE}}

## 개발 범위

### 기본 개발 사항
- **페이지 수**: {{PAGES_COUNT}}
- **반응형 디자인**: {{RESPONSIVE}}
- **CMS 구축**: {{CMS}}
- **호스팅 설정**: {{HOSTING}}

### 주요 기능
{{FEATURES}}

### 기술 스택
- **프론트엔드**: {{FRONTEND_STACK}}
- **백엔드**: {{BACKEND_STACK}}
- **데이터베이스**: {{DATABASE}}
- **호스팅**: {{HOSTING_SERVICE}}

## 개발 일정
| 단계 | 작업 내용 | 기간 | 산출물 |
|------|----------|------|--------|
| 1단계 | 기획 및 디자인 | {{PHASE_1_DURATION}} | 와이어프레임, 디자인 시안 |
| 2단계 | 프론트엔드 개발 | {{PHASE_2_DURATION}} | HTML/CSS/JS 구현 |
| 3단계 | 백엔드 개발 | {{PHASE_3_DURATION}} | 서버 및 DB 구축 |
| 4단계 | 테스트 및 배포 | {{PHASE_4_DURATION}} | 최종 배포 |

## 견적 금액
| 항목 | 내용 | 금액 |
|------|------|------|
| 기획/디자인 | UI/UX 디자인, 와이어프레임 | {{DESIGN_COST}} |
| 프론트엔드 개발 | {{PAGES_COUNT}} 페이지 구현 | {{FRONTEND_COST}} |
| 백엔드 개발 | 서버 및 API 개발 | {{BACKEND_COST}} |
| 기능 구현 | {{FEATURES_SUMMARY}} | {{FEATURES_COST}} |
| 테스트/배포 | QA 및 서버 배포 | {{DEPLOYMENT_COST}} |
| **합계** | | **{{TOTAL_AMOUNT}}** |

## 유지보수
- 무상 유지보수: 배포 후 {{FREE_MAINTENANCE_PERIOD}}
- 유상 유지보수: 월 {{MONTHLY_MAINTENANCE_COST}}

## 결제 조건
{{PAYMENT_TERMS}}

---
**견적 유효기간**: {{VALIDITY_PERIOD}}
`
};

// 모바일 앱 개발 견적서 템플릿
export const MOBILE_APP_TEMPLATE: QuoteTemplate = {
  id: 'mobile-app',
  name: '모바일 앱 개발 견적서',
  documentType: 'quote',
  category: 'mobile',
  description: 'iOS/Android 앱 개발 프로젝트용',
  variables: ['CLIENT_NAME', 'APP_NAME', 'PLATFORMS', 'FEATURES', 'APP_STORE_SUBMISSION'],
  template: `
# 모바일 앱 개발 견적서

## 프로젝트 정보
- **고객명**: {{CLIENT_NAME}}
- **앱 이름**: {{APP_NAME}}
- **플랫폼**: {{PLATFORMS}}

## 개발 범위

### 주요 기능
{{FEATURES}}

### 기술 사양
- **개발 프레임워크**: {{FRAMEWORK}}
- **백엔드 연동**: {{BACKEND_INTEGRATION}}
- **앱스토어 등록**: {{APP_STORE_SUBMISSION}}

## 개발 비용 산정
| 구분 | 항목 | 금액 |
|------|------|------|
| 기획/디자인 | UI/UX 디자인 | {{DESIGN_COST}} |
| 개발 | {{PLATFORMS}} 네이티브 개발 | {{DEVELOPMENT_COST}} |
| 백엔드 | 서버 API 개발 | {{BACKEND_COST}} |
| 테스트 | QA 테스트 | {{QA_COST}} |
| 배포 | 스토어 등록 및 배포 | {{DEPLOYMENT_COST}} |
| **총액** | | **{{TOTAL_AMOUNT}}** |

## 개발 일정
- **총 개발 기간**: {{TOTAL_DURATION}}
- **시작일**: {{START_DATE}}
- **완료 예정일**: {{END_DATE}}

---
**견적 유효기간**: {{VALIDITY_PERIOD}}
`
};

// 디자인 프로젝트 견적서 템플릿
export const DESIGN_TEMPLATE: QuoteTemplate = {
  id: 'design',
  name: '디자인 프로젝트 견적서',
  documentType: 'quote',
  category: 'design',
  description: '로고, 브랜딩, UI/UX 디자인 프로젝트용',
  variables: ['CLIENT_NAME', 'PROJECT_TYPE', 'DELIVERABLES', 'REVISIONS'],
  template: `
# 디자인 프로젝트 견적서

## 고객 정보
- **고객명**: {{CLIENT_NAME}}
- **프로젝트 유형**: {{PROJECT_TYPE}}

## 작업 범위

### 산출물
{{DELIVERABLES}}

### 작업 프로세스
1. 초기 컨셉 제안 ({{CONCEPTS_COUNT}}개 시안)
2. 선택안 정교화
3. 최종 디자인 완성
4. 파일 전달

### 수정 횟수
- **포함된 수정 횟수**: {{REVISIONS}}회
- **추가 수정**: 회당 {{REVISION_COST}}

## 견적 내역
| 항목 | 내용 | 금액 |
|------|------|------|
| 디자인 컨셉 | 초기 시안 {{CONCEPTS_COUNT}}개 | {{CONCEPT_COST}} |
| 디자인 개발 | 선택안 정교화 | {{DEVELOPMENT_COST}} |
| 최종 작업 | 파일 정리 및 가이드 제작 | {{FINALIZATION_COST}} |
| **합계** | | **{{TOTAL_AMOUNT}}** |

## 납품 파일 형식
{{FILE_FORMATS}}

---
**견적 유효기간**: {{VALIDITY_PERIOD}}
`
};

// 표준 계약서 템플릿
export const STANDARD_CONTRACT_TEMPLATE: QuoteTemplate = {
  id: 'standard-contract',
  name: '표준 용역 계약서',
  documentType: 'contract',
  category: 'standard',
  description: '프리랜서 용역 계약서 표준 양식',
  variables: ['CLIENT_NAME', 'CLIENT_COMPANY', 'PROJECT_TITLE', 'START_DATE', 'END_DATE', 'TOTAL_AMOUNT'],
  template: `
# 용역 계약서

## 계약 당사자

### 갑 (발주자)
- **회사명**: {{CLIENT_COMPANY}}
- **대표자**: {{CLIENT_NAME}}
- **사업자등록번호**: {{CLIENT_BUSINESS_NUMBER}}
- **주소**: {{CLIENT_ADDRESS}}
- **연락처**: {{CLIENT_PHONE}}

### 을 (수급자)
- **성명/상호**: {{SUPPLIER_NAME}}
- **사업자등록번호**: {{SUPPLIER_BUSINESS_NUMBER}}
- **주소**: {{SUPPLIER_ADDRESS}}
- **연락처**: {{SUPPLIER_PHONE}}

## 계약 내용

### 제1조 (계약의 목적)
본 계약은 갑이 을에게 의뢰한 "{{PROJECT_TITLE}}" 프로젝트(이하 "본 프로젝트")의 수행에 관한 제반 사항을 규정함을 목적으로 한다.

### 제2조 (용역의 내용)
을은 다음과 같은 용역을 수행한다:
{{PROJECT_DESCRIPTION}}

### 제3조 (계약 기간)
- **계약 기간**: {{START_DATE}} ~ {{END_DATE}}
- **총 기간**: {{DURATION}}

### 제4조 (계약 금액 및 지급 방법)
1. **총 계약 금액**: {{TOTAL_AMOUNT}} (부가세 포함)
2. **지급 방법**: {{PAYMENT_TERMS}}
3. **지급 계좌**: {{BANK_ACCOUNT}}

### 제5조 (납품 및 검수)
1. 을은 계약 기간 내에 다음의 산출물을 납품한다:
{{DELIVERABLES}}
2. 갑은 납품일로부터 7일 이내에 검수를 완료하여야 한다.
3. 검수 기간 내 이의를 제기하지 않을 경우 검수가 완료된 것으로 간주한다.

### 제6조 (지적재산권)
1. 본 프로젝트로 인해 발생한 모든 지적재산권은 대금 지급 완료 시 갑에게 귀속된다.
2. 을은 본 프로젝트 수행 과정에서 제3자의 지적재산권을 침해하지 않을 것을 보증한다.

### 제7조 (비밀유지)
1. 양 당사자는 본 계약과 관련하여 취득한 상대방의 영업비밀 및 기밀정보를 제3자에게 누설하여서는 안 된다.
2. 본 조항은 계약 종료 후에도 3년간 유효하다.

### 제8조 (계약의 해지)
1. 당사자 일방이 본 계약을 위반한 경우, 상대방은 서면으로 시정을 요구할 수 있다.
2. 시정 요구 후 7일 이내에 시정되지 않을 경우 계약을 해지할 수 있다.

### 제9조 (손해배상)
당사자 일방의 귀책사유로 인해 상대방에게 손해가 발생한 경우, 귀책 당사자는 상대방의 손해를 배상하여야 한다.

### 제10조 (기타)
1. 본 계약에 명시되지 않은 사항은 상호 협의하여 결정한다.
2. 본 계약과 관련한 분쟁은 갑의 소재지 관할 법원으로 한다.

본 계약의 체결을 증명하기 위하여 계약서 2부를 작성하여 갑과 을이 서명 날인 후 각 1부씩 보관한다.

**계약 체결일**: {{CONTRACT_DATE}}

**갑**: _____________________ (인)

**을**: _____________________ (인)
`
};

// 표준 청구서 템플릿
export const STANDARD_INVOICE_TEMPLATE: QuoteTemplate = {
  id: 'standard-invoice',
  name: '표준 세금계산서/청구서',
  documentType: 'invoice',
  category: 'standard',
  description: '프리랜서 세금계산서/청구서 표준 양식',
  variables: ['CLIENT_NAME', 'CLIENT_COMPANY', 'INVOICE_NUMBER', 'INVOICE_DATE', 'TOTAL_AMOUNT'],
  template: `
# 세금계산서

## 문서 정보
- **계산서 번호**: {{INVOICE_NUMBER}}
- **발행일**: {{INVOICE_DATE}}
- **공급일자**: {{SUPPLY_DATE}}

## 공급자 (매도자)
| 항목 | 내용 |
|------|------|
| 사업자등록번호 | {{SUPPLIER_BUSINESS_NUMBER}} |
| 상호 | {{SUPPLIER_NAME}} |
| 대표자 | {{SUPPLIER_REPRESENTATIVE}} |
| 주소 | {{SUPPLIER_ADDRESS}} |
| 업태 | {{SUPPLIER_BUSINESS_TYPE}} |
| 종목 | {{SUPPLIER_BUSINESS_ITEM}} |
| 연락처 | {{SUPPLIER_PHONE}} |
| 이메일 | {{SUPPLIER_EMAIL}} |

## 공급받는자 (매수자)
| 항목 | 내용 |
|------|------|
| 사업자등록번호 | {{CLIENT_BUSINESS_NUMBER}} |
| 상호 | {{CLIENT_COMPANY}} |
| 대표자 | {{CLIENT_NAME}} |
| 주소 | {{CLIENT_ADDRESS}} |
| 업태 | {{CLIENT_BUSINESS_TYPE}} |
| 종목 | {{CLIENT_BUSINESS_ITEM}} |

## 공급 내역

| 품목 | 규격 | 수량 | 단가 | 공급가액 | 세액 |
|------|------|------|------|----------|------|
| {{ITEM_1}} | {{ITEM_1_SPEC}} | {{ITEM_1_QTY}} | {{ITEM_1_PRICE}} | {{ITEM_1_AMOUNT}} | {{ITEM_1_TAX}} |
| {{ITEM_2}} | {{ITEM_2_SPEC}} | {{ITEM_2_QTY}} | {{ITEM_2_PRICE}} | {{ITEM_2_AMOUNT}} | {{ITEM_2_TAX}} |
| {{ITEM_3}} | {{ITEM_3_SPEC}} | {{ITEM_3_QTY}} | {{ITEM_3_PRICE}} | {{ITEM_3_AMOUNT}} | {{ITEM_3_TAX}} |

## 합계 금액

| 구분 | 금액 |
|------|------|
| 공급가액 | {{SUPPLY_AMOUNT}} |
| 세액 | {{TAX_AMOUNT}} |
| **총 합계** | **{{TOTAL_AMOUNT}}** |

### 금액 (한글): {{TOTAL_AMOUNT_KOREAN}}

## 결제 정보
- **결제 조건**: {{PAYMENT_TERMS}}
- **결제 기한**: {{PAYMENT_DUE_DATE}}
- **입금 계좌**: {{BANK_ACCOUNT}}

## 비고
{{NOTES}}

---

위 금액을 청구합니다.

**발행일**: {{INVOICE_DATE}}

**공급자**: {{SUPPLIER_NAME}} (인)
`
};

// 소프트웨어 개발 용역 계약서 템플릿
export const SOFTWARE_DEVELOPMENT_CONTRACT_TEMPLATE: QuoteTemplate = {
  id: 'software-dev-contract',
  name: '소프트웨어 개발 용역 계약서',
  documentType: 'contract',
  category: 'software',
  description: 'IT/소프트웨어 개발 프로젝트 전문 계약서',
  variables: ['CLIENT_NAME', 'CLIENT_COMPANY', 'PROJECT_TITLE', 'START_DATE', 'END_DATE', 'TOTAL_AMOUNT'],
  template: `
# 소프트웨어 개발 용역 계약서

**계약번호**: {{CONTRACT_NUMBER}}
**계약일자**: {{CONTRACT_DATE}}

## 전문

{{CLIENT_COMPANY}}(이하 "갑"이라 한다)과 {{SUPPLIER_NAME}}(이하 "을"이라 한다)은 소프트웨어 개발 용역에 관하여 다음과 같이 계약을 체결하고, 신의성실의 원칙에 따라 이를 준수할 것을 서약한다.

## 계약 당사자

### "갑" (발주자)
- 상호/성명: {{CLIENT_COMPANY}}
- 대표자: {{CLIENT_NAME}}
- 사업자등록번호: {{CLIENT_BUSINESS_NUMBER}}
- 법인등록번호: {{CLIENT_CORP_NUMBER}}
- 사업장 소재지: {{CLIENT_ADDRESS}}
- 대표전화: {{CLIENT_PHONE}}
- 팩스: {{CLIENT_FAX}}
- 이메일: {{CLIENT_EMAIL}}

### "을" (수급자/개발자)
- 상호/성명: {{SUPPLIER_NAME}}
- 대표자: {{SUPPLIER_REPRESENTATIVE}}
- 사업자등록번호: {{SUPPLIER_BUSINESS_NUMBER}}
- 생년월일/법인등록번호: {{SUPPLIER_ID_NUMBER}}
- 사업장 소재지: {{SUPPLIER_ADDRESS}}
- 대표전화: {{SUPPLIER_PHONE}}
- 팩스: {{SUPPLIER_FAX}}
- 이메일: {{SUPPLIER_EMAIL}}
- 계좌정보: {{BANK_NAME}} {{BANK_ACCOUNT}} (예금주: {{ACCOUNT_HOLDER}})

## 제1조 (계약의 목적)
① 본 계약은 "갑"이 "을"에게 위탁하는 소프트웨어 개발 용역(이하 "본 프로젝트"라 한다)의 수행에 관한 제반 사항과 당사자 간의 권리·의무를 명확히 규정함을 목적으로 한다.
② "을"은 본 계약에서 정한 바에 따라 성실하게 용역을 수행하고, "갑"은 그 대가를 지급한다.
③ 본 계약서에 명시되지 않은 사항은 관계 법령, 일반 상관례 및 신의성실의 원칙에 따라 상호 협의하여 결정한다.

## 제2조 (용역의 내용 및 범위)
① **프로젝트명**: {{PROJECT_TITLE}}
② **개발 내용**: 
   {{PROJECT_DESCRIPTION}}
③ **세부 개발 범위**:
   1. 요구사항 분석 및 설계
      - 시스템 요구사항 정의서 작성
      - 기능 명세서 작성
      - UI/UX 설계서 작성
      - 데이터베이스 설계서 작성
      - 시스템 아키텍처 설계
   2. 개발 구현
      - 프론트엔드 개발: {{FRONTEND_SCOPE}}
      - 백엔드 개발: {{BACKEND_SCOPE}}
      - 데이터베이스 구축: {{DATABASE_SCOPE}}
      - API 개발: {{API_SCOPE}}
      - 써드파티 연동: {{THIRD_PARTY_SCOPE}}
   3. 테스트 및 품질보증
      - 단위 테스트
      - 통합 테스트
      - 시스템 테스트
      - 사용자 인수 테스트(UAT)
      - 성능 테스트
      - 보안 취약점 점검
④ **기술 사양**:
   - 개발 언어: {{PROGRAMMING_LANGUAGES}}
   - 프레임워크: {{FRAMEWORKS}}
   - 데이터베이스: {{DATABASE_SYSTEM}}
   - 운영체제: {{OPERATING_SYSTEM}}
   - 타겟 플랫폼: {{TARGET_PLATFORM}}
   - 지원 브라우저: {{SUPPORTED_BROWSERS}}
⑤ **제외 사항**: {{EXCLUSIONS}}

## 제3조 (용역 수행 기간)
① **전체 계약 기간**: {{START_DATE}} ~ {{END_DATE}} (총 {{DURATION}})
② **단계별 일정 및 마일스톤**:
   1. 1단계 - 요구사항 분석 및 설계
      - 기간: {{PHASE_1_START}} ~ {{PHASE_1_END}}
      - 산출물: 요구사항 정의서, 설계 문서
   2. 2단계 - 개발 구현
      - 기간: {{PHASE_2_START}} ~ {{PHASE_2_END}}
      - 산출물: 개발 소스코드, 단위테스트 결과
   3. 3단계 - 통합 및 테스트
      - 기간: {{PHASE_3_START}} ~ {{PHASE_3_END}}
      - 산출물: 통합 시스템, 테스트 결과서
   4. 4단계 - 배포 및 안정화
      - 기간: {{PHASE_4_START}} ~ {{PHASE_4_END}}
      - 산출물: 운영 시스템, 운영 매뉴얼
③ 천재지변, 전쟁, 내란, 파업, 태업, 정부의 명령 등 불가항력적 사유로 인한 지연은 지체일수에 산입하지 아니한다.
④ "갑"의 요구사항 변경이나 승인 지연으로 인한 일정 지연은 "을"의 책임이 아니며, 이 경우 일정은 상호 협의하여 조정한다.

## 제4조 (계약 금액)
① **총 계약 금액**: ₩{{TOTAL_AMOUNT}} (금 {{TOTAL_AMOUNT_KOREAN}})
   - 공급가액: ₩{{SUPPLY_AMOUNT}}
   - 부가가치세(10%): ₩{{VAT_AMOUNT}}
② 본 계약 금액은 본 계약에 명시된 용역 범위에 한하며, 추가 요구사항 발생 시 별도 협의한다.
③ 계약 금액에는 개발에 필요한 모든 비용(인건비, 경비, 기술료 등)이 포함된 것으로 본다.

## 제5조 (대금 지급 방법 및 조건)
① **지급 일정**:
   1. 계약금: 계약 체결일로부터 7일 이내 - ₩{{DOWN_PAYMENT}} (총액의 30%)
   2. 1차 중도금: 2단계 완료 시 - ₩{{FIRST_PROGRESS_PAYMENT}} (총액의 30%)
   3. 2차 중도금: 3단계 완료 시 - ₩{{SECOND_PROGRESS_PAYMENT}} (총액의 20%)
   4. 잔금: 최종 검수 완료 후 7일 이내 - ₩{{FINAL_PAYMENT}} (총액의 20%)
② **지급 방법**: 
   1. "을"은 각 단계별 완료 시 세금계산서를 발행한다.
   2. "갑"은 세금계산서 수령 후 7일 이내에 지정 계좌로 입금한다.
   3. 지급 계좌: {{BANK_NAME}} {{BANK_ACCOUNT}} (예금주: {{ACCOUNT_HOLDER}})
③ "갑"이 정당한 사유 없이 대금 지급을 지연하는 경우, 지연일수에 대하여 연 15%의 지연이자를 "을"에게 지급한다.
④ "을"의 귀책사유로 인한 하자 보수 기간 중에는 대금 지급을 보류할 수 있다.

## 제6조 (용역 수행 방법)
① "을"은 본 계약의 내용에 따라 용역을 성실히 수행하여야 한다.
② "을"은 용역 수행에 필요한 인력을 적기에 투입하고, 투입 인력의 명단을 "갑"에게 제출한다.
③ "을"은 주 1회 이상 진행 상황을 "갑"에게 서면 또는 이메일로 보고한다.
④ "갑"은 필요시 "을"에게 용역 수행 상황에 대한 보고를 요구할 수 있으며, "을"은 이에 성실히 응해야 한다.
⑤ 용역 수행 장소는 원칙적으로 "을"의 사업장으로 하되, 필요시 "갑"과 협의하여 변경할 수 있다.
⑥ "을"은 용역 수행 중 "갑"의 정당한 요구사항을 최대한 반영하도록 노력한다.

## 제7조 (산출물 및 납품)
① "을"이 "갑"에게 납품해야 할 산출물은 다음과 같다:
   1. 소스 코드 일체 (주석 포함)
   2. 실행 파일 및 설치 프로그램
   3. 요구사항 정의서
   4. 시스템 설계서 (UI/UX, DB, 아키텍처)
   5. API 명세서
   6. 테스트 시나리오 및 결과서
   7. 사용자 매뉴얼
   8. 운영자 매뉴얼
   9. 설치 가이드
   10. 소스 코드 빌드 및 배포 가이드
② 모든 산출물은 한글 또는 "갑"이 요구하는 언어로 작성한다.
③ 산출물은 전자 파일 형태로 납품하며, "갑"의 요청 시 인쇄물도 제공한다.
④ 납품은 "갑"이 지정하는 장소에서 이루어지며, 납품에 소요되는 비용은 "을"이 부담한다.

## 제8조 (검수 및 인수)
① "을"은 각 단계별 산출물 완료 시 "갑"에게 서면으로 검수를 요청한다.
② "갑"은 검수 요청일로부터 14일 이내에 검수를 완료하고 그 결과를 "을"에게 서면으로 통보한다.
③ 검수 결과 수정 또는 보완이 필요한 경우:
   1. "갑"은 구체적인 수정 요구사항을 서면으로 제시한다.
   2. "을"은 수정 요구사항을 접수한 날로부터 7일 이내에 수정·보완하여 재검수를 요청한다.
   3. 계약 범위 내의 수정은 2회까지 무상으로 수행한다.
④ "갑"이 검수 요청 접수 후 14일 이내에 검수 결과를 통보하지 않은 경우, 이의가 없는 것으로 간주하여 검수가 완료된 것으로 본다.
⑤ 최종 검수 완료 시 "갑"과 "을"은 검수 확인서를 작성한다.

## 제9조 (지적재산권)
① 본 프로젝트의 수행 과정에서 발생한 모든 지적재산권(저작권, 특허권, 실용신안권, 디자인권, 상표권 등)은 "갑"이 "을"에게 대금을 완납한 때에 "갑"에게 양도된다.
② "을"은 본 프로젝트 결과물에 제3자의 지적재산권을 침해하는 내용이 포함되지 않았음을 보증한다.
③ 만약 제3자로부터 지적재산권 침해 주장이 제기될 경우:
   1. "을"은 자신의 비용과 책임으로 "갑"을 방어하고 면책시켜야 한다.
   2. 침해가 인정될 경우, "을"은 계속 사용 가능하도록 필요한 권리를 확보하거나 침해되지 않도록 수정한다.
④ 오픈소스 소프트웨어 사용:
   1. "을"은 오픈소스 사용 시 사전에 "갑"의 서면 동의를 받아야 한다.
   2. 사용된 오픈소스의 목록과 라이선스 조건을 문서화하여 제공한다.
   3. GPL 등 전염성 라이선스는 "갑"의 명시적 동의 없이 사용할 수 없다.
⑤ "을"은 본 프로젝트의 결과물을 "갑"의 사전 서면 동의 없이 다른 용도로 사용하거나 제3자에게 제공할 수 없다.

## 제10조 (비밀유지)
① 당사자들은 본 계약의 체결 및 이행 과정에서 알게 된 상대방의 영업비밀, 기술정보, 경영정보 등 일체의 비밀정보를 제3자에게 누설하거나 본 계약 목적 외에 사용하여서는 아니 된다.
② 비밀정보의 범위:
   1. 당사자가 비밀이라고 표시한 모든 정보
   2. 일반적으로 공개되지 않은 기술적, 영업적 정보
   3. 고객 정보, 마케팅 전략, 사업 계획
   4. 소스 코드, 알고리즘, 시스템 구조
③ 다음의 경우는 비밀유지 의무에서 제외된다:
   1. 공지의 사실이거나 정보 수령 당사자의 귀책사유 없이 공지가 된 정보
   2. 정보 제공 당사자가 제3자에게 비밀유지 의무 없이 제공한 정보
   3. 법원의 명령이나 관계 법령에 의해 공개가 요구되는 정보
④ 비밀유지 의무는 계약 종료 후 5년간 유효하다.
⑤ "을"은 프로젝트 종료 시 "갑"으로부터 제공받은 모든 자료를 반환하거나 "갑"의 요청에 따라 폐기하고, 폐기 확인서를 제출한다.
⑥ 비밀유지 의무 위반 시 위반 당사자는 상대방에게 발생한 모든 손해를 배상한다.

## 제11조 (하자보수)
① "을"은 최종 검수 완료일로부터 12개월간 무상 하자보수를 제공한다.
② 하자보수의 범위:
   1. 프로그램 오류(버그) 수정
   2. 요구사항과 불일치하는 기능 수정
   3. 성능 저하 문제 해결
   4. 보안 취약점 패치
   5. 시스템 장애 복구 지원
③ 다음의 경우는 무상 하자보수 대상에서 제외되며, 별도 협의 후 유상으로 처리한다:
   1. "갑"의 요구사항 변경 또는 추가
   2. "갑" 또는 제3자의 시스템 수정으로 인한 오류
   3. "갑"의 운영 미숙 또는 고의·과실로 인한 장애
   4. 운영 환경(H/W, S/W, Network 등)의 변경으로 인한 문제
   5. 천재지변 등 불가항력적 사유로 인한 장애
④ 하자보수 대응 시간:
   1. 긴급(시스템 다운): 통보 후 2시간 이내 대응 착수
   2. 높음(주요 기능 오류): 통보 후 4시간 이내 대응 착수
   3. 보통(일반 오류): 통보 후 24시간 이내 대응 착수
   4. 낮음(경미한 오류): 통보 후 48시간 이내 대응 착수
⑤ "을"은 하자보수 기간 중 월 1회 정기 점검을 실시하고, 점검 보고서를 제출한다.

## 제12조 (요구사항 변경 관리)
① "갑"이 계약 체결 후 요구사항을 변경하고자 하는 경우, 변경요청서를 "을"에게 제출한다.
② "을"은 변경요청서 접수 후 5일 이내에 영향도 분석서(일정, 비용, 리스크)를 제출한다.
③ 변경사항이 다음에 해당하는 경우 추가 비용이 발생할 수 있다:
   1. 기능 추가 또는 확대
   2. 성능 요구사항 상향
   3. 인터페이스 추가 또는 변경
   4. 기술 아키텍처 변경
④ 추가 비용은 투입 공수를 기준으로 산정하며, M/M당 단가는 {{MM_UNIT_PRICE}}원으로 한다.
⑤ 변경사항은 양 당사자가 서명한 변경 합의서를 통해 확정된다.

## 제13조 (지체상금)
① "을"이 계약 기간 내에 용역을 완료하지 못한 경우, 지체일수에 대하여 계약 금액의 1000분의 3에 해당하는 지체상금을 "갑"에게 지급한다.
② 지체상금은 총 계약 금액의 10%를 초과할 수 없다.
③ 다음의 경우는 지체일수에 산입하지 않는다:
   1. "갑"의 귀책사유로 인한 지연
   2. 천재지변 등 불가항력적 사유
   3. "갑"의 요구사항 변경으로 인한 일정 조정
④ "갑"은 지체상금을 "을"에게 지급할 대금에서 공제할 수 있다.

## 제14조 (계약의 해제 또는 해지)
① 당사자는 다음의 경우 본 계약을 해제 또는 해지할 수 있다:
   1. 상대방이 본 계약상 의무를 위반하고, 서면 시정 요구 후 14일 이내에 시정하지 않는 경우
   2. 상대방이 부도, 파산, 화의, 워크아웃, 회생절차 개시 등 정상적인 계약 이행이 불가능한 경우
   3. 상대방이 영업정지, 영업취소 등 행정처분을 받은 경우
   4. 기타 계약 목적을 달성할 수 없다고 인정되는 중대한 사유가 발생한 경우
② 계약 해제 또는 해지 시 정산:
   1. "을"의 귀책사유로 인한 경우: "을"은 수령한 금액 전액을 반환하고, "갑"에게 발생한 손해를 배상한다.
   2. "갑"의 귀책사유로 인한 경우: "갑"은 기 수행된 부분에 대한 대가를 지급하고, "을"에게 발생한 손해를 배상한다.
   3. 쌍방 귀책사유 또는 불가항력의 경우: 기 수행 부분까지 정산한다.
③ 계약 해제 또는 해지 시 "을"은 작업 중인 모든 자료와 산출물을 현재 상태대로 "갑"에게 인도한다.

## 제15조 (손해배상)
① 당사자 일방의 귀책사유로 상대방에게 손해가 발생한 경우, 귀책 당사자는 상대방의 손해를 배상한다.
② 손해배상의 범위는 통상손해로 한정하며, 특별한 사정으로 인한 손해는 귀책 당사자가 그 사정을 알았거나 알 수 있었을 때에 한하여 배상 책임을 진다.
③ "을"의 손해배상 한도는 본 계약 금액의 100%를 초과하지 않는다. 단, 고의 또는 중과실로 인한 손해는 예외로 한다.
④ 간접 손해, 파생적 손해, 일실이익, 데이터 손실로 인한 손해는 배상 범위에서 제외한다.

## 제16조 (보험)
① "을"은 용역 수행과 관련하여 발생할 수 있는 손해를 보전하기 위해 적절한 보험에 가입할 수 있다.
② 보험 가입 시 "갑"을 추가 피보험자로 지정하고, 보험증권 사본을 "갑"에게 제출한다.

## 제17조 (권리·의무의 양도 금지)
① 당사자는 상대방의 사전 서면 동의 없이 본 계약상의 권리·의무를 제3자에게 양도하거나 담보로 제공할 수 없다.
② "을"은 "갑"의 사전 서면 동의 없이 용역의 전부 또는 일부를 제3자에게 하도급할 수 없다.
③ "갑"의 동의를 받아 하도급하는 경우에도 "을"은 본 계약상의 모든 책임을 부담한다.

## 제18조 (불가항력)
① 천재지변, 전쟁, 내란, 폭동, 파업, 전염병, 정부의 명령 등 당사자가 통제할 수 없는 불가항력적 사유로 인하여 계약을 이행할 수 없는 경우, 그 이행 의무는 불가항력 사유가 존속하는 기간 동안 정지된다.
② 불가항력 사유가 발생한 당사자는 즉시 상대방에게 그 사실을 서면으로 통지하고, 그 영향을 최소화하기 위해 노력한다.
③ 불가항력 사유가 90일 이상 계속되는 경우, 당사자는 협의하여 계약을 해지할 수 있다.

## 제19조 (분쟁 해결)
① 본 계약과 관련하여 발생하는 모든 분쟁은 당사자 간 상호 협의하여 우호적으로 해결한다.
② 협의가 이루어지지 않을 경우, 한국소프트웨어산업협회의 조정을 받을 수 있다.
③ 조정이 성립되지 않을 경우, 대한상사중재원의 중재규칙에 따른 중재로 최종 해결한다.
④ 중재지는 서울특별시로 하고, 중재언어는 한국어로 한다.

## 제20조 (일반 조항)
① 본 계약의 수정이나 변경은 당사자 간 서면 합의에 의해서만 효력이 발생한다.
② 본 계약의 일부 조항이 무효가 되더라도 나머지 조항의 효력에는 영향을 미치지 않는다.
③ 본 계약은 대한민국 법률에 따라 규율되고 해석된다.
④ 본 계약서는 2부를 작성하여 "갑"과 "을"이 서명 날인 후 각 1부씩 보관한다.
⑤ 본 계약과 관련된 모든 통지는 계약서에 기재된 주소로 서면 또는 이메일로 발송한다.

## 제21조 (특약 사항)
{{SPECIAL_TERMS}}

위 계약을 증명하기 위하여 계약 당사자는 본 계약서 2부를 작성하여 서명 날인한 후 각 1부씩 보관한다.

**계약 체결일**: {{CONTRACT_DATE}}

---

### 계약 당사자

**"갑" (발주자)**
{{CLIENT_COMPANY}}
대표이사 {{CLIENT_NAME}}

서명: _____________________ 

날인: (인)

---

**"을" (수급자)**
{{SUPPLIER_NAME}}
대표 {{SUPPLIER_REPRESENTATIVE}}

서명: _____________________ 

날인: (인)

---

### 첨부 서류
1. 상세 요구사항 명세서
2. 프로젝트 일정표
3. 견적서
4. 사업자등록증 사본 (양 당사자)
5. 통장 사본 ("을")
6. 인감증명서 (필요시)
7. 법인등기부등본 (법인의 경우)
`
};

// 프리랜서 용역 계약서 템플릿
export const FREELANCE_CONTRACT_TEMPLATE: QuoteTemplate = {
  id: 'freelance-contract',
  name: '프리랜서 용역 계약서',
  documentType: 'contract',
  category: 'freelance',
  description: '일반 프리랜서 업무용 표준 계약서',
  variables: ['CLIENT_NAME', 'CLIENT_COMPANY', 'PROJECT_TITLE', 'START_DATE', 'END_DATE', 'TOTAL_AMOUNT'],
  template: `
# 프리랜서 용역 계약서

## 계약 당사자

**위탁자** (이하 "갑")
- 회사명: {{CLIENT_COMPANY}}
- 대표자: {{CLIENT_NAME}}
- 사업자등록번호: {{CLIENT_BUSINESS_NUMBER}}
- 주소: {{CLIENT_ADDRESS}}

**수탁자** (이하 "을")
- 성명: {{SUPPLIER_NAME}}
- 주민등록번호/사업자등록번호: {{SUPPLIER_BUSINESS_NUMBER}}
- 주소: {{SUPPLIER_ADDRESS}}
- 연락처: {{SUPPLIER_PHONE}}

## 제1조 (목적)
본 계약은 "갑"이 "을"에게 위탁하는 업무의 내용과 그에 따른 권리, 의무 및 책임사항을 명확히 하는 것을 목적으로 한다.

## 제2조 (업무 내용)
1. **프로젝트명**: {{PROJECT_TITLE}}
2. **업무 범위**: {{PROJECT_DESCRIPTION}}
3. **작업 장소**: {{WORK_LOCATION}}
4. **산출물**: {{DELIVERABLES}}

## 제3조 (계약 기간)
- **계약 기간**: {{START_DATE}} ~ {{END_DATE}}
- **총 기간**: {{DURATION}}

## 제4조 (용역 대금)
1. **총 금액**: {{TOTAL_AMOUNT}} (부가세 포함)
2. **지급 방법**: {{PAYMENT_TERMS}}
3. **지급 시기**: 
   - 선금: 계약 체결 시 {{DOWN_PAYMENT_PERCENT}}
   - 잔금: 용역 완료 후 {{FINAL_PAYMENT_PERCENT}}
4. **정산 방법**: 세금계산서 또는 계산서 발행 후 7일 이내

## 제5조 (업무 수행 방법)
1. "을"은 본 계약에 정한 업무를 성실히 수행한다.
2. "을"은 업무 수행 중 "갑"의 정당한 요구가 있을 때 이에 따른다.
3. "을"은 주 {{WEEKLY_REPORT}} 진행 상황을 "갑"에게 보고한다.

## 제6조 (자료 제공 및 반환)
1. "갑"은 "을"의 업무 수행에 필요한 자료를 제공한다.
2. "을"은 계약 종료 시 "갑"으로부터 제공받은 모든 자료를 반환한다.

## 제7조 (권리 귀속)
1. 본 계약에 따라 "을"이 작성한 모든 결과물의 지적재산권은 대금 지급 완료 시 "갑"에게 귀속된다.
2. "을"은 "갑"의 사전 동의 없이 결과물을 제3자에게 제공하거나 다른 용도로 사용할 수 없다.

## 제8조 (비밀유지)
1. "을"은 업무 수행 과정에서 알게 된 "갑"의 영업비밀을 제3자에게 누설하지 않는다.
2. 이 의무는 계약 종료 후에도 {{CONFIDENTIALITY_PERIOD}}간 유효하다.

## 제9조 (손해배상)
1. "을"의 고의 또는 과실로 "갑"에게 손해가 발생한 경우 "을"은 그 손해를 배상한다.
2. 천재지변 등 불가항력으로 인한 손해는 면책된다.

## 제10조 (계약 해지)
다음의 경우 즉시 계약을 해지할 수 있다:
1. 일방이 본 계약을 위반하고 시정 요구 후 7일 이내 시정하지 않는 경우
2. "을"이 업무를 계속 수행할 수 없는 부득이한 사유가 발생한 경우

## 제11조 (기타)
1. 본 계약에 명시되지 않은 사항은 민법 및 상법의 규정에 따른다.
2. 본 계약과 관련한 분쟁은 상호 협의하여 해결하고, 협의가 이루어지지 않을 경우 "갑" 소재지 관할 법원에서 해결한다.

**계약 체결일**: {{CONTRACT_DATE}}

**갑**: _____________________ (인)

**을**: _____________________ (인)
`
};

// 비밀유지계약서(NDA) 템플릿
export const NDA_CONTRACT_TEMPLATE: QuoteTemplate = {
  id: 'nda-contract',
  name: '비밀유지계약서 (NDA)',
  documentType: 'contract',
  category: 'nda',
  description: '기밀 정보 보호를 위한 비밀유지계약서',
  variables: ['PARTY_A_NAME', 'PARTY_A_COMPANY', 'PARTY_B_NAME', 'PARTY_B_COMPANY', 'PROJECT_PURPOSE'],
  template: `
# 비밀유지계약서
(Non-Disclosure Agreement)

## 계약 당사자

**정보 제공자** (이하 "갑")
- 회사명: {{PARTY_A_COMPANY}}
- 대표자: {{PARTY_A_NAME}}
- 사업자등록번호: {{PARTY_A_BUSINESS_NUMBER}}
- 주소: {{PARTY_A_ADDRESS}}

**정보 수령자** (이하 "을")
- 회사명/성명: {{PARTY_B_COMPANY}}
- 대표자: {{PARTY_B_NAME}}
- 사업자등록번호: {{PARTY_B_BUSINESS_NUMBER}}
- 주소: {{PARTY_B_ADDRESS}}

양 당사자는 {{PROJECT_PURPOSE}}을(를) 위하여 상호 간 정보를 교환함에 있어 다음과 같이 비밀유지계약을 체결한다.

## 제1조 (목적)
본 계약은 "갑"과 "을"이 {{PROJECT_PURPOSE}}을(를) 위한 협의 과정에서 상호 제공하는 정보의 비밀유지에 관한 사항을 규정함을 목적으로 한다.

## 제2조 (비밀정보의 정의)
"비밀정보"란 본 계약의 목적과 관련하여 일방이 상대방에게 제공하는 다음의 정보를 의미한다:
1. 기술정보: 기술자료, 설계도, 도면, 공정, 노하우, 발명, 연구개발 정보
2. 경영정보: 재무정보, 사업계획, 마케팅 전략, 고객정보, 가격정보
3. 기타 일방이 비밀이라고 지정한 모든 정보
4. 구두로 제공된 정보 중 제공 후 7일 이내에 서면으로 비밀임을 통지한 정보

## 제3조 (비밀정보의 예외)
다음의 정보는 비밀정보에서 제외된다:
1. 제공 당시 이미 공지된 정보
2. 제공 후 수령 당사자의 책임 없이 공지된 정보
3. 제공 이전에 수령 당사자가 적법하게 보유하고 있던 정보
4. 제3자로부터 비밀유지 의무 없이 적법하게 제공받은 정보
5. 비밀정보를 이용하지 않고 독자적으로 개발한 정보

## 제4조 (비밀유지 의무)
1. 양 당사자는 상대방의 비밀정보를 본 계약의 목적 외에 사용하지 않는다.
2. 상대방의 사전 서면 동의 없이 비밀정보를 제3자에게 공개하지 않는다.
3. 비밀정보를 자신의 비밀정보와 동일한 주의의무로 관리한다.
4. 비밀정보에 접근하는 임직원을 업무상 필요한 최소한으로 제한한다.
5. 비밀정보를 복사, 복제할 경우 원본과 동일한 비밀유지 조치를 취한다.

## 제5조 (비밀정보의 반환)
1. 일방의 요구가 있거나 계약이 종료된 경우, 상대방의 모든 비밀정보를 즉시 반환하거나 파기한다.
2. 반환 또는 파기 후 그 사실을 서면으로 통지한다.

## 제6조 (비밀유지 기간)
본 계약상 비밀유지 의무는 계약 체결일로부터 {{CONFIDENTIALITY_PERIOD}}간 유효하다.

## 제7조 (손해배상)
1. 일방이 본 계약을 위반하여 상대방에게 손해가 발생한 경우, 위반 당사자는 그 손해를 배상한다.
2. 손해배상액은 실제 발생한 손해를 기준으로 한다.

## 제8조 (법적 공개 요구)
법원 또는 정부기관의 적법한 명령에 의해 비밀정보를 공개해야 하는 경우:
1. 즉시 상대방에게 통지한다.
2. 법적으로 요구되는 최소한의 범위 내에서만 공개한다.
3. 공개된 정보가 비밀로 취급되도록 최선의 노력을 한다.

## 제9조 (권리 불발생)
본 계약은 비밀정보에 대한 비밀유지 의무만을 규정하며, 어떠한 라이선스나 지적재산권도 부여하지 않는다.

## 제10조 (완전 합의)
본 계약은 비밀유지에 관한 양 당사자 간의 완전한 합의를 구성하며, 이전의 모든 구두 또는 서면 합의를 대체한다.

## 제11조 (준거법 및 관할)
1. 본 계약은 대한민국 법률에 따라 해석된다.
2. 본 계약과 관련한 분쟁은 {{JURISDICTION}} 관할 법원에서 해결한다.

본 계약을 증명하기 위하여 계약서 2부를 작성하여 양 당사자가 서명 날인 후 각 1부씩 보관한다.

**계약 체결일**: {{CONTRACT_DATE}}

**갑**: _____________________ (인)

**을**: _____________________ (인)
`
};

// 웹사이트 제작 계약서 템플릿
export const WEBSITE_CONTRACT_TEMPLATE: QuoteTemplate = {
  id: 'website-contract',
  name: '웹사이트 제작 계약서',
  documentType: 'contract',
  category: 'web',
  description: '웹사이트 개발 프로젝트 전문 계약서',
  variables: ['CLIENT_NAME', 'CLIENT_COMPANY', 'PROJECT_TITLE', 'DOMAIN_URL', 'START_DATE', 'END_DATE'],
  template: `
# 웹사이트 제작 계약서

## 계약 당사자

**발주자** (이하 "갑")
- 회사명: {{CLIENT_COMPANY}}
- 대표자: {{CLIENT_NAME}}
- 사업자등록번호: {{CLIENT_BUSINESS_NUMBER}}
- 주소: {{CLIENT_ADDRESS}}
- 연락처: {{CLIENT_PHONE}}

**제작자** (이하 "을")
- 회사명/성명: {{SUPPLIER_NAME}}
- 사업자등록번호: {{SUPPLIER_BUSINESS_NUMBER}}
- 주소: {{SUPPLIER_ADDRESS}}
- 연락처: {{SUPPLIER_PHONE}}

## 제1조 (계약의 목적)
본 계약은 "갑"이 "을"에게 의뢰한 웹사이트 제작에 관한 권리, 의무 및 책임사항을 명확히 함을 목적으로 한다.

## 제2조 (프로젝트 개요)
1. **웹사이트명**: {{PROJECT_TITLE}}
2. **도메인**: {{DOMAIN_URL}}
3. **제작 유형**: {{WEBSITE_TYPE}}
4. **주요 기능**: {{MAIN_FEATURES}}

## 제3조 (제작 범위)
"을"이 제작하는 웹사이트의 범위는 다음과 같다:
1. **페이지 구성**:
   - 메인 페이지: {{MAIN_PAGE_COUNT}}
   - 서브 페이지: {{SUB_PAGE_COUNT}}
   - 관리자 페이지: {{ADMIN_PAGE}}

2. **기능 구현**:
   - 회원가입/로그인: {{MEMBERSHIP_FEATURE}}
   - 게시판: {{BOARD_FEATURE}}
   - 검색 기능: {{SEARCH_FEATURE}}
   - 결제 시스템: {{PAYMENT_FEATURE}}
   - 기타: {{OTHER_FEATURES}}

3. **디자인**:
   - 반응형 웹 디자인 (PC/태블릿/모바일)
   - 브라우저 호환성: {{BROWSER_COMPATIBILITY}}

## 제4조 (제작 일정)
1. **전체 기간**: {{START_DATE}} ~ {{END_DATE}}
2. **단계별 일정**:
   - 기획/디자인: {{PLANNING_DURATION}}
   - 퍼블리싱: {{PUBLISHING_DURATION}}
   - 프로그래밍: {{PROGRAMMING_DURATION}}
   - 테스트/수정: {{TESTING_DURATION}}

## 제5조 (계약 금액 및 지급)
1. **총 제작비**: {{TOTAL_AMOUNT}} (부가세 포함)
2. **지급 일정**:
   - 계약금 (30%): 계약 시 {{DOWN_PAYMENT}}
   - 중도금 (40%): 디자인 완료 시 {{MIDDLE_PAYMENT}}
   - 잔금 (30%): 최종 완료 시 {{FINAL_PAYMENT}}
3. **추가 비용**: 계약 범위 외 추가 요청 시 별도 협의

## 제6조 (제공 자료)
1. "갑"은 다음 자료를 "을"에게 제공한다:
   - 회사 소개 자료
   - 제품/서비스 정보
   - 로고 및 CI/BI
   - 기타 필요 콘텐츠

2. "을"은 제공받은 자료를 본 프로젝트 외 사용하지 않는다.

## 제7조 (저작권)
1. 웹사이트 저작권은 최종 대금 지급 완료 시 "갑"에게 귀속된다.
2. "을"은 포트폴리오 목적으로 제작 사실을 공개할 수 있다.
3. 제3자 저작물 사용 시 "을"은 적법한 라이선스를 확보한다.

## 제8조 (검수 및 수정)
1. "을"은 각 단계별 결과물을 "갑"에게 제출하여 검수받는다.
2. "갑"은 검수 요청일로부터 3일 이내에 검수 결과를 통보한다.
3. 각 단계별 {{REVISION_COUNT}}회의 수정 요청이 가능하다.
4. 추가 수정은 별도 비용이 발생할 수 있다.

## 제9조 (유지보수)
1. **무상 유지보수**: 오픈 후 {{FREE_MAINTENANCE_PERIOD}}
   - 버그 수정
   - 보안 패치
   - 간단한 텍스트/이미지 수정

2. **유상 유지보수**: 무상 기간 후 월 {{MONTHLY_MAINTENANCE_FEE}}
   - 정기 백업
   - 콘텐츠 업데이트
   - 기능 개선

## 제10조 (호스팅 및 도메인)
1. 호스팅 서비스: {{HOSTING_SERVICE}}
2. 도메인 관리: {{DOMAIN_MANAGEMENT}}
3. SSL 인증서: {{SSL_CERTIFICATE}}

## 제11조 (비밀유지)
양 당사자는 본 계약과 관련하여 알게 된 상대방의 영업비밀을 제3자에게 누설하지 않는다.

## 제12조 (계약의 해지)
1. 다음의 경우 계약을 해지할 수 있다:
   - 일방이 계약을 위반하고 시정하지 않는 경우
   - 천재지변 등 불가항력적 사유 발생

2. 해지 시 기 수행 부분은 정산한다.

## 제13조 (분쟁 해결)
본 계약과 관련한 분쟁은 상호 협의로 해결하고, 협의가 이루어지지 않을 경우 "갑" 소재지 관할 법원에서 해결한다.

**계약 체결일**: {{CONTRACT_DATE}}

**갑**: _____________________ (인)

**을**: _____________________ (인)
`
};

// 일반 용역 계약서 템플릿
export const GENERAL_SERVICE_CONTRACT_TEMPLATE: QuoteTemplate = {
  id: 'general-service-contract',
  name: '일반 용역 계약서',
  documentType: 'contract',
  category: 'service',
  description: '범용 서비스 계약용 표준 계약서',
  variables: ['CLIENT_NAME', 'CLIENT_COMPANY', 'SERVICE_TITLE', 'START_DATE', 'END_DATE', 'TOTAL_AMOUNT'],
  template: `
# 용역 계약서

## 계약 당사자

본 계약은 아래 당사자 간에 체결된다.

**"갑"** (서비스 의뢰자)
- 상호/성명: {{CLIENT_COMPANY}}
- 대표자: {{CLIENT_NAME}}
- 사업자등록번호: {{CLIENT_BUSINESS_NUMBER}}
- 주소: {{CLIENT_ADDRESS}}
- 연락처: {{CLIENT_PHONE}}

**"을"** (서비스 제공자)
- 상호/성명: {{SUPPLIER_NAME}}
- 사업자등록번호: {{SUPPLIER_BUSINESS_NUMBER}}
- 주소: {{SUPPLIER_ADDRESS}}
- 연락처: {{SUPPLIER_PHONE}}

## 제1조 (계약의 목적)
본 계약은 "갑"이 "을"에게 의뢰하는 용역의 수행에 관한 제반 사항을 정함을 목적으로 한다.

## 제2조 (용역의 내용)
1. **용역명**: {{SERVICE_TITLE}}
2. **용역 내용**: {{SERVICE_DESCRIPTION}}
3. **수행 장소**: {{SERVICE_LOCATION}}
4. **산출물**: {{DELIVERABLES}}

## 제3조 (용역 기간)
- 시작일: {{START_DATE}}
- 종료일: {{END_DATE}}
- 총 기간: {{DURATION}}

## 제4조 (용역 대금)
1. **총액**: {{TOTAL_AMOUNT}} (부가세 포함)
2. **지급 방법**: {{PAYMENT_METHOD}}
3. **지급 일정**: {{PAYMENT_SCHEDULE}}

## 제5조 (당사자의 의무)
### "갑"의 의무
1. 용역 수행에 필요한 자료 및 정보를 제공한다.
2. 약정한 대금을 기일 내에 지급한다.
3. 용역 수행에 필요한 협조를 제공한다.

### "을"의 의무
1. 계약된 용역을 성실히 수행한다.
2. 용역 수행 중 취득한 정보를 외부에 누설하지 않는다.
3. 계약 기간 내에 용역을 완료한다.

## 제6조 (결과물의 검수)
1. "을"은 용역 완료 후 결과물을 "갑"에게 제출한다.
2. "갑"은 제출일로부터 {{INSPECTION_PERIOD}}일 이내에 검수를 완료한다.
3. 검수 기간 내 이의가 없으면 검수가 완료된 것으로 본다.

## 제7조 (지적재산권)
1. 용역 결과물의 지적재산권은 대금 완납 시 "갑"에게 귀속된다.
2. "을"은 제3자의 지적재산권을 침해하지 않을 것을 보증한다.

## 제8조 (비밀유지)
1. 양 당사자는 본 계약 수행 중 알게 된 상대방의 비밀을 유지한다.
2. 비밀유지 의무는 계약 종료 후 {{CONFIDENTIALITY_PERIOD}}년간 유효하다.

## 제9조 (계약의 변경 및 해지)
1. 계약 내용의 변경은 양 당사자의 서면 합의로 한다.
2. 중대한 계약 위반 시 서면 통지로 계약을 해지할 수 있다.

## 제10조 (손해배상)
일방의 귀책사유로 상대방에게 손해가 발생한 경우, 귀책 당사자는 그 손해를 배상한다.

## 제11조 (불가항력)
천재지변 등 불가항력적 사유로 계약을 이행할 수 없는 경우, 그 책임을 면한다.

## 제12조 (분쟁 해결)
1. 본 계약과 관련한 분쟁은 상호 협의로 해결한다.
2. 협의가 이루어지지 않을 경우 {{JURISDICTION}} 법원을 관할로 한다.

## 제13조 (일반 조항)
1. 본 계약은 양 당사자 간의 완전한 합의를 구성한다.
2. 본 계약에 명시되지 않은 사항은 관련 법령에 따른다.

본 계약을 증명하기 위하여 계약서 2부를 작성하여 "갑"과 "을"이 서명 날인 후 각 1부씩 보관한다.

**계약 체결일**: {{CONTRACT_DATE}}

**"갑"** {{CLIENT_COMPANY}}
대표 {{CLIENT_NAME}} _____________________ (인)

**"을"** {{SUPPLIER_NAME}} _____________________ (인)
`
};

// 템플릿 목록
export const QUOTE_TEMPLATES: QuoteTemplate[] = [
  STANDARD_QUOTE_TEMPLATE,
  WEB_DEVELOPMENT_TEMPLATE,
  MOBILE_APP_TEMPLATE,
  DESIGN_TEMPLATE,
  STANDARD_CONTRACT_TEMPLATE,
  STANDARD_INVOICE_TEMPLATE,
  SOFTWARE_DEVELOPMENT_CONTRACT_TEMPLATE,
  FREELANCE_CONTRACT_TEMPLATE,
  NDA_CONTRACT_TEMPLATE,
  WEBSITE_CONTRACT_TEMPLATE,
  GENERAL_SERVICE_CONTRACT_TEMPLATE,
  // 상세 버전 계약서들
  FREELANCE_CONTRACT_DETAILED,
  NDA_CONTRACT_DETAILED,
  WEB_CONTRACT_DETAILED,
  SERVICE_CONTRACT_DETAILED,
  PERFORMANCE_CONTRACT_DETAILED,
  LECTURE_CONTRACT_DETAILED,
  CONSULTING_CONTRACT_DETAILED,
  EDUCATION_CONTRACT_DETAILED,
  INFLUENCER_CONTRACT_DETAILED,
  MAINTENANCE_CONTRACT_DETAILED,
  LICENSING_CONTRACT_DETAILED,
  ADVERTISING_CONTRACT_DETAILED,
  VIDEO_PRODUCTION_CONTRACT_DETAILED,
  DESIGN_CONTRACT_DETAILED,
  PHOTOGRAPHY_CONTRACT_DETAILED,
  PUBLISHING_CONTRACT_DETAILED,
  TRANSLATION_CONTRACT_DETAILED
];

// 문서 종류별 템플릿 가져오기
export function getTemplatesByType(documentType: DocumentType): QuoteTemplate[] {
  return QUOTE_TEMPLATES.filter(template => template.documentType === documentType);
}

// 템플릿에 데이터 적용하는 함수
export function applyDataToTemplate(
  template: string,
  clientData: Partial<ClientData>,
  projectData: Partial<ProjectData>,
  additionalData?: Record<string, unknown>
): string {
  let result = template;
  
  // 클라이언트 데이터 치환
  result = result.replace(/{{CLIENT_NAME}}/g, clientData.name || '[고객명]');
  result = result.replace(/{{CLIENT_COMPANY}}/g, clientData.company || '[회사명]');
  result = result.replace(/{{CLIENT_EMAIL}}/g, clientData.email || '[이메일]');
  result = result.replace(/{{CLIENT_PHONE}}/g, clientData.phone || '[연락처]');
  result = result.replace(/{{CLIENT_ADDRESS}}/g, clientData.address || '[주소]');
  result = result.replace(/{{CLIENT_BUSINESS_NUMBER}}/g, clientData.businessNumber || '[사업자등록번호]');
  
  // 프로젝트 데이터 치환
  result = result.replace(/{{PROJECT_TITLE}}/g, projectData.title || '[프로젝트명]');
  result = result.replace(/{{PROJECT_DESCRIPTION}}/g, projectData.description || '[프로젝트 설명]');
  result = result.replace(/{{START_DATE}}/g, projectData.startDate || '[시작일]');
  result = result.replace(/{{END_DATE}}/g, projectData.endDate || '[종료일]');
  result = result.replace(/{{DURATION}}/g, projectData.duration || '[기간]');
  result = result.replace(/{{TOTAL_AMOUNT}}/g, projectData.totalAmount?.toLocaleString() + '원' || '[총액]');
  result = result.replace(/{{PAYMENT_TERMS}}/g, projectData.paymentTerms || '[결제 조건]');
  
  // 납품 사항
  if (projectData.deliverables) {
    const deliverablesList = projectData.deliverables.map(d => `- ${d}`).join('\n');
    result = result.replace(/{{DELIVERABLES}}/g, deliverablesList);
  }
  
  // 추가 데이터 치환
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value?.toString() || `[${key}]`);
    });
  }
  
  // 오늘 날짜
  const today = new Date().toLocaleDateString('ko-KR');
  result = result.replace(/{{ISSUE_DATE}}/g, today);
  result = result.replace(/{{VALIDITY_PERIOD}}/g, '발행일로부터 30일');
  
  // 남은 플레이스홀더를 기본값으로 치환
  result = result.replace(/{{[^}]+}}/g, (match) => {
    const key = match.replace(/{{|}}/g, '');
    return `[${key}]`;
  });
  
  return result;
}