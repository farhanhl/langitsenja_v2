// Data misi — 5 teman yang harus ditemukan

export interface Mission {
  id: string;
  name: string;
  location: string;
  locationDesc: string;
  found: boolean;
  // posisi kasar di dunia — disesuaikan di Fase 1
  worldPos: [number, number, number];
}

export const MISSIONS: Mission[] = [
  {
    id: 'ariman',
    name: 'Ariman',
    location: 'Taman',
    locationDesc: 'Lagi duduk-duduk di taman deket air mancur.',
    found: false,
    worldPos: [20, 0, 20],
  },
  {
    id: 'putra',
    name: 'Putra',
    location: 'SMK TELESANDI',
    locationDesc: 'Nongkrong di depan sekolah kayaknya.',
    found: false,
    worldPos: [-40, 0, -30],
  },
  {
    id: 'ananda',
    name: 'Ananda',
    location: 'SMPN 11 BEKASI',
    locationDesc: 'Di sekitar SMPN 11, coba cari.',
    found: false,
    worldPos: [-60, 0, 10],
  },
  {
    id: 'zait',
    name: 'Zait',
    location: 'Konoha Mart',
    locationDesc: 'Keliatannya lagi belanja di minimarket.',
    found: false,
    worldPos: [10, 0, -20],
  },
  {
    id: 'mahardhika',
    name: 'Mahardhika',
    location: 'Danau',
    locationDesc: 'Biasanya main di pinggir danau.',
    found: false,
    worldPos: [60, 0, 60],
  },
];
