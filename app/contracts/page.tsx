'use client';

import { useState } from 'react';
import ContractTemplateSelector from '@/components/contract-templates/ContractTemplateSelector';

export default function ContractsPage() {
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  const handleContractSelect = (contractId: string) => {
    setSelectedContractId(contractId);
    // 여기서 실제 계약서 생성 페이지로 이동하거나 모달을 열 수 있습니다
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            계약서 템플릿
          </h1>
          <p className="text-gray-600">
            프로젝트에 맞는 계약서 템플릿을 선택하세요
          </p>
        </header>

        <main>
          <ContractTemplateSelector onSelectContract={handleContractSelect} />
          
          {selectedContractId && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                선택한 계약서 ID: <strong>{selectedContractId}</strong>
              </p>
              <p className="text-sm text-blue-600 mt-1">
                이제 이 템플릿을 사용하여 계약서를 작성할 수 있습니다.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}