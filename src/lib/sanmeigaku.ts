const JIKKAN = ['庚', '辛', '壬', '癸', '甲', '乙', '丙', '丁', '戊', '己'] as const;
const JIKKAN_READING = ['かのえ', 'かのと', 'みずのえ', 'みずのと', 'きのえ', 'きのと', 'ひのえ', 'ひのと', 'つちのえ', 'つちのと'];
const JIKKAN_ELEMENT = ['金', '金', '水', '水', '木', '木', '火', '火', '土', '土'];
const JIKKAN_DESCRIPTION: Record<string, string> = {
  '甲': '大きな木。リーダーシップがあり、まっすぐ上を目指す性質。困難も正面から突破する力を持つ。',
  '乙': '草花。柔軟で適応力が高く、人の間を縫って成長する性質。しなやかな強さがある。',
  '丙': '太陽。明るく情熱的で、周囲を照らすエネルギーを持つ性質。存在自体が人を元気にする。',
  '丁': 'ろうそく。繊細で深い洞察力を持ち、内側から光る性質。温かく人の心を照らす。',
  '戊': '大山。どっしりと安定し、人の土台となる性質。信頼と安心感を与える存在。',
  '己': '大地。包容力があり、物事を育て支える性質。縁の下の力持ちとして輝く。',
  '庚': '鉄鉱石。強い意志と鋭さを持ち、磨かれると輝く性質。プレッシャーで真価を発揮する。',
  '辛': '宝石。繊細で美しさへのこだわりが強く、本物を見抜く性質。高い審美眼を持つ。',
  '壬': '大海。スケールが大きく、自由に流れながら全てを包む性質。器の大きさで人を惹きつける。',
  '癸': '雨・霧。浸透力が高く、見えないところで物事を潤す性質。じわじわと確実に影響を与える。',
};

export function getSanmeigakuProfile(birthYear: number): {
  jikkan: string;
  reading: string;
  element: string;
  description: string;
} {
  const index = birthYear % 10;
  return {
    jikkan: JIKKAN[index],
    reading: JIKKAN_READING[index],
    element: JIKKAN_ELEMENT[index],
    description: JIKKAN_DESCRIPTION[JIKKAN[index]],
  };
}
