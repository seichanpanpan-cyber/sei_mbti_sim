'use client';

import { MBTIType } from '@/lib/types';
import { MBTI_BIASES } from '@/lib/mbti-biases';

const MBTI_GROUPS = [
  {
    label: '分析家',
    color: 'bg-purple-100 border-purple-300',
    selectedColor: 'bg-purple-600 text-white border-purple-600',
    types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'] as MBTIType[],
  },
  {
    label: '外交官',
    color: 'bg-green-100 border-green-300',
    selectedColor: 'bg-green-600 text-white border-green-600',
    types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'] as MBTIType[],
  },
  {
    label: '番人',
    color: 'bg-blue-100 border-blue-300',
    selectedColor: 'bg-blue-600 text-white border-blue-600',
    types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'] as MBTIType[],
  },
  {
    label: '探検家',
    color: 'bg-yellow-100 border-yellow-300',
    selectedColor: 'bg-yellow-600 text-white border-yellow-600',
    types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'] as MBTIType[],
  },
];

interface Props {
  value: MBTIType | null;
  onChange: (type: MBTIType) => void;
}

export default function MBTISelector({ value, onChange }: Props) {
  return (
    <div className="space-y-4">
      {MBTI_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
            {group.label}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {group.types.map((type) => {
              const isSelected = value === type;
              return (
                <button
                  key={type}
                  onClick={() => onChange(type)}
                  className={`rounded-xl border-2 p-3 text-center transition-all ${
                    isSelected ? group.selectedColor : group.color
                  }`}
                >
                  <div className="font-bold text-sm">{type}</div>
                  <div className="text-xs mt-0.5 opacity-80">
                    {MBTI_BIASES[type].name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
