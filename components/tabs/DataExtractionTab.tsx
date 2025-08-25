'use client';

import React from 'react';
import DataExtractor from '@/components/ai-assistant/DataExtractor';
import { ExtractedData } from '@/components/ai-assistant/types';

interface DataExtractionTabProps {
  onDataExtracted?: (data: ExtractedData) => void;
  className?: string;
}

export default function DataExtractionTab({
  onDataExtracted,
  className = ''
}: DataExtractionTabProps) {
  return (
    <div className={`data-extraction-tab ${className}`}>
      <DataExtractor
        onDataExtracted={onDataExtracted || (() => {})}
      />
    </div>
  );
}

// Export configuration for external use
export const dataExtractionConfig = {
  id: 'extract',
  label: '데이터 추출',
  description: '영수증, 문서에서 데이터를 자동으로 추출합니다',
  icon: '📄',
  component: DataExtractionTab,
};