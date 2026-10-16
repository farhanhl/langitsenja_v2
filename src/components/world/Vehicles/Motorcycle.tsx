'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { RigidBody, CuboidCollider, type RapierRigidBody } from '@react-three/rapier';
import { updateVehicle, type VehicleState } from '@/game/vehicleController';
import { VEHICLE } from '@/game/constants';
import { getInputState, consumeEnterExit } from '@/hooks/useKeyboard';
import { usePlayerStore } from '@/store/playerStore';
import { useUiStore } from '@/store/uiStore';

interface MotorcycleProps {
  id: string;
  initialPosition: [number, number, number];
  initialRotationY?: number;
  color?: string;
}

export default function Motorcycle({
  id,
  initialPosition,
  initialRotationY = 0,
  color = '#E74C3C',
}: MotorcycleProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const visualRef = useRef<THREE.Group>(null);
  const frontWheelRef = useRef<THREE.Mesh>(null);
  const backWheelRef = useRef<THREE.Mesh>(null);
  const handlebarRef = useRef<THREE.Group>(null);

  const { camera } = useThree();

  const vehicleState = useRef<VehicleState>({
    velocityZ: 0,
    angularY: 0,
  });

  const headingRef = useRef(initialRotationY);
  const isNearRef = useRef(false);

  useFrame((_, delta) => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    const playerStore = usePlayerStore.getState();
    const uiStore = useUiStore.getState();
    const isDriving = playerStore.mode === 'driving' && playerStore.currentVehicleId === id;

    const pos = rb.translation();

    // 1. Jika SEDANG DIKENDARAI
    if (isDriving) {
      const input = getInputState();

      // Gas: moveY (1: maju, -1: rem/mundur)
      // Belok: moveX (-1: kiri, 1: kanan)
      const throttle = input.moveY;
      const steer = -input.moveX; // belok

      updateVehicle(
        vehicleState.current,
        VEHICLE.MOTOR,
        throttle,
        steer,
        delta
      );

      // Update orientasi/heading motor
      headingRef.current += vehicleState.current.angularY * delta;

      // Hitung vektor kecepatan horizontal
      const speed = vehicleState.current.velocityZ;
      const vx = Math.sin(headingRef.current) * speed;
      const vz = Math.cos(headingRef.current) * speed;

      // Ambil kecepatan vertikal untuk gravitasi
      const vy = rb.linvel().y;
      rb.setLinvel({ x: vx, y: vy, z: vz }, true);

      // Sinkronkan rotasi visual
      if (visualRef.current) {
        visualRef.current.rotation.y = headingRef.current;
        // Efek miring (lean) saat berbelok
        const leanAngle = THREE.MathUtils.clamp(
          -vehicleState.current.angularY * 0.25,
          -0.35,
          0.35
        );
        visualRef.current.rotation.z = leanAngle;
      }

      // Animasi roda berputar
      const wheelSpin = (speed * delta) / 0.35;
      if (frontWheelRef.current) frontWheelRef.current.rotation.x += wheelSpin;
      if (backWheelRef.current) backWheelRef.current.rotation.x += wheelSpin;
      if (handlebarRef.current) {
        handlebarRef.current.rotation.y = steer * 0.3;
      }

      // Update posisi pemain di store
      playerStore.setPosition(pos.x, pos.z);

      // Kamera dinamis mengikuti motor
      const camDist = 6.0;
      const camHeight = 3.0;
      const camTargetX = pos.x;
      const camTargetY = pos.y + 1.2;
      const camTargetZ = pos.z;

      // Kamera di belakang motor sesuai arah heading
      const desiredCamX = pos.x - Math.sin(headingRef.current) * camDist;
      const desiredCamY = pos.y + camHeight;
      const desiredCamZ = pos.z - Math.cos(headingRef.current) * camDist;

      camera.position.lerp(new THREE.Vector3(desiredCamX, desiredCamY, desiredCamZ), delta * 6);
      camera.lookAt(camTargetX, camTargetY, camTargetZ);

      // Turun dari motor jika menekan F
      if (consumeEnterExit()) {
        playerStore.setMode('walking', null);
        uiStore.setPrompt(null);
      }
    } else {
      // 2. Jika SEDANG PARKIR — Cek jarak dengan pemain yang sedang jalan
      if (playerStore.mode === 'walking') {
        const dx = playerStore.posX - pos.x;
        const dz = playerStore.posZ - pos.z;
        const distSq = dx * dx + dz * dz;

        const isNear = distSq <= 2.5 * 2.5;

        if (isNear) {
          if (!isNearRef.current) {
            isNearRef.current = true;
            uiStore.setPrompt({
              id,
              label: 'Naik Motor (Tekan F)',
              type: 'vehicle',
            });
          }

          // Naik motor jika menekan F
          if (consumeEnterExit()) {
            playerStore.setMode('driving', id);
            isNearRef.current = false;
            uiStore.setPrompt({
              id,
              label: 'Turun Motor (Tekan F)',
              type: 'vehicle',
            });
          }
        } else {
          if (isNearRef.current) {
            isNearRef.current = false;
            if (uiStore.activePrompt?.id === id) {
              uiStore.setPrompt(null);
            }
          }
        }
      }

      // Rem saat parkir
      rb.setLinvel({ x: 0, y: rb.linvel().y, z: 0 }, true);
    }
  });

  const isDrivingThis = usePlayerStore(
    (s) => s.mode === 'driving' && s.currentVehicleId === id
  );

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      position={initialPosition}
      enabledRotations={[false, false, false]}
      friction={0.4}
      restitution={0}
      type="dynamic"
    >
      <CuboidCollider args={[0.4, 0.6, 1.0]} position={[0, 0.6, 0]} />

      {/* Indikator Melayang Saat Dekat & Tidak Sedang Dinaiki */}
      {!isDrivingThis && (
        <Html position={[0, 1.8, 0]} center distanceFactor={15}>
          <div className="pointer-events-none select-none px-2 py-0.5 rounded bg-[#E8743B] text-white text-[11px] font-bold font-display shadow border border-[#C0392B]">
            Motor
          </div>
        </Html>
      )}

      {/* Model 3D Blocky Sepeda Motor */}
      <group ref={visualRef}>
        {/* Rangka Bodi Utama */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[0.35, 0.45, 1.4]} />
          <meshLambertMaterial color={color} />
        </mesh>

        {/* Tangki / Sayap Depan */}
        <mesh position={[0, 0.75, 0.3]} castShadow>
          <boxGeometry args={[0.38, 0.35, 0.6]} />
          <meshLambertMaterial color={color} />
        </mesh>

        {/* Jok Panjang Hitam */}
        <mesh position={[0, 0.8, -0.2]} castShadow>
          <boxGeometry args={[0.32, 0.15, 0.85]} />
          <meshLambertMaterial color="#222" />
        </mesh>

        {/* Lampu Depan Menyala Kuning Senja */}
        <mesh position={[0, 0.85, 0.62]} castShadow>
          <boxGeometry args={[0.2, 0.18, 0.1]} />
          <meshLambertMaterial color="#FFF3A8" emissive="#FFB347" emissiveIntensity={0.6} />
        </mesh>

        {/* Lampu Belakang Merah */}
        <mesh position={[0, 0.75, -0.65]} castShadow>
          <boxGeometry args={[0.18, 0.12, 0.08]} />
          <meshLambertMaterial color="#E74C3C" />
        </mesh>

        {/* Knalpot Blocky */}
        <mesh position={[0.22, 0.35, -0.3]} castShadow>
          <boxGeometry args={[0.1, 0.1, 0.8]} />
          <meshLambertMaterial color="#7F8C8D" />
        </mesh>

        {/* Stang Motor */}
        <group ref={handlebarRef} position={[0, 1.05, 0.4]}>
          <mesh castShadow>
            <boxGeometry args={[0.7, 0.06, 0.06]} />
            <meshLambertMaterial color="#333" />
          </mesh>
          <mesh position={[-0.32, 0, 0]}>
            <boxGeometry args={[0.1, 0.08, 0.08]} />
            <meshLambertMaterial color="#111" />
          </mesh>
          <mesh position={[0.32, 0, 0]}>
            <boxGeometry args={[0.1, 0.08, 0.08]} />
            <meshLambertMaterial color="#111" />
          </mesh>
        </group>

        {/* Roda Depan */}
        <mesh ref={frontWheelRef} position={[0, 0.35, 0.65]} castShadow>
          <boxGeometry args={[0.15, 0.7, 0.7]} />
          <meshLambertMaterial color="#2C3E50" />
        </mesh>

        {/* Roda Belakang */}
        <mesh ref={backWheelRef} position={[0, 0.35, -0.55]} castShadow>
          <boxGeometry args={[0.18, 0.7, 0.7]} />
          <meshLambertMaterial color="#2C3E50" />
        </mesh>

        {/* Karakter Pengendara Duduk Saat Dinaiki */}
        {isDrivingThis && (
          <group position={[0, 0.75, -0.05]}>
            {/* Torso Duduk */}
            <mesh position={[0, 0.55, 0]} castShadow>
              <boxGeometry args={[0.45, 0.55, 0.3]} />
              <meshLambertMaterial color="#2980B9" />
            </mesh>
            {/* Kepala + Helm Blocky */}
            <mesh position={[0, 1.0, 0.05]} castShadow>
              <boxGeometry args={[0.4, 0.4, 0.4]} />
              <meshLambertMaterial color="#F39C12" />
            </mesh>
            {/* Kaca Helm */}
            <mesh position={[0, 1.0, 0.23]} castShadow>
              <boxGeometry args={[0.3, 0.15, 0.08]} />
              <meshLambertMaterial color="#111" />
            </mesh>
            {/* Lengan Pegang Stang */}
            <mesh position={[-0.26, 0.5, 0.2]} rotation={[0.4, 0, 0]} castShadow>
              <boxGeometry args={[0.12, 0.45, 0.12]} />
              <meshLambertMaterial color="#3498DB" />
            </mesh>
            <mesh position={[0.26, 0.5, 0.2]} rotation={[0.4, 0, 0]} castShadow>
              <boxGeometry args={[0.12, 0.45, 0.12]} />
              <meshLambertMaterial color="#3498DB" />
            </mesh>
            {/* Kaki Duduk */}
            <mesh position={[-0.2, 0.1, 0.15]} rotation={[0.5, 0, 0]} castShadow>
              <boxGeometry args={[0.16, 0.5, 0.18]} />
              <meshLambertMaterial color="#2C3E50" />
            </mesh>
            <mesh position={[0.2, 0.1, 0.15]} rotation={[0.5, 0, 0]} castShadow>
              <boxGeometry args={[0.16, 0.5, 0.18]} />
              <meshLambertMaterial color="#2C3E50" />
            </mesh>
          </group>
        )}
      </group>
    </RigidBody>
  );
}
