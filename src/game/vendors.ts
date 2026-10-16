// Data vendor keliling

export interface VendorItem {
  id: string;
  name: string;
  price: number; // Rupiah
  effect: 'sprint_boost' | 'hint' | 'sprint_and_hint' | 'none';
  effectDuration?: number; // detik, untuk buff
  effectDesc: string;
}

export interface Vendor {
  id: string;
  name: string;
  type: 'bakso' | 'eskrim' | 'siomay' | 'sate';
  menu: VendorItem[];
  route: string; // nama rute dari npcPaths
  soundCue: string; // nama file audio
  speed: number; // unit/detik
  stopDuration: [number, number]; // [min, max] detik
}

export const VENDORS: Vendor[] = [
  {
    id: 'bakso-1',
    name: 'Tukang Bakso',
    type: 'bakso',
    route: 'permukiman-loop',
    soundCue: 'kentongan',
    speed: 1.2,
    stopDuration: [8, 15],
    menu: [
      {
        id: 'bakso-biasa',
        name: 'Bakso Biasa',
        price: 10000,
        effect: 'sprint_boost',
        effectDuration: 30,
        effectDesc: 'Kecepatan lari +25% selama 30 detik',
      },
      {
        id: 'bakso-urat',
        name: 'Bakso Urat',
        price: 12000,
        effect: 'sprint_and_hint',
        effectDuration: 20,
        effectDesc: 'Sprint +20% & petunjuk samar lokasi teman',
      },
      {
        id: 'mi-ayam',
        name: 'Mi Ayam',
        price: 8000,
        effect: 'hint',
        effectDesc: 'Dapat petunjuk lokasi teman terdekat',
      },
    ],
  },
  {
    id: 'eskrim-1',
    name: 'Tukang Es Krim',
    type: 'eskrim',
    route: 'taman-sekolah',
    soundCue: 'bel-eskrim',
    speed: 1.0,
    stopDuration: [10, 20],
    menu: [
      {
        id: 'eskrim-coklat',
        name: 'Es Krim Coklat',
        price: 5000,
        effect: 'sprint_boost',
        effectDuration: 15,
        effectDesc: 'Seger! Sprint +15% selama 15 detik',
      },
      {
        id: 'es-potong',
        name: 'Es Potong',
        price: 3000,
        effect: 'none',
        effectDesc: 'Enak aja, nggak ada efek khusus 😄',
      },
    ],
  },
  {
    id: 'siomay-1',
    name: 'Tukang Siomay',
    type: 'siomay',
    route: 'pusat-kota',
    soundCue: 'teriak-siomay',
    speed: 1.1,
    stopDuration: [8, 12],
    menu: [
      {
        id: 'siomay',
        name: 'Siomay',
        price: 10000,
        effect: 'hint',
        effectDesc: 'Kata orang, sambil makan siomay suka dapet wangsit 😂',
      },
      {
        id: 'batagor',
        name: 'Batagor',
        price: 10000,
        effect: 'sprint_boost',
        effectDuration: 25,
        effectDesc: 'Kenyang, jadi kuat lari! Sprint +20% 25 detik',
      },
    ],
  },
  {
    id: 'sate-1',
    name: 'Tukang Sate',
    type: 'sate',
    route: 'lapangan',
    soundCue: 'teriak-sate',
    speed: 1.0,
    stopDuration: [10, 18],
    menu: [
      {
        id: 'sate-ayam',
        name: 'Sate Ayam (5 tusuk)',
        price: 20000,
        effect: 'sprint_and_hint',
        effectDuration: 40,
        effectDesc: 'Kenyang beneran! Sprint +30% & petunjuk teman',
      },
      {
        id: 'sate-kambing',
        name: 'Sate Kambing (5 tusuk)',
        price: 25000,
        effect: 'sprint_boost',
        effectDuration: 60,
        effectDesc: 'Paling nendang! Sprint +35% selama 1 menit',
      },
    ],
  },
];
