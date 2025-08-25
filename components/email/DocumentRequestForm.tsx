'use client';

import { useState } from 'react';
import { FaPaperPlane, FaPlus, FaTrash, FaEye } from 'react-icons/fa';
import { EmailRecipient } from '@/types/email';
import EmailPreviewModal from './EmailPreviewModal';

interface DocumentRequestFormProps {
  recipients: EmailRecipient[];
  onRequestSent?: () => void;
}

export default function DocumentRequestForm({
  recipients,
  onRequestSent
}: DocumentRequestFormProps) {
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<{
    recipientId: string;
    projectName: string;
    companyName: string;
    documents: Array<{
      name: string;
      description?: string;
      required: boolean;
    }>;
    message?: string;
    dueDate?: string;
  } | null>(null);
  
  const [newRequest, setNewRequest] = useState({
    recipientId: '',
    projectName: '',
    companyName: '',
    message: '',
    dueDate: '',
    documents: [
      { name: '', description: '', required: true, templateUrl: '' }
    ]
  });

  const addDocument = () => {
    setNewRequest({
      ...newRequest,
      documents: [
        ...newRequest.documents,
        { name: '', description: '', required: true, templateUrl: '' }
      ]
    });
  };

  const removeDocument = (index: number) => {
    setNewRequest({
      ...newRequest,
      documents: newRequest.documents.filter((_, i) => i !== index)
    });
  };

  const updateDocument = (index: number, field: string, value: string | boolean) => {
    const updatedDocs = [...newRequest.documents];
    updatedDocs[index] = { ...updatedDocs[index], [field]: value };
    setNewRequest({ ...newRequest, documents: updatedDocs });
  };

  const handlePreview = async () => {
    const selectedRecipient = recipients.find(r => r.id === newRequest.recipientId);
    if (!selectedRecipient) {
      alert('수신자를 선택해주세요.');
      return;
    }

    const validDocuments = newRequest.documents.filter(doc => doc.name);
    if (validDocuments.length === 0) {
      alert('최소 하나의 문서를 추가해주세요.');
      return;
    }

    try {
      const response = await fetch('/api/email/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: selectedRecipient.id,
          projectName: newRequest.projectName,
          companyName: newRequest.companyName,
          message: newRequest.message,
          dueDate: newRequest.dueDate,
          documents: validDocuments
        })
      });

      if (response.ok) {
        await response.json(); // API response는 사용하지 않음
        setPreviewData({
          recipientId: selectedRecipient.id || '',
          projectName: newRequest.projectName,
          companyName: newRequest.companyName,
          message: newRequest.message,
          dueDate: newRequest.dueDate,
          documents: validDocuments
        });
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Preview failed:', error);
      alert('미리보기 생성 중 오류가 발생했습니다.');
    }
  };

  const handleSendRequest = async () => {
    if (!newRequest.recipientId || !newRequest.projectName || !newRequest.companyName) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    const validDocuments = newRequest.documents.filter(doc => doc.name);
    if (validDocuments.length === 0) {
      alert('최소 하나의 문서를 추가해주세요.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/email/document-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newRequest,
          documents: validDocuments
        })
      });

      if (response.ok) {
        alert('문서 요청이 발송되었습니다.');
        setNewRequest({
          recipientId: '',
          projectName: '',
          companyName: '',
          message: '',
          dueDate: '',
          documents: [{ name: '', description: '', required: true, templateUrl: '' }]
        });
        if (onRequestSent) onRequestSent();
      } else {
        const error = await response.json();
        alert(error.error || '문서 요청 발송 실패');
      }
    } catch {
      alert('문서 요청 발송 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">문서 요청 발송</h2>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              수신자 선택
            </label>
            <select
              value={newRequest.recipientId}
              onChange={(e) => setNewRequest({ ...newRequest, recipientId: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">수신자를 선택하세요</option>
              {recipients.map((recipient) => (
                <option key={recipient.id} value={recipient.id}>
                  {recipient.name} ({recipient.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              프로젝트명
            </label>
            <input
              type="text"
              placeholder="프로젝트명 입력"
              value={newRequest.projectName}
              onChange={(e) => setNewRequest({ ...newRequest, projectName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              회사명
            </label>
            <input
              type="text"
              placeholder="회사명 입력"
              value={newRequest.companyName}
              onChange={(e) => setNewRequest({ ...newRequest, companyName: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제출 기한 (선택)
            </label>
            <input
              type="date"
              value={newRequest.dueDate}
              onChange={(e) => setNewRequest({ ...newRequest, dueDate: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            메시지 (선택)
          </label>
          <textarea
            placeholder="수신자에게 전달할 메시지"
            value={newRequest.message}
            onChange={(e) => setNewRequest({ ...newRequest, message: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              요청 문서
            </label>
            <button
              onClick={addDocument}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center"
            >
              <FaPlus className="mr-1" />
              문서 추가
            </button>
          </div>
          
          <div className="space-y-3">
            {newRequest.documents.map((doc, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  placeholder="문서명"
                  value={doc.name}
                  onChange={(e) => updateDocument(index, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="설명 (선택)"
                  value={doc.description}
                  onChange={(e) => updateDocument(index, 'description', e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={doc.required}
                    onChange={(e) => updateDocument(index, 'required', e.target.checked)}
                    className="mr-2"
                  />
                  필수
                </label>
                {newRequest.documents.length > 1 && (
                  <button
                    onClick={() => removeDocument(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePreview}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
          >
            <FaEye className="mr-2" />
            미리보기
          </button>
          <button
            onClick={handleSendRequest}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
          >
            <FaPaperPlane className="mr-2" />
            {loading ? '발송 중...' : '문서 요청 발송'}
          </button>
        </div>
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