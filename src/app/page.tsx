'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MBTISelector from '@/components/MBTISelector';
import { MBTIType, UserInput } from '@/lib/types';

const CONCERNS = ['転職', '人間関係', 'お金', 'やりたいことが見つからない', 'その他'];
const SITUATIONS = ['会社員', 'フリーランス', '就活中', '無職', 'その他'];

export default function HomePage() {
  const router = useRouter();
  const [mbti, setMbti] = useState<MBTIType | null>(null);
  const [birthDate, setBirthDate] = useState('');
  const [concern, setConcern] = useState('');
  const [situation, setSituation] = useState('');
  const [avoidance, setAvoidance] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!mbti) { setError('MBTIタイプを選んでください'); return; }
    if (!birthDate) { setError('生年月日を入力してください'); return; }

    const input: UserInput = { mbti, birthDate, concern, situation, avoidance };
    sessionStorage.setItem('userInput', JSON.stringify(input));
    router.push('/loading-result');
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🔮</div>
        <h1 className="text-3xl font-bold text-indigo-900">人生シミュレーション年表</h1>
        <p className="text-gray-500 mt-2 text-sm">MBTI × 算命学 × 認知バイアス</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-8">
        <section>
          <label className="block font-semibold text-gray-700 mb-3">
            MBTIタイプを選ぶ <span className="text-red-500">*</span>
          </label>
          <MBTISelector value={mbti} onChange={setMbti} />
        </section>

        <section>
          <label className="block font-semibold text-gray-700 mb-2">
            生年月日 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </section>

        <section>
          <p className="font-semibold text-gray-700 mb-1">
            精度を上げる3問
            <span className="text-xs text-gray-400 font-normal ml-2">（任意）</span>
          </p>
          <p className="text-xs text-gray-400 mb-4">入力するほど、あなただけの結果になります</p>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">今一番悩んでいることは？</label>
              <div className="flex flex-wrap gap-2">
                {CONCERNS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setConcern(concern === c ? '' : c)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-all ${
                      concern === c
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-600 border-gray-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">今の状況は？</label>
              <div className="flex flex-wrap gap-2">
                {SITUATIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSituation(situation === s ? '' : s)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-all ${
                      situation === s
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-600 border-gray-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">直近で避けてきたことは？（自由記述）</label>
              <textarea
                value={avoidance}
                onChange={(e) => setAvoidance(e.target.value)}
                placeholder="例：上司への相談、副業の第一歩..."
                rows={2}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              />
            </div>
          </div>
        </section>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-colors text-lg"
        >
          あなたの未来を診断する →
        </button>
      </div>
    </div>
  );
}
