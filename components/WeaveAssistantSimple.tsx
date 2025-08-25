'use client';

import React from 'react';
import WeaveAssistant from './WeaveAssistant';

/**
 * Simplified Weave Assistant component with minimal configuration
 * Perfect for quick integration into other services
 */
export default function WeaveAssistantSimple() {
  return (
    <WeaveAssistant 
      // Use all default settings
      onDataExtracted={(data) => {
        // Handle extracted data
        console.info('Data extracted:', data);
      }}
      onDocumentGenerated={(doc) => {
        // Handle generated document
        console.info('Document generated:', doc);
      }}
    />
  );
}

/**
 * Example configurations for different use cases
 */

// Data extraction only
export function DataExtractionOnly() {
  return (
    <WeaveAssistant
      title="데이터 추출 도구"
      subtitle="문서에서 데이터를 자동으로 추출합니다"
      enabledTabs={['extract']}
      showFooter={false}
      showTokenUsage={false}
    />
  );
}

// Document generation only
export function DocumentGenerationOnly() {
  return (
    <WeaveAssistant
      title="문서 생성 도구"
      subtitle="비즈니스 문서를 자동으로 생성합니다"
      enabledTabs={['generate']}
      showFooter={false}
    />
  );
}

// Business tools (lookup and document request)
export function BusinessTools() {
  return (
    <WeaveAssistant
      title="비즈니스 도구"
      subtitle="사업자 조회 및 문서 요청"
      enabledTabs={['business', 'email']}
      defaultTab="business"
    />
  );
}

// AI tools (extraction and generation)
export function AITools() {
  return (
    <WeaveAssistant
      title="AI 문서 도구"
      subtitle="AI를 활용한 문서 처리"
      enabledTabs={['extract', 'generate']}
    />
  );
}