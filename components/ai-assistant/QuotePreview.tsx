'use client';

import React, { useEffect, useState } from 'react';
import { marked } from 'marked';

interface QuotePreviewProps {
  content: string;
  title?: string;
  onPrint?: () => void;
  onExportPDF?: () => void;
  onClose?: () => void;
}

export default function QuotePreview({ content, title = '견적서', onPrint, onExportPDF, onClose }: QuotePreviewProps) {
  const [formattedContent, setFormattedContent] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  useEffect(() => {
    const renderContent = () => {
      // 마크다운을 HTML로 변환
      const html = marked(content, {
        breaks: true,
        gfm: true,
      });
      
      // 문서 번호 생성
      const docNumber = `WV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
      
      // 문서 타입에 따른 헤더 생성
      const getDocumentHeader = () => {
        const docTypeMap: { [key: string]: string } = {
          '견적서': 'QUOTATION',
          '계약서': 'CONTRACT',
          '청구서': 'INVOICE'
        };
        
        return `
          <div class="doc-header">
            <div class="company-section">
              <div class="company-logo">WEAVE</div>
              <div class="company-subtitle">프리랜서를 위한 통합 비즈니스 플랫폼</div>
            </div>
            <h1 class="doc-title">${title}</h1>
            <div class="doc-title-en">${docTypeMap[title] || 'DOCUMENT'}</div>
            <div class="doc-meta">
              <div>문서번호: ${docNumber}</div>
              <div>발행일: ${today}</div>
            </div>
          </div>
        `;
      };
      
      // A4 인쇄용 클래식 디자인 스타일
      const documentHTML = `
        <style>
          /* A4 인쇄 설정 */
          @media print {
            @page {
              size: A4;
              margin: 15mm;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body { 
              margin: 0 !important; 
              padding: 0 !important;
            }
            .document-wrapper { 
              box-shadow: none !important;
              margin: 0 !important;
            }
            .no-print {
              display: none !important;
            }
            h1, h2, h3, h4, table, .signature-section, .info-section { 
              page-break-inside: avoid;
            }
          }
          
          /* 기본 문서 스타일 */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Noto Sans KR', '맑은 고딕', 'Malgun Gothic', -apple-system, sans-serif;
            font-size: 11pt;
            line-height: 1.7;
            color: #222;
            background: #f5f5f5;
          }
          
          .document-wrapper {
            width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            padding: 30mm 25mm;
          }
          
          /* 문서 헤더 디자인 */
          .doc-header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 25px;
            border-bottom: 2px solid #333;
          }
          
          .company-section {
            margin-bottom: 30px;
          }
          
          .company-logo {
            font-size: 24px;
            font-weight: 900;
            color: #2563eb;
            letter-spacing: 3px;
            margin-bottom: 5px;
          }
          
          .company-subtitle {
            font-size: 10pt;
            color: #666;
            letter-spacing: 0.5px;
          }
          
          .doc-title {
            font-size: 28pt;
            font-weight: 700;
            margin: 20px 0 5px 0;
            color: #000;
            letter-spacing: 8px;
          }
          
          .doc-title-en {
            font-size: 14pt;
            color: #666;
            letter-spacing: 2px;
            margin-bottom: 20px;
          }
          
          .doc-meta {
            font-size: 10pt;
            color: #555;
            display: flex;
            justify-content: center;
            gap: 30px;
          }
          
          /* 섹션 제목 스타일 */
          h1 {
            font-size: 18pt;
            font-weight: 700;
            margin: 30px 0 20px 0;
            color: #000;
            padding-bottom: 8px;
            border-bottom: 2px solid #333;
          }
          
          h2 {
            font-size: 14pt;
            font-weight: 600;
            margin: 25px 0 15px 0;
            padding-bottom: 5px;
            border-bottom: 1px solid #666;
            color: #222;
          }
          
          h3 {
            font-size: 12pt;
            font-weight: 600;
            margin: 20px 0 10px 0;
            color: #333;
          }
          
          h4 {
            font-size: 11pt;
            font-weight: 600;
            margin: 15px 0 8px 0;
            color: #444;
          }
          
          /* 본문 스타일 */
          p {
            margin: 10px 0;
            line-height: 1.7;
            text-align: justify;
          }
          
          /* 리스트 스타일 */
          ul, ol {
            margin: 12px 0 12px 25px;
          }
          
          li {
            margin: 6px 0;
            line-height: 1.6;
          }
          
          /* 테이블 스타일 */
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            font-size: 10pt;
            border: 2px solid #333;
          }
          
          th {
            background: #f0f0f0;
            font-weight: 600;
            text-align: left;
            padding: 12px;
            border: 1px solid #666;
            font-size: 10pt;
          }
          
          td {
            padding: 10px 12px;
            border: 1px solid #999;
            background: white;
          }
          
          tr:nth-child(even) td {
            background: #fafafa;
          }
          
          /* 금액 표시 */
          td:last-child, th:last-child {
            text-align: right;
            font-weight: 600;
          }
          
          /* 강조 텍스트 */
          strong {
            font-weight: 600;
            color: #000;
          }
          
          em {
            font-style: italic;
            color: #555;
          }
          
          /* 구분선 */
          hr {
            margin: 25px 0;
            border: none;
            border-top: 1px solid #666;
          }
          
          /* 정보 섹션 */
          .info-section {
            margin: 20px 0;
            padding: 15px;
            background: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 4px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin: 20px 0;
          }
          
          .info-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin: 8px 0;
          }
          
          .info-label {
            font-weight: 600;
            min-width: 100px;
            color: #444;
          }
          
          .info-value {
            color: #222;
          }
          
          /* 합계 섹션 */
          .total-section {
            margin-top: 30px;
            padding: 20px;
            background: #f5f5f5;
            border: 2px solid #333;
            border-radius: 4px;
          }
          
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 11pt;
          }
          
          .total-row.grand-total {
            border-top: 2px solid #333;
            margin-top: 12px;
            padding-top: 12px;
            font-size: 14pt;
            font-weight: 700;
            color: #000;
          }
          
          /* 서명 섹션 */
          .signature-section {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            padding-top: 40px;
            border-top: 1px solid #666;
          }
          
          .signature-box {
            width: 200px;
            text-align: center;
          }
          
          .signature-label {
            font-size: 11pt;
            font-weight: 600;
            margin-bottom: 60px;
            color: #333;
          }
          
          .signature-line {
            border-bottom: 1px solid #333;
            margin-bottom: 8px;
            height: 1px;
          }
          
          .signature-date {
            font-size: 9pt;
            color: #666;
            margin-top: 5px;
          }
          
          /* 푸터 */
          .doc-footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #999;
            text-align: center;
            font-size: 9pt;
            color: #666;
            line-height: 1.6;
          }
          
          /* 인용구 */
          blockquote {
            border-left: 3px solid #2563eb;
            padding-left: 15px;
            margin: 15px 0;
            font-style: italic;
            color: #555;
            background: #f9f9f9;
            padding: 10px 15px;
          }
          
          /* 코드 */
          code {
            font-family: 'Courier New', monospace;
            background: #f5f5f5;
            padding: 2px 6px;
            border: 1px solid #ddd;
            border-radius: 3px;
            font-size: 10pt;
          }
          
          pre {
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 15px;
            overflow-x: auto;
            margin: 15px 0;
          }
          
          pre code {
            background: none;
            border: none;
            padding: 0;
          }
          
          /* 반응형 조정 */
          @media screen and (max-width: 800px) {
            .document-wrapper {
              width: 100%;
              margin: 0;
              padding: 20px;
              box-shadow: none;
            }
            
            .signature-section {
              flex-direction: column;
              gap: 40px;
            }
            
            .signature-box {
              width: 100%;
            }
            
            .info-grid {
              grid-template-columns: 1fr;
            }
          }
        </style>
        <div class="document-wrapper">
          ${getDocumentHeader()}
          <div class="document-content">
            ${html}
          </div>
          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-label">공급자</div>
              <div class="signature-line"></div>
              <div class="signature-date">(서명/날인)</div>
            </div>
            <div class="signature-box">
              <div class="signature-label">수신자</div>
              <div class="signature-line"></div>
              <div class="signature-date">(서명/날인)</div>
            </div>
          </div>
          <div class="doc-footer">
            <p><strong>WEAVE</strong> - Professional Business Platform for Freelancers</p>
            <p>www.weave.co.kr | support@weave.co.kr | 02-1234-5678</p>
            <p>서울특별시 강남구 테헤란로 123, 위브타워 15층</p>
          </div>
        </div>
      `;
      
      return documentHTML;
    };
    
    const formatted = renderContent();
    setFormattedContent(formatted);
  }, [content, title]);
  
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>${title}</title>
            <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap" rel="stylesheet">
          </head>
          <body>
            ${formattedContent}
          </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
    onPrint?.();
  };
  
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // PDF export would be implemented here
      // For now, we'll use the browser's print to PDF functionality
      handlePrint();
    } finally {
      setIsExporting(false);
    }
    onExportPDF?.();
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[92vh] overflow-hidden flex flex-col">
        {/* 모던한 상단 헤더 */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
          <div className="relative px-12 py-8 flex justify-between items-center">
            {/* 왼쪽: 제목 영역 */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl"></div>
                <div className="relative p-3.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="text-[26px] font-bold text-white tracking-tight">
                  {title} 미리보기
                </h2>
                <p className="text-[15px] text-blue-100 mt-1">문서를 확인하고 인쇄하거나 저장할 수 있습니다</p>
              </div>
            </div>
            
            {/* 오른쪽: 액션 버튼들 */}
            <div className="flex items-center gap-4">
              {/* 인쇄 버튼 */}
              <button
                onClick={handlePrint}
                className="group relative px-8 py-4 bg-white text-blue-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden min-w-[140px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  <span className="text-[16px] font-semibold">인쇄</span>
                </div>
              </button>
              
              {/* PDF 저장 버튼 */}
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="group relative px-8 py-4 bg-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden min-w-[160px]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[16px] font-semibold">{isExporting ? 'PDF 생성 중...' : 'PDF 저장'}</span>
                </div>
              </button>
              
              {/* 구분선 */}
              <div className="h-12 w-px bg-white/20 mx-3"></div>
              
              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className="group relative p-4 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md border border-white/20 transition-all duration-200"
                aria-label="닫기"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* 문서 프리뷰 영역 */}
        <div className="flex-1 overflow-auto bg-gradient-to-b from-gray-50 to-gray-100 p-8">
          <div className="max-w-[210mm] mx-auto">
            <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
          </div>
        </div>
      </div>
    </div>
  );
}