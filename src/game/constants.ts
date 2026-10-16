// Konstanta game Langit Senja

export const GAME = {
  MISSION_TIME: 10 * 60, // 10 menit dalam detik
  FRIENDS_NEEDED: 5,
  INTERACTION_RADIUS: 2.5, // unit
} as const;

export const WORLD = {
  SIZE: 300, // 300x300 unit
  ROAD_WIDTH: 8, // 2 jalur
  SIDEWALK_WIDTH: 2,
  PLAYER_HEIGHT: 1.8,
} as const;

export const VEHICLE = {
  MOTOR: {
    maxSpeed: 12,
    accel: 6,
    brake: 8,
    turnRate: 2.0,
    friction: 0.92,
  },
  CAR: {
    maxSpeed: 9,
    accel: 4,
    brake: 6,
    turnRate: 1.4,
    friction: 0.94,
  },
} as const;

export const PALETTE = {
  skyOrange: '#E8743B',
  skyDeep: '#C0392B',
  skyPurple: '#9B59B6',
  groundBeige: '#C8A96E',
  roadGray: '#4A4A4A',
  sidewalkLight: '#8C7B5E',
  roofRed: '#A23B2A',
  wallCream: '#F5E9D3',
  wallWhite: '#ECECEC',
  treeTrunk: '#7B5E3A',
  treeLeaf: '#4F7A3A',
  grassGreen: '#5A8C40',
  waterBlue: '#2980B9',
  uiOrange: '#E8743B',
  uiBrick: '#A23B2A',
  uiCream: '#F5E9D3',
  uiDark: '#2B1D14',
  uiLeaf: '#4F7A3A',
  uiYellow: '#F2B632',
} as const;
