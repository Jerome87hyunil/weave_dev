'use client';

import React from 'react';
import DocumentGenerator from '@/components/ai-assistant/DocumentGenerator';
import { DocumentTemplate } from '@/components/ai-assistant/types';

interface DocumentGenerationTabProps {
  onDocumentGenerated?: (document: DocumentTemplate) => void;
  className?: string;
}

export default function DocumentGenerationTab({
  onDocumentGenerated,
  className = ''
}: DocumentGenerationTabProps) {
  return (
    <div className={`document-generation-tab ${className}`}>
      <DocumentGenerator
        onDocumentGenerated={onDocumentGenerated || (() => {})}
      />
    </div>
  );
}

// Export configuration for external use
export const documentGenerationConfig = {
  id: 'generate',
  label: '문서 생성',
  description: '견적서, 계약서 등 비즈니스 문서를 자동으로 생성합니다',
  icon: '📝',
  component: DocumentGenerationTab,
};