# BUILDING RULES — Langit Senja

Setiap bangunan **wajib** mengikuti aturan ini. Bangunan yang tidak lolos `validateBuilding` tidak boleh dirender.

## 1. Tipe Bangunan

| Tipe | Ukuran (W×D×H) | Warna atap | Warna dinding |
|---|---|---|---|
| `rumah-kecil` | 6×6×4 | merah bata | krem |
| `rumah-sedang` | 8×8×5 | merah bata | putih |
| `rumah-bagus` | 10×8×6 | coklat tua | krem cerah |
| `rumah-mewah` | 12×10×7 | abu | putih bersih |
| `sekolah` | 20×15×8 | abu-biru | putih |
| `minimarket` | 12×10×5 | merah | putih |
| `ruko` | 8×10×8 | abu | putih+warna |
| `warung` | 5×4×3.5 | coklat | kuning warung |

## 2. Orientasi (Fasad Menghadap Jalan)

- Pintu utama selalu di sisi yang menghadap jalan terdekat (`facing`).
- `facing` dapat berupa: `'+x' | '-x' | '+z' | '-z'`
- Jendela di sisi fasad dan sisi samping. **Dilarang** di sisi belakang (kecuali ruko 2 muka).

## 3. Posisi Pintu

- Pintu tepat di **tengah fasad** secara horizontal, di dasar dinding (Y=0 relatif bangunan).
- Ukuran pintu: lebar 1.2 unit, tinggi 2.2 unit.
- Jumlah pintu: 1 (rumah/warung) atau 2 (sekolah, minimarket).

## 4. Posisi Jendela

- Sisi fasad: minimal 2 jendela, simetris terhadap pintu.
- Sisi samping: 1–2 jendela per sisi.
- Ketinggian jendela: Y = 1.5 (dari dasar bangunan).
- Ukuran jendela: 1.0 × 1.2 unit.
- Jarak antar jendela dan dari pintu: minimal 0.5 unit.

## 5. Atap

- Selalu ada atap blocky (BoxGeometry tipis, lebar lebih dari badan, Y = tinggi bangunan).
- Overhang atap: 0.3–0.5 unit per sisi.

## 6. Validator

```ts
// BuildingSpec — tipe data
export interface BuildingSpec {
  type: string;
  position: [number, number, number];  // pusat bawah bangunan
  facing: '+x' | '-x' | '+z' | '-z';  // arah fasad (ke jalan)
  width: number;
  depth: number;
  height: number;
}

// Kembalikan array pesan error; kosong = valid
export function validateBuilding(spec: BuildingSpec): string[] { ... }
```

## 7. Checklist QA Visual

- [ ] Pintu di tengah fasad, tidak melayang
- [ ] Jendela simetris, tidak keluar batas dinding
- [ ] Atap menutupi seluruh bangunan + overhang
- [ ] Fasad menghadap ke jalan (tidak membelakangi jalan)
- [ ] Tidak ada celah/gap antara dinding dan tanah
- [ ] Bangunan tidak saling menembus
