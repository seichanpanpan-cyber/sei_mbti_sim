import { MBTI_BIASES, getMBTIBias } from '@/lib/mbti-biases';

const ALL_TYPES = [
  'INTJ','INTP','ENTJ','ENTP',
  'INFJ','INFP','ENFJ','ENFP',
  'ISTJ','ISFJ','ESTJ','ESFJ',
  'ISTP','ISFP','ESTP','ESFP',
];

describe('MBTI_BIASES', () => {
  test('16タイプ全て定義されている', () => {
    ALL_TYPES.forEach(type => {
      expect(MBTI_BIASES[type as keyof typeof MBTI_BIASES]).toBeDefined();
    });
  });

  test('各タイプにname・biases・careerImpactが存在する', () => {
    ALL_TYPES.forEach(type => {
      const bias = MBTI_BIASES[type as keyof typeof MBTI_BIASES];
      expect(bias.name.length).toBeGreaterThan(0);
      expect(bias.biases.length).toBeGreaterThan(0);
      expect(bias.careerImpact.length).toBeGreaterThan(0);
    });
  });
});

describe('getMBTIBias', () => {
  test('INFJのデータを返す', () => {
    const result = getMBTIBias('INFJ');
    expect(result.name).toBe('提唱者');
  });
});
