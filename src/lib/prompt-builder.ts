import { UserInput } from './types';
import { getMBTIBias } from './mbti-biases';
import { getSanmeigakuProfile } from './sanmeigaku';

export function buildSystemPrompt(): string {
  return `あなたは人生シミュレーションの専門家です。MBTI心理学・算命学・認知バイアス研究の知識を持ち、ユーザーのキャリアに関する人生シミュレーション年表をJSON形式で生成します。

ルール：
- 必ずJSON形式のみで出力すること。\`\`\`json などのコードブロックも含めない。
- 失敗シミュレーション（path_dark）はウィットに富んだ辛口で、読んで笑えるくらいのリアルさで書く
- 成功パターン（path_light）は優しく、背中を押す温かさで書く
- 全て日本語で出力する
- 「あなたは〜」という二人称で物語形式にする`;
}

export function buildUserPrompt(input: UserInput): string {
  const birthYear = new Date(input.birthDate).getFullYear();
  const age = new Date().getFullYear() - birthYear;
  const sanmeigaku = getSanmeigakuProfile(birthYear);
  const bias = getMBTIBias(input.mbti);

  const now = new Date();
  const startYear = now.getFullYear();
  const startMonth = now.getMonth() + 1;

  const optionalSection = [
    input.concern ? `今一番悩んでいること: ${input.concern}` : '',
    input.situation ? `現在の状況: ${input.situation}` : '',
    input.avoidance ? `直近で避けてきたこと: ${input.avoidance}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  return `以下のユーザー情報を基に、人生シミュレーション年表をJSON形式で生成してください。

## ユーザー情報
- MBTIタイプ: ${input.mbti}（${bias.name}）
- 生年月日: ${input.birthDate}（現在${age}歳）
- 算命学・天干: ${sanmeigaku.jikkan}（${sanmeigaku.reading}）
- 天干の性質: ${sanmeigaku.description}
- 天干の五行: ${sanmeigaku.element}の気

## このMBTIタイプ特有の認知バイアス
${bias.biases}

## キャリアへの影響パターン
${bias.careerImpact}

${optionalSection ? `## 個人の状況\n${optionalSection}` : ''}

## 生成する年表の期間
- ${startYear}年${startMonth}月〜12ヶ月分: 月単位（type: "month"）
- その後4年分: 年単位（type: "year"、periodは"2026年"のような形式）
- 合計16エントリ

## 出力JSONスキーマ（必ずこの形式で）
{
  "summary": "このユーザーへの総評（2〜3文）",
  "failure_simulation": "バイアスに負け続けた場合の数年後（ウィットに富んだ辛口、200文字程度）",
  "success_pattern": "認知バイアスを乗り越えた場合の数年後（優しく希望がある、200文字程度）",
  "timeline": [
    {
      "period": "${startYear}年${startMonth}月",
      "type": "month",
      "title": "この期間を表す短いタイトル（10文字以内）",
      "sanmeigaku_flow": "天干から見たこの時期の運気（1文）",
      "path_dark": {
        "story": "バイアスに負けた場合の物語（130文字程度）",
        "bias": "この時期に発動する認知バイアス名と発動パターン（1文）"
      },
      "path_light": {
        "story": "バイアスを乗り越えた場合の物語（130文字程度）",
        "action": "バイアスを超えるための具体的なアクション（1文）",
        "encouragement": "背中を押す一言（30文字以内）"
      }
    }
  ],
  "closing_message": "前向きな締めのメッセージ（どちらの道も選べることを示す、150文字程度）"
}`;
}
