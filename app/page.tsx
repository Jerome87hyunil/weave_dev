'use client';

import { useState } from 'react';
import DataExtractor from '@/components/ai-assistant/DataExtractor';
import DocumentGenerator from '@/components/ai-assistant/DocumentGenerator';
import TokenUsageDisplay from '@/components/ai-assistant/TokenUsageDisplay';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'extract' | 'generate'>('extract');
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Weave AI 비서
          </h1>
          <p className="text-gray-600">
            영수증 데이터 추출 및 문서 생성 도우미
          </p>
        </header>

        <main>
          {/* 탭 네비게이션 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('extract')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'extract'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                데이터 추출
              </button>
              <button
                onClick={() => setActiveTab('generate')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'generate'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                문서 생성
              </button>
            </div>
          </div>
          
          {/* 컴포넌트 렌더링 */}
          {activeTab === 'extract' ? (
            <DataExtractor
              onDataExtracted={(data) => {
                console.log('추출된 데이터:', data);
              }}
            />
          ) : (
            <DocumentGenerator
              onDocumentGenerated={(document) => {
                console.log('생성된 문서:', document);
              }}
            />
          )}
        </main>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>© 2024 Weave - 프리랜서를 위한 통합 비즈니스 플랫폼</p>
        </footer>
      </div>
      
      {/* 토큰 사용량 표시 */}
      <TokenUsageDisplay />
    </div>
  );
}