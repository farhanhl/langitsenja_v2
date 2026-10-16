// Sistem rute jalan (waypoints) untuk pedagang keliling dan NPC

export interface Waypoint {
  x: number;
  z: number;
  pauseDuration?: number; // detik berhenti di titik ini
}

export const VENDOR_ROUTES: Record<string, Waypoint[]> = {
  // Rute 1: Tukang Bakso di permukiman
  'permukiman-loop': [
    { x: -20, z: 15, pauseDuration: 10 },
    { x: -20, z: 35, pauseDuration: 12 },
    { x: -35, z: 35, pauseDuration: 10 },
    { x: -35, z: 15, pauseDuration: 14 },
    { x: -20, z: 15, pauseDuration: 10 },
  ],

  // Rute 2: Tukang Es Krim dari taman ke depan sekolah
  'taman-sekolah': [
    { x: 18, z: 15, pauseDuration: 12 },
    { x: 5, z: 15, pauseDuration: 8 },
    { x: 5, z: -15, pauseDuration: 10 },
    { x: -25, z: -15, pauseDuration: 14 },
    { x: -35, z: -25, pauseDuration: 15 }, // depan SMK TELESANDI
    { x: -25, z: -15, pauseDuration: 8 },
    { x: 5, z: -15, pauseDuration: 10 },
    { x: 18, z: 15, pauseDuration: 12 },
  ],

  // Rute 3: Tukang Siomay di pusat kota & minimarket
  'pusat-kota': [
    { x: 5, z: -8, pauseDuration: 10 },
    { x: 15, z: -15, pauseDuration: 14 }, // depan Konoha Mart
    { x: 20, z: -25, pauseDuration: 10 },
    { x: -5, z: -25, pauseDuration: 8 },
    { x: -10, z: -12, pauseDuration: 12 },
    { x: 5, z: -8, pauseDuration: 10 },
  ],

  // Rute 4: Tukang Sate di dekat lapangan & danau
  'lapangan': [
    { x: 60, z: -25, pauseDuration: 14 }, // dekat lapangan olahraga
    { x: 70, z: -15, pauseDuration: 12 },
    { x: 65, z: 20, pauseDuration: 10 },
    { x: 50, z: 45, pauseDuration: 15 }, // arah danau
    { x: 60, z: -25, pauseDuration: 14 },
  ],
};
