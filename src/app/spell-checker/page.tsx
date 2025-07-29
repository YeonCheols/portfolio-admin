import { SpellChecker } from '@/components/ui/spell-checker';

export default function SpellCheckerPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Gemini 맞춤법 검사기</h1>

        <div className="mb-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">사용법</h2>
          <ul className="space-y-2 text-blue-800">
            <li>• 검사하고 싶은 한국어 텍스트를 입력하세요</li>
            <li>• &quot;맞춤법 검사&quot; 버튼을 클릭하세요</li>
            <li>• Gemini AI가 맞춤법과 문법을 검사하고 수정 제안을 제공합니다</li>
            <li>• 발견된 오류와 개선 제안을 확인하세요</li>
          </ul>
        </div>

        <SpellChecker />

        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">예시 텍스트</h2>
          <div className="space-y-2 text-gray-700">
            <p>다음과 같은 텍스트로 테스트해보세요:</p>
            <div className="bg-white p-4 rounded border">
              <p className="text-sm">
                &quot;안녕하세요. 저는 한국어를 공부하고 있습니다. 오늘 날씨가 좋네요. 맞춤법 검사를 해보고 싶어요.
                문법도 함께 확인해주세요.&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
