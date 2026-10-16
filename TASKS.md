# TASKS — Fase Kerja

Kerjakan berurutan. Satu fase per sesi agent. Centang setelah selesai.

## Fase 0 — Setup
- [ ] Buat proyek Next.js (App Router, TS strict, Tailwind).
- [ ] Pasang R3F, drei, rapier, zustand, flowbite-react; konfigurasi theme Flowbite sesuai `UI_GUIDELINES.md`.
- [ ] Salin aset musik dan data dialog/NPC dari repo lama.
- [ ] Canvas dimuat client-only; halaman `/` dan `/play`.

## Fase 1 — Port Dunia Lama
- [ ] Sky, awan, lighting senja.
- [ ] Implementasi `BuildingSpec`, `generateOpenings`, `validateBuilding` + unit test (lihat `BUILDING_RULES.md`).
- [ ] Jalan, sidewalk, plot bangunan dengan fasad menghadap jalan.
- [ ] Rumah (4 tipe), sekolah, minimarket, ruko, warung dengan pintu/jendela sesuai aturan.
- [ ] Taman dan danau.
- [ ] Player + kamera third-person + collision.
- [ ] Input terpadu (keyboard/mouse).

## Fase 2 — Misi & HUD
- [ ] 5 NPC misi dengan dialog lama (modal Flowbite).
- [ ] Timer 10 menit, progres, win/lose, mode malam, Coba Lagi.
- [ ] HUD sesuai guidelines.

## Fase 3 — Kendaraan
- [ ] `vehicleController.ts` arcade (gas, rem, belok).
- [ ] Model motor dan mobil blocky; naik/turun; kamera mengikuti.
- [ ] Parkir kendaraan yang bisa dikendarai; lalu lintas AI.

## Fase 4 — Lingkungan Indonesia
- [ ] Kompleks olahraga: lapangan sepak bola dan basket + NPC.
- [ ] Lapangan kosong + anak-anak + layangan.
- [ ] Props khas (gapura, pos ronda, tiang listrik, warung, dll.) via instancing; bangunan baru wajib lolos `validateBuilding`.
- [ ] QA visual bangunan sesuai checklist `BUILDING_RULES.md` §7.

## Fase 5 — Pedagang Keliling
- [ ] Sistem rute dan berhenti pedagang.
- [ ] Prompt interaksi, dialog, `VendorShop`.
- [ ] Uang Rp, buff jajanan, petunjuk lokasi teman.
- [ ] Audio spasial pedagang.

## Fase 6 — Mobile
- [ ] Joystick virtual, tombol aksi, kamera sentuh.
- [ ] Preset kualitas otomatis; optimasi instancing/shadow.
- [ ] Uji landscape/portrait dan safe-area.

## Fase 7 — Aktivitas Opsional
- [ ] Mini-game bola.
- [ ] Mini-game basket.
- [ ] Interaksi layangan.

## Fase 8 — Polish & Rilis
- [ ] Audio mixer, volume, pengaturan kualitas.
- [ ] Deploy Vercel; perbarui README.
- [ ] Hapus md lama yang tidak relevan (`task.md`, `new_task.md`, dll.) setelah isinya terserap.

## Asumsi yang Perlu Dikonfirmasi Farhan
- Efek jajanan (buff + petunjuk) dan sumber uang di dunia.
- Jumlah dan jenis pedagang awal.
- Apakah mini-game lapangan (Fase 7) benar-benar dibutuhkan.
