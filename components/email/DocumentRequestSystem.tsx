'use client';

import { useState, useEffect } from 'react';
import { EmailRecipient, DocumentRequest } from '@/types/email';
import RecipientManager from './RecipientManager';
import DocumentRequestForm from './DocumentRequestForm';
import RequestHistory from './RequestHistory';
import UploadedDocuments from './UploadedDocuments';

export default function DocumentRequestSystem() {
  const [activeTab, setActiveTab] = useState<'recipients' | 'requests' | 'history' | 'uploads'>('recipients');
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [documentRequests, setDocumentRequests] = useState<DocumentRequest[]>([]);

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* 탭 네비게이션 */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg shadow-sm p-1">
          <button
            onClick={() => setActiveTab('recipients')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'recipients'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            수신자 관리
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'requests'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            문서 요청
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            요청 내역
          </button>
          <button
            onClick={() => setActiveTab('uploads')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'uploads'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            업로드 문서
          </button>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'recipients' && (
            <RecipientManager
              recipients={recipients}
              onRecipientsChange={setRecipients}
              onReload={loadRecipients}
            />
          )}

          {activeTab === 'requests' && (
            <DocumentRequestForm
              recipients={recipients}
              onRequestSent={loadDocumentRequests}
            />
          )}

          {activeTab === 'history' && (
            <RequestHistory
              requests={documentRequests}
              recipients={recipients}
              onRecipientsLoad={loadRecipients}
            />
          )}

          {activeTab === 'uploads' && (
            <UploadedDocuments
              requests={documentRequests}
              onStatusUpdate={loadDocumentRequests}
            />
          )}
        </div>
      </div>
    </div>
  );
}