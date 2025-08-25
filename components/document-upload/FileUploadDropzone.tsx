'use client';

import { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaFileAlt, FaSpinner, FaTrash, FaCheck } from 'react-icons/fa';

interface FileUploadDropzoneProps {
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

export default function FileUploadDropzone({
  onUpload,
  disabled = false,
  maxSize = 10,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
}: FileUploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // 파일 크기 검증
    if (file.size > maxSize * 1024 * 1024) {
      return `파일 크기는 ${maxSize}MB 이하여야 합니다.`;
    }
    
    // 파일 타입 검증
    if (!acceptedTypes.includes(file.type)) {
      return '지원하지 않는 파일 형식입니다. (JPG, PNG, PDF만 가능)';
    }
    
    return null;
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setSelectedFile(file);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setError(null);
    
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled || uploading) return;
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled || uploading) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!disabled && !uploading && !selectedFile) {
      fileInputRef.current?.click();
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        } ${(disabled || uploading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleInputChange}
          accept={acceptedTypes.map(type => {
            if (type.startsWith('image/')) return type.replace('image/', '.');
            if (type === 'application/pdf') return '.pdf';
            return '';
          }).filter(Boolean).join(',')}
          disabled={disabled || uploading}
        />
        
        {uploading ? (
          <div className="py-4">
            <FaSpinner className="animate-spin text-3xl text-blue-600 mx-auto mb-3" />
            <p className="text-gray-600">파일 업로드 중...</p>
          </div>
        ) : selectedFile ? (
          <div className="py-2">
            <FaFileAlt className="text-3xl text-blue-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-900 mb-1">
              {selectedFile.name}
            </p>
            <p className="text-xs text-gray-500 mb-3">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileUpload();
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                disabled={disabled}
              >
                <FaCloudUploadAlt className="inline mr-2" />
                업로드
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSelectedFile();
                }}
                className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600"
                disabled={disabled}
              >
                <FaTrash className="inline mr-2" />
                취소
              </button>
            </div>
          </div>
        ) : (
          <div className="py-4">
            <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">
              파일을 드래그하여 놓거나 클릭하여 선택하세요
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, PDF (최대 {maxSize}MB)
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      {uploadSuccess && (
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <span className="text-green-700 text-sm flex items-center justify-center">
            <FaCheck className="mr-2" />
            파일이 성공적으로 업로드되었습니다!
          </span>
        </div>
      )}
    </div>
  );
}