import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompt-builder';
import { UserInput } from '@/lib/types';

const baseInput: UserInput = {
  mbti: 'INFJ',
  birthDate: '1995-03-15',
};

describe('buildSystemPrompt', () => {
  test('JSON出力を指示している', () => {
    expect(buildSystemPrompt()).toContain('JSON');
  });
});

describe('buildUserPrompt', () => {
  test('MBTIタイプが含まれている', () => {
    const prompt = buildUserPrompt(baseInput);
    expect(prompt).toContain('INFJ');
    expect(prompt).toContain('提唱者');
  });

  test('天干が含まれている', () => {
    const prompt = buildUserPrompt(baseInput);
    expect(prompt).toContain('乙');
  });

  test('任意入力が存在する場合にプロンプトに含まれる', () => {
    const input: UserInput = {
      ...baseInput,
      concern: '転職',
      situation: '会社員',
      avoidance: '上司への相談',
    };
    const prompt = buildUserPrompt(input);
    expect(prompt).toContain('転職');
    expect(prompt).toContain('会社員');
    expect(prompt).toContain('上司への相談');
  });

  test('任意入力がない場合でもエラーにならない', () => {
    expect(() => buildUserPrompt(baseInput)).not.toThrow();
  });
});
