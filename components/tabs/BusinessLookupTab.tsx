'use client';

import React from 'react';
import BusinessInfoLookup from '@/components/business-info/BusinessInfoLookup';

interface BusinessLookupTabProps {
  onBusinessInfoFetched?: (info: unknown) => void;
  className?: string;
}

export default function BusinessLookupTab({
  className = ''
}: BusinessLookupTabProps) {
  return (
    <div className={`business-lookup-tab ${className}`}>
      <BusinessInfoLookup />
    </div>
  );
}

// Export configuration for external use
export const businessLookupConfig = {
  id: 'business',
  label: '사업자 조회',
  description: '사업자 정보를 조회하고 검증합니다',
  icon: '🏢',
  component: BusinessLookupTab,
};