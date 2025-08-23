'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaEnvelope, FaUser, FaPrint } from 'react-icons/fa';

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewData: {
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
  } | null;
}

export default function EmailPreviewModal({ isOpen, onClose, previewData }: EmailPreviewModalProps) {
  const [emailContent, setEmailContent] = useState<{
    subject: string;
    html: string;
    recipient: { email: string; name: string };
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && previewData) {
      generatePreview();
    }
  }, [isOpen, previewData]);

  const generatePreview = async () => {
    if (!previewData) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/email/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(previewData)
      });

      if (response.ok) {
        const data = await response.json();
        setEmailContent(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || '미리보기 생성 실패');
      }
    } catch (err) {
      setError('미리보기를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!emailContent) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${emailContent.subject}</title>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div style="margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb;">
            <p><strong>받는 사람:</strong> ${emailContent.recipient.name} &lt;${emailContent.recipient.email}&gt;</p>
            <p><strong>제목:</strong> ${emailContent.subject}</p>
          </div>
          ${emailContent.html}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center">
            <FaEnvelope className="text-blue-600 mr-3 text-xl" />
            <h2 className="text-xl font-bold text-gray-900">이메일 미리보기</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
              title="인쇄"
            >
              <FaPrint />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-auto p-6">
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">미리보기 생성 중...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {emailContent && !loading && (
            <div>
              {/* 이메일 메타 정보 */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">받는 사람:</span>
                    <div className="mt-1 flex items-center">
                      <FaUser className="text-gray-400 mr-2" />
                      <span>{emailContent.recipient.name}</span>
                      <span className="text-gray-500 ml-2">&lt;{emailContent.recipient.email}&gt;</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">제목:</span>
                    <div className="mt-1">{emailContent.subject}</div>
                  </div>
                </div>
              </div>

              {/* 이메일 본문 */}
              <div className="email-preview-content">
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <style dangerouslySetInnerHTML={{ __html: `
                    .email-preview-content table {
                      width: 100%;
                      border-collapse: collapse;
                    }
                    .email-preview-content th,
                    .email-preview-content td {
                      padding: 8px;
                      text-align: left;
                      border-bottom: 1px solid #e5e7eb;
                    }
                    .email-preview-content a {
                      color: #3b82f6;
                      text-decoration: none;
                    }
                    .email-preview-content a:hover {
                      text-decoration: underline;
                    }
                    .email-preview-content ul {
                      margin: 16px 0;
                      padding-left: 24px;
                    }
                    .email-preview-content li {
                      margin: 8px 0;
                    }
                  `}} />
                  <div dangerouslySetInnerHTML={{ __html: emailContent.html }} />
                </div>
              </div>

              {/* 안내 메시지 */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>안내:</strong> 이것은 미리보기입니다. 실제 이메일 발송 시 고유한 업로드 토큰이 생성되며,
                  수신자는 이메일의 링크를 통해 문서를 업로드할 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}