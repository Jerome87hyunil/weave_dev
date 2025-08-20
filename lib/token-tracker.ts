// 토큰 사용량 추적 유틸리티

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  model: string;
  cost: number;
  timestamp: Date;
  taskType: 'extract' | 'generate';
}

export interface TokenCost {
  model: string;
  inputPer1M: number;
  outputPer1M: number;
}

// Gemini 모델별 토큰 비용 (USD per 1M tokens)
const TOKEN_COSTS: Record<string, TokenCost> = {
  'gemini-2.5-flash-lite': {
    model: 'gemini-2.5-flash-lite',
    inputPer1M: 0.10,
    outputPer1M: 0.40
  },
  'gemini-2.5-pro': {
    model: 'gemini-2.5-pro',
    inputPer1M: 1.25,
    outputPer1M: 5.00
  },
  'gemini-2.0-flash': {
    model: 'gemini-2.0-flash',
    inputPer1M: 0.075,
    outputPer1M: 0.30
  }
};

// 텍스트를 토큰으로 대략 변환 (실제로는 더 정확한 tokenizer 사용 권장)
export function estimateTokens(text: string): number {
  // 대략적으로 한국어는 글자당 1.5 토큰, 영어는 4글자당 1토큰
  const koreanChars = (text.match(/[가-힣]/g) || []).length;
  const englishChars = (text.match(/[a-zA-Z]/g) || []).length;
  const otherChars = text.length - koreanChars - englishChars;
  
  return Math.ceil(koreanChars * 1.5 + englishChars * 0.25 + otherChars * 0.5);
}

// 토큰 비용 계산
export function calculateCost(
  inputTokens: number, 
  outputTokens: number, 
  model: string
): number {
  const cost = TOKEN_COSTS[model];
  if (!cost) {
    console.warn(`Unknown model: ${model}, using default cost`);
    return 0;
  }
  
  const inputCost = (inputTokens / 1_000_000) * cost.inputPer1M;
  const outputCost = (outputTokens / 1_000_000) * cost.outputPer1M;
  
  return inputCost + outputCost;
}

// 토큰 사용량 기록 (브라우저 localStorage에 저장)
export function recordTokenUsage(usage: TokenUsage): void {
  if (typeof window === 'undefined') return;
  
  const history = getTokenHistory();
  history.push(usage);
  
  // 최근 100개만 유지
  if (history.length > 100) {
    history.splice(0, history.length - 100);
  }
  
  localStorage.setItem('tokenUsageHistory', JSON.stringify(history));
}

// 토큰 사용 기록 가져오기
export function getTokenHistory(): TokenUsage[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('tokenUsageHistory');
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// 토큰 사용 통계 계산
export function calculateTokenStats() {
  const history = getTokenHistory();
  
  const totalInputTokens = history.reduce((sum, h) => sum + h.inputTokens, 0);
  const totalOutputTokens = history.reduce((sum, h) => sum + h.outputTokens, 0);
  const totalCost = history.reduce((sum, h) => sum + h.cost, 0);
  
  const byModel = history.reduce((acc, h) => {
    if (!acc[h.model]) {
      acc[h.model] = {
        inputTokens: 0,
        outputTokens: 0,
        cost: 0,
        count: 0
      };
    }
    acc[h.model].inputTokens += h.inputTokens;
    acc[h.model].outputTokens += h.outputTokens;
    acc[h.model].cost += h.cost;
    acc[h.model].count += 1;
    return acc;
  }, {} as Record<string, any>);
  
  return {
    total: {
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens,
      cost: totalCost,
      count: history.length
    },
    byModel,
    history: history.slice(-10) // 최근 10개
  };
}

// 토큰 사용 기록 초기화
export function clearTokenHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('tokenUsageHistory');
}