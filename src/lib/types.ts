export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface UserInput {
  mbti: MBTIType;
  birthDate: string; // YYYY-MM-DD
  concern?: string;
  situation?: string;
  avoidance?: string;
}

export interface TimelineEntry {
  period: string;
  type: 'month' | 'year';
  title: string;
  sanmeigaku_flow: string;
  path_dark: {
    story: string;
    bias: string;
  };
  path_light: {
    story: string;
    action: string;
    encouragement: string;
  };
}

export interface GenerationResult {
  summary: string;
  failure_simulation: string;
  success_pattern: string;
  timeline: TimelineEntry[];
  closing_message: string;
}
