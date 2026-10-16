'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, type RapierRigidBody } from '@react-three/rapier';
import { getInputState } from '@/hooks/useKeyboard';
import { usePlayerStore } from '@/store/playerStore';
import { useGameStore } from '@/store/gameStore';

const WALK_SPEED = 5.0;
const SPRINT_SPEED = 8.5;
const JUMP_FORCE = 5.5;

export default function Player() {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const visualRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  const { camera, gl } = useThree();

  // Mouse orbit camera state
  const cameraAngleRef = useRef({
    yaw: 0,       // rotasi horizontal (radian)
    pitch: 0.25,  // rotasi vertikal (radian)
    distance: 5.5,
  });

  const isMouseDownRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  // Mouse drag & wheel listener untuk third person camera
  useEffect(() => {
    const canvas = gl.domElement;

    const onMouseDown = (e: MouseEvent) => {
      // Tombol kiri atau kanan mouse untuk putar kamera
      if (e.button === 0 || e.button === 2) {
        isMouseDownRef.current = true;
        prevMousePosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDownRef.current) return;
      const dx = e.clientX - prevMousePosRef.current.x;
      const dy = e.clientY - prevMousePosRef.current.y;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };

      const SENSITIVITY = 0.005;
      cameraAngleRef.current.yaw -= dx * SENSITIVITY;
      cameraAngleRef.current.pitch = THREE.MathUtils.clamp(
        cameraAngleRef.current.pitch + dy * SENSITIVITY,
        -0.2, // batas pandang ke atas
        0.8   // batas pandang ke bawah
      );
    };

    const onMouseUp = () => {
      isMouseDownRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraAngleRef.current.distance = THREE.MathUtils.clamp(
        cameraAngleRef.current.distance + e.deltaY * 0.005,
        3.0,
        12.0
      );
    };

    const onContextMenu = (e: MouseEvent) => e.preventDefault();

    // ─── Kontrol Kamera Sentuh (Mobile Touch Orbit & Pinch Zoom) ───
    let touchStartDist = 0;
    let lastTouchX = 0;
    let lastTouchY = 0;
    let isCameraTouching = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        // 1 jari: orbit kamera
        const t = e.touches[0];
        lastTouchX = t.clientX;
        lastTouchY = t.clientY;
        isCameraTouching = true;
      } else if (e.touches.length === 2) {
        // 2 jari: pinch to zoom
        isCameraTouching = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isCameraTouching) {
        const t = e.touches[0];
        const dx = t.clientX - lastTouchX;
        const dy = t.clientY - lastTouchY;
        lastTouchX = t.clientX;
        lastTouchY = t.clientY;

        const TOUCH_SENSITIVITY = 0.006;
        cameraAngleRef.current.yaw -= dx * TOUCH_SENSITIVITY;
        cameraAngleRef.current.pitch = THREE.MathUtils.clamp(
          cameraAngleRef.current.pitch + dy * TOUCH_SENSITIVITY,
          -0.2,
          0.8
        );
      } else if (e.touches.length === 2 && touchStartDist > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const newDist = Math.sqrt(dx * dx + dy * dy);
        const deltaDist = touchStartDist - newDist;
        touchStartDist = newDist;

        cameraAngleRef.current.distance = THREE.MathUtils.clamp(
          cameraAngleRef.current.distance + deltaDist * 0.02,
          3.0,
          12.0
        );
      }
    };

    const onTouchEnd = () => {
      isCameraTouching = false;
      touchStartDist = 0;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('contextmenu', onContextMenu);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('contextmenu', onContextMenu);
      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [gl]);

  // Sync game phase on mount
  useEffect(() => {
    if (useGameStore.getState().phase === 'menu') {
      useGameStore.getState().startGame();
    }
  }, []);

  const walkCycleRef = useRef(0);
  const syncPosCounterRef = useRef(0);

  useFrame((_, delta) => {
    const rb = rigidBodyRef.current;
    if (!rb) return;

    const input = getInputState();
    const playerStore = usePlayerStore.getState();

    // Jika sedang mengendarai kendaraan, nonaktifkan kontrol player mandiri
    if (playerStore.mode === 'driving') {
      // Sinkronkan posisi RigidBody pemain ke posisi kendaraan
      rb.setTranslation(
        { x: playerStore.posX + 1.2, y: 1.0, z: playerStore.posZ },
        true
      );
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    const buff = playerStore.buff;

    // Hitung kecepatan dasar
    const baseSpeed = input.sprint ? SPRINT_SPEED : WALK_SPEED;
    const currentSpeed = baseSpeed * (buff.type ? buff.multiplier : 1.0);

    // Ambil sudut pandang kamera (yaw) untuk orientasi gerak
    const cameraYaw = cameraAngleRef.current.yaw;

    // Hitung vektor arah gerak berdasarkan input dan orientasi kamera
    const moveX = input.moveX; // -1: kiri, 1: kanan
    const moveY = input.moveY; // 1: maju, -1: mundur

    let desiredDirX = 0;
    let desiredDirZ = 0;

    const isMoving = Math.abs(moveX) > 0.01 || Math.abs(moveY) > 0.01;

    if (isMoving) {
      // Orientasi relatif kamera
      const forwardX = -Math.sin(cameraYaw);
      const forwardZ = -Math.cos(cameraYaw);
      const rightX = Math.cos(cameraYaw);
      const rightZ = -Math.sin(cameraYaw);

      desiredDirX = forwardX * moveY + rightX * moveX;
      desiredDirZ = forwardZ * moveY + rightZ * moveX;

      // Normalisasi
      const len = Math.hypot(desiredDirX, desiredDirZ);
      if (len > 0.001) {
        desiredDirX /= len;
        desiredDirZ /= len;
      }
    }

    // Ambil velocity rapier saat ini
    const curVel = rb.linvel();
    let vy = curVel.y;

    // Deteksi lompat (hanya jika sedang di tanah / vy mendekati 0)
    if (input.jump && Math.abs(vy) < 0.25) {
      vy = JUMP_FORCE;
    }

    // Terapkan kecepatan horizontal
    const vx = isMoving ? desiredDirX * currentSpeed : 0;
    const vz = isMoving ? desiredDirZ * currentSpeed : 0;

    rb.setLinvel({ x: vx, y: vy, z: vz }, true);

    const pos = rb.translation();

    // Rotasi model karakter menghadap arah gerak
    if (visualRef.current && isMoving) {
      const targetAngle = Math.atan2(desiredDirX, desiredDirZ);
      const curRot = visualRef.current.rotation.y;
      // Interpolasi slerp sederhana untuk rotasi halus
      const diff = Math.atan2(Math.sin(targetAngle - curRot), Math.cos(targetAngle - curRot));
      visualRef.current.rotation.y += diff * Math.min(1, delta * 12);
    }

    // Animasi ayunan tangan & kaki serta langkah naik-turun saat berjalan
    if (isMoving) {
      walkCycleRef.current += delta * (input.sprint ? 14 : 9);
      const legAngle = Math.sin(walkCycleRef.current) * 0.6;
      const armAngle = -Math.sin(walkCycleRef.current) * 0.5;

      if (leftLegRef.current) leftLegRef.current.rotation.x = legAngle;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legAngle;
      if (leftArmRef.current) leftArmRef.current.rotation.x = armAngle;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -armAngle;
      if (visualRef.current) visualRef.current.position.y = Math.abs(Math.sin(walkCycleRef.current)) * 0.08;
    } else {
      // Kembali ke posisi diam
      if (leftLegRef.current) leftLegRef.current.rotation.x *= 0.85;
      if (rightLegRef.current) rightLegRef.current.rotation.x *= 0.85;
      if (leftArmRef.current) leftArmRef.current.rotation.x *= 0.85;
      if (rightArmRef.current) rightArmRef.current.rotation.x *= 0.85;
      if (visualRef.current) visualRef.current.position.y *= 0.85;
    }

    // Update kamera third person mengikuti pemain dengan lerp yang halus
    const { yaw, pitch, distance } = cameraAngleRef.current;
    const targetX = pos.x;
    const targetY = pos.y + 1.2; // fokus di dada/kepala karakter
    const targetZ = pos.z;

    const camX = targetX + Math.sin(yaw) * Math.cos(pitch) * distance;
    const camY = targetY + Math.sin(pitch) * distance + 0.8;
    const camZ = targetZ + Math.cos(yaw) * Math.cos(pitch) * distance;

    camera.position.lerp(new THREE.Vector3(camX, Math.max(camY, pos.y + 0.5), camZ), Math.min(1, delta * 12));
    camera.lookAt(targetX, targetY, targetZ);

    // Sync posisi ke playerStore tiap 5 frame untuk hemat re-render
    syncPosCounterRef.current++;
    if (syncPosCounterRef.current >= 5) {
      syncPosCounterRef.current = 0;
      playerStore.setPosition(pos.x, pos.z);
      playerStore.checkBuff();
    }
  });

  const isDriving = usePlayerStore((s) => s.mode === 'driving');

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      position={[0, 2.0, 5]}
      enabledRotations={[false, false, false]}
      friction={0}
      restitution={0}
      linearDamping={0.5}
      canSleep={false}
      type="dynamic"
    >
      <CapsuleCollider args={[0.55, 0.35]} position={[0, 0.9, 0]} friction={0} />

      {/* Visual Model Karakter Blocky (sembunyikan saat mengendarai) */}
      <group ref={visualRef} position={[0, 0, 0]} visible={!isDriving}>
        {/* Kepala */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[0.45, 0.45, 0.45]} />
          <meshLambertMaterial color="#FFD1A4" />
        </mesh>

        {/* Rambut Blocky */}
        <mesh position={[0, 1.7, -0.02]} castShadow>
          <boxGeometry args={[0.48, 0.2, 0.48]} />
          <meshLambertMaterial color="#2B1D14" />
        </mesh>

        {/* Badan (Kemeja Santai Biru) */}
        <mesh position={[0, 0.95, 0]} castShadow>
          <boxGeometry args={[0.55, 0.65, 0.35]} />
          <meshLambertMaterial color="#2980B9" />
        </mesh>

        {/* Lengan Kiri */}
        <mesh ref={leftArmRef} position={[-0.38, 0.95, 0]} castShadow>
          <boxGeometry args={[0.18, 0.6, 0.2]} />
          <meshLambertMaterial color="#3498DB" />
        </mesh>

        {/* Lengan Kanan */}
        <mesh ref={rightArmRef} position={[0.38, 0.95, 0]} castShadow>
          <boxGeometry args={[0.18, 0.6, 0.2]} />
          <meshLambertMaterial color="#3498DB" />
        </mesh>

        {/* Kaki Kiri (Celana Gelap) */}
        <mesh ref={leftLegRef} position={[-0.16, 0.35, 0]} castShadow>
          <boxGeometry args={[0.22, 0.65, 0.25]} />
          <meshLambertMaterial color="#2C3E50" />
        </mesh>

        {/* Kaki Kanan (Celana Gelap) */}
        <mesh ref={rightLegRef} position={[0.16, 0.35, 0]} castShadow>
          <boxGeometry args={[0.22, 0.65, 0.25]} />
          <meshLambertMaterial color="#2C3E50" />
        </mesh>

        {/* Sepatu Kiri */}
        <mesh position={[-0.16, 0.05, 0.04]} castShadow>
          <boxGeometry args={[0.23, 0.12, 0.32]} />
          <meshLambertMaterial color="#ECECEC" />
        </mesh>

        {/* Sepatu Kanan */}
        <mesh position={[0.16, 0.05, 0.04]} castShadow>
          <boxGeometry args={[0.23, 0.12, 0.32]} />
          <meshLambertMaterial color="#ECECEC" />
        </mesh>
      </group>
    </RigidBody>
  );
}
