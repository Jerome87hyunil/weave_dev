'use client';

import React, { useState, useEffect } from 'react';
import { calculateTokenStats, clearTokenHistory } from '@/lib/token-tracker';

export default function TokenUsageDisplay() {
  const [stats, setStats] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      setStats(calculateTokenStats());
    };
    
    updateStats();
    
    // 5초마다 업데이트
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(4)}`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <>
      {/* 토큰 사용량 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 hover:shadow-xl transition-shadow z-40"
      >
        <span className="text-sm font-medium">토큰 사용량</span>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
          {formatCost(stats.total.cost)}
        </span>
      </button>

      {/* 토큰 사용량 상세 패널 */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 bg-white shadow-xl rounded-lg p-4 w-96 max-h-[600px] overflow-auto z-40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">토큰 사용량 통계</h3>
            <button
              onClick={() => {
                if (confirm('토큰 사용 기록을 초기화하시겠습니까?')) {
                  clearTokenHistory();
                  setStats(calculateTokenStats());
                }
              }}
              className="text-xs text-red-600 hover:text-red-700"
            >
              초기화
            </button>
          </div>

          {/* 전체 통계 */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">전체 사용량</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">입력 토큰:</span>
                <span className="ml-2 font-medium">{formatNumber(stats.total.inputTokens)}</span>
              </div>
              <div>
                <span className="text-gray-500">출력 토큰:</span>
                <span className="ml-2 font-medium">{formatNumber(stats.total.outputTokens)}</span>
              </div>
              <div>
                <span className="text-gray-500">총 요청:</span>
                <span className="ml-2 font-medium">{stats.total.count}회</span>
              </div>
              <div>
                <span className="text-gray-500">총 비용:</span>
                <span className="ml-2 font-medium text-blue-600">{formatCost(stats.total.cost)}</span>
              </div>
            </div>
          </div>

          {/* 모델별 통계 */}
          {Object.keys(stats.byModel).length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">모델별 사용량</h4>
              {Object.entries(stats.byModel).map(([model, data]: [string, any]) => (
                <div key={model} className="bg-gray-50 rounded-lg p-3 mb-2">
                  <div className="text-xs font-medium text-gray-600 mb-1">{model}</div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>입력: {formatNumber(data.inputTokens)}</div>
                    <div>출력: {formatNumber(data.outputTokens)}</div>
                    <div>요청: {data.count}회</div>
                    <div className="text-blue-600">비용: {formatCost(data.cost)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 최근 기록 */}
          {stats.history.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">최근 사용 기록</h4>
              <div className="space-y-1">
                {stats.history.map((item: any, idx: number) => (
                  <div key={idx} className="text-xs bg-gray-50 rounded p-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{item.taskType === 'extract' ? '데이터 추출' : '문서 생성'}</span>
                      <span className="text-blue-600">{formatCost(item.cost)}</span>
                    </div>
                    <div className="text-gray-500 mt-1">
                      입력: {formatNumber(item.inputTokens)} | 출력: {formatNumber(item.outputTokens)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 비용 참고 정보 */}
          <div className="mt-4 pt-4 border-t text-xs text-gray-500">
            <div className="font-medium mb-1">토큰 비용 (per 1M tokens):</div>
            <div>• Gemini 2.5 Flash Lite: $0.10 입력 / $0.40 출력</div>
            <div>• Gemini 2.5 Pro: $1.25 입력 / $5.00 출력</div>
          </div>
        </div>
      )}
    </>
  );
}