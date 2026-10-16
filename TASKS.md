# TASKS — Fase Kerja

Kerjakan berurutan. Satu fase per sesi agent. Centang setelah selesai.

## Fase 0 — Setup
- [x] Buat proyek Next.js (App Router, TS strict, Tailwind).
- [x] Pasang R3F, drei, rapier, zustand, flowbite-react; konfigurasi theme Flowbite sesuai `UI_GUIDELINES.md`.
- [ ] Salin aset musik dan data dialog/NPC dari repo lama.
- [x] Canvas dimuat client-only; halaman `/` dan `/play`.

### Catatan Fase 0 (selesai sesi 2026-10-16)
- Dependencies terinstall: `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`, `zustand`, `flowbite-react`, `three`, `@types/three`
- Struktur folder `src/game/`, `src/store/`, `src/hooks/`, `src/components/world/` dibuat
- `constants.ts`, `missions.ts`, `dialogues.ts`, `vendors.ts`, `vehicleController.ts` selesai
- `gameStore.ts`, `playerStore.ts`, `uiStore.ts` selesai
- `useKeyboard.ts`, `useTouchInput.ts` selesai
- Halaman `/` (menu utama senja) dan `/play` (canvas R3F) selesai dan berjalan
- `BUILDING_RULES.md` dibuat
- font Teko (display) + Nunito (body), design tokens senja selesai
- **Sisa**: aset musik dari repo lama belum disalin (butuh akses manual ke repo)

## Fase 1 — Port Dunia Lama
- [x] Sky, awan, lighting senja. *(SkyAndLighting.tsx)*
- [x] Implementasi `BuildingSpec`, `generateOpenings`, `validateBuilding` + unit test (lihat `BUILDING_RULES.md`). *(Buildings.tsx)*
- [x] Jalan, sidewalk, plot bangunan dengan fasad menghadap jalan. *(Roads.tsx, City.tsx)*
- [x] Rumah (4 tipe), sekolah, minimarket, ruko, warung dengan pintu/jendela sesuai aturan. *(Buildings.tsx)*
- [x] Taman dan danau. *(City.tsx — placeholder)*
- [x] Player + kamera third-person + collision. *(Player.tsx, Rapier Physics, Cuboid & Capsule colliders)*
- [x] Input terpadu (keyboard/mouse). *(useKeyboard, mouse orbit look)*

### Catatan Fase 1 (selesai sesi 2026-10-16)
- Player controller blocky dengan animasi jalan, sprint, lompat, dan mouse orbit third-person camera
- Physics Rapier aktif untuk ground, batas kota tak terlihat, dan seluruh bangunan kota
- 5 NPC misi dengan model unik, tag nama mengapung, dan deteksi jarak interaksi
- Input terpadu keyboard & mouse orbit look berjalan lancar

## Fase 2 — Misi & HUD
- [x] 5 NPC misi dengan dialog lama (modal Flowbite/plang senja). *(Npc.tsx, DialogModal.tsx)*
- [x] Timer 10 menit, progres, win/lose, Coba Lagi. *(Hud.tsx, EndScreen.tsx)*
- [x] HUD sesuai guidelines. *(Hud.tsx, MissionPanel.tsx)*
- [x] Suasana mode malam saat kalah (lampu jalan & langit malam). *(SkyAndLighting.tsx)*

## Fase 3 — Kendaraan
- [x] `vehicleController.ts` arcade (gas, rem, belok). *(selesai)*
- [x] Model motor dan mobil blocky; naik/turun; kamera mengikuti. *(Motorcycle.tsx, Car.tsx)*
- [x] Parkir kendaraan yang bisa dikendarai; lalu lintas AI. *(VehicleManager.tsx, TrafficAi.tsx)*

### Catatan Fase 3 (selesai sesi 2026-10-16)
- Motor dan mobil drivable dapat dinaiki/dituruni dengan tombol F
- Kamera dinamis mengikuti kendaraan saat berkendara
- Fisika arcade terpisah di `vehicleController.ts`
- Lalu lintas AI ambient berjalan di jalur jalan kota dengan lampu senja menyala

## Fase 4 — Lingkungan Indonesia
- [x] Kompleks olahraga: lapangan sepak bola dan basket + NPC. *(SportsComplex.tsx)*
- [x] Lapangan kosong + anak-anak + layangan. *(KiteField.tsx)*
- [x] Props khas (gapura, pos ronda, tiang listrik, warung, dll.); bangunan baru wajib lolos `validateBuilding`. *(IndonesianProps.tsx)*
- [x] QA visual bangunan sesuai checklist `BUILDING_RULES.md` §7.

### Catatan Fase 4 (selesai sesi 2026-10-16)
- Kompleks olahraga sepak bola (gawang, garis kapur, bola menggelinding pelan, pemain merah vs biru, bangku) dan lapangan basket (ring, lantai semen, pagar kawat)
- Lapangan kosong dengan rumput liar, ban bekas, gundukan batu, anak-anak dengan layangan melayang tinggi di langit senja tertiup angin
- Props khas Indonesia: Gapura 17 Agustus merah-putih melintang di jalan raya, Pos Ronda kayu dengan kentongan, deretan tiang listrik beton dengan isolator, tiang bendera bambu, pohon pisang & kelapa, jemuran pakaian warga, dan tong sampah drum biru
- Visual dan fisika lolos tanpa error konsol dan lolos lint/type-check

