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

        if (!response.ok) throw new Error('生成に失敗しました');

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
          setProgress(Math.min(95, Math.floor((received / 3000) * 100)));
        }

        const result: GenerationResult = JSON.parse(fullText);
        sessionStorage.setItem('generationResult', JSON.stringify(result));
        sessionStorage.setItem('userInputForResult', input);
        clearInterval(msgInterval);
        router.push('/result');
      } catch {
        setError('エラーが発生しました。もう一度試してください。');
        clearInterval(msgInterval);
      }
    };

    fetchResult();
    return () => clearInterval(msgInterval);
  }, [router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <p className="text-red-500 mb-4">{error}</p>
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
      <p className="text-gray-400 text-sm mb-8">30秒ほどかかります</p>
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
