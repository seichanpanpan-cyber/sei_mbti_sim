'use client';

import { useState } from 'react';
import { TimelineEntry } from '@/lib/types';

interface Props {
  timeline: TimelineEntry[];
}

export default function Timeline({ timeline }: Props) {
  const [activeTab, setActiveTab] = useState<'dark' | 'light'>('light');

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
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('light')}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'light'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          🌟 行動を変えた未来
        </button>
        <button
          onClick={() => setActiveTab('dark')}
          className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'dark'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          🌑 バイアスに負けた未来
        </button>
      </div>

      {Object.entries(monthGroups).map(([year, entries]) => (
        <div key={year} className="mb-8">
          <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-3">
            ── {year}年 ──
          </h3>
          <div className="space-y-3">
            {entries.map((entry) => (
              <EntryCard key={entry.period} entry={entry} tab={activeTab} />
            ))}
          </div>
        </div>
      ))}

      {years.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-3">
            ── 中長期の流れ ──
          </h3>
          <div className="space-y-3">
            {years.map((entry) => (
              <EntryCard key={entry.period} entry={entry} tab={activeTab} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EntryCard({ entry, tab }: { entry: TimelineEntry; tab: 'dark' | 'light' }) {
  const [open, setOpen] = useState(false);
  const path = tab === 'dark' ? entry.path_dark : entry.path_light;

  return (
    <div
      className={`rounded-xl border p-4 cursor-pointer transition-all ${
        tab === 'dark'
          ? 'bg-gray-50 border-gray-200'
          : 'bg-indigo-50 border-indigo-100'
      }`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-400">{entry.period}</span>
          <h4 className="font-semibold text-gray-800 text-sm">{entry.title}</h4>
        </div>
        <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className="mt-3 space-y-3 text-sm">
          <p className="text-gray-400 text-xs">🌙 {entry.sanmeigaku_flow}</p>
          <p className="text-gray-700 leading-relaxed">{path.story}</p>
          {tab === 'dark' ? (
            <p className="text-orange-600 text-xs bg-orange-50 rounded-lg px-3 py-2">
              ⚠️ {(path as TimelineEntry['path_dark']).bias}
            </p>
          ) : (
            <div className="space-y-1">
              <p className="text-indigo-600 text-xs bg-white rounded-lg px-3 py-2">
                💡 {(path as TimelineEntry['path_light']).action}
              </p>
              <p className="text-green-600 text-xs font-semibold px-1">
                ✨ {(path as TimelineEntry['path_light']).encouragement}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
