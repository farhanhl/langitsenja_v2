# UI GUIDELINES — Flowbite, Tanpa "AI Slop"

## Prinsip
UI harus terasa seperti game ini: hangat, senja, khas Indonesia. Bukan dashboard SaaS generik.

## Pemakaian Flowbite
Flowbite (`flowbite-react` + Tailwind) dipakai untuk lapisan UI 2D: menu utama, HUD, modal dialog, toast, tombol, kartu menu pedagang, pengaturan, layar menang/kalah. **Jangan** dipakai untuk dunia 3D.
- Gunakan komponen Flowbite: `Modal`, `Button`, `Card`, `Badge`, `Progress`, `Tooltip`, `Toast`, `Drawer`.
- **Wajib dikustomisasi lewat theme** (`flowbite-react` theme / Tailwind config). Jangan biarkan tampilan default biru Flowbite muncul.

## Design Tokens (awal; boleh disetel)
- Warna: jingga senja `#E8743B`, merah bata `#A23B2A`, krem kertas `#F5E9D3`, cokelat tua `#2B1D14`, hijau daun `#4F7A3A`, kuning warung `#F2B632`.
- Font: pilih 1 display bergaya plang/spanduk dan 1 sans yang mudah dibaca (via `next/font`). Bukan Inter/Roboto sebagai ciri utama.
- Sudut: kecil dan tegas (4–6px), bukan pil bulat semua. Border tebal ala stiker/plang, bayangan keras (offset), bukan blur lembut.

## DILARANG (ciri AI slop)
- Gradien ungu-biru, glassmorphism berlebihan, glow neon.
- Emoji sebagai ikon utama; ikon pakai set konsisten (mis. Lucide/Heroicons) atau SVG buatan sendiri bergaya blocky.
- Kartu semuanya sama rata dengan ikon di atas + judul + 2 baris teks.
- Copy generik ("Welcome to the future", "Seamless experience"). Semua teks Bahasa Indonesia santai dan spesifik.
- Animasi berlebihan, parallax tanpa alasan, spacing seragam monoton.
- Dark-mode default abu-abu netral.

## Komponen Utama
- **HUD**: timer (kiri atas), progres teman "2/5" dengan 5 slot, uang Rp, buff aktif, mini petunjuk kontrol. Kecil, tidak menutupi layar, tipografi tegas.
- **Prompt interaksi**: label dekat objek ("E — Beli bakso"), di mobile jadi tombol aksi.
- **Dialog**: modal bergaya balon/plang dengan nama pembicara; teks muncul per kalimat, bisa dilewati.
- **VendorShop**: daftar menu seperti papan menu warung (nama, harga Rp, efek), tombol "Beli". Kembalian/uang kurang ditangani dengan pesan sopan.
- **MissionPanel**: daftar 5 teman dan status.
- **Layar menang/kalah**: pertahankan "Kamu Menang!" dan "Kamu Kalah"; tombol "Tutup" dan "Coba Lagi". Tanpa emoji sebagai dekorasi utama.
- **Menu utama & pengaturan**: Main, Cara Bermain, Kualitas grafis, Volume.

## Mobile
- Target sentuh minimal 48px. Joystick kiri bawah, tombol aksi kanan bawah. Hormati safe-area.
- HUD diperkecil, modal dialog tidak melebihi 60% tinggi layar.
- Hindari hover-only. Orientasi landscape diutamakan; beri saran putar layar jika portrait.

## Aksesibilitas
Kontras teks AA, ukuran teks minimal 14px di HUD, semua aksi bisa lewat keyboard dan sentuh, `prefers-reduced-motion` dihormati.
