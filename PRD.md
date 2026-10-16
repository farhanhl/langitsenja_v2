# PRD — Langit Senja Revamp

## 1. Tujuan
Membuat ulang Langit Senja agar terasa seperti suasana sore di kampung/kota kecil Indonesia: ramai, hidup, dan bisa dijelajahi dengan jalan kaki, motor, atau mobil.

## 2. Yang Dipertahankan dari Versi Lama
- Gaya Minecraft low-poly dan suasana langit senja (gradasi sky, awan bergerak).
- Misi: temukan 5 teman dalam 10 menit. Win/lose state, mode malam saat kalah.
- 5 NPC misi: Ariman (Taman), Putra (SMK TELESANDI), Ananda (SMPN 11 BEKASI), Zait (Konoha Mart), Mahardhika (Danau). Dialog lama dipakai ulang.
- NPC pembantu: Farhan Hadi Lutfi.
- Nama lokasi nyata dari Bekasi.
- Musik latar dari folder `music/` repo lama.

## 3. Fitur Baru

### 3.1 Kendaraan yang Bisa Dikendarai
- Motor dan mobil, mekanik **sederhana**: naik/turun, gas, rem, belok. Tanpa simulasi fisika realistis.
- Tekan **E** (desktop) / tombol "Naik" (mobile) saat dekat kendaraan.
- Kamera mengikuti kendaraan. Pemain tidak bisa menembus bangunan (collision).
- Kendaraan AI lama tetap ada di jalan sebagai lalu lintas; kendaraan yang bisa dikendarai diparkir di titik tertentu (lihat WORLD_DESIGN).
- Struktur kode kendaraan harus memisahkan *input*, *controller*, dan *visual* agar mudah di-upgrade ke fisika yang lebih dalam nanti.

### 3.2 Lingkungan Khas Indonesia
- Lapangan sepak bola (gawang, garis, rumput, bangku pinggir).
- Lapangan basket (ring, garis, lantai semen).
- Lapangan kosong: anak-anak bermain layangan (layangan beterbangan, benang, anak berlari).
- Detail khas: warung, pos ronda, tiang listrik dengan kabel semrawut, gapura, spanduk, pohon mangga/pisang, jemuran, genangan kecil, polisi tidur.

### 3.3 Pedagang Keliling (Fitur Utama Baru)
- Pedagang berjalan/mendorong gerobak mengikuti rute tetap di kota.
- Jenis awal: tukang bakso, es potong/es krim, siomay, sate.
- Pemain mendekat → muncul prompt interaksi → dialog (Flowbite modal) → beli jajanan.
- Mata uang: Rupiah dalam game. Uang bisa ditemukan/diberi (lihat 3.4).
- Efek jajanan (default, bisa diubah): buff singkat (sprint lebih lama / kecepatan lari naik) dan memberi petunjuk samar lokasi teman.
- Suara khas pedagang (kentongan bakso, lonceng es krim, teriakan "Baksooo!") bersifat spasial: makin dekat makin keras.

### 3.4 Aktivitas Tambahan di Dunia
Prioritas dari Farhan: **pedagang keliling**. Aktivitas lain bersifat opsional per fase:
- Tendang bola di lapangan sepak bola.
- Tembak bola di ring basket.
- Ikut anak-anak main layangan.
(Detail ada di `TASKS.md`; kerjakan hanya setelah fase inti selesai.)

### 3.5 Kontrol
- Desktop: WASD/panah, Shift, Spasi, mouse (pointer lock), E interaksi.
- Mobile: joystick virtual kiri, tombol aksi kanan (lompat, lari, interaksi, naik/turun), geser layar untuk kamera.

## 4. Di Luar Lingkup (sekarang)
Multiplayer, save/load ke server, fisika kendaraan realistis, masuk ke dalam bangunan.

## 5. Acceptance Criteria Inti
- [ ] Pemain bisa naik motor dan mobil, berkendara, dan turun.
- [ ] Ketiga jenis lapangan ada dan dikenali sekilas.
- [ ] Minimal 2 pedagang berkeliling dengan rute; bisa dibeli via dialog.
- [ ] Misi 5 teman, timer, win/lose berjalan seperti versi lama.
- [ ] Bisa dimainkan penuh di desktop dan HP.
- [ ] UI memenuhi `UI_GUIDELINES.md`.
