'use client';

import { useState } from 'react';
import { FaEnvelope, FaEye, FaDownload } from 'react-icons/fa';
import { DocumentRequest, EmailRecipient } from '@/types/email';
import EmailPreviewModal from './EmailPreviewModal';

interface RequestHistoryProps {
  requests: DocumentRequest[];
  recipients: EmailRecipient[];
  onRecipientsLoad?: () => void;
}

export default function RequestHistory({
  requests,
  recipients,
  onRecipientsLoad
}: RequestHistoryProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const handleViewEmail = async (request: DocumentRequest) => {
    // 수신자 정보가 없으면 로드
    if (recipients.length === 0 && onRecipientsLoad) {
      await onRecipientsLoad();
    }

    const recipient = recipients.find(r => r.id === request.recipientId);
    if (!recipient) {
      alert('수신자를 찾을 수 없습니다.');
      return;
    }

    // 날짜 형식 변환
    let formattedDueDate = '';
    if (request.dueDate) {
      try {
        const date = new Date(request.dueDate);
        formattedDueDate = date.toISOString().split('T')[0];
      } catch {
        formattedDueDate = '';
      }
    }

    setPreviewData({
      recipient,
      projectName: request.projectName,
      companyName: request.companyName,
      message: request.message,
      dueDate: formattedDueDate,
      documents: request.documents,
      uploadUrl: request.uploadUrl
    });
    setShowPreview(true);
  };

  const handleCopyLink = (uploadUrl: string) => {
    navigator.clipboard.writeText(uploadUrl);
    alert('업로드 링크가 복사되었습니다.');
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      sent: 'bg-blue-100 text-blue-800',
      partial: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800'
    };
    const labels = {
      pending: '대기중',
      sent: '발송됨',
      partial: '일부 제출',
      completed: '완료'
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FaEnvelope className="mr-2" />
        문서 요청 내역
      </h2>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                프로젝트
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                수신자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                문서 수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                제출 기한
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => {
              const recipient = recipients.find(r => r.id === request.recipientId);
              return (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {request.projectName}
                    <div className="text-xs text-gray-500">{request.companyName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {recipient?.name || '알 수 없음'}
                    <div className="text-xs">{recipient?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.documents.length}개
                    <div className="text-xs">
                      필수: {request.documents.filter(d => d.required).length}개
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.dueDate 
                      ? new Date(request.dueDate).toLocaleDateString('ko-KR')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(request.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewEmail(request)}
                        className="text-blue-600 hover:text-blue-900"
                        title="메일 보기"
                      >
                        <FaEye />
                      </button>
                      {request.uploadUrl && (
                        <button
                          onClick={() => handleCopyLink(request.uploadUrl)}
                          className="text-green-600 hover:text-green-900"
                          title="업로드 링크 복사"
                        >
                          <FaDownload />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {requests.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  요청 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPreview && previewData && (
        <EmailPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          previewData={previewData}
        />
      )}
    </div>
  );
}