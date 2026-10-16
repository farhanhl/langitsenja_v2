# AGENTS.md — Langit Senja (Revamp)

Dokumen utama untuk AI agent. **Baca file ini dulu**, lalu baca dokumen lain sesuai tugas.

## Ringkasan Proyek
Langit Senja adalah game open-world 3D di browser: kota Indonesia saat senja, gaya Minecraft low-poly. Misi inti: temukan 5 teman dalam 10 menit. Revamp ini memindahkan proyek dari vanilla JS + Vite + Three.js ke **Next.js + TypeScript + React Three Fiber**, menambah kendaraan yang bisa dikendarai, lingkungan khas Indonesia, dan interaksi dengan pedagang keliling.

Repo lama: https://github.com/farhanhl/langitsenja (referensi logika, aset musik, nama lokasi, dialog NPC).

## Peta Dokumen
| File | Isi | Baca saat |
|---|---|---|
| `docs/PRD.md` | Tujuan, fitur, aturan gameplay, acceptance criteria | Memahami apa yang dibangun |
| `docs/ARCHITECTURE.md` | Stack, struktur folder, state, loop game, kontrol | Menulis kode |
| `docs/WORLD_DESIGN.md` | Tata letak kota, lapangan, kendaraan, NPC, pedagang | Membangun dunia 3D |
| `docs/BUILDING_RULES.md` | Aturan bentuk, orientasi, pintu & jendela bangunan | Membuat/mengubah bangunan apa pun |
| `docs/UI_GUIDELINES.md` | Aturan UI, Flowbite, anti "AI slop" | Membangun HUD/menu/dialog |
| `docs/TASKS.md` | Fase kerja bertahap + checklist | Memilih tugas berikutnya |

## Stack Tetap (jangan diganti tanpa izin)
Next.js (App Router) · TypeScript strict · React Three Fiber + drei · Zustand · Tailwind + Flowbite (flowbite-react) untuk UI 2D · @react-three/rapier untuk collision.

## Aturan Kerja
1. Kerjakan **satu fase/tugas** dari `docs/TASKS.md` per sesi. Centang checklist setelah selesai.
2. Jangan menulis ulang file yang tidak terkait tugas.
3. TypeScript `strict: true`. Tanpa `any` kecuali diberi komentar alasan.
4. Semua komponen R3F hanya dirender di client (`"use client"` + `dynamic(..., { ssr: false })` untuk Canvas).
5. Logika game (tidak bergantung React) taruh di `src/game/`; komponen visual di `src/components/world/`.
6. Gaya visual **harus blocky low-poly** (BoxGeometry, flat shading, tanpa tekstur foto). Lihat `WORLD_DESIGN.md`.
7. **Setiap bangunan wajib mengikuti `docs/BUILDING_RULES.md`** (bentuk jelas, fasad menghadap jalan, pintu dan jendela di posisi logis, lolos `validateBuilding`). Dilarang menaruh pintu/jendela dengan koordinat acak.
8. UI wajib mengikuti `UI_GUIDELINES.md`. Dilarang tampilan generik ala template AI.
9. Semua teks yang dilihat pemain dalam **Bahasa Indonesia** santai khas sehari-hari.
10. Performa: target 60 fps desktop, 30+ fps di HP menengah. Pakai instancing untuk objek berulang (rumah, pohon, pagar).
11. Setiap fitur baru harus bisa dimainkan dengan keyboard+mouse **dan** kontrol sentuh.
12. Jika ada keputusan desain yang tidak tercakup dokumen, **tanya dulu**, jangan berasumsi.

## Definition of Done (per tugas)
- `npm run build` dan `npm run lint` lolos tanpa error.
- Berjalan di desktop dan mode mobile (emulasi devtools).
- Tidak ada `console.error` saat bermain 2 menit.
- Checklist di `docs/TASKS.md` diperbarui.
