'use client';

import React, { useState } from 'react';
import { contractCategories, ContractInfo, getPopularContracts, searchContracts } from '@/lib/contract-categories';

interface ContractTemplateSelectorProps {
  onSelectContract: (contractId: string) => void;
  className?: string;
}

export default function ContractTemplateSelector({ 
  onSelectContract,
  className = ''
}: ContractTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopular, setShowPopular] = useState(true);

  // 검색 결과 또는 선택된 카테고리의 계약서 목록
  const displayContracts = searchQuery 
    ? searchContracts(searchQuery)
    : selectedCategory 
      ? contractCategories.find(cat => cat.id === selectedCategory)?.contracts || []
      : showPopular 
        ? getPopularContracts()
        : [];

  const handleContractSelect = (contract: ContractInfo) => {
    onSelectContract(contract.id);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowPopular(false);
    setSearchQuery('');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setShowPopular(true);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* 헤더 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          계약서 템플릿 선택
        </h2>
        <p className="text-gray-600">
          필요한 계약서를 선택하세요. 약식과 상세 버전을 제공합니다.
        </p>
      </div>

      {/* 검색바 */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="계약서 검색... (예: 소프트웨어, 디자인, NDA)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute right-3 top-3.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* 네비게이션 */}
      {selectedCategory && !searchQuery && (
        <button
          onClick={handleBackToCategories}
          className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <svg
            className="mr-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          카테고리로 돌아가기
        </button>
      )}

      {/* 카테고리 그리드 또는 계약서 목록 */}
      {!selectedCategory && !searchQuery ? (
        <>
          {/* 인기 템플릿 */}
          {showPopular && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🔥</span>
                인기 템플릿
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getPopularContracts().map((contract) => (
                  <button
                    key={contract.id}
                    onClick={() => handleContractSelect(contract)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {contract.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {contract.description}
                        </p>
                      </div>
                      <span className={`ml-3 px-2 py-1 text-xs font-medium rounded ${
                        contract.type === 'detailed' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {contract.type === 'detailed' ? '상세' : '약식'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 카테고리 목록 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              카테고리별 찾기
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {contractCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`p-6 rounded-xl border-2 ${category.color} hover:scale-105 transition-transform text-center`}
                >
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-sm mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs opacity-75">
                    {category.contracts.length}개 템플릿
                  </p>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* 계약서 목록 */
        <div>
          {searchQuery && (
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              &quot;{searchQuery}&quot; 검색 결과 ({displayContracts.length}개)
            </h3>
          )}
          {selectedCategory && !searchQuery && (
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">
                {contractCategories.find(cat => cat.id === selectedCategory)?.icon}
              </span>
              {contractCategories.find(cat => cat.id === selectedCategory)?.name}
            </h3>
          )}
          
          {displayContracts.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {displayContracts.map((contract) => (
                <button
                  key={contract.id}
                  onClick={() => handleContractSelect(contract)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                        {contract.name}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                          contract.type === 'detailed' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {contract.type === 'detailed' ? '상세' : '약식'}
                        </span>
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {contract.description}
                      </p>
                    </div>
                    <svg
                      className="h-5 w-5 text-gray-400 group-hover:text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              검색 결과가 없습니다.
            </div>
          )}
        </div>
      )}

      {/* 도움말 */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">💡 도움말</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <span className="font-medium">약식</span>: 간단한 프로젝트나 소규모 작업에 적합</li>
          <li>• <span className="font-medium">상세</span>: 큰 프로젝트나 법적 보호가 중요한 경우에 적합</li>
          <li>• 모든 템플릿은 한국 법률에 맞게 작성되었습니다</li>
          <li>• 필요에 따라 내용을 수정하여 사용하세요</li>
        </ul>
      </div>
    </div>
  );
}