'use client';

import { MBTIType } from '@/lib/types';

interface Props {
  mbti: MBTIType;
}

export default function ShareButtons({ mbti }: Props) {
  const url = typeof window !== 'undefined' ? window.location.origin : '';
  const text = `${mbti}の私の5年後シミュレーション、笑えないくらい当たってた😂 #人生年表 #MBTI診断`;

  const shareX = () => {
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(xUrl, '_blank');
  };

  const shareLine = () => {
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`;
    window.open(lineUrl, '_blank');
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    alert('URLをコピーしました！');
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-400 text-center mb-3">結果をシェアする</p>
      <div className="flex gap-2">
        <button
          onClick={shareX}
          className="flex-1 bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors"
        >
          𝕏 でシェア
        </button>
        <button
          onClick={shareLine}
          className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-green-600 transition-colors"
        >
          LINE で送る
        </button>
      </div>
      <button
        onClick={copyUrl}
        className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
      >
        🔗 URLをコピー
      </button>
    </div>
  );
}
