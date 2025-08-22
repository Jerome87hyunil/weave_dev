'use client';

import { useState, useRef } from 'react';
import { FaBuilding, FaSearch, FaUpload, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

interface BusinessInfo {
  b_no: string;
  b_stt: string;
  b_stt_cd: string;
  tax_type: string;
  tax_type_cd: string;
  end_dt: string;
  utcc_yn: string;
  tax_type_change_dt: string;
  invoice_apply_dt: string;
  rbf_tax_type: string;
  rbf_tax_type_cd: string;
}

interface ApiResponse {
  status_code: string;
  match_cnt: number;
  request_cnt: number;
  data?: BusinessInfo[];
}

export default function BusinessInfoLookup() {
  const [businessNumber, setBusinessNumber] = useState('');
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBusinessNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 5) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`;
    }
  };

  const handleBusinessNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBusinessNumber(e.target.value);
    setBusinessNumber(formatted);
  };

  const searchBusinessInfo = async (bNo: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const cleanedBNo = bNo.replace(/-/g, '');
      
      const response = await fetch('/api/business-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessNumber: cleanedBNo }),
      });

      if (!response.ok) {
        throw new Error('사업자 정보 조회에 실패했습니다.');
      }

      const data: ApiResponse = await response.json();
      
      if (data.status_code === 'OK' && data.data && data.data.length > 0) {
        setBusinessInfo(data.data[0]);
      } else {
        setError('조회된 사업자 정보가 없습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!businessNumber || businessNumber.replace(/-/g, '').length !== 10) {
      setError('올바른 사업자등록번호를 입력해주세요. (10자리)');
      return;
    }
    searchBusinessInfo(businessNumber);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드 가능합니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Image = event.target?.result as string;
        setUploadedImage(base64Image);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('extractType', 'businessRegistration');

        const response = await fetch('/api/ai-assistant', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('이미지 처리에 실패했습니다.');
        }

        const data = await response.json();
        
        if (data.result?.businessNumber) {
          const formattedNumber = formatBusinessNumber(data.result.businessNumber);
          setBusinessNumber(formattedNumber);
          searchBusinessInfo(data.result.businessNumber);
        } else {
          setError('사업자등록번호를 추출할 수 없습니다.');
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : '파일 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, statusCode: string) => {
    const isActive = statusCode === '01';
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        isActive 
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? <FaCheckCircle className="mr-1" /> : <FaExclamationCircle className="mr-1" />}
        {status}
      </span>
    );
  };

  const getTaxTypeBadge = (taxType: string) => {
    const isGeneral = taxType.includes('일반');
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        isGeneral
          ? 'bg-blue-100 text-blue-800'
          : 'bg-yellow-100 text-yellow-800'
      }`}>
        {taxType}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <FaBuilding className="mr-2" />
          사업자 정보 조회
        </h2>
        <p className="text-gray-600">
          사업자등록번호를 입력하거나 사업자등록증을 업로드하여 정보를 조회합니다.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={businessNumber}
            onChange={handleBusinessNumberChange}
            placeholder="사업자등록번호 (예: 123-45-67890)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={12}
          />
          <button
            onClick={handleSearch}
            disabled={loading || !businessNumber}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <FaSearch className="mr-2" />
            조회
          </button>
        </div>

        <div className="text-center text-gray-500">
          <span>또는</span>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            <FaUpload className="mr-2" />
            사업자등록증 업로드
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {uploadedImage && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">업로드된 이미지:</p>
            <img
              src={uploadedImage}
              alt="사업자등록증"
              className="max-w-full h-auto rounded-lg shadow-sm"
              style={{ maxHeight: '300px' }}
            />
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">조회 중...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {businessInfo && !loading && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">사업자 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  사업자등록번호
                </label>
                <p className="text-gray-900">{formatBusinessNumber(businessInfo.b_no)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  납세자상태
                </label>
                {getStatusBadge(businessInfo.b_stt, businessInfo.b_stt_cd)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  과세유형
                </label>
                {getTaxTypeBadge(businessInfo.tax_type)}
              </div>

              {businessInfo.end_dt && businessInfo.end_dt !== '' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    폐업일자
                  </label>
                  <p className="text-gray-900">{businessInfo.end_dt}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  단위과세전환여부
                </label>
                <p className="text-gray-900">{businessInfo.utcc_yn === 'Y' ? '예' : '아니오'}</p>
              </div>

              {businessInfo.tax_type_change_dt && businessInfo.tax_type_change_dt !== '' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    과세유형전환일자
                  </label>
                  <p className="text-gray-900">{businessInfo.tax_type_change_dt}</p>
                </div>
              )}

              {businessInfo.invoice_apply_dt && businessInfo.invoice_apply_dt !== '' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    세금계산서적용일자
                  </label>
                  <p className="text-gray-900">{businessInfo.invoice_apply_dt}</p>
                </div>
              )}

              {businessInfo.rbf_tax_type && businessInfo.rbf_tax_type !== '' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    직전과세유형
                  </label>
                  <p className="text-gray-900">{businessInfo.rbf_tax_type}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}