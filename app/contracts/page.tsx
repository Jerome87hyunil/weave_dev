'use client';

import WeaveAssistant from '@/components/WeaveAssistant';

export default function ContractsPage() {
  return (
    <WeaveAssistant
      enabledTabs={['documentGeneration']}
      defaultTab="documentGeneration"
      title="계약서 작성"
      subtitle="AI를 활용하여 전문적인 계약서를 작성하세요"
    />
  );
}