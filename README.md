# 🌆 Langit Senja (Revamp)

> **Game Open-World Eksplorasi 3D di Browser bernuansa Senja Kota Indonesia.**  
> Misi utama: Temukan 5 temanmu sebelum waktu senja habis (10 menit)!

---

## 🎮 Fitur Utama

- **Dunia 3D Blocky Low-Poly Khas Indonesia**:
  - Bangunan perumahan, sekolah, ruko, minimarket, pos ronda dengan kentongan, gapura 17 Agustus merah-putih, deretan tiang listrik beton, pohon kelapa, dan pisang.
  - Pencahayaan matahari senja hangat, awan bergerak pelan, dan transisi dramatis ke malam hari jika pemain kehabisan waktu.
- **Sistem Misi & Dialog**:
  - Temukan 5 teman (*Ariman, Budi, Siti, Rian, Doni*) yang tersebar di sudut-sudut kota dengan dialog cerita sehari-hari.
  - Papan misi interaktif (tekan `M` atau klik Daftar Teman).
- **Kendaraan yang Bisa Dikendarai (Drivable Vehicles)**:
  - Motor bebek dan mobil sedan blocky.
  - Tekan **F** untuk naik dan turun dari kendaraan.
  - Fisika akselerasi arcade, kemudi dinamis, dan lampu kendaraan menyala.
  - Lalu lintas kendaraan AI berkeliling kota secara alami.
- **Pedagang Jajanan Keliling Khas Indonesia**:
  - Tukang Bakso (gerobak kuah berasap), Tukang Es Krim (payung pantai), Tukang Siomay (sepeda ontel kukusan), dan Tukang Sate (arang membara).
  - Berkeliling kota sesuai rute waypoint.
  - Interaksi toko jajanan (*VendorShop*) dengan uang saku jajan Rp 50.000 untuk membeli makanan pemberi buff lari cepat & petunjuk arah teman.
  - **Audio Spasial Procedural**: Web Audio API synthesizer menghasilkan bunyi kentongan bakso *"ting.. ting.. ting.."*, melodi bel es krim, klakson pencet siomay, dan suara kipas arang sate.
- **Aktivitas Lapangan & Mini-Game**:
  - **Sepak Bola**: Menggiring bola secara fisik dan menendang bola ke gawang dengan papan skor 3D interaktif.
  - **Bola Basket**: Ambil, dribble, dan tembakkan bola dengan kurva parabola ke arah ring basket.
  - **Layangan Senja**: Terbangkan layangan senja dengan benang 3D terhubung ke tangan pemain di Lapangan Kosong.
- **Dukungan Penuh Layar Sentuh Mobile**:
  - Virtual analog joystick di kiri bawah.
  - Tombol aksi sentuh: Lompat, Lari (Toggle Sprint), Interaksi [E], dan Masuk Kendaraan [F].
  - Orbit kamera sentuh (1 jari) dan pinch-to-zoom (2 jari).
- **Pengaturan & Audio Mixer**:
  - Panel pengaturan suara (Volume Utama, SFX Kota & Jajanan, Musik Senja) dan preset kualitas grafis (Ringan / Seimbang / Tinggi).

---

## 🕹️ Panduan Kontrol

### Keyboard & Mouse (Desktop)
| Tombol | Fungsi |
|---|---|
| **W, A, S, D** / Panah | Berjalan / Mengemudi |
| **Shift** | Lari Cepat (Sprint) |
| **Spasi** | Melompat / Menarik Benang Layangan |
| **E** | Bicara dengan Teman / Beli Jajanan / Tendang Bola / Terbangkan Layangan |
| **F** | Naik / Turun Kendaraan (Motor atau Mobil) |
| **M** | Buka / Tutup Daftar Teman |
| **Klik & Drag Mouse** | Memutar Sudut Pandang Kamera 360° |
| **Scroll Wheel** | Zoom In / Zoom Out Kamera |

### Layar Sentuh (Mobile / Tablet)
- **Joystick Kiri Bawah**: Gerakan berjalan atau mengemudi.
- **Tombol Kanan Bawah**: Aksi Lompat, Lari, Bicara/Beli [E], dan Kendaraan [F].
- **Sentuh & Geser Layar**: Memutar sudut pandang kamera orbit.
- **Pinch 2 Jari**: Mengatur jarak zoom kamera.

---

## 🛠️ Teknologi & Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router) + TypeScript Strict
- **3D Graphics**: [Three.js](https://threejs.org), [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei)
- **Physics**: [@react-three/rapier](https://github.com/pmndrs/react-three-rapier)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling & UI 2D**: [Tailwind CSS](https://tailwindcss.com) + Tema Senja Khas Kayu Indonesia

---

## 🚀 Menjalankan Secara Lokal

1. **Clone repository dan install dependensi**:
   ```bash
   git clone <repo-url>
   cd langit_senja_v2
   npm install
   ```

2. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser.

3. **Build untuk produksi**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🌐 Deploy ke Vercel

Proyek ini telah dikonfigurasi penuh untuk di-deploy secara instan ke [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/farhanhl/langitsenja)

Pastikan konfigurasi default Next.js App Router digunakan.
Semua komponen 3D telah diisolasi dengan `dynamic(..., { ssr: false })` sehingga aman dan optimal untuk static pre-rendering.
