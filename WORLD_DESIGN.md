# WORLD DESIGN — Suasana Indonesia

Gaya: **Minecraft low-poly**. Semua dari kotak (BoxGeometry), `flatShading`, palet hangat senja. Tanpa tekstur foto; detail lewat warna dan bentuk.

## Palet (sunset)
Langit oranye-jingga ke ungu pudar; bayangan panjang; cahaya hangat kekuningan. Aksen khas: merah-putih (bendera/gapura), hijau daun pisang, biru seng, krem tembok, merah bata, kuning warung.

## Skala
1 unit = 1 meter. Pemain tinggi ±1.8. Jalan 8 unit (2 jalur), sidewalk 2 unit. Kota ±300×300 unit, datar.

> **Semua bangunan wajib mengikuti `BUILDING_RULES.md`** (orientasi ke jalan, pintu dan jendela di posisi logis).

## Zona (tata letak garis besar, sesuaikan koordinat di kode)
| Zona | Isi |
|---|---|
| Pusat kota | Jalan utama, Konoha Mart, ruko, warung, gapura |
| Permukiman | 40+ rumah (kecil, sederhana, bagus, mewah), pos ronda, jemuran, tiang listrik |
| Sekolah | SMK TELESANDI, SMPN 11 BEKASI + 2 sekolah lain |
| Taman | Air mancur, bangku, tempat Ariman |
| Danau | Tepian dengan pohon, tempat Mahardhika |
| **Kompleks olahraga** (baru) | Lapangan sepak bola + lapangan basket bersebelahan |
| **Lapangan kosong** (baru) | Tanah/rumput liar luas, tempat layangan |

## Lapangan Sepak Bola
Rumput hijau dengan garis putih (kotak sederhana), 2 gawang berjaring (garis tipis), bangku pinggir, beberapa pemain NPC berseragam warna berbeda, bola bergerak pelan. Pagar rendah dan warung kecil di pinggir.

## Lapangan Basket
Lantai semen abu/hijau-biru dengan garis putih, 2 tiang + ring, pagar kawat tinggi di sekeliling, beberapa NPC remaja bermain, bangku semen.

## Lapangan Kosong + Layangan
Rumput liar tinggi-rendah, beberapa pohon, tumpukan batu/ban bekas. 5–8 anak (NPC kecil) berlari dengan benang. Layangan: bidang tipis berwarna cerah (persegi miring + ekor), melayang tinggi dengan gerak bergoyang (sinus + noise), benang = garis tipis ke tangan anak. Ada layangan yang menyangkut di pohon/kabel sebagai detail.

## Kendaraan
- **Motor** (blocky): badan, 2 roda, stang, lampu. Cocok untuk jalan sempit.
- **Mobil** (blocky): badan, kabin kaca gelap, 4 roda; beberapa warna.
- Lalu lintas AI: 5 motor + 3 mobil lama tetap ada.
- Kendaraan **yang bisa dikendarai**: 2 motor + 1 mobil diparkir (depan rumah, warung, dekat taman). Beri penanda ringan (ikon "E"/tombol Naik) saat dekat.
- Kecepatan: motor lebih lincah, mobil lebih stabil. Tidak ada kerusakan.

## Pedagang Keliling
| Pedagang | Visual | Suara | Rute |
|---|---|---|---|
| Tukang bakso | Gerobak merah dengan tenda + kompor | Kentongan "tok-tok-tok" | Loop permukiman |
| Es krim/es potong | Gerobak/sepeda boks biru-putih | Lonceng / musik pendek | Taman – sekolah |
| Siomay | Sepeda dengan boks kayu | Teriakan pendek | Pusat kota |
| Sate | Gerobak pikulan + asap blocky | Kipas / teriakan | Dekat lapangan saat sore |

Aturan: berjalan pelan (±1.2 unit/dtk), berhenti 8–15 detik di titik tertentu, kadang anak-anak mengerubungi. Setiap pedagang punya menu 2–4 item (nama, harga Rupiah, efek).

## Detail Khas (props instancing)
Gapura, spanduk, bendera, tiang listrik + kabel, pos ronda, warung rokok/kelontong, pohon mangga/pisang/kelapa, jemuran, ayam/kucing sesekali, polisi tidur, pagar tembok bercat, tong sampah, genangan kecil.

## NPC Misi
Lokasi sama seperti versi lama (lihat `NPC_LOCATIONS.md` di repo). Pastikan tidak tertutup lapangan/kendaraan baru. Tambahkan petunjuk lokasi dari dialog warga/pedagang.

## Suasana
Senja tetap; awan bergerak; bayangan panjang. Mode malam saat kalah: lampu jalan, lampu kendaraan, warung menyala.
