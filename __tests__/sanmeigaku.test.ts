import { getSanmeigakuProfile } from '@/lib/sanmeigaku';

describe('getSanmeigakuProfile', () => {
  test('1995年は乙（きのと）を返す', () => {
    const result = getSanmeigakuProfile(1995);
    expect(result.jikkan).toBe('乙');
    expect(result.reading).toBe('きのと');
    expect(result.element).toBe('木');
  });

  test('1990年は庚（かのえ）を返す', () => {
    const result = getSanmeigakuProfile(1990);
    expect(result.jikkan).toBe('庚');
    expect(result.reading).toBe('かのえ');
    expect(result.element).toBe('金');
  });

  test('2000年は庚（かのえ）を返す', () => {
    const result = getSanmeigakuProfile(2000);
    expect(result.jikkan).toBe('庚');
  });

  test('descriptionが空文字でない', () => {
    const result = getSanmeigakuProfile(1995);
    expect(result.description.length).toBeGreaterThan(0);
  });
});
