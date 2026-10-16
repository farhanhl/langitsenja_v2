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

interface CarProps {
  id: string;
  initialPosition: [number, number, number];
  initialRotationY?: number;
  color?: string;
}

export default function Car({
  id,
  initialPosition,
  initialRotationY = 0,
  color = '#2980B9',
}: CarProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const visualRef = useRef<THREE.Group>(null);
  const frontLeftWheelRef = useRef<THREE.Mesh>(null);
  const frontRightWheelRef = useRef<THREE.Mesh>(null);
  const rearLeftWheelRef = useRef<THREE.Mesh>(null);
  const rearRightWheelRef = useRef<THREE.Mesh>(null);

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
      const steer = -input.moveX;

      updateVehicle(
        vehicleState.current,
        VEHICLE.CAR,
        throttle,
        steer,
        delta
      );

      // Update heading mobil
      headingRef.current += vehicleState.current.angularY * delta;

      // Hitung kecepatan horizontal
      const speed = vehicleState.current.velocityZ;
      const vx = Math.sin(headingRef.current) * speed;
      const vz = Math.cos(headingRef.current) * speed;

      const vy = rb.linvel().y;
      rb.setLinvel({ x: vx, y: vy, z: vz }, true);

      // Sinkronkan rotasi visual
      if (visualRef.current) {
        visualRef.current.rotation.y = headingRef.current;
      }

      // Animasi 4 roda berputar
      const wheelSpin = (speed * delta) / 0.4;
      if (frontLeftWheelRef.current) frontLeftWheelRef.current.rotation.x += wheelSpin;
      if (frontRightWheelRef.current) frontRightWheelRef.current.rotation.x += wheelSpin;
      if (rearLeftWheelRef.current) rearLeftWheelRef.current.rotation.x += wheelSpin;
      if (rearRightWheelRef.current) rearRightWheelRef.current.rotation.x += wheelSpin;

      // Update posisi pemain di store
      playerStore.setPosition(pos.x, pos.z);

      // Kamera dinamis mengikuti mobil (jarak lebih jauh)
      const camDist = 8.5;
      const camHeight = 4.2;
      const camTargetX = pos.x;
      const camTargetY = pos.y + 1.4;
      const camTargetZ = pos.z;

      const desiredCamX = pos.x - Math.sin(headingRef.current) * camDist;
      const desiredCamY = pos.y + camHeight;
      const desiredCamZ = pos.z - Math.cos(headingRef.current) * camDist;

      camera.position.lerp(new THREE.Vector3(desiredCamX, desiredCamY, desiredCamZ), delta * 5);
      camera.lookAt(camTargetX, camTargetY, camTargetZ);

      // Turun dari mobil jika menekan F
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

        const isNear = distSq <= 3.2 * 3.2;

        if (isNear) {
          if (!isNearRef.current) {
            isNearRef.current = true;
            uiStore.setPrompt({
              id,
              label: 'Naik Mobil (Tekan F)',
              type: 'vehicle',
            });
          }

          // Naik mobil jika menekan F
          if (consumeEnterExit()) {
            playerStore.setMode('driving', id);
            isNearRef.current = false;
            uiStore.setPrompt({
              id,
              label: 'Turun Mobil (Tekan F)',
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
      friction={0.5}
      restitution={0}
      type="dynamic"
    >
      <CuboidCollider args={[1.0, 0.75, 1.8]} position={[0, 0.75, 0]} />

      {/* Indikator Melayang Saat Dekat & Tidak Sedang Dinaiki */}
      {!isDrivingThis && (
        <Html position={[0, 2.2, 0]} center distanceFactor={16}>
          <div className="pointer-events-none select-none px-2 py-0.5 rounded bg-[#2980B9] text-white text-[11px] font-bold font-display shadow border border-[#1B4F72]">
            Mobil
          </div>
        </Html>
      )}

      {/* Model 3D Blocky Mobil */}
      <group ref={visualRef}>
        {/* Sasis & Bodi Bawah */}
        <mesh position={[0, 0.55, 0]} castShadow>
          <boxGeometry args={[1.9, 0.5, 3.6]} />
          <meshLambertMaterial color={color} />
        </mesh>

        {/* Kabin Atas / Rumah Kaca */}
        <mesh position={[0, 1.15, -0.2]} castShadow>
          <boxGeometry args={[1.6, 0.75, 2.0]} />
          <meshLambertMaterial color={color} />
        </mesh>

        {/* Kaca Depan Gelap */}
        <mesh position={[0, 1.15, 0.82]} castShadow>
          <boxGeometry args={[1.4, 0.55, 0.08]} />
          <meshLambertMaterial color="#1B2631" />
        </mesh>

        {/* Kaca Belakang Gelap */}
        <mesh position={[0, 1.15, -1.22]} castShadow>
          <boxGeometry args={[1.4, 0.55, 0.08]} />
          <meshLambertMaterial color="#1B2631" />
        </mesh>

        {/* Kaca Kiri & Kanan */}
        <mesh position={[-0.82, 1.15, -0.2]} castShadow>
          <boxGeometry args={[0.08, 0.5, 1.8]} />
          <meshLambertMaterial color="#1B2631" />
        </mesh>
        <mesh position={[0.82, 1.15, -0.2]} castShadow>
          <boxGeometry args={[0.08, 0.5, 1.8]} />
          <meshLambertMaterial color="#1B2631" />
        </mesh>

        {/* Lampu Depan Kuning Hangat */}
        <mesh position={[-0.65, 0.6, 1.81]} castShadow>
          <boxGeometry args={[0.35, 0.2, 0.08]} />
          <meshLambertMaterial color="#FFF3A8" emissive="#FFB347" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0.65, 0.6, 1.81]} castShadow>
          <boxGeometry args={[0.35, 0.2, 0.08]} />
          <meshLambertMaterial color="#FFF3A8" emissive="#FFB347" emissiveIntensity={0.6} />
        </mesh>

        {/* Lampu Belakang Merah */}
        <mesh position={[-0.65, 0.6, -1.81]} castShadow>
          <boxGeometry args={[0.35, 0.2, 0.08]} />
          <meshLambertMaterial color="#C0392B" />
        </mesh>
        <mesh position={[0.65, 0.6, -1.81]} castShadow>
          <boxGeometry args={[0.35, 0.2, 0.08]} />
          <meshLambertMaterial color="#C0392B" />
        </mesh>

        {/* 4 Roda Mobil */}
        <mesh ref={frontLeftWheelRef} position={[-0.95, 0.35, 1.1]} castShadow>
          <boxGeometry args={[0.25, 0.7, 0.7]} />
          <meshLambertMaterial color="#2C3E50" />
        </mesh>
        <mesh ref={frontRightWheelRef} position={[0.95, 0.35, 1.1]} castShadow>
          <boxGeometry args={[0.25, 0.7, 0.7]} />
          <meshLambertMaterial color="#2C3E50" />
        </mesh>
        <mesh ref={rearLeftWheelRef} position={[-0.95, 0.35, -1.1]} castShadow>
          <boxGeometry args={[0.25, 0.7, 0.7]} />
          <meshLambertMaterial color="#2C3E50" />
        </mesh>
        <mesh ref={rearRightWheelRef} position={[0.95, 0.35, -1.1]} castShadow>
          <boxGeometry args={[0.25, 0.7, 0.7]} />
          <meshLambertMaterial color="#2C3E50" />
        </mesh>

        {/* Siluet Pengendara di Balik Kaca Saat Dinaiki */}
        {isDrivingThis && (
          <group position={[-0.35, 1.05, 0]}>
            <mesh position={[0, 0.2, 0]}>
              <boxGeometry args={[0.4, 0.4, 0.4]} />
              <meshLambertMaterial color="#FFD1A4" />
            </mesh>
            <mesh position={[0, -0.2, 0]}>
              <boxGeometry args={[0.5, 0.4, 0.3]} />
              <meshLambertMaterial color="#2980B9" />
            </mesh>
          </group>
        )}
      </group>
    </RigidBody>
  );
}
