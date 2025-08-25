'use client';

import React from 'react';
import DocumentRequestSystem from '@/components/email/DocumentRequestSystem';

interface DocumentRequestTabProps {
  onRequestSent?: (request: unknown) => void;
  className?: string;
}

export default function DocumentRequestTab({
  className = ''
}: DocumentRequestTabProps) {
  return (
    <div className={`document-request-tab ${className}`}>
      <DocumentRequestSystem />
    </div>
  );
}

// Export configuration for external use
export const documentRequestConfig = {
  id: 'email',
  label: '문서 요청',
  description: '이메일로 문서를 요청하고 관리합니다',
  icon: '✉️',
  component: DocumentRequestTab,
};