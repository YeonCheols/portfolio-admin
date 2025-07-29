'use client';

import copy from 'copy-to-clipboard';
import { useState, useEffect } from 'react';
import { type SpellCheckResponse } from '@/app/api/spell-check/route';
import { postData } from '@/lib/api';
import { useSpellCheckStore } from '@/lib/zustand/spellCheck';
import { Button } from './button';

export function SpellChecker() {
  const { content, setContent } = useSpellCheckStore();

  const [result, setResult] = useState<SpellCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCheckSpelling = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      const response = await postData('/api/spell-check', { content }, false, {
        loadingMsg: '맞춤법 검사 중...',
        successMsg: '맞춤법 검사가 완료되었습니다.',
        errorMsg: '맞춤법 검사에 실패했습니다.',
      });

      if (response && !response.error && response.originalText && response.correctedText) {
        setResult(response as SpellCheckResponse);
      } else {
        console.error('맞춤법 검사 실패:', response.error);
      }
    } catch (error) {
      console.error('맞춤법 검사 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = () => {
    if (!result?.correctedText) return;

    const success = copy(result.correctedText, {
      format: 'text/plain',
      onCopy: () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // 2초 후 복사 상태 초기화
      },
    });

    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } else {
      console.error('텍스트 복사에 실패했습니다.');
    }
  };

  // NOTE: 페이지 이탈 시 컨텐츠 초기화
  useEffect(() => {
    return () => {
      setContent('');
    };
  }, [setContent]);

  return (
    <div className="space-y-4 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">맞춤법 검사기</h2>

      <div className="space-y-2">
        <label htmlFor="text-input" className="block text-sm font-medium text-gray-700">
          검사할 텍스트를 입력하세요
        </label>
        <textarea
          id="text-input"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="맞춤법을 검사할 한국어 텍스트를 입력하세요..."
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <Button onClick={handleCheckSpelling} disabled={isLoading || !content.trim()} className="w-full">
        {isLoading ? '검사 중...' : '맞춤법 검사'}
      </Button>

      {result && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-blue-900">수정된 텍스트</h3>
              <Button
                onClick={handleCopyText}
                disabled={isCopied}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                {isCopied ? '복사됨!' : '복사'}
              </Button>
            </div>
            <p className="text-blue-800 whitespace-pre-wrap">{result.correctedText}</p>
          </div>

          {result.errors.length > 0 && (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">발견된 오류</h3>
              <ul className="space-y-2">
                {result.errors.map((error, index) => (
                  <li key={index} className="text-yellow-800">
                    <span className="font-medium">{error.word}</span> →
                    <span className="font-medium text-green-700"> {error.suggestion}</span>
                    <span className="text-sm text-gray-600 ml-2">({error.type})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestions.length > 0 && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">개선 제안</h3>
              <ul className="space-y-1">
                {result.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="text-green-800">
                    • {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