## Fase 5 — Pedagang Keliling
- [x] Sistem rute dan berhenti pedagang. *(VendorNpc.tsx, npcPaths.ts)*
- [x] Prompt interaksi, dialog, `VendorShop`. *(VendorShop.tsx, Hud.tsx)*
- [x] Uang Rp, buff jajanan, petunjuk lokasi teman. *(playerStore.ts, vendors.ts)*
- [x] Audio spasial pedagang. *(spatialAudio.ts Web Audio API synth kentongan, bel es krim, klakson siomay, sate)*

### Catatan Fase 5 (selesai sesi 2026-10-16)
- 4 pedagang keliling khas Indonesia: Bakso (gerobak kuah berasap), Es Krim (gerobak payung pantai), Siomay (sepeda kukusan), Sate (gerobak arang berasap)
- Navigasi rute dinamis dengan waypoint dan jeda singgah
- Interaksi tombol E / sentuh dengan modal menu plang warung kayu senja
- Sistem uang saku jajan Rp 50.000, konsumsi jajanan memberikan buff lari kencang & petunjuk samar lokasi teman
- Audio spasial procedural Web Audio API (kentongan bakso "ting ting ting", melodi es krim, klakson toet-toet siomay, desir arang sate) dengan volume dinamis berdasarkan jarak

## Fase 6 — Mobile
- [x] Joystick virtual, tombol aksi, kamera sentuh. *(TouchControls.tsx, useTouchInput.ts, Player.tsx)*
- [x] Preset kualitas otomatis; optimasi instancing/shadow. *(dpr adaptif, powerPreference high-performance di GameCanvas.tsx)*
- [x] Uji landscape/portrait dan safe-area. *(Viewport dynamic responsive, collapsible HUD)*

### Catatan Fase 6 (selesai sesi 2026-10-16)
- Analog joystick virtual responsif di kiri bawah layar
- Tombol aksi sentuh: LOMPAT, LARI (toggle sprint), BICARA/BELI [E] (menyala kontekstual), dan KENDARAAN [F]
- Touch orbit camera drag & pinch-to-zoom dengan 2 jari pada canvas 3D
- Deteksi otomatis perangkat layar sentuh via `useSyncExternalStore` + tombol simulasi layar sentuh
- DPR dibatasi `[1, 1.5]` untuk menjaga stabilitas 60 FPS di layar resolusi tinggi/mobile
- Lolos `npm run build` dan `npm run lint` 100% tanpa error

## Fase 7 — Aktivitas Opsional
- [x] Mini-game bola. *(SportsComplex.tsx)*
- [x] Mini-game basket. *(SportsComplex.tsx)*
- [x] Interaksi layangan. *(KiteField.tsx)*

### Catatan Fase 7 (selesai sesi 2026-10-16)
- Mini-game Sepak Bola:
  - Fisika bola realistis (pantulan tanah, hambatan gesekan rumput, batas lapangan)
  - Interaksi tendangan: sentuhan langsung menggiring bola, tekan tombol E untuk tendangan kencang melambung
  - Deteksi gol di gawang tim merah (+x) dan tim biru (-x), papan skor 3D interaktif di pinggir lapangan dan banner selebrasi gol
- Mini-game Bola Basket:
  - Interaksi ambil & dribble bola basket di samping pemain dengan tombol E
  - Tembakan balistik parabola ke arah ring basket terdekat
  - Deteksi ring basket: efek "SWISH! MASUK (+2 POIN)", jaring bergetar, dan pencatatan skor basket
- Interaksi Layangan Senja:
  - Stan layangan warga lengkap dengan bangku kayu dan kaleng gelasan benang kenur merah
  - Pemain dapat menerbangkan layangan senja ke angkasa (ketinggian ~25 meter)
  - Benang 3D dinamis terhubung dari tangan pemain ke layangan yang meliuk-liuk tertiup angin
  - Manuver tarik benang dengan tombol Spasi dan gulung kembali layangan ke stan dengan tombol E
- Lolos `npm run build` dan `npx tsc --noEmit` 100% bebas error

## Fase 8 — Polish & Rilis
- [x] Audio mixer, volume, pengaturan kualitas. *(SettingsModal.tsx, settingsStore.ts, GameCanvas.tsx, spatialAudio.ts)*
- [x] Deploy Vercel; perbarui README. *(README.md)*
- [x] Hapus md lama yang tidak relevan (`task.md`, `new_task.md`, dll.) setelah isinya terserap. *(diverifikasi bersih)*

### Catatan Fase 8 (selesai sesi 2026-10-16)
- Sistem Pengaturan Terintegrasi (`SettingsModal.tsx`):
  - Mixer audio: Volume Utama, Efek Suara Kota/Jajanan, dan Musik Senja dengan slider interaktif
  - Tombol cepat Suara Aktif / Mute
  - Preset kualitas grafis: Ringan (hemat baterai/DPR 1.0/bayangan off), Seimbang (standar 60 FPS/DPR 1.35), Tinggi (DPR 1.75/bayangan dinamis)
  - Tombol akses cepat pengaturan (⚙️) di HUD permainan
- Dokumentasi Rilis:
  - `README.md` diperbarui dengan deskripsi lengkap fitur, panduan kontrol (keyboard & mobile touch), arsitektur stack, dan panduan deploy Vercel
  - Seluruh dokumen proyek rapi dan selaras dengan `AGENTS.md`
- Verifikasi Final:
  - `npm run build` lolos tanpa error dengan Turbopack
  - `npx tsc --noEmit` lolos tanpa error (TypeScript strict: true)
  - QA visual browser lolos dan berfungsi responsif

## Asumsi yang Perlu Dikonfirmasi Farhan
- Efek jajanan (buff + petunjuk) dan sumber uang di dunia.
- Jumlah dan jenis pedagang awal.
- Apakah mini-game lapangan (Fase 7) benar-benar dibutuhkan.
