'use client';

import React, { useState } from 'react';
import { quoteCategories, QuoteCategory, QuoteTemplateInfo, getPopularQuoteTemplates, searchQuoteTemplates } from '@/lib/quote-template-categories';

interface QuoteTemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
  className?: string;
}

export default function QuoteTemplateSelector({ 
  onSelectTemplate,
  className = ''
}: QuoteTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopular, setShowPopular] = useState(true);

  // 검색 결과 또는 선택된 카테고리의 템플릿 목록
  const displayTemplates = searchQuery 
    ? searchQuoteTemplates(searchQuery)
    : selectedCategory 
      ? quoteCategories.find(cat => cat.id === selectedCategory)?.templates || []
      : showPopular 
        ? getPopularQuoteTemplates()
        : [];

  const handleTemplateSelect = (template: QuoteTemplateInfo) => {
    onSelectTemplate(template.id);
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
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      {/* 헤더 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          견적서 템플릿 선택
        </h2>
        <p className="text-gray-600">
          프로젝트에 맞는 견적서 템플릿을 선택하세요
        </p>
      </div>

      {/* 검색바 */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="견적서 검색... (예: 웹개발, 디자인, 마케팅)"
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

      {/* 카테고리 그리드 또는 템플릿 목록 */}
      {!selectedCategory && !searchQuery ? (
        <>
          {/* 인기 템플릿 */}
          {showPopular && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">⭐</span>
                인기 템플릿
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getPopularQuoteTemplates().map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                  >
                    <h4 className="font-medium text-gray-900">
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 카테고리 목록 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              업종별 찾기
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {quoteCategories.map((category) => (
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
                    {category.templates.length}개 템플릿
                  </p>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* 템플릿 목록 */
        <div>
          {searchQuery && (
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              "{searchQuery}" 검색 결과 ({displayTemplates.length}개)
            </h3>
          )}
          {selectedCategory && !searchQuery && (
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">
                {quoteCategories.find(cat => cat.id === selectedCategory)?.icon}
              </span>
              {quoteCategories.find(cat => cat.id === selectedCategory)?.name}
            </h3>
          )}
          
          {displayTemplates.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {displayTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                        {template.name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {template.description}
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
        <h4 className="font-medium text-gray-900 mb-2">💡 견적서 작성 팁</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 업종별 템플릿을 선택하면 해당 분야에 최적화된 항목이 포함됩니다</li>
          <li>• 템플릿 선택 후 내용을 자유롭게 수정할 수 있습니다</li>
          <li>• 부가세 포함/별도 여부를 명확히 표시하세요</li>
          <li>• 유효기간과 결제 조건을 반드시 명시하세요</li>
        </ul>
      </div>
    </div>
  );
}