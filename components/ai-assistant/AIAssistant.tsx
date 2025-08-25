'use client';

import React, { useState, useRef } from 'react';
import { TaskType, AIAssistantResponse, ExtractedData, DocumentTemplate } from './types';
import DocumentEditor from './DocumentEditor';
import QuotePreview from './QuotePreview';
import { recordTokenUsage } from '@/lib/token-tracker';

interface AIAssistantProps {
  onDataExtracted?: (data: ExtractedData) => void;
  onDocumentGenerated?: (document: DocumentTemplate) => void;
  className?: string;
}

export default function AIAssistant({ 
  onDataExtracted, 
  onDocumentGenerated,
  className = ''
}: AIAssistantProps) {
  const [activeTab, setActiveTab] = useState<TaskType>('extract');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ExtractedData | DocumentTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [documentType] = useState<'contract' | 'proposal' | 'invoice'>('contract');
  const [templateType, setTemplateType] = useState<'standard' | 'web-dev' | 'mobile-app' | 'design'>('standard');
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingDocument, setEditingDocument] = useState<DocumentTemplate | null>(null);
  const [savedDocuments, setSavedDocuments] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 샘플 클라이언트 데이터 (실제로는 메인 앱에서 불러옴)
  const [clientData] = useState({
    name: '김철수',
    company: '주식회사 테크스타트',
    email: 'kim@techstart.co.kr',
    phone: '010-1234-5678',
    address: '서울시 강남구 테헤란로 123',
    businessNumber: '123-45-67890'
  });
  
  // 샘플 프로젝트 데이터 (실제로는 메인 앱에서 불러옴)
  const [projectData] = useState({
    title: '모바일 쇼핑몰 앱 개발',
    description: '온라인 쇼핑몰의 모바일 앱 버전 개발',
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    duration: '3개월',
    totalAmount: 15000000,
    paymentTerms: '계약금 30%, 중도금 30%, 잔금 40%',
    deliverables: ['iOS 앱', 'Android 앱', '관리자 페이지', '사용자 매뉴얼']
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const processExtraction = async () => {
    if (!selectedFile) {
      setError('파일을 선택해주세요.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('taskType', 'extract');

      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        body: formData,
      });

      const data: AIAssistantResponse & { tokenUsage?: {
        inputTokens: number;
        outputTokens: number;
        model: string;
        cost: number;
      } } = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
        
        // 토큰 사용량 기록
        if (data.tokenUsage) {
          recordTokenUsage({
            inputTokens: data.tokenUsage.inputTokens,
            outputTokens: data.tokenUsage.outputTokens,
            model: data.tokenUsage.model,
            cost: data.tokenUsage.cost,
            timestamp: new Date(),
            taskType: 'extract'
          });
        }
        
        if ('documentType' in data.data && onDataExtracted) {
          onDataExtracted(data.data as ExtractedData);
        }
      } else {
        setError(data.error || '처리 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateDocument = async () => {
    if (!prompt.trim()) {
      setError('프로젝트 정보를 입력해주세요.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskType: 'generate',
          documentType,
          templateId: templateType,
          prompt,
          clientData,
          projectData,
        }),
      });

      const data: AIAssistantResponse & { tokenUsage?: {
        inputTokens: number;
        outputTokens: number;
        model: string;
        cost: number;
      } } = await response.json();

      if (data.success && data.data) {
        const document = data.data as DocumentTemplate;
        setResult(document);
        
        // 문서 ID 생성 및 저장
        const docId = `${document.type}_${Date.now()}`;
        setSavedDocuments(prev => ({
          ...prev,
          [docId]: document.content
        }));
        
        // 토큰 사용량 기록
        if (data.tokenUsage) {
          recordTokenUsage({
            inputTokens: data.tokenUsage.inputTokens,
            outputTokens: data.tokenUsage.outputTokens,
            model: data.tokenUsage.model,
            cost: data.tokenUsage.cost,
            timestamp: new Date(),
            taskType: 'generate'
          });
        }
        
        if ('type' in document && onDocumentGenerated) {
          onDocumentGenerated(document);
        }
      } else {
        setError(data.error || '문서 생성 중 오류가 발생했습니다.');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderExtractedData = (data: ExtractedData) => (
    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
      <h4 className="font-semibold text-gray-700">추출된 데이터</h4>
      <div className="space-y-1 text-sm">
        {data.documentType && (
          <p><span className="font-medium">문서 유형:</span> {data.documentType}</p>
        )}
        {data.date && (
          <p><span className="font-medium">날짜:</span> {data.date}</p>
        )}
        {data.vendor && (
          <p><span className="font-medium">업체명:</span> {data.vendor}</p>
        )}
        {data.totalAmount && (
          <p><span className="font-medium">총액:</span> {data.totalAmount.toLocaleString()}원</p>
        )}
        {data.items && data.items.length > 0 && (
          <div>
            <p className="font-medium">항목:</p>
            <ul className="ml-4 space-y-1">
              {data.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} {item.quantity && `x${item.quantity}`} {item.price && `- ${item.price.toLocaleString()}원`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );

  const renderGeneratedDocument = (doc: DocumentTemplate) => {
    // 저장된 문서 ID 찾기
    const docId = Object.keys(savedDocuments).find(id => id.startsWith(doc.type));
    const currentContent = docId ? savedDocuments[docId] : doc.content;
    
    return (
      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <h4 className="font-semibold text-gray-700">{doc.title}</h4>
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap text-sm font-normal line-clamp-10">{currentContent}</pre>
        </div>
        <div className="pt-2 border-t flex gap-2">
          <button
            onClick={() => {
              const updatedDoc = { ...doc, content: currentContent };
              setEditingDocument(updatedDoc);
              setShowPreview(true);
            }}
            className="text-sm px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            HTML 프리뷰
          </button>
          <button
            onClick={() => {
              const updatedDoc = { ...doc, content: currentContent };
              setEditingDocument(updatedDoc);
              setShowEditor(true);
            }}
            className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            편집기 열기
          </button>
          <button
            onClick={() => {
              const blob = new Blob([currentContent], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${doc.type}_${new Date().getTime()}.txt`;
              a.click();
            }}
            className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            텍스트 다운로드
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* 헤더 탭 */}
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

      {/* 컨텐츠 영역 */}
      <div className="p-6">
        {activeTab === 'extract' ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">영수증/문서 데이터 추출</h3>
              <p className="text-sm text-gray-600">이미지, PDF, 오디오, 비디오 파일을 업로드하면 AI가 자동으로 데이터를 추출합니다.</p>
              <p className="text-xs text-gray-500 mt-1">Gemini 2.5 Flash Lite 모델로 모든 형식 처리 가능</p>
            </div>

            {/* 파일 업로드 영역 */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept="image/*,.pdf,audio/*,video/*"
                className="hidden"
              />
              {selectedFile ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-600">파일을 드래그하거나 클릭하여 업로드</p>
                  <p className="text-xs text-gray-500">지원 형식: 이미지, PDF, 오디오, 비디오</p>
                  <p className="text-xs text-gray-400">Gemini 2.5 Flash Lite 멀티모달 모델 사용</p>
                </div>
              )}
            </div>

            <button
              onClick={processExtraction}
              disabled={!selectedFile || isProcessing}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? '처리 중...' : '데이터 추출하기'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">문서 초안 생성</h3>
              <p className="text-sm text-gray-600">템플릿을 선택하고 프로젝트 정보를 입력하면 AI가 견적서를 생성합니다.</p>
              <p className="text-xs text-gray-500 mt-1">Gemini 2.5 Flash Lite 모델로 템플릿 기반 생성</p>
            </div>

            {/* 템플릿 유형 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                견적서 템플릿
              </label>
              <select
                value={templateType}
                onChange={(e) => setTemplateType(e.target.value as 'standard' | 'web-dev' | 'mobile-app' | 'design')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="standard">표준 견적서</option>
                <option value="web-dev">웹 개발 견적서</option>
                <option value="mobile-app">모바일 앱 견적서</option>
                <option value="design">디자인 프로젝트 견적서</option>
              </select>
            </div>

            {/* 클라이언트 정보 표시 (읽기 전용) */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                클라이언트 정보 (자동 불러옴)
              </label>
              <div className="text-xs text-gray-600 space-y-1">
                <p><span className="font-medium">회사:</span> {clientData.company}</p>
                <p><span className="font-medium">담당자:</span> {clientData.name}</p>
                <p><span className="font-medium">연락처:</span> {clientData.phone}</p>
              </div>
            </div>

            {/* 프로젝트 정보 표시 (읽기 전용) */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프로젝트 정보 (자동 불러옴)
              </label>
              <div className="text-xs text-gray-600 space-y-1">
                <p><span className="font-medium">프로젝트명:</span> {projectData.title}</p>
                <p><span className="font-medium">기간:</span> {projectData.startDate} ~ {projectData.endDate}</p>
                <p><span className="font-medium">예상 금액:</span> {projectData.totalAmount.toLocaleString()}원</p>
              </div>
            </div>

            {/* 추가 정보 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                추가 정보 입력
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="세부 작업 내역, 특별 요구사항 등 추가 정보를 입력하세요..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
              />
            </div>

            <button
              onClick={generateDocument}
              disabled={!prompt.trim() || isProcessing}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? '생성 중...' : '견적서 생성하기'}
            </button>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* 결과 표시 */}
        {result && !error && (
          <div className="mt-4">
            {'documentType' in result
              ? renderExtractedData(result as ExtractedData)
              : renderGeneratedDocument(result as DocumentTemplate)
            }
          </div>
        )}
      </div>
    </div>
    
    {/* 마크다운 에디터 모달 */}
    {showEditor && editingDocument && (
      <DocumentEditor
        document={editingDocument}
        onSave={(content) => {
          // 문서 ID 찾기 또는 생성
          const docId = Object.keys(savedDocuments).find(id => id.startsWith(editingDocument.type)) 
            || `${editingDocument.type}_${Date.now()}`;
          
          // 저장된 문서 업데이트
          setSavedDocuments(prev => ({
            ...prev,
            [docId]: content
          }));
          
          // 편집 중인 문서 업데이트
          setEditingDocument(prev => prev ? { ...prev, content } : null);
          
          // result 상태도 업데이트 (화면 반영)
          if (result && 'type' in result) {
            setResult({ ...result, content } as DocumentTemplate);
          }
          
          // 편집기 닫고 프리뷰 열기
          setShowEditor(false);
          setShowPreview(true);
          
          // Document saved successfully
        }}
        onClose={() => {
          setShowEditor(false);
          setEditingDocument(null);
        }}
      />
    )}
    
    {/* HTML 프리뷰 모달 */}
    {showPreview && editingDocument && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full h-[90vh] overflow-auto">
          <QuotePreview
            content={editingDocument.content}
            title={editingDocument.title}
            onClose={() => {
              setShowPreview(false);
              setEditingDocument(null);
            }}
          />
        </div>
      </div>
    )}
    </>
  );
}