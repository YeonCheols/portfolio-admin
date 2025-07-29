import { GoogleGenAI } from '@google/genai';
import { type NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY || '',
});

export interface SpellCheckResponse {
  originalText: string;
  correctedText: string;
  errors: Array<{
    word: string;
    position: number;
    suggestion: string;
    type: 'spelling' | 'grammar' | 'punctuation';
  }>;
  suggestions: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    if (!content || typeof content !== 'string') {
      return NextResponse.json({ error: '텍스트가 필요합니다.' }, { status: 400 });
    }

    // API 키 확인
    if (!process.env.GOOGLE_GENAI_API_KEY) {
      return NextResponse.json(
        {
          error: 'API 키가 설정되지 않았습니다.',
          type: 'API_KEY_MISSING',
        },
        { status: 500 },
      );
    }

    const prompt = `
다음 마크다운 텍스트의 맞춤법과 문법을 검사해주세요. 
마크다운 문법은 그대로 유지하면서 텍스트 내용만 검사해주세요.

마크다운 텍스트: "${content}"

다음 형식으로 응답해주세요:
{
  "originalText": "원본 마크다운 텍스트",
  "correctedText": "수정된 마크다운 텍스트 (마크다운 문법 유지)", 
  "errors": [
    {
      "word": "잘못된 단어",
      "position": 0,
      "suggestion": "수정 제안",
      "type": "spelling"
    }
  ],
  "suggestions": ["전체적인 개선 제안"]
}

주의사항:
- 마크다운 문법 (제목, 강조, 링크, 코드 등)은 그대로 유지
- 코드 블록 내부는 검사하지 않음
- 링크 URL은 검사하지 않음
- 텍스트 내용만 맞춤법 검사

오직 JSON만 반환하고 다른 설명은 포함하지 마세요.
`;

    const model = genAI.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
    });

    const response = await model;
    const responseText = response.text;
    // JSON 파싱
    if (!responseText) {
      throw new Error('Response text is undefined');
    }
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }

    const result = JSON.parse(jsonMatch[0]) as SpellCheckResponse;

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Spell check error:', error);

    // Google API 에러 타입별 처리
    let errorType = 'UNKNOWN_ERROR';
    let errorMessage = '검사 중 오류가 발생했습니다.';

    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      errorType = 'QUOTA_EXCEEDED';
      errorMessage = 'API 사용 한도를 초과했습니다.';
    } else if (error.message?.includes('permission') || error.message?.includes('forbidden')) {
      errorType = 'PERMISSION_DENIED';
      errorMessage = 'API 접근 권한이 없습니다.';
    } else if (error.message?.includes('invalid') || error.message?.includes('bad request')) {
      errorType = 'INVALID_REQUEST';
      errorMessage = '잘못된 요청입니다.';
    } else if (error.message?.includes('api key') || error.message?.includes('authentication')) {
      errorType = 'API_KEY_ERROR';
      errorMessage = 'API 키가 유효하지 않습니다.';
    }

    return NextResponse.json(
      {
        error: errorMessage,
        type: errorType,
        details: error.message,
        suggestions: ['잠시 후 다시 시도해주세요.'],
      },
      { status: 500 },
    );
  }
}
