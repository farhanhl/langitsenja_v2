// Arcade vehicle controller — logika murni, tanpa React
// Input → gerak (velocityZ, angularY)
// Pisahkan dari visual (Motorcycle.tsx/Car.tsx) agar upgrade fisika nanti mudah

export interface VehicleParams {
  maxSpeed: number;
  accel: number;
  brake: number;
  turnRate: number;
  friction: number; // 0..1, tiap frame: vel *= friction
}

export interface VehicleState {
  velocityZ: number; // unit/s, maju = positif
  angularY: number;  // rad/s, belok
}

/**
 * Update vehicle state berdasarkan input dan delta time.
 * @param state    mutable state (diubah in-place)
 * @param params   parameter kendaraan
 * @param throttle -1..1 (gas positif, rem/mundur negatif)
 * @param steer    -1..1 (kiri negatif, kanan positif)
 * @param dt       delta time detik
 */
export function updateVehicle(
  state: VehicleState,
  params: VehicleParams,
  throttle: number,
  steer: number,
  dt: number
): void {
  // Gas & rem
  if (throttle > 0) {
    state.velocityZ += throttle * params.accel * dt;
  } else if (throttle < 0) {
    state.velocityZ += throttle * params.brake * dt;
  }

  // Clamp kecepatan
  state.velocityZ = Math.max(
    -params.maxSpeed * 0.4, // mundur lebih lambat
    Math.min(params.maxSpeed, state.velocityZ)
  );

  // Belok proporsional kecepatan (tidak bisa belok saat diam)
  const speedFactor = Math.abs(state.velocityZ) / params.maxSpeed;
  state.angularY = steer * params.turnRate * speedFactor;

  // Gesekan / deselerasi alami
  state.velocityZ *= params.friction;
  if (Math.abs(state.velocityZ) < 0.01) state.velocityZ = 0;
}
