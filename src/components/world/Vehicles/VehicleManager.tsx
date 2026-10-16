'use client';

import Motorcycle from './Motorcycle';
import Car from './Car';
import TrafficAi from './TrafficAi';

export default function VehicleManager() {
  return (
    <group>
      {/* ─── Kendaraan Drivable (Bisa Dinaiki) ─── */}
      {/* Motor 1: Depan Minimarket Konoha Mart */}
      <Motorcycle
        id="motor-konoha"
        initialPosition={[6, 0.8, -12]}
        initialRotationY={Math.PI / 2}
        color="#E74C3C"
      />

      {/* Motor 2: Dekat Taman Air Mancur */}
      <Motorcycle
        id="motor-taman"
        initialPosition={[14, 0.8, 8]}
        initialRotationY={0}
        color="#16A085"
      />

      {/* Mobil 1: Depan Ruko Pusat Kota */}
      <Car
        id="car-ruko"
        initialPosition={[-16, 0.8, -15]}
        initialRotationY={Math.PI / 2}
        color="#2980B9"
      />

      {/* ─── Lalu Lintas AI Ambient ─── */}
      <TrafficAi />
    </group>
  );
}
