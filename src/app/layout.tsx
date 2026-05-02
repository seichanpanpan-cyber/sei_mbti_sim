import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';

const noto = Noto_Sans_JP({ subsets: ['latin'], weight: ['400', '700'] });

export const metadata: Metadata = {
  title: '人生シミュレーション年表 | MBTI × 算命学 × 認知バイアス',
  description: 'あなたのMBTIと生年月日から、5年間の人生シミュレーション年表を生成します。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className={noto.className}>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
