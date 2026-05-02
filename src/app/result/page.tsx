'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Timeline from '@/components/Timeline';
import ShareButtons from '@/components/ShareButtons';
import { GenerationResult, UserInput } from '@/lib/types';

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [input, setInput] = useState<UserInput | null>(null);

  useEffect(() => {
    const r = sessionStorage.getItem('generationResult');
    const i = sessionStorage.getItem('userInputForResult');
    if (!r || !i) { router.push('/'); return; }
    setResult(JSON.parse(r));
    setInput(JSON.parse(i));
  }, [router]);

  if (!result || !input) return null;

  const birthYear = new Date(input.birthDate).getFullYear();

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🔮</div>
        <h1 className="text-xl font-bold text-indigo-900">
          {input.mbti}さん（{birthYear}年生まれ）の
        </h1>
        <p className="text-gray-500 text-sm">人生シミュレーション年表</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
        <h2 className="font-bold text-gray-700 mb-2 text-sm">📝 総評</h2>
        <p className="text-gray-700 text-sm leading-relaxed">{result.summary}</p>
      </div>

      <div className="bg-gray-900 rounded-2xl p-5 mb-4">
        <h2 className="font-bold text-gray-200 mb-2 text-sm">⚡ 失敗シミュレーション</h2>
        <p className="text-gray-300 text-sm leading-relaxed">{result.failure_simulation}</p>
      </div>

      <div className="bg-indigo-50 rounded-2xl p-5 mb-6">
        <h2 className="font-bold text-indigo-700 mb-2 text-sm">✨ 成功パターン</h2>
        <p className="text-indigo-800 text-sm leading-relaxed">{result.success_pattern}</p>
      </div>

      <Timeline timeline={result.timeline} />

      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-6 mb-6 text-white">
        <div className="text-2xl mb-2">🌅</div>
        <p className="text-sm leading-relaxed">{result.closing_message}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
        <ShareButtons mbti={input.mbti} />
      </div>

      <button
        onClick={() => router.push('/')}
        className="w-full text-gray-400 text-sm py-3 hover:text-gray-600 transition-colors"
      >
        ← もう一度診断する
      </button>
    </div>
  );
}
