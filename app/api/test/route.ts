import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'API is working',
    env: {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasGemini: !!process.env.GEMINI_API_KEY
    }
  });
}