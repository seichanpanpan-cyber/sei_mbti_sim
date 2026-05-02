'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GenerationResult } from '@/lib/types';

const MESSAGES = [
  '星の配置を読み込んでいます...',
  '天干のエネルギーを計算中...',
  'あなたの認知バイアスを特定中...',
  '2つの未来をシミュレーション中...',
  'もうすぐ完成します...',
];

export default function LoadingResultPage() {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [rawText, setRawText] = useState('');

  useEffect(() => {
    const input = sessionStorage.getItem('userInput');
    if (!input) { router.push('/'); return; }

    const msgInterval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 4000);

    const fetchResult = async () => {
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: input,
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`APIエラー ${response.status}: ${errText.substring(0, 200)}`);
        }

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let fullText = '';
        let received = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          fullText += chunk;
          received += chunk.length;
          setProgress(Math.min(95, Math.floor((received / 4000) * 100)));
        }

        console.log('=== RAW RESPONSE (first 500 chars) ===');
        console.log(fullText.substring(0, 500));
        console.log('=== RAW RESPONSE (last 200 chars) ===');
        console.log(fullText.substring(fullText.length - 200));
        console.log('=== TOTAL LENGTH ===', fullText.length);

        // コードブロックを取り除く
        const cleanText = fullText
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();

        // JSONの開始({)と終了(})を探して抽出する
        const jsonStart = cleanText.indexOf('{');
        const jsonEnd = cleanText.lastIndexOf('}');

        if (jsonStart === -1 || jsonEnd === -1) {
          setRawText(cleanText.substring(0, 800));
          throw new Error(`JSONが見つかりません（受信文字数: ${fullText.length}文字）`);
        }

        const jsonText = cleanText.substring(jsonStart, jsonEnd + 1);

        let result: GenerationResult;
        try {
          result = JSON.parse(jsonText);
        } catch (parseErr) {
          console.error('JSON parse error:', parseErr);
          console.error('JSON text (first 500):', jsonText.substring(0, 500));
          console.error('JSON text (last 200):', jsonText.substring(jsonText.length - 200));
          setRawText(jsonText.substring(0, 800));

          // JSONが途中で切れていた場合、部分的なデータを表示する試み
          const partialResult = tryExtractPartialResult(jsonText);
          if (partialResult) {
            sessionStorage.setItem('generationResult', JSON.stringify(partialResult));
            sessionStorage.setItem('userInputForResult', input);
            clearInterval(msgInterval);
            router.push('/result');
            return;
          }

          throw new Error(`JSON解析エラー: レスポンスが途中で切れた可能性があります（${fullText.length}文字受信）`);
        }

        sessionStorage.setItem('generationResult', JSON.stringify(result));
        sessionStorage.setItem('userInputForResult', input);
        clearInterval(msgInterval);
        router.push('/result');
      } catch (err) {
        console.error('Fetch/parse error:', err);
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        clearInterval(msgInterval);
      }
    };

    fetchResult();
    return () => clearInterval(msgInterval);
  }, [router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 max-w-lg mx-auto">
        <p className="text-red-500 font-bold mb-2 text-center">エラーが発生しました</p>
        <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        {rawText && (
          <details className="w-full mb-4">
            <summary className="text-gray-400 text-xs cursor-pointer mb-2">受信データを表示（デバッグ用）</summary>
            <pre className="bg-gray-100 rounded-lg p-3 text-xs text-gray-600 overflow-auto max-h-48 whitespace-pre-wrap break-all">
              {rawText}
            </pre>
          </details>
        )}
        <button
          onClick={() => router.push('/')}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl"
        >
          トップに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="text-6xl mb-8 animate-pulse">✨</div>
      <h2 className="text-xl font-bold text-indigo-900 mb-2">
        {MESSAGES[messageIndex]}
      </h2>
      <p className="text-gray-400 text-sm mb-8">30〜40秒ほどかかります</p>
      <div className="w-64 bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-gray-400 text-xs mt-2">{progress}%</p>
    </div>
  );
}

/** JSONが途中で切れている場合に部分的なデータを救出する */
function tryExtractPartialResult(jsonText: string): GenerationResult | null {
  try {
    // summaryだけでも取れれば最低限表示できる
    const summaryMatch = jsonText.match(/"summary"\s*:\s*"([^"]+)"/);
    const failureMatch = jsonText.match(/"failure_simulation"\s*:\s*"([^"]+)"/);
    const successMatch = jsonText.match(/"success_pattern"\s*:\s*"([^"]+)"/);
    const closingMatch = jsonText.match(/"closing_message"\s*:\s*"([^"]+)"/);

    if (!summaryMatch) return null;

    // timelineを配列として取り出す試み
    const timeline: GenerationResult['timeline'] = [];
    const timelineMatch = jsonText.match(/"timeline"\s*:\s*\[/);
    if (timelineMatch) {
      // 個別エントリを正規表現で拾う（壊れたJSONから）
      const extractAll = (text: string, re: RegExp): string[] => {
        const results: string[] = [];
        let m;
        while ((m = re.exec(text)) !== null) results.push(m[1]);
        return results;
      };
      const periodMatches = extractAll(jsonText, /"period"\s*:\s*"([^"]+)"/g);
      const titleMatches = extractAll(jsonText, /"title"\s*:\s*"([^"]+)"/g);
      const typeMatches = extractAll(jsonText, /"type"\s*:\s*"([^"]+)"/g);

      for (let i = 0; i < periodMatches.length; i++) {
        timeline.push({
          period: periodMatches[i] ?? '',
          type: (typeMatches[i] as 'month' | 'year') ?? 'month',
          title: titleMatches[i] ?? '',
          sanmeigaku_flow: '',
          path_dark: { story: '（データ取得中断）', bias: '' },
          path_light: { story: '（データ取得中断）', action: '', encouragement: '' },
        });
      }
    }

    return {
      summary: summaryMatch[1],
      failure_simulation: failureMatch?.[1] ?? '（データ取得中断）',
      success_pattern: successMatch?.[1] ?? '（データ取得中断）',
      timeline,
      closing_message: closingMatch?.[1] ?? 'もう一度試してください。',
    };
  } catch {
    return null;
  }
}
