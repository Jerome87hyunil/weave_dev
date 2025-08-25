'use client';

import { useState, useEffect } from 'react';
import { FaFileAlt, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { DocumentRequest, RequestedDocument } from '@/types/email';

interface UploadedDocumentsProps {
  requests: DocumentRequest[];
  onStatusUpdate?: () => void;
}

export default function UploadedDocuments({
  requests,
  onStatusUpdate
}: UploadedDocumentsProps) {
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingDocument, setRejectingDocument] = useState<string | null>(null);

  const handleApprove = async (requestId: string, documentId: string) => {
    try {
      const response = await fetch(`/api/email/document-request/${requestId}/documents/${documentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });

      if (response.ok) {
        alert('문서가 승인되었습니다.');
        if (onStatusUpdate) onStatusUpdate();
      } else {
        alert('문서 승인 실패');
      }
    } catch {
      alert('문서 승인 중 오류가 발생했습니다.');
    }
  };

  const handleReject = async (requestId: string, documentId: string) => {
    if (!rejectionReason.trim()) {
      alert('거절 사유를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`/api/email/document-request/${requestId}/documents/${documentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'rejected',
          rejectionReason 
        })
      });

      if (response.ok) {
        alert('문서가 거절되었습니다.');
        setRejectingDocument(null);
        setRejectionReason('');
        if (onStatusUpdate) onStatusUpdate();
      } else {
        alert('문서 거절 실패');
      }
    } catch {
      alert('문서 거절 중 오류가 발생했습니다.');
    }
  };

  const handleViewDocument = (url: string) => {
    window.open(url, '_blank');
  };

  const getDocumentStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-gray-100 text-gray-800',
      uploaded: 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    const labels = {
      pending: '대기중',
      uploaded: '업로드됨',
      approved: '승인됨',
      rejected: '거절됨'
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  // 업로드된 문서가 있는 요청만 필터링
  const requestsWithUploads = requests.filter(request => 
    request.documents.some(doc => doc.status === 'uploaded' || doc.status === 'approved' || doc.status === 'rejected')
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FaFileAlt className="mr-2" />
        업로드된 문서
      </h2>

      {requestsWithUploads.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
          업로드된 문서가 없습니다.
        </div>
      ) : (
        <div className="space-y-4">
          {requestsWithUploads.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-sm">
              <div
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedRequest(
                  expandedRequest === request.id ? null : request.id
                )}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">{request.projectName}</h3>
                    <p className="text-sm text-gray-600">{request.companyName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      업로드: {request.documents.filter(d => 
                        d.status === 'uploaded' || d.status === 'approved' || d.status === 'rejected'
                      ).length} / {request.documents.length}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(request.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </div>
              </div>

              {expandedRequest === request.id && (
                <div className="border-t px-4 py-3">
                  <div className="space-y-3">
                    {request.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{doc.name}</span>
                            {getDocumentStatusBadge(doc.status)}
                            {doc.required && (
                              <span className="text-xs text-red-600">(필수)</span>
                            )}
                          </div>
                          {doc.description && (
                            <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                          )}
                          {doc.rejectionReason && (
                            <p className="text-sm text-red-600 mt-1">
                              거절 사유: {doc.rejectionReason}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {doc.uploadedUrl && (
                            <button
                              onClick={() => handleViewDocument(doc.uploadedUrl!)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              title="문서 보기"
                            >
                              <FaEye />
                            </button>
                          )}
                          
                          {doc.status === 'uploaded' && (
                            <>
                              {rejectingDocument === doc.id ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="거절 사유"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="px-2 py-1 border rounded text-sm"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <button
                                    onClick={() => handleReject(request.id, doc.id)}
                                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                                  >
                                    확인
                                  </button>
                                  <button
                                    onClick={() => {
                                      setRejectingDocument(null);
                                      setRejectionReason('');
                                    }}
                                    className="p-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                                  >
                                    취소
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleApprove(request.id, doc.id)}
                                    className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    title="승인"
                                  >
                                    <FaCheck />
                                  </button>
                                  <button
                                    onClick={() => setRejectingDocument(doc.id)}
                                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    title="거절"
                                  >
                                    <FaTimes />
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}