'use client';

import { useState, useEffect } from 'react';
import { FaEnvelope, FaFileAlt, FaPlus, FaTrash, FaPaperPlane, FaUsers, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import emailService from '@/lib/email-service';
import { EmailRecipient, DocumentRequest, RequestedDocument } from '@/types/email';
import EmailPreviewModal from './EmailPreviewModal';

export default function DocumentRequestSystem() {
  const [activeTab, setActiveTab] = useState<'recipients' | 'requests' | 'history'>('recipients');
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // 새 수신자 폼
  const [newRecipient, setNewRecipient] = useState({
    email: '',
    name: '',
    organization: '',
    phone: ''
  });
  
  // 새 문서 요청 폼
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

  // 데이터 로드
  useEffect(() => {
    loadRecipients();
    loadDocumentRequests();
  }, []);

  const loadRecipients = async () => {
    try {
      const response = await fetch('/api/email/recipients');
      if (response.ok) {
        const data = await response.json();
        setRecipients(data);
      }
    } catch (error) {
      console.error('Failed to load recipients:', error);
    }
  };

  const loadDocumentRequests = async () => {
    try {
      const response = await fetch('/api/email/document-request');
      if (response.ok) {
        const data = await response.json();
        setDocumentRequests(data);
      }
    } catch (error) {
      console.error('Failed to load document requests:', error);
    }
  };

  // 수신자 추가
  const handleAddRecipient = async () => {
    if (!newRecipient.email || !newRecipient.name) {
      alert('이메일과 이름은 필수입니다.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/email/recipients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipient)
      });

      if (response.ok) {
        const recipient = await response.json();
        setRecipients([...recipients, recipient]);
        setNewRecipient({ email: '', name: '', organization: '', phone: '' });
        alert('수신자가 추가되었습니다.');
      } else {
        const error = await response.json();
        alert(error.error || '수신자 추가 실패');
      }
    } catch (error) {
      alert('수신자 추가 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 문서 추가/제거
  const addDocument = () => {
    setNewRequest({
      ...newRequest,
      documents: [
        ...newRequest.documents,
        { name: '', description: '', required: false, templateUrl: '' }
      ]
    });
  };

  const removeDocument = (index: number) => {
    setNewRequest({
      ...newRequest,
      documents: newRequest.documents.filter((_, i) => i !== index)
    });
  };

  const updateDocument = (index: number, field: string, value: any) => {
    const updatedDocs = [...newRequest.documents];
    updatedDocs[index] = { ...updatedDocs[index], [field]: value };
    setNewRequest({ ...newRequest, documents: updatedDocs });
  };

  // 문서 요청 발송
  const handleSendRequest = async () => {
    if (!newRequest.recipientId || !newRequest.projectName || !newRequest.companyName) {
      alert('수신자, 프로젝트명, 회사명은 필수입니다.');
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
          documents: validDocuments,
          dueDate: newRequest.dueDate || undefined
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`문서 요청이 발송되었습니다.\n업로드 토큰: ${result.uploadToken || '이메일 미발송'}`);
        
        // 폼 초기화
        setNewRequest({
          recipientId: '',
          projectName: '',
          companyName: '',
          message: '',
          dueDate: '',
          documents: [{ name: '', description: '', required: true, templateUrl: '' }]
        });
        
        // 목록 새로고침
        loadDocumentRequests();
      } else {
        const error = await response.json();
        alert(error.error || '문서 요청 발송 실패');
      }
    } catch (error) {
      alert('문서 요청 발송 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: JSX.Element }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <FaFileAlt /> },
      sent: { color: 'bg-blue-100 text-blue-800', icon: <FaPaperPlane /> },
      completed: { color: 'bg-green-100 text-green-800', icon: <FaCheck /> },
      expired: { color: 'bg-red-100 text-red-800', icon: <FaTimes /> }
    };
    
    const badge = badges[status] || badges.pending;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <span className="mr-1">{badge.icon}</span>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <FaEnvelope className="mr-2" />
          문서 요청 시스템
        </h2>
        <p className="text-gray-600">
          이메일로 고객에게 문서 제출을 요청하고 관리합니다.
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('recipients')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'recipients'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaUsers className="inline mr-2" />
            수신자 관리
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaPaperPlane className="inline mr-2" />
            문서 요청
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FaFileAlt className="inline mr-2" />
            요청 내역
          </button>
        </nav>
      </div>

      {/* 수신자 관리 탭 */}
      {activeTab === 'recipients' && (
        <div>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">새 수신자 추가</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="이메일 *"
                value={newRecipient.email}
                onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="이름 *"
                value={newRecipient.name}
                onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="조직/회사"
                value={newRecipient.organization}
                onChange={(e) => setNewRecipient({ ...newRecipient, organization: e.target.value })}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                placeholder="전화번호"
                value={newRecipient.phone}
                onChange={(e) => setNewRecipient({ ...newRecipient, phone: e.target.value })}
                className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleAddRecipient}
              disabled={loading}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
            >
              <FaPlus className="inline mr-2" />
              수신자 추가
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">수신자 목록</h3>
            {recipients.length === 0 ? (
              <p className="text-gray-500 text-center py-8">등록된 수신자가 없습니다.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        이름
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        이메일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        조직
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        전화번호
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recipients.map((recipient) => (
                      <tr key={recipient.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {recipient.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {recipient.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {recipient.organization || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {recipient.phone || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 문서 요청 탭 */}
      {activeTab === 'requests' && (
        <div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">문서 요청 발송</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    수신자 *
                  </label>
                  <select
                    value={newRequest.recipientId}
                    onChange={(e) => setNewRequest({ ...newRequest, recipientId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">수신자 선택</option>
                    {recipients.map((recipient) => (
                      <option key={recipient.id} value={recipient.id}>
                        {recipient.name} ({recipient.email})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    프로젝트명 *
                  </label>
                  <input
                    type="text"
                    value={newRequest.projectName}
                    onChange={(e) => setNewRequest({ ...newRequest, projectName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    회사명 *
                  </label>
                  <input
                    type="text"
                    value={newRequest.companyName}
                    onChange={(e) => setNewRequest({ ...newRequest, companyName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제출 기한
                  </label>
                  <input
                    type="date"
                    value={newRequest.dueDate}
                    onChange={(e) => setNewRequest({ ...newRequest, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  메시지
                </label>
                <textarea
                  value={newRequest.message}
                  onChange={(e) => setNewRequest({ ...newRequest, message: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="추가 안내사항을 입력하세요..."
                />
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    요청 문서 목록
                  </label>
                  <button
                    onClick={addDocument}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    <FaPlus className="inline mr-1" />
                    문서 추가
                  </button>
                </div>
                
                <div className="space-y-2">
                  {newRequest.documents.map((doc, index) => (
                    <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 rounded">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="문서명 *"
                          value={doc.name}
                          onChange={(e) => updateDocument(index, 'name', e.target.value)}
                          className="px-2 py-1 border rounded"
                        />
                        <input
                          type="text"
                          placeholder="설명"
                          value={doc.description}
                          onChange={(e) => updateDocument(index, 'description', e.target.value)}
                          className="px-2 py-1 border rounded"
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
                      </div>
                      {newRequest.documents.length > 1 && (
                        <button
                          onClick={() => removeDocument(index)}
                          className="px-2 py-1 text-red-600 hover:text-red-800"
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
                  onClick={() => {
                    if (!newRequest.recipientId || !newRequest.projectName || !newRequest.companyName) {
                      alert('수신자, 프로젝트명, 회사명은 필수입니다.');
                      return;
                    }
                    setShowPreview(true);
                  }}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <FaEye className="inline mr-2" />
                  미리보기
                </button>
                <button
                  onClick={handleSendRequest}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
                >
                  <FaPaperPlane className="inline mr-2" />
                  {loading ? '발송 중...' : '문서 요청 발송'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 요청 내역 탭 */}
      {activeTab === 'history' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">문서 요청 내역</h3>
          {documentRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">문서 요청 내역이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {documentRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{request.projectName}</h4>
                      <p className="text-sm text-gray-500">{request.companyName}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <p>문서 {request.documents.length}개 요청</p>
                    {request.dueDate && (
                      <p>기한: {new Date(request.dueDate).toLocaleDateString('ko-KR')}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {request.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center text-sm">
                        <span className={`mr-2 ${
                          doc.status === 'approved' ? 'text-green-600' :
                          doc.status === 'uploaded' ? 'text-blue-600' :
                          doc.status === 'rejected' ? 'text-red-600' :
                          'text-gray-400'
                        }`}>
                          {doc.status === 'approved' ? <FaCheck /> :
                           doc.status === 'rejected' ? <FaTimes /> :
                           <FaFileAlt />}
                        </span>
                        <span className={doc.required ? 'font-medium' : ''}>
                          {doc.name} {doc.required && '(필수)'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 이메일 미리보기 모달 */}
      <EmailPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        previewData={showPreview ? {
          recipientId: newRequest.recipientId,
          projectName: newRequest.projectName,
          companyName: newRequest.companyName,
          documents: newRequest.documents.filter(doc => doc.name),
          message: newRequest.message,
          dueDate: newRequest.dueDate
        } : null}
      />
    </div>
  );
}