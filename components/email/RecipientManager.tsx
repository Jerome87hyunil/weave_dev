'use client';

import { useState } from 'react';
import { FaPlus, FaTrash, FaUsers } from 'react-icons/fa';
import { EmailRecipient } from '@/types/email';

interface RecipientManagerProps {
  recipients: EmailRecipient[];
  onRecipientsChange: (recipients: EmailRecipient[]) => void;
  onReload?: () => void;
}

export default function RecipientManager({
  recipients,
  onRecipientsChange,
  onReload
}: RecipientManagerProps) {
  const [loading, setLoading] = useState(false);
  const [newRecipient, setNewRecipient] = useState({
    email: '',
    name: '',
    organization: '',
    phone: ''
  });

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
        onRecipientsChange([...recipients, recipient]);
        setNewRecipient({ email: '', name: '', organization: '', phone: '' });
        alert('수신자가 추가되었습니다.');
      } else {
        const error = await response.json();
        alert(error.error || '수신자 추가 실패');
      }
    } catch {
      alert('수신자 추가 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipient = async (id: string) => {
    if (!confirm('정말 이 수신자를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/email/recipients/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        onRecipientsChange(recipients.filter(r => r.id !== id));
        alert('수신자가 삭제되었습니다.');
      } else {
        alert('수신자 삭제 실패');
      }
    } catch {
      alert('수신자 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <FaUsers className="mr-2" />
          수신자 관리
        </h2>
        {onReload && (
          <button
            onClick={onReload}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
          >
            새로고침
          </button>
        )}
      </div>

      {/* 수신자 추가 폼 */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-4">새 수신자 추가</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="email"
            placeholder="이메일 (필수)"
            value={newRecipient.email}
            onChange={(e) => setNewRecipient({ ...newRecipient, email: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="이름 (필수)"
            value={newRecipient.name}
            onChange={(e) => setNewRecipient({ ...newRecipient, name: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="소속 (선택)"
            value={newRecipient.organization}
            onChange={(e) => setNewRecipient({ ...newRecipient, organization: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            placeholder="전화번호 (선택)"
            value={newRecipient.phone}
            onChange={(e) => setNewRecipient({ ...newRecipient, phone: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleAddRecipient}
          disabled={loading}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
        >
          <FaPlus className="mr-2" />
          {loading ? '추가 중...' : '수신자 추가'}
        </button>
      </div>

      {/* 수신자 목록 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이메일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                소속
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                전화번호
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
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
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleDeleteRecipient(recipient.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {recipients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  등록된 수신자가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}