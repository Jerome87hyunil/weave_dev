'use client';

import { useParams, useRouter } from 'next/navigation';
import { DocumentUploadPage } from '@/components/document-upload';

export default function UploadPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  return (
    <DocumentUploadPage
      token={token}
      onTokenError={() => {
        // 토큰 오류 시 홈으로 리다이렉트
        setTimeout(() => router.push('/'), 3000);
      }}
      onUploadComplete={() => {
        // 업로드 완료 시 처리 (필요한 경우)
        console.log('All required documents uploaded');
      }}
    />
  );
}