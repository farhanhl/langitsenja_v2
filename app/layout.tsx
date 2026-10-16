import type { Metadata } from 'next';
import { Teko, Nunito } from 'next/font/google';
import './globals.css';

// Font display bergaya plang/spanduk — Teko
const teko = Teko({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

// Font teks mudah dibaca — Nunito
const nunito = Nunito({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Langit Senja — Temukan 5 Temanmu!',
  description:
    'Jelajahi kota Bekasi saat senja, temukan 5 teman dalam 10 menit. Game open-world 3D Indonesia di browser.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${teko.variable} ${nunito.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#2B1D14] text-[#F5E9D3]">
        {children}
      </body>
    </html>
  );
}
