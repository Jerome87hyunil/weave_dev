'use client';

import { useState, useEffect } from 'react';
import { FaSpinner, FaTimes, FaFileAlt, FaCheck } from 'react-icons/fa';
import FileUploadDropzone from './FileUploadDropzone';

interface DocumentInfo {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  status: 'pending' | 'uploaded' | 'approved' | 'rejected';
  uploadedUrl?: string;
  rejectionReason?: string;
}

interface RequestInfo {
  id: string;
  projectName: string;
  companyName: string;
  recipientName: string;
  dueDate?: string;
  message?: string;
  documents: DocumentInfo[];
}

interface DocumentUploadPageProps {
  token: string;
  onTokenError?: (error: string) => void;
  onUploadComplete?: () => void;
}

export default function DocumentUploadPage({
  token,
  onTokenError,
  onUploadComplete
}: DocumentUploadPageProps) {
  const [loading, setLoading] = useState(true);
  const [requestInfo, setRequestInfo] = useState<RequestInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 토큰 검증 및 문서 정보 로드
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(`/api/upload/validate?token=${token}`);
        
        if (!response.ok) {
          const data = await response.json();
          const errorMessage = data.error || '유효하지 않은 토큰입니다.';
          setError(errorMessage);
          if (onTokenError) onTokenError(errorMessage);
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        setRequestInfo(data);
        setLoading(false);
      } catch {
        const errorMessage = '토큰 검증 중 오류가 발생했습니다.';
        setError(errorMessage);
        if (onTokenError) onTokenError(errorMessage);
        setLoading(false);
      }
    };
    
    if (token) {
      validateToken();
    }
  }, [token, onTokenError]);

  // 파일 업로드 처리
  const handleFileUpload = async (documentId: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('token', token);
    formData.append('documentId', documentId);
    
    const response = await fetch('/api/upload/document', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || '업로드 실패');
    }
    
    const data = await response.json();
    
    // 상태 업데이트
    if (requestInfo) {
      const updatedDocuments = requestInfo.documents.map(doc => 
        doc.id === documentId 
          ? { ...doc, status: 'uploaded' as const, uploadedUrl: data.url }
          : doc
      );
      setRequestInfo({
        ...requestInfo,
        documents: updatedDocuments
      });
      
      // 모든 필수 문서가 업로드되었는지 확인
      const allRequiredUploaded = updatedDocuments
        .filter(doc => doc.required)
        .every(doc => doc.status === 'uploaded' || doc.status === 'approved');
      
      if (allRequiredUploaded && onUploadComplete) {
        onUploadComplete();
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <FaTimes className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">접근 오류</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!requestInfo) {
    return null;
  }

  const allRequiredUploaded = requestInfo.documents
    .filter(doc => doc.required)
    .every(doc => doc.status === 'uploaded' || doc.status === 'approved');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">문서 제출</h1>
          <div className="text-gray-600">
            <p className="mb-1"><strong>프로젝트:</strong> {requestInfo.projectName}</p>
            <p className="mb-1"><strong>요청 기업:</strong> {requestInfo.companyName}</p>
            {requestInfo.dueDate && (
              <p className="mb-1">
                <strong>제출 기한:</strong> {new Date(requestInfo.dueDate).toLocaleDateString('ko-KR')}
              </p>
            )}
          </div>
          {requestInfo.message && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">{requestInfo.message}</p>
            </div>
          )}
        </div>

        {/* 문서 목록 */}
        <div className="space-y-4">
          {requestInfo.documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {doc.name}
                      {doc.required && (
                        <span className="ml-2 text-sm text-red-600">(필수)</span>
                      )}
                    </h3>
                    {doc.status === 'uploaded' && (
                      <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        업로드됨
                      </span>
                    )}
                    {doc.status === 'approved' && (
                      <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        승인됨
                      </span>
                    )}
                    {doc.status === 'rejected' && (
                      <span className="ml-3 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        거절됨
                      </span>
                    )}
                  </div>
                  
                  {doc.description && (
                    <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                  )}
                  
                  {doc.status === 'rejected' && doc.rejectionReason && (
                    <div className="mb-3 p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>거절 사유:</strong> {doc.rejectionReason}
                      </p>
                    </div>
                  )}
                  
                  {doc.status === 'pending' || doc.status === 'rejected' ? (
                    <FileUploadDropzone
                      documentId={doc.id}
                      documentName={doc.name}
                      onUpload={(file) => handleFileUpload(doc.id, file)}
                    />
                  ) : doc.status === 'uploaded' ? (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center text-blue-700">
                        <FaFileAlt className="mr-2" />
                        <span className="text-sm">업로드 완료 - 검토 중입니다</span>
                      </div>
                    </div>
                  ) : doc.status === 'approved' ? (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center text-green-700">
                        <FaCheck className="mr-2" />
                        <span className="text-sm">문서가 승인되었습니다</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 완료 상태 */}
        {allRequiredUploaded && (
          <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center text-green-800">
              <FaCheck className="text-2xl mr-3" />
              <div>
                <h3 className="font-semibold">모든 필수 문서가 제출되었습니다!</h3>
                <p className="text-sm mt-1">제출하신 문서는 검토 후 승인 여부를 알려드리겠습니다.</p>
              </div>
            </div>
          </div>
        )}

        {/* 안내 사항 */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">안내사항</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 지원 파일 형식: 이미지(JPG, PNG 등), PDF</li>
            <li>• 최대 파일 크기: 10MB</li>
            <li>• 필수 문서는 반드시 제출해주세요.</li>
            <li>• 업로드된 문서는 검토 후 승인/거절 여부가 결정됩니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}