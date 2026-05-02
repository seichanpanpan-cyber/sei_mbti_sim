'use client';

import { useState } from 'react';
import { TimelineEntry } from '@/lib/types';

interface Props {
  timeline: TimelineEntry[];
}

export default function Timeline({ timeline }: Props) {
  const months = timeline.filter((e) => e.type === 'month');
  const years = timeline.filter((e) => e.type === 'year');

  const groupByYear = (entries: TimelineEntry[]) => {
    const groups: Record<string, TimelineEntry[]> = {};
    entries.forEach((entry) => {
      const year = entry.period.match(/(\d{4})年/)?.[1] ?? '不明';
      if (!groups[year]) groups[year] = [];
      groups[year].push(entry);
    });
    return groups;
  };

  const monthGroups = groupByYear(months);

  return (
    <div>
      {/* ヘッダー凡例 */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-gray-800 to-red-900 rounded-xl py-2">
          <span className="text-lg">😈</span>
          <span className="text-white text-xs font-bold">バイアスに負けた未来</span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-indigo-500 to-sky-400 rounded-xl py-2">
          <span className="text-lg">😇</span>
          <span className="text-white text-xs font-bold">行動を変えた未来</span>
        </div>
      </div>

      {/* 月別エントリ */}
      {Object.entries(monthGroups).map(([year, entries]) => (
        <div key={year} className="mb-8">
          <h3 className="font-bold text-gray-400 text-xs tracking-widest mb-3 text-center">
            ── {year}年 ──
          </h3>
          <div className="space-y-4">
            {entries.map((entry) => (
              <EntryCard key={entry.period} entry={entry} />
            ))}
          </div>
        </div>
      ))}

      {/* 中長期エントリ */}
      {years.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold text-gray-400 text-xs tracking-widest mb-3 text-center">
            ── 中長期の流れ ──
          </h3>
          <div className="space-y-4">
            {years.map((entry) => (
              <EntryCard key={entry.period} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EntryCard({ entry }: { entry: TimelineEntry }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      {/* ヘッダー（タップで開閉） */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-white"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2 text-left">
          <div className="bg-amber-50 rounded-lg px-2 py-1">
            <span className="text-amber-600 text-xs font-bold">{entry.period}</span>
          </div>
          <span className="font-bold text-gray-800 text-sm">{entry.title}</span>
        </div>
        <span className="text-gray-400 text-sm ml-2">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div>
          {/* 算命学 */}
          <div className="px-4 py-2 bg-amber-50 border-t border-amber-100">
            <p className="text-amber-700 text-xs">
              <span className="font-bold">🔯 算命学｜</span>{entry.sanmeigaku_flow}
            </p>
          </div>

          {/* 悪魔と天使を横並び */}
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            {/* 😈 悪魔サイド */}
            <div className="bg-gray-950 p-3 space-y-2">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-base">😈</span>
                <span className="text-red-400 text-xs font-bold">バイアスに負けると</span>
              </div>
              <p className="text-gray-300 text-xs leading-relaxed">{entry.path_dark.story}</p>
              <div className="bg-red-950 rounded-lg px-2 py-1.5">
                <p className="text-red-300 text-xs leading-relaxed">{entry.path_dark.bias}</p>
              </div>
            </div>

            {/* 😇 天使サイド */}
            <div className="bg-indigo-50 p-3 space-y-2">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-base">😇</span>
                <span className="text-indigo-500 text-xs font-bold">気づいて動くと</span>
              </div>
              <p className="text-indigo-800 text-xs leading-relaxed">{entry.path_light.story}</p>
              <div className="bg-white rounded-lg px-2 py-1.5">
                <p className="text-sky-600 text-xs leading-relaxed">{entry.path_light.action}</p>
              </div>
              <p className="text-indigo-400 text-xs font-bold text-center">
                ✨ {entry.path_light.encouragement}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
