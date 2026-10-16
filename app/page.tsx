'use client';

import Link from 'next/link';

// Halaman menu utama Langit Senja
// Styling: UI_GUIDELINES — hangat senja, plang, Bahasa Indonesia

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Langit senja gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #FF6B35 0%, #C0392B 35%, #8E44AD 65%, #2B1D14 100%)',
        }}
      />

      {/* Awan blocky bergerak (dekorasi) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {CLOUDS.map((c) => (
          <div
            key={c.id}
            className="absolute rounded-sm opacity-25"
            style={{
              width: c.w,
              height: c.h,
              top: c.top,
              left: c.left,
              background: '#F5E9D3',
              animation: `cloud-drift ${c.dur}s linear infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Siluet kota blocky bawah */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none">
        {BUILDINGS_SILHOUETTE.map((b) => (
          <div
            key={b.id}
            className="absolute bottom-0 rounded-t-sm"
            style={{
              width: b.w,
              height: b.h,
              left: b.left,
              background: '#1A0E09',
              opacity: 0.8,
            }}
          />
        ))}
      </div>

      {/* Konten menu */}
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center px-6 py-12 gap-8">
        {/* Logo & Judul */}
        <div className="text-center" style={{ animation: 'float-title 3s ease-in-out infinite' }}>
          <p
            className="font-display text-[#F2B632] text-lg mb-1 tracking-widest uppercase"
            style={{ textShadow: '1px 1px 0 #2B1D14' }}
          >
            🌇 Selamat Datang di
          </p>
          <h1
            className="font-display font-bold leading-none text-[#F5E9D3]"
            style={{
              fontSize: 'clamp(3rem, 10vw, 6rem)',
              textShadow:
                '4px 4px 0 #A23B2A, 6px 6px 0 #2B1D14',
              letterSpacing: '0.04em',
            }}
          >
            LANGIT SENJA
          </h1>
          <p
            className="mt-2 font-body text-[#F5E9D3] text-base opacity-90"
            style={{ textShadow: '1px 1px 0 #2B1D14' }}
          >
            Temukan <strong>5 teman</strong> dalam <strong>10 menit</strong> — jelajahi kota Bekasi!
          </p>
        </div>

        {/* Kartu menu */}
        <div
          className="bg-[#2B1D14] border-2 border-[#E8743B] rounded p-6 flex flex-col gap-4 w-full max-w-xs"
          style={{ boxShadow: '5px 5px 0 #A23B2A' }}
        >
          {/* Tombol Mulai */}
          <Link href="/play" className="btn-plang btn-primary w-full text-center text-xl">
            ▶ Main Sekarang
          </Link>

          {/* Cara Bermain */}
          <button
            className="btn-plang btn-secondary w-full text-xl"
            onClick={() => {
              document.getElementById('cara-bermain')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            ? Cara Bermain
          </button>

          {/* Pengaturan kualitas (placeholder Fase 8) */}
          <button className="btn-plang w-full text-xl" style={{ background: '#4F7A3A', color: '#F5E9D3' }}>
            ⚙ Pengaturan
          </button>
        </div>

        {/* Badge versi */}
        <p className="text-xs text-[#F5E9D3] opacity-40 font-body">
          v2.0-beta · Next.js + React Three Fiber
        </p>
      </div>

      {/* Cara bermain section */}
      <section
        id="cara-bermain"
        className="relative z-10 bg-[#2B1D14] border-t-2 border-[#E8743B] px-6 py-10 scroll-mt-8"
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-display font-bold text-[#E8743B] mb-6"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', textShadow: '2px 2px 0 #2B1D14' }}
          >
            Cara Bermain
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {HOW_TO_PLAY.map((item) => (
              <div
                key={item.title}
                className="bg-[#3A2416] border-2 border-[#A23B2A] rounded p-4"
                style={{ boxShadow: '3px 3px 0 #A23B2A' }}
              >
                <h3 className="font-display font-semibold text-[#F2B632] text-lg mb-1">
                  {item.icon} {item.title}
                </h3>
                <p className="font-body text-[#F5E9D3] text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Kontrol keyboard */}
          <div className="mt-6 bg-[#3A2416] border-2 border-[#4F7A3A] rounded p-4" style={{ boxShadow: '3px 3px 0 #4F7A3A' }}>
            <h3 className="font-display font-semibold text-[#4F7A3A] text-lg mb-2">
              🎮 Kontrol Keyboard
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-body text-sm text-[#F5E9D3]">
              {CONTROLS.map((c) => (
                <div key={c.key} className="flex items-center gap-2">
                  <kbd className="px-2 py-0.5 rounded text-xs border border-[#E8743B] text-[#E8743B] font-display font-semibold">
                    {c.key}
                  </kbd>
                  <span className="opacity-80">{c.action}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/play" className="btn-plang btn-primary text-xl px-10">
              Ayo Main! ▶
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Data dekorasi ───────────────────────────────────────────────

const CLOUDS = [
  { id: 1, w: 80, h: 20, top: '8%', left: '10%', dur: 8 },
  { id: 2, w: 120, h: 25, top: '15%', left: '55%', dur: 11 },
  { id: 3, w: 60, h: 15, top: '22%', left: '30%', dur: 9 },
  { id: 4, w: 90, h: 20, top: '5%', left: '75%', dur: 13 },
];

const BUILDINGS_SILHOUETTE = [
  { id: 1, w: 50, h: 70, left: '2%' },
  { id: 2, w: 40, h: 50, left: '8%' },
  { id: 3, w: 70, h: 90, left: '14%' },
  { id: 4, w: 35, h: 55, left: '21%' },
  { id: 5, w: 80, h: 110, left: '27%' },
  { id: 6, w: 50, h: 65, left: '36%' },
  { id: 7, w: 45, h: 80, left: '44%' },
  { id: 8, w: 100, h: 140, left: '50%' },
  { id: 9, w: 55, h: 75, left: '60%' },
  { id: 10, w: 40, h: 60, left: '67%' },
  { id: 11, w: 70, h: 95, left: '73%' },
  { id: 12, w: 50, h: 70, left: '81%' },
  { id: 13, w: 35, h: 50, left: '87%' },
  { id: 14, w: 60, h: 80, left: '93%' },
];

const HOW_TO_PLAY = [
  {
    icon: '🏃',
    title: 'Jelajahi Kota',
    desc: 'Jalan kaki atau naik motor/mobil. Eksplorasi seluruh kota Bekasi sebelum waktu habis!',
  },
  {
    icon: '👫',
    title: 'Temukan 5 Teman',
    desc: 'Ariman, Putra, Ananda, Zait, dan Mahardhika tersebar di kota. Cari dan ajak ngobrol!',
  },
  {
    icon: '⏱',
    title: 'Kejar Waktu',
    desc: 'Kamu punya 10 menit saja. Kalau waktu habis, malam tiba dan kamu kalah!',
  },
  {
    icon: '🍜',
    title: 'Beli Jajanan',
    desc: 'Temui pedagang keliling — bakso, es krim, siomay, sate. Beli buat dapat buff dan petunjuk!',
  },
];

const CONTROLS = [
  { key: 'WASD', action: 'Gerak' },
  { key: 'Shift', action: 'Lari' },
  { key: 'Spasi', action: 'Lompat' },
  { key: 'E', action: 'Interaksi' },
  { key: 'F', action: 'Naik/Turun' },
  { key: 'Mouse', action: 'Kamera' },
];
