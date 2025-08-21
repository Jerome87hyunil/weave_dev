'use client';

import React, { useState, useRef } from 'react';
import { ExtractedData } from './types';
import { recordTokenUsage } from '@/lib/token-tracker';

interface DataExtractorProps {
  onDataExtracted?: (data: ExtractedData) => void;
  className?: string;
}

// 지원하는 서류 종류
const DOCUMENT_TYPES = [
  { value: 'auto', label: '자동 감지', description: 'AI가 서류 종류를 자동으로 파악합니다' },
  { value: 'receipt', label: '영수증', description: '일반 영수증' },
  { value: 'tax_invoice', label: '세금계산서', description: '부가세 포함 세금계산서' },
  { value: 'cash_receipt', label: '현금영수증', description: '현금 결제 영수증' },
  { value: 'invoice', label: '인보이스/청구서', description: '거래 청구서' },
  { value: 'handwritten', label: '수기 계산서', description: '손으로 작성한 계산서' },
  { value: 'other', label: '기타', description: '기타 비용 증빙 서류' }
];

export default function DataExtractor({ 
  onDataExtracted,
  className = ''
}: DataExtractorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('auto');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 오디오/비디오 파일 체크
      if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
        setError('오디오 및 비디오 파일은 지원하지 않습니다. 이미지 또는 PDF 파일을 업로드해주세요.');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      // 오디오/비디오 파일 체크
      if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
        setError('오디오 및 비디오 파일은 지원하지 않습니다. 이미지 또는 PDF 파일을 업로드해주세요.');
        setSelectedFile(null);
        return;
      }
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
      formData.append('documentType', documentType);

      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

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
        
        if (onDataExtracted) {
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

  const renderExtractedData = (data: ExtractedData) => {
    // 서류 종류별 한글 표시
    const documentTypeLabel = {
      'receipt': '영수증',
      'tax_invoice': '세금계산서',
      'cash_receipt': '현금영수증',
      'invoice': '인보이스/청구서',
      'handwritten': '수기 계산서',
      'other': '기타'
    }[data.documentType] || data.documentType;

    return (
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-700">추출된 데이터</h4>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
            {documentTypeLabel}
          </span>
        </div>
        
        <div className="space-y-2 text-sm">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-2">
            {data.date && (
              <div>
                <span className="font-medium text-gray-600">날짜:</span>
                <span className="ml-2">{data.date}</span>
              </div>
            )}
            {data.vendor && (
              <div>
                <span className="font-medium text-gray-600">업체명:</span>
                <span className="ml-2">{data.vendor}</span>
              </div>
            )}
            {data.vendorRegistrationNumber && (
              <div>
                <span className="font-medium text-gray-600">사업자번호:</span>
                <span className="ml-2">{data.vendorRegistrationNumber}</span>
              </div>
            )}
            {data.paymentMethod && (
              <div>
                <span className="font-medium text-gray-600">결제수단:</span>
                <span className="ml-2">{data.paymentMethod}</span>
              </div>
            )}
            {data.cardNumber && (
              <div>
                <span className="font-medium text-gray-600">카드번호:</span>
                <span className="ml-2">****{data.cardNumber}</span>
              </div>
            )}
            {data.approvalNumber && (
              <div>
                <span className="font-medium text-gray-600">승인번호:</span>
                <span className="ml-2">{data.approvalNumber}</span>
              </div>
            )}
          </div>

          {/* 항목 리스트 */}
          {data.items && data.items.length > 0 && (
            <div className="border-t pt-2">
              <p className="font-medium text-gray-700 mb-1">항목 내역</p>
              <div className="bg-white rounded p-2 space-y-1">
                {data.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span className="flex-1">
                      {item.name} 
                      {item.quantity && item.quantity > 1 && ` x${item.quantity}`}
                    </span>
                    {item.unitPrice && (
                      <span className="text-gray-500 mx-2">
                        @{item.unitPrice.toLocaleString()}
                      </span>
                    )}
                    {item.price && (
                      <span className="font-medium">
                        {item.price.toLocaleString()}원
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 금액 정보 */}
          <div className="border-t pt-2 space-y-1">
            {data.supplyAmount && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">공급가액:</span>
                <span>{data.supplyAmount.toLocaleString()}원</span>
              </div>
            )}
            {data.taxAmount && (
              <div className="flex justify-between">
                <span className="font-medium text-gray-600">부가세:</span>
                <span>{data.taxAmount.toLocaleString()}원</span>
              </div>
            )}
            {data.totalAmount && (
              <div className="flex justify-between font-semibold">
                <span className="text-gray-700">총액:</span>
                <span className="text-blue-600">
                  {data.totalAmount.toLocaleString()}원
                </span>
              </div>
            )}
          </div>

          {/* 추가 정보 */}
          {data.additionalInfo && (
            <div className="border-t pt-2">
              <p className="font-medium text-gray-600 text-xs">추가 정보</p>
              <p className="text-xs text-gray-500 mt-1">{data.additionalInfo}</p>
            </div>
          )}
        </div>
        
        <div className="pt-2 border-t flex gap-2">
          <button
            onClick={() => {
              const jsonString = JSON.stringify(data, null, 2);
              const blob = new Blob([jsonString], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `extracted_${data.documentType}_${new Date().getTime()}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            JSON 다운로드
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(data, null, 2));
              alert('클립보드에 복사되었습니다.');
            }}
            className="text-sm px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            클립보드 복사
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">데이터 추출</h3>
            <p className="text-sm text-gray-600">
              영수증, 세금계산서, 청구서 등의 이미지나 PDF를 업로드하면 AI가 자동으로 데이터를 추출합니다.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Gemini 2.5 Flash Lite 모델로 빠르고 정확하게 처리
            </p>
          </div>

          {/* 서류 종류 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              서류 종류 선택
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label} {type.value === 'auto' ? '(권장)' : ''}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {DOCUMENT_TYPES.find(t => t.value === documentType)?.description}
            </p>
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
              accept="image/*,.pdf"
              className="hidden"
            />
            {selectedFile ? (
              <div className="space-y-2">
                <svg className="w-12 h-12 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-600">파일을 드래그하거나 클릭하여 업로드</p>
                <p className="text-xs text-gray-500">지원 형식: 이미지 (JPG, PNG 등), PDF</p>
              </div>
            )}
          </div>

          <button
            onClick={processExtraction}
            disabled={!selectedFile || isProcessing}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                처리 중...
              </span>
            ) : (
              '데이터 추출하기'
            )}
          </button>

          {/* 에러 메시지 */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* 결과 표시 */}
          {result && !error && renderExtractedData(result)}
        </div>
      </div>
    </div>
  );
}